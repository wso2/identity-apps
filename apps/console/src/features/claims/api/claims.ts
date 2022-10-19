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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { ClaimConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { Claim, ClaimDialect, ClaimsGetParams, ExternalClaim, HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { store } from "../../core";
import { ClaimManagementConstants } from "../constants";
import { AddExternalClaim, ServerSupportedClaimsInterface } from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Add a local claim.
 *
 * @param {Claim} data Adds this data.
 * @return {Promise<AxiosResponse>} response
 */
export const addLocalClaim = (data: Claim): Promise<AxiosResponse> => {
    const requestConfig = {
        data,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.localClaims
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 201) {
                throw new IdentityAppsApiException(
                    ClaimManagementConstants.ADD_LOCAL_CLAIM_REQUEST_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.localClaims}/${id}`
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
        data,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${store.getState().config.endpoints.localClaims}/${id}`
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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.localClaims}/${id}`
    };

    return httpClient(requestConfig)
        .then((response) => {
            if (response.status !== 204) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error) => {
            /*
            TODO:
            Due to : https://github.com/wso2/product-is/issues/8729. We are hard coding following error response for
            this particular error code. Once the issue resolved at API level, we can remove this hardcoded response.
            { Issue Description : When deleting a local attribute which is also having associations, error message
            contains the word "claim" instead of "attribute" }
            { Hardcoded solution : Refactor error response by replacing "claim" with "attribute" }
             */
            if (error?.response?.data?.code === "CMT-50031") {
                const hardCodedResponse =
                    {
                        code: error?.response?.data?.code,
                        description: "Unable to remove local attribute while having associations with external claims.",
                        message: "Unable to remove local attribute.",
                        traceId: error?.response?.data?.traceId
                    };

                return Promise.reject(hardCodedResponse);
            }

            return Promise.reject(error?.response?.data);
        });
};

/**
 * Add a claim dialect.
 *
 * @param {string} dialectURI Adds this dialect URI.
 * @return {Promise<AxiosResponse>} response.
 */
export const addDialect = (dialectURI: string): Promise<AxiosResponse> => {

    const requestConfig = {
        data: {
            dialectURI
        },
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.claims
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 201) {
                throw new IdentityAppsApiException(
                    ClaimManagementConstants.ADD_DIALECT_REQUEST_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.claims}/${id}`
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
 * Update the claim dialect with the given ID.
 *
 * @param {string} id Claim Dialect ID.
 * @param {string} dialectURI Updates with this data.
 *
 * @return {Promise<any>} response.
 */
export const updateADialect = (id: string, dialectURI: string): Promise<any> => {
    const requestConfig = {
        data: {
            dialectURI
        },
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${store.getState().config.endpoints.claims}/${id}`
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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.claims}/${id}`
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
 * Create an external claim.
 *
 * @param {string} dialectID Claim Dialect ID.
 * @param {AddExternalClaim} data Adds this data.
 *
 * @return {Promise<any>} response.
 */
export const addExternalClaim = (dialectID: string, data: AddExternalClaim): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${store.getState().config.endpoints.externalClaims.replace("{}", dialectID)}`
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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.externalClaims.replace("{}", dialectID)}/${claimID}`
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
 * Gets the external claims with the given ID of the dialect.
 *
 * @param {string} dialectID Claim Dialect ID. *
 * @return {Promise<any>} response.
 */
export const getExternalClaims = (dialectID: string): Promise<any> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.externalClaims.replace("{}", dialectID)}`
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
        data,
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${store.getState().config.endpoints.externalClaims.replace("{}", dialectID)}/${claimID}`
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
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.externalClaims.replace("{}", dialectID)}/${claimID}`
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
 * Retrieves a list of all the server supported claims
 * per the given schema id.
 * 
 * @param id - Selected schema id
 * @returns - list of 
 */
export const getServerSupportedClaimsForSchema = (id: string): Promise<ServerSupportedClaimsInterface> => {
    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.serverSupportedSchemas}/${id}`
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
 * Fetch all local claims.
 *
 * @param {ClaimsGetParams} params - limit, offset, sort, attributes, filter.
 * @return {Promise<Claim[]>} response.
 * @throws {IdentityAppsApiException}
 */
export const getAllLocalClaims = (params: ClaimsGetParams): Promise<Claim[]> => {

    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params,
        url: store.getState().config.endpoints.localClaims
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ClaimConstants.ALL_LOCAL_CLAIMS_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ClaimConstants.ALL_LOCAL_CLAIMS_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Get all the claim dialects.
 *
 * @param {ClaimsGetParams} params - sort, filter, offset, attributes, limit.
 * @return {Promise<ClaimDialect[]>} response.
 * @throws {IdentityAppsApiException}
 */
export const getDialects = (params: ClaimsGetParams): Promise<ClaimDialect[]> => {

    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params,
        url: store.getState().config.endpoints.claims
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ClaimConstants.DIALECTS_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ClaimConstants.DIALECTS_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Get all the external claims.
 *
 * @param {string } dialectID - Claim Dialect ID.
 * @param {ClaimsGetParams} params - limit, offset, filter, attributes, sort.
 * @return {Promise<ExternalClaim[]>} response.
 * @throws {IdentityAppsApiException}
 */
export const getAllExternalClaims = (dialectID: string, params: ClaimsGetParams): Promise<ExternalClaim[]> => {

    const requestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params,
        url: `${store.getState().config.endpoints.externalClaims.replace("{}", dialectID)}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ClaimConstants.ALL_EXTERNAL_CLAIMS_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            if (error?.response?.data?.code !== ClaimManagementConstants.RESOURCE_NOT_FOUND_ERROR_CODE) {
                throw new IdentityAppsApiException(
                    ClaimConstants.ALL_EXTERNAL_CLAIMS_FETCH_REQUEST_ERROR,
                    error.stack,
                    error.code,
                    error.request,
                    error.response,
                    error.config);
            }

            return Promise.resolve([]);
        });
};
