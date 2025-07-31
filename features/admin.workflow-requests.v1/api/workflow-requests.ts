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

import { AsgardeoSPAClient } from "@asgardeo/auth-react";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { store } from "../../admin.core.v1/store";
import { WorkflowInstanceResponseInterface, WorkflowInstanceListItemInterface, WorkflowInstanceListResponseInterface } from "../models";

/**
 * Get an axios instance.
 */
const httpClient = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches workflow instances with pagination and filtering.
 *
 * @param {number} limit - Number of results to return.
 * @param {number} offset - Starting index of the results.
 * @param {string} filter - Filter query string.
 * @return {Promise<WorkflowInstancesResponseInterface>} A promise containing the workflow instances response.
 */
export const fetchWorkflowInstances = (
    limit: number,
    offset: number,
    filter?: string
): Promise<WorkflowInstanceListResponseInterface> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            limit,
            offset,
            ...(filter && { filter })
        },
        url: store.getState().config.endpoints.workflowInstances
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<WorkflowInstanceListResponseInterface>) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(`Failed to retrieve workflow instances - ${error}`);
        });
};

/**
 * Fetches a single workflow instance by ID.
 *
 * @param {string} workflowInstanceId - ID of the workflow instance.
 * @return {Promise<WorkflowInstanceResponseInterface>} A promise containing the workflow instance.
 */
export const fetchWorkflowInstance = (
    workflowInstanceId: string
): Promise<WorkflowInstanceResponseInterface> => {
    const requestConfig = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.workflowInstances}/${workflowInstanceId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse<WorkflowInstanceResponseInterface>) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(`Failed to retrieve workflow instance - ${error}`);
        });
};

/**
 * Deletes a workflow instance by ID.
 *
 * @param {string} workflowInstanceId - ID of the workflow instance to delete.
 * @return {Promise<void>} A promise that resolves if the deletion is successful.
 */
export const deleteWorkflowInstance = (workflowInstanceId: string): Promise<void> => {
    const requestConfig = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.workflowInstances}/${workflowInstanceId}`
    };

    return httpClient(requestConfig)
        .then(() => {
            return Promise.resolve();
        })
        .catch((error: AxiosError) => {
            return Promise.reject(`Failed to delete workflow instance - ${error}`);
        });
};
