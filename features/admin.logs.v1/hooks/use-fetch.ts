/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com).
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

import { useLogs } from "../api/useLogs";
import { InterfaceLogEntry, InterfaceLogsRequest } from "../models/log-models";

/**
 * Custom hook for fetching logs
 * @param requestPayload - logs search API endpoint POST request payload
 * @returns error, list, loading, next, previous
 */
function useFetch(requestPayload: InterfaceLogsRequest): any {
    const { data, error, isValidating } = useLogs(requestPayload);
    const list: InterfaceLogEntry[] = data?.logs || [];
    const next: string | null = data?.nextToken || null;
    const previous: string | null = data?.previousToken || null;

    return { error, list, loading: isValidating, next, previous };
}

export default useFetch;
