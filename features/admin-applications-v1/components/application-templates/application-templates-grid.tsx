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

import {
    getEmptyPlaceholderIllustrations
} from "@wso2is/common/src/configs/ui";
import { IdentifiableComponentInterface, LoadableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    EmptyPlaceholder,
    GridLayout,
    ResourceGrid,
    SearchWithFilterLabels
} from "@wso2is/react-components";
import union from "lodash-es/union";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { AppState, EventPublisher } from "../../../admin-core-v1";
import { ApplicationTemplateConstants } from "../../constants/application-templates";
import useApplicationTemplates from "../../hooks/use-application-templates";
import { AuthProtocolMetaListItemInterface } from "../../models";
import {
    AdditionalPropertyInterface,
    ApplicationTemplateListInterface
} from "../../models/application-templates";
import { ApplicationManagementUtils } from "../../utils/application-management-utils";
import { ApplicationTemplateManagementUtils } from "../../utils/application-template-management-utils";
import { InboundProtocolsMeta } from "../meta";

/**
 * Props for the Application templates grid page.
 */
export interface ApplicationTemplateGridPropsInterface extends
    IdentifiableComponentInterface, LoadableComponentInterface {
    /**
     * Callback to be fired when a template is selected.
     */
    onTemplateSelect: (template: ApplicationTemplateListInterface) => void;
}

/**
 * Application templates grid page.
 *
 * @param props - Props injected to the component.
 *
 * @returns Application template select page.
 */
