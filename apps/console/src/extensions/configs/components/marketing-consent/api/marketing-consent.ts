/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { store } from "../../../../../features/core";
import useRequest, { RequestResultInterface } from "../../../../../features/core/hooks/use-request";
import { getMarketingConsentEndpoints } from "../configs";
import { ConsentResponseInterface, ConsentTypes } from "../models";

/**
 * Initialize an axios Http client.
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to get the consent list of the logged in user.
 * 
 * @param shouldFetch - a boolean value to trigger the fetcher function conditionally.
 * @returns the list of consents with the status.
 */
export const useUserConsentList = <Data = ConsentResponseInterface[], Error = AxiosError>(
    shouldFetch: boolean
): RequestResultInterface<Data, Error> => {
    const requestConfig = shouldFetch 
        ? {
            headers: {
                "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            url: getMarketingConsentEndpoints().getConsentEndpoint
        } 
        : null;

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Update the marketing consent status of the user.
 * 
 * @param isSubscribed - status of the consent (true - subscribed, false - declined).
 * @returns a Promise of response.
 * @throws an AxiosError.
 */
export const updateUserConsent = (isSubscribed: boolean): Promise<AxiosResponse> => {
    const requestConfig = {
        data: [
            {
                "consentType": ConsentTypes.MARKETING,
                "provideConsent": isSubscribed
            }
        ],
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: getMarketingConsentEndpoints().addConsentEndpoint
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};
