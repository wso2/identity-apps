/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, HttpError, HttpInstance, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { RecoveryScenario } from "../constants";
import { HttpMethods } from "../models";
import { RecoveryProperty } from "../models/resend-verification";
import { store } from "../store";

/**
 * Get an axios instance.
 */
const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Resends the verification link/code for the authenticated user. This supports scenarios such as resending the
 * verification link/code for account confirmation during self sign up, mobile verification, etc.
 */
export const resendVerificationLinkOrCode = (recoveryScenario: RecoveryScenario): Promise<void> => {
    const properties: RecoveryProperty[] = [
        {
            key: "RecoveryScenario",
            value: recoveryScenario.toString()
        }
    ];
    const requestConfig: HttpRequestConfig = {
        data: {
            properties: properties
        },
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.verificationResend
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 201) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            } else {
                return Promise.resolve();
            }
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};
