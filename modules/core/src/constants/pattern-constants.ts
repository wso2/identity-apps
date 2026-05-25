/**
 * Copyright (c) 2020-2026, WSO2 LLC. (https://www.wso2.com).
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
 * Class containing regex patterns.
 */
export class PatternConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    /**
     * HTTP URL pattern regex.
     */
    public static readonly HTTP_URL_REGEX_PATTERN: RegExp = new RegExp("^(http:\\/\\/)?((([a-z\\d]([a-z\\d-]" +
        "*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_" +
        ".~+=-]*)?(\\#[-a-z\\d_]*)?$", "i");

    /**
     * HTTPS URL pattern regex.
     */
    public static readonly HTTPS_URL_REGEX_PATTERN: RegExp = new RegExp("^(https:\\/\\/)?((([a-z\\d]([a-z\\d-]" +
        "*[a-z\\d])*)\\.?)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_" +
        ".~+=-]*)?(\\#[-a-z\\d_]*)?$", "i");

    /**
     * HTTPS/HTTP URL pattern regex.
     */
    public static readonly HTTPS_OR_HTTP_REGEX_PATTERN: RegExp = new RegExp("https?:\\/\\/");

    /**
     * Data URL pattern regex.
     */
    public static readonly DATA_URL_REGEX_PATTERN: RegExp = /^data:.+\/(.+);base64,(.*)$/;

    /**
     * Mobile deep link pattern regex.
     * Matches custom URI schemes used for mobile deep links, supporting both
     * double-slash authority URIs (e.g., myapp://callback) and single-slash
     * path-only URIs (e.g., com.example.app:/path) as per RFC 3986.
     */
    public static readonly MOBILE_DEEP_LINK_URL_REGEX_PATTERN: RegExp = /^.+:\/{1,2}.*$/;

    /**
     * Loop back call pattern regex.
     * Matches URLs pointing to localhost or 127.0.0.1, typically used for loopback calls.
     */
    public static readonly LOOP_BACK_CALL_REGEX_PATTERN: RegExp = /(^(?:http|https):\/\/(localhost|127.0.0.1))/g;
}
