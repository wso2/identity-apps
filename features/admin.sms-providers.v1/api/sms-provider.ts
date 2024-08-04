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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { SMSProviderConstants } from "../constants";
import {
    SMSProviderAPIInterface,
    SMSProviderAPIResponseInterface
} from "../models";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());


export const useSMSProviders = <Data = SMSProviderAPIResponseInterface[], Error = RequestErrorInterface>
    (): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.smsProviderEndpoint
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading: !error && !data,
        isValidating,
        mutate: mutate
    };
};

export const createSMSProvider = (
    smsProvider: SMSProviderAPIInterface
): Promise<SMSProviderAPIResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        data: smsProvider,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.smsProviderEndpoint
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new IdentityAppsApiException(
                    SMSProviderConstants.ErrorMessages.SMS_PROVIDER_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE
                        .getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as SMSProviderAPIResponseInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                SMSProviderConstants.ErrorMessages.SMS_PROVIDER_CONFIG_UPDATE_ERROR_CODE.getErrorMessage(),
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

export const updateSMSProvider = (
    smsProvider: SMSProviderAPIInterface
): Promise<SMSProviderAPIResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        data: smsProvider,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.smsProviderEndpoint + "/SMSPublisher"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new IdentityAppsApiException(
                    SMSProviderConstants.ErrorMessages.SMS_PROVIDER_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE
                        .getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as SMSProviderAPIResponseInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                SMSProviderConstants.ErrorMessages.SMS_PROVIDER_CONFIG_UPDATE_ERROR_CODE.getErrorMessage(),
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

export const deleteSMSProviders = (): Promise<null | IdentityAppsApiException> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.smsProviderEndpoint + "/SMSPublisher"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    SMSProviderConstants.ErrorMessages.SMS_PROVIDER_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE
                        .getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                error.response?.data?.message ?? SMSProviderConstants
                    .ErrorMessages.SMS_PROVIDER_CONFIG_DELETE_ERROR_CODE.getErrorMessage(),
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};
