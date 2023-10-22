/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
 * Interface to store link data of paginated response.
 */
export interface LinkInterface {
    rel: string;
    href: string;
}

/**
 * Interface to store link data of paginated response.
 */
export interface ApplicationRolesResponseInterface {
    links: LinkInterface[]
    roles: RoleListItemInterface[];
}

/**
 * Interface to store role list item.
 */
export interface RoleListItemInterface {
    name: string;
    permissions: PermissionListItemInterface[];
}

/**
 * Interface to store permission list item.
 */
export interface PermissionListItemInterface {
    name: string;
}

/**
 * Interface to store authorized API list item.
 */
export interface AuthorizedAPIListItemInterface {
    id?: string;
    apiId: string;
    apiDisplayName?: string;
    apiIdentifier?: string;
    policyIdentifier?: string;
    isChoreoAPI?: boolean;
    allPermissions?: AuthorizedPermissionListItemInterface[];
    permissions: AuthorizedPermissionListItemInterface[];
}

/**
 * Interface to store searched API list item.
 */
export interface SearchedAPIListItemInterface {
    id: string;
    gwName?: string;
    permissions?: AuthorizedPermissionListItemInterface[];
}

/**
 * Interface to store authorized permission list item.
 */
export interface AuthorizedPermissionListItemInterface {
    id: string;
    displayName: string;
    name: string;
}

/**
 * Interface for create role payload.
 */
export interface CreateRolePayloadInterface {
    name: string;
    permissions: PermissionListItemInterface[];
}

/**
 * Interface for update role payload.
 */
export interface UpdateRolePayloadInterface {
    name: string;
    added_permissions: PermissionListItemInterface[];
    removed_permissions: PermissionListItemInterface[];
}

/**
 * Interface for basic role details.
 */
export interface RoleBasicDetailsInterface {
    basic: RoleNameInterface;
}

/**
 * Interface for role name.
 */
export interface RoleNameInterface {
    roleName: string; 
}

/**
 * Policy interface.
 */
export interface PolicyInterface {
    policies: string[];
}

/**
 * Interface for shared application data.
 */
export interface SharedApplicationDataInterface {
    applicationId: string;
    organizationId: string;
}

/**
 * Interface for shared application API response.
 */
export interface SharedApplicationAPIResponseInterface {
    sharedApplications?: SharedApplicationDataInterface[];
}

/**
 * Interface for application role group.
 */
export interface ApplicationRoleGroupInterface {
    name: string;
    orgName?: string;
    organization?: string;
}

/**
 * Interface for application role groups API response.
 */
export interface ApplicationRoleGroupsAPIResponseInterface {
    groups: ApplicationRoleGroupInterface[];
    name: string;
}

export interface ApplicationRoleGroupsUpdatePayloadInterface {
    added_groups: ApplicationRoleGroupInterface[];
    removed_groups: ApplicationRoleGroupInterface[];
}

export interface DescendantDataInterface {
    id: string;
    name: string;
}
