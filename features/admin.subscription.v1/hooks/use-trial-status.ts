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

import { RequestErrorInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    useGetCurrentOrganizationType
} from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { useUsersList } from "@wso2is/admin.users.v1/api/users";
import { ProfileConstants } from "@wso2is/core/constants";
import { AxiosError } from "axios";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { TrialDetailsInterface, TrialStatus } from "../models/trial";
import { parseTrialDetails } from "../utils/parse-trial-details";

/**
 * SCIM2 attributes to request for trial details.
 */
const SCIM_ATTRIBUTES: string = [
    "userName",
    `${ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA}.trialDetails`
].join(",");

/**
 * Escapes a value for use in a SCIM filter string per RFC 7644 §3.4.2.2.
 * Backslashes and double quotes are escaped, and the result is wrapped in double quotes.
 *
 * @param value - The raw string value.
 * @returns The escaped and quoted filter value.
 */
const escapeScimFilterValue = (value: string): string => {
    const escaped: string = value.replace(/\\/g, "\\\\").replace(/"/g, "\\\"");

    return `"${escaped}"`;
};

/**
 * Return type for the useTrialStatus hook.
 */
interface UseTrialStatusReturn {
    trialStatus: TrialStatus;
    isTrialExpired: boolean;
    isLoading: boolean;
    isResolved: boolean;
    error: AxiosError<RequestErrorInterface> | undefined;
}

/**
 * Read-only hook that fetches and returns the current user's trial status
 * from SCIM2 trialDetails attribute.
 *
 * @returns Trial status, resolution state, loading state, and any fetch error.
 */
export const useTrialStatus = (): UseTrialStatusReturn => {
    const userName: string = useSelector(
        (state: AppState) => state.profile.profileInfo.userName
    );

    const isTrialFeatureEnabled: boolean = useSelector(
        (state: AppState) =>
            (state.config.deployment.extensions as Record<string, Record<string, unknown>>)
                ?.trial?.enabled === true
    );

    const { isFirstLevelOrganization } = useGetCurrentOrganizationType();
    const isFirstLevelOrg: boolean = isFirstLevelOrganization();

    const shouldFetch: boolean =
        !!userName &&
        isTrialFeatureEnabled &&
        isFirstLevelOrg;

    const {
        data: userListData,
        isLoading: isUserListLoading,
        error
    } = useUsersList(
        1,
        1,
        `userName eq ${escapeScimFilterValue(userName ?? "")}`,
        SCIM_ATTRIBUTES,
        "PRIMARY",
        "groups",
        shouldFetch
    );

    const currentUser: Record<string, unknown> | undefined =
        userListData?.Resources?.[0] as unknown as Record<string, unknown> | undefined;

    const systemSchemaData: Record<string, unknown> | undefined = currentUser
        ?.[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA] as Record<string, unknown> | undefined;

    const { isTrialEnabled, isTrialExpired }: TrialDetailsInterface = useMemo(
        (): TrialDetailsInterface => parseTrialDetails(
            systemSchemaData?.trialDetails as string | undefined
        ),
        [ systemSchemaData ]
    );

    const isLoading: boolean = shouldFetch && isUserListLoading;

    const isResolved: boolean = shouldFetch && !isUserListLoading && !error && !!userListData;

    const trialStatus: TrialStatus = useMemo((): TrialStatus => {
        if (!isResolved) {
            return TrialStatus.UNKNOWN;
        }

        return isTrialEnabled ? TrialStatus.ENABLED : TrialStatus.DISABLED;
    }, [ isResolved, isTrialEnabled ]);

    return {
        error,
        isLoading,
        isResolved,
        isTrialExpired,
        trialStatus
    };
};
