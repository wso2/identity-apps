/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { ServerConfigurationsConstants } from "../../server-configurations/constants";
import { AppConstants } from "../constants";

export const getTechnologyLogos = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        android: import(`../../../themes/${ theme }/assets/images/technologies/android-logo.svg`),
        angular: import(`../../../themes/${ theme }/assets/images/technologies/angular-logo.svg`),
        apple: import(`../../../themes/${ theme }/assets/images/technologies/apple-logo.svg`),
        cSharp: import(`../../../themes/${ theme }/assets/images/technologies/c-sharp-logo.svg`),
        cordova: import(`../../../themes/${ theme }/assets/images/technologies/cordova-logo.svg`),
        dotNet: import(`../../../themes/${ theme }/assets/images/technologies/dotnet-logo.svg`),
        html: import(`../../../themes/${ theme }/assets/images/technologies/html-logo.svg`),
        ios: import(`../../../themes/${ theme }/assets/images/technologies/apple-logo.svg`),
        java: import(`../../../themes/${ theme }/assets/images/technologies/java-logo.svg`),
        javascript: import(`../../../themes/${ theme }/assets/images/technologies/javascript-logo.svg`),
        nodejs: import(`../../../themes/${ theme }/assets/images/technologies/nodejs-logo.svg`),
        openidconnect: import(`../../../themes/${ theme }/assets/images/protocols/oidc.png`),
        python: import(`../../../themes/${ theme }/assets/images/technologies/python-logo.svg`),
        react: import(`../../../themes/${ theme }/assets/images/technologies/react-logo.svg`),
        saml: import(`../../../themes/${ theme }/assets/images/protocols/saml.png`),
        vue: import(`../../../themes/${ theme }/assets/images/technologies/vue-logo.svg`),
        windows: import(`../../../themes/${ theme }/assets/images/technologies/windows-logo.svg`)
    };
};

export const getSidePanelIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        appLogs: import(`../../../themes/${ theme }/assets/images/icons/metadata.svg`),
        applications: import(`../../../themes/${ theme }/assets/images/icons/outline-icons/application-outline.svg`),
        approvals: import(`../../../themes/${ theme }/assets/images/icons/outline-icons/pending-approval-outline.svg`),
        certificate: import(`../../../themes/${ theme }/assets/images/icons/certificate-icon.svg`),
        childIcon: import(`../../../themes/${ theme }/assets/images/icons/arrow-right-icon.svg`),
        claims: import(`../../../themes/${ theme }/assets/images/icons/claims-icon.svg`),
        connectors: {
            [ ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID ]: import(`../../../themes/${
                theme
            }/assets/images/icons/outline-icons/account-management-outline.svg`),
            [ ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID ]: import(`../../../themes/${
                theme
            }/assets/images/icons/outline-icons/onboarding-outline.svg`),
            [ ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID ]: import(`../../../themes/${
                theme
            }/assets/images/icons/outline-icons/login-attempts-outline.svg`),
            [ ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID ]: import(`../../../themes/${
                theme
            }/assets/images/icons/outline-icons/key-outline.svg`),
            [ ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID ]: import(`../../../themes/${
                theme
            }/assets/images/icons/outline-icons/other-settings-outline.svg`),
            default: import(`../../../themes/${ theme }/assets/images/icons/plug-icon.svg`)
        },
        emailTemplates: import(`../../../themes/${ theme }/assets/images/icons/paper-rocket-icon.svg`),
        groups: import(`../../../themes/${ theme }/assets/images/icons/user-group-icon.svg`),
        identityProviders: import(`../../../themes/${
            theme
        }/assets/images/icons/outline-icons/idp-provider-outline.svg`),
        overview: import(`../../../themes/${ theme }/assets/images/icons/dashboard-icon.svg`),
        remoteFetch: import(`../../../themes/${ theme }/assets/images/icons/code-fork.svg`),
        roles: import(`../../../themes/${ theme }/assets/images/icons/briefcase-icon.svg`),
        scopes: import(`../../../themes/${ theme }/assets/images/icons/scope.svg`),
        serverConfigurations: import(`../../../themes/${ theme }/assets/images/icons/gears-icon.svg`),
        userStore: import(`../../../themes/${ theme }/assets/images/icons/database-icon.svg`),
        users: import(`../../../themes/${ theme }/assets/images/icons/user-icon.svg`)
    };
};

export const getSidePanelMiscIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        caretRight: import(`../../../themes/${ theme }/assets/images/icons/caret-right-icon.svg`)
    };
};

export const getAdvancedSearchIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        clear: import(`../../../themes/${ theme }/assets/images/icons/cross-icon.svg`)
    };
};

export const getEmptyPlaceholderIllustrations = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        alert: import(`../../../themes/${ theme }/assets/images/icons/alert-icon.svg`),
        brokenPage: import(`../../../themes/${
            theme
        }/assets/images/placeholder-illustrations/broken-page-illustration.svg`),
        emptyList: import(`../../../themes/${
            theme
        }/assets/images/placeholder-illustrations/empty-list-illustration.svg`),
        emptySearch: import(`../../../themes/${
            theme
        }/assets/images/placeholder-illustrations/empty-search-illustration.svg`),
        fileUpload: import(`../../../themes/${ theme }/assets/images/icons/upload.svg`),
        genericError: import(`../../../themes/${ theme }/assets/images/icons/close-icon.svg`),
        loginError: import(`../../../themes/${ theme }/assets/images/icons/forbidden-icon.svg`),
        newList: import(`../../../themes/${
            theme
        }/assets/images/placeholder-illustrations/empty-list-illustration.svg`),
        pageNotFound: import(`../../../themes/${ theme }/assets/images/icons/blocked-magnifier-icon.svg`),
        search: import(`../../../themes/${
            theme
        }/assets/images/placeholder-illustrations/empty-search-illustration.svg`)
    };
};

export const getOperationIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        drag: import(`../../../themes/${ theme }/assets/images/icons/drag-squares-icon.svg`),
        maximize: import(`../../../themes/${ theme }/assets/images/icons/maximize-icon.svg`),
        minimize: import(`../../../themes/${ theme }/assets/images/icons/minimize-icon.svg`)
    };
};

export const getHelpPanelActionIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        caretLeft: import(`../../../themes/${ theme }/assets/images/icons/caret-left-icon.svg`),
        caretRight: import(`../../../themes/${ theme }/assets/images/icons/caret-right-icon.svg`),
        close: import(`../../../themes/${ theme }/assets/images/icons/cross-icon.svg`),
        pin: import(`../../../themes/${ theme }/assets/images/icons/pin-icon.svg`)
    };
};

export const getCertificateIllustrations = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        avatar: import(`../../../themes/${ theme }/assets/images/icons/certificate-avatar.svg`),
        badge: import(`../../../themes/${ theme }/assets/images/illustrations/badge.svg`),
        file: import(`../../../themes/${ theme }/assets/images/illustrations/certificate.svg`),
        ribbon: import(`../../../themes/${ theme }/assets/images/illustrations/ribbon.svg`),
        uploadPlaceholder: import(`../../../themes/${ theme }/assets/images/icons/upload.svg`)
    };
};
