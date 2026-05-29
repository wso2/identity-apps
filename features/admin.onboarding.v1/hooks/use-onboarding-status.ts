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

import { useApplicationList } from "@wso2is/admin.applications.v1/api/application";
import { ApplicationListInterface } from "@wso2is/admin.applications.v1/models/application";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    useGetCurrentOrganizationType
} from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { useUsersList } from "@wso2is/admin.users.v1/api/users";
import { UserAccountTypes } from "@wso2is/admin.users.v1/constants/user-management-constants";
import { ProfileConstants } from "@wso2is/core/constants";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import { FeatureAccessConfigInterface } from "@wso2is/core/models";
import { useCallback, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { dismissOnboardingWizardClaim } from "../api/update-onboarding-claim";
import { parseOnboardingShowFromPreferences } from "../utils/parse-onboarding-preferences";

/**
 * SCIM2 attributes to request from the Users list endpoint.
 */
const SCIM_ATTRIBUTES: string = [
    "userName",
    `${ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA}.userAccountType`,
    `${ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA}.userPreferences`
].join(",");

/**
 * Return type for the useOnboardingStatus hook.
 */
interface UseOnboardingStatusReturn {
    isFirstWizardRun: boolean;
    isLoading: boolean;
    markOnboardingComplete: () => Promise<void>;
    shouldShowOnboarding: boolean;
    userAccountType: string | null;
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
    const allowedScopes: string = useSelector(
        (state: AppState) => state?.auth?.allowedScopes
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

    const isOwner: boolean = userAccountType === UserAccountTypes.OWNER;

    // For owners, fetch applications (excluding system portals) to check if any exist.
    const {
        data: appListData,
        isLoading: isAppListLoading
    } = useApplicationList<ApplicationListInterface>(
        null,
        1,
        0,
        null,
        shouldFetch && isOwner,
        true
    );

    const ownerHasNoApps: boolean = useMemo((): boolean => {
        if (!isOwner || !appListData) {
            return true;
        }

        return (appListData.totalResults ?? 0) === 0;
    }, [ isOwner, appListData ]);

    const hasOnboardingScopes: boolean = useMemo(
        (): boolean => hasRequiredScopes(
            onboardingFeatureConfig,
            onboardingFeatureConfig?.scopes?.create,
            allowedScopes
        ),
        [ onboardingFeatureConfig, allowedScopes ]
    );

    const shouldShowOnboarding: boolean = useMemo((): boolean => {
        if (isDismissed || !shouldFetch || !currentUser || !hasOnboardingScopes) {
            return false;
        }

        const hasPreference: boolean = parseOnboardingShowFromPreferences(
            systemSchemaData?.userPreferences as string | undefined
        );

        if (isOwner) {
            return hasPreference && ownerHasNoApps;
        }

        return hasPreference;
    }, [ isDismissed, shouldFetch, currentUser, systemSchemaData, isOwner, ownerHasNoApps, hasOnboardingScopes ]);

    const isLoading: boolean =
        !featureConfig || (shouldFetch && (isUserListLoading || (isOwner && isAppListLoading)));

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

    // True when the user has never completed or skipped the wizard (SCIM2 userPreferences).
    const isFirstWizardRun: boolean = useMemo((): boolean => {
        if (!currentUser) {
            return true;
        }

        return parseOnboardingShowFromPreferences(
            systemSchemaData?.userPreferences as string | undefined
        );
    }, [ currentUser, systemSchemaData ]);

    return {
        isFirstWizardRun,
        isLoading,
        markOnboardingComplete,
        shouldShowOnboarding,
        userAccountType
    };
};
