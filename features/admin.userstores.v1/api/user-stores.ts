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
import { UserstoreConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods, UserstoreListResponseInterface } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../admin.core.v1/hooks/use-request";
import { store } from "../../admin.core.v1/store";
import {
    AttributeMapping,
    PatchData,
    QueryParams,
    TestConnection,
    UserStore,
    UserStoreAttributes,
    UserStoreListItem,
    UserStorePostData
} from "../models";

/**
 * The error code that is returned when there is no item in the list.
 */
const RESOURCE_NOT_FOUND_ERROR_MESSAGE: string = "Resource not found.";

/**
 * Initialize an axios Http client.
 *
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches all userstores.
 *
 * @param params - sort, filter, limit, attributes, offset.
 * @returns user stores
 */
export const getUserStores = (params: QueryParams | any): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params,
        url: store.getState().config.endpoints.userStores
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            if (error?.response?.data?.message !== RESOURCE_NOT_FOUND_ERROR_MESSAGE) {
                return Promise.reject(error?.response?.data);
            }
        });
};

/**
 * Retrieve the list of user stores that are currently in the system.
 * TODO: Return `response.data` rather than `response` and stop returning any.
 *
 * @returns user store list
 */
export const getUserStoreList = (): Promise<UserstoreListResponseInterface[] | any> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.userStores
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    UserstoreConstants.USERSTORES_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                UserstoreConstants.USERSTORES_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Hook to get the Userstores from the API.
 *
 * @param params - sort, filter, limit, attributes, offset.
 * @returns user store list with SWR hook
 */
export const useUserStores = <Data = UserStoreListItem[], Error = RequestErrorInterface>(
    params: QueryParams,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params,
        url: store.getState().config.endpoints.userStores
    };

    const {
        data,
        error,
        isValidating,
        mutate,
        response
    } = useRequest<Data, Error>(shouldFetch ? requestConfig: null);

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate,
        response
    };
};

/**
 * Hook to get details of a userstore with a given ID
 */
export const useUserStore = <Data = UserStore, Error = RequestErrorInterface>(
    id: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.userStores}/${id}`
    };

    const {
        data,
        error,
        isValidating,
        mutate,
        response
    } = useRequest<Data, Error>(shouldFetch ? requestConfig: null);

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate,
        response
    };
};

/**
 * Fetch types of userstores.
 *
 * @returns userstore types.
 */
export const getUserstoreTypes = (): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.userStores}/meta/types`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Gets the meta data of a type.
 *
 * @param id - Type ID.
 * @param params - limit, offset, filter, sort, attributes.
 *
 * @returns metadata of a userstore type
 */
export const getAType = (id: string, params: QueryParams): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json",
            params
        },
        method: HttpMethods.GET,
        params,
        url: `${store.getState().config.endpoints.userStores}/meta/types/${id}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Gets a userstore by its id.
 *
 * @param id - Userstore ID.
 *
 * @returns userstore details of the given userstore ID
 */
export const getAUserStore = (id: string): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.userStores}/${id}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Deletes a Userstore.
 *
 * @param id - Userstore ID.
 *
 * @returns deleted userstore.
 */
export const deleteUserStore = (id: string): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.userStores}/${id}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Patches a userstore.
 *
 * @param id - Userstore ID.
 * @param data - Payload.
 * @returns patched userstore details
 */
export const patchUserStore = (id: string, data: PatchData[]): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${store.getState().config.endpoints.userStores}/${id}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Adds a userstore.
 *
 * @param data -  Userstore Data.
 *
 * @returns created userstore.
 */
export const addUserStore = (data: UserStorePostData): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${store.getState().config.endpoints.userStores}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 201) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Updates a Userstore.
 *
 * @param id - Userstore ID.
 * @param data - Update Data.
 *
 * @returns updated userstore.
 */
export const updateUserStore = (id: string, data: UserStorePostData): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${store.getState().config.endpoints.userStores}/${id}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Tests a JDBC connection.
 *
 * @param data - Test Connection Data.
 *
 * @returns connection status
 */
export const testConnection = (data: TestConnection): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${store.getState().config.endpoints.userStores}/test-connection`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Gets the user store attributes.
 *
 * @param id - Type ID.
 * @param params - limit, offset, filter, sort, attributes.
 *
 * @returns userstore attributes.
 */
export const getUserStoreAttributes = (id: string, params: QueryParams): Promise<UserStoreAttributes> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json",
            params
        },
        method: HttpMethods.GET,
        params,
        url: `${store.getState().config.endpoints.userStores}/meta/types/${id}/attributes`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Update the secondary user store attribute mappings by it's domain id.
 *
 * @param userstoreId - userstore ID.
 * @param data - attribute mappings.
 *
 * @returns updated userstore attribute mappings.
 */
export const updateUserStoreAttributeMappings = (userstoreId: string, data: AttributeMapping[]): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${store.getState().config.endpoints.userStores}/${userstoreId}/attribute-mappings`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};
