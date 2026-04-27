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

import {
    INITIATOR_CLAIMS_FIELD,USER_CLAIMS_FIELD
} from "../utils/workflow-claim-utils";

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
 * Feature flag key for rule-based workflow engagement.
 */
export const FEATURE_FLAG_RULE_BASED_WORKFLOW_ENGAGEMENT: string = "approvalWorkflows.rules";

/**
 * Flow type
 */
export const FLOW_TYPE: string = "approvalWorkflow";

/**
 * Workflow engine type
 */
export const WORKFLOW_ENGINE: string = "WorkflowEngine";

/**
 * Supported approval workflow rule fields.
 */
export const APPROVAL_WORKFLOW_RULE_FIELDS: Record<string, string> = {
    ROLE_AUDIENCE: "role.audience",
    ROLE_HAS_ASSIGNED_USERS: "role.hasAssignedUsers",
    ROLE_HAS_UNASSIGNED_USERS: "role.hasUnassignedUsers",
    ROLE_ID: "role.id",
    ROLE_PERMISSIONS: "role.permissions",
    USER_DOMAIN: "user.domain",
    USER_GROUPS: "user.groups",
    USER_ROLES: "user.roles"
};

/**
 * Mapping of operation types to their allowed rule fields.
 * Used to filter available fields in the rule builder per operation type.
 */
export const OPERATION_FIELD_MAPPING: Record<string, string[]> = {
    // Enable initiator.(domain|groups|roles), when the backend supports
    // providing data for these fields for the respective operations.
    ADD_ROLE: [
        APPROVAL_WORKFLOW_RULE_FIELDS.ROLE_AUDIENCE
    ],
    ADD_USER: [
        APPROVAL_WORKFLOW_RULE_FIELDS.USER_DOMAIN,
        USER_CLAIMS_FIELD,
        INITIATOR_CLAIMS_FIELD
    ],
    DELETE_USER: [
        APPROVAL_WORKFLOW_RULE_FIELDS.USER_DOMAIN,
        APPROVAL_WORKFLOW_RULE_FIELDS.USER_GROUPS,
        APPROVAL_WORKFLOW_RULE_FIELDS.USER_ROLES,
        USER_CLAIMS_FIELD,
        INITIATOR_CLAIMS_FIELD
    ],
    SELF_REGISTER_USER: [
        USER_CLAIMS_FIELD
    ],
    UPDATE_ROLES_OF_USERS: [
        APPROVAL_WORKFLOW_RULE_FIELDS.ROLE_ID,
        APPROVAL_WORKFLOW_RULE_FIELDS.ROLE_AUDIENCE,
        APPROVAL_WORKFLOW_RULE_FIELDS.ROLE_HAS_ASSIGNED_USERS,
        APPROVAL_WORKFLOW_RULE_FIELDS.ROLE_HAS_UNASSIGNED_USERS
        // Enable the following fields when they support the data providing in the backend for this operation.
        // APPROVAL_WORKFLOW_RULE_FIELDS.USER_DOMAIN,
        // APPROVAL_WORKFLOW_RULE_FIELDS.USER_GROUPS,
        // APPROVAL_WORKFLOW_RULE_FIELDS.USER_ROLES,
        // USER_CLAIMS_FIELD,
        // INITIATOR_CLAIMS_FIELD
    ]
};

export default ApprovalWorkflowConstants;
