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

type ServiceEndpointURLType = string;

interface ServiceResourcesType {
    applications: string;
    associations: string;
    authorize: string;
    challenges: string;
    challengeAnswers: string;
    consents: string;
    fidoEnd: string;
    fidoMetaData: string;
    fidoStart: string;
    jwks: string;
    logout: string;
    me: string;
    pendingApprovals: string;
    profileSchemas: string;
    receipts: string;
    sessions: string;
    token: string;
    user: string;
    revoke: string;
    wellKnown: string;
}

interface RuntimeConfigInterface {
    clientHost?: string;
    clientID?: string;
    serverHost?: string;
    loginCallbackUrl: string;
}

// tslint:disable-next-line:no-string-literal
const RUNTIME_CONFIG: RuntimeConfigInterface = window["runConfig"];

export let GlobalConfig: RuntimeConfigInterface = {
    clientHost: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.clientHost || CLIENT_HOST_DEFAULT) : CLIENT_HOST_DEFAULT,
    clientID: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.clientID || CLIENT_ID_DEFAULT) : CLIENT_ID_DEFAULT,
    loginCallbackUrl: (RUNTIME_CONFIG) ?
        ((RUNTIME_CONFIG.serverHost + LOGIN_CALLBACK_URL) || (CLIENT_HOST_DEFAULT + LOGIN_CALLBACK_URL)) :
        (CLIENT_HOST_DEFAULT + LOGIN_CALLBACK_URL),
    serverHost: (RUNTIME_CONFIG) ? (RUNTIME_CONFIG.serverHost || SERVER_HOST_DEFAULT) : SERVER_HOST_DEFAULT
};

export const ServiceResourcesEndpoint: ServiceResourcesType = {
    applications: `${GlobalConfig.serverHost}/t/carbon.super/api/users/v1/me/applications`,
    associations: `${GlobalConfig.serverHost}/api/users/v1/me/associations`,
    authorize: `${GlobalConfig.serverHost}/oauth2/authorize`,
    challengeAnswers: `${GlobalConfig.serverHost}/api/users/v1/me/challenge-answers`,
    challenges: `${GlobalConfig.serverHost}/api/users/v1/me/challenges`,
    consents: `${GlobalConfig.serverHost}/api/identity/consent-mgt/v1.0/consents`,
    fidoEnd: `${GlobalConfig.serverHost}/api/users/v2/me/webauthn/finish-registration`,
    fidoMetaData: `${GlobalConfig.serverHost}/api/users/v2/me/webauthn`,
    fidoStart: `${GlobalConfig.serverHost}/api/users/v2/me/webauthn/start-registration`,
    jwks: `${GlobalConfig.serverHost}/oauth2/jwks`,
    logout: `${GlobalConfig.serverHost}/oidc/logout`,
    me: `${GlobalConfig.serverHost}/scim2/Me`,
    pendingApprovals: `${GlobalConfig.serverHost}/t/carbon.super/api/users/v1/me/approval-tasks`,
    profileSchemas: `${GlobalConfig.serverHost}/scim2/Schemas`,
    receipts: `${GlobalConfig.serverHost}/api/identity/consent-mgt/v1.0/consents/receipts`,
    revoke: `${GlobalConfig.serverHost}/oauth2/revoke`,
    sessions: `${GlobalConfig.serverHost}/t/carbon.super/api/users/v1/me/sessions`,
    token: `${GlobalConfig.serverHost}/oauth2/token`,
    user: `${GlobalConfig.serverHost}/api/identity/user/v1.0/me`,
    wellKnown: `${GlobalConfig.serverHost}/oauth2/oidcdiscovery/.well-known/openid-configuration`
};
