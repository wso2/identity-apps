/**
 * Copyright (c) 2023-2026, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, HttpError, HttpInstance, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { ProfileConstants } from "../constants";
import { HttpMethods } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 */
const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);


/**
 * Updates the signed-in user's password.
 *
 * Sends a `POST` request to the password change endpoint with the current and new passwords.
 * If the user belongs to a sub-organization, the tenant segment in the endpoint URL is replaced
 * with the provided organization handle.
 *
 *
 * @param currentPassword - currently registered password.
 * @param newPassword - newly assigned password.
 * @param isSubOrgUser - Whether the user belongs to a sub-organization.
 * @param userOrganizationHandle - The user's organization Handle.
 *
 * @returns A promise that resolves with the HTTP response when the request succeeds with status `204`.
 */
export const updatePassword = (currentPassword: string, newPassword: string, isSubOrgUser: boolean = false,
    userOrganizationHandle: string = null): Promise<HttpResponse<unknown>> => {

    // In case the password contains non-ascii characters, converting to valid ascii format.
    const encoder: TextEncoder = new TextEncoder();
    const encodedCurrentPassword: string = String.fromCharCode(...encoder.encode(currentPassword));
    const url: string = store.getState().config.endpoints.passwordChange;
    let updatedUrl: string = url;

    if (isSubOrgUser) {
        updatedUrl = url.replace(/\/t\/[^/]+\//, `/t/${userOrganizationHandle}/`);
    }

    const requestConfig: HttpRequestConfig = {
        data: {
            currentPassword: encodedCurrentPassword,
            newPassword: newPassword
        },
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: updatedUrl
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 204) {
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
        .catch((error: HttpError) => {
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
