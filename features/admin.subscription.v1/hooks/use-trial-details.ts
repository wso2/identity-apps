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

import { FeatureStatus, useCheckFeatureStatus } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useGetTrialDetails } from "../api/get-trial-details";

/**
 * Return type for the useTrialDetails hook.
 */
interface UseTrialDetailsReturn {
    tenantHasTrial: boolean;
    daysRemaining: number;
    isLoading: boolean;
}

/**
 * Hook that fetches trial details from the tenant trial endpoint
 * and derives whether the tenant has an active trial and how many days remain.
 *
 * @returns Trial state and days remaining.
 */
export const useTrialDetails = (): UseTrialDetailsReturn => {
    const saasFeatureStatus: FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);
    const { isFirstLevelOrganization } = useGetCurrentOrganizationType();
    const isFirstLevelOrg: boolean = isFirstLevelOrganization();

    const isTrialFeatureEnabled: boolean = useSelector(
        (state: AppState) =>
            (state.config.deployment.extensions as Record<string, Record<string, unknown>>)
                ?.trial?.enabled === true
    );

    const shouldFetch: boolean =
        saasFeatureStatus !== FeatureStatus.DISABLED &&
        isTrialFeatureEnabled &&
        isFirstLevelOrg;

    const {
        data: trialData,
        isLoading: isTrialLoading,
        error
    } = useGetTrialDetails(shouldFetch);

    const tenantHasTrial: boolean = useMemo((): boolean => {
        if (!shouldFetch || isTrialLoading) {
            return false;
        }

        if (error) {
            return false;
        }

        return trialData?.daysRemaining !== undefined && trialData?.daysRemaining !== null;
    }, [ shouldFetch, isTrialLoading, error, trialData ]);

    const daysRemaining: number = useMemo((): number => {
        return trialData?.daysRemaining ?? 0;
    }, [ trialData ]);

    const isLoading: boolean = shouldFetch && isTrialLoading;

    return {
        daysRemaining,
        isLoading,
        tenantHasTrial
    };
};
