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
import Autocomplete, { AutocompleteRenderInputParams } from "@oxygen-ui/react/Autocomplete";
import Chip from "@oxygen-ui/react/Chip";
import Paper from "@oxygen-ui/react/Paper";
import TextField from "@oxygen-ui/react/TextField";
import { BuildingIcon, TilesIcon } from "@oxygen-ui/react-icons";
import BrandingAIBanner from "@wso2is/admin.branding.ai.v1/components/branding-ai-banner";
import useAIBrandingPreference from "@wso2is/admin.branding.ai.v1/hooks/use-ai-branding-preference";
import { AppConstants, AppState, history } from "@wso2is/admin.core.v1";
import { FeatureStatusLabel } from "@wso2is/admin.feature-gate.v1/models/feature-status";
import { useGetCurrentOrganizationType } from "@wso2is/admin.organizations.v1/hooks/use-get-organization-type";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { DocumentationLink, PageLayout, useDocumentation } from "@wso2is/react-components";
import { AnimatePresence, LayoutGroup, Variants, motion } from "framer-motion";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import BrandingCore from "./branding-core";
import { useApplicationList } from "../../admin.applications.v1/api/application";
import { ApplicationManagementConstants } from "../../admin.applications.v1/constants/application-management";
import { ApplicationListItemInterface } from "../../admin.applications.v1/models/application";
import { BrandingModes, BrandingPreferencesConstants } from "../constants";
import { AI_BRANDING_FEATURE_ID } from "../constants/ai-branding-constants";
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

    const { isSubOrganization } = useGetCurrentOrganizationType();

    const {
        setMergedBrandingPreference
    } = useAIBrandingPreference();

    const {
        brandingMode,
        setBrandingMode,
        selectedApplication,
        setSelectedApplication,
        activeTab,
        updateActiveTab
    } = useBrandingPreference();

    const {
        data: applicationList,
        isLoading: isApplicationListFetchRequestLoading,
        error: applicationListFetchRequestError
    } = useApplicationList("templateId", null, null, null, brandingMode === BrandingModes.APPLICATION);

    const brandingDisabledFeatures: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.features?.branding?.disabledFeatures);

    const [ isBrandingAppsRedirect, setIsBrandingAppsRedirect ] = useState<boolean>(false);

    const animationVariants: Variants = {
        enter: {
            opacity: 0,
            transition: {
                duration: 0.1
            },
            x: 20
        },
        exit: {
            opacity: 0,
            transition: {
                duration: 0.1
            },
            x: -20
        },
        in: {
            opacity: 1,
            transition: {
                delay: 0.2,
                duration: 0.1
            },
            x: 0
        }
    };

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

        // Check if application ID from state is available in the application list.
        if (applicationList?.applications?.find((app: ApplicationListItemInterface) =>
            app.id === history.location.state)) {

            setSelectedApplication(history.location.state as string);

            return;
        }
    }, [ history?.location?.state, applicationList ]);

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
        if (!mode) return;

        setBrandingMode(mode);
        setMergedBrandingPreference(null);
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
                text: t("extensions:develop.branding.pageHeader.backButtonText")
            } }
            title={ (
                <div className="title-container">
                    <div className="title-container-heading">
                        <AnimatePresence >
                            <motion.div
                                className="content"
                                key={ resolveBrandingTitle() }
                                initial="enter"
                                animate="in"
                                exit="exit"
                                transition={ {
                                    damping: 50,
                                    stiffness: 400,
                                    type: "spring"
                                } }
                                variants={ animationVariants }>
                                <h1>
                                    { resolveBrandingTitle() }
                                    {
                                        brandingMode === BrandingModes.APPLICATION && (
                                            <Chip
                                                size="small"
                                                label={ t(FeatureStatusLabel.BETA) }
                                                className="oxygen-chip-beta mb-1 ml-2"
                                            />
                                        )
                                    }
                                </h1>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    {
                        !brandingDisabledFeatures.includes(
                            BrandingPreferencesConstants.APP_WISE_BRANDING_FEATURE_TAG) && (
                            <div className="branding-mode-container">
                                <LayoutGroup>
                                    <motion.div
                                        initial="enter"
                                        animate="in"
                                        exit="exit"
                                        transition={ {
                                            damping: 50,
                                            stiffness: 400,
                                            type: "spring"
                                        } }
                                        variants={ animationVariants }
                                        layout
                                    >
                                        <Paper
                                            className="branding-mode-toggle-container"
                                            elevation={ 0 }
                                        >
                                            <ToggleButtonGroup
                                                exclusive
                                                onChange={ handleBrandingModeChange }
                                                size="small"
                                                value={ brandingMode }
                                                disabled={ isBrandingAppsRedirect }
                                            >
                                                <ToggleButton
                                                    data-componentid={ `${componentId}-organization-mode-button` }
                                                    value={ BrandingModes.ORGANIZATION }
                                                >
                                                    <BuildingIcon
                                                        className="toggle-button-icon"
                                                        size={ 14 }
                                                    />
                                                    { t("extensions:develop.branding.pageHeader.organization") }
                                                </ToggleButton>
                                                <ToggleButton
                                                    data-componentid={ `${componentId}-application-mode-button` }
                                                    value={ BrandingModes.APPLICATION }
                                                    onClick={ () => {
                                                        activeTab === BrandingPreferencesConstants.TABS.TEXT_TAB_ID &&
                                                        updateActiveTab(
                                                            BrandingPreferencesConstants.TABS.GENERAL_TAB_ID
                                                        );
                                                    } }
                                                >
                                                    <TilesIcon
                                                        className="toggle-button-icon"
                                                        size={ 14 }
                                                    />
                                                    { t("extensions:develop.branding.pageHeader.application") }
                                                </ToggleButton>
                                            </ToggleButtonGroup>
                                        </Paper>
                                    </motion.div>
                                    { brandingMode === BrandingModes.APPLICATION && (
                                        <motion.div
                                            initial="enter"
                                            animate="in"
                                            exit="exit"
                                            transition={ {
                                                damping: 50,
                                                stiffness: 400,
                                                type: "spring"
                                            } }
                                            variants={ animationVariants }
                                            layout
                                        >
                                            <Autocomplete
                                                data-componentId={ `${componentId}-application-dropdown` }
                                                sx={ { width: 190 } }
                                                readOnly={ isBrandingAppsRedirect }
                                                clearIcon={ null }
                                                options={ applicationList?.applications ?? [] }
                                                value={ applicationList?.applications?.find(
                                                    (app: ApplicationListItemInterface) =>
                                                        app.id === selectedApplication) }
                                                onChange={ (
                                                    event: SyntheticEvent<Element, Event>,
                                                    application: ApplicationListItemInterface
                                                ) => {
                                                    setSelectedApplication(application.id);
                                                    setMergedBrandingPreference(null);
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
                                                            application?.name) &&
                                                        !(application?.templateId === ApplicationManagementConstants.
                                                            M2M_APP_TEMPLATE_ID)
                                                    )
                                                }
                                                loading={ isApplicationListFetchRequestLoading }
                                                getOptionLabel={ (application: ApplicationListItemInterface) =>
                                                    application.name }
                                                renderInput={ (params: AutocompleteRenderInputParams) => (
                                                    <TextField
                                                        { ...params }
                                                        size="small"
                                                        placeholder={ isBrandingAppsRedirect
                                                            ? applicationList?.applications?.find(
                                                                (app: ApplicationListItemInterface) =>
                                                                    app.id === selectedApplication)?.name
                                                            : t("extensions:develop.branding.pageHeader." +
                                                                "selectApplication") }
                                                        margin="none"
                                                        value={ selectedApplication }
                                                    />
                                                ) }
                                            />
                                        </motion.div>
                                    ) }
                                </LayoutGroup>
                            </div>
                        )
                    }
                </div>
            ) }
            description={ (
                <div className="with-label">
                    <AnimatePresence >
                        <motion.div
                            className="content"
                            key={ resolveBrandingTitle() }
                            initial="enter"
                            animate="in"
                            exit="exit"
                            transition={ {
                                damping: 50,
                                stiffness: 400,
                                type: "spring"
                            } }
                            variants={ animationVariants }>
                            { resolveBrandingDescription() }
                            <DocumentationLink
                                link={ getLink("develop.branding.learnMore") }
                            >
                                { t("common:learnMore") }
                            </DocumentationLink>
                        </motion.div>
                    </AnimatePresence>
                </div>
            ) }
            data-componentid={ `${ componentId }-layout` }
            className="branding-page"
        >
            <LayoutGroup>
                {
                    !brandingDisabledFeatures?.includes(AI_BRANDING_FEATURE_ID) &&
                    !isSubOrganization() && (
                        <BrandingAIBanner
                            readonly={ brandingMode === BrandingModes.APPLICATION && !selectedApplication }
                        />
                    )
                }
                <BrandingCore />
            </LayoutGroup>
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
