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
import Card from "@oxygen-ui/react/Card";
import CardContent from "@oxygen-ui/react/CardContent";
import Divider from "@oxygen-ui/react/Divider";
import { useRequiredScopes } from "@wso2is/access-control";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { PageLayout } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { updateCDSConfig } from "../api/config";
import AllowedOriginsSettings from "../components/allowed-origins-settings";
import ResolutionSettings from "../components/resolution-settings";
import useCDSConfig from "../hooks/use-config";
import useFuzzyUnificationEnabled from "../hooks/use-fuzzy-unification";
import useIsSubOrganization from "../hooks/use-is-sub-organization";
import { CDSConfigUpdateRequest, CDSSettingsSectionStateInterface } from "../models/config";

/**
 * The sections of the settings page, each saved with the one update of the page.
 */
enum SettingsSection {
    ALLOWED_ORIGINS = "allowedOrigins",
    RESOLUTION = "resolution"
}

/**
 * Settings of the organization: the browser origins its apps call CDS from and, with tolerant
 * matching, how confident the engine has to be before it acts. They sit in one form with one
 * update, each section separated from the next.
 *
 * Kept off the Customer Data Profile page deliberately: that page is where an operator goes
 * to find things, and these are tuned rarely and read even less often. Reaching them through
 * the gear follows how My Account settings are reached from the Applications list.
 */
const CustomerDataSettingsPage: FunctionComponent<IdentifiableComponentInterface> = ({
    ["data-componentid"]: componentId = "customer-data-settings-page"
}: IdentifiableComponentInterface): ReactElement => {

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const cdsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.customerDataService);
    const hasCDSUpdateScopes: boolean = useRequiredScopes(cdsFeatureConfig?.scopes?.update);

    const isFuzzyUnificationEnabled: boolean = useFuzzyUnificationEnabled();
    const isSubOrganization: boolean = useIsSubOrganization();

    const {
        data: cdsConfig,
        isLoading,
        mutate: mutateCDSConfig
    } = useCDSConfig(cdsFeatureConfig?.enabled ?? false);

    const [ sections, setSections ] =
        useState<Partial<Record<SettingsSection, CDSSettingsSectionStateInterface>>>({});
    // The page reloads the configuration once an update is saved, and each section is seeded from
    // it again, so the sections are read only until then: an edit made in between would be lost.
    const [ isSaving, setIsSaving ] = useState<boolean>(false);

    // A child organization uses the origins of its root organization, so only the thresholds
    // can be edited there.
    const isOriginsEditable: boolean = hasCDSUpdateScopes && !isSubOrganization;
    const isResolutionEditable: boolean = hasCDSUpdateScopes && isFuzzyUnificationEnabled;

    const handleSectionChange: (section: SettingsSection) => (state: CDSSettingsSectionStateInterface) => void =
        useCallback((section: SettingsSection) => (state: CDSSettingsSectionStateInterface): void => {
            setSections((previous: Partial<Record<SettingsSection, CDSSettingsSectionStateInterface>>) =>
                ({ ...previous, [ section ]: state }));
        }, []);

    // Only the sections on the page count: the thresholds are not shown without tolerant matching.
    const shownSections: CDSSettingsSectionStateInterface[] = useMemo(
        () => [
            sections[ SettingsSection.ALLOWED_ORIGINS ],
            isFuzzyUnificationEnabled ? sections[ SettingsSection.RESOLUTION ] : undefined
        ].filter(Boolean),
        [ sections, isFuzzyUnificationEnabled ]
    );

    const isDirty: boolean = shownSections.some((section: CDSSettingsSectionStateInterface) => section.isDirty);
    const hasError: boolean = shownSections.some((section: CDSSettingsSectionStateInterface) => section.hasError);

    const handleSave: () => Promise<void> = useCallback(async (): Promise<void> => {
        if (isSaving || !isDirty || hasError) {
            return;
        }

        // Only the changed sections are sent, so an update leaves the others as they are stored.
        const payload: CDSConfigUpdateRequest = shownSections
            .filter((section: CDSSettingsSectionStateInterface) => section.isDirty)
            .reduce((merged: CDSConfigUpdateRequest, section: CDSSettingsSectionStateInterface) =>
                ({ ...merged, ...section.payload }), {});

        setIsSaving(true);

        try {
            await updateCDSConfig(payload);

            mutateCDSConfig();

            dispatch(addAlert({
                description: t("customerDataService:resolutionSettings.notifications.saved.description"),
                level: AlertLevels.SUCCESS,
                message: t("customerDataService:resolutionSettings.notifications.saved.message")
            }));
        } catch (error) {
            // The server explains why it refused — a threshold pair or an origin it will not
            // accept, for instance. Showing only "could not be updated" leaves the operator with
            // nothing to act on.
            const serverReason: string =
                (error as { response?: { data?: { description?: string } } })?.response?.data?.description;

            dispatch(addAlert({
                description: serverReason
                    ?? t("customerDataService:resolutionSettings.notifications.saveFailed.description"),
                level: AlertLevels.ERROR,
                message: t("customerDataService:resolutionSettings.notifications.saveFailed.message")
            }));
        } finally {
            setIsSaving(false);
        }
    }, [ isSaving, isDirty, hasError, shownSections, mutateCDSConfig, dispatch, t ]);

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
                <Card data-componentid={ `${ componentId }-form` }>
                    <CardContent sx={ { display: "flex", flexDirection: "column", gap: 4, p: 4 } }>
                        <AllowedOriginsSettings
                            config={ cdsConfig }
                            onChange={ handleSectionChange(SettingsSection.ALLOWED_ORIGINS) }
                            isReadOnly={ !hasCDSUpdateScopes || isSaving }
                            isInherited={ isSubOrganization }
                            data-componentid={ `${ componentId }-allowed-origins` }
                        />
                        { /* The thresholds only matter with tolerant matching, so they stay behind its flag. */ }
                        { isFuzzyUnificationEnabled && (
                            <>
                                <Divider />
                                <ResolutionSettings
                                    config={ cdsConfig }
                                    onChange={ handleSectionChange(SettingsSection.RESOLUTION) }
                                    isReadOnly={ !hasCDSUpdateScopes || isSaving }
                                    data-componentid={ `${ componentId }-resolution-settings` }
                                />
                            </>
                        ) }
                        { (isOriginsEditable || isResolutionEditable) && (
                            <Box>
                                <Button
                                    variant="contained"
                                    onClick={ handleSave }
                                    disabled={ isSaving || !isDirty || hasError }
                                    data-componentid={ `${ componentId }-save` }
                                >
                                    { isSaving
                                        ? t("customerDataService:resolutionSettings.buttons.saving")
                                        : t("customerDataService:resolutionSettings.buttons.save") }
                                </Button>
                            </Box>
                        ) }
                    </CardContent>
                </Card>
            ) }
        </PageLayout>
    );
};

export default CustomerDataSettingsPage;
