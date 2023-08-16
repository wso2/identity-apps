/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient, HttpError, HttpInstance, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { HttpMethods, UserSessions } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 */
const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches the list of user sessions from the API.
 *
 * @returns - A promise containing the response.
 */
export const fetchUserSessions = (): Promise<UserSessions> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.sessions
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse<UserSessions>) => {
            return response.data;
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * Terminates a user session.
 *
 * @param id - Session ID.
 * @returns - A promise containing the response.
 */
export const terminateUserSession = (id: string): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.sessions }/${ id }`
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            return response.data;
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * Terminates all user sessions.
 *
 * @returns - A promise containing the response.
 */
export const terminateAllUserSessions = (): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.sessions
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            return response.data;
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};
