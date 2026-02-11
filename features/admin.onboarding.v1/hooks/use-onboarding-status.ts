/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { ApplicationListInterface } from "@wso2is/admin.applications.v1/models/application";
import useRequest, { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { OrganizationType } from "@wso2is/admin.organizations.v1/constants";
import { FeatureAccessConfigInterface, HttpMethods } from "@wso2is/core/models";
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
 * Caches "hide" decisions so subsequent hook instances and remounts
 * skip all API calls for the rest of the browser session.
 */
const SESSION_CACHE_KEY: string = "onboarding_status";

/**
 * Hook to manage onboarding status.
 *
 * Uses Redux selectors exclusively (no `getDecodedIDToken`) to avoid
 * unstable dependency references that cause the wizard to reset.
 *
 * Gates on `uuid` (state.profile.profileInfo.id) which is set LAST
 * in the sign-in flow, guaranteeing that `organizationType` and
 * `isPrivilegedUser` are already set when the check runs.
 */
export const useOnboardingStatus = (): UseOnboardingStatusReturn => {
    const [ shouldShowOnboarding, setShouldShowOnboarding ] = useState<boolean>(false);
    const [ isLoading, setIsLoading ] = useState<boolean>(true);

    // Track whether we've already evaluated to prevent re-evaluation
    const hasEvaluated: React.MutableRefObject<boolean> = useRef<boolean>(false);

    // Redux selectors — all return stable primitive values
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

    const applicationsEndpoint: string = useSelector(
        (state: AppState) => state.config?.endpoints?.applications
    );

    // Check session cache — if a previous evaluation already decided "hide",
    // skip all API calls for the rest of this browser session.
    const userId: string = username || uuid;
    const hashedUserId: string = userId ? hashForStorageKey(userId) : "";
    const isStatusCached: boolean = !!hashedUserId &&
        sessionStorage.getItem(`${SESSION_CACHE_KEY}_${hashedUserId}`) === "hide";

    // Fetch application count — only when sync checks would pass and no session cache.
    // Uses limit=1 and excludeSystemPortals=true to minimize payload;
    // we only need totalResults to know if user-created apps exist.
    const shouldFetchApps: boolean =
        !isStatusCached &&
        !!onboardingFeatureConfig?.enabled &&
        !isPrivilegedUser &&
        organizationType !== OrganizationType.SUBORGANIZATION &&
        !!applicationsEndpoint &&
        !!uuid;

    const appListRequestConfig: RequestConfigInterface | null = shouldFetchApps
        ? {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: HttpMethods.GET,
            params: {
                excludeSystemPortals: true,
                limit: 1,
                offset: 0
            },
            url: applicationsEndpoint
        }
        : null;

    const {
        data: appListData,
        isLoading: isAppListLoading
    } = useRequest<ApplicationListInterface>(appListRequestConfig);

    useEffect(() => {
        // Wait until uuid is set — this is the LAST thing set in the sign-in flow,
        // so organizationType and isPrivilegedUser are guaranteed to be correct by now.
        if (!uuid) {
            return;
        }

        // Only evaluate once to prevent state churn from causing wizard resets
        if (hasEvaluated.current) {
            return;
        }

        // Wait for application list fetch to complete (only if the check is needed)
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
            sessionStorage.setItem(`${SESSION_CACHE_KEY}_${hashedId}`, "hide");
            setShouldShowOnboarding(false);
            setIsLoading(false);

            return;
        }

        // Check 2: Exclude privileged/federated users (enterprise IDP)
        if (isPrivilegedUser) {
            sessionStorage.setItem(`${SESSION_CACHE_KEY}_${hashedId}`, "hide");
            setShouldShowOnboarding(false);
            setIsLoading(false);

            return;
        }

        // Check 3: Exclude sub-organization users
        if (organizationType === OrganizationType.SUBORGANIZATION) {
            sessionStorage.setItem(`${SESSION_CACHE_KEY}_${hashedId}`, "hide");
            setShouldShowOnboarding(false);
            setIsLoading(false);

            return;
        }

        // Check 4: If the organization already has user-created applications, skip wizard.
        // Handles the case where a new admin joins an already-configured org.
        if (appListData && appListData.totalResults > 0) {
            sessionStorage.setItem(`${SESSION_CACHE_KEY}_${hashedId}`, "hide");
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
        let hasCompletedOnboarding: string | null = localStorage.getItem(hashedKey);

        if (!hasCompletedOnboarding) {
            hasCompletedOnboarding = localStorage.getItem(legacyKey);

            if (hasCompletedOnboarding) {
                // Migrate to hashed key and remove legacy key
                localStorage.setItem(hashedKey, hasCompletedOnboarding);
                localStorage.removeItem(legacyKey);
            }
        }

        if (hasCompletedOnboarding) {
            sessionStorage.setItem(`${SESSION_CACHE_KEY}_${hashedId}`, "hide");
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

            localStorage.setItem(`onboarding_completed_${hashedId}`, "true");
            sessionStorage.setItem(`${SESSION_CACHE_KEY}_${hashedId}`, "hide");
            setShouldShowOnboarding(false);
        }
    }, [ uuid, username ]);

    return {
        isLoading,
        markOnboardingComplete,
        shouldShowOnboarding
    };
};
