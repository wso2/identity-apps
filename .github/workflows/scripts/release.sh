#!/usr/bin/env bash

SCRIPT_LOCATION="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

# Goes the the project root directory.
goToRootDirectory() {
    cd "$SCRIPT_LOCATION/../../../" || exit 1
}

process_console_package() {
    goToRootDirectory

    mvn release:prepare -pl apps/console,java/features/org.wso2.identity.apps.console.server.feature -B && \
    mvn release:perform -pl apps/console,java/features/org.wso2.identity.apps.console.server.feature -B
}

process_myaccount_package() {
    goToRootDirectory

    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' release:prepare -pl apps/myaccount,java/features/org.wso2.identity.apps.myaccount.server.feature -B && \
    mvn -Dresume=false -Darguments='-Dadditionalparam=-Xdoclint:none' release:perform -pl apps/myaccount,java/features/org.wso2.identity.apps.myaccount.server.feature -B --settings ~/.m2/settings.xml
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
