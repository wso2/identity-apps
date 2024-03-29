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

import { UserDetailsInterface } from "./user";
import { PatchRoleDataInterface } from "../../admin-roles-v2/models";

/**
 * Interface for the Users feature resource endpoints.
 */
export interface UsersResourceEndpointsInterface {
    bulk: string;
    groups: string;
    me: string;
    userSessions: string;
    userStores: string;
    users: string;
    schemas: string;
    guests: string;
    guestsList: string;
}

/**
 * Interface for the SCIM bulk operation.
 */
export interface SCIMBulkResponseOperation {
    bulkId: string;
    method: string;
    location: string;
    status: {
        code: number;
    };
    response?: string;
}

export interface SCIMBulkOperation {
    method: string;
    bulkId: string;
    path: string;
    data: Record<string, unknown> | UserDetailsInterface | PatchRoleDataInterface;
}

/**
 * Interface for the SCIM bulk endpoint.
 */
export interface SCIMBulkEndpointInterface {
    failOnErrors: number;
    schemas: string[];
    Operations: SCIMBulkOperation[];
}

