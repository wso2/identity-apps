/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
    getEmptyPlaceholderIllustrations,
    history
} from "../../core";
import { useIDVPTemplateTypeMetadataList } from "../api";
import { IdvpCreateWizard } from "../components/wizards/idvp-create-wizard";
import { IdentityVerificationProviderConstants } from "../constants";
import { IDVPTypeMetadataInterface } from "../models";
import { handleIDVPTemplateRequestError, resolveIDVPImage } from "../utils";

/**
 * Proptypes for the IDVP template selection page component.
 */
type IDVPTemplateSelectPagePropsInterface = IdentifiableComponentInterface & RouteComponentProps;

/**
 * Choose the identity verification provider template from this page.
 *
 * @param props - Props injected to the component.
 * @returns IDVP template selection page.
 */
const IdentityVerificationProviderTemplateSelectPage: FunctionComponent<IDVPTemplateSelectPagePropsInterface> = (
    props: IDVPTemplateSelectPagePropsInterface
): ReactElement => {

    const {
        [ "data-componentid" ]: componentID
    } = props;

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

    const {
        data: idvpTemplateTypes,
        isLoading: isIDVPTemplateTypeRequestLoading,
        error: idvpTemplateTypeRequestError
    } = useIDVPTemplateTypeMetadataList();

    /**
     * Set initial metadata for identity verification provider types.
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
     * Handles errors with IDVP template type request.
     */
    useEffect(() => {
        if(!idvpTemplateTypeRequestError){
            return;
        }
        handleIDVPTemplateRequestError(idvpTemplateTypeRequestError);
    }, [ idvpTemplateTypeRequestError ]);


    /**
     * Handles back button click.
     *
     * @returns void
     */
    const handleBackButtonClick = (): void => {

        history.push(AppConstants.getPaths().get(IdentityVerificationProviderConstants.IDVP_PATH));
    };

    /**
     * Handles template selection.
     *
     * @param e - Click event of type React.SyntheticEvent.
     * @param selectedTemplate - Id of the template.
     * @returns void
     */
    const handleTemplateSelection = (e: SyntheticEvent, selectedTemplate: IDVPTypeMetadataInterface): void => {

        /**
         * Find the matching template for the selected card.
         * if found then set the template to state.
         */
        if (!selectedTemplate) {
            return;
        }

        setSelectedTemplate(selectedTemplate);
        setTemplateType(selectedTemplate.id);
        setShowWizard(true);
    };

    /**
     * On successful IDVP creation, navigates to the IDVP edit page.
     *
     * @param id - ID of the created IDVP.
     * @returns void
     */
    const handleSuccessfulIDVPCreation = (id: string): void => {

        // If ID is present, navigate to the edit page of the created IDVP.
        if (id) {
            history.push({
                pathname: AppConstants.getPaths()
                    .get(IdentityVerificationProviderConstants.IDVP_EDIT_PATH)
                    .replace(":id", id)
            });

            return;
        }

        // Fallback to identity verification providers page, if id is not present.
        history.push(AppConstants.getPaths().get(IdentityVerificationProviderConstants.IDVP_PATH));
    };

    /**
     * Get search results.
     *
     * @param query - Search query.
     * @param selectedFilters - Selected filters.
     * @returns IDVP template types that matches the search query and selected filters.
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
     * @returns void
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
     * @returns void
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
     * @returns Placeholder element
     */
    const showPlaceholders = (list: any[]): ReactElement => {

        // When the search returns empty.
        if (searchQuery && list.length === 0) {
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
                        t("idvp:placeholders.emptyIDVPTypeList.title")
                    }
                    subtitle={ [
                        t("idvp:placeholders.emptyIDVPTypeList.subtitles.0"),
                        t("idvp:placeholders.emptyIDVPTypeList.subtitles.1")
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
                                                resourceName={ template.name }
                                                comingSoonRibbonLabel={ t("common:comingSoon") }
                                                resourceDescription={ template.description }
                                                resourceImage={
                                                    resolveIDVPImage(template.image)
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
            <IdvpCreateWizard
                showWizard={ showWizard }
                type={ templateType }
                selectedTemplateType={ selectedTemplate }
                onIDVPCreate={ handleSuccessfulIDVPCreation }
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

export default IdentityVerificationProviderTemplateSelectPage;
