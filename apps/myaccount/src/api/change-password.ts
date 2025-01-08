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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ProfileConstants } from "../constants";
import { HttpMethods } from "../models";
import { store } from "../store";

/**
 * Updates the user's password.
 *
 * @remarks
 * We're currently using basic auth to validate the current password. If the password is
 * different, the server responds with a status code `401`. The callbacks handle 401 errors and
 * terminates the session. To bypass the callbacks disable the handler when the client is initialized.
 * TODO: Remove this once the API supports current password validation.
 * See https://github.com/wso2/product-is/issues/10014 for progress.
 *
 * @param currentPassword - currently registered password.
 * @param newPassword - newly assigned password.
 * @returns axiosResponse - a promise containing the response.
 */
export const updatePassword = (currentPassword: string, newPassword: string, isSubOrgUser: boolean = false, userOrganizationId: string = null): Promise<AxiosResponse> => {

    // If the `httpRequest` method from SDK is used for the request, it causes the 401 to be handled by
    // the callbacks set fot the application which will log the user out. Hence, axios will be used
    // for now to send the request since bearer token is not used for authorization we can get away with axios.
    // TODO: Implement a method in `AsgardeoSPAClient` http module to disable/enable the handler.
    // See https://github.com/asgardio/asgardio-js-oidc-sdk/issues/45 for progress.
    // httpRequest.disableHandler();

    const tenantDomain = isSubOrgUser ? userOrganizationId : store.getState().authenticationInformation.tenantDomain;
    const username: string = [
        store.getState().authenticationInformation?.profileInfo.userName,
        "@",
        tenantDomain
    ].join("");
    // In case the password contains non-ascii characters, converting to valid ascii format.
    const encoder: TextEncoder = new TextEncoder();
    const encodedPassword: string = String.fromCharCode(...encoder.encode(currentPassword));
    const url: string = store.getState().config.endpoints.me;
    let updatedUrl = url;
    if (isSubOrgUser) {
        updatedUrl = url.replace(/\/t\/[^/]+\//, `/t/${userOrganizationId}/`)
    }

    const requestConfig: AxiosRequestConfig = {
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
            "Authorization": `Basic ${btoa(username + ":" + encodedPassword)}`,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: updatedUrl,
        withCredentials: true
    };

    return axios.request(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ProfileConstants.CHANGE_PASSWORD_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response);
        })
        .catch((error: any) => {
            throw new IdentityAppsApiException(
                ProfileConstants.CHANGE_PASSWORD_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        })
        .finally(() => {
            // TODO: Implement a method in `AsgardeoSPAClient` http module to disable/enable the handler.
            // See https://github.com/asgardio/asgardio-js-oidc-sdk/issues/45 for progress.
            // httpRequest.enableHandler();
        });
};
