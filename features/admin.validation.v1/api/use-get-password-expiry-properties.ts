/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { store } from "@wso2is/admin.core.v1";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { GovernanceConnectorInterface } from "@wso2is/admin.server-configurations.v1";
import { HttpMethods } from "@wso2is/core/models";

/**
 * Custom hook to get the password expiry properties.
 *
 * @param Data - The type of the data returned by the request. Defaults to GovernanceConnectorInterface.
 * @param Error - The type of the error returned by the request. Defaults to RequestErrorInterface.
 * @returns The result of the request, including data, error, loading state, and mutate function.
 *
 * @example
 * `const { data, error, isLoading, isValidating, mutate } = useGetPasswordExpiryProperties();`
 */
const useGetPasswordExpiryProperties = <
    Data = GovernanceConnectorInterface,
    Error = RequestErrorInterface
>(): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState()?.config?.endpoints?.passwordExpiry
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(
        requestConfig
    );

    return {
        data,
        error,
        isLoading: !data && !error,
        isValidating,
        mutate
    };
};

export default useGetPasswordExpiryProperties;
