/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import {
    CircleUserIcon,
    GearIcon,
    HexagonTwoIcon,
    Icon,
    PadlockAsteriskIcon,
    ShareNodesIcon,
    ShieldCheckIcon,
    ShieldUserPencilIcon,
    UserDatabaseIcon,
    UserPlusIcon,
    VerticleFilterBarsIcon
} from "@oxygen-ui/react-icons";
import UsernameValidationIcon from "../../../extensions/assets/images/icons/username-validation-icon.svg";
import {
    default as LockRecoverIcon
} from "../../../themes/default/assets/images/icons/lock-recover-icon.svg";
import {
    default as PasswordValidationIcon
} from "../../../themes/default/assets/images/icons/password-validation.svg";
import {
    ReactComponent as RobotIcon
} from "../../../themes/default/assets/images/icons/robot-icon.svg";
import {
    default as UserAddIcon
} from "../../../themes/default/assets/images/icons/user-add.svg";
import {
    default as WarningWithNumberIcon
} from "../../../themes/default/assets/images/icons/warning-with-number.svg";
import {
    default as AccountDisableConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/account-disable-illustration.svg";
import {
    default as AccountLockConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/account-lock.svg";
import {
    default as AccountRecoveryConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/account-recovery-illustration.svg";
import {
    default as AnalyticsEngineConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/analytics-engine-illustration.svg";
import {
    default as AskPasswordConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/ask-password-illustration.svg";
import {
    default as reCaptchaConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/captcha-sso-illustration.svg";
import {
    default as ConsentInfoConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/consent-management-illustration.svg";
import {
    default as DefaultConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/default-connector-illustration.svg";
import {
    default as LiteUserRegistrationConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/lite-user-registration.svg";
import {
    default as idleAccountSuspendConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/lock-idle-accounts-illustration.svg";
import {
    default as PasswordHistoryConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/password-history.svg";
import {
    default as PasswordPatternConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/password-pattern-illustration.svg";
import {
    default as PasswordResetConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/password-reset-illustration.svg";
import {
    default as SelfRegConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/self-registration-illustration.svg";
import {
    default as UserClaimUpdateConnectorIllustration
} from "../../../themes/default/assets/images/illustrations/governance-connectors/user-claim-update-illustration.svg";
import {
    default as JWTKeyIcon
} from "../../../themes/default/assets/images/illustrations/jwt-key-icon.svg";
import { ServerConfigurationsConstants } from "../constants";

interface GetGovernanceConnectorIllustrationsInterface {
    [key: string]: string;
    default: string;
}

interface GetSettingsSectionIconsInterface {
    [key: string]: string;
}

interface ConnectorCategoryIconsInterface {
    [key: string]: Icon | any;
}

export const getGovernanceConnectorIllustrations = () : GetGovernanceConnectorIllustrationsInterface => {

    return {
        [ ServerConfigurationsConstants.PASSWORD_HISTORY_CONNECTOR_ID ]: PasswordHistoryConnectorIllustration,
        [ ServerConfigurationsConstants.PASSWORD_POLICY_CONNECTOR_ID ]: PasswordPatternConnectorIllustration,
        [ ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID ]: SelfRegConnectorIllustration,
        [ ServerConfigurationsConstants.LITE_USER_REGISTRATION_CONNECTOR_ID
        ]: LiteUserRegistrationConnectorIllustration,
        [ ServerConfigurationsConstants.USER_EMAIL_VERIFICATION_CONNECTOR_ID ]: AskPasswordConnectorIllustration,
        [ ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID ]: AccountLockConnectorIllustration,
        [ ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID ]: reCaptchaConnectorIllustration,
        [ ServerConfigurationsConstants.IDLE_ACCOUNT_SUSPEND_CONNECTOR_ID ]: idleAccountSuspendConnectorIllustration,
        [ ServerConfigurationsConstants.ACCOUNT_DISABLING_DYNAMIC_CONNECTOR_ID ]: AccountDisableConnectorIllustration,
        [ ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID ]: AccountRecoveryConnectorIllustration,
        [ ServerConfigurationsConstants.PASSWORD_RESET_CONNECTOR_ID ]: PasswordResetConnectorIllustration,
        [ ServerConfigurationsConstants.CONSENT_INFO_CONNECTOR_ID ]: ConsentInfoConnectorIllustration,
        [ ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID ]: AnalyticsEngineConnectorIllustration,
        [ ServerConfigurationsConstants.USER_CLAIM_UPDATE_CONNECTOR_ID ]: UserClaimUpdateConnectorIllustration,
        default: DefaultConnectorIllustration
    };
};

export const getSettingsSectionIcons = (): GetSettingsSectionIconsInterface => {

    return {
        accountLock: WarningWithNumberIcon,
        accountRecovery: LockRecoverIcon,
        jwtPrivateKeyValidation: JWTKeyIcon,
        passwordValidation: PasswordValidationIcon,
        selfRegistration: UserAddIcon,
        usernameValidation: UsernameValidationIcon
    };
};

export const getConnectorCategoryIcon = (): ConnectorCategoryIconsInterface => {
    return {
        [ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID]: PadlockAsteriskIcon,
        [ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID]: UserPlusIcon,
        [ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID]: HexagonTwoIcon,
        [ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID]: VerticleFilterBarsIcon,
        [ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID]: CircleUserIcon,
        [ServerConfigurationsConstants.MFA_CONNECTOR_CATEGORY_ID]: ShieldCheckIcon,
        [ServerConfigurationsConstants.SESSION_MANAGEMENT_CONNECTOR_ID]: UserDatabaseIcon,
        [ServerConfigurationsConstants.SSO_SETTINGS_CATEGORY_ID]: ShareNodesIcon,
        [ServerConfigurationsConstants.LOGIN_SECURITY_SETTINGS_CATEGORY_ID]: ShieldUserPencilIcon,
        [ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID]: RobotIcon,
        "default": GearIcon
    };
};
