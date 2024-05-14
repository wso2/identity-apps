#!/usr/bin/env bash

# -------------------------------------------------------------------------------------
#
# Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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
# This script is used to release the packages in the release workflow.
# -------------------------------------------------------------------------------------

SCRIPT_LOCATION="$(cd "$(dirname "${BASH_SOURCE[0]}")" &>/dev/null && pwd)"

# The packages to be released.
PACKAGES=$1
# The GitHub Action run number.
GITHUB_RUN_NUMBER=$2
# Variable to determine whether the current release is a hotfix
IS_HOTFIX=$3
# The release branch name.
RELEASE_BRANCH=release-action-$GITHUB_RUN_NUMBER

# Goes to the project root directory.
goToRootDirectory() {
    cd "$SCRIPT_LOCATION/../../../" || exit 1
}

process_console_package() {
    local releaseVersion="$1"

    if [ -z "$releaseVersion" ]; then
        echo "Please provide a release version as an argument."
        return 0
    fi

    if [ "$IS_HOTFIX" = "true" ]; then
        echo "Hotfix detected. Publishing the package as a hotfix."

        search_tag=$tag-hotfix
        echo "Search Tag: $search_tag"

        hotfix_count=$(git tag | grep $search_tag | wc -l)
        echo "Hotfix count: $hotfix_count"

        next_hotfix_no=$((hotfix_count + 1))
        echo "Next Hotfix number: $next_hotfix_no"

        releaseVersion=$search_tag-$next_hotfix_no
        echo "Hotfix release tag: $tag"
    fi

    goToRootDirectory &&
        cd "apps/console/java" || exit 1 &&
        echo "Releasing console version: $releaseVersion"

    mvn -Dresume=false \
        -Darguments='-Dadditionalparam=-Xdoclint:none' \
        -Dmaven.test.skip=true \
        release:prepare -B \
        -DreleaseVersion="$releaseVersion" \
        -DscmCommentPrefix="[WSO2 Release] [GitHub Action #$GITHUB_RUN_NUMBER] [Release] [skip ci] " &&
        mvn -Dresume=false \
            -Darguments='-Dadditionalparam=-Xdoclint:none' \
            -Dmaven.test.skip=true \
            release:perform -B \
            --settings ~/.m2/settings.xml \
            -P include-sources
}

process_myaccount_package() {
    local releaseVersion="$1"

    if [ -z "$releaseVersion" ]; then
        echo "Please provide a release version as an argument."
        return 0
    fi

    if [ "$IS_HOTFIX" = "true" ]; then
        echo "Hotfix detected. Publishing the package as a hotfix."

        search_tag=$tag-hotfix
        echo "Search Tag: $search_tag"

        hotfix_count=$(git tag | grep $search_tag | wc -l)
        echo "Hotfix count: $hotfix_count"

        next_hotfix_no=$((hotfix_count + 1))
        echo "Next Hotfix number: $next_hotfix_no"

        releaseVersion=$search_tag-$next_hotfix_no
        echo "Hotfix release tag: $tag"
    fi

    goToRootDirectory &&
        cd "apps/myaccount/java" || exit 1 &&
        echo "Releasing myaccount version: $releaseVersion"

    mvn -Dresume=false \
        -Darguments='-Dadditionalparam=-Xdoclint:none' \
        -Dmaven.test.skip=true \
        release:prepare -B \
        -DreleaseVersion="$releaseVersion" \
        -DscmCommentPrefix="[WSO2 Release] [GitHub Action #$GITHUB_RUN_NUMBER] [Release] [skip ci] " &&
        mvn -Dresume=false \
            -Darguments='-Dadditionalparam=-Xdoclint:none' \
            -Dmaven.test.skip=true \
            release:perform -B \
            --settings ~/.m2/settings.xml \
            -P include-sources
}

process_java_apps_package() {
    local releaseVersion="$1"

    if [ -z "$releaseVersion" ]; then
        echo "Please provide a release version as an argument."
        return 0
    fi

    if [ "$IS_HOTFIX" = "true" ]; then
        echo "Hotfix detected. Publishing the package as a hotfix."

        search_tag=$tag-hotfix
        echo "Search Tag: $search_tag"

        hotfix_count=$(git tag | grep $search_tag | wc -l)
        echo "Hotfix count: $hotfix_count"

        next_hotfix_no=$((hotfix_count + 1))
        echo "Next Hotfix number: $next_hotfix_no"

        releaseVersion=$search_tag-$next_hotfix_no
        echo "Hotfix release tag: $tag"
    fi

    goToRootDirectory &&
        cd "identity-apps-core" || exit 1 &&
        echo "Releasing identity-apps-core version: $releaseVersion"

    mvn -Dresume=false \
        -Darguments='-Dadditionalparam=-Xdoclint:none' \
        -Dmaven.test.skip=true \
        release:prepare -B \
        -DreleaseVersion="$releaseVersion" \
        -DscmCommentPrefix="[WSO2 Release] [GitHub Action #$GITHUB_RUN_NUMBER] [Release] [skip ci] " &&
        mvn -Dresume=false \
            -Darguments='-Dadditionalparam=-Xdoclint:none' \
            -Dmaven.test.skip=true \
            release:perform -B \
            --settings ~/.m2/settings.xml \
            -P include-sources
}

# Create and checkout a new branch for the release.
create_and_checkout_release_branch() {
    local releaseBranch=$RELEASE_BRANCH

    git checkout -b "$releaseBranch" &&
    echo "Checked out to the release branch: $releaseBranch"
}

# Merge the release branch back to master.
merge_to_master() {
    local releaseBranch=$RELEASE_BRANCH
    local masterBranch="master"

    git checkout "$masterBranch" &&
    git pull origin "$masterBranch" &&
    git merge --no-ff "$releaseBranch" -m "[WSO2 Release] [GitHub Action #$GITHUB_RUN_NUMBER] [Release] [skip ci] Merge release branch $releaseBranch" &&
    git push origin "$masterBranch" &&
    echo "Merged $releaseBranch into $masterBranch"
}

# Delete the release branch from both local and remote.
delete_release_branch() {
    local releaseBranch=$RELEASE_BRANCH

    # Delete the local branch.
    git branch -d "$releaseBranch" &&
    echo "Deleted local branch: $releaseBranch"

    # Delete the remote branch.
    git push origin --delete "$releaseBranch" &&
    echo "Deleted remote branch: $releaseBranch"
}

if [ -z "$PACKAGES" ] || [ "$PACKAGES" = "[]" ]; then
    echo "No packages to be released. Exiting..." &&
        exit 0
fi

if [ -z "$GITHUB_RUN_NUMBER" ]; then
    echo "No GitHub Action run number provided. Exiting..." &&
        exit 0
fi

echo "Releasing packages: $PACKAGES"

# Create and checkout a new branch for the release.
create_and_checkout_release_branch

# Iterate over each package in the JSON array
for package in $(echo "$PACKAGES" | jq -c '.[]'); do
    name=$(echo "$package" | jq -r '.name')
    version=$(echo "$package" | jq -r '.version')

    case "$name" in
    "@wso2is/console")
        process_console_package "$version"
        ;;
    "@wso2is/myaccount")
        process_myaccount_package "$version"
        ;;
    "@wso2is/identity-apps-core")
        process_java_apps_package "$version"
        ;;
    *)
        echo "Irrelevent package: $package"
        ;;
    esac
done

# Merge the release branch back to master.
merge_to_master

# Delete the release branch from both local and remote.
delete_release_branch

# End of script
