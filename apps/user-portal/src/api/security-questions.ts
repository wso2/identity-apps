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

import { AuthenticateSessionUtil } from "@wso2is/authenticate";
import axios from "axios";
import { ServiceResourcesEndpoint } from "../configs";

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
                "Authorization": `Bearer ${ token }`
            }
        };

        const getQuestions = () => {
            return axios.get(ServiceResourcesEndpoint.challenges, header);
        };

        const getAnswers = () => {
            return axios.get(ServiceResourcesEndpoint.challengeAnswers, header);
        };

        return axios.all([ getQuestions(), getAnswers() ])
            .then(axios.spread((questions, answers) => {
                if (questions.status !== 200 && answers.status !== 200) {
                    return Promise.reject(new Error("Failed to get security questions and answers."));
                }
                return Promise.resolve([ questions.data, answers.data ]);
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
                "Authorization": `Bearer ${ token }`
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
                "Authorization": `Bearer ${ token }`
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
