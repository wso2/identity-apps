/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AsgardeoSPAClient, HttpClientInstance, HttpResponse } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AcceptHeaderValues, ContentTypeHeaderValues, HttpMethods } from "@wso2is/core/models";
import { AxiosError } from "axios";
import { store } from "../../admin.core.v1";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../admin.core.v1/hooks/use-request";
import { IDVPListResponseInterface, IdentityVerificationProviderInterface } from "../models";

const httpClient: HttpClientInstance = AsgardeoSPAClient
    .getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Delete an identity verification provider.
 * @param id - ID of the identity verification provider.
 * @returns - A promise containing the response from the API call.
 */
export const deleteIDVP = async (id: string): Promise<HttpResponse> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": AcceptHeaderValues.APP_JSON,
            "Content-Type": ContentTypeHeaderValues.APP_JSON
        },
        method: HttpMethods.DELETE,
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
 * @param id - ID of the identity verification provider (can be undefined).
 * @param rest - Rest of the data.
 * @returns - A promise containing the response from the API call.
 */
export const createIdentityVerificationProvider = (data: IdentityVerificationProviderInterface):
    Promise<HttpResponse | undefined> => {

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
 * Hook to get an identity verification provider.
 * @param id - ID of the identity verification provider.
 * @returns - Requested IDVP
 */
export const useIdentityVerificationProvider = <Data = IdentityVerificationProviderInterface,
    Error = RequestErrorInterface>(id: string): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": AcceptHeaderValues.APP_JSON
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.identityVerificationProviders }/${ id }`
    };
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
 * Hook to get the identity verification provider list with limit and offset.
 *
 * @param limit - Maximum Limit of the identity verification provider List.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 * @param requiredAttributes - Extra attribute to be included in the list response. ex:`isFederationHub`
 *
 * @returns - Requested IDVP list.
 */
export const useIdentityVerificationProviderList = <Data = IDVPListResponseInterface, Error = RequestErrorInterface>(
    limit?: number,
    offset?: number,
    filter?: string,
    requiredAttributes?: string
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": AcceptHeaderValues.APP_JSON,
            "Content-Type": ContentTypeHeaderValues.APP_JSON
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset,
            requiredAttributes
        },
        url: store.getState().config.endpoints.identityVerificationProviders
    };
    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};
