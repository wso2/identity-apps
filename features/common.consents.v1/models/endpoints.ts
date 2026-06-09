/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
 * Interface for the Consent Management resource endpoints.
 */
export interface ConsentMgtResourceEndpointsInterface {
    /**
     * Base URL for consent policy app assignments: /api/identity/config-mgt/v1.0/resource/consent-policy-apps
     */
    consentPolicyApps: string;
    /**
     * Resource-type URL for consent policy apps: /api/identity/config-mgt/v1.0/resource-type/consent-policy-apps
     */
    consentPolicyAppsResourceType: string;
    /**
     * Base URL for consent management elements: /api/identity/consent-mgt/v2.0/elements
     */
    consentMgtElements: string;
    /**
     * Base URL for consent management purposes: /api/identity/consent-mgt/v2.0/purposes
     */
    consentMgtPurposes: string;
}
