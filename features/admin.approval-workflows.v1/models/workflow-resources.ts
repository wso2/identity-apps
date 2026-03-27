/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { ApplicationListInterface } from "@wso2is/admin.applications.v1/models/application";
import { GroupListInterface } from "@wso2is/admin.groups.v1/models/groups";
import { RoleListInterface } from "@wso2is/core/models";
import { UserStoreListItem } from "../../admin.userstores.v1/models/user-stores";

/**
 * Workflow-scoped role list response interface.
 */
export interface WorkflowRoleListInterface extends RoleListInterface {}

/**
 * Workflow-scoped group list response interface.
 */
export interface WorkflowGroupListInterface extends GroupListInterface {}

/**
 * Workflow-scoped application list response interface.
 */
export interface WorkflowApplicationListInterface extends ApplicationListInterface {}

/**
 * Workflow-scoped user store list item interface.
 */
export interface WorkflowUserStoreListItemInterface extends UserStoreListItem {}

/**
 * Union of all possible workflow resource list response types.
 */
export type WorkflowResourceListResponse =
    | WorkflowRoleListInterface
    | WorkflowGroupListInterface
    | WorkflowApplicationListInterface
    | WorkflowUserStoreListItemInterface[];

