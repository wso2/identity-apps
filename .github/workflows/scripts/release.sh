#!/usr/bin/env bash

# -------------------------------------------------------------------------------------
#
# Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

    goToRootDirectory &&
        cd "apps/console/java" || exit 1 &&
        echo "Releasing console version: $releaseVersion"

    mvn -Dresume=false \
        -Darguments='-Dadditionalparam=-Xdoclint:none' \
        -Dmaven.test.skip=true \
        release:prepare -B \
        -DreleaseVersion="$releaseVersion" \
        -DscmCommentPrefix="[WSO2 Release] [GitHub Action] [Release] [skip ci] " &&
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

    goToRootDirectory &&
        cd "apps/myaccount/java" || exit 1 &&
        echo "Releasing myaccount version: $releaseVersion"

    mvn -Dresume=false \
        -Darguments='-Dadditionalparam=-Xdoclint:none' \
        -Dmaven.test.skip=true \
        release:prepare -B \
        -DreleaseVersion="$releaseVersion" \
        -DscmCommentPrefix="[WSO2 Release] [GitHub Action] [Release] [skip ci] " &&
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

    goToRootDirectory &&
        cd "identity-apps-core" || exit 1 &&
        echo "Releasing identity-apps-core version: $releaseVersion"

    mvn -Dresume=false \
        -Darguments='-Dadditionalparam=-Xdoclint:none' \
        -Dmaven.test.skip=true \
        release:prepare -B \
        -DreleaseVersion="$releaseVersion" \
        -DscmCommentPrefix="[WSO2 Release] [GitHub Action] [Release] [skip ci] " &&
        mvn -Dresume=false \
            -Darguments='-Dadditionalparam=-Xdoclint:none' \
            -Dmaven.test.skip=true \
            release:perform -B \
            --settings ~/.m2/settings.xml \
            -P include-sources
}

PACKAGES=$1

if [ -z "$PACKAGES" ]; then
    echo "No packages to be released. Exiting..." &&
        exit 0
fi

echo "Releasing packages: $PACKAGES"

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

# End of script
