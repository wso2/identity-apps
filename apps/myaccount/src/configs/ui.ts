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

import { ReactComponent as StatusShieldDanger } from "../themes/default/assets/images/accounts-status-icons/danger.svg";
import { ReactComponent as StatusShieldGood } from "../themes/default/assets/images/accounts-status-icons/good.svg";
import {
    ReactComponent as StatusShieldWarning
} from "../themes/default/assets/images/accounts-status-icons/warning.svg";
import OrangeAppIconBackground from "../themes/default/assets/images/app-icon-background.png";
import GravatarLogo from "../themes/default/assets/images/gravatar-logo.png";
import { ReactComponent as AppIcon } from "../themes/default/assets/images/icons/app-icon.svg";
import {
    ReactComponent as AuthenticatorAppIcon
} from "../themes/default/assets/images/icons/authenticator-app-icon.svg";
import {
    ReactComponent as BlockedMagnifierIcon
} from "../themes/default/assets/images/icons/blocked-magnifier-icon.svg";
import { ReactComponent as BoxIcon } from "../themes/default/assets/images/icons/box-icon.svg";
import { ReactComponent as CloseIcon } from "../themes/default/assets/images/icons/close-icon.svg";
import { ReactComponent as CodeIcon } from "../themes/default/assets/images/icons/code-icon.svg";
import { default as ConsentIcon } from "../themes/default/assets/images/icons/consent-icon.svg";
import { default as MyAccountProfileIcon } from "../themes/default/assets/images/icons/user-profile.svg";
import ConsoleIcon from "../themes/default/assets/images/icons/console-icon.svg";
import { ReactComponent as ControlsIcon } from "../themes/default/assets/images/icons/controls-icon.svg";
import { ReactComponent as CrossIcon } from "../themes/default/assets/images/icons/cross-icon.svg";
import { ReactComponent as DashboardIcon } from "../themes/default/assets/images/icons/dashboard-icon.svg";
import { ReactComponent as EmailIcon } from "../themes/default/assets/images/icons/email-icon.svg";
import { ReactComponent as ErrorIcon } from "../themes/default/assets/images/icons/error-icon.svg";
import { ReactComponent as FingerprintIcon } from "../themes/default/assets/images/icons/fingerprint.svg";
import { ReactComponent as ForbiddenIcon } from "../themes/default/assets/images/icons/forbidden-icon.svg";
import { ReactComponent as InfoIcon } from "../themes/default/assets/images/icons/info-icon.svg";
import { ReactComponent as KeyboardIcon } from "../themes/default/assets/images/icons/keyboard.svg";
import { ReactComponent as LockIcon } from "../themes/default/assets/images/icons/lock-icon.svg";
import { ReactComponent as MonitorIcon } from "../themes/default/assets/images/icons/monitor-icon.svg";
import MyAccountIcon from "../themes/default/assets/images/icons/myaccount-icon.svg";
import { ReactComponent as PackageIcon } from "../themes/default/assets/images/icons/package.svg";
import { default as PadlockIcon } from "../themes/default/assets/images/icons/padlock-icon.svg";
import {
    ReactComponent as SecurityQuestionsIcon
} from "../themes/default/assets/images/icons/security-questions-icon.svg";
import { ReactComponent as SMSIcon } from "../themes/default/assets/images/icons/sms-icon.svg";
import { ReactComponent as SuccessIcon } from "../themes/default/assets/images/icons/success-icon.svg";
import { ReactComponent as TickCircleIcon } from "../themes/default/assets/images/icons/tick-circle-icon.svg";
import { ReactComponent as UserIcon } from "../themes/default/assets/images/icons/user-icon.svg";
import { ReactComponent as WarningIcon } from "../themes/default/assets/images/icons/warning-icon.svg";
import AssociatedAccountsMini from "../themes/default/assets/images/illustrations/associated-accounts-mini.svg";
import AssociatedAccounts from "../themes/default/assets/images/illustrations/associated-accounts.svg";
import ChangePasswordMini from "../themes/default/assets/images/illustrations/change-password-mini.svg";
import ChangePassword from "../themes/default/assets/images/illustrations/change-password.svg";
import {
    ReactComponent as EnterVerificationCodeIcon
} from "../themes/default/assets/images/illustrations/enter-verification-code.svg";
import FederatedAssociationsMini from "../themes/default/assets/images/illustrations/federated-associations-mini.svg";
import FederatedAssociations from "../themes/default/assets/images/illustrations/federated-associations.svg";
import {
    ReactComponent as EmptySearchResultsIllustration
} from "../themes/default/assets/images/illustrations/no-search-results.svg";
import ProfileExportMini from "../themes/default/assets/images/illustrations/profile-export-mini.svg";
import ProfileExport from "../themes/default/assets/images/illustrations/profile-export.svg";
import {
    ReactComponent as QRCodeScanIcon
} from "../themes/default/assets/images/illustrations/qrcode-scan.svg";
import {
    ReactComponent as SecurityQuestionsMini
} from "../themes/default/assets/images/illustrations/security-questions-mini.svg";
import {
    ReactComponent as SecurityQuestions
} from "../themes/default/assets/images/illustrations/security-questions.svg";
import DummyUser from "../themes/default/assets/images/user.png";

