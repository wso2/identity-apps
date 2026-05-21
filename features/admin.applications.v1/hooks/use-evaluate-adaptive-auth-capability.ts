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

import useRequest, { RequestErrorInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosRequestConfig } from "axios";
import { OrgGovernanceEvaluateResponseInterface } from "../models/endpoints";

/**
 * Return type for the useEvaluateAdaptiveAuthCapability hook.
 */
interface UseEvaluateAdaptiveAuthCapabilityInterface {
    /**
     * Whether adaptive auth is allowed per org governance.
     * `null` when the check has not been performed or has not yet resolved.
     */
    isAdaptiveAuthAllowed: boolean | null;
    isCheckLoading: boolean;
}

/**
 * Hook to evaluate whether adaptive authentication is allowed for applications
 * via the org-governance capability evaluation API.
 *
 * Only performs the API call when `shouldCheck` is true (i.e., when the sub-org
 * feature flag alone does not grant access and a runtime check is needed).
 *
 * @param shouldCheck - Whether to perform the capability check.
 * @returns The evaluation result and loading state.
 */
const useEvaluateAdaptiveAuthCapability = (
    shouldCheck: boolean
): UseEvaluateAdaptiveAuthCapabilityInterface => {

    const requestConfig: AxiosRequestConfig = {
        data: {
            capability: "adaptive-auth",
            resourceType: "application"
        },
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.orgGovernanceEvaluate
    };

    const { data, isLoading } = useRequest<OrgGovernanceEvaluateResponseInterface, RequestErrorInterface>(
        shouldCheck ? requestConfig : null
    );

    return {
        isAdaptiveAuthAllowed: data?.allowed ?? null,
        isCheckLoading: !!isLoading
    };
};

export default useEvaluateAdaptiveAuthCapability;
