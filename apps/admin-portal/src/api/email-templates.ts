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
 
import { store } from "../store";
import { HttpMethods, EmailTemplateType, EmailTemplateDetails } from "../models";
import { AxiosHttpClient } from "@wso2is/http";
import { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Initialize an axios Http client.
 * @type { AxiosHttpClientInstance }
 */
const httpClient = AxiosHttpClient.getInstance();

/**
 * Get all email template types
 */
export const getEmailTemplateTypes = (): Promise<AxiosResponse<EmailTemplateType[]>> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.emailTemplateType,
    };

    return httpClient.request<EmailTemplateType[]>(requestConfig)
        .then((response: AxiosResponse<EmailTemplateType[]>) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });

}

/**
 * Get details for the given email template ID.
 * 
 * @param templateId - Unique ID of the required email template
 */
export const getEmailTemplate = (templateId: string): Promise<AxiosResponse<EmailTemplateDetails>> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.emailTemplateType + "/" + templateId,
    };

    return httpClient.request<EmailTemplateDetails>(requestConfig)
        .then((response: AxiosResponse<EmailTemplateDetails>) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
}
