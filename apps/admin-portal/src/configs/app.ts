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

import { GlobalConfig } from "./globals";

interface ServiceResourcesType {
    associations: string;
    authorize: string;
    challenges: string;
    challengeAnswers: string;
    consents: string;
    jwks: string;
    logout: string;
    me: string;
    profileSchemas: string;
    receipts: string;
    sessions: string;
    token: string;
    user: string;
    users: string;
    revoke: string;
    wellKnown: string;
}

export const ServiceResourcesEndpoint: ServiceResourcesType = {
    associations: `${GlobalConfig.serverHost}/api/users/v1/me/associations`,
    authorize: `${GlobalConfig.serverHost}/oauth2/authorize`,
    challengeAnswers: `${GlobalConfig.serverHost}/api/users/v1/me/challenge-answers`,
    challenges: `${GlobalConfig.serverHost}/api/users/v1/me/challenges`,
    consents: `${GlobalConfig}/api/identity/consent-mgt/v1.0/consents`,
    jwks: `${GlobalConfig.serverHost}/oauth2/jwks`,
    logout: `${GlobalConfig.serverHost}/oidc/logout`,
    me: `${GlobalConfig.serverHost}/scim2/Me`,
    profileSchemas: `${GlobalConfig.serverHost}/scim2/Schemas`,
    receipts: `${GlobalConfig.serverHost}/api/identity/consent-mgt/v1.0/consents/receipts`,
    revoke: `${GlobalConfig.serverHost}/oauth2/revoke`,
    sessions: `${GlobalConfig.serverHost}/t/carbon.super/api/users/v1/me/sessions`,
    token: `${GlobalConfig.serverHost}/oauth2/token`,
    user: `${GlobalConfig.serverHost}/api/identity/user/v1.0/me`,
    users: `${GlobalConfig.serverHost}/scim2/Users`,
    wellKnown: `${GlobalConfig.serverHost}/oauth2/oidcdiscovery/.well-known/openid-configuration`
};
