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

import { AppConstants } from "../../core";

/**
 * Class containing API resources constants.
 */
export class APIResourcesConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    public static readonly NEXT_REL: string = "next";
    public static readonly PREVIOUS_REL: string = "previous";
    public static readonly AFTER: string = "after";
    public static readonly BEFORE: string = "before";
    public static readonly DEFAULT_TOTAL_PAGES: number = 10;
    public static readonly API_RESOURCE_DIR: string = "api-resources";

    // API Resource types.
    public static readonly SYSTEM: string = "SYSTEM";
    public static readonly SYSTEM_ORG: string = "SYSTEM_ORG";
    public static readonly SYSTEM_FEATURE: string = "SYSTEM_FEATURE";
    public static readonly BUSINESS: string = "BUSINESS";

    /**
     * Get the API resource paths as a map.
     *
     * @returns `Map<string, string>`
     */
    public static getPaths(): Map<string, string> {

        return new Map<string, string>()
            .set("API_RESOURCES", `${ AppConstants.getDeveloperViewBasePath() }/` + `${this.API_RESOURCE_DIR}`)
            .set("API_RESOURCES_CATEGORY",
                `${ AppConstants.getDeveloperViewBasePath() }/${this.API_RESOURCE_DIR}/:categoryId`)
            .set("API_RESOURCE_EDIT",
                `${ AppConstants.getDeveloperViewBasePath() }/${this.API_RESOURCE_DIR}/:categoryId/:id`);
    }

    /**
     * To check whether the given value is a valid permission identifier.
     *
     * @param value - permission identifier
     * @returns boolean - true if the value is a valid permission identifier
     */
    public static checkValidPermissionIdentifier = (value: string): boolean => value.match(/\s/) === null;
}

/*
* The types of API Resources.
*/
export enum APIResourceType {
    MANAGEMENT = "management",
    ORGANIZATION = "organization",
    BUSINESS = "business"
}

/*
* The API Resource category type prefix.
* Manamgement API Resources are prefixed with `TENANT`.
* Organization API Resources are prefixed with `ORGANIZATION`.
*/
export enum APIResourceCategoryPrefixes {
    MANAGEMENT = "TENANT",
    ORGANIZATION = "ORGANIZATION"
}

/*
* The API Resource category.
*/
export enum APIResourceCategories {
    BUSINESS = "BUSINESS",
    CONSOLE_FEATURE = "CONSOLE_FEATURE",
    ORGANIZATION = "ORGANIZATION",
    CONSOLE_ORG_LEVEL = "CONSOLE_ORG_LEVEL",
    SYSTEM = "SYSTEM",
    TENANT = "TENANT",
}
