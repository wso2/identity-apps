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
import { ReviewTaskListResponse } from "../models/review-tasks";

/**
 * Fetches the review tasks awaiting a decision in this organization.
 *
 * The endpoint returns pending tasks only — a resolved task has already had its effect, so
 * there is nothing left to decide — which is why there is no status to pass. It also takes no
 * offset and no sort order, only a page size, so the caller asks for the whole queue at once
 * and orders and pages it itself.
 *
 * @param shouldFetch - Whether to fetch, so a caller can hold off until the service is known
 * to be enabled.
 * @param pageSize - How many tasks to ask for. The server caps this at 200.
 * @returns SWR response carrying the tasks, error, loading state and a mutator.
 */
const useReviewTasks = <Data = ReviewTaskListResponse, Error = RequestErrorInterface>(
    shouldFetch: boolean = true,
    pageSize?: number
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: pageSize ? { page_size: pageSize } : undefined,
        url: store.getState().config.endpoints.cdsReviewTasks
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        shouldFetch ? requestConfig : null,
        { shouldRetryOnError: false }
    );

    return { data, error, isLoading, isValidating, mutate };
};

export default useReviewTasks;
