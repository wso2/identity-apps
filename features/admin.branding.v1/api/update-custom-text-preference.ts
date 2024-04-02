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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { I18nConstants } from "../../admin.core.v1/constants/i18n-constants";
import { store } from "../../admin.core.v1/store";
import { OrganizationType } from "../../admin.organizations.v1/constants/organization-constants";
import { CustomTextPreferenceConstants } from "../constants/custom-text-preference-constants";
import { BrandingPreferenceTypes } from "../models/branding-preferences";
import {
    CustomTextPreferenceAPIResponseInterface,
    CustomTextPreferenceInterface
} from "../models/custom-text-preference";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Update the branding preference text customizations.
 *
 * @param isAlreadyConfigured - Is customizations already done or not.
 * @param preference - Text Customizations.
 * @param name - Resource Name.
 * @param screen - Resource Screen.
 * @param locale - Resource Locale.
 * @param type - Resource Type.
 * @returns Promise containing the response.
 */
const updateCustomTextPreference = (
    isAlreadyConfigured: boolean,
    preference: CustomTextPreferenceInterface,
    name: string,
    screen: string,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE,
    type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG
): Promise<CustomTextPreferenceAPIResponseInterface> => {
    const tenantDomain: string = store.getState().organization.organizationType === OrganizationType.SUBORGANIZATION
        ? store.getState()?.organization?.organization?.id
        : name;

    const requestConfig: AxiosRequestConfig = {
        data: {
            locale,
            name: tenantDomain,
            preference,
            screen,
            type
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: isAlreadyConfigured ? HttpMethods.PUT : HttpMethods.POST,
        url: store.getState().config.endpoints.brandingTextPreference
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new IdentityAppsApiException(
                    CustomTextPreferenceConstants
                        .ErrorMessages
                        .CUSTOM_TEXT_PREFERENCE_UPDATE_INVALID_STATUS_CODE_ERROR
                        .getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as CustomTextPreferenceAPIResponseInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                CustomTextPreferenceConstants.ErrorMessages.CUSTOM_TEXT_PREFERENCE_UPDATE_ERROR.getErrorMessage(),
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

export default updateCustomTextPreference;
