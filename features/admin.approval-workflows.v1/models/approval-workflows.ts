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

/**
 * Interface representing a list of workflows along with pagination details.
 */
export interface WorkflowListResponseInterface {
    /**
     * Total number of workflows available.
     */
    totalResults?: number;

    /**
     * The starting index of the workflows returned in this list.
     */
    startIndex?: number;

    /**
     * Number of workflows included in this list.
     */
    count?: number;

    /**
     * Array of workflow items.
     */
    workflows?: WorkflowListItemInterface[];
}

/**
 * Interface for a workflow item in the list view.
 */
export interface WorkflowListItemInterface {
    /**
     * Unique identifier for the workflow.
     */
    id: string;

    /**
     * Name of the workflow.
     */
    name: string;

    /**
     * Description of the workflow.
     */
    description?: string;

    /**
     * Engine used to run the workflow.
     */
    engine: string;

    /**
     * Template name associated with the workflow.
     */
    template: string;
}

/**
 * Details of an approval workflow.
 */
export interface WorkflowDetails {
    /**
     * Unique identifier for the workflow.
     */
    id: string;

    /**
     * Name of the workflow.
     */
    name: string;

    /**
     * Description of the workflow.
     */
    description?: string;

    /**
     * Workflow engine used.
     */
    engine: string;

    /**
     * Template structure for the workflow.
     */
    template: WorkflowTemplate;
}

/**
 * Response structure for a workflow template.
 */
export interface WorkflowTemplateResponse {
    /**
     * Unique template ID.
     */
    id: string;

    /**
     * Name of the template.
     */
    name: string;

    /**
     * Steps defined in the template.
     */
    steps: WorkflowTemplateParameters[];
}

/**
 * Payload to create or update an approval workflow.
 */
export interface ApprovalWorkflowPayload {
    /**
     * Name of the approval workflow.
     */
    name: string;

    /**
     * Description of the model.
     */
    description?: string;

    /**
     * Engine to be used for workflow execution.
     */
    engine: string;

    /**
     * Workflow template used in the model.
     */
    template: WorkflowTemplate;
}

/**
 * A workflow template with multiple approval steps.
 */
export interface WorkflowTemplate {
    /**
     * Name of the template.
     */
    name: string;

    /**
     * List of step parameters.
     */
    steps: WorkflowTemplateParameters[];
}

/**
 * Parameters for a single step in a workflow template.
 */
export interface WorkflowTemplateParameters {
    /**
     * Step number in the sequence.
     */
    step: number;

    /**
     * Available options for the step.
     */
    options: OptionDetails[];
}

/**
 * Entity option details in a workflow step.
 */
export interface OptionDetails {
    /**
     * Entity type (e.g., users, roles).
     */
    entity: string;

    /**
     * List of allowed values for the entity.
     */
    values: string[];
}

/**
 * Multi-step approval template structure.
 */
export type MultiStepApprovalTemplate = {
    /**
     * Step identifier.
     */
    id: string;

    /**
     * Number of the step.
     */
    stepNumber: number;

    /**
     * Roles assigned to the step.
     */
    roles: string[];

    /**
     * Users assigned to the step.
     */
    users: string[];
};


