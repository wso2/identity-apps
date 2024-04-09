/**  
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentityAppsError } from "@wso2is/core/errors";

/**
  * Interface to store data for create group api.
  */
export interface OrganizationInterface {
    id: string;
    name: string;
    ref: string;
    status: "ACTIVE" | "DISABLED"
}

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

    public static readonly ORGANIZATION_ROUTES: string = "organizations";

    /**
     * Sub Organization creation limit reached error.
     */
    public static readonly ERROR_CREATE_LIMIT_REACHED: IdentityAppsError = new IdentityAppsError(
        "RLS-10001",
        "console:develop.features.applications.notifications.apiLimitReachedError.error.description",
        "console:develop.features.applications.notifications.apiLimitReachedError.error.message",
        "cdaefcee-ecdb-47af-8538-174ec13292db"
    );
}

/**
 * Contains all the possible types of organizations.
 */
export enum OrganizationType {
    SUBORGANIZATION = "SUBORGANIZATION",
    TENANT = "TENANT",
    FIRST_LEVEL_ORGANIZATION = "FIRST_LEVEL_ORGANIZATION",
    SUPER_ORGANIZATION= "SUPER_ORGANIZATION"
}
