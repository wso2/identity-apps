/**
 * Copyright (c) 2019-2025, WSO2 LLC. (https://www.wso2.com).
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
 * Approval Task Summary model.
 */
export interface ApprovalTaskSummary {
    /**
     * Unique ID to represent an Approval Task
     */
    id: string;
    /**
     * Unique name for the Approval Task
     */
    name: string;
    /**
     * Details regarding the approval
     */
    details?: ApprovalTaskDetails;
    /**
     * Display value for Approval Operation
     */
    presentationSubject: string;
    /**
     * Display value for Approval Task
     */
    presentationName: string;
    /**
     * Type of the Approval
     */
    taskType: string;
    /**
     * State of the Approval task
     */
    status: ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED;
    /**
     * Priority of the Approval task
     */
    priority: number;
    /**
     * The time that the operation for approval initiated
     */
    createdTimeInMillis: string;
}

/**
 * Approval Task Details model.
 */
export interface ApprovalTaskDetails {
    /**
     * Unique ID to represent a approval task
     */
    id: string;
    /**
     * Subject of the Approval
     */
    subject: string;
    /**
     * Adds a new role to the system Description on the Approval task
     */
    description: string;
    /**
     * Priority of the Approval task
     */
    priority: number;
    /**
     * The user who initiated the task
     */
    initiator: string;
    /**
     * Available only for the completed Tasks, APPROVE or REJECT if the task has been completed, PENDING otherwise.
     */
    approvalStatus: ApprovalStatus.PENDING | ApprovalStatus.APPROVE | ApprovalStatus.REJECT;
    /**
     * To whom the task is assigned
     */
    assignees: Property[];
    /**
     * Array of extra properties
     */
    properties: Property[];
    /**
     * Status of the Approval task
     */
    taskStatus?: ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED | ApprovalStatus.BLOCKED;
    /**
     * The time that the operation for approval initiated
     */
    createdTimeInMillis?: string;
}

/**
 * Property model.
 */
interface Property {
    key: string;
    value: string;
}

/**
 * Approval Action model.
 */
export interface ApprovalAction {
    /**
     * Action to perform on the task.
     */
    action: ApprovalStatus.CLAIM | ApprovalStatus.RELEASE | ApprovalStatus.APPROVE | ApprovalStatus.REJECT;
}

/**
 * Enum for approval statuses.
 *
 * @readonly
 */
export enum ApprovalStatus {
    READY = "READY",
    COMPLETED = "COMPLETED",
    RESERVED = "RESERVED",
    PENDING = "PENDING",
    CLAIM = "CLAIM",
    RELEASE = "RELEASE",
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    BLOCKED = "BLOCKED",
    ALL = "ALL"
}

export interface ApprovalTaskListItemInterface {
    /**
     * Unique ID to represent a approval task
     */
    id: string;
    /**
     * Unique name for the Approval Task
     */
    name: string;
    /**
     * Display value for Approval Operation
     */
    presentationSubject: string;
    /**
     * Display value for Approval Task
     */
    presentationName: string;
    /**
     * Type of the Approval Task
     */
    taskType: string;
    /**
     * Status of the Approval Task
     */
    approvalStatus: ApprovalStatus.READY | ApprovalStatus.RESERVED | ApprovalStatus.COMPLETED | ApprovalStatus.BLOCKED;
    /**
     * Priority of the Approval task
     */
    priority: number;
    /**
     * Created time of the Approval task
     */
    createdTimeInMillis: string;
    /**
     * Details of the approval task.
     */
    details?: ApprovalTaskDetails;
}
