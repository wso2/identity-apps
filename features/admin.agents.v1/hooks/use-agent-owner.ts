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

import { AppState } from "@wso2is/admin.core.v1/store";
import { ProfileInfoInterface } from "@wso2is/core/models";
import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * Resolves the identifier of the authenticated user to be sent as the owner of an agent.
 *
 * `auth.username` holds the `sub` claim of the ID token, which stays bound to the resident
 * organization of the user even after an organization switch. Root and sub organization user
 * IDs are separate namespaces, so that ID cannot be resolved from within a sub organization.
 * `profile.profileInfo.id` is populated during sign in from the organization aware `/scim2/Me`
 * endpoint, hence it always carries the ID of the user within the currently switched
 * organization. Both are the same in the root organization.
 *
 * @returns The tenant qualified agent owner. Ex: `<user-id>@<tenant-domain>`.
 */
const useAgentOwner = (): string => {
    const username: string = useSelector((state: AppState): string => state?.auth?.username);
    const profileInfo: ProfileInfoInterface = useSelector(
        (state: AppState): ProfileInfoInterface => state?.profile?.profileInfo);

    return useMemo((): string => {
        if (!profileInfo?.id) {
            return username;
        }

        const separatorIndex: number = username?.lastIndexOf("@") ?? -1;
        const tenantQualifier: string = separatorIndex > -1 ? username.substring(separatorIndex + 1) : "";

        return tenantQualifier ? `${ profileInfo.id }@${ tenantQualifier }` : profileInfo.id;
    }, [ username, profileInfo ]);
};

export default useAgentOwner;
