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

import { AuthenticateSessionUtil, AuthenticateUserKeys } from "@wso2is/authenticate";
import axios, { AxiosResponse } from "axios";
import log from "log";
import { ServiceResourcesEndpoint } from "../configs";
import { createEmptyProfile } from "../models/profile";

/**
 * Retrieve the user profile details of the currently authenticated user.
 * @return {object: BasicProfileInterface} an object containing the user profile details.
 */
export const getProfileInfo = async () => {
    const profileDetails = createEmptyProfile();

    if (AuthenticateSessionUtil.isValidSession(CLIENT_ID, CLIENT_HOST)) {
        const authUrl = ServiceResourcesEndpoint.me;
        const token = AuthenticateSessionUtil.getAccessToken(CLIENT_ID, CLIENT_HOST);
        const orgKey = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User";
        const header = {
            headers: {
                "Accept": "application/json",
                "Access-Control-Allow-Origin": CLIENT_HOST,
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/scim+json"
            }
        };

        await axios.get(authUrl, header)
            .then((endpointResponse) => {
                if (endpointResponse.status === 200) {
                    profileDetails.displayName = endpointResponse.data.name.givenName || "";
                    profileDetails.username = endpointResponse.data.userName || "";
                    profileDetails.emails = endpointResponse.data.emails || "";
                    profileDetails.lastName = endpointResponse.data.name.familyName || "";
                    profileDetails.phoneNumbers = endpointResponse.data.phoneNumbers || [];
                    profileDetails.organisation = endpointResponse.data.orgKey.organization || "";
                    profileDetails.roles = endpointResponse.data.roles || [];
                    profileDetails.proUrl = endpointResponse.data.profileUrl || "";
                }
            })
            .catch((error) => {
                log.error(error);
            });
    }

    return profileDetails;
};

/**
 * Update the required details of the user profile
 * @param {object} info
 * @return {{Promise<AxiosResponse<any>>} a promise containing the response
 */
export const updateProfileInfo = async (info: object) => {
    const url = ServiceResourcesEndpoint.me;
    const token = AuthenticateSessionUtil.getAccessToken(CLIENT_ID, CLIENT_HOST);
    const header = {
        headers: {
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };

    return axios.patch(url, info, header)
        .then((response) => {
            if (response.status === 200) {
                return response;
            }
        })
        .catch((error) => {
            log.error(error);
            return error;
        });
};

/**
 * Fetch the configured security questions of the user
 * @return {Promise<AxiosResponse<any>>} a promise containing the response
 */
export const getSecurityQs = (): Promise<any> => {
    const challengeUrl = ServiceResourcesEndpoint.challenges;
    const answerUrl = ServiceResourcesEndpoint.challengeAnswers;
    const token = AuthenticateSessionUtil.getAccessToken(CLIENT_ID, CLIENT_HOST);
    const header = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`
        }
    };

    const getQuestions = () => {
        return axios.get(challengeUrl, header);
    };

    const getAnswers = () => {
        return axios.get(answerUrl, header);
    };

    const response = axios.all([getQuestions(), getAnswers()])
        .then(axios.spread((questions, answers) => {
            if (questions.status === 200 && answers.status === 200) {
                // resolve(questions);
                return Promise.resolve([questions.data, answers.data]);
            } else {
                return Promise.reject(Error);
            }
        }));
    return response;
};

/**
 * Add the user's security questions
 * @param {object} data the new set of challenge questions and the answers
 * @return {Promise<AxiosResponse<any>>} a promise containing the response
 */
export const addSecurityQs = (data): Promise<any> => {
    const answerUrl = ServiceResourcesEndpoint.challengeAnswers;
    const token = AuthenticateSessionUtil.getAccessToken(CLIENT_ID, CLIENT_HOST);

    const header = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`
        }
    };

    const res = axios.post(answerUrl, data, header)
        .then((response) => {
            if (response.status === 200) {
                return response;
            }
        })
        .catch((error) => {
            log.error(error);
            return error;
        });
    return res;
};

/**
 * Update the user's security questions
 * @param {object} data the new set of challenge questions and the answers
 * @return {Promise<AxiosResponse<any>>} a promise containing the response
 */
export const updateSecurityQs = (data) => {
    const answerUrl = ServiceResourcesEndpoint.challengeAnswers;
    const token = AuthenticateSessionUtil.getAccessToken(CLIENT_ID, CLIENT_HOST);

    const header = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`
        }
    };

    return axios.put(answerUrl, data, header)
        .then((response) => {
            if (response.status === 200) {
                return response;
            }
        })
        .catch((error) => {
            log.error(error);
            return error;
        });
    // return res;
}

/**
 * Updates the user's password.
 * @param {string} currentPassword currently registered password
 * @param {string} newPassword newly assigned password
 * @return {Promise<AxiosResponse<any>>} a promise containing the response
 */
export const updatePassword = (currentPassword: string, newPassword: string): Promise<AxiosResponse<any>> => {
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

    return axios.patch(url, body, { auth, headers })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            log.error(error);
            return Promise.reject(error);
        });
};
