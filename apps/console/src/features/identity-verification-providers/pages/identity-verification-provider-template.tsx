/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader, EmptyPlaceholder,
    GridLayout,
    PageLayout,
    ResourceGrid,
    SearchWithFilterLabels
} from "@wso2is/react-components";
import cloneDeep from "lodash-es/cloneDeep";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { RouteComponentProps } from "react-router";
import {
    AppConstants,
    EventPublisher,
    getEmptyPlaceholderIllustrations,
    history
} from "../../core";
import { getIdPIcons } from "../../identity-providers/configs";
import { IdentityProviderManagementConstants } from "../../identity-providers/constants";
import { IdentityProviderManagementUtils } from "../../identity-providers/utils";
import { useIDVPTemplateTypeMetadata } from "../api/ui-metadata";
import { IdvpCreateWizardFactory } from "../components/wizards/idvp-create-wizard-factory"
import { IDVPTypeMetadataInterface } from "../models/ui-metadata";
import { handleIDVPTemplateRequestError } from "../utils";

/**
 * Proptypes for the IDVP template selection page component.
 */
type IDVPTemplateSelectPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

/**
 * Choose the identity verification provider template from this page.
 *
 * @param props - Props injected to the component.
 *
 * @returns React.Element
 */
const IdentityVerificationProviderTemplateSelectPage: FunctionComponent<IDVPTemplateSelectPagePropsInterface> = (
    props: IDVPTemplateSelectPagePropsInterface
): ReactElement => {

    const {
        location,
        [ "data-componentid" ]: componentID
    } = props;

    const urlSearchParams: URLSearchParams = new URLSearchParams(location.search);

    const { t } = useTranslation();

    const [ showWizard, setShowWizard ] = useState<boolean>(false);
    const [ templateType, setTemplateType ] = useState<string>(undefined);
    const [ tags, setTags ] = useState<Set<string>>(new Set());
    const [
        filteredCategorizedTemplates,
        setFilteredCategorizedTemplates
    ] = useState<IDVPTypeMetadataInterface[]>([]);
    const [ selectedTemplate, setSelectedTemplate ] = useState<IDVPTypeMetadataInterface>(undefined);
    const [ searchQuery, setSearchQuery ] = useState<string>("");

    const eventPublisher: EventPublisher = EventPublisher.getInstance();
    const {
        data: idvpTemplateTypes,
        isLoading: isIDVPTemplateTypeRequestLoading,
        error: idvpTemplateTypeRequestError
    } = useIDVPTemplateTypeMetadata();


    /**
     * Set initial metadata for identity provider types.
     */
    useEffect(() => {

        if (!idvpTemplateTypes || !Array.isArray(idvpTemplateTypes) || !(idvpTemplateTypes.length > 0)) {
            return;
        }

        setFilteredCategorizedTemplates(idvpTemplateTypes);
        const tags: Set<string> = new Set();

        idvpTemplateTypes.forEach((template: IDVPTypeMetadataInterface) => {
            template.tags?.forEach((tag: string) => {
                tags.add(tag);
            });
        });
        setTags(tags);
    }, [ idvpTemplateTypes ]);

    /**
     * Handles errors with IDP template type request.
     */
    useEffect(() => {
        if(!idvpTemplateTypeRequestError){
            return;
        }
        handleIDVPTemplateRequestError(idvpTemplateTypeRequestError);
    }, [ idvpTemplateTypeRequestError ]);

    // /**
    //  * Subscribe to the URS search params to check for IDP create wizard triggers.
    //  * ex: If the URL contains a search param `?open=8ea23303-49c0-4253-b81f-82c0fe6fb4a0`,
    //  * it'll open up the IDP create template with ID `8ea23303-49c0-4253-b81f-82c0fe6fb4a0`.
    //  */
    // useEffect(() => {
    //
    //     if (!urlSearchParams.get(IdentityProviderManagementConstants.IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY)) {
    //         return;
    //     }
    //
    //     if (urlSearchParams.get(IdentityProviderManagementConstants.IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY)
    //         === IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE) {
    //
    //         handleTemplateSelection(null, IdentityProviderManagementConstants.IDP_TEMPLATE_IDS.GOOGLE);
    //
    //         return;
    //     }
    // }, [ urlSearchParams.get(IdentityProviderManagementConstants.IDP_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY) ]);

    /**
     * Handles back button click.
     */
    const handleBackButtonClick = (): void => {

        history.push(AppConstants.getPaths().get("IDVP"));
    };

    /**
     * Handles template selection.
     *
     * @param e - Click event of type React.SyntheticEvent.
     * @param selectedTemplate - Id of the template.
     */
    const handleTemplateSelection = (e: SyntheticEvent, selectedTemplate: IDVPTypeMetadataInterface): void => {

        /**
         * Find the matching template for the selected card.
         * if found then set the template to state.
         */
        if (selectedTemplate) {
            setSelectedTemplate(selectedTemplate);
        }

        setTemplateType(selectedTemplate.id);
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
                pathname: AppConstants.getPaths().get("IDVP_EDIT").replace(":id", id),
                search: IdentityProviderManagementConstants.NEW_IDP_URL_SEARCH_PARAM
            });

            return;
        }

        // Fallback to identity providers page, if id is not present.
        history.push(AppConstants.getPaths().get("IDVP"));
    };

    /**
     * Get search results.
     *
     * @param query - Search query.
     * @param selectedFilters - Selected filters.
     * @returns IDVPTypesMetadataInterface[]
     */
    const getSearchResults = (query: string, selectedFilters: string[]): IDVPTypeMetadataInterface[] => {

        const templatesClone: IDVPTypeMetadataInterface[] = cloneDeep(idvpTemplateTypes);

        return templatesClone.filter((idvpType: IDVPTypeMetadataInterface) => {
            let isSearchQueryMatched: boolean = true;
            let isFilterMatched: boolean = true;

            if (query) {
                isSearchQueryMatched = idvpType.name.toLocaleLowerCase().includes(query);
            }

            if(selectedFilters.length > 0) {
                isFilterMatched = selectedFilters.some((filter:string) => idvpType.tags.includes(filter));
            }

            return isSearchQueryMatched && isFilterMatched;
        });

    };

    /**
     * Handles the Search input change for IDVP types.
     *
     * @param query - Search query.
     * @param selectedFilters - Selected filters.
     */
    const handleIDVPTypeSearch = (query: string, selectedFilters: string[]): void => {

        // Update the internal state to manage placeholders etc.
        setSearchQuery(query);
        // Filter out the templates.
        setFilteredCategorizedTemplates(getSearchResults(query.toLocaleLowerCase(), selectedFilters));
    };

    /**
     * Handles the IDVP type filtering using tags.
     *
     * @param query - Search query.
     * @param selectedFilters - Selected filters.
     */
    const handleIDVPTypeFilter = (query: string, selectedFilters: string[]): void => {

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
                    data-componentid={ `${ componentID }-empty-search-placeholder` }
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
                        t("console:develop.features.idvp.placeholders.emptyIDVPTypeList.title")
                    }
                    subtitle={ [
                        t("console:develop.features.idvp.placeholders.emptyIDVPTypeList.subtitles.0"),
                        t("console:develop.features.idvp.placeholders.emptyIDVPTypeList.subtitles.1")
                    ] }
                    data-componentid={ `${ componentID }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <PageLayout
            pageTitle={ "Create a New Identity Verification Provider" }
            isLoading={ isIDVPTemplateTypeRequestLoading }
            title={ t("console:develop.pages.idvpTemplate.title") }
            contentTopMargin={ true }
            description={ t("console:develop.pages.idvpTemplate.subTitle") }
            backButton={ {
                "data-componentid": `${ componentID }-page-back-button`,
                onClick: handleBackButtonClick,
                text: t("console:develop.pages.idvpTemplate.backButton")
            } }
            titleTextAlign="left"
            bottomMargin={ false }
            data-componentid={ `${ componentID }-page-layout` }
            showBottomDivider
        >
            <GridLayout
                search={ (
                    <SearchWithFilterLabels
                        placeholder={ t("console:develop.pages.idvpTemplate.search.placeholder") }
                        onSearch={ handleIDVPTypeSearch }
                        onFilter={ handleIDVPTypeFilter }
                        filterLabels={ [ ...tags ] }
                        disableSearchFilterDropdown={ true }
                    />
                ) }
                isLoading={ isIDVPTemplateTypeRequestLoading }
            >
                {
                    (!isIDVPTemplateTypeRequestLoading && filteredCategorizedTemplates)
                        ? (
                            <ResourceGrid
                                isEmpty={ !(filteredCategorizedTemplates && filteredCategorizedTemplates.length > 0) }
                                emptyPlaceholder={ showPlaceholders(filteredCategorizedTemplates) }
                            >
                                {
                                    filteredCategorizedTemplates.map((
                                        template: IDVPTypeMetadataInterface,
                                        templateIndex: number
                                    ) => {

                                        return (
                                            <ResourceGrid.Card
                                                key={ templateIndex }
                                                resourceName={
                                                    template.name === "Enterprise" ? "Standard-Based IdP"
                                                        : template.name
                                                }
                                                comingSoonRibbonLabel={ t("common:comingSoon") }
                                                resourceDescription={ template.description }
                                                resourceImage={
                                                    IdentityProviderManagementUtils
                                                        .resolveTemplateImage(template.image, getIdPIcons())
                                                }
                                                tags={ template.tags }
                                                onClick={ (e: SyntheticEvent) => {
                                                    handleTemplateSelection(e, template);
                                                } }
                                                showTooltips={ { description: true, header: false } }
                                                data-componentid={ `${ componentID }-${ template.name }` }
                                            />
                                        );
                                    })
                                }
                            </ResourceGrid>
                        )
                        : <ContentLoader dimmer/>
                }
            </GridLayout>
            <IdvpCreateWizardFactory
                showWizard={ showWizard }
                type={ templateType }
                selectedTemplateType={ selectedTemplate }
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
IdentityVerificationProviderTemplateSelectPage.defaultProps = {
    "data-componentid": "idvp-templates"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default IdentityVerificationProviderTemplateSelectPage;
