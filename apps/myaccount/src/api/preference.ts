/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient, HttpError, HttpInstance, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { HttpMethods, PreferenceRequest } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 */
const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Get account recovery preferences.
 *
 * @param data - connector & property details
 */
export const getPreference = (data: PreferenceRequest[]): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        data,
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.preference
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to load account recovery preferences"));
            }

            return Promise.resolve(response?.data);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};
