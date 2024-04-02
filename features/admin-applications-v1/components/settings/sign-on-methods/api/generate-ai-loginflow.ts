/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import React from "react";
import axios from "axios";
import { ClaimURIs } from '../models/claim-uris';
/**
 * Hook to trigger the back end for start generating the AI login flow. 
 * @param userQuery - The user's input login scenario.
 * @param userClaims - User claims list.
 * @param availableAuthenticators - Available authenticators list.
 * @param traceId - The trace ID.
 * @returns The response from the back end.
*/

interface AutheticatorsRecord{
    authenticator: string;
    idp: string;
}

const useGenerateAILoginFlow = (
    userQuery: string,
    userClaims: ClaimURIs[],
    availableAuthenticators: AutheticatorsRecord[],
    traceId: string
): Promise<{ loginFlow: any; isError: boolean; error: any }> => {
    return new Promise((resolve, reject) => {
        axios.post(
            "http://localhost:3000/loginflow/generate",
            {
                user_query: userQuery,
                user_claims: userClaims,
                available_authenticators: availableAuthenticators,
            },
            {
                headers: {
                    "Trace-Id": traceId
                },
            }
        )
        .then(response => {
            resolve({ loginFlow: response.data, isError: false, error: null });
        })
        .catch(error => {
            console.error("Error while generating the AI login flow: ", error);
            reject({ loginFlow: null, isError: true, error: error });
        });
    });
};

export default useGenerateAILoginFlow;
