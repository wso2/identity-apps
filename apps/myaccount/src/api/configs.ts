/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient, HttpInstance, HttpResponse } from "@asgardeo/auth-react";
import { AxiosRequestConfig } from "axios";
import { HttpMethods } from "../models";
import { store } from "../store";

/**
 * @see AsgardeoSPAClient
 */
const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Fetches home realm identifiers list from the server configurations.
 *
 * @see ServiceResourceEndpointsInterface.config
 * @returns Promise that resolves to the list of home realm identifiers.
 */
export const fetchHomeRealmIdentifiers = async (): Promise<string[]> => {

    const requestConfig: AxiosRequestConfig = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.homeRealmIdentifiers
    };

    try {
        const response: HttpResponse<string[]> = await httpClient(requestConfig);

        return Promise.resolve<string[]>(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
};
