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

import { updateGovernanceConnector } from "@wso2is/admin.server-configurations.v1/api/governance-connectors";
import {
    ServerConfigurationsConstants
} from "@wso2is/admin.server-configurations.v1/constants/server-configurations-constants";
import { MULTI_ATTRIBUTE_CLAIMS } from "../constants/sign-in-options";
import { SignInIdentifiersConfig } from "../models";

/**
 * Update multi-attribute login configuration based on selected identifiers.
 * This is an organization-level setting that enables login with email/mobile in addition to username.
 *
 * @param identifiers - The selected identifier options
 * @param isAlphanumericUsername - Whether alphanumeric username is enabled
 * @returns Promise that resolves when the configuration is updated
 */
export const updateMultiAttributeLoginConfig = async (
    identifiers: SignInIdentifiersConfig,
    isAlphanumericUsername: boolean = true
): Promise<void> => {
    // Build the allowed attributes list
    // Username is always included as the base identifier
    const allowedAttributes: string[] = [ MULTI_ATTRIBUTE_CLAIMS.username ];

    // Only add email if alphanumeric username is enabled
    if (identifiers.email && isAlphanumericUsername) {
        allowedAttributes.push(MULTI_ATTRIBUTE_CLAIMS.email);
    }

    // Mobile can always be added as an alternative identifier
    if (identifiers.mobile) {
        allowedAttributes.push(MULTI_ATTRIBUTE_CLAIMS.mobile);
    }

    // Multi-attribute login should be enabled when:
    // - Email is selected AND alphanumeric username is enabled, OR
    // - Mobile is selected
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
