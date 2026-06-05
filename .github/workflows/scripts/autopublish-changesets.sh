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

# -------------------------------------------------------------------------------------
# Versions and publishes pending Changesets without relying on a third-party GitHub Action.
# -------------------------------------------------------------------------------------

set -euo pipefail

SCRIPT_LOCATION="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"
ROOT_DIRECTORY="$SCRIPT_LOCATION/../../.."

BRANCH=${BRANCH:-${GITHUB_REF_NAME:-}}
COMMIT_MESSAGE=${COMMIT_MESSAGE:-"chore: publish changeset"}
REMOTE=${REMOTE:-origin}
VERSION_SCRIPT=${VERSION_SCRIPT:-"pnpm run version:packages"}
PUBLISH_SCRIPT=${PUBLISH_SCRIPT:-"pnpm run publish:packages"}
BOT_USERNAME=${BOT_USERNAME:-"github-actions[bot]"}
BOT_EMAIL=${BOT_EMAIL:-"github-actions[bot]@users.noreply.github.com"}

write_output() {
    local key="$1"
    local value="$2"

    if [ -n "${GITHUB_OUTPUT:-}" ]; then
        echo "$key=$value" >> "$GITHUB_OUTPUT"
    fi
}

has_pending_changesets() {
    local changesetFile
    local changesetFileName

    shopt -s nullglob

    for changesetFile in .changeset/*.md; do
        changesetFileName="$(basename "$changesetFile")"

        if [ "$changesetFileName" != "README.md" ]; then
            return 0
        fi
    done

    return 1
}

collect_changed_packages() {
    node <<'NODE'
const { execSync } = require("child_process");
const fs = require("fs");

const changedFiles = execSync("git diff --name-only --diff-filter=AM -- ':(glob)**/package.json'", {
    encoding: "utf8"
})
    .split(/\r?\n/)
    .filter(Boolean);

const packages = [];
const seenPackages = new Set();

for (const packageFile of changedFiles) {
    const packageJson = JSON.parse(fs.readFileSync(packageFile, "utf8"));
    const packageName = packageJson.name;
    const packageVersion = packageJson.version;

    if (!packageName || !packageVersion || seenPackages.has(packageName)) {
        continue;
    }

    seenPackages.add(packageName);
    packages.push({
        name: packageName,
        version: packageVersion
    });
}

process.stdout.write(JSON.stringify(packages));
NODE
}

push_current_branch() {
    if git push "$REMOTE" "HEAD:refs/heads/$BRANCH"; then
        return 0
    fi

    echo "Branch moved before the version commit was pushed. Rebasing onto latest $BRANCH and retrying."

    git fetch "$REMOTE" "$BRANCH"
    git rebase "$REMOTE/$BRANCH"
    git push "$REMOTE" "HEAD:refs/heads/$BRANCH"
}

push_head_tags() {
    local tags
    local tag
    local tagRefs=()

    tags="$(git tag --points-at HEAD)"

    if [ -z "$tags" ]; then
        echo "No release tags found on HEAD."
        return 0
    fi

    while IFS= read -r tag; do
        tagRefs+=("refs/tags/$tag")
    done <<< "$tags"

    git push "$REMOTE" "${tagRefs[@]}"
}

cd "$ROOT_DIRECTORY"

if [ -z "$BRANCH" ]; then
    echo "Branch name is required. Set BRANCH or GITHUB_REF_NAME."
    exit 1
fi

if ! has_pending_changesets; then
    echo "No pending changesets found. Skipping package publish."
    write_output "hadChangesets" "false"
    write_output "publishedPackages" "[]"
    exit 0
fi

echo "Pending changesets found. Versioning packages."

git config user.name "$BOT_USERNAME"
git config user.email "$BOT_EMAIL"
git fetch "$REMOTE" "$BRANCH"
git checkout -B "$BRANCH" "$REMOTE/$BRANCH"

bash -c "$VERSION_SCRIPT"

PUBLISHED_PACKAGES="$(collect_changed_packages)"

if [ "$PUBLISHED_PACKAGES" = "[]" ]; then
    echo "Changesets were found, but no package version changes were detected."
fi

git add .

if git diff --cached --quiet; then
    echo "No versioning changes to commit."
else
    git commit -m "$COMMIT_MESSAGE"
    push_current_branch
fi

if [ "$PUBLISHED_PACKAGES" != "[]" ] && [ -n "$PUBLISH_SCRIPT" ]; then
    echo "Publishing packages: $PUBLISHED_PACKAGES"
    bash -c "$PUBLISH_SCRIPT"
    push_head_tags
fi

write_output "hadChangesets" "true"
write_output "publishedPackages" "$PUBLISHED_PACKAGES"
