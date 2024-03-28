/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { store } from "../../../../../admin-core-v1";
import useRequest, { 
    RequestConfigInterface,
    RequestResultInterface 
} from "../../../../../admin-core-v1/hooks/use-request";
import { getMarketingConsentEndpoints } from "../configs";
import { ConsentResponseInterface, ConsentTypes } from "../models";

/**
 * Initialize an axios Http client.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance().
    httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to get the consent list of the logged in user.
 * 
 * @param shouldFetch - a boolean value to trigger the fetcher function conditionally.
 * @returns the list of consents with the status.
 */
export const useUserConsentList = <Data = ConsentResponseInterface[], Error = AxiosError>(
    shouldFetch: boolean
): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = shouldFetch 
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
    const requestConfig: RequestConfigInterface = {
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
