/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, HttpInstance, HttpRequestConfig, HttpResponse } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { OTPVerificationRecoveryScenario } from "../constants";
import { HttpMethods } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 */
const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Validate the user-entered verification code.
 *
 * @param code - The verification code.
 */
export const validateOTPCode = async (code: string): Promise<boolean> => {
    const requestConfig: HttpRequestConfig = {
        data: {
            code: code,
            properties: []
        },
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.otpCodeValidate
    };

    try {
        const response: HttpResponse = await httpClient(requestConfig);

        if (response.status == 202) {
            return true;
        }

        throw new Error(`An error occurred. The server returned ${response.status}`);
    } catch (error) {
        throw new IdentityAppsApiException(error.message);
    }
};

/**
 * Resend OTP verification code for the authenticated user.
 *
 * @param recoveryScenario - The recovery scenario for which the OTP code is being resent.
 */
export const resendOTPCode = async (recoveryScenario: OTPVerificationRecoveryScenario): Promise<boolean> => {
    const requestConfig: HttpRequestConfig = {
        data: {
            properties: [ {
                key: "RecoveryScenario",
                value: recoveryScenario
            } ]
        },
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.verificationResend
    };

    try {
        const response: HttpResponse = await httpClient(requestConfig);

        if (response.status == 201) {
            return true;
        }

        throw new Error(`An error occurred. The server returned ${response.status}`);
    } catch (error) {
        throw new IdentityAppsApiException(error.message);
    }
};
