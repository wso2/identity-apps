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
import { RoleSharingInterface } from "@wso2is/admin.applications.v1/models/application";
import { ScimOperationsInterface } from "@wso2is/admin.roles.v2/models/roles";
import { RolesInterface } from "@wso2is/core/models";

export interface OrganizationInterface {
    id: string;
    name: string;
    orgHandle?: string;
    ref: string;
    status: "ACTIVE" | "DISABLED",
    hasChildren?: boolean;
    parentId?: string;
    roles?: OrganizationRoleInterface[];
    sharingMode?: {
        roleSharing: {
            mode: string;
        }
    }
}

export interface OrganizationLinkInterface {
    href: string;
    rel: string;
}

export interface OrganizationListInterface {
    links?: OrganizationLinkInterface[];
    organizations: OrganizationInterface[];
    sharingMode?: {
        policy: string;
        roleSharing: {
            mode: string;
            roles: RoleSharingInterface[]
        }
    }
}

export interface AddOrganizationInterface {
    name: string;
    orgHandle?: string;
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
    orgHandle?: string;
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

export interface OrganizationsMetaAttributesListInterface {
    links?: OrganizationLinkInterface[];
    attributes: string[];
}

/**
 * Represents the request body structure for checking the availability of an organization handle.
 */
export interface CheckOrgHandleInterface {
    orgHandle: string;
}

/**
 * Represents the response structure for checking the availability of an organization handle.
 */
export interface CheckOrgHandleResponseInterface {
    available: boolean;
}

export interface GetOrganizationsParamsInterface {
    shouldFetch?: boolean,
    filter?: string;
    limit?: number;
    after?: string;
    before?: string;
    recursive?: boolean;
    isRoot?: boolean;
}

export interface SelectedOrganizationRoleInterface extends OrganizationRoleInterface {
    selected: boolean;
}
