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
 * Dropdown option type for operation type selection.
 */
export interface DropdownPropsInterface {
    /**
     * Unique key for the option.
     */
    key: string;

    /**
     * Display text for the option.
     */
    text: string;

    /**
     * Actual value of the option.
     */
    value: string;
}

/**
 * Form values interface for general workflow details.
 */
export interface GeneralDetailsFormValuesInterface {
    /**
     * Name of the workflow.
     */
    name: string;

    /**
     * Description of the workflow.
     */
    description: string;

    /**
     * Engine used for the workflow.
     */
    engine?: string;
}



/**
 * Form values interface for workflow operations details.
 */
export interface WorkflowOperationsDetailsFormValuesInterface {
    /**
     * Name of the workflow.
     */
    matchedOperations: DropdownPropsInterface[];
}

/**
 * Form values interface for workflow configurations.
 */
export interface ConfigurationsFormValuesInterface {
    /**
     * List of approval steps in the workflow.
     */
    approvalSteps: ApprovalSteps[];
}

/**
 * Interface for approval step configurations.
 */
export interface ApprovalSteps {
    /**
     * Roles assigned to the approval step.
     */
    roles: string[];

    /**
     * Users assigned to the approval step.
     */
    users: string[];
}

/**
 * Interface for the complete form data for the approval workflow.
 */
export interface ApprovalWorkflowFormDataInterface {
    /**
     * General details of the workflow.
     */
    generalDetails: Partial<GeneralDetailsFormValuesInterface>;

     /**
     * Workflow operations details.
     */
    workflowOperationsDetails: Partial<WorkflowOperationsDetailsFormValuesInterface>;

    /**
     * Configurations of the workflow, including approval steps.
     */
    configurations: Partial<ConfigurationsFormValuesInterface>;
}
