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
import { AxiosResponse } from "axios";
import type { TreeSyncStatus } from "../models/organization-management";

/**
 * Time between two reads of the sync state while a sync runs.
 */
const POLL_INTERVAL_MS: number = 3000;

/**
 * Hook to get the state of the organization tree sync of the root organization. While a
 * sync runs, it reads the state again every 3 seconds.
 *
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useTreeSync = <Data = TreeSyncStatus, Error = RequestErrorInterface>(
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.cdsOrganizationSyncStatus
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        shouldFetch ? requestConfig : null,
        {
            refreshInterval: (latest: AxiosResponse<Data>): number =>
                (latest?.data as TreeSyncStatus)?.state === "SYNCING" ? POLL_INTERVAL_MS : 0,
            shouldRetryOnError: false
        }
    );

    return {
        data: (data) as Data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useTreeSync;
