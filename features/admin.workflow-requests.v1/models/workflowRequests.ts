/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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


export interface WorkflowInstanceListItemInterface {
    workflowInstanceId: string;
    eventType: string;
    requestInitiator: string;
    createdAt: string;
    updatedAt: string;
    status: string;
}

export interface WorkflowInstanceListResponseInterface {
    startIndex: number;
    totalResults: number;
    count: number;
    instances: WorkflowInstanceListItemInterface[];
}

export interface WorkflowInstanceResponseInterface {
    workflowInstanceId: string;
    eventType: string;
    requestInitiator: string;
    createdAt: string;
    updatedAt: string;
    status: string;
    requestParams: {
        [ key: string ]: string;
    };
}

/**
 * Enum for workflow instance statuses.
 *
 * @readonly
 */
export enum WorkflowInstanceStatus {
    ALL_TASKS = "ALL_TASKS",
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    FAILED = "FAILED",
    DELETED = "DELETED"
}

/**
 * Enum for workflow instance operation types.
 *
 * @readonly
 */
export enum WorkflowInstanceOperationType {
    ALL = "ALL",
    ADD_USER = "ADD_USER",
    DELETE_USER = "DELETE_USER",
    UPDATE_ROLES_OF_USERS = "UPDATE_ROLES_OF_USERS",
    ADD_ROLE = "ADD_ROLE",
    DELETE_ROLE = "DELETE_ROLE"
}

/**
 * Enum for workflow instance event types.
 *
 * @readonly
 */
export enum WorkflowInstanceRequestType {
    ALL_TASKS = "ALL_TASKS",
    MY_TASKS = "MY_TASKS"
}

/**
 * Interface for complex predefined filter combinations.
 */
export interface PredefinedFilter {
    key: string;
    text: string;
    value: string;
    status?: WorkflowInstanceStatus;
    operationType?: WorkflowInstanceOperationType;
    timeRange?: number;
    description?: string;
}

/**
 * Enum for predefined complex filters.
 *
 * @readonly
 */
export enum PredefinedFilterType {
    ALL = "ALL",
    PENDING_USER_OPERATIONS = "PENDING_USER_OPERATIONS",
    PENDING_ROLE_OPERATIONS = "PENDING_ROLE_OPERATIONS",
    RECENT_APPROVALS = "RECENT_APPROVALS",
    RECENT_REJECTIONS = "RECENT_REJECTIONS",
    FAILED_OPERATIONS = "FAILED_OPERATIONS",
    MY_PENDING_TASKS = "MY_PENDING_TASKS",
    HIGH_PRIORITY_PENDING = "HIGH_PRIORITY_PENDING"
}
