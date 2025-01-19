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
import { store } from "@wso2is/admin.core.v1/store";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { SMSTemplateConstants } from "../constants/sms-template-constants";
import { SMSTemplate } from "../models/sms-templates";

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
const updateSmsTemplate = (
    templateType: string,
    smsTemplate: Partial<SMSTemplate>,
    locale: string = SMSTemplateConstants.DEAFULT_LOCALE
): Promise<SMSTemplate> => {
    const smsLocale: string = locale.replace("-", "_");

    const requestConfig: AxiosRequestConfig = {
        data: {
            body: smsTemplate.body
        },
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url:
            store.getState().config.endpoints.smsTemplates +
            `/template-types/${templateType}/org-templates/${smsLocale}`
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
                    response.config
                );
            }

            return Promise.resolve(response.data as SMSTemplate);
        })
        .catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                "Error occurred while updating the SMS template.",
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config
            );
        });
};

export default updateSmsTemplate;
