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
import { CommonUtils } from "@wso2is/admin.core.v1/utils/common-utils";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { TrialExpiryStep } from "../models/trial-expiry";
import { useTrialDetails } from "./use-trial-details";

/**
 * Return type for the useTrialExpiryWizard hook.
 */
interface UseTrialExpiryWizardReturnInterface {
    /**
     * Closes the wizard and records the dismissal for the organization, so the wizard is not
     * shown again.
     */
    closeWizard: () => void;
    currentStep: TrialExpiryStep;
    goToNextStep: () => void;
    goToPreviousStep: () => void;
    isOpen: boolean;
    /**
     * Whether the upgrade can be completed self-serve. False when self-serve upgrades are
     * disabled for the deployment, or while the billing URL is still resolving, in which case
     * `upgradeUrl` points at the contact-us page instead.
     */
    isSelfServeUpgrade: boolean;
    /**
     * Public pricing page, opened by the "View Plans" action.
     */
    pricingUrl: string;
    /**
     * Name of the tier the tenant was trialing, e.g. "Growth".
     */
    tierName: string;
    /**
     * Destination for the upgrade call to action. Resolves to the billing portal upgrade
     * URL when self-serve upgrades are enabled, and to the contact-us URL otherwise.
     */
    upgradeUrl: string;
}

/**
 * Owns the step state of the trial expiry wizard and resolves the upgrade destination, so the
 * wizard components stay presentational. Visibility and dismissal are owned by the
 * TrialProvider, which resolves them from the post trial expiry notice endpoint.
 *
 * @returns Wizard state, step navigation callbacks and the resolved upgrade URL.
 */
export const useTrialExpiryWizard = (): UseTrialExpiryWizardReturnInterface => {
    const { showTrialExpiryNotice, dismissTrialExpiryNotice } = useTrialDetails();

    const [ currentStep, setCurrentStep ] = useState<TrialExpiryStep>(TrialExpiryStep.CHANGES);
    const [ billingUpgradeUrl, setBillingUpgradeUrl ] = useState<string>(undefined);

    const tenantDomain: string = useSelector((state: AppState): string => state?.auth?.tenantDomain);
    const associatedTenants: Record<string, unknown>[] = useSelector(
        (state: AppState): Record<string, unknown>[] => state?.auth?.tenants
    );
    const pricingUrl: string = useSelector(
        (state: AppState): string =>
            (state?.config?.deployment?.extensions as { pricingURL?: string })?.pricingURL ?? "https://wso2.com"
    );
    const tierName: string = useSelector(
        (state: AppState): string =>
            ((state?.config?.deployment?.extensions?.trial as { tierName?: string })?.tierName) ?? "Paid"
    );
    const upgradeButtonEnabled: boolean = useSelector(
        (state: AppState): boolean =>
            state?.config?.deployment?.extensions?.upgradeButtonEnabled === true
    );
    const contactUsUrl: string = useSelector(
        (state: AppState): string =>
            (state?.config?.deployment?.extensions as { contactUsUrl?: string })?.contactUsUrl ?? "https://wso2.com"
    );

    useEffect(() => {
        if (!upgradeButtonEnabled) {
            return;
        }

        CommonUtils.buildBillingURLs(tenantDomain, associatedTenants).then(
            ({ upgradeButtonURL }: { upgradeButtonURL: string }) => {
                setBillingUpgradeUrl(upgradeButtonURL);
            }
        );
    }, [ tenantDomain, associatedTenants, upgradeButtonEnabled ]);

    const goToNextStep: () => void = useCallback((): void => {
        setCurrentStep(TrialExpiryStep.UPGRADE);
    }, []);

    const goToPreviousStep: () => void = useCallback((): void => {
        setCurrentStep(TrialExpiryStep.CHANGES);
    }, []);

    const isSelfServeUpgrade: boolean = upgradeButtonEnabled && !!billingUpgradeUrl;

    const upgradeUrl: string = isSelfServeUpgrade
        ? billingUpgradeUrl
        : contactUsUrl;

    return {
        closeWizard: dismissTrialExpiryNotice,
        currentStep,
        goToNextStep,
        goToPreviousStep,
        isOpen: showTrialExpiryNotice,
        isSelfServeUpgrade,
        pricingUrl,
        tierName,
        upgradeUrl
    };
};
