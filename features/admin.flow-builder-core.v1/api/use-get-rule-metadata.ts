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
import { FlowTypes } from "@wso2is/admin.flows.v1/models/flows";
import { HttpMethods } from "@wso2is/core/models";
import { RuleMetadataInterface } from "../models/metadata";

/**
 * Hook to get the fields and limits for the conditions of decision steps in a specific flow type.
 *
 * @param flowType - The type of the flow to get the rule metadata for.
 * @param shouldFetch - Should fetch the data.
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetRuleMetadata = <Data = RuleMetadataInterface, Error = RequestErrorInterface>(
    flowType: FlowTypes,
    shouldFetch: boolean = true
): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.flowRuleMeta}?flowType=${flowType}`
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

export default useGetRuleMetadata;
