/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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
import { I18nConstants } from "@wso2is/admin.core.v1/constants";
import { store } from "@wso2is/admin.core.v1/store";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants/organization-constants";
import {
    BrandingPreferenceAPIResponseInterface,
    BrandingPreferenceInterface,
    BrandingPreferenceTypes
} from "@wso2is/common.branding.v1/models";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { BrandingPreferencesConstants } from "../constants";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Update the branding preference via Branding Preferences API.
 *
 * @param isBrandingAlreadyConfigured - Is branding already configured for the tenant.
 * @param name - Resource Name.
 * @param preference - Preference object.
 * @param type - Resource Type.
 * @param locale - Resource Locale.
 * @returns Branding Preference update response.
 * @throws IdentityAppsApiException.
 */
export const updateBrandingPreference = (
    isBrandingAlreadyConfigured: boolean,
    name: string,
    preference: BrandingPreferenceInterface,
    type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE
): Promise<BrandingPreferenceAPIResponseInterface> => {
    const tenantDomain: string = store.getState().organization.organizationType === OrganizationType.SUBORGANIZATION
        ? store.getState()?.organization?.organization?.id
        : name;

    const requestConfig: AxiosRequestConfig = {
        data: {
            locale,
            name: tenantDomain,
            preference,
            type
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: isBrandingAlreadyConfigured ? HttpMethods.PUT : HttpMethods.POST,
        url: store.getState().config.endpoints.brandingPreference
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200 && response.status !== 201) {
                throw new IdentityAppsApiException(
                    BrandingPreferencesConstants.ErrorMessages.BRANDING_PREFERENCE_UPDATE_INVALID_STATUS_CODE_ERROR
                        .getErrorMessage(),
                    null,
                    response.status,
                    response.request,
                    response,
                    response.config);
            }

            return Promise.resolve(response.data as BrandingPreferenceAPIResponseInterface);
        }).catch((error: AxiosError) => {
            throw new IdentityAppsApiException(
                BrandingPreferencesConstants.ErrorMessages.BRANDING_PREFERENCE_UPDATE_ERROR.getErrorMessage(),
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Delete the branding preference via Branding Preferences API.
 *
 * @param name - Resource Name.
 * @param type - Resource Type.
 * @param locale - Resource Locale.
 * @returns Branding Preference delete response.
 * @throws IdentityAppsApiException.
 */
export const deleteBrandingPreference = (
    name: string,
    type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE
): Promise<null | IdentityAppsApiException> => {
    const tenantDomain: string = store.getState().organization.organizationType === OrganizationType.SUBORGANIZATION
        ? store.getState()?.organization?.organization?.id
        : name;

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        params: {
            locale,
            name: tenantDomain,
            type
        },
        url: store.getState().config.endpoints.brandingPreference
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                throw new IdentityAppsApiException(
                    BrandingPreferencesConstants.ErrorMessages.BRANDING_PREFERENCE_DELETE_INVALID_STATUS_CODE_ERROR
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
                error.response?.data?.message ?? BrandingPreferencesConstants
                    .ErrorMessages.BRANDING_PREFERENCE_DELETE_ERROR.getErrorMessage(),
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};
