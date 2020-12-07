/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AppConstants } from "../constants";
import { ReactComponent as CodeIcon } from "../themes/default/assets/images/icons/code-icon.svg";
import { ReactComponent as PackageIcon } from "../themes/default/assets/images/icons/package.svg";
import DummyUser from "../themes/default/assets/images/user.png";

export const UserImage: string = DummyUser;
export const ConsentedAppIcon = PackageIcon;
export const DefaultAppIcon = CodeIcon;

export const getSidePanelIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        account: import(`../themes/${ theme }/assets/images/icons/controls-icon.svg`),
        apps: import(`../themes/${ theme }/assets/images/icons/app-icon.svg`),
        consent: import(`../themes/${ theme }/assets/images/icons/tick-circle-icon.svg`),
        overview: import(`../themes/${ theme }/assets/images/icons/dashboard-icon.svg`),
        personal: import(`../themes/${ theme }/assets/images/icons/user-icon.svg`),
        security: import(`../themes/${ theme }/assets/images/icons/lock-icon.svg`),
        session: import(`../themes/${ theme }/assets/images/icons/monitor-icon.svg`)
    };
};

export const getSettingsSectionIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        associatedAccounts: import(`../themes/${ theme }/assets/images/illustrations/associated-accounts.svg`),
        associatedAccountsMini: import(`../themes/${
            theme
        }/assets/images/illustrations/associated-accounts-mini.svg`),
        changePassword: import(`../themes/${ theme }/assets/images/illustrations/change-password.svg`),
        changePasswordMini: import(`../themes/${ theme }/assets/images/illustrations/change-password-mini.svg`),
        federatedAssociations: import(`../themes/${ theme }/assets/images/illustrations/federated-associations.svg`),
        federatedAssociationsMini: import(`../themes/${
            theme
        }/assets/images/illustrations/federated-associations-mini.svg`),
        profileExport: import(`../themes/${ theme }/assets/images/illustrations/profile-export.svg`),
        profileExportMini: import(`../themes/${ theme }/assets/images/illustrations/profile-export-mini.svg`),
        securityQuestions: import(`../themes/${ theme }/assets/images/illustrations/security-questions.svg`),
        securityQuestionsMini: import(`../themes/${ theme }/assets/images/illustrations/security-questions-mini.svg`)
    };
};

export const getMFAIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        authenticatorApp: import(`../themes/${ theme }/assets/images/icons/authenticator-app-icon.svg`),
        fingerprint: import(`../themes/${ theme }/assets/images/icons/fingerprint.svg`),
        sms: import(`../themes/${ theme }/assets/images/icons/sms-icon.svg`)
    };
};

export const getAccountRecoveryIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        email: import(`../themes/${ theme }/assets/images/icons/email-icon.svg`),
        securityQuestions: import(`../themes/${ theme }/assets/images/icons/security-questions-icon.svg`)
    };
};

export const getAccountStatusShields = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        danger: import(`../themes/${ theme }/assets/images/accounts-status-icons/danger.svg`),
        good: import(`../themes/${ theme }/assets/images/accounts-status-icons/good.svg`),
        warning: import(`../themes/${ theme }/assets/images/accounts-status-icons/warning.svg`)
    };
};

export const getWidgetIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        accountSecurity: import(`../themes/${ theme }/assets/images/icons/padlock-icon.svg`),
        consents: import(`../themes/${ theme }/assets/images/icons/consent-icon.svg`)
    };
};

export const getAdvancedSearchIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        clear: import(`../themes/${ theme }/assets/images/icons/cross-icon.svg`)
    };
};

export const getEmptyPlaceholderIllustrations = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        accessDeniedError: import(`../themes/${ theme }/assets/images/icons/forbidden-icon.svg`),
        emptyList: import(`../themes/${ theme }/assets/images/icons/box-icon.svg`),
        genericError: import(`../themes/${ theme }/assets/images/icons/close-icon.svg`),
        loginError: import(`../themes/${ theme }/assets/images/icons/forbidden-icon.svg`),
        pageNotFound: import(`../themes/${ theme }/assets/images/icons/blocked-magnifier-icon.svg`),
        search: import(`../themes/${ theme }/assets/images/illustrations/no-search-results.svg`)
    };
};

export const getAppIconBackgrounds = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        orange: import(`../themes/${ theme }/assets/images/app-icon-background.png`)
    };
};

export const getThirdPartyLogos = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        gravatar: import(`../themes/${ theme }/assets/images/gravatar-logo.png`)
    };
};

export const AlertIcons = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        error: import(`../themes/${ theme }/assets/images/icons/error-icon.svg`),
        info: import(`../themes/${ theme }/assets/images/icons/info-icon.svg`),
        success: import(`../themes/${ theme }/assets/images/icons/success-icon.svg`),
        warning: import(`../themes/${ theme }/assets/images/icons/warning-icon.svg`)
    };
};

export const getQRCodeScanIcon = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return import(`../themes/${ theme }/assets/images/illustrations/qrcode-scan.svg`);
};

export const getEnterCodeIcon = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return import(`../themes/${ theme }/assets/images/illustrations/enter-verification-code.svg`);
};
