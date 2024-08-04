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

/**
 * Interface for the Server Configurations feature resource endpoints.
 */
export interface ServerConfigurationsResourceEndpointsInterface {
    adminAdvisoryBanner: string;
    accountDisabling: string;
    accountLocking: string;
    accountRecovery: string;
    captchaForSSOLogin: string;
    governanceConnectorCategories: string;
    impersonationConfigurations: string;
    loginPolicies: string;
    multiFactorAuthenticators: string;
    passiveStsConfigurations: string;
    passwordExpiry: string;
    passwordHistory: string;
    passwordPolicies: string;
    passwordPoliciesUpdate: string;
    passwordPolicy: string;
    remoteLogging: string;
    saml2Configurations: string;
    selfSignUp: string;
    serverConfigurations: string;
    serverSupportedSchemas: string;
}
