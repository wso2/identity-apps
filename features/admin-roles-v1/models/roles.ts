/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { CreateGroupMemberInterface } from "../../groups/models";
import { SchemaAttributeValueInterface } from "../../admin-users-v1/models";

/**
 * Interface to store data for create role api.
 */
export interface CreateRoleInterface {
    schemas?: string[];
    displayName?: string;
    members?: CreateRoleMemberInterface[];
    users?: CreateRoleMemberInterface[];
    groups?: CreateGroupMemberInterface[];
    permissions?: string[];
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
    roleName: string;
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
    schemas: string[];
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
