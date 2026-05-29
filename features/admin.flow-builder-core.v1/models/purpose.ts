/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
 * Represents a user attribute that can be selected under a purpose.
 */
export interface PurposeAttributeInterface {
    displayName?: string;
    id: string;
    name: string;
}

/**
 * Represents a single purpose (preference or policy).
 * `description` may be a plain string or an i18n map keyed by locale (e.g. `{ "en-US": "...", "fr-FR": "..." }`).
 */
export interface PurposeInterface {
    attributes: PurposeAttributeInterface[];
    description?: string | Record<string, string>;
    name?: string;
    purposeId: string;
}
