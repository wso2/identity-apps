#!/usr/bin/env bash

SCRIPT_LOCATION="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Function to display variables
display_variables() {
    echo "Workspace path: $WORKSPACE_PATH"
    echo "GitHub action run no: $GITHUB_ACTION_RUN_NUMBER"
    echo "Repository: $REPOSITORY"
    echo "Branch: $BRANCH"
}

# Goes the the project root directory.
goToRootDirectory() {
    cd "$SCRIPT_LOCATION/../../../"
}

# Function to process the "@asgardeo/console" package
process_console_package() {
    NEXUS_USERNAME=$1
    NEXUS_PASSWORD=$2

    goToRootDirectory

    mkdir apps/console/output
    cd apps/console
    pnpm install
    pnpm build
    # Prepare `console.war` server deployment artifact.
    server_artifact_name="console.war"
    cd build
    jar cvf $server_artifact_name -C console/ .
    mv $server_artifact_name ../output/$server_artifact_name
    cd ../../..
    artifact_path="$WORKSPACE_PATH/apps/console/output/$server_artifact_name"
    echo "Artifact path: $artifact_path"

    echo "Deploying console.war to staging server..."
    # Variables
    NEXUS_URL="https://maven.wso2.org/nexus"
    STAGING_REPO_URL="$NEXUS_URL/service/local/staging/deploy/maven2"
    RELEASE_REPO_URL="$NEXUS_URL/content/repositories/releases"
    GROUP_ID_PATH="org/wso2/identity/apps"
    ARTIFACT_VERSION="1.6.365.2"
    artifact="console"

    STAGING_ARTIFACT_URL="$STAGING_REPO_URL/$GROUP_ID_PATH/$artifact/$ARTIFACT_VERSION/$artifact-$ARTIFACT_VERSION.war"

    echo "Uploading artifact to $STAGING_ARTIFACT_URL"
    status_code=$(curl -u "$NEXUS_USERNAME":"$NEXUS_PASSWORD" --upload-file "$artifact_path" $STAGING_ARTIFACT_URL -o /dev/null -w '%{http_code}')
    echo "HTTP Status Code: $status_code"
}

process_myaccount_package() {
    NEXUS_USERNAME=$1
    NEXUS_PASSWORD=$2

    goToRootDirectory

    mkdir apps/myaccount/output
    cd apps/myaccount
    pnpm install
    pnpm build
    # Prepare `myaccount.war` server deployment artifact.
    server_artifact_name="myaccount.war"
    cd build
    jar cvf $server_artifact_name -C myaccount/ .
    mv $server_artifact_name ../output/$server_artifact_name
    cd ../../..
    artifact_path="$WORKSPACE_PATH/apps/myaccount/output/$server_artifact_name"
    echo "Artifact path: $artifact_path"

    echo "Deploying myaccount.war to staging server..."
    # Variables
    NEXUS_URL="https://maven.wso2.org/nexus"
    STAGING_REPO_URL="$NEXUS_URL/service/local/staging/deploy/maven2"
    GROUP_ID_PATH="org/wso2/identity/apps"
    ARTIFACT_VERSION="1.6.365.2"
    artifact="myaccount"

    STAGING_ARTIFACT_URL="$STAGING_REPO_URL/$GROUP_ID_PATH/$artifact/$ARTIFACT_VERSION/$artifact-$ARTIFACT_VERSION.war"

    echo "Uploading artifact to $STAGING_ARTIFACT_URL"
    status_code=$(curl -u "$NEXUS_USERNAME":"$NEXUS_PASSWORD" --upload-file "$artifact_path" $STAGING_ARTIFACT_URL -o /dev/null -w '%{http_code}')
    echo "HTTP Status Code: $status_code"
}

# Main script

# Variables
GIT_TOKEN=$1
WORKSPACE_PATH=$2
GITHUB_ACTION_RUN_NUMBER=$3
REPOSITORY=$4
BRANCH=$5
NEXUS_USERNAME=$6
NEXUS_PASSWORD=$7

# Display variables
display_variables

# Process packages
process_console_package "$NEXUS_USERNAME" "$NEXUS_PASSWORD"

process_myaccount_package "$NEXUS_USERNAME" "$NEXUS_PASSWORD"

# End of script
