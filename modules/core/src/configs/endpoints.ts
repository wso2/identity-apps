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

/**
 * Interface for the service resource endpoints.
 */
interface CommonServiceResourceEndpointsInterface {
    authorize: string;
    claims: string;
    externalClaims: string;
    groups: string;
    roles: string;
    jwks: string;
    localClaims: string;
    logout: string;
    me: string;
    profileSchemas: string;
    revoke: string;
    token: string;
    userstores: string;
    wellKnown: string;
}

/**
 * Common Service resource endpoints.
 */
export const CommonServiceResourcesEndpoints = (serverHost: string): CommonServiceResourceEndpointsInterface => ({
    authorize: `${serverHost}/oauth2/authorize`,
    claims: `${serverHost}/api/server/v1/claim-dialects`,
    externalClaims:`${serverHost}/api/server/v1/claim-dialects/{0}/claims`,
    groups: `${serverHost}/scim2/Groups`,
    jwks: `${serverHost}/oauth2/jwks`,
    localClaims: `${serverHost}/api/server/v1/claim-dialects/local/claims`,
    logout: `${serverHost}/oidc/logout`,
    me: `${serverHost}/scim2/Me`,
    profileSchemas: `${serverHost}/scim2/Schemas`,
    roles: `${serverHost}/scim2/Roles`,
    revoke: `${serverHost}/oauth2/revoke`,
    token: `${serverHost}/oauth2/token`,
    userstores: `${serverHost}/api/server/v1/userstores`,
    wellKnown: `${serverHost}/oauth2/oidcdiscovery/.well-known/openid-configuration`
});
