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
import useGetAllFeatures from "@wso2is/admin.feature-gate.v1/api/use-get-all-features";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { useSelector } from "react-redux";
import { activateTrial } from "../api/activate-trial";
import { useGetTrialDetails } from "../api/get-trial-details";
import useGetTenantTier from "../api/use-get-tenant-tier";
import TrialContext, { TrialContextPropsInterface } from "../contexts/trial-context";
import { useTrialStatus } from "../hooks/use-trial-status";
import { TrialStatus } from "../models/trial";

/**
 * Props interface for the TrialProvider.
 */
type TrialProviderPropsInterface = PropsWithChildren<unknown>;

/**
 * Provider that owns the trial lifecycle: it checks the user's trial status,
 * activates the trial when it is not yet enabled, and only then fetches the
 * tenant trial details. Sequencing the details fetch behind the activation
 * decision prevents consumers from caching stale "no trial" data.
 *
 * @param props - Wrap content/elements.
 * @returns TrialContext Provider.
 */
const TrialProvider: FunctionComponent<TrialProviderPropsInterface> = (
    props: TrialProviderPropsInterface
): ReactElement => {
    const { children } = props;

    const saasFeatureStatus: FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);
    const { isFirstLevelOrganization } = useGetCurrentOrganizationType();
    const isFirstLevelOrg: boolean = isFirstLevelOrganization();

    const isTrialFeatureEnabled: boolean = useSelector(
        (state: AppState) =>
            (state.config.deployment.extensions as Record<string, Record<string, unknown>>)
                ?.trial?.enabled === true
    );

    const {
        trialStatus,
        isResolved: isTrialStatusResolved,
        isLoading: isTrialStatusLoading,
        error: trialStatusError
    } = useTrialStatus();

    const { mutate: mutateTenantTier } = useGetTenantTier();
    const { mutate: mutateAllFeatures } = useGetAllFeatures();

    const trialActivationAttempted: React.MutableRefObject<boolean> = useRef<boolean>(false);
    const [ isActivationAttemptComplete, setIsActivationAttemptComplete ] = useState<boolean>(false);

    /**
     * Fire-and-forget trial activation when trial is not yet enabled.
     */
    useEffect(() => {
        if (
            !isTrialFeatureEnabled
            || isTrialStatusLoading
            || !isTrialStatusResolved
            || trialStatus !== TrialStatus.DISABLED
            || trialActivationAttempted.current
        ) {
            return;
        }

        trialActivationAttempted.current = true;

        activateTrial()
            .then(() => {
                // SWR cache is global per key, so these revalidate the
                // useGetTenantTier/useGetAllFeatures instances elsewhere in the app too.
                mutateTenantTier();
                mutateAllFeatures();
            })
            .catch(() => {
                // eslint-disable-next-line no-console
                console.warn("Trial activation is pending.");
            })
            .finally(() => {
                setIsActivationAttemptComplete(true);
            });
    }, [
        isTrialFeatureEnabled,
        isTrialStatusLoading,
        isTrialStatusResolved,
        trialStatus
    ]);

    /**
     * Whether the activation decision is settled, i.e. it is safe to fetch trial
     * details without racing the activation POST. If the trial status can never
     * resolve (e.g. the username never reaches the profile state), the gate stays
     * closed and trial details simply remain hidden for the session.
     */
    const isActivationSettled: boolean =
        !isTrialFeatureEnabled
        || !isFirstLevelOrg
        || !!trialStatusError
        || (isTrialStatusResolved && trialStatus === TrialStatus.ENABLED)
        || isActivationAttemptComplete;

    const isTrialPipelineEnabled: boolean =
        saasFeatureStatus !== FeatureStatus.DISABLED &&
        isTrialFeatureEnabled &&
        isFirstLevelOrg;

    const shouldFetchDetails: boolean = isTrialPipelineEnabled && isActivationSettled;

    const {
        data: trialData,
        isLoading: isTrialDetailsLoading,
        error: trialDetailsError
    } = useGetTrialDetails(shouldFetchDetails);

    const tenantHasTrial: boolean = useMemo((): boolean => {
        if (!shouldFetchDetails || isTrialDetailsLoading) {
            return false;
        }

        if (trialDetailsError) {
            return false;
        }

        return trialData?.daysRemaining !== undefined && trialData?.daysRemaining !== null;
    }, [ shouldFetchDetails, isTrialDetailsLoading, trialDetailsError, trialData ]);

    const daysRemaining: number = useMemo((): number => {
        return trialData?.daysRemaining ?? 0;
    }, [ trialData ]);

    const isLoading: boolean = isTrialPipelineEnabled && (!isActivationSettled || isTrialDetailsLoading);

    const contextValue: TrialContextPropsInterface = useMemo(
        (): TrialContextPropsInterface => ({
            daysRemaining,
            isLoading,
            tenantHasTrial
        }),
        [ daysRemaining, isLoading, tenantHasTrial ]
    );

    return (
        <TrialContext.Provider value={ contextValue }>
            { children }
        </TrialContext.Provider>
    );
};

export default TrialProvider;
