/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { ServiceResourcesEndpoint } from "../configs";
import { AddExternalClaim, Claim, ClaimsGetParams, HttpMethods } from "../models";
import { AxiosHttpClient } from "@wso2is/http";
import { store } from "../store";

/**
 * The error code that is returned when there is no item in the list
 */
const RESOURCE_NOT_FOUND_ERROR_CODE = "CMT-50017";

/**
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}.
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Add a local claim.
 *
 * @param {Claim} data Adds this data.
 *
 * @return {Promise<any>} response
 */
export const addLocalClaim = (data: Claim): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.localClaims,
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
 * Fetch all local claims.
 *
 * @param {ClaimsGetParams} params limit, offset, sort, attributes, filter.
 *
 * @return {Promise<any>} response.
 */
export const getAllLocalClaims = (params: ClaimsGetParams): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.localClaims,
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
 * Gets the local claim with the given ID.
 *
 * @param {string} id The id of the local claim.
 *
 * @return {Promise<any>} response.
 */
export const getAClaim = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ServiceResourcesEndpoint.localClaims}/${id}`
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
 * Update a Local Claim ID with the given data.
 *
 * @param {string} id Local Claim ID.
 *
 * @param {Claim} data Updates with this data.
 *
 * @return {Promise<any>} response.
 */
export const updateAClaim = (id: string, data: Claim): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${ServiceResourcesEndpoint.localClaims}/${id}`,
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
 * Deletes the local claim with the given ID.
 *
 * @param {string} id Local Claim ID.
 *
 * @return {Promise<any>} response.
 */
export const deleteAClaim = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ServiceResourcesEndpoint.localClaims}/${id}`
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
 * Add a claim dialect.
 *
 * @param {string} dialectURI Adds this dialect URI.
 *
 * @return {Promise<any>} response.
 */
export const addDialect = (dialectURI: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: ServiceResourcesEndpoint.claims,
        data: {
            dialectURI
        }
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
 * Get the Claim Dialect with the given ID.
 *
 * @param {string} id Claim Dialect ID.
 *
 * @return {Promise<any>} response.
 */
export const getADialect = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ServiceResourcesEndpoint.claims}/${id}`
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
 * Get all the claim dialects.
 *
 * @param {ClientGetParams} params sort, filter, offset, attributes, limit.
 *
 * @return {Promise<any>} response.
 */
export const getDialects = (params: ClaimsGetParams): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: ServiceResourcesEndpoint.claims,
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
 * Update the claim dialect with the given ID.
 *
 * @param {string} id Claim Dialect ID.
 * @param {string} data Updates with this data.
 *
 * @return {Promise<any>} response.
 */
export const updateADialect = (id: string, dialectURI: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${ServiceResourcesEndpoint.claims}/${id}`,
        data: {
            dialectURI
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

/**
 * Delete the claim dialect with the given ID.
 *
 * @param {string} id Claim Dialect ID.
 *
 * @return {Promise<any>} response.
 */
export const deleteADialect = (id: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ServiceResourcesEndpoint.claims}/${id}`
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
 * Create an external claim.
 *
 * @param {string} dialectID Claim Dialect ID.
 * @param {AddExternalClaim} data Adds this data.
 *
 * @return {Promise<any>} response.
 */
export const addExternalClaim = (dialectID: string, data: AddExternalClaim): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ServiceResourcesEndpoint.externalClaims.replace("{}", dialectID)}`,
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
 * Get all the external claims.
 *
 * @param {string } dialectID Claim Dialect ID.
 * @param {ClaimsGetParams} params limit, offset, filter, attributes, sort.
 *
 * @return {Promise<any>} response.
 */
export const getAllExternalClaims = (dialectID: string, params: ClaimsGetParams): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ServiceResourcesEndpoint.externalClaims?.replace("{}", dialectID)}`,
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
            if (error?.response?.data?.code !== RESOURCE_NOT_FOUND_ERROR_CODE) {
                return Promise.reject(error?.response?.data);
            }
        });
};

/**
 * Gets the external claim with the given ID for the given dialect.
 *
 * @param {string} dialectID Claim Dialect ID.
 * @param {string} claimID External Claim ID.
 *
 * @return {Promise<any>} response.
 */
export const getAnExternalClaim = (dialectID: string, claimID: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ServiceResourcesEndpoint.externalClaims.replace("{}", dialectID)}/${claimID}`
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
 * Update an external claim.
 *
 * @param {string} dialectID Dialect ID.
 * @param {string} claimID External Claim ID.
 * @param {AddExternalClaim} data Updates with this data.
 *
 * @return {Promise<any>} response.
 */
export const updateAnExternalClaim = (dialectID: string, claimID: string, data: AddExternalClaim): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${ServiceResourcesEndpoint.externalClaims.replace("{}", dialectID)}/${claimID}`,
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
 * Delete an external claim.
 *
 * @param {string} dialectID Dialect ID.
 * @param {string} claimID Claim ID.
 *
 * @return {Promise<any>} response.
 */
export const deleteAnExternalClaim = (dialectID: string, claimID: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${ServiceResourcesEndpoint.externalClaims.replace("{}", dialectID)}/${claimID}`
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
