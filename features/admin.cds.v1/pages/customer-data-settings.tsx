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
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ResolutionSettings from "../components/resolution-settings";
import useCDSConfig from "../hooks/use-config";
import useFuzzyUnificationEnabled from "../hooks/use-fuzzy-unification";

/**
 * Settings that govern how confident the engine has to be before it acts.
 *
 * Kept off the Customer Data Profile page deliberately: that page is where an operator goes
 * to find things, and these are tuned rarely and read even less often. Reaching them through
 * the gear follows how My Account settings are reached from the Applications list.
 */
const CustomerDataSettingsPage: FunctionComponent<IdentifiableComponentInterface> = ({
    ["data-componentid"]: componentId = "customer-data-settings-page"
}: IdentifiableComponentInterface): ReactElement => {

    const { t } = useTranslation();

    const cdsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.customerDataService);
    const hasCDSUpdateScopes: boolean = useRequiredScopes(cdsFeatureConfig?.scopes?.update);

    const isFuzzyUnificationEnabled: boolean = useFuzzyUnificationEnabled();

    const {
        data: cdsConfig,
        isLoading,
        mutate: mutateCDSConfig
    } = useCDSConfig(cdsFeatureConfig?.enabled ?? false);

    // The page is reached from a button the flag already hides, but the route itself is not
    // gated — so the URL alone would otherwise still open the thresholds for editing.
    useEffect(() => {
        if (!isFuzzyUnificationEnabled) {
            history.push(AppConstants.getPaths().get("CUSTOMER_DATA_PROFILE"));
        }
    }, [ isFuzzyUnificationEnabled ]);

    if (!isFuzzyUnificationEnabled) {
        return null;
    }

    return (
        <PageLayout
            title={ t("customerDataService:resolutionSettings.page.title") }
            description={ t("customerDataService:resolutionSettings.page.description") }
            isLoading={ isLoading }
            backButton={ {
                onClick: () => history.push(AppConstants.getPaths().get("CUSTOMER_DATA_PROFILE")),
                text: t("customerDataService:resolutionSettings.page.backButton")
            } }
            bottomMargin={ false }
            data-componentid={ `${ componentId }-layout` }
        >
            { cdsConfig && (
                <ResolutionSettings
                    config={ cdsConfig }
                    mutateConfig={ mutateCDSConfig }
                    isReadOnly={ !hasCDSUpdateScopes }
                    data-componentid={ `${ componentId }-resolution-settings` }
                />
            ) }
        </PageLayout>
    );
};

export default CustomerDataSettingsPage;
