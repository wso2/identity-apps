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

export interface WorkflowAssociationPayload {
    /**
     * Name of the workflow association.
     */
    associationName: string;

    /**
     * Operation linked to the workflow.
     */
    operation: string;

    /**
     * ID of the workflow engine to use.
     */
    workflowId: string;

}

export interface WorkflowOperations {
    associationId: string;
    operation: string;
}

/**
 * Interface representing a list of workflows along with pagination details.
 */
export interface WorkflowAssociationListResponseInterface {
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
    workflowAssociations?: WorkflowAssociationListItemInterface[];
}

/**
 * Interface for a workflow association item in the list view.
 */
export interface WorkflowAssociationListItemInterface {
    /**
     * Unique identifier for the workflow association.
     */
    id: string;

    /**
     * Name of the workflow association.
     */
    associationName: string;

    /**
     * Operation associated with the workflow.
     */
    operation: string;

    /**
     * Workflow selected for the association.
     */
    workflowName: string;

    /**
     * Whether the association is enabled or not.
     */
    isEnabled: string;
}
