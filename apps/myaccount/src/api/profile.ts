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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { ProfileConstants } from "@wso2is/core/constants";
import { CommonUtils } from "@wso2is/core/utils";
import axios from "axios";
import isEmpty from "lodash-es/isEmpty";
import { Config } from "../configs";
import { AppConstants } from "../constants";
import { history } from "../helpers";
import { BasicProfileInterface, HttpMethods, ReadOnlyUserStatus } from "../models";
import { store } from "../store";
import { toggleSCIMEnabled } from "../store/actions";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Retrieve the user information of the currently authenticated user.
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getUserInfo = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.user
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error(`Failed get user info from:
                ${store.getState().config.endpoints.user}`));
            }

            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve the user read only status of the currently authenticated user.
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getUserReadOnlyStatus = (): Promise<ReadOnlyUserStatus> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: Config.getServiceResourceEndpoints().isReadOnlyUser
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed get user read only status from:
                ${store.getState().config.endpoints.user}`)
                );
            }

            return Promise.resolve(response?.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Get gravatar image using email address
 * @param email
 */
export const getGravatarImage = (email: string): Promise<string> => {
    if (isEmpty(email)) {
        return Promise.reject("Email is null");
    } else {
        const url: string = CommonUtils.getGravatar(email);

        return new Promise((resolve, reject) => {
            axios
                .get(url)
                .then(() => {
                    resolve(url.split("?")[0]);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
};

/**
 * Retrieve the user profile details of the currently authenticated user.
 *
 * @returns {Promise<BasicProfileInterface>} a promise containing the user profile details.
 */
export const getProfileInfo = (): Promise<BasicProfileInterface> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/scim+json"
        },
        method: HttpMethods.GET,
        url: store.getState().config?.endpoints?.me
    };

    return httpClient(requestConfig)
        .then(async (response) => {

            if (response.status !== 200) {
                return Promise.reject(new Error(`Failed get user profile info from:
                ${store.getState().config.endpoints.me}`));
            }

            const profileResponse: BasicProfileInterface = {
                emails: response.data.emails || "",
                name: response.data.name || { familyName: "", givenName: "" },
                pendingEmails: response.data[ProfileConstants.SCIM2_ENT_USER_SCHEMA]
                    ? response.data[ProfileConstants.SCIM2_ENT_USER_SCHEMA].pendingEmails
                    : [],
                phoneNumbers: response.data.phoneNumbers || [],
                profileUrl: response.data.profileUrl || "",
                responseStatus: response.status || null,
                roles: response.data.roles || [],
                // TODO: Validate if necessary.
                userImage: response.data.userImage || response.data.profileUrl || "",
                ...response.data,
                userName: response.data.userName || ""
            };

            return Promise.resolve(profileResponse);
        })
        .catch((error) => {
            // Check if the API responds with a `500` error, if it does,
            // navigate the user to the login error page.
            if (
                error.response &&
                error.response.data &&
                error.response.data.status &&
                error.response.data.status === "500"
            ) {
                store.dispatch(toggleSCIMEnabled(false));

                // Navigate to login error page.
                history.push(AppConstants.getPaths().get("LOGIN_ERROR"));
            }

            return Promise.reject(error);
        });
};

/**
 * Update the required details of the user profile.
 *
 * @param {object} info.
 * @return {Promise<any>} a promise containing the response.
 */
export const updateProfileInfo = (info: Record<string, unknown>): Promise<any> => {
    const requestConfig = {
        data: info,
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.me
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(
                    new Error(`Failed update user profile info with: ${store.getState().config.endpoints.me}`)
                );
            }

            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};
