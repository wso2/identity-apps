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

import { QueryParams, HttpMethods, UserStorePostData, TestConnection } from "../models";
import { GlobalConfig, ServiceResourcesEndpoint } from "../configs";
import { AxiosHttpClient } from "@wso2is/http";

/**
 * Initialize an axios Http client.
 * @type { AxiosHttpClientInstance }
 */
const httpClient = AxiosHttpClient.getInstance();

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

export const patchUserStore = (id: string,path: string,value: string): Promise<any> => {
    const requestConfig = {
        headers: {
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': GlobalConfig.clientHost,
            'Content-Type': 'application/json'
        },
        method: HttpMethods.PATCH,
        url: `${ServiceResourcesEndpoint.userStores}/${id}`,
        data: {
            operation: "REPLACE",
            path,
            value
        }
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
