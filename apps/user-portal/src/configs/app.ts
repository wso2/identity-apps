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
    authorize: string;
    challenges: string;
    challengeAnswers: string;
    consents: string;
    jwks: string;
    logout: string;
    me: string;
    receipts: string;
    token: string;
    user: string;
}

export const ServiceEndpoint: ServiceEndpointURLType = SERVER_HOST;
export const ServiceResourcesEndpoint: ServiceResourcesType = {
    authorize: `${ServiceEndpoint}/oauth2/authorize?response_type=code&client_id=` +
        `${CLIENT_ID}&redirect_uri=${LOGIN_CALLBACK_URL}&scope=openid&code_challenge_method=S256`,
    challengeAnswers: `${ServiceEndpoint}/api/users/v1/me/challenge-answers`,
    challenges: `${ServiceEndpoint}/api/users/v1/me/challenges`,
    consents: `${ServiceEndpoint}/api/identity/consent-mgt/v1.0/consents`,
    jwks: `${ServiceEndpoint}/oauth2/jwks`,
    logout: `${ServiceEndpoint}/oidc/logout`,
    me: `${ServiceEndpoint}/scim2/Me`,
    receipts: `${ServiceEndpoint}/api/identity/consent-mgt/v1.0/consents/receipts`,
    token: `${ServiceEndpoint}/oauth2/token`,
    user: `${ServiceEndpoint}/api/identity/user/v1.0/me`
};
