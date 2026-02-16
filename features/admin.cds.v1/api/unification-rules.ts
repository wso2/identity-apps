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

import {
    CreateUnificationRulePayload,
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
 * Fetcher for GET /unification-rules
 */
export const fetchUnificationRules = async (): Promise<UnificationRulesListResponse> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.unificationRules
    };

    const response: Awaited<ReturnType<typeof httpClient>> = await httpClient(requestConfig);

    return response.data as UnificationRulesListResponse;
};

/**
 * Fetcher for GET /unification-rules/{rule_id}
 */
export const fetchUnificationRuleDetails = async (ruleId: string): Promise<UnificationRuleModel> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.unificationRules}/${ruleId}`
    };

    const response: Awaited<ReturnType<typeof httpClient>> = await httpClient(requestConfig);

    return response.data as UnificationRuleModel;
};

/**
 * POST /unification-rules
 * Create a new unification rule
 */
export const createUnificationRule = async (
    ruleData: CreateUnificationRulePayload
): Promise<UnificationRuleModel> => {
    const requestConfig: RequestConfigInterface = {
        data: ruleData,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.unificationRules
    };

    const response: Awaited<ReturnType<typeof httpClient>> = await httpClient(requestConfig);

    return response.data as UnificationRuleModel;
};

/**
 * PUT /unification-rules/{rule_id}
 * Only rule_name, is_active, and priority can be updated
 */
export const updateUnificationRule = async (
    ruleId: string,
    ruleData: UpdateUnificationRulePayload
): Promise<UnificationRuleModel> => {
    const requestConfig: RequestConfigInterface = {
        data: ruleData,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PUT,
        url: `${store.getState().config.endpoints.unificationRules}/${ruleId}`
    };

    const response: Awaited<ReturnType<typeof httpClient>> = await httpClient(requestConfig);

    return response.data as UnificationRuleModel;
};

/**
 * DELETE /unification-rules/{rule_id}
 */
export const deleteUnificationRule = async (ruleId: string): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.unificationRules}/${ruleId}`
    };

    const response: Awaited<ReturnType<typeof httpClient>> = await httpClient(requestConfig);

    if (response.status !== 204 && response.status !== 200) {
        throw new Error(`Unexpected status code: ${response.status}`);
    }
};
