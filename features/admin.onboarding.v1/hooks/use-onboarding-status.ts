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
import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { UserAccountTypes } from "@wso2is/admin.users.v1/constants/user-management-constants";
import { FeatureAccessConfigInterface, ProfileInfoInterface } from "@wso2is/core/models";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getOnboardingWizardClaim } from "../api/get-onboarding-claim";
import { dismissOnboardingWizardClaim } from "../api/update-onboarding-claim";

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
 * Evaluates feature flags, user type, org type, existing apps, and the SCIM2
 * `showOnboardingWizard` claim. The claim is the single source of truth for
 * wizard visibility. Gates on `uuid` which is set last in the sign-in flow,
 * ensuring all Redux state is settled before evaluation.
 */
export const useOnboardingStatus = (): UseOnboardingStatusReturn => {
    const [ shouldShowOnboarding, setShouldShowOnboarding ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    const hasEvaluated: React.MutableRefObject<boolean> = useRef<boolean>(false);

    const uuid: string = useSelector((state: AppState) => state.profile.profileInfo.id);
    const username: string = useSelector((state: AppState) => state.auth.username);
    const profileInfo: ProfileInfoInterface = useSelector(
        (state: AppState) => state.profile.profileInfo
    );
    const userAccountType: string = profileInfo?.[SCIMConfigs.scim.systemSchema]?.userAccountType;
    const organizationType: string = useSelector(
        (state: AppState) => state?.organization?.organizationType
    );
    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features
    );
    const onboardingFeatureConfig: FeatureAccessConfigInterface = featureConfig?.onboarding;

    // Only show wizard for org owners, collaborators and priviledged users.
    const isEligibleUserType: boolean =
        userAccountType === UserAccountTypes.OWNER ||
        userAccountType === UserAccountTypes.COLLABORATOR ||
        userAccountType === UserAccountTypes.CUSTOMER;

    // Fetch application count — only when sync checks would pass.
    const shouldFetchApps: boolean =
        !!onboardingFeatureConfig?.enabled &&
        isEligibleUserType &&
        organizationType !== OrganizationType.SUBORGANIZATION &&
        !!uuid;

    const {
        data: appListData,
        error: appListError,
        isLoading: isAppListLoading
    } = useApplicationList<ApplicationListInterface>(undefined, 1, 0, undefined, shouldFetchApps, true);

    useEffect(() => {
        // Wait until uuid and featureConfig are set — ensures all required Redux state
        // (feature config, org type, privileged user status) is settled before evaluation.
        if (!uuid || !featureConfig) {
            return;
        }

        // Only evaluate once to prevent state churn from causing wizard resets
        if (hasEvaluated.current) {
            return;
        }

        if (shouldFetchApps && isAppListLoading) {
            return;
        }

        hasEvaluated.current = true;

        // Check 1: Feature flag must be enabled
        if (!onboardingFeatureConfig?.enabled) {
            setShouldShowOnboarding(false);
            setIsLoading(false);

            return;
        }

        // Check 2: Only show wizard for org owners, collaborators and priviledged users.
        if (!isEligibleUserType) {
            setShouldShowOnboarding(false);
            setIsLoading(false);

            return;
        }

        // Check 3: Exclude sub-organization users
        if (organizationType === OrganizationType.SUBORGANIZATION) {
            setShouldShowOnboarding(false);
            setIsLoading(false);

            return;
        }

        // Check 4: If the organization already has user-created applications, skip wizard.
        // If app-list fetch fails, log error and fail open (show wizard) to avoid blocking new users.
        if (appListError) {
            // eslint-disable-next-line no-console
            console.warn("Failed to fetch application list for onboarding check:", appListError);
        } else if (appListData && appListData.totalResults > 0) {
            setShouldShowOnboarding(false);
            setIsLoading(false);

            return;
        }

        // Check 5: Read the showOnboardingWizard SCIM claim from the server.
        // Uses /scim2/Users endpoint.
        const evaluateScimClaim: () => Promise<void> = async (): Promise<void> => {
            try {
                const shouldShow: boolean = await getOnboardingWizardClaim(uuid);

                setShouldShowOnboarding(shouldShow);
            } catch (_error: unknown) {
                setShouldShowOnboarding(false);
            } finally {
                setIsLoading(false);
            }
        };

        evaluateScimClaim();
    }, [
        uuid, username, isEligibleUserType, organizationType,
        onboardingFeatureConfig,
        shouldFetchApps, isAppListLoading, appListData
    ]);

    const markOnboardingComplete: () => Promise<void> = useCallback(
        async (): Promise<void> => {
            try {
                await dismissOnboardingWizardClaim();
            } catch (_error: unknown) {
                // eslint-disable-next-line no-console
                console.warn("Failed to update onboarding wizard claim. Proceeding with navigation.");
            }

            setShouldShowOnboarding(false);
        },
        []
    );

    return {
        isLoading,
        markOnboardingComplete,
        shouldShowOnboarding
    };
};
