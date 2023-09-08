/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { HttpMethods, SMSOTPProperty } from "../models";
import { store } from "../store";

/**
 * Get an axios instance.
 */
const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Validate the user-entered verification code.
 *
 * @param code - The verification code
 */
export const validateSMSOTPCode = (code: string): Promise<any> => {
    const requestConfig: HttpRequestConfig = {
        data: {
            code: code,
            properties: []
        },
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.smsOtpValidate
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status == 202) {
                return true;
            }

            return Promise.reject(`An error occurred. The server returned ${response.status}`);
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};

/**
 * Resend SMS OTP verification code for the authenticated user.
 */
export const resendSMSOTPCode = (): Promise<any> => {
    const properties: SMSOTPProperty[] = [];

    const propertyData: SMSOTPProperty = {
        key: "RecoveryScenario",
        value: "MOBILE_VERIFICATION_ON_UPDATE"
    };

    properties.push(propertyData);
    const requestConfig: HttpRequestConfig = {
        data: {
            properties: properties
        },
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.smsOtpResend
    };

    return httpClient(requestConfig)
        .then((response: HttpResponse) => {
            if (response.status !== 201) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            } else {
                return Promise.resolve(response);
            }
        })
        .catch((error: HttpError) => {
            return Promise.reject(error);
        });
};
