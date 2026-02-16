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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import useSWR, { SWRResponse } from "swr";
import useSWRMutation, { SWRMutationResponse } from "swr/mutation";

import {
    UnificationRuleModel,
    UnificationRulesListResponse,
    UpdateUnificationRulePayload
} from "../models/unification-rules";

/**
 * Initialize an auth-aware Http client.
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Hook to fetch all unification rules with SWR caching
 */
export const useUnificationRules = (
    shouldFetch: boolean = true
): SWRResponse<UnificationRulesListResponse, any> => {
    const fetcher = async (): Promise<UnificationRulesListResponse> => {
        const requestConfig: RequestConfigInterface = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            url: store.getState().config.endpoints.unificationRules
        };

        const response = await httpClient(requestConfig);
        return response.data as UnificationRulesListResponse;
    };

    const key = shouldFetch ? store.getState().config.endpoints.unificationRules : null;

    return useSWR<UnificationRulesListResponse, any>(key, fetcher);
};

/**
 * Hook to fetch a single unification rule by ID
 */
export const useUnificationRuleDetails = (
    ruleId: string,
    shouldFetch: boolean = true
): SWRResponse<UnificationRuleModel, any> => {
    const fetcher = async (): Promise<UnificationRuleModel> => {
        const requestConfig: RequestConfigInterface = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            url: `${store.getState().config.endpoints.unificationRules}/${ruleId}`
        };

        const response = await httpClient(requestConfig);
        return response.data as UnificationRuleModel;
    };

    const key = shouldFetch && ruleId
        ? `${store.getState().config.endpoints.unificationRules}/${ruleId}`
        : null;

    return useSWR<UnificationRuleModel, any>(key, fetcher);
};

/**
 * Hook to update an existing unification rule
 * Only rule_name, is_active, and priority can be updated
 */
export const useUpdateUnificationRule = (
    ruleId: string
): SWRMutationResponse<UnificationRuleModel, any, string, UpdateUnificationRulePayload> => {
    const updateRule = async (
        _key: string,
        { arg }: { arg: UpdateUnificationRulePayload }
    ): Promise<UnificationRuleModel> => {
        const requestConfig: RequestConfigInterface = {
            data: arg,
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.PUT,
            url: `${store.getState().config.endpoints.unificationRules}/${ruleId}`
        };

        const response = await httpClient(requestConfig);
        return response.data as UnificationRuleModel;
    };

    return useSWRMutation(
        `${store.getState().config.endpoints.unificationRules}/${ruleId}`,
        updateRule
    );
};

/**
 * Hook to delete a unification rule
 */
export const useDeleteUnificationRule = (): SWRMutationResponse<void, any, string, string> => {
    const deleteRule = async (_key: string, { arg }: { arg: string }): Promise<void> => {
        const requestConfig: RequestConfigInterface = {
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.DELETE,
            url: `${store.getState().config.endpoints.unificationRules}/${arg}`
        };

        const response = await httpClient(requestConfig);

        if (response.status !== 204 && response.status !== 200) {
            throw new Error(`Unexpected status code: ${response.status}`);
        }
    };

    return useSWRMutation(store.getState().config.endpoints.unificationRules, deleteRule);
};
