/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Alert from "@oxygen-ui/react/Alert";
import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Paper from "@oxygen-ui/react/Paper";
import TextField from "@oxygen-ui/react/TextField";
import { BuildingIcon, TilesIcon } from "@oxygen-ui/react-icons";
import AIBrandingPreferenceProvider from "@wso2is/admin.branding.ai.v1/providers/ai-branding-preference-provider";
import { AppConstants, AppState, history } from "@wso2is/admin.core.v1";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, PageLayout, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import BrandingCore from "./branding-core";
import { useApplicationList } from "../../admin.applications.v1/api";
import { ApplicationManagementConstants } from "../../admin.applications.v1/constants";
import { ApplicationListItemInterface } from "../../admin.applications.v1/models";
import { BrandingModes, BrandingPreferencesConstants } from "../constants";
import useBrandingPreference from "../hooks/use-branding-preference";
import "./branding-page-layout.scss";

type BrandingPageLayoutInterface = IdentifiableComponentInterface;

const BrandingPageLayout: FunctionComponent<BrandingPageLayoutInterface> = (
    props: BrandingPageLayoutInterface
): ReactElement => {

    const {
        ["data-componentid"]: componentId
    } = props;

    const { getLink } = useDocumentation();

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const {
        brandingMode,
        setBrandingMode,
        selectedApplication,
        setSelectedApplication
    } = useBrandingPreference();

    const {
        data: applicationList,
        isLoading: isApplicationListFetchRequestLoading,
        error: applicationListFetchRequestError
    } = useApplicationList(null, null, null, null, brandingMode === BrandingModes.APPLICATION);

    const brandingDisabledFeatures: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.features?.branding?.disabledFeatures);

    const [ isBrandingAppsRedirect, setIsBrandingAppsRedirect ] = useState<boolean>(false);

    /**
    * Fetch the identity provider id & name when calling the app edit through connected apps
    */
    useEffect(() => {
        if (brandingDisabledFeatures.includes(BrandingPreferencesConstants.APP_WISE_BRANDING_FEATURE_TAG) ||
            !history?.location?.state) {
            return;
        }

        setIsBrandingAppsRedirect(true);
        setBrandingMode(BrandingModes.APPLICATION);
        setSelectedApplication(history.location.state as string);
    }, [ history?.location?.state ]);

    /**
     * Handles the application list fetch request error.
     */
    useEffect(() => {
        if (!applicationListFetchRequestError) {
            return;
        }

        if (applicationListFetchRequestError.response
            && applicationListFetchRequestError.response.data
            && applicationListFetchRequestError.response.data.description) {
            dispatch(addAlert({
                description: applicationListFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications.fetchApplications" +
                    ".error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchApplications" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications.fetchApplications." +
                "genericError.message")
        }));
    }, [ applicationListFetchRequestError ]);

    /**
     * Handles the branding mode change from application/organization branding.
     *
     * @param event - Click event.
     * @param mode - Branding mode.
     */
    const handleBrandingModeChange = (
        event: React.MouseEvent<HTMLElement>,
        mode: BrandingModes
    ) => {
        setBrandingMode(mode);
    };

    const resolveBrandingTitle = (): string => {
        if (brandingDisabledFeatures.includes(BrandingPreferencesConstants.APP_WISE_BRANDING_FEATURE_TAG)) {
            return t("extensions:develop.branding.pageHeader.title");
        }

        if (brandingMode === BrandingModes.APPLICATION) {
            return t("extensions:develop.branding.pageHeader.applicationBrandingtitle");
        }

        if (brandingMode === BrandingModes.ORGANIZATION) {
            return t("extensions:develop.branding.pageHeader.organizationBrandingtitle");
        }

        return t("extensions:develop.branding.pageHeader.title");
    };

    const resolveBrandingDescription = (): string => {
        if (brandingDisabledFeatures.includes(BrandingPreferencesConstants.APP_WISE_BRANDING_FEATURE_TAG)) {
            return t("extensions:develop.branding.pageHeader.description");
        }

        if (brandingMode === BrandingModes.APPLICATION) {
            return t("extensions:develop.branding.pageHeader.applicationBrandingDescription");
        }

        return t("extensions:develop.branding.pageHeader.description");
    };

    return (
        <PageLayout
            pageTitle={ resolveBrandingTitle() }
            bottomMargin={ false }
            backButton={ isBrandingAppsRedirect && {
                "data-componentid": `${componentId}-page-back-button`,
                onClick: () => history.push(AppConstants.getPaths().get("APPLICATION_EDIT")
                    .replace(":id", selectedApplication)),
                text: t("extensions:develop.branding.pageHeader.backButton")
            } }
            title={ (
                <div className="title-container">
                    <div className="title-container-heading">
                        { resolveBrandingTitle() }
                    </div>
                    {
                        !brandingDisabledFeatures.includes(
                            BrandingPreferencesConstants.APP_WISE_BRANDING_FEATURE_TAG) && (
                            <div className="branding-mode-container">
                                <Paper
                                    className="branding-mode-toggle-container"
                                    elevation={ 0 }
                                >
                                    <ToggleButtonGroup
                                        exclusive
                                        onChange={ handleBrandingModeChange }
                                        size="small"
                                        value={ brandingMode }
                                    >
                                        <ToggleButton value={ BrandingModes.ORGANIZATION }>
                                            <BuildingIcon
                                                className="toggle-button-icon"
                                                size={ 14 }
                                            />
                                            { t("extensions:develop.branding.pageHeader.organization") }
                                        </ToggleButton>
                                        <ToggleButton value={ BrandingModes.APPLICATION }>
                                            <TilesIcon
                                                className="toggle-button-icon"
                                                size={ 14 }
                                            />
                                            { t("extensions:develop.branding.pageHeader.application") }
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                </Paper>
                                { brandingMode === BrandingModes.APPLICATION && (
                                    <Autocomplete
                                        disablePortal
                                        clearIcon={ null }
                                        fullWidth
                                        options={ applicationList?.applications ?? [] }
                                        value={ applicationList?.applications?.find(
                                            (app: ApplicationListItemInterface) => app.id === selectedApplication) }
                                        onChange={ (
                                            event: SyntheticEvent<Element, Event>,
                                            application: ApplicationListItemInterface
                                        ) => {
                                            setSelectedApplication(application?.id);
                                        } }
                                        isOptionEqualToValue={ (
                                            option: ApplicationListItemInterface,
                                            value: ApplicationListItemInterface
                                        ) =>
                                            option.id === value.id
                                        }
                                        filterOptions={ (options: ApplicationListItemInterface[]) =>
                                            options.filter((application: ApplicationListItemInterface) =>
                                                !ApplicationManagementConstants.SYSTEM_APPS.includes(
                                                    application?.name) &&
                                                !ApplicationManagementConstants.DEFAULT_APPS.includes(
                                                    application?.name)
                                            )
                                        }
                                        loading={ isApplicationListFetchRequestLoading }
                                        getOptionLabel={ (application: ApplicationListItemInterface) =>
                                            application.name }
                                        renderInput={ (params: AutocompleteRenderInputParams) => (
                                            <TextField
                                                { ...params }
                                                size="small"
                                                placeholder={
                                                    t("extensions:develop.branding.pageHeader.selectApplication") }
                                                margin="none"
                                            />
                                        ) }
                                    />
                                ) }
                            </div>
                        )
                    }
                </div>
            ) }
            description={ (
                <div className="with-label">
                    { resolveBrandingDescription() }
                    <DocumentationLink
                        link={ getLink("develop.branding.learnMore") }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </div>
            ) }
            data-componentid={ `${ componentId }-layout` }
            className="branding-page"
        >
            {
                brandingMode === BrandingModes.APPLICATION && !selectedApplication && (
                    <Alert
                        severity="warning"
                        sx={ { marginBottom: 2 } }
                    >
                        { t("extensions:develop.branding.pageHeader.applicationListWarning") }
                    </Alert>
                )
            }
            <AIBrandingPreferenceProvider>
                <BrandingCore />
            </AIBrandingPreferenceProvider>
        </PageLayout>
    );
};

/**
 * Default props for the component.
 */
BrandingPageLayout.defaultProps = {
    "data-componentid": "branding-page"
};

export default BrandingPageLayout;
