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

import { AsgardeoSPAClient, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { AcceptHeaderValues, ContentTypeHeaderValues, HttpMethods } from "@wso2is/core/models";
import { store } from "../../core";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../core/hooks/use-request";
import { IDVPListResponseInterface, IdentityVerificationProviderInterface } from "../models";

type HttpClientType = (config: HttpRequestConfig) => Promise<HttpResponse | undefined>;

const httpClient: HttpClientType = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

export const deleteIDVP = async (id: string): Promise<HttpResponse> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": AcceptHeaderValues.APP_JSON,
            "Content-Type": ContentTypeHeaderValues.APP_JSON
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.identityVerificationProviders }/${ id }`
    };

    return httpClient(requestConfig);
};

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

    return httpClient(requestConfig);
};

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
 * @returns Requested IDPs
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
