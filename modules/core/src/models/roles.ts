/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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
 * Interface to contain top level role information
 */
export interface RolesInterface {
    displayName: string;
    id: string;
    meta?: RolesMetaInterface;
    groups?: RoleGroupsInterface[];
    users?: RolesMemberInterface[];
    permissions?: string[] | RolePermissionInterface[];
    audience?: RoleAudiencesInterface;
    associatedApplications?: RoleConnectedApplicationInterface[];
    properties?: RolePropertyInterface[];
}

/**
 * Interface to contain roles listing
 */
export interface RoleListInterface {
    totalResults?: number;
    startIndex?: number;
    itemsPerPage?: number;
    Resources?: RolesInterface[];
    schemas: string;
}

/**
 * Interface to contain Role meta information
 */
export interface RolesMetaInterface {
    created?: string;
    location: string;
    lastModified?: string;
    systemRole?: boolean;
}

/**
 * Interface to contain Role member information
 */
export interface RolesMemberInterface {
    display: string;
    audienceType?: string;
    audienceDisplay?: string
    value: string;
    orgId: string;
    orgName: string;
    $ref: string;
}

/**
 * Interface to contain groups information of the role
 */
export interface RoleGroupsInterface {
    display: string;
    value: string;
    $ref: string;
}

/**
 * Interface to contain role audiences information
 */
export interface RoleAudiencesInterface {
    value?: string;
    display: string;
    type: string;
}

/**
 * Interface to contain role permissions information
 */
export interface RolePermissionInterface {
    displayName: string;
    value: string;
    $ref?: string;
    display?: string;
}

/**
 * Interface to contain role connected applications information
 */
export interface RoleConnectedApplicationInterface {
    displayName?: string;
    display?: string;
    value?: string;
    $ref?: string;
}

export interface RolePropertyInterface {
    name: string;
    value: string;
}
