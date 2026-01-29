/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { CustomTextPreferenceScreenMetaInterface } from "@wso2is/admin.branding.v1/models/custom-text-preference";
import { PreviewScreenType } from "@wso2is/common.branding.v1/models/branding-preferences";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";

/**
 * Interface for the base custom text hook result.
 */
export interface CustomTextPreferenceResult {
    /**
     * The data returned by the hook.
     */
    data?: { [ key in PreviewScreenType ]?: Record<string, string> };
    /**
     * Error state.
     */
    error?: IdentityAppsApiException;
    /**
     * Loading state.
     */
    isLoading: boolean;
    /**
     * Mutate function to revalidate data.
     */
    mutate: () => void;
}

/**
 * Interface for the screen meta hook result.
 */
export interface CustomTextPreferenceScreenMetaResult {
    /**
     * The data returned by the hook.
     */
    data?: { [ key in PreviewScreenType ]?: CustomTextPreferenceScreenMetaInterface };
    /**
     * Error state.
     */
    error?: IdentityAppsApiException;
    /**
     * Loading state.
     */
    isLoading: boolean;
    /**
     * Mutate function to revalidate data.
     */
    mutate: () => void;
}
