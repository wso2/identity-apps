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

import { ClaimManagementConstants } from "@wso2is/admin.claims.v1/constants/claim-management-constants";
import { updateGovernanceConnector } from "@wso2is/admin.server-configurations.v1/api/governance-connectors";
import {
    ServerConfigurationsConstants
} from "@wso2is/admin.server-configurations.v1/constants/server-configurations-constants";
import { SignInIdentifiersConfigInterface } from "../models";

/**
 * Enables multi-attribute login (email/mobile) at the organization level
 * based on the identifiers the user selected in the onboarding wizard.
 *
 * @param identifiers - The selected identifier options.
 * @param isAlphanumericUsername - Whether alphanumeric username is enabled.
 * @returns Promise that resolves when the configuration is updated.
 */
export const updateMultiAttributeLoginConfig = async (
    identifiers: SignInIdentifiersConfigInterface,
    isAlphanumericUsername: boolean = true
): Promise<void> => {
    const allowedAttributes: string[] = [ ClaimManagementConstants.USER_NAME_CLAIM_URI ];

    // Email as login identifier requires alphanumeric username to be enabled.
    if (identifiers.email && isAlphanumericUsername) {
        allowedAttributes.push(ClaimManagementConstants.EMAIL_CLAIM_URI);
    }

    if (identifiers.mobile) {
        allowedAttributes.push(ClaimManagementConstants.MOBILE_CLAIM_URI);
    }

    const isEnabled: boolean = (identifiers.email && isAlphanumericUsername) || identifiers.mobile;

    await updateGovernanceConnector(
        {
            operation: "UPDATE",
            properties: [
                {
                    name: "account.multiattributelogin.handler.enable",
                    value: String(isEnabled)
                },
                {
                    name: "account.multiattributelogin.handler.allowedattributes",
                    value: allowedAttributes.join(",")
                }
            ]
        },
        ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID,
        ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID
    );
};
