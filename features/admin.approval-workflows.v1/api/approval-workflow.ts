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
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { ApprovalWorkflowPayload, WorkflowListResponseInterface } from "../models/approval-workflows";

/**
 * Get an axios instance.
 */
const httpClient: any = AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches all approval workflows.
 * @param limit - Maximum number of approval workflows to fetch.
 * @param offset - Number of items to skip for pagination.
 * @param filter - Filter to be applied to the approval workflow.
 * @param shouldFetch - If true, will fetch the data.
 * @returns approval workflows
 */
export const useGetApprovalWorkflows = <Data = WorkflowListResponseInterface, Error = RequestErrorInterface>(
    limit: number,
    offset: number,
    filter?: string,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            limit,
            offset,
            filter
        },
        url: store.getState()?.config?.endpoints?.workflows
    };

    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
        response
    } = useRequest<Data, Error>(shouldFetch ? requestConfig : null);

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
        response
    };
};

/**
 * Delete a selected approval workflow with a given approval workflow ID.
 *
 * @param id - Id of the approval workflow which needs to be deleted.
 * @returns A promise containing the status of the delete.
 */
export const deleteApprovalWorkflowById = (id: string): Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: store.getState()?.config?.endpoints?.workflows + "/" + id
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * Create an approval workflow.
 *
 * @param data - The data used to create the approval workflow.
 *
 * @returns A promise that resolves to the newly created approval workflow.
 */
export const addApprovalWorkflow = (data: ApprovalWorkflowPayload) => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState()?.config?.endpoints?.workflows
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Updates an approval workflow.
 *
 * @param id - Approval Workflow ID.
 * @param data - Update Data.
 *
 * @returns updated approval workflow.
 */
export const updateApprovalWorkflow = (id: string, data: ApprovalWorkflowPayload) => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${store.getState()?.config?.endpoints?.workflows}/${id}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(`An error occurred. The server returned ${response.status}`);
            }

            return Promise.resolve(response.data);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};
