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

import { GearIcon } from "@oxygen-ui/react-icons";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout, SecondaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps, Divider, Header } from "semantic-ui-react";
import { ReactComponent as ProfileAttributesIcon } from "../assets/images/icons/cds-profile-attributes.svg";
import { ReactComponent as ReviewTasksIcon } from "../assets/images/icons/review-tasks.svg";
import { ReactComponent as UnificationRuleIcon } from "../assets/images/icons/unification-rules.svg";
import ConfigurationCard from "../components/configuration-card";
import ProfilesSection from "../components/profiles-section";
import useCDSToggle from "../hooks/use-cds-toggle";
import useCDSConfig from "../hooks/use-config";
import useFuzzyUnificationEnabled from "../hooks/use-fuzzy-unification";
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
    const isFuzzyUnificationEnabled: boolean = useFuzzyUnificationEnabled();
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
            action={ isCDSEnabled && isFuzzyUnificationEnabled && (
                <SecondaryButton
                    onClick={ () => history.push(AppConstants.getPaths().get("CUSTOMER_DATA_SETTINGS")) }
                    data-componentid={ `${ componentId }-settings-button` }
                >
                    <GearIcon className="mr-2" />
                    { t("customerDataService:resolutionSettings.page.title") }
                </SecondaryButton>
            ) }
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
            { /* Review tasks sit beside the configuration rather than inside the settings page:
                 they are work to get through, not something to set once. Gated with the rest of
                 tolerant matching, since exact rules alone rarely produce anything to review. */ }
            { isFuzzyUnificationEnabled && (
                <ConfigurationCard
                    title={ t("customerDataService:landing.configuration.reviewTasks.title") }
                    description={ t("customerDataService:landing.configuration.reviewTasks.description") }
                    icon={ ReviewTasksIcon }
                    disabled={ !isCDSEnabled }
                    onClick={ () => history.push(AppConstants.getPaths().get("CUSTOMER_DATA_REVIEW_TASKS")) }
                    data-componentid={ `${ componentId }-review-tasks-card` }
                />
            ) }

            { isCDSEnabled && (
                <>
                    <Divider hidden />
                    <div data-componentid={ `${ componentId }-profiles-section` }>
                        <Header as="h4" data-componentid={ `${ componentId }-profiles-heading` }>
                            { t("customerDataService:landing.profiles.heading") }
                            <Header.Subheader>
                                { t("customerDataService:landing.profiles.description") }
                            </Header.Subheader>
                        </Header>
                        <Divider hidden />
                        <ProfilesSection shouldFetch={ isCDSEnabled } />
                    </div>
                </>
            ) }
        </PageLayout>
    );
};

export default CustomerDataProfilePage;
