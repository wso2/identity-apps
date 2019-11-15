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

import { AuthenticateSessionUtil, SignInUtil } from "@wso2is/authenticate";
import axios from "axios";
import { isEmpty } from "lodash";
import { ServiceResourcesEndpoint } from "../configs";
import { BasicProfileInterface } from "../models";

/**
 * Retrieve the user information of the currently authenticated user.
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getUserInfo = (): Promise<any> => {
    return AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const headers = {
                "Access-Control-Allow-Origin": CLIENT_HOST,
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            return axios
                .get(ServiceResourcesEndpoint.user, { headers })
                .then((response) => {
                    if (response.status !== 200) {
                        return Promise.reject(new Error("Failed get user info from: " + ServiceResourcesEndpoint.user));
                    }
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Retrieve the user profile details of the currently authenticated user.
 *
 * @returns {Promise<BasicProfileInterface>} a promise containing the user profile details.
 */
export const getProfileInfo = (): Promise<BasicProfileInterface> => {
    return AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const orgKey = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User";
            const headers = {
                "Accept": "application/json",
                "Access-Control-Allow-Origin": CLIENT_HOST,
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/scim+json"
            };

            return axios
                .get(ServiceResourcesEndpoint.me, { headers })
                .then(async (response) => {
                    let gravatar = "";
                    if (response.status !== 200) {
                        return Promise.reject(
                            new Error("Failed get user profile info from: " + ServiceResourcesEndpoint.me)
                        );
                    }
                    if (isEmpty(response.data.userImage)) {
                            try {
                                gravatar = await getGravatarImage(response.data.emails[0]);
                            } catch (error) {
                                gravatar = "";
                            }
                    }
                    const profileResponse: BasicProfileInterface = {
                        displayName: response.data.name.givenName || "",
                        emails: response.data.emails || "",
                        lastName: response.data.name.familyName || "",
                        organisation: response.data[orgKey] ? response.data[orgKey].organization : "",
                        phoneNumbers: response.data.phoneNumbers || [],
                        proUrl: response.data.profileUrl || "",
                        responseStatus: response.status || null,
                        roles: response.data.roles || [],
                        userimage: response.data.userImage || gravatar,
                        username: response.data.userName || ""
                    };
                    return Promise.resolve(profileResponse);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Update the required details of the user profile.
 *
 * @param {object} info.
 * @return {Promise<any>} a promise containing the response.
 */
export const updateProfileInfo = (info: object): Promise<any> => {
    return AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const headers = {
                "Access-Control-Allow-Origin": CLIENT_HOST,
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            };

            return axios
                .patch(ServiceResourcesEndpoint.me, info, { headers })
                .then((response) => {
                    if (response.status !== 200) {
                        return Promise.reject(
                            new Error("Failed update user profile info with: " + ServiceResourcesEndpoint.me)
                        );
                    }
                    return Promise.resolve(response);
                })
                .catch((error) => {
                    return Promise.reject(error);
                });
        })
        .catch((error) => {
            return Promise.reject(error);
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
