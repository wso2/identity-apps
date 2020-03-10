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

/**
 * Utility class for search operations.
 */
export class SearchUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Builds a search query once a raw search string is passed in.
     *
     * @param {string} raw - Raw search string.
     * @return {string}
     */
    public static buildSearchQuery(raw: string): string {

        const SUPPORTED_OPERATOR_ALIASES: object = {
            co: [ "contain", "contains" ],
            eq: [ "equal", "equals" ],
            ew: [ "end with", "ends with" ],
            sw: [ "start with", "starts with" ]
        };

        const parts = raw.split(" ");
        const moderatedQueryParts = parts.splice(1, parts.length);

        // Try to extract the operator of the query by checking the aliases.
        // i.e if query is `name starts with john doe`, extract the `starts with` portion
        // and map it to `sw` to build the query as `name sw john doe`.
        for (const [ i, part ] of moderatedQueryParts.entries()) {
            for (const [ key, value ] of Object.entries(SUPPORTED_OPERATOR_ALIASES)) {
                for (const token of value) {
                    if (part === token) {
                        return [ parts[ 0 ], key, moderatedQueryParts.splice(i + 1, parts.length) ].join(" ");
                    }
                    if ([ part, moderatedQueryParts[ i + 1 ] ].join(" ") === token) {
                        return [ parts[ 0 ], key, moderatedQueryParts.splice(i + 2, parts.length) ].join(" ");
                    }
                }
            }
        }

        return raw;
    }
}
