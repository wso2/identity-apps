/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import useRequest, {
    RequestErrorInterface,
    RequestResultInterface
} from "../../core/hooks/use-request";
import { store } from "../../core/store";
import { APIResourceInterface, APIResourcePermissionInterface, APIResourcesListInterface, UpdatedAPIResourceInterface }
    from "../models";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Get API resources for the identifier validation.
 * Only to be used for the identifier validation.
 *
 * @param filter - filter.
 * @returns `Promise<APIResourcesListInterface | IdentityAppsApiException>`
 */
export const getAPIResourcesForIdenitifierValidation = (
    filter: string
): Promise<APIResourcesListInterface> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            filter
        },
        url: `${store.getState().config.endpoints.apiResources}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status === 200) {
                return Promise.resolve(response.data as APIResourcesListInterface);
            } else {
                throw new IdentityAppsApiException(
                    response.data.description,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Get API resources.
 *
 * @param after - after.
 * @param before - before.
 * @param filter - filter.
 * @param shouldFetch - whether to fetch or not.
 * @returns `Promise<APIResourcesListInterface>`
 * @throws `IdentityAppsApiException`
 */
export const useAPIResources = <Data = APIResourcesListInterface, Error = RequestErrorInterface>(
    after?: string,
    before?: string,
    filter?: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            after,
            before,
            filter
        },
        url: `${store.getState().config.endpoints.apiResources}`
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
 * Get API resources.
 *
 * @param after - after.
 * @param before - before.
 * @param filter - filter.
 * @param shouldFetch - whether to fetch or not.
 * @returns `Promise<APIResourcesListInterface>`
 * @throws `IdentityAppsApiException`
 */
export const getAPIResources = (
    after?: string,
    before?: string,
    filter?: string
): Promise<APIResourcesListInterface> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            after,
            before,
            filter
        },
        url: `${store.getState().config.endpoints.apiResources}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status === 200) {
                return Promise.resolve(response.data as APIResourcesListInterface);
            } else {
                throw new IdentityAppsApiException(
                    response.data.description,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 *
 * @param apiResourceId - id of the API resource
 * @returns `Promise<APIResourceInterface>`
 * @throws `IdentityAppsApiException`
 */
export const useAPIResourceDetails = <Data = APIResourceInterface, Error = RequestErrorInterface>(
    apiResourceId: string
): RequestResultInterface<Data, Error> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.apiResources}/${apiResourceId}`
    };

    /**
     * Pass `null` if the `apiResourceId` is not available. This will prevent the request from being called.
     */
    const { data, error, isValidating, mutate } = useRequest<Data, Error>(apiResourceId ? requestConfig : null);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Get permissions of an API resource for the permission validation.
 * Only to be used for the permission validation.
 *
 * @param filter - filter.
 * @returns `Promise<APIResourcePermissionInterface[]>`
 * @throws `IdentityAppsApiException`
 */
export const getAPIResourcePermissions = (
    filter: string
): Promise<APIResourcePermissionInterface[]> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: { filter },
        url: `${store.getState().config.endpoints.scopes}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status === 200) {
                return Promise.resolve(response.data as APIResourcePermissionInterface[]);
            } else {
                throw new IdentityAppsApiException(
                    response.data.description,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Delete an API resource.
 *
 * @param apiResourceId - UUID of the API resource that needed to be deleted.
 * @returns `Promise<null | IdentityAppsApiException>`
 * @throws `IdentityAppsApiException`
 */
export const deleteAPIResource = (apiResourceId: string): Promise<null | IdentityAppsApiException> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.apiResources}/${apiResourceId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    response.data.description,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Update an API resource.
 *
 * @param apiResourceId - UUID of the API resource that needed to be updated.
 * @param updateAPIResourceBody - Body of the API resource that needed to be updated.
 * @returns `Promise<null | IdentityAppsApiException>`
 */
export const updateAPIResource = (
    apiResourceId: string,
    updateAPIResourceBody: UpdatedAPIResourceInterface
): Promise<null | IdentityAppsApiException> => {

    const requestConfig: AxiosRequestConfig = {
        data: updateAPIResourceBody,
        method: HttpMethods.PATCH,
        url: `${store.getState().config.endpoints.apiResources}/${apiResourceId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Create an API resource.
 *
 * @param apiResourceBody - Body of the API resource that needed to be created.
 * @returns `Promise<null | IdentityAppsApiException>`
 */
export const createAPIResource = (
    apiResourceBody: APIResourceInterface
): Promise<APIResourceInterface | void> => {

    const requestConfig: AxiosRequestConfig = {
        data: apiResourceBody,
        method: HttpMethods.POST,
        url: `${store.getState().config.endpoints.apiResources}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Delete a scope from an API resource.
 *
 * @param apiResourceId - UUID of the API resource.
 * @param deleteScopeName - Name of the scope that needs to be deleted.
 * @returns `Promise<null | IdentityAppsApiException>`
 */
export const deleteScopeFromAPIResource = (
    apiResourceId: string,
    deletingScopeName: string
): Promise<null | IdentityAppsApiException> => {

    const requestConfig: AxiosRequestConfig = {
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.apiResources}/${apiResourceId}/scopes/${deletingScopeName}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.message,
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};
