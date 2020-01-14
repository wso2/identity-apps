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

import { SignInUtil } from "@wso2is/authentication";
import { AxiosHttpClient } from "@wso2is/http";
import axios from "axios";
import { isEmpty } from "lodash";
import { GlobalConfig, ServiceResourcesEndpoint } from "../configs";
import { BasicProfileInterface, HttpMethods, ProfileSchema } from "../models";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Retrieve the user information of the currently authenticated user.
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getUserInfo = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.me
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(`Failed to retrieve user information - ${error}`);
        });
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
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/scim+json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.me
    };

    return httpClient
        .request(requestConfig)
        .then(async (response) => {
            let gravatar = "";
            if (isEmpty(response.data.userImage)) {
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
            const profileResponse: BasicProfileInterface = {
                emails: response.data.emails || "",
                name: response.data.name || { givenName: "", familyName: "" },
                organisation: response.data[orgKey] ? response.data[orgKey].organization : "",
                phoneNumbers: response.data.phoneNumbers || [],
                profileUrl: response.data.profileUrl || "",
                responseStatus: response.status || null,
                roles: response.data.roles || [],
                userName: response.data.userName || "",
                userimage: response.data.userImage || gravatar
            };
            return Promise.resolve(profileResponse);
        })
        .catch((error) => {
            return Promise.reject(`Failed to retrieve user profile information - ${error}`);
        });
};

/**
 * Update the required details of the user profile.
 *
 * @param {object} info.
 * @return {Promise<any>} a promise containing the response.
 */
export const updateProfileInfo = (info: object): Promise<any> => {
    const requestConfig = {
        data: info,
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: ServiceResourcesEndpoint.me
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(`Failed to update the profile info - ${error}`);
        });
};

/**
 *  Get gravatar image using email address
 * @param email
 */
export const getGravatarImage = (email: string): Promise<string> => {
    const url: string = SignInUtil.getGravatar(email);
    return new Promise((resolve, reject) => {
        axios
            .get(url)
            .then((response) => {
                resolve(url.split("?")[0]);
            })
            .catch((error) => {
                reject();
            });
    });
};

/**
 * Retrieve the profile schemas of the user claims of the currently authenticated user.
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getProfileSchemas = (): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.profileSchemas
    };

    return httpClient
        .request(requestConfig)
        .then((response) => {
            return Promise.resolve(response.data[0].attributes as ProfileSchema[]);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};
