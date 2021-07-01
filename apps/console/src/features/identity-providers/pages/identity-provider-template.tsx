/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { getRawDocumentation } from "@wso2is/core/api";
import { TestableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    EmptyPlaceholder,
    Heading,
    HelpPanelLayout,
    HelpPanelTabInterface,
    Hint,
    Markdown,
    PageHeader,
    PageLayout,
    SelectionCard,
    TemplateGrid
} from "@wso2is/react-components";
import get from "lodash-es/get";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { Divider, Grid } from "semantic-ui-react";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    DocPanelUICardInterface,
    HelpPanelUtils,
    PortalDocumentationStructureInterface,
    getEmptyPlaceholderIllustrations,
    getHelpPanelActionIcons,
    history
} from "../../core";
import { AuthenticatorCreateWizardFactory } from "../components/wizards";
import {
    getHelpPanelIcons,
    getIdPIcons,
    getIdPTemplateDocsIcons
} from "../configs";
import { IdentityProviderManagementConstants } from "../constants";
import {
    IdentityProviderTemplateCategoryInterface,
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateItemInterface,
    IdentityProviderTemplateLoadingStrategies
} from "../models";
import { setAvailableAuthenticatorsMeta } from "../store";
import { IdentityProviderManagementUtils } from "../utils";
import { IdentityProviderTemplateManagementUtils } from "../utils";

/**
 * Proptypes for the IDP template selection page component.
 */
type IdentityProviderTemplateSelectPagePropsInterface = TestableComponentInterface & RouteComponentProps;

