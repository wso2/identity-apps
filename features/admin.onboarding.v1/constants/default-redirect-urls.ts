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

/**
 * Default redirect URLs by framework/template.
 */
export const DefaultRedirectUrls: Record<string, string[]> = {
    angular: [ "http://localhost:4200" ],
    express: [ "http://localhost:3000/callback" ],
    "mobile-application": [ "wso2sample://oauth2" ],
    next: [ "http://localhost:3000" ],
    "oidc-web-application": [ "http://localhost:3000/callback" ],
    react: [ "http://localhost:3000" ],
    "single-page-application": [ "http://localhost:3000" ]
};

/**
 * Get default redirect URL(s) for a given framework or template.
 * @param frameworkOrTemplate - Framework ID or template ID
 * @returns Array of default redirect URLs
 */
export const getDefaultRedirectUrl = (frameworkOrTemplate?: string): string[] => {
    if (!frameworkOrTemplate) {
        return [ "http://localhost:3000" ];
    }

    return DefaultRedirectUrls[frameworkOrTemplate] || [ "http://localhost:3000" ];
};

/**
 * Redirect URL validation constraints.
 */
export const RedirectUrlConstraints = {
    /** Maximum number of redirect URLs allowed */
    MAX_URLS: 10,
    /** Minimum URL length */
    MIN_LENGTH: 1,
    /** Valid URL pattern (http/https with optional port and path) */
    PATTERN: /^https?:\/\/[^\s/$.?#].[^\s]*$/i
} as const;

/**
 * Common localhost patterns for development.
 */
export const LOCALHOST_PATTERNS: RegExp[] = [
    /^https?:\/\/localhost(:\d+)?/,
    /^https?:\/\/127\.0\.0\.1(:\d+)?/
];

/**
 * Check if a URL is a localhost URL.
 * @param url - URL to check
 * @returns True if the URL is a localhost URL
 */
export const isLocalhostUrl = (url: string): boolean => {
    return LOCALHOST_PATTERNS.some((pattern: RegExp) => pattern.test(url));
};
