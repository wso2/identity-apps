/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient, HttpError, HttpInstance, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { ChallengesQuestionsInterface, HttpMethods } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 */
const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Method that sends multiple api requests at once.
 */
const httpRequestAll: (
    config: HttpRequestConfig[]
) => Promise<
    HttpResponse[] | undefined
> = AsgardeoSPAClient.getInstance().httpRequestAll.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetch the configured security questions of the user.
 *
 * @returns - a promise containing the response.
 */
export const getSecurityQs = (): Promise<any> => {
    const headers: HttpRequestConfig["headers"] = {
        "Accept": "application/json",
        "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost
    };

    const getQuestions = (): HttpRequestConfig => {
        return {
            headers,
            method: HttpMethods.GET,
            url: store.getState().config.endpoints.challenges
        };
    };

    const getAnswers = (): HttpRequestConfig => {
        return {
            headers,
            method: HttpMethods.GET,
            url: store.getState().config.endpoints.challengeAnswers
        };
    };

    return httpRequestAll([ getQuestions(), getAnswers() ])
        .then(([ questions, answers ]: HttpResponse[]) => {
            if (questions.status !== 200 && answers.status !== 200) {
                return Promise.reject(new Error("Failed to get security questions and answers"));
            }

            return Promise.resolve([ questions.data, answers.data ]);
        }).catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * Add the user's security questions.
 *
 * @param data - the new set of challenge questions and the answers.
 *
 * @returns - a promise containing the response.
 */
export const addSecurityQs = (data: ChallengesQuestionsInterface[]): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.challengeAnswers
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 201) {
                return Promise.reject(new Error("Failed to add security questions"));
            }

            return Promise.resolve(response.status);
        })
        .catch((error: HttpError) => {
            return Promise.reject(`Failed to add the security question - ${ error }`);
        });
};

/**
 * Update the user's security questions.
 *
 * @param data - the new set of challenge questions and the answers.
 * @returns - a promise containing the response.
 */
export const updateSecurityQs = (data: ChallengesQuestionsInterface[]): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.challengeAnswers
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update security questions."));
            }

            return Promise.resolve(response);
        })
        .catch((error: HttpError) => {
            return Promise.reject(`Failed to update the security question - ${ error }`);
        });
};
