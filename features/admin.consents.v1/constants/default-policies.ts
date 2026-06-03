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
 * Ordered display names for the three built-in default policy consents.
 */
export const DEFAULT_POLICY_DISPLAY_NAMES: string[] = [
    "Cookie Policy",
    "Privacy Policy",
    "Terms of Service"
];

/**
 * Maps each built-in policy URL path segment to its canonical display name.
 * Used both to identify default policies by URL path and to derive
 * display-name-keyed navigation maps at call sites.
 */
export const DEFAULT_POLICY_PATH_MAP: Record<string, string> = {
    "cookie-policy": "Cookie Policy",
    "privacy-policy": "Privacy Policy",
    "terms-of-service": "Terms of Service"
};
