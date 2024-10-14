/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import { I18nConstants, store } from "@wso2is/admin.core.v1";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { SmsTemplate, SmsTemplateType } from "../models/sms-templates";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to get the list of SMS templates available for customization.
 *
 * @returns SMS templates list.
 */
export const useSmsTemplatesList = <Data = SmsTemplateType[], Error = RequestErrorInterface>():
    RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${ store.getState().config.endpoints.smsManagement }/template-types`
    };

    const {
        data,
        error,
        isValidating,
        mutate
    } = useRequest<Data, Error>(requestConfig);

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Hook to get the SMS template for a given template type.
 *
 * @param templateType - Template type.
 * @param locale - Locale of the template.
 * @param setIsSystemTemplate - Function to set system template.
 *
 * @returns SMS template.
 */
export const useSmsTemplate = <Data = SmsTemplate, Error = RequestErrorInterface>(
    templateType: string,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE,
    setIsSystemTemplate: (value: (((prevState: boolean) => boolean) | boolean)) => void)
    : RequestResultInterface<Data, Error> => {

    const smsLocale: string = locale.replace("-", "_");

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.smsManagement
            + `/template-types/${ templateType }/org-templates/${ smsLocale }`
    };

    const {
        data,
        error,
        isValidating,
        mutate
    } = useRequest<Data, Error>(requestConfig,
        {
            onError: (error: AxiosError) => {
                if (error.response.status === 404) {
                    // Fallback to system template.
                    requestConfig.url = store.getState().config.endpoints.smsManagement
                        + `/template-types/${ templateType }/system-templates/en_US`;
                    setIsSystemTemplate(true);
                    mutate();
                }
            }
        });

    return {
        data,
        error,
        isLoading: !data && !error,
        isValidating,
        mutate
    };
};

/**
 * Update the SMS template.
 *
 * @param templateType - Template type/id to update.
 * @param smsTemplate - Updated SMS template.
 * @param locale - Locale of the template.
 *
 * @returns Updated SMS Template.
 */
export const updateSmsTemplate = (
    templateType: string,
    smsTemplate: Partial<SmsTemplate>,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE
): Promise<SmsTemplate> => {

    const smsLocale: string = locale.replace("-", "_");

    const requestConfig: AxiosRequestConfig = {
        data: {
            body: smsTemplate.body
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.smsManagement +
            `/template-types/${ templateType }/org-templates/${ smsLocale }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new IdentityAppsApiException(
                    "Error occurred while updating the SMS template.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as SmsTemplate);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                "Error occurred while updating the SMS template.",
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Create new SMS template.
 *
 * @param templateType - Template type/id to create.
 * @param smsTemplate - New SMS template.
 *
 * @returns Created SMS Template.
 */
export const createNewSmsTemplate = (
    templateType: string,
    smsTemplate: SmsTemplate
): Promise<SmsTemplate> => {

    const requestConfig: AxiosRequestConfig = {
        data: {
            body: smsTemplate.body,
            locale: smsTemplate.id
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.smsManagement +
            `/template-types/${ templateType }/org-templates`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new IdentityAppsApiException(
                    "Error occurred while creating the SMS template.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as SmsTemplate);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                "Error occurred while creating the SMS template.",
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Delete the SMS template.
 *
 * @param templateType - Template type/id to delete.
 * @param locale - Locale of the template.
 *
 * @returns Delete SMS Template.
 */
export const deleteSmsTemplate = (
    templateType: string,
    locale: string
): Promise<AxiosResponse> => {

    const smsLocale: string = locale.replace("-", "_");

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.smsManagement +
            `/template-types/${ templateType }/org-templates/${ smsLocale }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    "Error occurred while deleting the SMS template.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return response;
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                "Error occurred while deleting the SMS template.",
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};
