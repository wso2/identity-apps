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

import { QueryParams, HttpMethods, UserStorePostData, TestConnection, PatchData } from "../models";
import { GlobalConfig, ServiceResourcesEndpoint } from "../configs";
import { AxiosHttpClient } from "@wso2is/http";

/**
 * Initialize an axios Http client.
 * @type { AxiosHttpClientInstance }
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Fetches all user stores
 * @param {QueryParams} params sort, filter, limit, attributes, offset
 * @return {Promise<any>} response
 */
export const getUserStores = (params: QueryParams): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": GlobalConfig.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.userStores,
        params
    };
    return httpClient
        .request(requestConfig)
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
 * Fetch types of user stores
 * @return {Promise<any>} response
 */
export const getTypes = (): Promise<any> => {
    const requestConfig = {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': GlobalConfig.clientHost,
            'Content-Type': 'application/json'
        },
        method: HttpMethods.GET,
        url: `${ServiceResourcesEndpoint.userStores}/meta/types`
    };
    return httpClient
        .request(requestConfig)
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
 * Gets the meta data of a type
 * 
 * @param {string} id Type ID
 * @param {QueryParams} params limit, offset, filter, sort, attributes
 * 
 * @return {Promise<any>}
 */
export const getAType = (id: string, params: QueryParams): Promise<any> => {
    const requestConfig = {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': GlobalConfig.clientHost,
            'Content-Type': 'application/json',
            params
        },
        method: HttpMethods.GET,
        url: `${ServiceResourcesEndpoint.userStores}/meta/types/${id}`,
        params
    };
    return httpClient
        .request(requestConfig)
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
 * Gets a user store by its id
 * @param {string} id User Store ID
 * @return {Promise<any>} response
 */
export const getAUserStore = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': GlobalConfig.clientHost,
            'Content-Type': 'application/json'
        },
        method: HttpMethods.GET,
        url: `${ServiceResourcesEndpoint.userStores}/${id}`
    };

    return httpClient
        .request(requestConfig)
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
 * Deletes a User Store
 * @param {string} id User Store ID
 * 
 * @return {Promise<any>} Response 
 */
export const deleteUserStore = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': GlobalConfig.clientHost,
            'Content-Type': 'application/json'
        },
        method: HttpMethods.DELETE,
        url: `${ServiceResourcesEndpoint.userStores}/${id}`
    };
    return httpClient
        .request(requestConfig)
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
 * Patches a user store
 * @param {string} id User Store ID
 * @param {string} path The path to patch
 * @param {string} value The data to be patched with
 * 
 * @return {Promise<any>} Response
 */
export const patchUserStore = (id: string, data: PatchData[]): Promise<any> => {
    const requestConfig = {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': GlobalConfig.clientHost,
            'Content-Type': 'application/json'
        },
        method: HttpMethods.PATCH,
        url: `${ServiceResourcesEndpoint.userStores}/${id}`,
        data
    };
    return httpClient
        .request(requestConfig)
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
 * Adds a user store
 * @param {UserStorePostData} data User Store Data
 * @return {Promise<any>} Response
 */
export const addUserStore = (data: UserStorePostData): Promise<any> => {
    const requestConfig = {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': GlobalConfig.clientHost,
            'Content-Type': 'application/json'
        },
        method: HttpMethods.POST,
        url: `${ServiceResourcesEndpoint.userStores}`,
        data
    };
    return httpClient
        .request(requestConfig)
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
 * Updates a User Store
 * @param {string} id User Store ID
 * @param {UserStorePostData} data Update Data
 */
export const updateUserStore = (id: string,data: UserStorePostData): Promise<any> => {
    const requestConfig = {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': GlobalConfig.clientHost,
            'Content-Type': 'application/json'
        },
        method: HttpMethods.PUT,
        url: `${ServiceResourcesEndpoint.userStores}/${id}`,
        data
    };
    return httpClient
        .request(requestConfig)
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
 * Tests a JDBC connection
 * @param {TestConnection} data Test Connection Data
 * @return {Promise<any>} Response 
 */
export const testConnection = (data: TestConnection): Promise<any> => {
    const requestConfig = {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': GlobalConfig.clientHost,
            'Content-Type': 'application/json'
        },
        method: HttpMethods.POST,
        url: `${ServiceResourcesEndpoint.userStores}/test-connection`,
        data
    };
    return httpClient
        .request(requestConfig)
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
