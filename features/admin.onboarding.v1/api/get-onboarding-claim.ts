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
import { ProfileConstants } from "@wso2is/core/constants";
import { HttpMethods } from "@wso2is/core/models";
import { AxiosError, AxiosResponse } from "axios";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * SCIM2 claim attribute name for onboarding wizard visibility.
 */
const SHOW_ONBOARDING_WIZARD_ATTRIBUTE: string = "showOnboardingWizard";

/**
 * Reads the `showOnboardingWizard` claim for the given user.
 *
 * @param userId - The SCIM2 user ID (UUID).
 * @returns True if the wizard should be shown, false otherwise.
 */
export const getOnboardingWizardClaim = (userId: string): Promise<boolean> => {
    const systemSchema: string = ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA;
    const attributes: string = `${systemSchema}.${SHOW_ONBOARDING_WIZARD_ATTRIBUTE}`;

    const requestConfig: RequestConfigInterface = {
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        params: {
            attributes
        },
        url: `${store.getState().config.endpoints.users}/${userId}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            const systemSchemaData: Record<string, unknown> =
                response?.data?.[systemSchema] as Record<string, unknown>;

            return systemSchemaData?.[SHOW_ONBOARDING_WIZARD_ATTRIBUTE] !== false;
        })
        .catch((error: AxiosError) => {
            // Graceful failure: default to not showing the wizard
            // eslint-disable-next-line no-console
            console.warn("Failed to read onboarding wizard claim:", error);

            return false;
        });
};
