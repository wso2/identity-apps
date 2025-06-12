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

import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { WorkflowAssociationListResponseInterface } from "../models/workflow-associations";

/**
 * Fetches all workflow associations.
 * @param limit - Maximum number of workflow associations to fetch.
 * @param offset - Number of items to skip for pagination.
 * @param filter - Filter to be applied to the workflow association.
 * @param shouldFetch - If true, will fetch the data.
 * @returns workflow associations
 */
export const useGetWorkflowAssociations = <
    Data = WorkflowAssociationListResponseInterface,
    Error = RequestErrorInterface
>(
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
            filter,
            limit,
            offset
        },
        url: store.getState()?.config?.endpoints?.workflowAssociations
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
