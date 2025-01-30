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
import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { ConnectionUIConstants } from "@wso2is/admin.connections.v1/constants/connection-ui-constants";
import { store } from "@wso2is/admin.core.v1/store";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import {
    FederatedAuthenticatorMetaInterface,
    IdentityProviderListResponseInterface,
    IdentityProviderTemplateListResponseInterface,
    LocalAuthenticatorInterface
} from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to get the IDP list with limit and offset.
 *
 * @param limit - Maximum Limit of the IdP List.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 * @param requiredAttributes - Extra attribute to be included in the list response. ex:`isFederationHub`
 * @param shouldFetch - Should fetch the data.
 *
 * @returns Requested IDPs
 */
export const useIdentityProviderList = <Data = IdentityProviderListResponseInterface, Error = RequestErrorInterface>(
    limit?: number,
    offset?: number,
    filter?: string,
    requiredAttributes?: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset,
            requiredAttributes
        },
        url: store.getState().config.endpoints.identityProviders
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(shouldFetch ? requestConfig : null);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Get federated authenticator metadata.
 *
 * @param authenticatorId - ID of the Federated Authenticator.
 * @returns A promise containing the response.
 */
export const getFederatedAuthenticatorMetadata = (authenticatorId: string): Promise<any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.identityProviders + "/meta/federated-authenticators/" +
            authenticatorId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to get federated authenticator metadata for: "
                    + authenticatorId));
            }

            return Promise.resolve(response.data as FederatedAuthenticatorMetaInterface);
        }).catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Gets the identity provider template list with limit and offset.
 *
 * @param limit - Maximum Limit of the identity provider template List.
 * @param offset - Offset for get to start.
 * @param filter - Search filter.
 *
 * @returns A promise containing the response.
 */
export const getIdentityProviderTemplateList = (limit?: number, offset?: number,
    filter?: string): Promise<IdentityProviderTemplateListResponseInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter,
            limit,
            offset
        },
        url: store.getState().config.endpoints.identityProviders + "/templates"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ConnectionUIConstants.ERROR_MESSAGES
                        .IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as IdentityProviderTemplateListResponseInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ConnectionUIConstants.ERROR_MESSAGES.IDENTITY_PROVIDER_TEMPLATES_LIST_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Get the list of local authenticators.
 *
 * @returns Response as a promise.
 * @throws IdentityAppsApiException
 */
export const getLocalAuthenticators = (): Promise<LocalAuthenticatorInterface[]> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.localAuthenticators
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<LocalAuthenticatorInterface[]>) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ConnectionUIConstants.ERROR_MESSAGES.LOCAL_AUTHENTICATORS_FETCH_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ConnectionUIConstants.ERROR_MESSAGES.LOCAL_AUTHENTICATORS_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
