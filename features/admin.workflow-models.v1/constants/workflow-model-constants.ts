
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

// eslint-disable-next-line header/header
export class WorkflowModelConstants {

    private constructor() {}
    public static getPaths(): Map<string, string> {
        return new Map<string, string>().set(
            "WORKFLOW_MODEL_CREATE",
            `${window["AppUtils"].getConfig().adminApp.basePath}/workflow-model-create`
        );
    }
}

interface WorkflowModelValidationRegexPatternInterface {
    EscapeRegEx: string;
}

/**
 * User store validation regEx patterns
 */
export const WORKFLOW_MODEL_VALIDATION_REGEX_PATTERNS: WorkflowModelValidationRegexPatternInterface = {
    EscapeRegEx: "\\$\\{[^}]*\\}"
};

/**
 * Remote user store edit tab IDs.
 */
export enum WorkflowModelEditTabIDs {
    GENERAL = "general",
    CONFIGURATIONS = "configurations",
}

/**
 * Maps engine keys to human-readable names.
 */
export const engineNameMap: Record<string, string> = {
    "workflowImplSimple": "Simple Workflow Engine"
};

/**
 * Maps template keys to human-readable names.
 */
export const templateNameMap: Record<string, string> = {
    "MultiStepApprovalTemplate": "Multi Step User/Role Approval Template"
};

export const ENTITY_TYPES: any = {
    USERS: "users",
    ROLES: "roles"
} as const;

export type EntityType = (typeof ENTITY_TYPES)[keyof typeof ENTITY_TYPES];

export const RETRY_INTERVAL: number = 2000;
export const RETRY_COUNT_LIMIT: number = 10;


export default WorkflowModelConstants;
