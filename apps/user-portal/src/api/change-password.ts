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

import { AuthenticateSessionUtil, AuthenticateUserKeys } from "@wso2is/authentication";
import { AxiosHttpClient } from "@wso2is/http";
import { ServiceResourcesEndpoint } from "../configs";
import { HttpMethods } from "../models";
import { onHttpRequestError, onHttpRequestFinish, onHttpRequestStart, onHttpRequestSuccess } from "../utils";

/**
 * Initialize an axios Http client.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = AxiosHttpClient.getInstance();
httpClient.init(true, onHttpRequestStart, onHttpRequestSuccess, onHttpRequestError, onHttpRequestFinish);

/**
 * Updates the user's password.
 *
 * @param {string} currentPassword currently registered password.
 * @param {string} newPassword newly assigned password.
 * @return {Promise<any>} a promise containing the response.
 */
export const updatePassword = (currentPassword: string, newPassword: string): Promise<any> => {
    const requestConfig = {
        auth: {
            password: currentPassword,
            username: AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.USERNAME)
        },
        data: {
            Operations: [
                {
                    op: "add",
                    value: {
                        password: newPassword
                    }
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        },
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: ServiceResourcesEndpoint.me
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject("Failed to update password.");
            }
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(`Failed to update the password - ${ error }`);
        });
};
