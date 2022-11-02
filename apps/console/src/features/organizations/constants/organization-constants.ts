/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
    public static readonly ROOT_ORGANIZATION_ID: string = "10084a8d-113f-4211-a0d5-efe36b082211";

    /**
     * Super organization object.
     *
     */
    public static readonly ROOT_ORGANIZATION: OrganizationInterface = {
        id: this.ROOT_ORGANIZATION_ID,
        name: "Super",
        ref: "",
        status: "ACTIVE"
    };

    public static readonly ORGANIZATION_ROUTES = "organizations";
}

export enum ORGANIZATION_TYPE {
    STRUCTURAL = "STRUCTURAL",
    TENANT = "TENANT"
}

// Role constants
export class OrganizationRoleManagementConstants {
    /**
     * Set of keys used to enable/disable features.
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("ORGANIZATION_ROLE_CREATE", "organization-roles.create")
        .set("ORGANIZATION_ROLE_UPDATE", "organization-roles.update")
        .set("ORGANIZATION_ROLE_DELETE", "organization-roles.delete")
        .set("ORGANIZATION_ROLE_READ", "organization-roles.read");

    public static readonly SUPER_ADMIN_PERMISSION_KEY = "/permission/protected";
    public static readonly ORG_CREATOR_ROLE_NAME = "org-creator";
}

export const APPLICATION_DOMAIN = "Application/";
export const INTERNAL_DOMAIN = "Internal";
export const PRIMARY_DOMAIN = "Primary";
export const ROLE_VIEW_PATH = "/organization-roles/";

export const ORGANIZATION_NAME_MIN_LENGTH = 3;
export const ORGANIZATION_NAME_MAX_LENGTH = 32;
export const ORGANIZATION_DESCRIPTION_MIN_LENGTH = 3;
export const ORGANIZATION_DESCRIPTION_MAX_LENGTH = 300;

/**
 * Contains all the possible types of organizations.
 */
export enum OrganizationType {
    SUBORGANIZATION = "SUBORGANIZATION",
    TENANT = "TENANT",
    FIRST_LEVEL_ORGANIZATION = "FIRST_LEVEL_ORGANIZATION",
    SUPER_ORGANIZATION= "SUPER_ORGANIZATION"
}
