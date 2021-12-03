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

import { ServerConfigurationsConstants } from "../constants";
import { ServerConfigurationsResourceEndpointsInterface } from "../models";

/**
 * Get the resource endpoints for the server configurations feature.
 *
 * @param {string} serverHost - Server Host.
 * @return {ServerConfigurationsResourceEndpointsInterface}
 */
export const getServerConfigurationsResourceEndpoints = (
    serverHost: string
): ServerConfigurationsResourceEndpointsInterface => {

    return {
        accountDisabling: `${ serverHost }/api/server/v1/identity-governance/${
            ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID
        }/connectors/${ServerConfigurationsConstants.ACCOUNT_DISABLING_CONNECTOR_ID}`,
        accountLocking: `${ serverHost }/api/server/v1/identity-governance/${
            ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID
        }/connectors/${ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID}`,
        accountRecovery: `${ serverHost }/api/server/v1/identity-governance/${
            ServerConfigurationsConstants.IDENTITY_GOVERNANCE_ACCOUNT_MANAGEMENT_POLICIES_ID
        }/connectors/${ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID}`,
        captchaForSSOLogin: `${ serverHost }/api/server/v1/identity-governance/${
            ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID
        }/connectors/${ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID}`,
        governanceConnectorCategories: `${ serverHost }/api/server/v1/identity-governance`,
        loginPolicies: `${ serverHost }/api/server/v1/identity-governance/${
            ServerConfigurationsConstants.IDENTITY_GOVERNANCE_LOGIN_POLICIES_ID
        }`,
        multiFactorAuthenticators: `${ serverHost }/api/server/v1/identity-governance/${
            ServerConfigurationsConstants.MFA_CONNECTOR_CATEGORY_ID
        }`,
        passwordHistory: `${ serverHost }/api/server/v1/identity-governance/${
            ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID
        }/connectors/${ServerConfigurationsConstants.PASSWORD_HISTORY_CONNECTOR_ID}`,
        passwordPolicies: `${ serverHost }/api/server/v1/identity-governance/${
            ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID
        }`,
        passwordPolicy: `${ serverHost }/api/server/v1/identity-governance/${
            ServerConfigurationsConstants.IDENTITY_GOVERNANCE_PASSWORD_POLICIES_ID
        }/connectors/${ServerConfigurationsConstants.PASSWORD_POLICY_CONNECTOR_ID}`,
        selfSignUp: `${ serverHost }/api/server/v1/identity-governance/${
            ServerConfigurationsConstants.IDENTITY_GOVERNANCE_ACCOUNT_MANAGEMENT_POLICIES_ID
        }/connectors/${ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID}`,
        serverConfigurations: `${ serverHost }/api/server/v1/configs`,
        serverSupportedSchemas: `${ serverHost }/api/server/v1/configs/schemas`
    };
};
