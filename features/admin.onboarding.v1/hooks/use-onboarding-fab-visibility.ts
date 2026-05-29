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

import { useRequiredScopes } from "@wso2is/access-control";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    useGetCurrentOrganizationType
} from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { FeatureAccessConfigInterface } from "@wso2is/core/models";
import { useSelector } from "react-redux";

/**
 * Return type for the useOnboardingFabVisibility hook.
 */
interface UseOnboardingFabVisibilityReturn {
    isVisible: boolean;
}

/**
 * Determines whether the onboarding FAB should be visible for the current user.
 */
export const useOnboardingFabVisibility = (): UseOnboardingFabVisibilityReturn => {
    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features
    );
    const onboardingFeatureConfig: FeatureAccessConfigInterface = featureConfig?.onboarding;

    const { isFirstLevelOrganization } = useGetCurrentOrganizationType();

    const hasRequiredCreateScopes: boolean = useRequiredScopes(
        onboardingFeatureConfig?.scopes?.create as string[]
    );

    const isVisible: boolean =
        !!onboardingFeatureConfig?.enabled &&
        isFirstLevelOrganization() &&
        hasRequiredCreateScopes;

    return { isVisible };
};
