/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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
import { ClaimConstants } from "@wso2is/core/constants";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import {
    Claim,
    ClaimDialect,
    ClaimDialectsGetParams,
    ClaimsGetParams,
    ExternalClaim,
    HttpMethods
} from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "@wso2is/admin.core.v1";
import { ClaimManagementConstants } from "../constants";
import { AddExternalClaim, ServerSupportedClaimsInterface } from "../models";

/**
 * Get an axios instance.
 *
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Add a local claim.
 *
 * @param data - Adds this data.
 *
 * @returns response.
 */
export const addLocalClaim = (data: Claim): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
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
 * @param id - The id of the local claim.
 *
 * @returns response.
 */
export const getAClaim = (id: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.localClaims}/${id}`
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
 * Update a Local Claim ID with the given data.
 *
 * @param id - Local Claim ID.
 * @param data - Updates with this data.
 *
 * @returns response.
 */
export const updateAClaim = (id: string, data: Claim): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
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
 * Deletes the local claim with the given ID.
 *
 * @param id - Local Claim ID.
 *
 * @returns response.
 */
export const deleteAClaim = (id: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.localClaims}/${id}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            /*
            TODO:
            Due to : https://github.com/wso2/product-is/issues/8729. We are hard coding following error response for
            this particular error code. Once the issue resolved at API level, we can remove this hardcoded response.
            { Issue Description : When deleting a local attribute which is also having associations, error message
            contains the word "claim" instead of "attribute" }
            { Hardcoded solution : Refactor error response by replacing "claim" with "attribute" }
             */
            if (error?.response?.data?.code === "CMT-50031") {
                const hardCodedResponse: { code: string, description: string, message: string, traceId: string } =
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
 * @param dialectURI - Adds this dialect URI.
 * @returns response.
 */
export const addDialect = (dialectURI: string): Promise<AxiosResponse> => {

    const requestConfig: AxiosRequestConfig = {
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
 * @param id - Claim Dialect ID.
 *
 * @returns response.
 */
export const getADialect = (id: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.claims}/${id}`
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
 * Update the claim dialect with the given ID.
 *
 * @param id - Claim Dialect ID.
 * @param dialectURI - Updates with this data.
 *
 * @returns response.
 */
export const updateADialect = (id: string, dialectURI: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
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
 * Delete the claim dialect with the given ID.
 *
 * @param id - Claim Dialect ID.
 *
 * @returns response.
 */
export const deleteADialect = (id: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.claims}/${id}`
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
 * Create an external claim.
 *
 * @param dialectID - Claim Dialect ID.
 * @param data - Adds this data.
 *
 * @returns response.
 */
export const addExternalClaim = (dialectID: string, data: AddExternalClaim): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
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
 * Gets the external claim with the given ID for the given dialect.
 *
 * @param dialectID - Claim Dialect ID.
 * @param claimID - External Claim ID.
 *
 * @returns response.
 */
export const getAnExternalClaim = (dialectID: string, claimID: string): Promise<ExternalClaim> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.externalClaims.replace("{}", dialectID)}/${claimID}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ClaimManagementConstants.EXTERNAL_CLAIM_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR,
                    null,
                    response?.status,
                    response?.request,
                    response,
                    response?.config);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ClaimManagementConstants.EXTERNAL_CLAIM_FETCH_REQUEST_ERROR,
                error?.stack,
                error?.code,
                error?.request,
                error?.response,
                error?.config);
        });
};

/**
 * Gets the external claims with the given ID of the dialect.
 *
 * @param dialectID - Claim Dialect ID.
 *
 * @returns response.
 * @throws IdentityAppsApiException.
 */
export const getExternalClaims = (dialectID: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
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
            throw new IdentityAppsApiException(
                ClaimConstants.ALL_EXTERNAL_CLAIMS_FETCH_REQUEST_ERROR,
                error.stack,
                error.response.status,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Update an external claim.
 *
 * @param dialectID - Dialect ID.
 * @param claimID - External Claim ID.
 * @param data - Updates with this data.
 *
 * @returns response.
 */
export const updateAnExternalClaim = (dialectID: string, claimID: string, data: AddExternalClaim): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
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
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ClaimManagementConstants.EXTERNAL_CLAIM_UPDATE_REQUEST_INVALID_RESPONSE_CODE_ERROR,
                    null,
                    response?.status,
                    response?.request,
                    response,
                    response?.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                ClaimManagementConstants.EXTERNAL_CLAIM_UPDATE_REQUEST_ERROR,
                error?.stack,
                error?.response?.status,
                error?.request,
                error?.response,
                error?.config);
        });
};

/**
 * Delete an external claim.
 *
 * @param dialectID - Dialect ID.
 * @param claimID - Claim ID.
 *
 * @returns response.
 */
export const deleteAnExternalClaim = (dialectID: string, claimID: string): Promise<any> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.externalClaims.replace("{}", dialectID)}/${claimID}`
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
 * Retrieves a list of all the server supported claims
 * per the given schema id.
 *
 * @param id - Selected schema id
 *
 * @returns response.
 */
export const getServerSupportedClaimsForSchema = (id: string): Promise<ServerSupportedClaimsInterface> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.serverSupportedSchemas}/${id}`
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
 * Fetch all local claims.
 *
 * @param params - limit, offset, sort, attributes, filter.

 * @returns response.
 * @throws IdentityAppsApiException
 */
export const getAllLocalClaims = (params: ClaimsGetParams): Promise<Claim[]> => {

    const requestConfig: AxiosRequestConfig = {
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
 * @param params - sort, filter, offset, attributes, limit.
 * @returns response.
 * @throws IdentityAppsApiException
 */
export const getDialects = (params: ClaimDialectsGetParams): Promise<ClaimDialect[]> => {

    const requestConfig: AxiosRequestConfig = {
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
 * @param dialectID - Claim Dialect ID.
 * @param params - limit, offset, filter, attributes, sort.
 *
 * @returns response.
 * @throws IdentityAppsApiException
 */
export const getAllExternalClaims = (dialectID: string, params: ClaimsGetParams): Promise<ExternalClaim[]> => {

    const requestConfig: AxiosRequestConfig = {
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

/**
 * Get all SCIM resource types.
 *
 * @returns response.
 */
export const getSCIMResourceTypes = (): Promise<any> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.resourceTypes}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ClaimConstants.ALL_SCIM_RESOURCE_TYPES_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR,
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
                ClaimConstants.ALL_SCIM_RESOURCE_TYPES_FETCH_REQUEST_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
