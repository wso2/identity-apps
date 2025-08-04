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
import AskPasswordFlowConstants from "../constants/ask-password-flow-constants";

/**
 * Hook to get the configured password recovery flow.
 *
 * This function calls the GET method of the following endpoint to get the password recovery flow of the organization.
 * - `https://{serverUrl}/t/{tenantDomain}/api/server/v1/ask-password-flow`
 * For more details, refer to the documentation:
 * {@link https://TODO:<fillthis>)}
 *
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetAskPasswordFlow = <Data = any, Error = RequestErrorInterface>(
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        // eslint-disable-next-line max-len
        url: `${store.getState().config.endpoints.askPasswordFlow}?flowType=${AskPasswordFlowConstants.ASK_PASSWORD_FLOW_TYPE}`
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        shouldFetch ? requestConfig : null
    );

    return {
        data: data as Data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetAskPasswordFlow;
