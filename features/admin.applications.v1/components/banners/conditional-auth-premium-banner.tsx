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

import Alert from "@oxygen-ui/react/Alert";
import Link from "@oxygen-ui/react/Link";
import { AppState } from "@wso2is/admin.core.v1/store";
import useFeatureGate, { UseFeatureGateInterface } from "@wso2is/admin.feature-gate.v1/hooks/use-feature-gate";
import React, { ReactElement, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "./conditional-auth-premium-banner.scss";
import Chip from "@oxygen-ui/react/Chip/Chip";
import { DiamondIcon } from "@oxygen-ui/react-icons";
import { FeatureStatusLabel } from "@wso2is/admin.feature-gate.v1/models/feature-status";

/**
 * Conditional authentication premium banner component.
 */
const ConditionalAuthPremiumBanner = (): ReactElement => {

    const { conditionalAuthPremiumFeature }: UseFeatureGateInterface = useFeatureGate();

    const supportEmail: string = useSelector((state: AppState) =>
        state.config.deployment.extensions?.supportEmail as string);

    const { t } = useTranslation();

    if (!conditionalAuthPremiumFeature) {
        return null;
    }

    return (
        <Alert
            className="conditional-auth-premium-banner"
            severity="warning"
            icon = { false }
            sx={ {
                justifyContent: "space-between"
            } }
        >
            { <Chip
                icon = { <DiamondIcon /> }
                label={ t(FeatureStatusLabel.PREMIUM) }
                className="oxygen-menu-item-chip oxygen-chip-premium mr-2"
                style={ { height: "fit-content" } }
            /> }
            { <Trans
                i18nKey="applications.featureGate.enabledFeatures.tags.premium.info"
            >
                Unlock <b>custom conditional authentication</b> scripting capabilities with our Enterprise plan.
                Reach us at <Link href={ `mailto:${supportEmail}` }>{ supportEmail }</Link>.
            </Trans> }
        </Alert>
    );
};

export default ConditionalAuthPremiumBanner;
