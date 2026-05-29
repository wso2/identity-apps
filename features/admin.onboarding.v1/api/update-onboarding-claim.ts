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
import { PatchRoleDataInterface } from "@wso2is/admin.roles.v2/models/roles";
import { updateUserInfo } from "@wso2is/admin.users.v1/api/users";
import { UserAccountTypes } from "@wso2is/admin.users.v1/constants/user-management-constants";
import { ProfileConstants } from "@wso2is/core/constants";
import { HttpMethods } from "@wso2is/core/models";

const httpClient: HttpClientInstance = AsgardeoSPAClient.getInstance()
    .httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * Claim URI for user preferences used by the guest API.
 */
const USER_PREFERENCES_CLAIM_URI: string = "http://wso2.org/claims/userPreferences";

/**
 * Dismisses the onboarding wizard for the current user by setting the
 * onboarding.show preference to false.
 *
 * - Owners and collaborators: PATCH /api/asgardeo-guest/v1/users/me/claims
 * - All other user types (e.g. privileged users): PATCH /scim2/Users/userId
 *
 * @param userAccountType - The SCIM userAccountType of the current user.
 * @param userId - The SCIM2 user ID (UUID). Required for non-guest endpoint updates.
 * @returns Promise resolving when the claim is updated.
 */
export const dismissOnboardingWizardClaim = async (
    userAccountType: string | null,
    userId?: string
): Promise<void> => {
    if (
        userAccountType === UserAccountTypes.OWNER ||
        userAccountType === UserAccountTypes.COLLABORATOR
    ) {
        await dismissViaGuestEndpoint();

        return;
    }

    if (!userId) {
        throw new Error("User ID is required for SCIM endpoint update.");
    }

    await dismissViaScimEndpoint(userId);
};

/**
 * Dismisses the wizard claim via SCIM2 PATCH /scim2/Users/userId.
 * Used for privileged users and other non-owner/collaborator types.
 *
 * @param userId - The SCIM2 user ID (UUID).
 */
const dismissViaScimEndpoint = async (userId: string): Promise<void> => {
    const data: PatchRoleDataInterface = {
        Operations: [
            {
                op: "replace",
                value: {
                    [ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]: {
                        userPreferences: "{'onboarding.show': false}"
                    }
                }
            }
        ],
        schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
    };

    await updateUserInfo(userId, data);
};

/**
 * Dismisses the wizard claim for owners and collaborators via
 * PATCH /api/asgardeo-guest/v1/users/me/claims.
 */
const dismissViaGuestEndpoint = async (): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        data: {
            claims: [
                {
                    uri: USER_PREFERENCES_CLAIM_URI,
                    value: "{'onboarding.show': false}"
                }
            ]
        },
        headers: {
            "Content-Type": "application/json"
        },
        method: HttpMethods.PATCH,
        url: store.getState().config.endpoints.guestUserMeClaimsEndpoint
    };

    await httpClient(requestConfig);
};
