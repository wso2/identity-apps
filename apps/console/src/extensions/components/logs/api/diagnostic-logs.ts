/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../../../features/core/store";
import { InterfaceDiagnosticLogsRequest, InterfaceDiagnosticLogsResponse } from "../models";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Get diagnostic logs via Asgardeo - Organization-Wise Log Visualization Rest API.
 *
 * @param data - diagnostic logs search request payload.
 * @returns Promise<InterfaceDiagnosticLogsResponse>
 * @throws {@link IdentityAppsApiException}
 */
export const getDiagnosticLogs = (
    data: InterfaceDiagnosticLogsRequest
): Promise<InterfaceDiagnosticLogsResponse> => {

    const requestConfig: AxiosRequestConfig = {
        data: data,
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.diagnosticLogsEndpoint
    };

    // TODO: use SWR instead of axios
    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.response?.data?.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};
