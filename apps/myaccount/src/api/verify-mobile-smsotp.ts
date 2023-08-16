/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
