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
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Checkbox, CheckboxProps, Divider, Header } from "semantic-ui-react";
import { ReactComponent as OrganizationSettingsIcon } from "../assets/images/icons/cds-organization-settings.svg";
import { ReactComponent as ProfileAttributesIcon } from "../assets/images/icons/cds-profile-attributes.svg";
import { ReactComponent as UnificationRuleIcon } from "../assets/images/icons/unification-rules.svg";
import ConfigurationCard from "../components/configuration-card";
import ProfilesSection from "../components/profiles-section";
import useCDSToggle from "../hooks/use-cds-toggle";
import useCDSConfig from "../hooks/use-config";
import { useIsOrganizationManagementEnabled, useIsSubOrganization } from "../utils/organization-management-utils";
import "./customer-data-profile.scss";

/**
 * Unified Customer Data Profile page. Combines the CDS enable toggle, the Organization Settings /
 * Profile Attributes / Unification Rules configuration cards, and the customer profile list
 * into a single view.
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

    // Organization management: a child organization inherits the enablement of its root, so it cannot change it.
    const isSubOrganization: boolean = useIsSubOrganization();
    const isOrganizationManagementEnabled: boolean = useIsOrganizationManagementEnabled();

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
                readOnly={ !hasCDSUpdateScopes || isUpdating || isSubOrganization }
                disabled={ isSubOrganization }
                data-componentid={ `${ componentId }-enable-toggle` }
            />
            { isSubOrganization && (
                <p className="hint-description" data-componentid={ `${ componentId }-enable-toggle-hint` }>
                    { t("customerDataService:organizations.toggleHint") }
                </p>
            ) }
            <Divider hidden />
            { /* Organization management: a child organization has nothing to change in the organization settings. */ }
            { !isSubOrganization && isOrganizationManagementEnabled && (
                <ConfigurationCard
                    title={ t("customerDataService:landing.configuration.organizationSettings.title") }
                    description={ t("customerDataService:landing.configuration.organizationSettings.description") }
                    icon={ OrganizationSettingsIcon }
                    disabled={ !isCDSEnabled }
                    onClick={ () => history.push(AppConstants.getPaths().get("CDS_ORGANIZATION_SETTINGS")) }
                    data-componentid={ `${ componentId }-organization-settings-card` }
                />
            ) }
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
