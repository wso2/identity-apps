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

import { updateProfileInfo } from "@wso2is/admin.users.v1/api/profile";
import { ProfileConstants } from "@wso2is/core/constants";
import { ProfileInfoInterface } from "@wso2is/core/models";

/**
 * Updates the `showOnboardingWizard` claim to `false` for the current user via PATCH /scim2/Me.
 *
 * @returns Promise resolving to the updated profile info.
 */
export const dismissOnboardingWizardClaim = (): Promise<ProfileInfoInterface> => {
    const data: Record<string, unknown> = {
        Operations: [
            {
                op: "replace",
                value: {
                    [ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]: {
                        showOnboardingWizard: false
                    }
                }
            }
        ],
        schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
    };

    return updateProfileInfo(data);
};
