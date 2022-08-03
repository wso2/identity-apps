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

import { AsgardeoSPAClient, Storage } from "@asgardeo/auth-react";
import { AxiosError, AxiosResponse } from "axios";
import { CommonServiceResourcesEndpoints } from "../configs";
import { ClaimConstants } from "../constants";
import { IdentityAppsApiException } from "../exceptions";
import { HTTPRequestHeaders } from "../helpers";
import { Claim, ClaimDialect, ClaimsGetParams, ExternalClaim, HttpMethods } from "../models";
import { ContextUtils } from "../utils";

/**
 * The error code that is returned when there is no item in the list
 */
const RESOURCE_NOT_FOUND_ERROR_CODE = "CMT-50017";

/**
 * Get an axios instance.
 *
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetch all local claims.
 *
 * @param {ClaimsGetParams} params - limit, offset, sort, attributes, filter.
 * @return {Promise<Claim[]>} response.
 * @throws {IdentityAppsApiException}
 */
export const getAllLocalClaims = (params: ClaimsGetParams, url?: string): Promise<Claim[]> => {

    const requestConfig = {
        headers: HTTPRequestHeaders(ContextUtils.getRuntimeConfig().clientHost),
        method: HttpMethods.GET,
        params,
        url: url ?? CommonServiceResourcesEndpoints(ContextUtils.getRuntimeConfig().serverHost).localClaims
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
export const getDialects = (params: ClaimsGetParams, url?: string): Promise<ClaimDialect[]> => {

    const requestConfig = {
        headers: HTTPRequestHeaders(ContextUtils.getRuntimeConfig().clientHost),
        method: HttpMethods.GET,
        params,
        url: url ?? CommonServiceResourcesEndpoints(ContextUtils.getRuntimeConfig().serverHost).claims
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
export const getAllExternalClaims = (
    dialectID: string,
    params: ClaimsGetParams,
    url?: string
): Promise<ExternalClaim[]> => {

    const requestConfig = {
        headers: HTTPRequestHeaders(ContextUtils.getRuntimeConfig().clientHost),
        method: HttpMethods.GET,
        params,
        url: (url ?? CommonServiceResourcesEndpoints(ContextUtils.getRuntimeConfig().serverHost).externalClaims)
            .replace("{0}", dialectID)
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
            if (error?.response?.data?.code !== RESOURCE_NOT_FOUND_ERROR_CODE) {
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
