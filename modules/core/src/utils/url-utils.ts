/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
 *
 */

import { sanitizeUrl } from "@braintree/sanitize-url";
import { PatternConstants } from "../constants";
import { URLComponentsInterface } from "../models";

/**
 * Utility class for URL operations and validations.
 */
export class URLUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Checks if the passed in url is a valid Http URL.
     *
     * @param {string} url - URL to evaluate.
     *
     * @return {boolean} True if the url is a http url.
     */
    public static isHttpUrl(url: string): boolean {
        return !!url.trim().match(PatternConstants.HTTP_URL_REGEX_PATTERN);
    }

    /**
     * Checks if the passed in url is a valid Https URL.
     *
     * @param {string} url - URL to evaluate.
     *
     * @return {boolean} True if the url is a https url.
     */
    public static isHttpsUrl(url: string): boolean {
        return !!url.trim().match(PatternConstants.HTTPS_URL_REGEX_PATTERN);
    }

    /**
     * Checks if the passed in url starts with HTTP/HTTPS.
     *
     * @param {string} url - URL to evaluate.
     *
     * @return {boolean} True if the url is a https/http url.
     */
    public static isHttpsOrHttpUrl(url: string): boolean {
        return !!url.trim().match(PatternConstants.HTTPS_OR_HTTP_REGEX_PATTERN);
    }

    /**
     * Checks if the passed in url is a valid data URL.
     *
     * @param {string} url - URL to evaluate.
     *
     * @return {boolean} True if the url is a data url.
     */
    public static isDataUrl(url: string): boolean {
        return !!url.trim().match(PatternConstants.DATA_URL_REGEX_PATTERN);
    }

    /**
     * Checks if the the provided URL is a valid mobile deep link.
     *
     * @param {string} url - The URL to evaluate.
     *
     * @return {boolean} True if the URL is a mobile deep link.
     */
    public static isMobileDeepLink(url: string): boolean{
        return !!url.trim().match(PatternConstants.MOBILE_DEEP_LINK_URL_REGEX_PATTERN);
    }

    /**
     * Checks if the the provided URL is a loop back call.
     *
     * @param {string} url - The URL to evaluate.
     *
     * @return {boolean} True if the URL is a loop back call.
     */
    public static isLoopBackCall(url: string): boolean{
        return !!url.trim().match(PatternConstants.LOOP_BACK_CALL_REGEX_PATTERN);
    }

    /**
     * Splits a given string url into <scheme>://<host> This function does
     * not handle individual ports or paths related to the url. Instead it
     * only returns the protocol, host, and combined origin of the url.
     *
     * Please refer specification for other part implementations of the url:
     * https://www.ietf.org/rfc/rfc2396.txt
     *
     * @param url {string} a valid url string.
     * @returns URLComponentsInterface
     * @throws Invalid URL | undefined
     */
    public static urlComponents(url: string): URLComponentsInterface {
        try {
            const details = new URL(url.trim());
            const protocol = details.protocol.replace(":", "");
            return {
                protocol, // https|http
                host: details.host, // localhost:9443
                origin: details.origin, // https://localhost:9443
                href: details.href, // https://localhost:9443/some/long/url
                _url: details, // URL Instance
                pathWithoutProtocol: details.href.split("://")[ 1 ],
            } as URLComponentsInterface;
        } catch (error) {
            return null;
        }
    }

    public static isURLValid(url: string, checkForSanity?: boolean): boolean {

        // Check if the URL is valid and doesn't contain probable XSS attacks.
        if (checkForSanity) {
            const sanitizedURL: string = sanitizeUrl(url);

            // @braintree/sanitize-url returns `about:blank` for invalid URLs.
            // @see {@link https://github.com/braintree/sanitize-url/blob/master/README.md}
            if (sanitizedURL === "about:blank") {
                return false;
            }
        }

        try {
            const _ = new URL(url.trim());
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Checks whether a given url is a SSL enabled protocol or not.
     * @param url {string}
     */
    public static isHTTPS(url: string): boolean {
        try {
            return Boolean(URLUtils.urlComponents(url)
                .protocol
                .match("https")
                ?.length
            );
        } catch (error) {
            return false;
        }
    }

    /**
     * Checks whether a given URL is a valid origin or not.
     * It checks whether theres any pathname, search, or
     * search parameters are present.
     *
     * Will return {@code true} if matches the schema <proto>://<host>
     *
     * @param url {string} any url
     */
    public static isAValidOriginUrl(url: string): boolean {
        try {
            const { _url } = this.urlComponents(url);
            return (!_url.pathname || _url.pathname === "/") &&
                !_url.search &&
                !Array.from(_url.searchParams).length;
        } catch (error) {
            return false;
        }
    }
}
