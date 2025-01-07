/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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
 * Class containing app constants which can be used across several applications.
 */
export class UserManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Set of SCIM2 schema names.apps/myaccount/src/store/actions/authenticate.ts
     * @typeparam SCIM2_SCHEMA_DICTIONARY - `Map<string, string>`
     * @defaultValue
     */
    public static readonly SCIM2_SCHEMA_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("EMAILS", "emails")
        .set("USERNAME", "userName")
        .set("NAME", "name")
        .set("DISPLAY_NAME", "displayName");

    /**
     * Default scim2 custom user schema URI.
     */
    public static readonly DEFAULT_SCIM2_CUSTOM_USER_SCHEMA_URI: string = "urn:scim:wso2:schema";
}
