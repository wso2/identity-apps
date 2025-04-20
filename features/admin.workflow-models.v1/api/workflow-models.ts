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
import useRequest, { RequestConfigInterface, RequestErrorInterface,
    RequestResultInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";
import { WorkflowListItemInterface, WorkflowModelPayload } from "../models/workflow-models";

/**
 * Get an axios instance.
 */
const httpClient: any = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Fetches all workflow models.
 * @param limit - Maximum number of workflow models to fetch.
 * @param offset - Number of items to skip for pagination.
 * @param filter - Filter to be applied to the workflow model.
 * @param shouldFetch - If true, will fetch the data.
 * @returns workflow models
 */
export const useGetWorkflows = < Data = WorkflowListItemInterface[], Error = RequestErrorInterface>(
    limit: number,
    offset: number,
    filter?: string,
    shouldFetch: boolean = true
) : RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
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
        isValidating,
        mutate,
        response
    } = useRequest<Data, Error>( shouldFetch ? requestConfig : null);

    return {
        data,
        error,
        isLoading: !error && !data,
        isValidating,
        mutate,
        response
    };
};

/**
 * Delete a selected workflow model with a given workflow model ID.
 *
 * @param id - Id of the workflow model which needs to be deleted.
 * @returns A promise containing the status of the delete.
 */
export const deleteWorkflowById = (id: string) : Promise<any> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
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
 * Create a Workflow Model.
 *
 * @param data - The data used to create the workflow model.
 *
 * @returns A promise that resolves to the newly created workflow model.
 */
export const addWorkflowModel = (data: WorkflowModelPayload) => {
    const requestConfig: RequestConfigInterface = {
        data,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState()?.config?.endpoints?.workflows
    };

    return httpClient(requestConfig).then((response: AxiosResponse) => {
        return Promise.resolve(response.data);
    })
        .catch((error: AxiosError) => {
            return Promise.reject(error?.response?.data);
        });
};

/**
 * Updates a Workflow Model.
 *
 * @param id - Workflow Model ID.
 * @param data - Update Data.
 *
 * @returns updated workflow model.
 */
export const updateWorkflowModel = (id: string, data: WorkflowModelPayload) => {
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
