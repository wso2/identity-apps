/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { I18nConstants } from "../../../../features/core/constants";
import { store } from "../../../../features/core/store";
import { BrandingPreferencesConstants } from "../constants";
import {
    BrandingPreferenceAPIResponseInterface,
    BrandingPreferenceInterface,
    BrandingPreferenceTypes
} from "../models";

/**
 * Get an axios instance.
 */
const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance())
    .bind(AsgardeoSPAClient.getInstance());

/**
 * Get the branding preference via Branding Preferences API.
 *
 * @param {string} name - Resource Name.
 * @param {BrandingPreferenceTypes} type - Resource Type.
 * @param {string} locale - Resource Locale.
 * @return {Promise<BrandingPreferenceAPIResponseInterface>}
 * @throws {IdentityAppsApiException}
 */
export const getBrandingPreference = (
    name: string,
    type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE
): Promise<BrandingPreferenceAPIResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            locale,
            name,
            type
        },
        url: store.getState().config.endpoints.brandingPreference
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                throw new IdentityAppsApiException(
                    BrandingPreferencesConstants.ErrorMessages.BRANDING_PREFERENCE_FETCH_INVALID_STATUS_CODE_ERROR
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
                    .ErrorMessages.BRANDING_PREFERENCE_FETCH_ERROR.getErrorMessage(),
                error.stack,
                error.response?.data?.code,
                error.request,
                error.response,
                error.config);
        });
};

/**
 * Update the branding preference via Branding Preferences API.
 *
 * @param {boolean} isBrandingAlreadyConfigured - Is branding already configured for the tenant.
 * @param {string} name - Resource Name.
 * @param {BrandingPreferenceInterface} preference - Preference object.
 * @param {BrandingPreferenceTypes} type - Resource Type.
 * @param {string} locale - Resource Locale.
 * @return {Promise<BrandingPreferenceAPIResponseInterface>}
 * @throws {IdentityAppsApiException}
 */
export const updateBrandingPreference = (
    isBrandingAlreadyConfigured: boolean,
    name: string,
    preference: BrandingPreferenceInterface,
    type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE
): Promise<BrandingPreferenceAPIResponseInterface> => {

    const requestConfig: AxiosRequestConfig = {
        data: {
            locale,
            name,
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
 * @param {string} name - Resource Name.
 * @param {BrandingPreferenceTypes} type - Resource Type.
 * @param {string} locale - Resource Locale.
 * @return {Promise<null | IdentityAppsApiException>}
 * @throws {IdentityAppsApiException}
 */
export const deleteBrandingPreference = (
    name: string,
    type: BrandingPreferenceTypes = BrandingPreferenceTypes.ORG,
    locale: string = I18nConstants.DEFAULT_FALLBACK_LANGUAGE
): Promise<null | IdentityAppsApiException> => {

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        params: {
            locale,
            name,
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
