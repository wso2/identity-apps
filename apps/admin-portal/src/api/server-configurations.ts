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

import { ApplicationManagementConstants } from "../constants";
import { AxiosHttpClient } from "@wso2is/http";
import { AxiosResponse } from "axios";
import { HttpMethods } from "../models";
import { IdentityAppsApiException } from "@wso2is/core/dist/src/exceptions";
import { store } from "../store";

/**
 * Initialize an axios Http client.
 * @type { AxiosHttpClientInstance }
 */
const httpClient = AxiosHttpClient.getInstance();

export const getConfigurations = (url: string): Promise<any> => {
    const requestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: url
    };

    return httpClient.request(requestConfig)
        .then((response) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.AUTH_PROTOCOL_METADATA_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }
            return Promise.resolve(response.data);
        })
        .catch((error) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.AUTH_PROTOCOL_METADATA_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

export const updateConfigurations = (data: object, url: string): Promise<any> => {
    const requestConfig = {
        data,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: url
    };

    return httpClient.request(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    ApplicationManagementConstants.AUTH_PROTOCOL_METADATA_INVALID_STATUS_CODE_ERROR,
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        })
        .catch((error) => {
            throw new IdentityAppsApiException(
                ApplicationManagementConstants.AUTH_PROTOCOL_METADATA_FETCH_ERROR,
                error.stack,
                error.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Retrieve self sign up configurations.
 *
 * @returns {Promise<any>} a promise containing the configurations.
 */
export const getSelfSignUpConfigurations = (): Promise<any> => {
    return getConfigurations(store.getState().config.endpoints.selfSignUp);
};

/**
 * Update self sign up configurations.
 *
 * @param data request payload
 *
 * @returns {Promise<any>} a promise containing the response.
 */
export const updateSelfSignUpConfigurations = (data: object): Promise<any> => {
    return updateConfigurations(data, store.getState().config.endpoints.selfSignUp);
};

/**
 * Retrieve account recovery configurations.
 *
 * @returns {Promise<any>} a promise containing the configurations.
 */
export const getAccountRecoveryConfigurations = (): Promise<any> => {
    return getConfigurations(store.getState().config.endpoints.accountRecovery);
};

/**
 * Update account recovery configurations.
 *
 * @param data request payload
 *
 * @returns {Promise<any>} a promise containing the response.
 */
export const updateAccountRecoveryConfigurations = (data: object): Promise<any> => {
    return updateConfigurations(data, store.getState().config.endpoints.accountRecovery);
};

/**
 * Retrieve all login policies.
 *
 * @returns {Promise<any>} a promise containing the configurations.
 */
export const getAllLoginPolicies = (): Promise<any> => {
    return getConfigurations(store.getState().config.endpoints.loginPolicies);
};

/**
 * Update login policies.
 *
 * @param data request payload
 *
 * @returns {Promise<any>} a promise containing the response.
 */
export const updateAllLoginPolicies = (data: object): Promise<any> => {
    // Todo: API allows to update any property without looking at the connector ID. Would be better to have different
    // API calls per each connector if the UI design permits it.
    return updateConfigurations(data, store.getState().config.endpoints.accountLocking);
};

/**
 * Retrieve all password policies.
 *
 * @returns {Promise<any>} a promise containing the configurations.
 */
export const getAllPasswordPolicies = (): Promise<any> => {
    return getConfigurations(store.getState().config.endpoints.passwordPolicies);
};

/**
 * Update password policies.
 *
 * @param data request payload
 *
 * @returns {Promise<any>} a promise containing the response.
 */
export const updateAllPasswordPolicies = (data: object): Promise<any> => {
    // Todo: API allows to update any property without looking at the connector ID. Would be better to have different
    // API calls per each connector if the UI design permits it.
    return updateConfigurations(data, store.getState().config.endpoints.passwordHistory);
};
