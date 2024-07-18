/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { GenerateLoginFlowAPIResponseInterface } from "../models/ai-login-flow";
import AuthenticatorsRecord from "../models/authenticators-record";
import { ClaimURI } from "../models/claim-uri";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Generate login flow using AI.
 *
 * @param userQuery - user query.
 * @param userClaims - user claims.
 * @param availableAuthenticators - available authenticators.
 * @param traceId - trace ID.
 *
 * @returns generated login flow.
 */
const generateLoginFlow = (
    userQuery: string,
    userClaims: ClaimURI[],
    availableAuthenticators: {
        enterprise: AuthenticatorsRecord[];
        local: AuthenticatorsRecord[];
        recovery: AuthenticatorsRecord[];
        secondFactor: AuthenticatorsRecord[];
        social: AuthenticatorsRecord[];
    },
    traceId: string
): Promise<GenerateLoginFlowAPIResponseInterface> => {
    const requestConfig: AxiosRequestConfig = {
        data: {
            available_authenticators: availableAuthenticators,
            user_claims: userClaims,
            user_query: userQuery
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Trace-Id": traceId
        },
        method: HttpMethods.POST,
        url: `${store.getState().config.endpoints.applications}/loginflow/generate`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<GenerateLoginFlowAPIResponseInterface>) => {
            if (response.status !== 200) {
                throw new Error(`Failed to generate login flow: ${response.statusText}`);
            }

            return response.data;
        }).catch((error: AxiosError) => {
            const errorMessage: string = error.response?.data?.message || "Unknown error occurred";

            throw new IdentityAppsApiException(
                errorMessage,
                error.stack,
                error.response?.status,
                error.request,
                error.response,
                error.config
            );
        });
};

export default generateLoginFlow;
