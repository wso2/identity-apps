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

import { ApplicationTemplateIdTypes } from "@wso2is/admin.applications.v1/models/application";

/**
 * Default redirect URLs by framework/template.
 * Framework-specific paths are auto-filled with industry standard defaults.
 * Generic types require user input (empty arrays).
 */
export const DefaultRedirectUrls: Record<string, string[]> = {
    angular: [ "http://localhost:4200" ],
    express: [ "http://localhost:3000/callback" ],
    [ApplicationTemplateIdTypes.MCP_CLIENT_APPLICATION]: [],
    [ApplicationTemplateIdTypes.MOBILE_APPLICATION]: [],
    next: [ "http://localhost:3000" ],
    [ApplicationTemplateIdTypes.OIDC_WEB_APPLICATION]: [],
    react: [ "http://localhost:5173" ],
    [ApplicationTemplateIdTypes.SPA]: []
};

/**
 * Get default redirect URL(s) for a given framework or template.
 * Returns empty array for generic types that don't have defaults.
 * @param frameworkOrTemplate - Framework ID or template ID
 * @returns Array of default redirect URLs (may be empty for generic types)
 */
export const getDefaultRedirectUrl = (frameworkOrTemplate?: string): string[] => {
    if (!frameworkOrTemplate) {
        return [];
    }

    return DefaultRedirectUrls[frameworkOrTemplate] ?? [];
};

/**
 * Check if a framework/template has auto-fill defaults.
 * @param frameworkOrTemplate - Framework ID or template ID
 * @returns True if auto-fill defaults are available
 */
export const hasAutoFillDefaults = (frameworkOrTemplate?: string): boolean => {
    if (!frameworkOrTemplate) {
        return false;
    }

    const defaults: string[] = DefaultRedirectUrls[frameworkOrTemplate];

    return defaults && defaults.length > 0;
};

/**
 * Interface for redirect URL validation constraints.
 */
interface RedirectUrlConstraintsInterface {
    /** Maximum length of a single redirect URL */
    MAX_LENGTH: number;
    /** Maximum number of redirect URLs allowed */
    MAX_URLS: number;
    /** Minimum URL length */
    MIN_LENGTH: number;
    /** Valid URL pattern (http/https with optional port and path) */
    PATTERN: RegExp;
}

export const RedirectUrlConstraints: RedirectUrlConstraintsInterface = {
    MAX_LENGTH: 2048,
    MAX_URLS: 10,
    MIN_LENGTH: 1,
    PATTERN: /^https?:\/\/[^\s/$.?#].[^\s]*$/i
};

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

/**
 * Get all known default URLs across all frameworks/templates.
 * Used to check if user has modified the URL from a default.
 * @returns Set of all default URLs
 */
export const getAllDefaultUrls = (): Set<string> => {
    const allDefaults: Set<string> = new Set();

    Object.values(DefaultRedirectUrls).forEach((urls: string[]) => {
        urls.forEach((url: string) => allDefaults.add(url));
    });

    return allDefaults;
};

/**
 * Check if a URL is one of the known default URLs.
 * @param url - URL to check
 * @returns True if the URL is a known default
 */
export const isKnownDefaultUrl = (url: string): boolean => {
    return getAllDefaultUrls().has(url);
};
