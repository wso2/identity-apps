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

import { ConditionExpressionsMetaDataInterface } from "@wso2is/admin.rules.v1/models/meta";
import useRequest, {
    RequestConfigInterface,
    RequestErrorInterface,
    RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import { DEVICE_POLICY_TYPE } from "../constants/device-policy-constants";

/**
 * Hook to get the fields, operators and values that device policy rules can use for a platform.
 *
 * @param platform - Device platform, for example android.
 * @returns SWR response object containing the data, error, isLoading, isValidating, mutate.
 */
const useGetDevicePolicyRuleMetadata = <Data = ConditionExpressionsMetaDataInterface,
    Error = RequestErrorInterface>(platform: string): RequestResultInterface<Data, Error> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json"
        },
        method: HttpMethods.GET,
        params: {
            target: platform,
            type: DEVICE_POLICY_TYPE
        },
        url: `${ store.getState().config.endpoints.devicePolicies }/metadata/rule`
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<Data, Error>(
        !isEmpty(platform) ? requestConfig : null,
        { shouldRetryOnError: false }
    );

    return {
        data,
        error,
        isLoading,
        isValidating,
        mutate
    };
};

export default useGetDevicePolicyRuleMetadata;
