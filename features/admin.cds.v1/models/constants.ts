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
 * Default pagination settings
 */
export const DEFAULT_PAGE_SIZE: number = 10;

export const APPLICATION_DATA: string = "application_data";
export const IDENTITY_ATTRIBUTES: string = "identity_attributes";
export const TRAITS: string = "traits";
export const AND_OPERATOR: string = "and";

/**
 * Temporary priority value used during the sequential swap to avoid
 * two rules having the same priority at any point.
 */
export const TEMP_PRIORITY: number = 999999;

export const ATTRIBUTE_TYPE_PRIMITIVE_EXACT: string = "PRIMITIVE_EXACT";
export const UNIFICATION_METHOD_DETERMINISTIC: string = "deterministic";
export const UNIFICATION_METHOD_FUZZY: string = "fuzzy";

export const FUZZY_ATTRIBUTE_TYPE_FUZZY_STRING: string = "FUZZY_STRING";
export const FUZZY_ATTRIBUTE_TYPE_NAME: string = "NAME";
export const FUZZY_ATTRIBUTE_TYPE_EMAIL: string = "EMAIL";
export const FUZZY_ATTRIBUTE_TYPE_PHONE: string = "PHONE";
export const FUZZY_ATTRIBUTE_TYPE_LOCATION: string = "LOCATION";
