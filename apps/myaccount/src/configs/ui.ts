/**
 * Copyright (c) 2019-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
import PasskeyIcon from "../themes/default/assets/images/authenticators/fido-passkey-black.svg";
import GravatarLogo from "../themes/default/assets/images/gravatar-logo.png";
import { ReactComponent as AppIcon } from "../themes/default/assets/images/icons/app-icon.svg";
import {
    ReactComponent as AuthenticatorAppIcon
} from "../themes/default/assets/images/icons/authenticator-app-icon.svg";
import { ReactComponent as BackupCodesIcon } from "../themes/default/assets/images/icons/backup-code-icon.svg";
import {
    ReactComponent as BlockedMagnifierIcon
} from "../themes/default/assets/images/icons/blocked-magnifier-icon.svg";
import { ReactComponent as BoxIcon } from "../themes/default/assets/images/icons/box-icon.svg";
import { ReactComponent as CloseIcon } from "../themes/default/assets/images/icons/close-icon.svg";
import { ReactComponent as CodeIcon } from "../themes/default/assets/images/icons/code-icon.svg";
import { ReactComponent as ConsoleIcon } from "../themes/default/assets/images/icons/console-icon.svg";
import { ReactComponent as ControlsIcon } from "../themes/default/assets/images/icons/controls-icon.svg";
import { ReactComponent as CrossIcon } from "../themes/default/assets/images/icons/cross-icon.svg";
import { ReactComponent as DashboardIcon } from "../themes/default/assets/images/icons/dashboard-icon.svg";
import { ReactComponent as EmailIcon } from "../themes/default/assets/images/icons/email-icon.svg";
import { ReactComponent as ErrorIcon } from "../themes/default/assets/images/icons/error-icon.svg";
import { ReactComponent as ForbiddenIcon } from "../themes/default/assets/images/icons/forbidden-icon.svg";
import { ReactComponent as InfoIcon } from "../themes/default/assets/images/icons/info-icon.svg";
import { ReactComponent as KeyboardIcon } from "../themes/default/assets/images/icons/keyboard.svg";
import { ReactComponent as LockIcon } from "../themes/default/assets/images/icons/lock-icon.svg";
import { ReactComponent as MonitorIcon } from "../themes/default/assets/images/icons/monitor-icon.svg";
import { ReactComponent as MyAccountIcon } from "../themes/default/assets/images/icons/myaccount-icon.svg";
import { ReactComponent as PackageIcon } from "../themes/default/assets/images/icons/package.svg";
import {
    ReactComponent as PushAuthenticatorAppIcon
} from "../themes/default/assets/images/icons/push-authenticator-app-icon.svg";
import {
    ReactComponent as SecurityQuestionsIcon
} from "../themes/default/assets/images/icons/security-questions-icon.svg";
import { ReactComponent as SMSIcon } from "../themes/default/assets/images/icons/sms-icon.svg";
import { ReactComponent as SuccessIcon } from "../themes/default/assets/images/icons/success-icon.svg";
import { ReactComponent as TickCircleIcon } from "../themes/default/assets/images/icons/tick-circle-icon.svg";
import { ReactComponent as UserIcon } from "../themes/default/assets/images/icons/user-icon.svg";
import { ReactComponent as WarningIcon } from "../themes/default/assets/images/icons/warning-icon.svg";
import {
    ReactComponent as EnterVerificationCodeIcon
} from "../themes/default/assets/images/illustrations/enter-verification-code.svg";
import FederatedAssociationsMini from "../themes/default/assets/images/illustrations/federated-associations-mini.svg";
import FederatedAssociations from "../themes/default/assets/images/illustrations/federated-associations.svg";
import {
    ReactComponent as QRCodeScanIcon
} from "../themes/default/assets/images/illustrations/qrcode-scan.svg";
import {
    ReactComponent as SecurityQuestionsMini
} from "../themes/default/assets/images/illustrations/security-questions-mini.svg";
import {
    ReactComponent as SecurityQuestions
} from "../themes/default/assets/images/illustrations/security-questions.svg";
import {
    ReactComponent as AccountSecurityIconIllustration
} from "../themes/default/assets/images/illustrations/selfcare-account-security.svg";
import {
    ReactComponent as AssociatedAccounts
} from "../themes/default/assets/images/illustrations/selfcare-associated-accounts.svg";
import {
    ReactComponent as ChangePasswordIllustration
} from "../themes/default/assets/images/illustrations/selfcare-change-password.svg";
import {
    ReactComponent as ConsentIllustration
} from "../themes/default/assets/images/illustrations/selfcare-consent.svg";
import {
    ReactComponent as ProfileExport
} from "../themes/default/assets/images/illustrations/selfcare-export-profile.svg";
import {
    ReactComponent as ProfileIllustration
} from "../themes/default/assets/images/illustrations/selfcare-profile.svg";
import {
    ReactComponent as EmptyListResultsIllustration
} from "../themes/default/assets/images/placeholder-illustrations/empty-list-illustration.svg";

import {
    ReactComponent as EmptySearchResultsIllustration
} from "../themes/default/assets/images/placeholder-illustrations/empty-search-illustration.svg";
import DummyUser from "../themes/default/assets/images/user.png";

export const UserImage: string = DummyUser;
export const ConsentedAppIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = PackageIcon;
export const DefaultAppIcon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> = CodeIcon;

export const getSidePanelIcons = (): {
    account: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    apps: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    consent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    overview: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    personal: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    security: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    session: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
 } => {

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

export const getSettingsSectionIcons = (): {
    associatedAccounts: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    associatedAccountsMini: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    changePassword: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    changePasswordMini: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    federatedAssociations: string;
    federatedAssociationsMini: string;
    profileExport: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    profileExportMini: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    securityQuestions: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    securityQuestionsMini: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
 } => {

    return {
        associatedAccounts: AssociatedAccounts,
        associatedAccountsMini: AssociatedAccounts,
        changePassword: ChangePasswordIllustration,
        changePasswordMini: ChangePasswordIllustration,
        federatedAssociations: FederatedAssociations,
        federatedAssociationsMini: FederatedAssociationsMini,
        profileExport: ProfileExport,
        profileExportMini: ProfileExport,
        securityQuestions: SecurityQuestions,
        securityQuestionsMini: SecurityQuestionsMini
    };
};

export const getMFAIcons = (): {
    authenticatorApp: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    backupCodes: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    passkey: string;
    pushAuthenticatorApp: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    sms: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    keyboard: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
 } => {

    return {
        authenticatorApp: AuthenticatorAppIcon,
        backupCodes: BackupCodesIcon,
        keyboard: KeyboardIcon,
        passkey: PasskeyIcon,
        pushAuthenticatorApp: PushAuthenticatorAppIcon,
        sms: SMSIcon
    };
};

export const getAccountRecoveryIcons = (): {
    email: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    securityQuestions: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    sms: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
 } => {

    return {
        email: EmailIcon,
        securityQuestions: SecurityQuestionsIcon,
        sms : SMSIcon
    };
};

export const getAccountStatusShields = (): {
    danger: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    good: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    warning: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
 } => {

    return {
        danger: StatusShieldDanger,
        good: StatusShieldGood,
        warning: StatusShieldWarning
    };
};

export const getWidgetIcons = (): {
    accountSecurity: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    consents: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    profile: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
 } => {

    return {
        accountSecurity: AccountSecurityIconIllustration,
        consents: ConsentIllustration,
        profile: ProfileIllustration
    };
};

export const getAdvancedSearchIcons = (): {
    clear: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
 } => {

    return {
        clear: CrossIcon
    };
};

export const getEmptyPlaceholderIllustrations = (): {
    accessDeniedError: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    emptyList: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    genericError: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    loginError: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    pageNotFound: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    search: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    newList: React.FunctionComponent<React.SVGProps<SVGElement>>;
 } => {

    return {
        accessDeniedError: ForbiddenIcon,
        emptyList: BoxIcon,
        genericError: CloseIcon,
        loginError: ForbiddenIcon,
        newList: EmptyListResultsIllustration,
        pageNotFound: BlockedMagnifierIcon,
        search: EmptySearchResultsIllustration
    };
};

export const getAppIconBackgrounds = (): {
    orange: string;
 } => {

    return {
        orange: OrangeAppIconBackground
    };
};

export const getThirdPartyLogos = (): {
    gravatar: string;
 } => {

    return {
        gravatar: GravatarLogo
    };
};

export const AlertIcons = (): {
    error: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    info: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    success: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    warning: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
 } => {

    return {
        error: ErrorIcon,
        info: InfoIcon,
        success: SuccessIcon,
        warning: WarningIcon
    };
};

export const AppSwitcherIcons = (): {
    console: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    myAccount: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
 } => {
    return {
        console: ConsoleIcon as React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
        myAccount: MyAccountIcon
    };
};

export const getQRCodeScanIcon = (): React.FunctionComponent<React.SVGProps<SVGSVGElement>> => {
    return QRCodeScanIcon;
};

export const getEnterCodeIcon = (): React.FunctionComponent<React.SVGProps<SVGSVGElement>> => {
    return EnterVerificationCodeIcon;
};
