#!/usr/bin/env bash

# -------------------------------------------------------------------------------------
#
# Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
#
# WSO2 LLC. licenses this file to you under the Apache License,
# Version 2.0 (the "License"); you may not use this file except
# in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied. See the License for the
# specific language governing permissions and limitations
# under the License.
#
# --------------------------------------------------------------------------------------
#
# Merges the release pull request opened by changesets/action.
#
# Usage: merge-release-pr.sh <pr-number> <merge-commit-subject>
#
# Requires GH_TOKEN in the environment and a checkout whose credentials can push to
# the base branch (actions/checkout with persist-credentials and fetch-depth: 0).
#
# The merge is done with git rather than "gh pr merge". The base branch requires an
# approving review, and the token that opens the release pull request is its author,
# so it can never approve it — the pull request merge API refuses with "the base
# branch policy prohibits the merge". Pushes from this token are not subject to that
# rule, which is how scripts/release.sh has always landed its release commits. Once
# the merge commit reaches the base branch GitHub marks the pull request as merged.
#
# A merge commit with an explicit subject is used rather than a squash. The commit on
# changeset-release/<branch> carries "[skip ci]"; a squash merge could carry that
# marker onto the base branch, and the follow-up Release run — the one that actually
# publishes — would never fire. This also matches the existing release history.
#
# Merging the release pull request is housekeeping: the packages are published by the
# follow-up run, not by this one. Failures are reported as annotations and exit
# non-zero so the step is visibly red, while "continue-on-error" on the step keeps the
# rest of the Release job running. A human can always merge the pull request by hand
# afterwards. Nothing to do — already merged, already contained — is a success.

set -euo pipefail

PR_NUMBER="${1:?pr number is required}"
SUBJECT="${2:?merge commit subject is required}"

MAX_ATTEMPTS=30
RETRY_INTERVAL=10
PUSH_ATTEMPTS=3

base_branch=""
head_branch=""

# GitHub computes mergeability asynchronously, so a pull request opened moments ago
# reports UNKNOWN. Poll until it settles rather than acting on a race.
#
# Only "mergeable" is consulted here, and deliberately so: it reports whether the two
# branches conflict, which is the one thing a git merge cannot work around.
# "mergeStateStatus" would report BLOCKED for the whole life of the pull request
# because of the review requirement described above, so waiting on it would be waiting
# for something that never happens.
mergeable=""

for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
    # A transient API error (rate limit, network blip) must not end the run: under
    # "set -e" a failing command substitution in a bare assignment would abort the
    # script, so capture the failure and fall through to the next attempt instead.
    if ! state=$(gh pr view "$PR_NUMBER" \
        --json mergeable,state,baseRefName,headRefName \
        --jq '[ .state, .mergeable, .baseRefName, .headRefName ] | @tsv' 2>&1); then
        echo "Attempt $attempt: could not query PR #$PR_NUMBER, retrying. Error: $state"
        mergeable=""
        sleep "$RETRY_INTERVAL"
        continue
    fi

    IFS=$'\t' read -r pr_state mergeable base_branch head_branch <<< "$state"

    echo "Attempt $attempt: PR #$PR_NUMBER is $pr_state / $mergeable ($head_branch -> $base_branch)"

    if [ "$pr_state" = "MERGED" ]; then
        echo "✅ PR #$PR_NUMBER is already merged. Nothing to do."
        exit 0
    fi

    if [ "$pr_state" = "CLOSED" ]; then
        echo "::error::PR #$PR_NUMBER is closed and cannot be merged."
        exit 1
    fi

    if [ "$mergeable" = "CONFLICTING" ]; then
        echo "::error::PR #$PR_NUMBER conflicts with $base_branch. Resolve the conflicts and merge it manually."
        exit 1
    fi

    if [ "$mergeable" = "MERGEABLE" ]; then
        break
    fi

    sleep "$RETRY_INTERVAL"
done

if [ "$mergeable" != "MERGEABLE" ]; then
    echo "::error::PR #$PR_NUMBER did not become mergeable within $((MAX_ATTEMPTS * RETRY_INTERVAL))s (last state: ${mergeable:-unknown}). Merge it manually."
    exit 1
fi

# Every git call below takes these names as operands. git itself rejects a branch
# whose name holds a space or starts with a dash, so neither field parsing nor option
# injection is reachable here — but this script pushes to a protected branch, so the
# assumption is enforced rather than relied upon.
if ! printf '%s' "$base_branch" | grep -Eq '^[A-Za-z0-9][A-Za-z0-9._/-]*$'; then
    echo "::error::PR #$PR_NUMBER has an unexpected base branch name. Refusing to merge it automatically."
    exit 1
fi

# This script pushes straight to the base branch, so it must only ever land the
# branch changesets/action maintains. The workflow derives the pull request number
# from that action, but the branches come back from the GitHub API, so the identity
# is checked here rather than assumed — a merge of anything else is a bug, not
# something to carry onto a protected branch under the release bot's authority.
expected_head="changeset-release/$base_branch"

if [ "$head_branch" != "$expected_head" ]; then
    echo "::error::PR #$PR_NUMBER merges $head_branch, not $expected_head. Refusing to merge it automatically."
    exit 1
fi

echo "Merging $head_branch into $base_branch for PR #$PR_NUMBER..."

# The base branch can move while this job runs, so the push is attempted against a
# freshly fetched tip and retried from scratch if it was overtaken in the meantime.
for attempt in $(seq 1 "$PUSH_ATTEMPTS"); do
    if ! git fetch origin "$base_branch" "$head_branch"; then
        echo "Attempt $attempt: could not fetch the branches, retrying."
        sleep "$RETRY_INTERVAL"
        continue
    fi

    # changesets/action leaves its version bump in the working tree; it is already
    # committed on the head branch, so discarding it here loses nothing. Untracked
    # files are left alone, since later steps still need the installed dependencies.
    #
    # Both are guarded: under "set -e" a nonzero exit here would end the script before
    # it could report anything, and a silent abort is exactly what this script is meant
    # not to do.
    if ! git checkout -B "$base_branch" "origin/$base_branch"; then
        echo "::error::Could not check out $base_branch. Merge PR #$PR_NUMBER manually."
        exit 1
    fi

    if ! git reset --hard "origin/$base_branch"; then
        echo "::error::Could not reset $base_branch to origin/$base_branch. Merge PR #$PR_NUMBER manually."
        exit 1
    fi

    if git merge-base --is-ancestor "origin/$head_branch" HEAD; then
        echo "✅ $head_branch is already contained in $base_branch. Nothing to do."
        exit 0
    fi

    if ! git merge --no-ff "origin/$head_branch" -m "$SUBJECT" -m ""; then
        git merge --abort || true
        echo "::error::Merging $head_branch into $base_branch conflicted. Merge PR #$PR_NUMBER manually."
        exit 1
    fi

    if git push origin "$base_branch"; then
        echo "✅ Merged PR #$PR_NUMBER into $base_branch."
        exit 0
    fi

    echo "Attempt $attempt: push to $base_branch was rejected, probably overtaken by another commit. Retrying."
    sleep "$RETRY_INTERVAL"
done

# A concurrent Release run, or a maintainer, may have merged it in the meantime.
if final_state=$(gh pr view "$PR_NUMBER" --json state --jq .state) \
    && [ "$final_state" = "MERGED" ]; then
    echo "✅ PR #$PR_NUMBER was merged by another run."
    exit 0
fi

echo "::error::Could not merge PR #$PR_NUMBER after $PUSH_ATTEMPTS attempts. Merge it manually."
exit 1