export const UserImage: string = DummyUser;
export const ConsentedAppIcon = PackageIcon;
export const DefaultAppIcon = CodeIcon;

export const getSidePanelIcons = () => {

    return {
        account: ControlsIcon,
        apps: AppIcon,
        consent: TickCircleIcon,
        overview: DashboardIcon,
        personal: UserIcon,
        security: LockIcon,
        session: MonitorIcon
    };
};

export const getSettingsSectionIcons = () => {

    return {
        associatedAccounts: AssociatedAccounts,
        associatedAccountsMini: AssociatedAccountsMini,
        changePassword: ChangePassword,
        changePasswordMini: ChangePasswordMini,
        federatedAssociations: FederatedAssociations,
        federatedAssociationsMini: FederatedAssociationsMini,
        profileExport: ProfileExport,
        profileExportMini: ProfileExportMini,
        securityQuestions: SecurityQuestions,
        securityQuestionsMini: SecurityQuestionsMini
    };
};

export const getMFAIcons = () => {

    return {
        authenticatorApp: AuthenticatorAppIcon,
        fingerprint: FingerprintIcon,
        sms: SMSIcon,
        keyboard: KeyboardIcon
    };
};

export const getAccountRecoveryIcons = () => {

    return {
        email: EmailIcon,
        securityQuestions: SecurityQuestionsIcon
    };
};

export const getAccountStatusShields = () => {

    return {
        danger: StatusShieldDanger,
        good: StatusShieldGood,
        warning: StatusShieldWarning
    };
};

export const getWidgetIcons = () => {

    return {
        accountSecurity: PadlockIcon,
        consents: ConsentIcon,
        profile: MyAccountProfileIcon
    };
};

export const getAdvancedSearchIcons = () => {

    return {
        clear: CrossIcon
    };
};

export const getEmptyPlaceholderIllustrations = () => {

    return {
        accessDeniedError: ForbiddenIcon,
        emptyList: BoxIcon,
        genericError: CloseIcon,
        loginError: ForbiddenIcon,
        pageNotFound: BlockedMagnifierIcon,
        search: EmptySearchResultsIllustration
    };
};

export const getAppIconBackgrounds = () => {

    return {
        orange: OrangeAppIconBackground
    };
};

export const getThirdPartyLogos = () => {

    return {
        gravatar: GravatarLogo
    };
};

export const AlertIcons = () => {

    return {
        error: ErrorIcon,
        info: InfoIcon,
        success: SuccessIcon,
        warning: WarningIcon
    };
};

export const AppSwitcherIcons = (): Record<string, any> => {

    return {
        console: ConsoleIcon,
        myAccount: MyAccountIcon
    };
};

export const getQRCodeScanIcon = () => {

    return QRCodeScanIcon;
};

export const getEnterCodeIcon = () => {

    return EnterVerificationCodeIcon;
};
