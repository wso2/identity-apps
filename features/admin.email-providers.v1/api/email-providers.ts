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
import { AppState, store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useSelector } from "react-redux";
import { EmailProviderConstants } from "../constants";
import { EmailProviderConfigAPIResponseInterface }  from "../models";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Get email provider configurations.
 *
 * @returns the email provider configurations of the tenant.
 */
export const useEmailProviderConfig = <Data = EmailProviderConfigAPIResponseInterface[],Error = RequestErrorInterface>
    (): RequestResultInterface<Data, Error> => {

    const enableOldUIForEmailProvider: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.enableOldUIForEmailProvider);

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: enableOldUIForEmailProvider
            ? store.getState().config.endpoints.emailProviderEndpoint
            : store.getState().config.endpoints.emailProviderV2Endpoint
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error: error,
        isLoading,
        isValidating,
        mutate: mutate
    };
};

/**
 * Get email provider configurations with V1 API.
 *
 * @returns the email provider configurations of the tenant.
 */
export const useEmailProviderConfigV1 = <Data = EmailProviderConfigAPIResponseInterface[],
    Error = RequestErrorInterface>(): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.emailProviderEndpoint
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

/**
 * Update email provider configurations.
 *
 * @param data - the updated email provider configurations.
 * @param enableOldUIForEmailProvider - whether to use the old UI for email provider.
 * @returns a promise to update the email provider configurations.
 */
export const updateEmailProviderConfigurations = (data: EmailProviderConfigAPIResponseInterface,
    enableOldUIForEmailProvider: boolean):
    Promise<EmailProviderConfigAPIResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        data: data,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method:  HttpMethods.POST,
        url: enableOldUIForEmailProvider
            ? store.getState().config.endpoints.emailProviderEndpoint
            : store.getState().config.endpoints.emailProviderV2Endpoint
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new IdentityAppsApiException(
                    EmailProviderConstants.ErrorMessages.EMAIL_PROVIDER_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE
                        .getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as EmailProviderConfigAPIResponseInterface);
        }).catch((error: AxiosError) => {
            const errorMessage: string = EmailProviderConstants.ErrorMessages.EMAIL_PROVIDER_CONFIG_UPDATE_ERROR_CODE
                .getErrorMessage();

            throw new IdentityAppsApiException(errorMessage, error.stack, error.response?.data?.code, error.request,
                error.response, error.config);
        });
};

/**
 * Delete email provider configurations.
 * @param enableOldUIForEmailProvider - whether to use the old UI for email provider.
 * @returns a promise to delete the email provider configurations.
 */
export const deleteEmailProviderConfigurations = (enableOldUIForEmailProvider: boolean):
    Promise<EmailProviderConfigAPIResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method:  HttpMethods.DELETE,
        url: enableOldUIForEmailProvider
            ? store.getState().config.endpoints.emailProviderEndpoint + "/EmailPublisher"
            : store.getState().config.endpoints.emailProviderV2Endpoint + "/EmailPublisher"
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 204) {
                throw new IdentityAppsApiException(
                    EmailProviderConstants.ErrorMessages.EMAIL_PROVIDER_CONFIG_FETCH_INVALID_STATUS_CODE_ERROR_CODE
                        .getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as EmailProviderConfigAPIResponseInterface);
        }).catch((error: AxiosError) => {
            if (error.response?.data?.code === EmailProviderConstants.EMAIL_PROVIDER_CONFIG_NOT_FOUND_ERROR_CODE) {
                // Error due to the email provider configurations not existing. This is expected and should throw error.
                return Promise.resolve(null);
            }

            const errorMessage: string = EmailProviderConstants.ErrorMessages.EMAIL_PROVIDER_CONFIG_DELETE_ERROR_CODE
                .getErrorMessage();

            throw new IdentityAppsApiException(errorMessage, error.stack, error.response?.data?.code, error.request,
                error.response, error.config);
        });
};
