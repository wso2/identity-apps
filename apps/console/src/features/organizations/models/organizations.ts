import { RolesInterface } from "@wso2is/core/models";
import { ScimOperationsInterface } from "../../roles";

/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

export interface OrganizationInterface {
    id: string;
    name: string;
    ref: string;
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
    links: OrganizationLinkInterface[];
    roles: Array<OrganizationRoleListItemInterface>
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
