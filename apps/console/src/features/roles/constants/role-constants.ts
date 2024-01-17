/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

export const APPLICATION_DOMAIN: string = "Application/";
export const INTERNAL_DOMAIN: string = "Internal";
export const PRIMARY_DOMAIN: string = "Primary";
export const ROLE_VIEW_PATH: string = "/roles/";
export const DOMAIN_SEPARATOR: string = "/";

/**
 * Role audience interface.
 */
export enum RoleAudienceTypes {
    APPLICATION = "APPLICATION",
    ORGANIZATION = "ORGANIZATION"
}

/**
 * Class containing role constants.
 */
export class RoleConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */

    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Set of keys used to enable/disable features.
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("ROLE_CREATE", "roles.create")
        .set("ROLE_UPDATE", "roles.update")
        .set("ROLE_DELETE", "roles.delete")
        .set("ROLE_READ", "roles.read");

    public static readonly SUPER_ADMIN_PERMISSION_KEY: string = "/permission/protected";

    /**
     * Debounce timeout for role search.
     */
    public static readonly DEBOUNCE_TIMEOUT: number = 1000;

    /**
     * Maximum length of the role name.
     */
    public static readonly ROLE_NAME_MAX_LENGTH: number = 255;

    /**
     * Minimum length of the role name.
     */
    public static readonly ROLE_NAME_MIN_LENGTH: number = 3;

    /**
     * Default role audience.
     */
    public static readonly DEFAULT_ROLE_AUDIENCE: string = RoleAudienceTypes.APPLICATION;

    /**
     * Read only applications client ids.
     */
    public static readonly READONLY_APPLICATIONS_CLIENT_IDS: string[] = [
        "CONSOLE",
        "MY_ACCOUNT"
    ];

    /**
     * Filter query for audience type application.
     */
    public static readonly ROLE_AUDIENCE_APPLICATION_FILTER: string = "audience.type eq application";

    /**
     * filter query for audience type organization.
     */
    public static readonly ROLE_AUDIENCE_ORGANIZATION_FILTER: string = "audience.type eq organization";
}

/**
 * Enum for SCIM2 schemas used in roles.
 */
export enum Schemas {
    SEARCH_REQUEST = "urn:ietf:params:scim:api:messages:2.0:SearchRequest",
    BULK_REQUEST = "urn:ietf:params:scim:api:messages:2.0:BulkRequest",
    PATCH_OP = "urn:ietf:params:scim:api:messages:2.0:PatchOp"
}
