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
import { ResourceEndpointsInterface } from "@wso2is/admin.core.v1/models/config";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

interface ConnectionTestErrorResponseInterface {
    description?: string;
    message?: string;
}

interface ConnectionTestMetadataInterface {
    authorizationUrl?: string;
    [ key: string ]: unknown;
}

export interface ConnectionTestSessionResponseInterface {
    debugId?: string;
    metadata?: ConnectionTestMetadataInterface;
    [ key: string ]: unknown;
}

/**
 * Starts a connection test session.
 *
 * @param resourceEndpoints - Connection resource endpoints.
 * @param connectionId - Connection id.
 * @returns Response containing test session data.
 */
export const startConnectionTestSession = (
    resourceEndpoints: ResourceEndpointsInterface,
    connectionId: string
): Promise<AxiosResponse<ConnectionTestSessionResponseInterface>> => {
    const requestConfig: AxiosRequestConfig = {
        data: {
            connectionId
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: `${ resourceEndpoints.debug }/idp`
    };

    return httpClient(requestConfig) as Promise<AxiosResponse<ConnectionTestSessionResponseInterface>>;
};

/**
 * Retrieves connection test results.
 *
 * @param resourceEndpoints - Connection resource endpoints.
 * @param sid - Debug session id.
 * @returns Test result payload.
 */
export const getConnectionTestResult = <T = unknown>(
    resourceEndpoints: ResourceEndpointsInterface,
    sid: string
): Promise<AxiosResponse<T>> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json"
        },
        method: HttpMethods.GET,
        url: resourceEndpoints.debugResult.replace(":sid", sid)
    };

    return httpClient(requestConfig) as Promise<AxiosResponse<T>>;
};

const isConnectionTestAxiosError = (
    error: unknown
): error is AxiosError<ConnectionTestErrorResponseInterface> => {
    const candidate: AxiosError<ConnectionTestErrorResponseInterface> =
        error as AxiosError<ConnectionTestErrorResponseInterface>;

    return Boolean(candidate && typeof candidate === "object" && "isAxiosError" in candidate);
};

/**
 * Resolves a user-friendly error message from test API failures.
 *
 * @param error - Unknown error.
 * @returns Error message if available.
 */
export const resolveConnectionTestErrorMessage = (error: unknown): string | undefined => {
    if (isConnectionTestAxiosError(error)) {
        return error.response?.data?.message ?? error.response?.data?.description ?? error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return undefined;
};
