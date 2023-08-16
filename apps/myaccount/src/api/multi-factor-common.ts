/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AsgardeoSPAClient, HttpInstance, HttpRequestConfig } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { MultiFactorAuthenticationConstants } from "../constants/mfa-constants";
import { EnabledAuthenticatorsInterface } from "../models";
import { store } from "../store";

/*
 * Get an axios instance.
 *
 * @type {AxiosHttpClientInstance}
 */
const httpClient: HttpInstance = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/*
 * This API is used to get enabled second factor authenticators of the user.
 */
export const getEnabledAuthenticators = (): Promise<EnabledAuthenticatorsInterface> => {
    const requestConfig: HttpRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.mfaEnabledAuthenticators
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            } else {
                return Promise.resolve(response.data as EnabledAuthenticatorsInterface);
            }
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                MultiFactorAuthenticationConstants.MFA_ENABLED_AUTHENTICATOR_RETREIVE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/*
 * This API is used to update enabled second factor authenticators of the user.
 * @param enabledAuthenticators string of enabled authenticator list.
 */
export const updateEnabledAuthenticators = (enabledAuthenticators: string): Promise<AxiosResponse> => {
    const requestConfig: HttpRequestConfig = {
        data: {
            enabledAuthenticators: enabledAuthenticators
        },
        headers: {
            "Access-Control-Allow-Origin": store.getState()?.config?.deployment?.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.mfaEnabledAuthenticators
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            } else {
                return Promise.resolve(response);
            }
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                MultiFactorAuthenticationConstants.MFA_ENABLED_AUTHENTICATOR_UPDATE_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};
