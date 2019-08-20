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

import {AuthenticateSessionUtil, AuthenticateUserKeys} from "@wso2is/authenticate";
import axios from "axios";
import {ServiceResourcesEndpoint} from "../configs";
import {BasicProfileInterface} from "../models/profile";

/**
 * Retrieve the user information of the currently authenticated user.
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getUserInfo = (): Promise<any> => {
    return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const header = {
            headers: {
                "Access-Control-Allow-Origin": CLIENT_HOST,
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        return axios.get(ServiceResourcesEndpoint.user, header)
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error("Failed get user info from: "
                        + ServiceResourcesEndpoint.user));
                }
                return Promise.resolve(response);
            }).catch((error) => {
                return Promise.reject(error);
            });
    }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * Retrieve the user profile details of the currently authenticated user.
 *
 * @returns {Promise<BasicProfileInterface>} a promise containing the user profile details.
 */
export const getProfileInfo = (): Promise<BasicProfileInterface> => {
    return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const orgKey = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User";
        const header = {
            headers: {
                "Accept": "application/json",
                "Access-Control-Allow-Origin": CLIENT_HOST,
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/scim+json"
            }
        };

        return axios.get(ServiceResourcesEndpoint.me, header)
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error("Failed get user profile info from: "
                        + ServiceResourcesEndpoint.me));
                }
                const profileResponse: BasicProfileInterface = {
                    displayName: response.data.name.givenName || "",
                    emails: response.data.emails || "",
                    lastName: response.data.name.familyName || "",
                    organisation: (response.data[orgKey]) ?
                        response.data[orgKey].organization : "",
                    phoneNumbers: response.data.phoneNumbers || [],
                    proUrl: response.data.profileUrl || "",
                    responseStatus: response.status || null,
                    roles: response.data.roles || [],
                    username: response.data.userName || ""
                };
                return Promise.resolve(profileResponse);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }).catch((error) => {
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
    return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const header = {
            headers: {
                "Access-Control-Allow-Origin": CLIENT_HOST,
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        };

        return axios.patch(ServiceResourcesEndpoint.me, info, header)
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error("Failed update user profile info with: "
                        + ServiceResourcesEndpoint.me));
                }
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * Fetch the configured security questions of the user.
 *
 * @return {Promise<any>} a promise containing the response.
 */
export const getSecurityQs = (): Promise<any> => {
    return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const header = {
            headers: {
                "Accept": "application/json",
                "Access-Control-Allow-Origin": CLIENT_HOST,
                "Authorization": `Bearer ${token}`
            }
        };

        const getQuestions = () => {
            return axios.get(ServiceResourcesEndpoint.challenges, header);
        };

        const getAnswers = () => {
            return axios.get(ServiceResourcesEndpoint.challengeAnswers, header);
        };

        return axios.all([getQuestions(), getAnswers()])
            .then(axios.spread((questions, answers) => {
                if (questions.status !== 200 && answers.status !== 200) {
                    return Promise.reject(new Error("Failed to get security questions and answers."));
                }
                return Promise.resolve([questions.data, answers.data]);
            }));
    }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * Add the user's security questions.
 *
 * @param {object} data the new set of challenge questions and the answers.
 * @return {Promise<any>} a promise containing the response.
 */
export const addSecurityQs = (data: object): Promise<any> => {
    return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const header = {
            headers: {
                "Accept": "application/json",
                "Access-Control-Allow-Origin": CLIENT_HOST,
                "Authorization": `Bearer ${token}`
            }
        };

        return axios.post(ServiceResourcesEndpoint.challengeAnswers, data, header)
            .then((response) => {
                if (response.status !== 201) {
                    return Promise.reject(new Error("Failed to add security questions."));
                }
                return Promise.resolve(response.status);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * Update the user's security questions.
 *
 * @param {object} data the new set of challenge questions and the answers.
 * @return {Promise<any>} a promise containing the response.
 */
export const updateSecurityQs = (data: object): Promise<any> => {
    return AuthenticateSessionUtil.getAccessToken().then((token) => {
        const header = {
            headers: {
                "Accept": "application/json",
                "Access-Control-Allow-Origin": CLIENT_HOST,
                "Authorization": `Bearer ${token}`
            }
        };

        return axios.put(ServiceResourcesEndpoint.challengeAnswers, data, header)
            .then((response) => {
                if (response.status !== 200) {
                    return Promise.reject(new Error("Failed to update security questions."));
                }
                return Promise.resolve(response);
            })
            .catch((error) => {
                return Promise.reject(error);
            });
    }).catch((error) => {
        return Promise.reject(error);
    });
};

/**
 * Updates the user's password.
 *
 * @param {string} currentPassword currently registered password.
 * @param {string} newPassword newly assigned password.
 * @return {Promise<any>} a promise containing the response.
 */
export const updatePassword = (currentPassword: string, newPassword: string): Promise<any> => {
    const url = ServiceResourcesEndpoint.me;
    const username = AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.USERNAME);
    const auth = {
        password: currentPassword,
        username
    };
    const headers = {
        "Content-Type": "application/json"
    };
    const body = {
        Operations: [
            {
                op: "add",
                value: {
                    password: newPassword
                }
            }
        ],
        schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"]
    };

    return axios.patch(url, body, {auth, headers})
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update password."));
            }
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};
