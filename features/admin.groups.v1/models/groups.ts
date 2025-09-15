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

import { BasicRoleInterface } from "@wso2is/admin.roles.v2/models/roles";
import { UserBasicInterface } from "@wso2is/admin.users.v1/models/user";
import { RolesMemberInterface } from "@wso2is/core/models";
import { GenericIconProps } from "@wso2is/react-components";
import { ReactElement } from "react";

/**
 * Interface to store data for create group api.
 */
export interface CreateGroupInterface {
    schemas?: string[];
    displayName?: string;
    members?: CreateGroupMemberInterface[];
}

/**
 * Interface to store User information related to create group api
 */
export interface CreateGroupMemberInterface {
    value: string;
    display?: string;
}

/**
 * Interface to get User information related to create group api
 */
export interface CreateGroupUserInterface {
    id: string;
    userName?: string;
}

/**
 * Interface to store form data from create group wizard form.
 */
export interface CreateGroupFormData {
    domain: string;
    groupName: string;
}

/**
 * Interface to store data for search group api.
 */
export interface SearchGroupInterface {
    schemas: string[];
    startIndex: number;
    filter: string;
}

export interface PatchGroupDataInterface {
    schemas: string[];
    Operations: GroupSCIMOperationsInterface[];
}

export interface PatchBulkGroupDataInterface {
    schemas: string[];
    Operations: PatchGroupOpInterface[];
    failOnErrors?: number;
}

export interface PatchGroupOpInterface {
    data: {
        Operations: (PatchGroupRemoveOpInterface | PatchGroupAddOpInterface)[];
    };
    method: string;
    path: string;
}

export interface PatchGroupRemoveOpInterface {
    op: string;
    path?: string;
}

export interface PatchGroupAddOpInterface {
    op: string;
    value?: {
        groups: { value: string }[]
    } | { value: string }[]
}

/**
 * Interface to contain top level group information
 */
export interface GroupsInterface {
    displayName: string;
    id: string;
    meta?: GroupsMetaInterface;
    members?: GroupsMemberInterface[];
    roles?: RolesMemberInterface[];
    schemas?: string[];
}

/**
 * Interface to contain groups listing
 */
export interface GroupListInterface {
    totalResults?: number;
    startIndex?: number;
    itemsPerPage?: number;
    Resources?: GroupsInterface[];
    schemas: string;
}

/**
 * Interface to contain Group meta information
 */
export interface GroupsMetaInterface {
    created?: string;
    location: string;
    lastModified?: string;
}

/**
 * Interface to contain Group member information
 */
export interface GroupsMemberInterface {
    display: string;
    value: string;
    $ref: string;
}

export interface GroupSCIMOperationsInterface {
    op: string;
    value?: any;
    path?: string;
}

/**
 * Interface to contain data for SCIM update group members api request.
 */
export interface GroupSCIMAddMemberInterface {
    members: CreateGroupMemberInterface[];
}

/**
 * Interface to store data for search group api.
 */
export interface SearchGroupInterface {
    schemas: string[];
    domain?: string;
    startIndex: number;
    filter: string;
}


/**
 * Enum for wizard steps form types.
 * @readonly
 */
export enum WizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails",
    ROLE_LIST = "RoleList"
}

/**
 * Interface to capture current wizard state
 */
export interface WizardStateInterface {
    [ key: string ]: any;
}

/**
 * Interface for wizard step.
 */
export interface WizardStepInterface {
    content: ReactElement;
    icon: GenericIconProps | any;
    name: string;
    title: string;
}

/**
 * Interface for group creation.
 */
export interface GroupCreateInterface {
    BasicDetails: GroupCreateBasicDetailsInterface;
    RoleList?: {
        roles: BasicRoleInterface[]
    }
}

/**
 * Interface to capture group creation basic data.
 */
export interface GroupCreateBasicDetailsInterface {
    basic?: {
        basicDetails: CreateGroupFormData
    },
    domain?: string;
    groupName?: string;
    users?: UserBasicInterface[]
}
