/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
import { FlowExtensionContextTreeResponseInterface } from "../components/flow-context-tree";

/**
 * Hook to retrieve the controlled Flow Extension context tree for a given flow type.
 *
 * Calls `GET /api/server/v1/flow/extension/meta[?flowType=...]`. When `flowType` is omitted
 * (e.g. the connection-level access-config editor that isn't scoped to a specific flow), the
 * server returns the default tree. The tree is already filtered server-side by the deployment
 * whitelist.
 *
 * @param flowType - Optional flow type. Pass undefined or null for the default tree.
 * @param shouldFetch - Whether the request should be sent.
 * @returns The context tree as an SWR response.
 */
const useFlowExtensionContextTree = <
    Data = FlowExtensionContextTreeResponseInterface,
    Error = RequestErrorInterface>(
        flowType?: string | null,
        shouldFetch: boolean = true
    ): RequestResultInterface<Data, Error> => {
    // Empty strings are treated as "no flow type".
    const trimmedFlowType: string | null = flowType && flowType.trim() !== ""
        ? flowType.trim()
        : null;

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: trimmedFlowType ? { flowType: trimmedFlowType } : undefined,
        url: store.getState().config.endpoints.flowExtensionContextTree
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        shouldFetch ? requestConfig : null,
        { shouldRetryOnError: false }
    );

    return { data, error, isLoading, isValidating, mutate };
};

export default useFlowExtensionContextTree;
