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

import axios, { AxiosResponse } from "axios";
import log from "log";
import { ServiceResourcesEndpoint } from "../configs";
import { USERNAME } from "../helpers/constants";
import { createEmptyChallenge } from "../models/challenges";
import { createEmptyProfile } from "../models/profile";
import { getAccessToken, getSessionParameter, isValidSession } from "./session";

export const getProfileInfo = async () => {
    const profileDetails = createEmptyProfile();

    if (isValidSession()) {
        const authUrl = ServiceResourcesEndpoint.me;
        const token = getAccessToken();
        const orgKey = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User";
        const header = {
            headers: {
                "Accept": "application/json",
                "Access-Control-Allow-Origin": CLIENT_HOST,
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/scim+json"
            }
        };

        await axios
            .get(authUrl, header)
            .then((endpointResponse) => {
                if (endpointResponse.status === 200) {
                    profileDetails.displayName = endpointResponse.data.name.givenName || "";
                    profileDetails.username = endpointResponse.data.userName || "";
                    profileDetails.emails = endpointResponse.data.emails || "";
                    profileDetails.lastName = endpointResponse.data.name.familyName || "";
                    profileDetails.phoneNumbers = endpointResponse.data.phoneNumbers || [];
                    profileDetails.organisation = endpointResponse.data[orgKey].organization || "";
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
 * @return {string} response status
 */
export const updateProfileInfo = async (info: object) => {
    const url = ServiceResourcesEndpoint.me;
    const token = getAccessToken();

    const header = {
        headers: {
            "Access-Control-Allow-Origin": CLIENT_HOST,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    };

    return axios.patch(url, info, header).then((response) => {
        if (response.status === 200) {
            return response.status;
        }
    });
};

export const getSecurityQs = async () => {
    const challengeUrl = ServiceResourcesEndpoint.challenges;
    const answerUrl = ServiceResourcesEndpoint.challengeAnswers;
    const token = getAccessToken();

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

    return axios.all([getQuestions(), getAnswers()]).then(
        axios.spread((questions, answers) => {
            if (questions.status === 200 && answers.status === 200) {
                return [questions.data, answers.data];
            }
        })
    );
};

/**
 * Updates the user's password.
 * @param {string} currentPassword currently registered password
 * @param {string} newPassword newly assigned password
 * @return {Promise<AxiosResponse<any>>} a promise containing the response
 */
export const updatePassword = (currentPassword: string, newPassword: string): Promise<AxiosResponse<any>> => {
    const url = ServiceResourcesEndpoint.me;
    const username = getSessionParameter(USERNAME);
    const auth = {
        password: currentPassword,
        username
    };
    const headers = {
        "Content-Type": "application/json"
    };
    const body = {
        schemas: ["urn:ietf:params:scim:api:messages:2.0:PatchOp"],
        Operations: [
            {
                op: "add",
                value: {
                    password: newPassword
                }
            }
        ]
    };

    return axios
        .patch(url, body, { auth, headers })
        .then((response) => {
            return response;
        })
        .catch((error) => {
            log.error(error);
            return Promise.reject(error);
        });
};
