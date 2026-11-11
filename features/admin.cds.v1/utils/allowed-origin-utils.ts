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
 * Why an origin cannot be added. Each value is the key of its message under
 * `customerDataService:allowedOrigins.errors`.
 */
export enum AllowedOriginError {
    DUPLICATE = "duplicate",
    EMPTY = "empty",
    INVALID = "invalid",
    NOT_AN_ORIGIN = "notAnOrigin",
    SCHEME = "scheme",
    TOO_LONG = "tooLong",
    TRAILING_SLASH = "trailingSlash",
    WILDCARD = "wildcard"
}

export interface AllowedOriginCheckInterface {
    /**
     * The origin as it is stored, when it can be added.
     */
    origin?: string;
    error?: AllowedOriginError;
}

/**
 * The width of the server column that holds the origins as one JSON array.
 */
const MAX_STORED_ALLOWED_ORIGINS_LENGTH: number = 500;

/**
 * Writes an origin the way a browser sends it in the Origin header: the scheme and the host
 * lower-cased and a default port dropped, so `https://App.example.com:443` becomes
 * `https://app.example.com`. Any other port is kept. A value that is not an http or https URL is
 * returned trimmed.
 *
 * @param origin - An origin of the form scheme://host[:port].
 * @returns The origin as a browser sends it.
 */
export const normalizeAllowedOrigin = (origin: string): string => {
    const trimmed: string = origin.trim();

    try {
        const browserOrigin: string = new URL(trimmed).origin;

        // An origin the browser cannot express, such as one of another scheme, reads "null".
        return browserOrigin === "null" ? trimmed : browserOrigin;
    } catch {
        return trimmed;
    }
};

/**
 * Checks an origin before it is added to the list, with the rules the server applies on save, so
 * that a mistake is shown at the field rather than as a failed save.
 *
 * @param candidate - The origin as typed.
 * @param origins - The origins already in the list.
 * @returns The origin to add, or why it cannot be added.
 */
export const checkAllowedOrigin = (candidate: string, origins: string[]): AllowedOriginCheckInterface => {
    const trimmed: string = candidate.trim();

    if (trimmed === "") {
        return { error: AllowedOriginError.EMPTY };
    }
    // A browser matches the Origin header exactly, so a wildcard would never match.
    if (trimmed.includes("*")) {
        return { error: AllowedOriginError.WILDCARD };
    }
    if (trimmed.endsWith("/")) {
        return { error: AllowedOriginError.TRAILING_SLASH };
    }

    let parsed: URL;

    try {
        parsed = new URL(trimmed);
    } catch {
        return { error: AllowedOriginError.INVALID };
    }

    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return { error: AllowedOriginError.SCHEME };
    }
    // URL accepts and then drops some of these, so the typed text is checked as well.
    if (parsed.host === "" || parsed.pathname !== "/" || /[?#@]/.test(trimmed)) {
        return { error: AllowedOriginError.NOT_AN_ORIGIN };
    }

    const origin: string = normalizeAllowedOrigin(trimmed);

    if (origins.some((existing: string) => normalizeAllowedOrigin(existing) === origin)) {
        return { error: AllowedOriginError.DUPLICATE };
    }
    if (JSON.stringify([ ...origins, origin ]).length > MAX_STORED_ALLOWED_ORIGINS_LENGTH) {
        return { error: AllowedOriginError.TOO_LONG };
    }

    return { origin };
};
