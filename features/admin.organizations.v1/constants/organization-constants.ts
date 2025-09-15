/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentityAppsError } from "@wso2is/core/errors";
import { OrganizationInterface } from "../models";

export class OrganizationManagementConstants {
    /**
     * Set of keys used to enable/disable features.
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("ORGANIZATION_CREATE", "organizations.create")
        .set("ORGANIZATION_UPDATE", "organizations.update")
        .set("ORGANIZATION_DELETE", "organizations.delete")
        .set("ORGANIZATION_READ", "organizations.read");

    /**
     * Super organization id as per alpha pack 2
     */
    public static readonly SUPER_ORGANIZATION_ID: string = "10084a8d-113f-4211-a0d5-efe36b082211";

    /**
     * Super organization object.
     *
     */
    public static readonly ROOT_ORGANIZATION: OrganizationInterface = {
        id: this.SUPER_ORGANIZATION_ID,
        name: "Super",
        orgHandle: "carbon.super",
        ref: "",
        status: "ACTIVE"
    };

    public static readonly ORGANIZATION_ROUTES: string[] = [ "organizations" ];

    /**
     * Sub Organization creation limit reached error.
     */
    public static readonly ERROR_CREATE_LIMIT_REACHED: IdentityAppsError = new IdentityAppsError(
        "RLS-10001",
        "applications:notifications.apiLimitReachedError.error.description",
        "applications:notifications.apiLimitReachedError.error.message",
        "cdaefcee-ecdb-47af-8538-174ec13292db"
    );

    public static readonly ERROR_SUB_ORGANIZATION_EXIST: IdentityAppsError = new IdentityAppsError(
        "ORG-60076",
        "suborganizations:notifications.duplicateOrgError.description",
        "suborganizations:notifications.duplicateOrgError.message",
        "cdaefcee-ecdb-47af-8538-174ec13292db"
    );

    public static readonly ORG_HANDLE_REGEX: string = "^[a-zA-Z0-9 .\\-_]+$";
    public static readonly ORG_HANDLE_SANITIZATION_REGEX: RegExp = /^[^a-z]*|[^a-z0-9]/g;
    public static readonly MIN_ORG_HANDLE_LENGTH: number = 3;
    public static readonly MAX_ORG_HANDLE_LENGTH: number = 32;

    /**
     * Organization handle constants.
     */
    public static readonly ORG_HANDLE_PLACEHOLDER: string = "myorg";
    public static readonly SAMPLE_ORG_HANDLE_DOMAIN_EXTENSION: string = ".com";

    /**
     *  Organization handle field constraints.
     */
    public static readonly ORG_HANDLE_FIELD_CONSTRAINTS: Record<string, any> = {
        ORG_HANDLE_ALPHANUMERIC: new RegExp("^[a-z0-9]+$"),
        ORG_HANDLE_ALPHANUMERIC_WITH_DOMAIN: new RegExp("^(?=[a-z0-9.]*\\.[a-z0-9.]*$)[a-z0-9.]+$"),
        ORG_HANDLE_FIRST_ALPHABET: new RegExp("^[a-zA-Z]"),
        ORG_HANDLE_MAX_LENGTH: 30,
        ORG_HANDLE_MIN_LENGTH: 4,
        ORG_HANDLE_PATTERN: new RegExp("^[a-z][a-z0-9]{3,29}$")
    };
}

export enum ORGANIZATION_TYPE {
    STRUCTURAL = "STRUCTURAL",
    TENANT = "TENANT"
}

/**
 * Role constants
 */
export class OrganizationRoleManagementConstants {
    /**
     * Set of keys used to enable/disable features.
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("ORGANIZATION_ROLE_CREATE", "organization-roles.create")
        .set("ORGANIZATION_ROLE_UPDATE", "organization-roles.update")
        .set("ORGANIZATION_ROLE_DELETE", "organization-roles.delete")
        .set("ORGANIZATION_ROLE_READ", "organization-roles.read");

    public static readonly SUPER_ADMIN_PERMISSION_KEY: string = "/permission/protected";
    public static readonly ORG_CREATOR_ROLE_NAME: string = "org-creator";
    public static readonly ORG_ADMIN_ROLE_NAME: string = "Administrator";
}

export const APPLICATION_DOMAIN: string = "Application/";
export const INTERNAL_DOMAIN: string = "Internal";
export const ROLE_VIEW_PATH: string = "/organization-roles/";

export const ORGANIZATION_NAME_MIN_LENGTH: number = 3;
export const ORGANIZATION_NAME_MAX_LENGTH: number = 32;
export const ORGANIZATION_DESCRIPTION_MIN_LENGTH: number = 3;
export const ORGANIZATION_DESCRIPTION_MAX_LENGTH: number = 300;

/**
 * Contains all the possible types of organizations.
 */
export enum OrganizationType {
    SUBORGANIZATION = "SUBORGANIZATION",
    TENANT = "TENANT",
    FIRST_LEVEL_ORGANIZATION = "FIRST_LEVEL_ORGANIZATION",
    SUPER_ORGANIZATION = "SUPER_ORGANIZATION"
}
