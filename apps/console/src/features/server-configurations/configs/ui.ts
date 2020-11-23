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

import { AppConstants } from "../../core/constants";
import { ServerConfigurationsConstants } from "../constants";

export const getGovernanceConnectorIllustrations = () => {

    const theme: string = AppConstants && AppConstants.getAppTheme() && AppConstants.getAppTheme().name;

    return {
        [ ServerConfigurationsConstants.PASSWORD_HISTORY_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/password-history.svg`),
        [ ServerConfigurationsConstants.PASSWORD_POLICY_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/password-pattern-illustration.svg`),
        [ ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/self-registration-illustration.svg`),
        [ ServerConfigurationsConstants.LITE_USER_REGISTRATION_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/lite-user-registration.svg`),
        [ ServerConfigurationsConstants.USER_EMAIL_VERIFICATION_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/ask-password-illustration.svg`),
        [ ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/account-lock.svg`),
        [ ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/captcha-sso-illustration.svg`),
        [ ServerConfigurationsConstants.IDLE_ACCOUNT_SUSPEND_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/lock-idle-accounts-illustration.svg`),
        [ ServerConfigurationsConstants.ACCOUNT_DISABLE_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/account-disable-illustration.svg`),
        [ ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/account-recovery-illustration.svg`),
        [ ServerConfigurationsConstants.PASSWORD_RESET_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/password-reset-illustration.svg`),
        [ ServerConfigurationsConstants.CONSENT_INFO_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/consent-management-illustration.svg`),
        [ ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/analytics-engine-illustration.svg`),
        [ ServerConfigurationsConstants.USER_CLAIM_UPDATE_CONNECTOR_ID ]:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/user-claim-update-illustration.svg`),
        default:
            import(`../../../themes/${
                theme
            }/assets/images/illustrations/governance-connectors/default-connector-illustration.svg`)
    };
};
