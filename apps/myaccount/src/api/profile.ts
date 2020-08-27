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

import { SignInUtil } from "@wso2is/authentication";
import { IdentityClient } from "@wso2is/authentication";
import axios from "axios";
import _ from "lodash";
import { ApplicationConstants, SCIM2_ENT_USER_SCHEMA } from "../constants";
import { history } from "../helpers";
import { BasicProfileInterface, HttpMethods, MultiValue, ProfileSchema, ReadOnlyUserStatus } from "../models";
import { store } from "../store";
import { toggleSCIMEnabled } from "../store/actions";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = IdentityClient.getInstance().httpRequest.bind(IdentityClient.getInstance());

/**
 * Retrieve the user information of the currently authenticated user.
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getUserInfo = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.isReadOnlyUser
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
    if (_.isEmpty(email)) {
        return Promise.reject("Email is null");
    } else {
        const url: string = SignInUtil.getGravatar(email);
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
 * This function iterates over all email addresses until it finds an email with a gravatar image
 * @param emails
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
const findGravatar = async (emails: string[] | MultiValue[]): Promise<string> => {
    let gravatar = "";
    if (!_.isEmpty(emails)) {
        for (const email of emails) {
            try {
                gravatar = await getGravatarImage(typeof email === "string" ? email : email.value);
                return gravatar;
            } catch (error) {
                continue;
            }
        }
    }
    return gravatar;
};

/**
 * Retrieve the user profile details of the currently authenticated user.
 *
 * @returns {Promise<BasicProfileInterface>} a promise containing the user profile details.
 */
export const getProfileInfo = (): Promise<BasicProfileInterface> => {
    const orgKey = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User";
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/scim+json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.me
    };

    return httpClient(requestConfig)
        .then(async (response) => {
            let gravatar = "";

            if (response.status !== 200) {
                return Promise.reject(new Error(`Failed get user profile info from:
                ${store.getState().config.endpoints.me}`));
            }
            if (_.isEmpty(response.data.userImage) && !response.data.profileUrl) {
                gravatar = await findGravatar(response.data.emails);
            }

            const profileImage = response.data.profileUrl ? response.data.profileUrl : gravatar;

            const profileResponse: BasicProfileInterface = {
                emails: response.data.emails || "",
                name: response.data.name || { familyName: "", givenName: "" },
                organisation: response.data[orgKey]?.organization ? response.data[orgKey].organization : "",
                phoneNumbers: response.data.phoneNumbers || [],
                profileUrl: response.data.profileUrl || "",
                responseStatus: response.status || null,
                roles: response.data.roles || [],
                userImage: response.data.userImage || profileImage,
                pendingEmails: response.data[SCIM2_ENT_USER_SCHEMA]
                    ? response.data[SCIM2_ENT_USER_SCHEMA].pendingEmails
                    : [],
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
                history.push(ApplicationConstants.LOGIN_ERROR_PAGE_PATH);
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
/* eslint-disable @typescript-eslint/no-explicit-any */
export const updateProfileInfo = (info: object): Promise<any> => {
    const requestConfig = {
        data: info,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
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

/**
 * Retrieve the profile schemas of the user claims of the currently authenticated user.
 *
 * @return {Promise<any>} a promise containing the response.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getProfileSchemas = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.profileSchemas
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get user schemas"));
            }
            return Promise.resolve(response.data[0].attributes as ProfileSchema[]);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};
