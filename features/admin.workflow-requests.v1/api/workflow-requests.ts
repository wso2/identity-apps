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
import { WorkflowInstanceListResponseInterface, WorkflowInstanceResponseInterface } from "../models/workflowRequests";

/**
 * Get an axios instance.
 */
const httpClient = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

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
