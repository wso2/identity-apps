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

/**
 * Interface for the Branding Preference resource endpoints.
 */export interface BrandingPreferenceResourceEndpointsInterface {
    /**
     * Endpoint to get the branding preferences.
     */
    brandingPreference: string;
    /**
     * Endpoint to get the branding preference for a sub organization.
     */
    brandingPreferenceSubOrg: string;
    /**
     * Endpoint to get the branding text preferences.
     */
    brandingTextPreference: string;
    /**
     * Endpoint to get the branding text preference for a sub organization.
     */
    brandingTextPreferenceSubOrg: string;
    /**
     * Endpoint to generate the branding preferences.
     */
    brandingPreferenceGenerate: string;
    /**
     * Endpoint to generate the branding preference for a sub organization.
     */
    brandingPreferenceGenerateSubOrg: string;
    /**
     * Endpoint to get the status of the branding preference generation.
     */
    brandingPreferenceGenerateStatus: string;
    /**
     * Endpoint to get the status of the branding preference generation for a sub organization.
     */
    brandingPreferenceGenerateStatusSubOrg: string;
    /**
     * Endpoint to get the result of the branding preference generation.
     */
    brandingPreferenceGenerateResult: string;
    /**
     * Endpoint to get the result of the branding preference generation for a sub organization.
     */
    brandingPreferenceGenerateResultSubOrg: string;
}
