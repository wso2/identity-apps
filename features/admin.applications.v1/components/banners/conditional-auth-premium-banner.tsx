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
import React, { ReactElement } from "react";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import "./conditional-auth-premium-banner.scss";

/**
 * Conditional authentication premium banner component.
 */
const ConditionalAuthPremiumBanner = (): ReactElement => {

    const { conditionalAuthPremiumFeature }: UseFeatureGateInterface = useFeatureGate();

    const contactUsURL: string = useSelector((state: AppState) =>
        state.config.deployment.extensions?.contactUsUrl as string);

    if (!conditionalAuthPremiumFeature) {
        return null;
    }

    return (
        <Alert
            className="conditional-auth-premium-banner oxygen-chip-premium"
            severity="warning"
            icon = { false }

        >
            <Trans
                i18nKey="applications.featureGate.enabledFeatures.tags.premium.info"
                className="conditional-auth-premium-text"
            >
                Unlock conditional authentication scripting with our Enterprise plan.
                <Link href={ contactUsURL }> Contact sales</Link> to upgrade.
            </Trans>
        </Alert>
    );
};

export default ConditionalAuthPremiumBanner;
