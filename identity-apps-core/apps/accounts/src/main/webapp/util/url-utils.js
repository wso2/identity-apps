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

var URLUtils = (function () {
    return {
        /**
         * Extracts the domain from the URL.
         *
         * This function uses a fallback parser for custom hostnames or cases where
         * parsing fails. Assumes valid `localhost` as a hostname.
         *
         * @param {string} url - The URL to extract the domain from.
         * @param {Object} options - Additional options for parsing.
         * @returns {string|undefined} The extracted domain or `undefined` if parsing fails.
         */
        getDomain: function (url, options) {
            options = options || {
                validHosts: ['localhost'],
            };

            var domain = null;

            try {
                if (typeof tldts !== 'undefined') {
                    domain = tldts.getDomain(url, options);
                }

                // `tldts` doesn't handle non TDLDs like custom hostnames.
                // Fallback to a simple parser for such cases.
                if (domain === null || typeof domain === "undefined") {
                    try {
                        var parsedURL = new URL(url);

                        var hostnameTokens = parsedURL.hostname.split(".");

                        if (hostnameTokens.length === 1){
                            domain = hostnameTokens[0];
                        } else if (hostnameTokens.length > 1) {
                            domain = hostnameTokens.slice(hostnameTokens.length - 2, hostnameTokens.length).join(".");
                        }
                    } catch (e) {
                        // Couldn't parse the hostname. Log the error in debug mode.
                        // Tracked here https://github.com/wso2/product-is/issues/11650.
                    }
                }
            } catch (e) {
                // Couldn't parse the hostname. Log the error in debug mode.
                // Tracked here https://github.com/wso2/product-is/issues/11650.
            }

            return domain;
        },
    };
})();
