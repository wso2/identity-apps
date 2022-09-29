/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { TestableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    DocumentationLink,
    EmptyPlaceholder,
    GridLayout,
    PageLayout,
    ResourceGrid,
    SearchWithFilterLabels,
    useDocumentation
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import orderBy from "lodash-es/orderBy";
import startCase from "lodash-es/startCase";
import union from "lodash-es/union";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { RouteComponentProps } from "react-router";
import { identityProviderConfig } from "../../../extensions/configs";
import {
    AppConstants,
    AppState,
    ConfigReducerStateInterface,
    EventPublisher,
    getEmptyPlaceholderIllustrations,
    history
} from "../../core";
import { AuthenticatorCreateWizardFactory } from "../components/wizards";
import { getIdPIcons } from "../configs";
import { IdentityProviderManagementConstants } from "../constants";
import {
    IdentityProviderTemplateCategoryInterface,
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateItemInterface,
    IdentityProviderTemplateLoadingStrategies
} from "../models";
import { setAvailableAuthenticatorsMeta } from "../store";
import { IdentityProviderManagementUtils, IdentityProviderTemplateManagementUtils } from "../utils";

/**
 * Proptypes for the IDP template selection page component.
 */
type IdentityProviderTemplateSelectPagePropsInterface = TestableComponentInterface & RouteComponentProps;

/**
 * Choose the application template from this page.
 *
 * @param props - Props injected to the component.
 *
 * @returns React.Element
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
    const { getLink } = useDocumentation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const availableAuthenticators = useSelector((state: AppState) => state.identityProvider.meta.authenticators);
    const identityProviderTemplates: IdentityProviderTemplateItemInterface[] = useSelector(
        (state: AppState) => state.identityProvider?.groupedTemplates);

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ templateType, setTemplateType ] = useState<string>(undefined);
    const [
        originalCategorizedTemplates,
        setOriginalCategorizedTemplates
    ] = useState<IdentityProviderTemplateCategoryInterface[]>([]);
    const [
        filteredCategorizedTemplates,
        setFilteredCategorizedTemplates
    ] = useState<IdentityProviderTemplateCategoryInterface[]>([]);
    const [
        isIDPTemplateRequestLoading,
        setIDPTemplateRequestLoadingStatus
    ] = useState<boolean>(false);
    const [ selectedTemplate, setSelectedTemplate ] = useState<IdentityProviderTemplateInterface>(undefined);
    const [ filterTags, setFilterTags ] = useState<string[]>([]);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ useNewConnectionsView, setUseNewConnectionsView ] = useState<boolean>(undefined);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Checks if the listing view defined in the config is the new connections view.
     */
    useEffect(() => {

        if (useNewConnectionsView !== undefined) {
            return;
        }

        setUseNewConnectionsView(identityProviderConfig.useNewConnectionsView);
    }, [ identityProviderConfig ]);

    /**
     * Update the internal filtered templates state when the original changes.
     */
    useEffect(() => {

        if (!originalCategorizedTemplates) {
            return;
        }
        setFilteredCategorizedTemplates(originalCategorizedTemplates);
    }, [ originalCategorizedTemplates ]);

    /**
     *  Get IDP templates.
     */
    useEffect(() => {

        if (identityProviderTemplates !== undefined) {
            return;
        }

        setIDPTemplateRequestLoadingStatus(true);

        const useAPI: boolean = config.ui.identityProviderTemplateLoadingStrategy
            ? config.ui.identityProviderTemplateLoadingStrategy === IdentityProviderTemplateLoadingStrategies.REMOTE
            : (IdentityProviderManagementConstants.DEFAULT_IDP_TEMPLATE_LOADING_STRATEGY ===
            IdentityProviderTemplateLoadingStrategies.REMOTE);

        /**
         * With {@link skipGrouping} being false we say
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

                let tags: string[] = [];

                response.filter((category: IdentityProviderTemplateCategoryInterface) => {
                    // Order the templates by pushing coming soon items to the end.
                    category.templates = orderBy(category.templates, [ "comingSoon" ], [ "desc" ]);

                    category.templates.filter((template: IdentityProviderTemplateInterface) => {
                        if (!(template?.tags && Array.isArray(template.tags) && template.tags.length > 0)) {
                            return;
                        }

                        if (template?.id === "organization-enterprise-idp" && !isOrganizationManagementEnabled) {
                            return;
                        }

                        tags = union(tags, template.tags);
                    });
                });

                setFilterTags(tags);
                setOriginalCategorizedTemplates(response);
            })
            .catch(() => {
                setOriginalCategorizedTemplates([]);
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

            handleTemplateSelection(null, IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE);

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
     * @param e - Click event of type React.SyntheticEvent.
     * @param id - Id of the template.
     */
    const handleTemplateSelection = (e: SyntheticEvent, id: string): void => {

        /**
         * Find the matching template for the selected card.
         * if found then set the template to state.
         */
        const selectedTemplate = identityProviderTemplates.find(({ id: templateId }) => (templateId === id));

        if (selectedTemplate) {
            setSelectedTemplate(selectedTemplate);
            eventPublisher.publish("connections-select-template", {
                type: selectedTemplate.templateId
            });
        }

        setTemplateType(id);
    };

    /**
     * On successful IDP creation, navigates to the IDP views.
     *
     * @param id - ID of the created IDP.
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

    /**
     * Get search results.
     *
     * @param query - Search query.
     * @param filterLabels - Array of filter labels.
     *
     * @returns IdentityProviderTemplateCategoryInterface[]
     */
    const getSearchResults = (query: string, filterLabels: string[]): IdentityProviderTemplateCategoryInterface[] => {

        /**
         * Checks if any of the filters are matching.
         * @param template - Template object.
         * @returns boolean
         */
        const isFiltersMatched = (template: IdentityProviderTemplateInterface): boolean => {

            if (isEmpty(filterLabels)) {
                return true;
            }

            return template.tags
                .some((selectedLabel) => filterLabels.includes(selectedLabel));
        };
        
        const templatesClone: IdentityProviderTemplateCategoryInterface[] = cloneDeep(originalCategorizedTemplates);

        templatesClone.map((category: IdentityProviderTemplateCategoryInterface) => {

            category.templates = category.templates.filter((template: IdentityProviderTemplateInterface) => {
                if (!query) {
                    return isFiltersMatched(template);
                }

                const name: string = template.name.toLocaleLowerCase();

                if (name.includes(query)
                    || template.tags.some((tag) => tag.toLocaleLowerCase().includes(query)
                        || startCase(tag).toLocaleLowerCase().includes(query))) {

                    return isFiltersMatched(template);
                }
            });
        });

        return templatesClone;
    };

    /**
     * Handles the Connection Type Search input onchange.
     *
     * @param query - Search query.
     * @param selectedFilters - Array of selected filters.
     */
    const handleConnectionTypeSearch = (query: string, selectedFilters: string[]): void => {

        // Update the internal state to manage placeholders etc.
        setSearchQuery(query);
        // Filter out the templates.
        setFilteredCategorizedTemplates(getSearchResults(query.toLocaleLowerCase(), selectedFilters));
    };

    /**
     * Handles Connection Type filter.
     *
     * @param query - Search query.
     * @param selectedFilters - Array of the selected filters.
     */
    const handleConnectionTypeFilter = (query: string, selectedFilters: string[]): void => {

        // Update the internal state to manage placeholders etc.
        setSearchQuery(query);
        // Filter out the templates.
        setFilteredCategorizedTemplates(getSearchResults(query, selectedFilters));
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns React.ReactElement
     */
    const showPlaceholders = (list: any[]): ReactElement => {

        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:develop.placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("console:develop.placeholders.emptySearchResult.subtitles.0", { query: searchQuery }),
                        t("console:develop.placeholders.emptySearchResult.subtitles.1")
                    ] }
                    data-testid={ `${ testId }-empty-search-placeholder` }
                />
            );
        }

        // Edge case, templates will never be empty.
        if (list.length === 0) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={
                        t("console:develop.features.authenticationProvider.placeHolders.emptyConnectionTypeList.title")
                    }
                    subtitle={ [
                        t("console:develop.features.authenticationProvider.placeHolders.emptyConnectionTypeList" +
                            ".subtitles.0"),
                        t("console:develop.features.authenticationProvider.placeHolders.emptyConnectionTypeList" +
                            ".subtitles.1")
                    ] }
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <PageLayout
            pageTitle={ "Create New Connection" }
            isLoading={ useNewConnectionsView === undefined }
            title={
                useNewConnectionsView
                    ? t("console:develop.pages.authenticationProviderTemplate.title")
                    : t("console:develop.pages.idpTemplate.title")
            }
            contentTopMargin={ true }
            description={
                useNewConnectionsView
                    ?   (<>
                        { t("console:develop.pages.authenticationProviderTemplate.subTitle") }
                        <DocumentationLink
                            link={ getLink("develop.connections.newConnection.learnMore") }
                        >
                            { t("common:learnMore") }
                        </DocumentationLink>
                    </>)
                    :   t("console:develop.pages.idpTemplate.subTitle")
            }
            backButton={ {
                "data-testid": `${ testId }-page-back-button`,
                onClick: handleBackButtonClick,
                text: useNewConnectionsView
                    ? t("console:develop.pages.authenticationProviderTemplate.backButton")
                    : t("console:develop.pages.idpTemplate.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-testid={ `${ testId }-page-layout` }
            showBottomDivider
        >
            <GridLayout
                search={ (
                    <SearchWithFilterLabels
                        placeholder={ t("console:develop.pages.authenticationProviderTemplate.search.placeholder") }
                        onSearch={ handleConnectionTypeSearch }
                        onFilter={ handleConnectionTypeFilter }
                        filterLabels={ filterTags }
                    />
                ) }
                isLoading={ useNewConnectionsView === undefined || isIDPTemplateRequestLoading }
            >
                {
                    (filteredCategorizedTemplates && !isIDPTemplateRequestLoading)
                        ? (
                            filteredCategorizedTemplates
                                .map((category: IdentityProviderTemplateCategoryInterface, index: number) => (
                                    <ResourceGrid
                                        key={ index }
                                        isEmpty={
                                            !(category?.templates
                                                && Array.isArray(category.templates)
                                                && category.templates.length > 0)
                                        }
                                        emptyPlaceholder={ showPlaceholders(category.templates) }
                                    >
                                        {
                                            category.templates.map((
                                                template: IdentityProviderTemplateInterface,
                                                templateIndex: number
                                            ) => {
                                                const isOrgIdp = template.templateId === "organization-enterprise-idp";

                                                if (isOrgIdp && !isOrganizationManagementEnabled) {
                                                    return null;
                                                }

                                                return (
                                                    <ResourceGrid.Card
                                                        key={ templateIndex }
                                                        resourceName={
                                                            template.name === "Enterprise" ? "Standard-Based IdP" 
                                                                : template.name
                                                        }
                                                        isResourceComingSoon={ template.comingSoon }
                                                        disabled={ template.disabled }
                                                        comingSoonRibbonLabel={ t("common:comingSoon") }
                                                        resourceDescription={ template.description }
                                                        resourceImage={
                                                            IdentityProviderManagementUtils
                                                                .resolveTemplateImage(template.image, getIdPIcons())
                                                        }
                                                        tags={ template.tags }
                                                        onClick={ (e: SyntheticEvent) => {
                                                            handleTemplateSelection(e, template.id);
                                                        } }
                                                        showTooltips={ { description: true, header: false } }
                                                        data-testid={ `${ testId }-${ template.name }` }
                                                    />
                                                );
                                            })
                                        }
                                    </ResourceGrid>
                                ))
                        )
                        : <ContentLoader dimmer/>
                }
            </GridLayout>
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
