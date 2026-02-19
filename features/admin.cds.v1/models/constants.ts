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
 * CDS related error constants.
 */
export const CDS_ERRORS: Record<string, string> = {
    DELETE_PROFILE_ERROR: "CDS_PROFILE_DELETE_ERROR",
    FETCH_PROFILES_ERROR: "CDS_PROFILES_FETCH_ERROR",
    FETCH_PROFILE_ERROR: "CDS_PROFILE_FETCH_ERROR",
    INVALID_STATUS_CODE: "CDS_INVALID_STATUS_CODE"
};

export const CDS_PROFILE_ATTRIBUTE_SCOPES: Record<string, string>  = {
    APPLICATION_DATA: "application_data",
    IDENTITY_ATTRIBUTES: "identity_attributes",
    TRAITS: "traits"
};

/**
 * Default profile list fields to fetch
 */
export const DEFAULT_PROFILE_LIST_FIELDS: string[] = [
    "identity_attributes.username",
    "identity_attributes.givenname",
    "identity_attributes.lastname"
];

/**
 * Default pagination settings
 */
export const DEFAULT_PAGE_SIZE: number = 10;

/**
 * Profile search operators
 */
export const PROFILE_SEARCH_OPERATORS: Record<string, string>= {
    CONTAINS: "co",
    EQUALS: "eq",
    STARTS_WITH: "sw"
};

export const APPLICATION_DATA: string = "application_data";
export const IDENTITY_ATTRIBUTES: string = "identity_attributes";
export const TRAITS: string = "traits";
export const AND_OPERATOR: string = "and";
