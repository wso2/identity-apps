/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { store } from "@wso2is/admin.core.v1/store";
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AcceptHeaderValues, ContentTypeHeaderValues, HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import {
    IdVPListResponseInterface,
    IdentityVerificationProviderInterface
} from "../models/identity-verification-providers";

const httpClient: (
    config: HttpRequestConfig
) => Promise<AxiosResponse> = AsgardeoSPAClient.getInstance().httpRequest.bind(
    AsgardeoSPAClient.getInstance()
);

/**
 * Delete an identity verification provider.
 * @param id - ID of the identity verification provider.
 * @returns - A promise containing the response from the API call.
 */
export const deleteIdentityVerificationProvider = async (id: string): Promise<AxiosResponse> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": AcceptHeaderValues.APP_JSON,
            "Content-Type": ContentTypeHeaderValues.APP_JSON
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.identityVerificationProviders }/${ id }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) =>  response)
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};

/**
 * Updates an identity verification provider.
 * @param id - ID of the identity verification provider.
 * @param rest - Rest of the data.
 * @returns - A promise containing the response from the API call.
 */
export const updateIdentityVerificationProvider = ({ id, ...rest }: IdentityVerificationProviderInterface):
    Promise<HttpResponse | undefined> => {

    const requestConfig: RequestConfigInterface = {
        data: rest,
        headers: {
            "Accept": AcceptHeaderValues.APP_JSON,
            "Content-Type": ContentTypeHeaderValues.APP_JSON
        },
        method: HttpMethods.PUT,
        url: `${ store.getState().config.endpoints.identityVerificationProviders }/${ id }`
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) =>  response)
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};

/**
 * Creates an identity verification provider.
 * @param data - Identity verification provider data.
 * @returns - A promise containing the response from the API call.
 */
export const createIdentityVerificationProvider = (data: IdentityVerificationProviderInterface):
    Promise<IdentityVerificationProviderInterface> => {

    const requestConfig: RequestConfigInterface = {
        data: data,
        headers: {
            "Accept": AcceptHeaderValues.APP_JSON,
            "Content-Type": ContentTypeHeaderValues.APP_JSON
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.identityVerificationProviders }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 201) {
                throw new IdentityAppsApiException(
                    "Identity verification provider creation received a non-201 status code.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config
                );
            }

            return Promise.resolve(response.data as IdentityVerificationProviderInterface);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config
            );
        });
};

/**
 * Gets the Identity Verification Providers list with limit and offset.
 *
 * @param limit - Maximum Limit of the application List.
 * @param offset - Offset for get to start.
 *
 * @returns A promise containing the response.
 */
export const getIdentityVerificationProvidersList = (
    limit: number,
    offset: number
): Promise<IdVPListResponseInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            limit,
            offset
        },
        url: store.getState().config.endpoints.identityVerificationProviders
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get Identity Verification Providers list."));
            }

            return Promise.resolve(response.data as IdVPListResponseInterface);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};
