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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import useRequest, {
    RequestErrorInterface,
    RequestResultInterface
} from "../../../../../admin-core-v1/hooks/use-request";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../../../../admin-core-v1/store";
import { 
    AuthorizedAPIListItemInterface, 
    AuthorizedPermissionListItemInterface, 
    PolicyInterface, 
    SearchedAPIListItemInterface 
} from "../../models";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Get Subscribed API resources.
 *
 * @param appId - application ID.
 * @returns `Promise<AuthorizedAPIListItemInterface[]>`
 * @throws `IdentityAppsApiException`
 */
export const useSubscribedAPIResources = <Data = AuthorizedAPIListItemInterface[], Error = RequestErrorInterface>(
    appId: string
): RequestResultInterface<Data, Error> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.authzEndpoint }/applications/${ appId }/authorized-apis`
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
 * Unsubscribe subscribed API resources.
 * 
 * @param appId - application ID.
 * @param apiId - API ID.
 * @returns `Promise<null | IdentityAppsApiException>`
 * @throws `IdentityAppsApiException`
 */
export const unsubscribeAPIResources = (appId: string, apiId: string): Promise<null | IdentityAppsApiException> => {
    
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ store.getState().config.endpoints.authzEndpoint }/applications/${ appId }` + 
            `/authorized-apis/${ apiId }`
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
 * Get Subscribed API resources.
 *
 * @param appId - application ID.
 * @returns `Promise<AuthorizedAPIListItemInterface[]>`
 * @throws `IdentityAppsApiException`
 */
export const useScopesOfAPIResources = 
    <Data = AuthorizedPermissionListItemInterface[], Error = RequestErrorInterface>(
        apiResourceId: string
    ): RequestResultInterface<Data, Error> => {

        const requestConfig: AxiosRequestConfig = {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            url: `${ store.getState().config.endpoints.authzEndpoint }/api-resources/${ apiResourceId }/permissions`
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
 * Create authorized API resource.
 * 
 * @param appId - application ID.
 * @param apiId - API ID.
 * @param addedScopes - added scopes.
 * @returns `Promise<null | IdentityAppsApiException>`
 * @throws `IdentityAppsApiException`
 */
export const createAuthorizedAPIResource = (appId: string, apiId: string, scopes: string[], policyIdentifier: string)
    : Promise<null | IdentityAppsApiException> => {
    
    const requestConfig: AxiosRequestConfig = {
        data: {
            apiId,
            permissions: scopes,
            policyIdentifier: policyIdentifier
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.authzEndpoint }/applications/${ appId }/authorized-apis`
    };
    
    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 201) {
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
 * Unsubscribe subscribed API resources.
 * 
 * @param appId - application ID.
 * @param apiId - API ID.
 * @returns `Promise<null | IdentityAppsApiException>`
 * @throws `IdentityAppsApiException`
 */
export const patchScopesOfAPIResource = (appId: string, apiId: string, addedScopes: string[], deletedScopes: string[])
    : Promise<null | IdentityAppsApiException> => {
    
    const requestConfig: AxiosRequestConfig = {
        data: {
            addedPermissions: addedScopes,
            removedPermissions: deletedScopes
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.authzEndpoint }/applications/${ appId }` + 
            `/authorized-apis/${ apiId }`
    };
    
    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
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
 * Get policies of the application
 *
 * @param appId - application ID.
 * @returns `Promise<AuthorizedAPIListItemInterface[]>`
 * @throws `IdentityAppsApiException`
 */
export const usePolicies = <Data = PolicyInterface, Error = RequestErrorInterface>(
    appId: string
): RequestResultInterface<Data, Error> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.authzEndpoint }/applications/${ appId }/policy`
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
 * Unsubscribe subscribed API resources.
 * 
 * @param appId - application ID.
 * @param apiId - API ID.
 * @returns `Promise<null | IdentityAppsApiException>`
 * @throws `IdentityAppsApiException`
 */
export const patchPolicies = (appId: string, addedPolicies: string[], removedPolicies: string[])
    : Promise<null | IdentityAppsApiException> => {
    
    const requestConfig: AxiosRequestConfig = {
        data: {
            added_policies: addedPolicies,
            removed_policies: removedPolicies
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${ store.getState().config.endpoints.authzEndpoint }/applications/${ appId }/policy`
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
 * Search API resources
 * 
 * @param apiResourceIds - API resource IDs.
 * @param attributes - Attributes to be returned.
 * @returns `Promise<SearchedAPIListItemInterface[] | IdentityAppsApiException>`
 * @throws `IdentityAppsApiException`
 */
export const searchAPIResources = (apiResourceIds: string[], attributes: string[])
    : Promise<SearchedAPIListItemInterface[] | IdentityAppsApiException> => {
    
    const requestConfig: AxiosRequestConfig = {
        data: {
            apiResourceIds,
            attributes
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ store.getState().config.endpoints.authzEndpoint }/api-resources/.search`
    };
    
    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    response.data.description,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as SearchedAPIListItemInterface[]);
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
