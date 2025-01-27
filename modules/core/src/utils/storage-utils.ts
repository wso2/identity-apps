/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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
 * Utility class for local storage operations.
 */
export class LocalStorageUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Set a value in local storage.
     *
     * @param key - Key to set the value under.
     * @param value - Value to be set.
     */
    public static setValueInLocalStorage(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    /**
     * Get a value from local storage.
     *
     * @param key - Key to retrieve the value.
     * @returns Value or null.
     */
    public static getValueFromLocalStorage(key: string): string {
        return localStorage.getItem(key);
    }

    public static clearItemFromLocalStorage(key: string): void {
        localStorage.removeItem(key);
    }
}

/**
 * Utility class for session storage operations.
 */
export class SessionStorageUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Clear the session storage completely.
     */
    public static clearSessionStorage(): void {
        sessionStorage.clear();
    }

    /**
     * Clear a specific item from the session storage.
     *
     * @param key - Key of the item to be removed.
     */
    public static clearItemFromSessionStorage(key: string): void {
        sessionStorage.removeItem(key);
    }

    /**
     * Set a specific item to the session storage.
     *
     * @param key - Key of the item to be set.
     * @param value - Value of the item to be set.
     */
    public static setItemToSessionStorage(key: string, value: string): void {
        sessionStorage.setItem(key, value);
    }

    /**
     * Get a specific item from the session storage.
     *
     * @param key - Key of the item to be retrieved.
     */
    public static getItemFromSessionStorage(key: string): string {
        return sessionStorage.getItem(key);
    }
}

/**
 * Utility class for cookie storage operations.
 */
export class CookieStorageUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    /**
     * Set a cookie.
     *
     * @param cookieString - Cookie to set.
     */
    public static setItem(cookieString: string): void {

        document.cookie = cookieString;
    }

    /**
     * Get the value of a specific cookie.
     *
     * @param name - Name of the cookie to be retrieved.
     */
    public static getItem(name: string): string {

        const match: RegExpMatchArray = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));

        if (match) {
            return match[2];
        }

        return undefined;
    }

    /**
     * Sets a cookie with the specified name, value, expiration duration, and optional domain.
     *
     * @param name - The name of the cookie.
     * @param value - The value of the cookie.
     * @param duration - An object specifying the duration for the cookie's expiration.
     *                   Supports minutes, hours, and days.
     *                   Defaults to 30 days if not provided.
     * @param domain - (Optional) The domain for which the cookie is set. If not provided, sets a non-domain cookie.
     *
     * @example
     * // Set a cookie for 1 day, 2 hours, and 30 minutes
     * `CookieStorageUtils.setCookie("language", "en", { days: 1, hours: 2, minutes: 30 }, ".example.com");`
     *
     * // Set a cookie for 15 minutes
     * `CookieStorageUtils.setCookie("tempData", "value", { minutes: 15 });`
     */
    public static setCookie(
        name: string,
        value: string,
        duration: { minutes?: number; hours?: number; days?: number } = { days: 30 },
        domain?: string
    ): void {
        const date: Date = new Date();

        let expirationTime: number = 0;

        if (duration.minutes) {
            expirationTime += duration.minutes * 60 * 1000;
        }
        if (duration.hours) {
            expirationTime += duration.hours * 60 * 60 * 1000;
        }
        if (duration.days) {
            expirationTime += duration.days * 24 * 60 * 60 * 1000;
        }

        date.setTime(date.getTime() + expirationTime);

        const expires: string = `; expires=${date.toUTCString()}`;
        const domainString: string = domain ? `; domain=${domain}` : "";

        const cookie: string = `${name}=${value || ""}${expires}${domainString}; path=/`;

        document.cookie = cookie;
    }
}
