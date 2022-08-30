/**
 * Copyright (c) 2020, WSO2 LLC. (http://www.wso2.org) All Rights Reserved.
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
import { HttpMethods } from "@wso2is/core/models";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { store } from "../../core";
import { EmailTemplate, EmailTemplateDetails, EmailTemplateType, BrandingPreference } from "../models";

/**
 * Initialize an axios Http client.
 */
const httpClient = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

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
        url: store.getState().config.endpoints.emailTemplateType
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<EmailTemplateType[]>) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });

};

/**
 * Create new email template type.
 *
 * @param templateType - template type name
 */
export const createNewTemplateType = (templateType: string): Promise<AxiosResponse<EmailTemplateType>> => {
    const requestConfig: AxiosRequestConfig = {
        data: {
            "displayName": templateType
        },
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.emailTemplateType
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<EmailTemplateType>) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Delete selected email template type for a given template type id.
 *
 * @param templateTypeId - selected template type id.
 */
export const deleteEmailTemplateType = (templateTypeId: string): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.emailTemplateType + "/" + templateTypeId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

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
        url: store.getState().config.endpoints.emailTemplateType + "/" + templateId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<EmailTemplateDetails>) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Get template details for given template type id and template id.
 *
 * @param templateTypeId - template type id
 * @param templateId - template id
 */
export const getTemplateDetails = (
    templateTypeId: string, templateId: string
): Promise<AxiosResponse<EmailTemplate>> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.emailTemplateType + "/" + templateTypeId + "/templates/" + templateId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<EmailTemplate>) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });

};

/**
 * Create email template for selected locale.
 *
 * @param templateTypeId - template type id
 * @param templateData - new template details
 */
export const createLocaleTemplate = (
    templateTypeId: string, templateData: EmailTemplate
): Promise<AxiosResponse<EmailTemplateType>> => {

    const requestConfig: AxiosRequestConfig = {
        data: templateData,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.emailTemplateType + "/" + templateTypeId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<EmailTemplateType>) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });

};

/**
 * Delete a given locale template using the template type id and template id.
 *
 * @param templateTypeId - template type id
 * @param templateId - locale template id
 */
export const deleteLocaleTemplate = (templateTypeId: string, templateId: string): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState().config.endpoints.emailTemplateType + "/" + templateTypeId + "/templates/" + templateId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Replace given content for the selected locale template id and template type id.
 *
 * @param templateTypeId - template type id
 * @param templateId - locale template id
 * @param templateData - replacable locale template data
 */
export const replaceLocaleTemplateContent = (
    templateTypeId: string, templateId: string, templateData: EmailTemplate): Promise<AxiosResponse> => {

    const requestConfig: AxiosRequestConfig = {
        data: templateData,
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: store.getState().config.endpoints.emailTemplateType + "/" + templateTypeId + "/templates/" + templateId
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};

/**
 * Get branding preferences of the tenant.
 */
export const getBrandingPreferences = ()
    : Promise<AxiosResponse<BrandingPreference>> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Access-Control-Allow-Origin": store.getState().config.deployment.clientHost,
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.brandingPreferences
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<BrandingPreference>) => {
            return Promise.resolve(response);
        })
        .catch((error) => {
            return Promise.reject(error);
        });
};
