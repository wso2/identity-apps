/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

export class TenantManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    public static readonly TENANT_URI_PLACEHOLDER: string = "myorg";

    public static readonly EU_PROD_CONSOLE_FALLBACK_URL: string = "https://console.eu.asgardeo.io";
    public static readonly US_PROD_CONSOLE_FALLBACK_URL: string = "https://console.asgardeo.io";

    /**
     * Form element constraints.
     */
    public static readonly FORM_FIELD_CONSTRAINTS: Record<string, any> = {
        TENANT_NAME_ALPHANUMERIC: new RegExp("^[a-z0-9]+$"),
        TENANT_NAME_FIRST_ALPHABET: new RegExp("^[a-z]"),
        TENANT_NAME_MAX_LENGTH: 30,
        TENANT_NAME_MIN_LENGTH: 4,
        TENANT_NAME_PATTERN: new RegExp("^[a-z][a-z0-9]{3,29}$")
    }
}
