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

import Alert from "@oxygen-ui/react/Alert";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout } from "@wso2is/react-components";
import classNames from "classnames";
import React, { FunctionComponent, ReactElement, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps, Divider } from "semantic-ui-react";
import { ReactComponent as ProfileAttributesIcon } from "../assets/images/icons/cds-profile-attributes.svg";
import { ReactComponent as UnificationRuleIcon } from "../assets/images/icons/unification-rules.svg";
import ConfigurationCard from "../components/configuration-card";
import ProfilesSection from "../components/profiles-section";
import useCDSToggle from "../hooks/use-cds-toggle";
import useCDSConfig from "../hooks/use-config";
import "./customer-data-profile.scss";

/**
 * Unified Customer Data Profile page. Combines the CDS enable toggle,
 * the Profile Attributes / Unification Rules configuration cards, and
 * the customer profile list into a single view.
 */
const CustomerDataProfilePage: FunctionComponent<IdentifiableComponentInterface> = ({
    ["data-componentid"]: componentId = "customer-data-profile-page"
}: IdentifiableComponentInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const cdsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.customerDataService
    );

    const hasCDSUpdateScopes: boolean = useRequiredScopes(cdsFeatureConfig?.scopes?.update);

    const {
        data: cdsConfig,
        mutate: mutateCDSConfig
    } = useCDSConfig(cdsFeatureConfig?.enabled ?? false);

    const { isUpdating, toggleCDS } = useCDSToggle(cdsConfig, mutateCDSConfig);

    const isCDSEnabled: boolean = cdsConfig?.cds_enabled ?? false;

    const handleToggle: (event: SyntheticEvent, data: CheckboxProps) => Promise<void> =
        async (_: SyntheticEvent, data: CheckboxProps): Promise<void> => {
            const isUpdateSuccessful: boolean = await toggleCDS(data.checked === true);

            if (isUpdateSuccessful) {
                dispatch(addAlert({
                    description: t("customerDataService:landing.notifications.update.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("customerDataService:landing.notifications.update.success.message")
                }));
            }
        };

    return (
        <PageLayout
            title={ t("customerDataService:landing.page.title") }
            pageTitle={ t("customerDataService:landing.page.title") }
            description={ t("customerDataService:landing.page.description") }
            className="customer-data-profile-page"
            data-componentid={ `${ componentId }-layout` }
        >
            <Checkbox
                label={ t("customerDataService:landing.enable.label") }
                toggle
                onChange={ handleToggle }
                checked={ isCDSEnabled }
                readOnly={ !hasCDSUpdateScopes || isUpdating }
                data-componentid={ `${ componentId }-enable-toggle` }
            />
            <Divider hidden />
            <Alert severity="info">
                { t("customerDataService:landing.enable.hint") }
            </Alert>
            <Divider hidden />
            <ConfigurationCard
                title={ t("customerDataService:landing.configuration.profileAttributes.title") }
                description={ t("customerDataService:landing.configuration.profileAttributes.description") }
                icon={ ProfileAttributesIcon }
                disabled={ !isCDSEnabled }
                onClick={ () => history.push(AppConstants.getPaths().get("PROFILE_ATTRIBUTES")) }
                data-componentid={ `${ componentId }-profile-attributes-card` }
            />
            <ConfigurationCard
                title={ t("customerDataService:landing.configuration.unificationRules.title") }
                description={ t("customerDataService:landing.configuration.unificationRules.description") }
                icon={ UnificationRuleIcon }
                disabled={ !isCDSEnabled }
                onClick={ () => history.push(AppConstants.getPaths().get("UNIFICATION_RULES")) }
                data-componentid={ `${ componentId }-unification-rules-card` }
            />
            <Divider hidden />
            <div
                className={ classNames({ "cds-section-disabled": !isCDSEnabled }) }
                data-componentid={ `${ componentId }-profiles-section` }
            >
                <ProfilesSection shouldFetch={ isCDSEnabled } />
            </div>
        </PageLayout>
    );
};

export default CustomerDataProfilePage;
