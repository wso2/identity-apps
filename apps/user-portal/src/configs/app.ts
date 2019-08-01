import { string } from "prop-types";

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
    logout: string;
    me: string;
    token: string;
    challenges: string;
    challengeAnswers: string;
}

export const ServiceEndpoint: ServiceEndpointURLType = SERVER_HOST;
export const ServiceResourcesEndpoint: ServiceResourcesType = {
    authorize: `${ServiceEndpoint}/oauth2/authorize?response_type=code&client_id=` +
            `${CLIENT_ID}&redirect_uri=${LOGIN_CALLBACK_URL}&scope=openid`,
    challengeAnswers: `${ServiceEndpoint}/api/users/v1/me/challenge-answers`,
    challenges: `${ServiceEndpoint}/api/users/v1/me/challenges`,
    logout: `${ServiceEndpoint}/oidc/logout`,
    me: `${ServiceEndpoint}/scim2/Me`,
    token: `${ServiceEndpoint}/oauth2/token`
};
