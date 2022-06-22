/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
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
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/*
 * This API is used to get enabled second factor authenticators of the user.
 */
export const getEnabledAuthenticators = (): Promise<EnabledAuthenticatorsInterface> => {
    const requestConfig = {
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
    const requestConfig = {
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
