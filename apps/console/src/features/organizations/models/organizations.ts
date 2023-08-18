/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */
import { RolesInterface } from "@wso2is/core/models";
import { ScimOperationsInterface } from "../../roles/models/roles";

export interface OrganizationInterface {
    id: string;
    name: string;
    ref: string;
    status: "ACTIVE" | "DISABLED"
}

export interface OrganizationLinkInterface {
    href: string;
    rel: string;
}

export interface OrganizationListInterface {
    links: OrganizationLinkInterface[];
    organizations: OrganizationInterface[];
}

export interface AddOrganizationInterface {
    name: string;
    description: string;
    type: string;
    parentId: string;
    attributes?: OrganizationAttributesInterface[];
}

export interface OrganizationAttributesInterface {
    key: string;
    value: string;
}

export interface OrganizationResponseInterface {
    id: string;
    name: string;
    description: string;
    status: string;
    created: string;
    lastModified: string;
    type: string;
    domain: string;
    parent: {
        id: string;
        ref: string;
    };
    attributes: OrganizationAttributesInterface[];
}

export interface UpdateOrganizationInterface {
    name: string;
    description: string;
    status: string;
    attributes: OrganizationAttributesInterface[];
}

export interface OrganizationPatchData {
    operation: string;
    path: string;
    value: string;
}

export type OrganizationRoleInterface = RolesInterface;

export type OrganizationRoleListItemInterface = Omit<OrganizationRoleInterface, "users" | "permissions" | "groups">;

export type OrganizationRoleListResponseInterface = {
    totalResults: number;
    itemsPerPage: number;
    nextCursor: string;
    previousCursor: string;
    Resources: Array<OrganizationRoleListItemInterface>;
};

export type PatchOrganizationRoleDataInterface = {
    operations: ScimOperationsInterface[]
};

/**
 * Interface to store User information related to create role api
 */
export interface CreateOrganizationRoleMemberInterface {
    value: string;
    display?: string;
}

export interface BreadcrumbItem {
    id: string;
    name: string;
}

export type BreadcrumbList = BreadcrumbItem[];

export type GenericOrganization = OrganizationInterface | OrganizationResponseInterface | BreadcrumbItem;

export interface ShareApplicationRequestInterface {
    shareWithAllChildren: boolean;
    sharedOrganizations?: string[];
}
