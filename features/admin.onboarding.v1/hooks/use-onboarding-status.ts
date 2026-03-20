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

import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    useGetCurrentOrganizationType
} from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { useUsersList } from "@wso2is/admin.users.v1/api/users";
import { ProfileConstants } from "@wso2is/core/constants";
import { FeatureAccessConfigInterface } from "@wso2is/core/models";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { dismissOnboardingWizardClaim } from "../api/update-onboarding-claim";
import { parseOnboardingShowFromPreferences } from "../utils/parse-onboarding-preferences";

/**
 * SCIM2 attributes to request from the Users list endpoint.
 */
const SCIM_ATTRIBUTES: string = [
    `${ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA}.userAccountType`,
    `${ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA}.userPreferences`
].join(",");

/**
 * Return type for the useOnboardingStatus hook.
 */
interface UseOnboardingStatusReturn {
    isLoading: boolean;
    markOnboardingComplete: () => Promise<void>;
    shouldShowOnboarding: boolean;
}

/**
 * Determines whether the onboarding wizard should be shown to the current user.
 *
 */
export const useOnboardingStatus = (): UseOnboardingStatusReturn => {
    const [ isDismissed, setIsDismissed ] = useState<boolean>(false);

    const userName: string = useSelector(
        (state: AppState) => state.profile.profileInfo.userName
    );
    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features
    );
    const onboardingFeatureConfig: FeatureAccessConfigInterface = featureConfig?.onboarding;

    const { isFirstLevelOrganization } = useGetCurrentOrganizationType();
    const isFirstLevelOrg: boolean = isFirstLevelOrganization();

    const shouldFetch: boolean =
        !!userName &&
        !!onboardingFeatureConfig?.enabled &&
        isFirstLevelOrg;

    const {
        data: userListData,
        isLoading: isUserListLoading
    } = useUsersList(
        1,
        1,
        `userName eq ${userName}`,
        SCIM_ATTRIBUTES,
        "PRIMARY",
        "groups",
        shouldFetch
    );

    const currentUser: Record<string, unknown> | undefined =
        userListData?.Resources?.[0] as unknown as Record<string, unknown> | undefined;

    const systemSchemaData: Record<string, unknown> | undefined = currentUser
        ?.[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA] as Record<string, unknown> | undefined;

    const scimUserId: string = (currentUser?.id as string) ?? "";

    const userAccountType: string | null =
        (systemSchemaData?.userAccountType as string) ?? null;

    const shouldShowOnboarding: boolean = useMemo((): boolean => {
        if (isDismissed || !shouldFetch || !currentUser) {
            return false;
        }

        return parseOnboardingShowFromPreferences(
            systemSchemaData?.userPreferences as string | undefined
        );
    }, [ isDismissed, shouldFetch, currentUser, systemSchemaData ]);

    const isLoading: boolean = !featureConfig || (shouldFetch && isUserListLoading);

    const markOnboardingComplete: () => Promise<void> = useCallback(
        async (): Promise<void> => {
            try {
                await dismissOnboardingWizardClaim(
                    userAccountType,
                    scimUserId || undefined
                );
            } catch (_error: unknown) {
                // eslint-disable-next-line no-console
                console.warn("Failed to update onboarding wizard claim. Proceeding with navigation.");
            }

            setIsDismissed(true);
        },
        [ userAccountType, scimUserId ]
    );

    return {
        isLoading,
        markOnboardingComplete,
        shouldShowOnboarding
    };
};
