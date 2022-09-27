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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { store } from "../../core";
import { getMarketingConsentEndpoints } from "../configs";
import { ConsentResponseInterface, ConsentTypes } from "../models";

/**
 * Initialize an axios Http client.
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetch the consent list of the user.
 * 
 * @returns a Promise of list of consents with the status.
 * @throws an AxiosError.
 */
export const getUserConsentList = (): Promise<ConsentResponseInterface[]> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: getMarketingConsentEndpoints().getConsentEndpoint
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<ConsentResponseInterface[]>) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
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
