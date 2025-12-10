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
import { VCCredentialConfiguration } from "../models/verifiable-credentials";

/**
 * Hook to get a single VC credential configuration by ID.
 *
 * @param configId - The ID of the configuration to fetch.
 * @param shouldFetch - Whether to fetch the data.
 * @returns RequestResultInterface with the configuration data.
 */
export const useGetVCConfig = (
    configId: string,
    shouldFetch: boolean = true
): RequestResultInterface<VCCredentialConfiguration, RequestErrorInterface> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.vcCredentialConfigurations}/${configId}`
    };

    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    } = useRequest<VCCredentialConfiguration, RequestErrorInterface>(
        shouldFetch && configId ? requestConfig : null
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};
