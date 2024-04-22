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

import { AllFeatureInterface } from "@wso2is/access-control";
import { HttpMethods } from "@wso2is/core/models";
import { useSelector } from "react-redux";
import useRequest, {
    RequestErrorInterface,
    RequestResultInterface
} from "../../../../admin.core.v1/hooks/use-request";
import { AppState, store } from "../../../../admin.core.v1/store";

/**
 * Hook to get the all features of the organization.
 *
 * @param org_id - Organization ID.
 * @param isAuthenticated - Is user authenticated.
 * @returns The response of all features.
 */
export const useGetAllFeatures = <Data = AllFeatureInterface[], Error = RequestErrorInterface>(
    org_id: string,
    isAuthenticated: boolean
): RequestResultInterface<Data, Error> => {

    // TODO: Remove this config once the deployment issues are sorted out.
    const isFeatureGateEnabled: boolean = useSelector((state: AppState) => state?.config?.ui?.isFeatureGateEnabled);
    const shouldSendRequest : string = isAuthenticated && isFeatureGateEnabled && org_id;

    const requestConfig: any = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: shouldSendRequest
            ? `${store?.getState()?.config?.endpoints?.allFeatures?.replace("{org-uuid}", org_id)}`
            : ""
    };

    const { data, error, isValidating, mutate } = useRequest<Data, Error>(requestConfig, {
        shouldRetryOnError: false
    });

    return {
        data,
        error: error,
        isLoading: !data && !error,
        isValidating,
        mutate
    };
};