const ApplicationTemplateGrid: FunctionComponent<ApplicationTemplateGridPropsInterface> = (
    props: ApplicationTemplateGridPropsInterface
): ReactElement => {
    const { onTemplateSelect, ["data-componentid"]: componentId } = props;

    const { t } = useTranslation();

    const customInboundProtocols: AuthProtocolMetaListItemInterface[] = useSelector((state: AppState) =>
        state?.application?.meta?.customInboundProtocols);
    const hiddenApplicationTemplates: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.hiddenApplicationTemplates);

    const { templates, isApplicationTemplatesRequestLoading } = useApplicationTemplates();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ selectedFilters, setSelectedFilters ] = useState<string[]>([]);
    const [ showCustomProtocolApplicationTemplate, setShowCustomProtocolApplicationTemplate ] =
        useState<boolean>(false);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    /**
     * Fetch the custom inbound protocols.
     */
    useEffect(() => {
        ApplicationManagementUtils.getCustomInboundProtocols(InboundProtocolsMeta, true);
    }, []);

    /**
     * Show/hide custom application templated based on the availability of custom inbound authenticators.
     */
    useEffect(() => {
        setShowCustomProtocolApplicationTemplate(customInboundProtocols.length > 0);
    }, [ customInboundProtocols ]);

    /**
     * Retrieve the filter tags from the `tags` attribute of the application templates.
     */
    const filterTags: string[] = useMemo(() => {
        if (!templates || !Array.isArray(templates) || templates?.length <= 0) {
            return [];
        }

        let tags: string[] = [];

        templates.forEach((template: ApplicationTemplateListInterface) => {
            tags = union(tags, template?.tags);
        });

        return tags;
    }, [ templates ]);

    /**
     * Get search results based on the selected tags and the search query.
     *
     * @param query - Search query.
     * @param filterLabels - Array of filter labels.
     *
     * @returns List of filtered application templates for the provided filter tags and search query.
     */
    const getSearchResults = (query: string, filterLabels: string[]): ApplicationTemplateListInterface[] => {

        /**
         * Checks if any of the filters are matching.
         *
         * @param template - Application template object.
         * @returns Boolean value indicating whether the filters are matched or not.
         */
        const isFiltersMatched = (template: ApplicationTemplateListInterface): boolean => {

            if (!filterLabels || !Array.isArray(filterLabels) || filterLabels?.length <= 0) {
                return true;
            }

            return template?.tags
                .some((tagLabel: string) => filterLabels.includes(tagLabel));
        };

        return templates.filter((template: ApplicationTemplateListInterface) => {
            if (!query) {
                return isFiltersMatched(template);
            }

            const name: string = template?.name?.toLocaleLowerCase();

            if (name.includes(query)
                || template?.tags?.some((tag: string) => tag?.toLocaleLowerCase()?.includes(query))) {

                return isFiltersMatched(template);
            }
        });
    };

    /**
     * Exclude the application templates that should not be displayed on the application grid page.
     *
     * templates - Application templates list.
     * @returns Filtered application templates list.
     */
    const removeIrrelevantTemplates = (templates: ApplicationTemplateListInterface[]) => {
        let removingApplicationTemplateIds: string[] = [];

        // Remove custom protocol application templates if there are no custom inbound protocols.
        if (!showCustomProtocolApplicationTemplate) {
            removingApplicationTemplateIds.push(ApplicationTemplateConstants.CUSTOM_PROTOCOL_APPLICATION_TEMPLATE_ID);
        }

        // Remove hidden application templates based on the UI config.
        removingApplicationTemplateIds = union(removingApplicationTemplateIds, hiddenApplicationTemplates);

        return templates.filter(
            (template: ApplicationTemplateListInterface) => !removingApplicationTemplateIds.includes(template?.id));
    };

    /**
     * Filter out the application templates based on the selected tags and the search query.
     */
    const filteredTemplates: ApplicationTemplateListInterface[] = useMemo(() => {
        if (!templates || !Array.isArray(templates) || templates?.length <= 0) {
            return [];
        }

        if (!searchQuery && (!selectedFilters || !Array.isArray(selectedFilters) || selectedFilters?.length <= 0)) {
            return removeIrrelevantTemplates(templates);
        }

        return removeIrrelevantTemplates(getSearchResults(searchQuery, selectedFilters));
    }, [ templates, selectedFilters, searchQuery ]);

    /**
     * Handles application template selection.
     *
     * @param e - Click event.
     * @param id - Selected template details.
     */
    const handleTemplateSelection = (e: SyntheticEvent, template: ApplicationTemplateListInterface): void => {
        if (!template) {
            return;
        }

        eventPublisher.publish("application-click-create-new", {
            source: "application-listing-page",
            type: template?.id
        });

        onTemplateSelect(template);
    };

    /**
     * Handles the Application Template Search input onchange.
     *
     * @param query - Search query.
     * @param selectedFilters - Array of selected filters.
     */
    const handleApplicationTemplateSearch = (query: string, selectedFilters: string[]): void => {

        // Update the internal state to manage placeholders etc.
        setSearchQuery(query);
        setSelectedFilters(selectedFilters);
        // Filter out the templates.
        //setFilteredCategorizedTemplates(getSearchResults(query.toLocaleLowerCase(), selectedFilters));
    };

    /**
     * Handles Application Template Type filter.
     *
     * @param query - Search query.
     * @param selectedFilters - Array of the selected filters.
     */
    const handleApplicationTemplateTypeFilter = (query: string, selectedFilters: string[]): void => {

        // Update the internal state to manage placeholders etc.
        setSearchQuery(query);
        setSelectedFilters(selectedFilters);
    };

    /**
     * Resolve the relevant placeholder.
     *
     * list - Application templates list.
     * @returns Corresponding placeholder component.
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
                    data-componentid={ `${ componentId }-empty-search-placeholder` }
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
                        t("applications:placeHolders.emptyApplicationTypeList.title")
                    }
                    subtitle={ [
                        t("applications:placeHolders.emptyApplicationTypeList" +
                            ".subtitles.0"),
                        t("applications:placeHolders.emptyApplicationTypeList" +
                            ".subtitles.1")
                    ] }
                    data-componentid={ `${ componentId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <GridLayout
            search={ (
                <SearchWithFilterLabels
                    placeholder={ t("common:advancedSearch.placeholder", { attribute: "name" }) }
                    onSearch={ handleApplicationTemplateSearch }
                    onFilter={ handleApplicationTemplateTypeFilter }
                    filterLabels={ filterTags }
                />
            ) }
            isLoading={ isApplicationTemplatesRequestLoading }
        >
            {
                (filteredTemplates && !isApplicationTemplatesRequestLoading)
                    ? (
                        <ResourceGrid
                            isEmpty={ !Array.isArray(filteredTemplates) || filteredTemplates.length <= 0 }
                            emptyPlaceholder={ showPlaceholders(templates) }
                        >
                            {
                                filteredTemplates
                                    .map((template: ApplicationTemplateListInterface) => {
                                        let isTemplateComingSoon: boolean = false;

                                        if (template?.additionalProperties
                                            && Array.isArray(template?.additionalProperties)
                                            && template?.additionalProperties.length > 0) {

                                            const comingSoonPropertyIndex: number =
                                                template?.additionalProperties
                                                    .findIndex(
                                                        (property: AdditionalPropertyInterface) =>
                                                            property?.key ===
                                                                ApplicationTemplateConstants
                                                                    .COMING_SOON_ATTRIBUTE_KEY
                                                    );

                                            if (comingSoonPropertyIndex >= 0) {
                                                isTemplateComingSoon =
                                                    template?.additionalProperties[
                                                        comingSoonPropertyIndex
                                                    ]?.value === "true";
                                            }
                                        }

                                        return (
                                            <ResourceGrid.Card
                                                key={ template?.id }
                                                resourceName={ template?.name }
                                                showSetupGuideButton={ false }
                                                isResourceComingSoon={ isTemplateComingSoon }
                                                comingSoonRibbonLabel={ t("common:comingSoon") }
                                                resourceDescription={ template?.description }
                                                resourceImage={
                                                    ApplicationTemplateManagementUtils
                                                        .resolveApplicationResourcePath(template.image)
                                                }
                                                tags={ template.tags }
                                                showActions={ true }
                                                onClick={ (e: SyntheticEvent) => {
                                                    handleTemplateSelection(e, template);
                                                } }
                                                showTooltips={
                                                    {
                                                        description: true,
                                                        header: false
                                                    }
                                                }
                                                data-testid={ `${ componentId }-${ template.name }` }
                                            />
                                        );
                                    })
                            }
                        </ResourceGrid>
                    )
                    : <ContentLoader dimmer/>
            }
        </GridLayout>
    );
};

/**
 * Default props for the component.
 */
ApplicationTemplateGrid.defaultProps = {
    "data-componentid": "application-template-grid"
};

export default ApplicationTemplateGrid;
