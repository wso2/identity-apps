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
 * Class containing Email Management constants.
 */
export class EmailManagementConstants {
    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() {}

    public static readonly DEFAULT_CONTENT_TYPE: string = "text/html; charset=UTF-8";

    /**
     * Set of keys used to enable/disable features.
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("EMAIL_TEMPLATES_CREATE", "emailTemplates.create")
        .set("EMAIL_TEMPLATES_UPDATE", "emailTemplates.update")
        .set("EMAIL_TEMPLATES_DELETE", "emailTemplates.delete")
        .set("EMAIL_TEMPLATES_READ", "emailTemplates.read");
}
