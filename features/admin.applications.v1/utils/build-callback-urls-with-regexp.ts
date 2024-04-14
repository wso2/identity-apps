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

/**
 * Build an array of URLs or a regular expression string from an array of URLs.
 *
 * @param urls - An array of URLs.
 * @returns An array of URLs or a regular expression string.
 *
 * @example
 * When there is a single URL:
 * const url = buildCallBackUrlsWithRegExp(["https://example.com/login"]);
 * Result: ["https://example.com/login"]
 *
 * When there are multiple URLs:
 * const urls = buildCallBackUrlsWithRegExp(["https://example.com/login", "https://app.example.com/login"]);
 * Result: ["regexp=(https://example.com/login|https://app.example.com/login)"]
 */
const buildCallBackUrlsWithRegExp = (urls: string[]): string[] => {
    const sanitizedURLs: string[] = urls?.map((url: string) => url.replace(/['"]+/g, ""));

    if (sanitizedURLs.length > 1) {
        return [ `regexp=(${sanitizedURLs.join("|")})` ];
    }

    return sanitizedURLs;
};

export default buildCallBackUrlsWithRegExp;
