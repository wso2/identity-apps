/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { AppConstants } from "../../admin.core.v1";

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

    public static readonly AFTER_REL: string = "after";
    public static readonly BEFORE_REL: string = "before";
    public static readonly CHOREO_GW_NAME: string = "Choreo";
    public static readonly DEFAULT_TOTAL_PAGES: number = 10;
    public static readonly EMPTY_STRING: string = "";
    public static readonly API_RESOURCE_DIR: string = "api-resources";
    public static readonly UNAUTHORIZED_ACCESS: string = "FLU-600000";
    public static readonly API_RESOURCE_ALREADY_EXISTS: string = "FLU-600020";
    public static readonly PERMISSION_ALREADY_EXISTS: string = "FLU-600021";
    public static readonly API_RESOURCE_NOT_FOUND: string = "FLU-600022";
    public static readonly NO_VALID_API_RESOURCE_ID_FOUND: string = "FLU-600027";
    public static readonly INVALID_REQUEST_PAYLOAD: string = "FLU-600040";

    /**
     * Get the API resource paths as a map.
     *
     * @returns `Map<string, string>`
     */
    public static getPaths(): Map<string, string> {

        return new Map<string, string>()
            .set("API_RESOURCES", `${ AppConstants.getDeveloperViewBasePath() }/` + `${this.API_RESOURCE_DIR}`)
            .set("API_RESOURCE_EDIT", `${ AppConstants.getDeveloperViewBasePath() }/${this.API_RESOURCE_DIR}/:id`);
    }

    /**
     * To check whether the given value is a valid permission identifier.
     *
     * @param value - permission identifier
     * @returns boolean - true if the value is a valid permission identifier
     */
    public static checkValidPermissionIdentifier = (value: string): boolean => value.match(/\s/) === null;
}
