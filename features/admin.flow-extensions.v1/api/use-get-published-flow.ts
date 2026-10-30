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
import { PublishedFlowInterface } from "../models/published-flow";

/**
 * Hook to retrieve the published flow of a given type.
 *
 * Calls `GET /api/server/v1/flow?flowType=...`. Used to offer the organization attributes a flow
 * already collects as context tree entries, so they do not have to be typed again here.
 *
 * Failure is not fatal to the caller: the Organization branch still renders its core fields and
 * the manual add path when no flow is published or the request is rejected.
 *
 * @param flowType - Type of the flow to retrieve.
 * @param shouldFetch - Whether the request should be sent.
 * @returns The published flow as an SWR response.
 */
const useGetPublishedFlow = <
    Data = PublishedFlowInterface,
    Error = RequestErrorInterface>(
        flowType: string,
        shouldFetch: boolean = true
    ): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: { flowType },
        url: store.getState().config.endpoints.flow
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        shouldFetch && !!flowType ? requestConfig : null,
        { shouldRetryOnError: false }
    );

    return { data, error, isLoading, isValidating, mutate };
};

export default useGetPublishedFlow;