/**
 * Choose the application template from this page.
 *
 * @param {IdentityProviderTemplateSelectPagePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
const IdentityProviderTemplateSelectPage: FunctionComponent<IdentityProviderTemplateSelectPagePropsInterface> = (
    props: IdentityProviderTemplateSelectPagePropsInterface
): ReactElement => {

    const {
        location,
        [ "data-testid" ]: testId
    } = props;

    const urlSearchParams: URLSearchParams = new URLSearchParams(location.search);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const availableAuthenticators = useSelector((state: AppState) => state.identityProvider.meta.authenticators);
    const helpPanelDocStructure: PortalDocumentationStructureInterface = useSelector(
        (state: AppState) => state.helpPanel.docStructure);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ templateType, setTemplateType ] = useState<string>(undefined);
    const [ categorizedTemplates, setCategorizedTemplates ] = useState<IdentityProviderTemplateCategoryInterface[]>([]);

    /**
     * Since we have grouped templates for identity providers,
     * we pick the {@link groupedTemplates}. If you want to see
     * where the state is populated check dispatch events in
     * {@link getIdentityProviderTemplates} method.
     */
    const identityProviderTemplates: IdentityProviderTemplateItemInterface[] = useSelector(
        (state: AppState) => state.identityProvider?.groupedTemplates
    );

    const [
        isIDPTemplateRequestLoading,
        setIDPTemplateRequestLoadingStatus
    ] = useState<boolean>(false);

    /**
     * We use this state to track which template is currently
     * selected. This value will get populated once the user clicks
     * on a selection card. With this new piece of state we pass
     * down both {@link type} (which is the templateId) and
     * template object itself to {@link AuthenticatorCreateWizardFactory}.
     * Also, see {@link handleTemplateSelection} to set states.
     */
    const [ selectedTemplate, setSelectedTemplate ] = useState<IdentityProviderTemplateInterface>(undefined);

    /**
     *  Get IDP templates.
     */
    useEffect(() => {
        if (identityProviderTemplates !== undefined) {
            return;
        }

        setIDPTemplateRequestLoadingStatus(true);

        const useAPI: boolean = config.ui.identityProviderTemplateLoadingStrategy ?
            config.ui.identityProviderTemplateLoadingStrategy === IdentityProviderTemplateLoadingStrategies.REMOTE :
            IdentityProviderManagementConstants.DEFAULT_IDP_TEMPLATE_LOADING_STRATEGY ===
            IdentityProviderTemplateLoadingStrategies.REMOTE;

        /**
         * With {@link skipGrouping} being {@code false} we say
         * we need to group the existing templates based on their
         * template-group.
         */
        const skipGrouping = false, sortTemplates = true;
        IdentityProviderTemplateManagementUtils
            .getIdentityProviderTemplates(useAPI, skipGrouping, sortTemplates)
            .finally(() => setIDPTemplateRequestLoadingStatus(false));

    }, [ identityProviderTemplates ]);

    /**
     * Categorize the IDP templates.
     */
    useEffect(() => {
        if (!identityProviderTemplates || !Array.isArray(identityProviderTemplates)
            || !(identityProviderTemplates.length > 0)) {
            return;
        }

        IdentityProviderTemplateManagementUtils.categorizeTemplates(identityProviderTemplates)
            .then((response: IdentityProviderTemplateCategoryInterface[]) => {
                setCategorizedTemplates(response);
            })
            .catch(() => {
                setCategorizedTemplates([]);
            });
    }, [ identityProviderTemplates ]);

    /**
     * Subscribe to the URS search params to check for IDP create wizard triggers.
     * ex: If the URL contains a search param `?open=8ea23303-49c0-4253-b81f-82c0fe6fb4a0`,
     * it'll open up the IDP create template with ID `8ea23303-49c0-4253-b81f-82c0fe6fb4a0`.
     */
    useEffect(() => {

        if (!urlSearchParams.get(IdentityProviderManagementConstants.IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY)) {
            return;
        }

        if (urlSearchParams.get(IdentityProviderManagementConstants.IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY)
            === IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE) {

            handleTemplateSelection(null, { id: IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE });
            return;
        }
    }, [ urlSearchParams.get(IdentityProviderManagementConstants.IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY) ]);

    /**
     * Handles back button click.
     */
    const handleBackButtonClick = (): void => {
        if (availableAuthenticators) {
            dispatch(setAvailableAuthenticatorsMeta(undefined));
        }
        history.push(AppConstants.getPaths().get("IDP"));
    };

    /**
     * Handles template selection.
     *
     * @param {React.SyntheticEvent} e - Click event.
     * @param {string} id - Id of the template.
     */
    const handleTemplateSelection = (e: SyntheticEvent, { id }: { id: string }): void => {
        /**
         * Find the matching template for the selected card.
         * if found then set the template to state.
         */
        const selectedTemplate = identityProviderTemplates.find(
            ({ id: templateId }) => (templateId === id)
        );
        if (selectedTemplate) {
            setSelectedTemplate(selectedTemplate);
        }
        setTemplateType(id);
    };

    /**
     * Generic function to render the template grid.
     *
     * @param {IdentityProviderTemplateInterface[]} templates - Set of templates to be displayed.
     * @param {object} additionalProps - Additional props for the `TemplateGrid` component.
     * @param {React.ReactElement} placeholder - Empty placeholder for the grid.
     * @param {IdentityProviderTemplateInterface[]} templatesOverrides - Template array which will get precedence.
     * @return {React.ReactElement}
     */
    const renderTemplateGrid = (templates: IdentityProviderTemplateInterface[],
                                additionalProps: object,
                                placeholder?: ReactElement,
                                templatesOverrides?: IdentityProviderTemplateInterface[]): ReactElement => {

        return (
            <TemplateGrid<any>
                className="idp-template-grid"
                type="idp"
                templates={
                    templatesOverrides
                        ? templatesOverrides
                        : templates
                }
                templateIcons={ getIdPIcons() }
                templateIconOptions={ {
                    as: "data-url",
                    fill: "primary"
                } }
                templateIconSize="x60"
                onTemplateSelect={ handleTemplateSelection }
                paginate={ true }
                paginationLimit={ 5 }
                paginationOptions={ {
                    showLessButtonLabel: t("common:showLess"),
                    showMoreButtonLabel: t("common:showMore")
                } }
                overlayOpacity={ 0.6 }
                renderDisabledItemsAsGrayscale={ false }
                emptyPlaceholder={ placeholder }
                { ...additionalProps }
            />
        );
    };

    /**
     * On successful IDP creation, navigates to the IDP views.
     *
     * @param {string} id - ID of the created IDP.
     */
    const handleSuccessfulIDPCreation = (id: string): void => {

        // If ID is present, navigate to the edit page of the created IDP.
        if (id) {
            history.push({
                pathname: AppConstants.getPaths().get("IDP_EDIT").replace(":id", id),
                search: IdentityProviderManagementConstants.NEW_IDP_URL_SEARCH_PARAM
            });

            return;
        }

        // Fallback to identity providers page, if id is not present.
        history.push(AppConstants.getPaths().get("IDP"));
    };

    return (
            <PageLayout
                title={ t("console:develop.pages.authenticationProviderTemplate.title") }
                contentTopMargin={ true }
                description={ t("console:develop.pages.authenticationProviderTemplate.subTitle") }
                backButton={ {
                    "data-testid": `${ testId }-page-back-button`,
                    onClick: handleBackButtonClick,
                    text: t("console:develop.pages.authenticationProviderTemplate.backButton")
                } }
                titleTextAlign="left"
                bottomMargin={ false }
                data-testid={ `${ testId }-page-layout` }
                showBottomDivider
            >
                {
                    (categorizedTemplates && !isIDPTemplateRequestLoading)
                        ? (
                            categorizedTemplates
                                .map((category: IdentityProviderTemplateCategoryInterface, index: number) => (
                                <div key={ index } className="templates quick-start-templates">
                                    {
                                        renderTemplateGrid(
                                            category.templates,
                                            {
                                                "data-testid": `${ category.id }-template-grid`,
                                                heading: category.displayName,
                                                showTagIcon: category.viewConfigs?.tags?.showTagIcon,
                                                showTags:  category.viewConfigs?.tags?.showTags,
                                                subHeading: category.description,
                                                tagsAs: category.viewConfigs?.tags?.as,
                                                tagsKey: category.viewConfigs?.tags?.tagsKey,
                                                tagsSectionTitle: category.viewConfigs?.tags?.sectionTitle
                                            },
                                            <EmptyPlaceholder
                                                image={ getEmptyPlaceholderIllustrations().newList }
                                                imageSize="tiny"
                                                title={ t("console:develop.features.templates.emptyPlaceholder.title") }
                                                subtitle={
                                                    [ t("console:develop.features.templates.emptyPlaceholder." +
                                                        "subtitles") ]
                                                }
                                                data-testid={
                                                    `${ testId }-quick-start-template-grid-empty-placeholder`
                                                }
                                            />
                                        )
                                    }
                                    <Divider hidden />
                                </div>
                            ))
                        )
                        : <ContentLoader dimmer/>
                }
                <Divider hidden/>
                <AuthenticatorCreateWizardFactory
                    open={ showWizard }
                    type={ templateType }
                    selectedTemplate={ selectedTemplate }
                    onIDPCreate={ handleSuccessfulIDPCreation }
                    onWizardClose={ () => {
                        setTemplateType(undefined);
                        setShowWizard(false);
                    } }
                />
            </PageLayout>
    );
};

/**
 * Default props for the component.
 */
IdentityProviderTemplateSelectPage.defaultProps = {
    "data-testid": "idp-templates"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default IdentityProviderTemplateSelectPage;
