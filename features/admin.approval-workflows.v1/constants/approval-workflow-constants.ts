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

export default ApprovalWorkflowConstants;
