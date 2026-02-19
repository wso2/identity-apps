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
import { AxiosError, AxiosResponse } from "axios";
import {
    CreateUnificationRulePayload,
    UnificationRuleModel,
    UpdateUnificationRulePayload
} from "../models/unification-rules";

/**
 * Initialize an Http client.
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * POST /unification-rules
 * Create a new unification rule.
 */
export const createUnificationRule = (
    ruleData: CreateUnificationRulePayload
): Promise<UnificationRuleModel> => {
    const requestConfig: RequestConfigInterface = {
        data: ruleData,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.POST,
        url: store.getState().config.endpoints.cdsUnificationRules
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 201) {
                return Promise.reject(new Error("Failed to create unification rule."));
            }

            return Promise.resolve(response.data as UnificationRuleModel);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * PATCH /unification-rules/`{rule_id}`
 * Partially update a unification rule.
 */
export const updateUnificationRule = (
    ruleId: string,
    ruleData: UpdateUnificationRulePayload
): Promise<UnificationRuleModel> => {
    const requestConfig: RequestConfigInterface = {
        data: ruleData,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: `${store.getState().config.endpoints.cdsUnificationRules}/${ruleId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 200) {
                return Promise.reject(new Error("Failed to update unification rule."));
            }

            return Promise.resolve(response.data as UnificationRuleModel);
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};

/**
 * DELETE /unification-rules/`{rule_id}`
 * Delete a unification rule by ID.
 */
export const deleteUnificationRule = (ruleId: string): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.cdsUnificationRules}/${ruleId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            if (response.status !== 204) {
                return Promise.reject(new Error("Failed to delete unification rule."));
            }

            return Promise.resolve();
        })
        .catch((error: AxiosError) => {
            return Promise.reject(error);
        });
};
