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

    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:prepare -B && \
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:perform -B --settings ~/.m2/settings.xml && \

    goToRootDirectory && \
    cd "java/features/org.wso2.identity.apps.console.server.feature" || exit 1 && \

    mvn versions:set-property -Dproperty=console.version -DnewVersion="$console_release_version" && \
    git add pom.xml && \
    git commit -m "Update console version to $console_release_version" && \

    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:prepare -B && \
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:perform -B --settings ~/.m2/settings.xml
}

process_myaccount_package() {
    goToRootDirectory

    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:prepare -pl apps/myaccount,java/features/org.wso2.identity.apps.myaccount.server.feature -B && \
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' -Dmaven.test.skip=true release:perform -pl apps/myaccount,java/features/org.wso2.identity.apps.myaccount.server.feature -B --settings ~/.m2/settings.xml
}

PACKAGES=$1

if [ -z "$PACKAGES" ]; then
    echo "No packages to be released. Exiting..."
    exit 1
fi

echo "Releasing packages: $PACKAGES"

package_list=$(echo "$PACKAGES" | tr "," " ")

for package in $package_list; do
    case "$package" in
            "@wso2is/console")
                process_console_package
                ;;
            "@wso2is/myaccount")
                process_myaccount_package
                ;;
            *)
                echo "Unknown package: $package"
                ;;
        esac
done

# End of script
