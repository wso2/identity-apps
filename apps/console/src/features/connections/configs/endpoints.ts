/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AuthenticatorManagementConstants } from "../constants/autheticator-constants";
import { ConnectionResourceEndpointsInterface } from "../models/endpoints";

/**
 * Get the resource endpoints for the connection management feature.
 *
 * @param {string} serverHost - Server Host.
 * 
 * @return {ConnectionResourceEndpointsInterface}
 */
export const getConnectionResourceEndpoints = (serverHost: string): ConnectionResourceEndpointsInterface => {
    return {
        authenticatorTags: `${ serverHost }/api/server/v1/authenticators/meta/tags`,
        authenticators: `${ serverHost }/api/server/v1/authenticators`,
        extensions: `${ serverHost }/api/server/v1/extensions`,
        identityProviders: `${ serverHost }/api/server/v1/identity-providers`,
        localAuthenticators: `${ serverHost }/api/server/v1/configs/authenticators`,
        multiFactorAuthenticators: `${ serverHost }/api/server/v1/identity-governance/${
            AuthenticatorManagementConstants.MFA_CONNECTOR_CATEGORY_ID
        }`
    };
};
