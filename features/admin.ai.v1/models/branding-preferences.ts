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
export interface GenerateBrandingAPIInterface {
    /**
     * Website URL of the page to generate the branding preference from.
     */
    websiteUrl: string;
}

export interface GenerateBrandingAPIResponseInterface {
    /**
     * Operation ID of the branding generation.
     */
    operationId: string;
}

export interface BrandingGenerationStatusAPIResponseInterface {
    /**
     * Status of the branding generation.
     */
    status: string;
}

export interface BrandingGenerationResultAPIResponseInterface {
    /**
     * Result of the branding generation.
     */
    result: string;
}

export interface RegenerateBrandingAPIInterface {
    /**
     * Website URL of the page to generate the branding preference from.
     */
    websiteUrl: string;
}

export interface RegenerateBrandingAPIResponseInterface {
    /**
     * Generated branding preference.
     */
    brandingPreference: string;
}
