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
 * Class containing SMS Management constants.
 */
export class SmsManagementConstants {
    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    private constructor() {}

    /**
     * Set of keys used to enable/disable features.
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("SMS_TEMPLATES_CREATE", "smsTemplates.create")
        .set("SMS_TEMPLATES_UPDATE", "smsTemplates.update")
        .set("SMS_TEMPLATES_DELETE", "smsTemplates.delete")
        .set("SMS_TEMPLATES_READ", "smsTemplates.read");
}
