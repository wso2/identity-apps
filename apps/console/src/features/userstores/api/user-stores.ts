/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the 'License'); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { UserstoreConstants } from "@wso2is/core/constants";
import { HttpMethods, UserstoreListResponseInterface } from "@wso2is/core/models";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "../../core/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AxiosError, AxiosResponse } from "axios";
import { store } from "../../core/store";
import {
    AttributeMapping,
    PatchData,
    QueryParams,
    TestConnection,
    UserStoreAttributes,
    UserStoreListItem,
    UserStorePostData
} from "../models";

/**
 * The error code that is returned when there is no item in the list.
 */
const RESOURCE_NOT_FOUND_ERROR_MESSAGE = "Resource not found.";

/**
 * Initialize an axios Http client.
 *
 * @type { AxiosHttpClientInstance }
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches all userstores.
 *
 * @param {QueryParams} params sort, filter, limit, attributes, offset.
 *
 * @return {Promise<any>} response.
 */
export const getUserStores = (params: QueryParams): Promise<any> => {
    const requestConfig = {
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
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            if (error?.response?.data?.message !== RESOURCE_NOT_FOUND_ERROR_MESSAGE) {
                return Promise.reject(error?.response?.data);
            }
        });
};

/**
 * Retrieve the list of user stores that are currently in the system.
 * TODO: Return `response.data` rather than `response` and stop returning any.
 *
 * @return {Promise<UserstoreListResponseInterface[] | any>}
 * @throws {IdentityAppsApiException}
 */
export const getUserStoreList = (): Promise<UserstoreListResponseInterface[] | any> => {

    const requestConfig = {
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
 * @param {QueryParams} params - sort, filter, limit, attributes, offset.
 * @returns {RequestResultInterface<Data, Error>}
 */
export const useUserStores = <Data = UserStoreListItem[], Error = RequestErrorInterface>(
    params: QueryParams
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
    } = useRequest<Data, Error>(requestConfig);

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
 * @return {Promise<any>} response.
 */
export const getUserstoreTypes = (): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.userStores}/meta/types`
    };
    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Gets the meta data of a type.
 *
 * @param {string} id Type ID.
 * @param {QueryParams} params limit, offset, filter, sort, attributes.
 *
 * @return {Promise<any>} Response.
 */
export const getAType = (id: string, params: QueryParams): Promise<any> => {
    const requestConfig = {
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
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Gets a userstore by its id.
 *
 * @param {string} id Userstore ID.
 *
 * @return {Promise<any>} response.
 */
export const getAUserStore = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.userStores}/${id}`
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Deletes a Userstore.
 *
 * @param {string} id Userstore ID.
 *
 * @return {Promise<any>} Response.
 */
export const deleteUserStore = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.userStores}/${id}`
    };
    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 204) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Patches a userstore.
 *
 * @param {string} id - Userstore ID.
 * @param {PatchData[]} data - Payload.
 * @return {Promise<any>} Response
 */
export const patchUserStore = (id: string, data: PatchData[]): Promise<any> => {
    const requestConfig = {
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
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Adds a userstore.
 *
 * @param {UserStorePostData} data Userstore Data.
 *
 * @return {Promise<any>} Response.
 */
export const addUserStore = (data: UserStorePostData): Promise<any> => {
    const requestConfig = {
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
        .then((response) => {
            if (response.status !== 201) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Updates a Userstore.
 *
 * @param {string} id Userstore ID.
 * @param {UserStorePostData} data Update Data.
 *
 * @return {Promise<any>} response.
 */
export const updateUserStore = (id: string, data: UserStorePostData): Promise<any> => {
    const requestConfig = {
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
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Tests a JDBC connection.
 *
 * @param {TestConnection} data Test Connection Data.
 *
 * @return {Promise<any>} Response.
 */
export const testConnection = (data: TestConnection): Promise<any> => {
    const requestConfig = {
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
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Gets the user store attributes.
 *
 * @param {string} id Type ID.
 * @param {QueryParams} params limit, offset, filter, sort, attributes.
 *
 * @return {Promise<any>} Response.
 */
export const getUserStoreAttributes = (id: string, params: QueryParams): Promise<UserStoreAttributes> => {
    const requestConfig = {
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
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Update the secondary user store attribute mappings by it's domain id.
 *
 * @param {string} userstoreId userstore ID.
 * @param {AttributeMapping[]} data attribute mappings.
 *
 * @return {Promise<any>} Response.
 */
export const updateUserStoreAttributeMappings = (userstoreId: string, data: AttributeMapping[]): Promise<any> => {
    const requestConfig = {
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
        .then((response) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            return Promise.reject(error?.response?.data);
        });
};
