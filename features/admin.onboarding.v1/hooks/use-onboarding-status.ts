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

import { useApplicationList } from "@wso2is/admin.applications.v1/api/application";
import { ApplicationListInterface } from "@wso2is/admin.applications.v1/models/application";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { FeatureAccessConfigInterface } from "@wso2is/core/models";
import { LocalStorageUtils, SessionStorageUtils } from "@wso2is/core/utils";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { hashForStorageKey } from "../utils/url-utils";

/**
 * Return type for the useOnboardingStatus hook.
 */
interface UseOnboardingStatusReturn {
    isLoading: boolean;
    markOnboardingComplete: () => void;
    shouldShowOnboarding: boolean;
}

/**
 * SessionStorage key prefix for caching the onboarding evaluation result.
 */
const SESSION_CACHE_KEY: string = "onboarding_status";

/**
 * Determines whether the onboarding wizard should be shown to the current user.
 *
 * Evaluates feature flags, user type, org type, existing apps, and local
 * completion status — then caches the result in sessionStorage so subsequent
 * renders skip all checks. Gates on `uuid` which is set last in the sign-in
 * flow, ensuring all Redux state is settled before evaluation.
 */
export const useOnboardingStatus = (): UseOnboardingStatusReturn => {
    const [ shouldShowOnboarding, setShouldShowOnboarding ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    const hasEvaluated: React.MutableRefObject<boolean> = useRef<boolean>(false);

    const uuid: string = useSelector((state: AppState) => state.profile.profileInfo.id);
    const username: string = useSelector((state: AppState) => state.auth.username);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);
    const organizationType: string = useSelector(
        (state: AppState) => state?.organization?.organizationType
    );
    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features
    );
    const onboardingFeatureConfig: FeatureAccessConfigInterface = featureConfig?.onboarding;

    // Check session cache — if a previous evaluation already decided "hide",
    // skip all API calls for the rest of this browser session.
    const userId: string = username || uuid;
    const hashedUserId: string = userId ? hashForStorageKey(userId) : "";
    const isStatusCached: boolean = !!hashedUserId &&
        SessionStorageUtils.getItemFromSessionStorage(`${SESSION_CACHE_KEY}_${hashedUserId}`) === "hide";

    // Fetch application count — only when sync checks would pass and no session cache.
    const shouldFetchApps: boolean =
        !isStatusCached &&
        !!onboardingFeatureConfig?.enabled &&
        !isPrivilegedUser &&
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

        const resolvedUserId: string = username || uuid;
        const hashedId: string = resolvedUserId ? hashForStorageKey(resolvedUserId) : "";

        // Fast path: session cache says "hide" — skip all checks
        if (isStatusCached) {
            setShouldShowOnboarding(false);
            setIsLoading(false);

            return;
        }

        // Check 1: Feature flag must be enabled
        if (!onboardingFeatureConfig?.enabled) {
            setShouldShowOnboarding(false);
            setIsLoading(false);

            return;
        }

        // Check 2: Exclude privileged/federated users (enterprise IDP)
        if (isPrivilegedUser) {
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
            SessionStorageUtils.setItemToSessionStorage(`${SESSION_CACHE_KEY}_${hashedId}`, "hide");
            setShouldShowOnboarding(false);
            setIsLoading(false);

            return;
        }

        // Check 5: Check localStorage for completion/skip status.
        if (!resolvedUserId) {
            setShouldShowOnboarding(false);
            setIsLoading(false);

            return;
        }

        // Check hashed key first, then fall back to legacy unhashed key for migration
        const hashedKey: string = `onboarding_completed_${hashedId}`;
        const legacyKey: string = `onboarding_completed_${resolvedUserId}`;
        let hasCompletedOnboarding: string | null = LocalStorageUtils.getValueFromLocalStorage(hashedKey);

        if (!hasCompletedOnboarding) {
            hasCompletedOnboarding = LocalStorageUtils.getValueFromLocalStorage(legacyKey);

            if (hasCompletedOnboarding) {
                // Migrate to hashed key and remove legacy key
                LocalStorageUtils.setValueInLocalStorage(hashedKey, hasCompletedOnboarding);
                LocalStorageUtils.clearItemFromLocalStorage(legacyKey);
            }
        }

        if (hasCompletedOnboarding) {
            SessionStorageUtils.setItemToSessionStorage(`${SESSION_CACHE_KEY}_${hashedId}`, "hide");
        }

        setShouldShowOnboarding(!hasCompletedOnboarding);
        setIsLoading(false);
    }, [
        uuid, username, isPrivilegedUser, organizationType,
        onboardingFeatureConfig,
        isStatusCached, shouldFetchApps, isAppListLoading, appListData
    ]);

    const markOnboardingComplete: () => void = useCallback((): void => {
        const resolvedUserId: string = username || uuid;

        if (resolvedUserId) {
            const hashedId: string = hashForStorageKey(resolvedUserId);

            LocalStorageUtils.setValueInLocalStorage(`onboarding_completed_${hashedId}`, "true");
            SessionStorageUtils.setItemToSessionStorage(`${SESSION_CACHE_KEY}_${hashedId}`, "hide");
            setShouldShowOnboarding(false);
        }
    }, [ uuid, username ]);

    return {
        isLoading,
        markOnboardingComplete,
        shouldShowOnboarding
    };
};
