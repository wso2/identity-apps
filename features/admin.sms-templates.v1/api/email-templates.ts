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
import { I18nConstants, store } from "@wso2is/admin.core.v1";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { SmsTemplate, SmsTemplateType } from "../models/sms-templates";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to get the list of email templates available for customization.
 *
 * @returns Email templates list.
 */
export const useEmailTemplatesList = <Data = SmsTemplateType[], Error = RequestErrorInterface>():
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
 *
 * @param setIsSystemTemplate Function to set system template.
 * @returns Email template.
 */
export const useEmailTemplate = <Data = SmsTemplate, Error = RequestErrorInterface>(
    templateType: string,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE,
    setIsSystemTemplate: (value: (((prevState: boolean) => boolean) | boolean)) => void)
    : RequestResultInterface<Data, Error> => {
    const emailLocale: string = locale.replace("-", "_");

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.smsManagement
            + `/template-types/${ templateType }/org-templates/${ emailLocale }`
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
            },
        });

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate
    };
};

/**
 * Update the email template.
 *
 * @param templateType - Template type/id to update.
 * @param emailTemplate - Updated email template.
 * @param locale - Locale of the template.
 *
 * @returns Update Email Template
 */
export const updateEmailTemplate = (
    templateType: string,
    smsTemplate: Partial<SmsTemplate>,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE
): Promise<SmsTemplate> => {
    console.log("update");
    console.log(smsTemplate);
    const emailLocale: string = locale.replace("-", "_");

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
            `/template-types/${ templateType }/org-templates/${ emailLocale }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new IdentityAppsApiException(
                    "Error occurred while updating the email template.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as SmsTemplate);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                "Error occurred while updating the email template.",
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Create new email template.
 *
 * @param templateType - Template type/id to create.
 * @param emailTemplate - New email template.
 *
 * @returns Create new Email Template
 */
export const createNewEmailTemplate = (
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
                    "Error occurred while creating the email template.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as SmsTemplate);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                "Error occurred while creating the email template.",
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Delete the email template.
 *
 * @param templateType - Template type/id to delete.
 * @param locale - Locale of the template.
 *
 * @returns Delete Email Template
 */
export const deleteEmailTemplate = (
    templateType: string,
    locale: string
): Promise<AxiosResponse> => {

    const emailLocale: string = locale.replace("-", "_");

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.smsManagement +
            `/template-types/${ templateType }/org-templates/${ emailLocale }`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    "Error occurred while deleting the email template.",
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return response;
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                "Error occurred while deleting the email template.",
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};
