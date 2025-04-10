/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

export interface WorkflowEngineTypeDropdownOption {
    key: string;
    text: string;
    value: string;
}

/**
 * Interface for the workflow list items.
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
     * Engine of workflow deployment.
     */
    engine: string;
    /**
     * Template of the workflow.
     */
    template: string;
}

export interface WorkflowDetails {
    id: string;
    name: string;
    description?: string;
    engine: string;
    template: WorkflowTemplate;
    approvalTask?: string;
    approvalTaskDescription?: string;
}

export interface WorkflowTemplateResponse {
    id: string;
    name: string;
    steps: WorkflowTemplateParameters[];
}

export interface WorkflowModelPayload {
    name: string;
    description?: string;
    engine: string;
    template: WorkflowTemplate;
    approvalTask: string;
}

export interface WorkflowTemplate {
    name: string;
    steps: WorkflowTemplateParameters[];
}

export interface WorkflowTemplateParameters {
    step: number;
    options: OptionDetails[];
}

export interface OptionDetails {
    entity: string;
    values: string[];
}
