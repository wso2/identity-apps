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

import { CreateGroupMemberInterface } from "@wso2is/admin.groups.v1/models/groups";
import { SchemaAttributeValueInterface } from "@wso2is/admin.users.v1/models/user";
import { RolesInterface } from "@wso2is/core/models";
import { ScopeInterface } from "./apiResources";
import { RoleAudienceTypes } from "../constants/role-constants";

/**
 * Interface to store data for create role api.
 */
export interface CreateRoleInterface {
    schemas?: string[];
    displayName?: string;
    members?: CreateRoleMemberInterface[];
    users?: CreateRoleMemberInterface[];
    groups?: CreateGroupMemberInterface[];
    permissions?: string[] | CreateRolePermissionInterface[];
    audience?: CreateRoleAudienceInterface;
}

/**
 * Interface to store User information related to create role api
 */
export interface CreateRoleMemberInterface {
    value: string;
    display?: string;
}

/**
 * Interface to store form data from create role wizard form.
 */
export interface CreateRoleFormData {
    domain?: string;
    roleName?: string;
    assignedApplicationId?: string;
    assignedApplicationName?: string;
    roleAudience?: string;
    displayName?: string;
}

/**
 * Interface to store create role permissions.
 */
export interface CreateRolePermissionInterface {
    value: string;
}

export interface CreateRoleAudienceInterface {
    display?: string;
    value: string;
    type: string;
}

/**
 * Interface to store data for search role api.
 */
export interface SearchRoleInterface {
    schemas: string[];
    startIndex: number;
    filter: string;
}

export interface PatchRoleDataInterface {
    schemas?: string[];
    Operations: ScimOperationsInterface[];
}

export interface ScimOperationsInterface {
    op: string;
    value?: any;
    path?: string;
}

/**
 * Interface for Operation value in SCIM operation.
 */
export interface OperationValueInterface {
    [key: string]: string | string[] | (string | string[])[] |
        (string | string[] | SchemaAttributeValueInterface)[] |
        { [x: string]: string | boolean | string[]; } |
        { [x: string]: { [x: string]: string | boolean | string[]; }; } |
        { formatted: string | string[]; type: string; }[] |
        { type: string; value: string | boolean | string[]; }[]
}

/**
 * Interface to store data for assigned sections of the role edit interface.
 */
export interface RoleEditSectionsInterface {
    /**
     * User profile
     */
    role: RolesInterface;
    /**
     * Handle user update callback.
     */
    onRoleUpdate: (tabIndex: number) => void;
    /**
     * Show if the user is read only.
     */
    isReadOnly: boolean;
    /**
     * Tab index
     */
    tabIndex: number;
    /**
     * active user store
     *
     * Note: used to conditionally determine whether the userstore is handled
     * outside the component.
     */
    activeUserStore?: string
    /**
     * Flag to check if privileged users toggle is visible.
     */
    isPrivilegedUsersToggleVisible?: boolean;
    /**
     * Is roles assignment for non human users (eg: AI agents)
     */
    isForNonHumanUser?: boolean
}

/**
 * Interface to store data in the basic role edit interface.
 */
export interface RoleBasicInterface {
    /**
     * Role name.
     */
    roleName: string;
}

/**
 * Enum for steps form types of the create role stepper.
 * @readonly
 */
export enum CreateRoleStepsFormTypes {
    /**
     * Basic details step.
     */
    BASIC_DETAILS = "BasicDetails",
    /**
     * Role permissions step.
     */
    PERM_LIST = "PermissionList"
}

/**
 * Interface to capture current state of the create role interface.
 */
export interface CreateRoleStateInterface {
    /**
     * Basic details step form data.
     */
    [ CreateRoleStepsFormTypes.BASIC_DETAILS ]: CreateRoleFormData;
}

/**
 * Interface for roles V2 data.
 */
export interface RolesV2Interface {
    audience: {
        display: string;
        type: string;
        value: string;
    };
    displayName: string;
    id: string;
    meta: {
        location: string;
        systemRole?: boolean;
    };
    permissions?: string[];
    schemas?: string[];
}

/**
 *  Interface for roles V2 response data.
 */
export interface RolesV2ResponseInterface {
    /**
     * Number of results that match the listing operation.
     */
    totalResults?: number;
    /**
     * Index of the first element of the page, which will be equal to offset + 1.
     */
    startIndex?: number;
    /**
     * Schema related to the response.
     */
    schemas?: string[];
    /**
     * Number of elements in the returned page.
     */
    itemsPerPage?: number;
    /**
     * Set of roles.
     */
    Resources: RolesV2Interface[];
}

/**
 *  Interface for associated roles patch operation.
 */
export interface AssociatedRolesPatchObjectInterface {
    allowedAudience: RoleAudienceTypes;
    roles: BasicRoleInterface[];
}

export interface AssociatedRolesInterface {
    allowedAudience: RoleAudienceTypes;
    roles: BasicRoleInterface[];
}

export interface BasicRoleInterface {
    id: string;
    name?: string;
}

/**
 * Interface to capture the selected permissions.
 */
export interface SelectedPermissionsInterface {
    /**
     * ID of the API resource that the scopes belongs to.
     */
    apiResourceId: string;
    /**
     * set of scopes names that are selected.
     */
    scopes: ScopeInterface[];
}

/**
 * Interface to capture options passed to the Autocomplete component in the role section.
 */
export interface ChipOptionsInterface {
    id?: string;
}

/**
 * Interface to capture permission update in role.
 */
export interface PermissionUpdateInterface {
    value: string;
}
