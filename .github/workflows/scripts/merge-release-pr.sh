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
# Requires GH_TOKEN in the environment.
#
# A merge commit with an explicit subject is used rather than a squash. The commit
# on changeset-release/<branch> carries "[skip ci]"; a squash merge could carry that
# marker onto the base branch, and the follow-up Release run — the one that actually
# publishes — would never fire. This also matches the existing release history.

set -euo pipefail

PR_NUMBER="${1:?pr number is required}"
SUBJECT="${2:?merge commit subject is required}"

MAX_ATTEMPTS=30
RETRY_INTERVAL=10

mergeable=""

# GitHub computes mergeability asynchronously, so a pull request opened moments ago
# reports UNKNOWN. Poll until it settles rather than failing the run on a race.
for attempt in $(seq 1 "$MAX_ATTEMPTS"); do
    # A transient API error (rate limit, network blip) must not end the run: under
    # "set -e" a failing command substitution in a bare assignment would abort the
    # script, so capture the failure and fall through to the next attempt instead.
    if ! state=$(gh pr view "$PR_NUMBER" --json mergeable,state --jq '"\(.state) \(.mergeable)"' 2>&1); then
        echo "Attempt $attempt: could not query PR #$PR_NUMBER, retrying. Error: $state"
        mergeable=""
        sleep "$RETRY_INTERVAL"
        continue
    fi

    pr_state="${state%% *}"
    mergeable="${state##* }"

    echo "Attempt $attempt: PR #$PR_NUMBER is $pr_state / $mergeable"

    if [ "$pr_state" = "MERGED" ]; then
        echo "✅ PR #$PR_NUMBER is already merged. Nothing to do."
        exit 0
    fi

    if [ "$pr_state" = "CLOSED" ]; then
        echo "::error::PR #$PR_NUMBER is closed and cannot be merged."
        exit 1
    fi

    if [ "$mergeable" = "CONFLICTING" ]; then
        echo "::error::PR #$PR_NUMBER conflicts with the base branch. Resolve the conflicts and merge it manually."
        exit 1
    fi

    if [ "$mergeable" = "MERGEABLE" ]; then
        break
    fi

    sleep "$RETRY_INTERVAL"
done

if [ "$mergeable" != "MERGEABLE" ]; then
    echo "::error::PR #$PR_NUMBER did not become mergeable within $((MAX_ATTEMPTS * RETRY_INTERVAL))s (last state: ${mergeable:-unknown})."
    exit 1
fi

echo "Merging PR #$PR_NUMBER..."

if gh pr merge "$PR_NUMBER" --merge --subject "$SUBJECT" --body ""; then
    echo "✅ Merged PR #$PR_NUMBER."
    exit 0
fi

# A concurrent Release run, or a maintainer, may have merged it in the meantime.
if final_state=$(gh pr view "$PR_NUMBER" --json state --jq .state) \
    && [ "$final_state" = "MERGED" ]; then
    echo "✅ PR #$PR_NUMBER was merged by another run."
    exit 0
fi

echo "::error::Failed to merge PR #$PR_NUMBER."
exit 1
