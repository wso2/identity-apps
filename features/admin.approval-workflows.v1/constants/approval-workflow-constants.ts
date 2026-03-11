/**
 * Copyright (c) 2025-2026, WSO2 LLC. (https://www.wso2.com).
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

export class ApprovalWorkflowConstants {

    private constructor() {}
    public static getPaths(): Map<string, string> {
        return new Map<string, string>().set(
            "APPROVAL_WORKFLOW_CREATE",
            `${window["AppUtils"].getConfig().adminApp.basePath}/workflow-model-create`
        );
    }
}

interface ApprovalWorkflowValidationRegexPatternInterface {
    EscapeRegEx: string;
}

/**
 * Approval workflow validation regEx patterns
 */
export const APPROVAL_WORKFLOW_VALIDATION_REGEX_PATTERNS: ApprovalWorkflowValidationRegexPatternInterface = {
    EscapeRegEx: "\\$\\{[^}]*\\}"
};

/**
 * Approval workflow edit tabs
 */
export enum ApprovalWorkflowEditTabIDs {
    GENERAL = "general",
    OPERATIONS = "workflow operations",
    CONFIGURATIONS = "approval steps",
}

export const ENTITY_TYPES: any = {
    ROLES: "roles",
    USERS: "users"
} as const;

export type EntityType = (typeof ENTITY_TYPES)[keyof typeof ENTITY_TYPES];

/**
 * Flow type
 */
export const FLOW_TYPE: string = "approvalWorkflow";

/**
 * Workflow engine type
 */
export const WORKFLOW_ENGINE: string = "WorkflowEngine";

/**
 * Mapping of operation types to their allowed rule fields.
 * Used to filter available fields in the rule builder per operation type.
 */
export const OPERATION_FIELD_MAPPING: Record<string, string[]> = {
    // Enable initiator.(domain|groups|roles) when the backend supports,
    // providing data for these fields for the respective operations.
    ADD_ROLE: [ "role.audience", "role.permissions" ],
    ADD_USER: [ "user.domain" ],
    DELETE_USER: [ "user.domain", "user.groups", "user.roles" ],
    SELF_REGISTER_USER: [ "user.domain" ],
    UPDATE_ROLES_OF_USERS: [
        "role.id",
        "role.audience",
        "role.hasAssignedUsers",
        "role.hasUnassignedUsers"
        // Enable the following fields when they support the data providing in the backend for this operation.
        // "user.domain",
        // "user.groups",
        // "user.roles"
    ]
};

export default ApprovalWorkflowConstants;
