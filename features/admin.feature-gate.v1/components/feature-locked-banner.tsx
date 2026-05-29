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

import Alert, { AlertProps } from "@oxygen-ui/react/Alert";
import Link from "@oxygen-ui/react/Link";
import { AppState } from "@wso2is/admin.core.v1/store";
import { CommonUtils } from "@wso2is/admin.core.v1/utils/common-utils";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

/**
 * Props interface for the FeatureLockedBanner component.
 */
type FeatureLockedBannerPropsInterface = IdentifiableComponentInterface & Pick<AlertProps, "sx">;

/**
 * A reusable banner indicating a feature is locked behind a paid subscription.
 *
 * @param props - Props injected to the component.
 * @returns Feature locked banner component.
 */
const FeatureLockedBanner: FunctionComponent<FeatureLockedBannerPropsInterface> = (
    {
        [ "data-componentid" ]: componentId = "feature-locked-banner",
        sx
    }: FeatureLockedBannerPropsInterface
): ReactElement => {

    const { t } = useTranslation();

    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);
    const associatedTenants: unknown[] = useSelector((state: AppState) => state?.auth?.tenants);
    const [ upgradeButtonURL, setUpgradeButtonURL ] = useState<string>("");

    useEffect(() => {
        CommonUtils.buildBillingURLs(tenantDomain, associatedTenants).then(
            ({ upgradeButtonURL }: { upgradeButtonURL: string }) => {
                setUpgradeButtonURL(upgradeButtonURL);
            }
        );
    }, [ tenantDomain, associatedTenants ]);

    return (
        <Alert
            sx={ {
                "& .MuiAlert-message": {
                    fontSize: "14px",
                    fontWeight: "100"
                },
                "& a": {
                    fontWeight: "bold"
                },
                ...sx
            } }
            className="oxygen-chip-premium"
            severity="warning"
            icon={ false }
            data-componentid={ componentId }
        >
            { t("console:common.featureLockedBanner.prefix") }
            { " " }
            <Link
                href={ upgradeButtonURL }
                target="_blank"
                rel="noreferrer"
            >
                { t("console:common.featureLockedBanner.action") }
            </Link>
            { " " }
            { t("console:common.featureLockedBanner.suffix") }
        </Alert>
    );
};

export default FeatureLockedBanner;
