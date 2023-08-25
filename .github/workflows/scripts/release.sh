#!/usr/bin/env bash

SCRIPT_LOCATION="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Goes the the project root directory.
goToRootDirectory() {
    cd "$SCRIPT_LOCATION/../../../" || exit 1
}

process_console_package() {
    goToRootDirectory && \
    cd "apps/console" || exit 1 && \

    local console_release_version
    console_release_version=$(mvn help:evaluate -Dexpression=project.version -q -DforceStdout | sed 's/-SNAPSHOT$//')

    echo "Releasing console version: $console_release_version"
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:prepare -B && \
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:perform -B --settings ~/.m2/settings.xml && \

    goToRootDirectory && \
    cd "java/features/org.wso2.identity.apps.console.server.feature" || exit 1 && \

    mvn versions:set-property -Dproperty=console.version -DnewVersion="$console_release_version" && \
    git add pom.xml && \
    git commit -m "Update console version to $console_release_version" && \

    echo "Releasing console feature version: $console_release_version"
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:prepare -B && \
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:perform -B --settings ~/.m2/settings.xml
}

process_myaccount_package() {
    goToRootDirectory && \
    cd "apps/myaccount" || exit 1 && \

    local myaccount_release_version
    myaccount_release_version=$(mvn help:evaluate -Dexpression=project.version -q -DforceStdout | sed 's/-SNAPSHOT$//')

    echo "Releasing myaccount version: $myaccount_release_version"
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:prepare -B && \
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:perform -B --settings ~/.m2/settings.xml && \

    goToRootDirectory && \
    cd "java/features/org.wso2.identity.apps.myaccount.server.feature" || exit 1 && \

    mvn versions:set-property -Dproperty=myaccount.version -DnewVersion="$myaccount_release_version" && \
    git add pom.xml && \
    git commit -m "Update myaccount version to $myaccount_release_version" && \

    echo "Releasing myaccount feature version: $myaccount_release_version"
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:prepare -B && \
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:perform -B --settings ~/.m2/settings.xml
}

process_java_apps_package() {
    goToRootDirectory && \
    cd "java" || exit 1 && \

    local java_apps_release_version
    java_apps_release_version=$(mvn help:evaluate -Dexpression=project.version -q -DforceStdout | sed 's/-SNAPSHOT$//')

    echo "Releasing java-apps version: $java_apps_release_version"
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:prepare -B && \
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:perform -B --settings ~/.m2/settings.xml
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

    case "$name" in
            "@wso2is/console")
                process_console_package
                ;;
            "@wso2is/myaccount")
                process_myaccount_package
                ;;
            "@wso2is/java-apps")
                process_java_apps_package
                ;;
            *)
                echo "Irrelevent package: $package"
                ;;
        esac
done

# End of script
