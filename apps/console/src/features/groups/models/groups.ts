/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the License); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * AS IS BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { RolesMemberInterface } from "@wso2is/core/models";

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

/**
 * Interface to contain top level group information
 */
export interface GroupsInterface {
    displayName: string;
    id: string;
    meta: GroupsMetaInterface;
    members?: GroupsMemberInterface[];
    roles?: RolesMemberInterface[];
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
    created: string;
    location: string;
    lastModified: string;
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
    value: any;
    path?: string;
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
