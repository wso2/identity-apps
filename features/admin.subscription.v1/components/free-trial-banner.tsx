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

import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Link from "@oxygen-ui/react/Link/Link";
import Typography from "@oxygen-ui/react/Typography";
import { FeatureStatus, useCheckFeatureStatus } from "@wso2is/access-control";
import { AppState } from "@wso2is/admin.core.v1/store";
import { CommonUtils } from "@wso2is/admin.core.v1/utils/common-utils";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTrialDetails } from "../hooks/use-trial-details";

/**
 * Props interface for the FreeTrialBanner component.
 */
type FreeTrialBannerPropsInterface = IdentifiableComponentInterface;

/**
 * Banner component that displays trial status information
 * when the tenant has an active free trial.
 *
 * @param props - Component props.
 * @returns Free trial banner component.
 */
const FreeTrialBanner: FunctionComponent<FreeTrialBannerPropsInterface> = (
    props: FreeTrialBannerPropsInterface
): ReactElement => {
    const {
        ["data-componentid"]: componentId = "free-trial-banner"
    } = props;

    const { tenantHasTrial, daysRemaining } = useTrialDetails();
    const saasFeatureStatus: FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);
    const trialTierName: string = useSelector(
        (state: AppState) =>
            ((state?.config?.deployment?.extensions?.trial as { tierName?: string })?.tierName) ?? "Paid"
    );
    const associatedTenants: any[] = useSelector((state: AppState) => state?.auth?.tenants);

    const [ upgradeButtonURL, setUpgradeButtonURL ] = useState<string>(undefined);
    const pricingURL: string = useSelector(
        (state: AppState) =>
            (state?.config?.deployment?.extensions as { pricingURL?: string })?.pricingURL ?? "https://wso2.com"
    );

    useEffect(() => {
        if (saasFeatureStatus === FeatureStatus.DISABLED) {
            return;
        }

        CommonUtils.buildBillingURLs(tenantDomain, associatedTenants).then(
            ({ upgradeButtonURL }: { upgradeButtonURL: string }) => {
                setUpgradeButtonURL(upgradeButtonURL);
            }
        );
    }, [ tenantDomain, associatedTenants ]);

    if (saasFeatureStatus === FeatureStatus.DISABLED || !tenantHasTrial) {
        return null;
    }

    return (
        <Box
            sx={ {
                "@keyframes fadeIn": {
                    from: { opacity: 0, transform: "translateY(-8px)" },
                    to: { opacity: 1, transform: "translateY(0)" }
                },
                alignItems: "center",
                animation: "fadeIn 0.3s ease-out forwards",
                backgroundColor: "#f0f0f0",
                borderRadius: 1,
                display: "flex",
                justifyContent: "space-between",
                mb: 2,
                mt: 1,
                px: 2.5,
                py: 2
            } }
            data-componentid={ componentId }
        >
            <Typography variant="body1" color="text.secondary">
                You&apos;re on a free <strong>{ trialTierName } tier</strong> trial with { " " }
                <strong>{ daysRemaining }</strong>{ " " }
                { daysRemaining === 1 ? "day" : "days" } remaining. { " " }
                Take this time to try out capabilities not available on the Free plan. { " " }
                <Link
                    href={ upgradeButtonURL }
                    target="_blank"
                    rel="noreferrer"
                    underline="always"
                >
                    Upgrade
                </Link>
                { " " }whenever you&apos;re ready.
            </Typography>
            <Button
                variant="outlined"
                size="small"
                sx={ { ml: 4, mr: 1, whiteSpace: "nowrap" } }
                onClick={ () => window.open(pricingURL, "_blank", "noopener,noreferrer") }
                data-componentid={ `${componentId}-view-plans-button` }
            >
                View Plans
            </Button>
        </Box>
    );
};

export default FreeTrialBanner;
