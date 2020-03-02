/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { AuthenticateSessionUtil, SignInUtil } from "@wso2is/authentication";
import { AxiosHttpClient, AxiosHttpClientInstance } from "@wso2is/http";
import _ from "lodash";
import { CommonServiceResourcesEndpoints } from "../configs";
import { HTTPRequestHeaders } from "../helpers";
import {
    AcceptHeaderValues,
    ContentTypeHeaderValues,
    HttpMethods,
    LinkedAccountInterface,
    ProfileInfoInterface,
    ProfileSchemaInterface
} from "../models";
import { ContextUtils } from "../utils";
import axios from "axios";

/**
 * Get an http client instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient: AxiosHttpClientInstance = AxiosHttpClient.getInstance();

/**
 * Retrieve the user information of the currently authenticated user.
 *
 * @return {Promise<ProfileInfoInterface>} User information as a Promise.
 */
export const getUserInfo = (): Promise<ProfileInfoInterface> => {

    const requestConfig = {
        headers: HTTPRequestHeaders(ContextUtils.getRuntimeConfig().clientHost, null, ContentTypeHeaderValues.APP_JSON),
        method: HttpMethods.GET,
        url: CommonServiceResourcesEndpoints(ContextUtils.getRuntimeConfig().serverHost).me
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject("Failed get user info.");
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve the user profile details of the currently authenticated user.
 *
 * @param {() => void} onSCIMDisabled - Callback to be fired if SCIM is disabled for the user store.
 * @returns {Promise<ProfileInfoInterface>} Profile information as a Promise.
 */
export const getProfileInfo = (onSCIMDisabled: () => void): Promise<ProfileInfoInterface> => {

    const orgKey = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User";

    const requestConfig = {
        headers: HTTPRequestHeaders(ContextUtils.getRuntimeConfig().clientHost, AcceptHeaderValues.APP_JSON,
            ContentTypeHeaderValues.APP_SCIM),
        method: HttpMethods.GET,
        url: CommonServiceResourcesEndpoints(ContextUtils.getRuntimeConfig().serverHost).me
    };

    return httpClient.request(requestConfig)
        .then(async (response) => {
            let gravatar = "";
            let profileImage: string;

            if (response.status !== 200) {
                return Promise.reject("Failed get user profile info.");
            }

            if (_.isEmpty(response.data.userImage) && !response.data.profileUrl) {
                try {
                    gravatar = await getGravatarImage(
                        typeof response.data.emails[0] === "string"
                            ? response.data.emails[0]
                            : response.data.emails[0].value
                    );
                } catch (error) {
                    gravatar = "";
                }
            }

            profileImage = response.data.profileUrl ? response.data.profileUrl : gravatar;

            const profileResponse: ProfileInfoInterface = {
                emails: response.data.emails || "",
                name: response.data.name || { givenName: "", familyName: "" },
                organisation: response.data[orgKey] ? response.data[orgKey].organization : "",
                phoneNumbers: response.data.phoneNumbers || [],
                profileUrl: response.data.profileUrl || "",
                responseStatus: response.status || null,
                roles: response.data.roles || [],
                userImage: response.data.userImage || profileImage,
                userName: response.data.userName || "",
                ...response.data
            };

            return Promise.resolve(profileResponse);
        })
        .catch((error) => {
            // Check if the API responds with a `500` error, if it does,
            // navigate the user to the login error page.
            if (error.response
                && error.response.data
                && error.response.data.status
                && error.response.data.status === "500") {

                // Fire `onSCIMDisabled` callback which will navigate the
                // user to the corresponding error page.
                onSCIMDisabled();
            }

            return Promise.reject(error);
        });
};

/**
 * Update the required details of the user profile.
 *
 * @param {object} info - Information that needs to ber updated.
 * @return {Promise<ProfileInfoInterface>} Updated profile info as a Promise.
 */
export const updateProfileInfo = (info: object): Promise<ProfileInfoInterface> => {

    const requestConfig = {
        data: info,
        headers: HTTPRequestHeaders(ContextUtils.getRuntimeConfig().clientHost, null),
        method: HttpMethods.PATCH,
        url: CommonServiceResourcesEndpoints(ContextUtils.getRuntimeConfig().serverHost).me
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject("Failed update user profile info.");
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 *  Get Gravatar image using the email address.
 *
 * @param email - Email address.
 * @return {Promise<string>} Valid Gravatar URL as a Promise.
 */
export const getGravatarImage = (email: string): Promise<string> => {

    const requestConfig = {
        method: HttpMethods.GET,
        url: SignInUtil.getGravatar(email)
    };

    return axios.request(requestConfig)
        .then(() => {
            return Promise.resolve(requestConfig.url.split("?")[ 0 ]);
        })
        .catch((error) => {
            return Promise.reject(error);
        })
        .finally(() => {
            // Re-enable the handler.
            httpClient.enableHandler();
        });
};

/**
 * Retrieve the profile schemas of the user claims of the currently authenticated user.
 *
 * @return {Promise<ProfileSchemaInterface[]>} Array of profile schemas as a Promise.
 */
export const getProfileSchemas = (): Promise<ProfileSchemaInterface[]> => {

    const requestConfig = {
        headers: HTTPRequestHeaders(ContextUtils.getRuntimeConfig().clientHost, null, ContentTypeHeaderValues.APP_JSON),
        method: HttpMethods.GET,
        url: CommonServiceResourcesEndpoints(ContextUtils.getRuntimeConfig().serverHost).profileSchemas
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed get user schemas"));
            }
            return Promise.resolve(response.data[0].attributes as ProfileSchemaInterface[]);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Switches the logged in user's account to one of the linked accounts
 * associated to the corresponding user.
 *
 * @param {LinkedAccountInterface} account - The target account.
 * @param {string[]} scopes - Required scopes array.
 * @param {string} clientID - Client ID.
 * @param {string} clientHost - Client Host URL.
 * @return {Promise<any>}
 */
export const switchAccount = (account: LinkedAccountInterface,
                              scopes: string[],
                              clientID: string,
                              clientHost: string): Promise<any> => {

    const requestParams = {
        "client_id": clientID,
        "scope": scopes,
        "tenant-domain": account.tenantDomain,
        "username": account.username,
        "userstore-domain": account.userStoreDomain
    };

    return SignInUtil.sendAccountSwitchRequest(requestParams, clientHost)
        .then((response) => {
            AuthenticateSessionUtil.initUserSession(response,
                SignInUtil.getAuthenticatedUser(response.idToken));
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};
