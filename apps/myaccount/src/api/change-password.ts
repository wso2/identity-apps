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

import { IdentityClient } from "@wso2is/authentication";
import { HttpMethods } from "../models";
import { store } from "../store";


const httpRequest = IdentityClient.getInstance().httpRequest.bind(IdentityClient.getInstance());

/**
 * Updates the user's password.
 *
 * @param {string} currentPassword currently registered password.
 * @param {string} newPassword newly assigned password.
 * @return {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const updatePassword = (currentPassword: string, newPassword: string): Promise<any> => {
    // We're currently using basic auth to validate the current password. If the password is
    // different, the server responds with a status code `401`. The callbacks handle 401 errors and
    // terminates the session. To bypass the callbacks disable the handler when the client is initialized.
    // TODO: Remove this once the API supports current password validation.
    // TODO: Implement a method in `IdentityClient` http module to disable/enable the handler.
    // httpClient.disableHandler();

    const requestConfig = {
        auth: {
            password: currentPassword,
            username: store.getState().authenticationInformation.username
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
        url: store.getState().config.endpoints.me
    };

    return httpRequest(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject("Failed to update password.");
            }
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        })
        .finally(() => {
            // TODO: Implement a method in `IdentityClient` http module to disable/enable the handler.
            // TODO: Remove this once the API supports current password validation.
            // httpClient.enableHandler();
        });
};
