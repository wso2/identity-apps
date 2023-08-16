/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import {
    AsgardeoSPAClient,
    HttpClientInstance,
    HttpError,
    HttpRequestConfig,
    HttpResponse
} from "@asgardeo/auth-react";
import { Application, HttpMethods } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Fetches the list of applications.
 *
 * @returns - A promise containing the response.
 */
export const fetchApplications = (
    limit: number,
    offset: number,
    filter: string
): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment
                ?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset
        },
        url: store.getState().config.endpoints.applications
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse<{ applications: Application[] }>) => {
            let applications: Application[] = [];

            if (
                response &&
                response.data &&
                response.data.applications &&
                response.data.applications.length &&
                response.data.applications.length > 0
            ) {
                applications = response.data.applications.filter(
                    (app: Application) =>
                        app.name !== store.getState().config.ui.appName
                );
            }

            return Promise.resolve({
                ...response.data,
                applications
            });
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};
