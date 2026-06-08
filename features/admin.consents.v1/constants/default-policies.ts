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
 * Canonical backend name for each default policy type.
 */
export const DEFAULT_POLICY_NAMES: Record<string, string> = {
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service"
};

/**
 * Route slug → canonical policy name.
 * Used in the edit page to detect when a slug (not a UUID) is in the URL.
 */
export const DEFAULT_POLICY_PATH_MAP: Record<string, string> = {
    "privacy-policy": DEFAULT_POLICY_NAMES.privacyPolicy,
    "terms-of-service": DEFAULT_POLICY_NAMES.termsOfService
};

/**
 * Ordered list used when synthesizing default policy entries in the list page.
 */
export const DEFAULT_POLICY_ORDER: { name: string; slug: string }[] = [
    { name: DEFAULT_POLICY_NAMES.privacyPolicy, slug: "privacy-policy" },
    { name: DEFAULT_POLICY_NAMES.termsOfService, slug: "terms-of-service" }
];
