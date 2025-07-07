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

import Typography from "@oxygen-ui/react/Typography";
import { InboundProtocolsMeta } from "@wso2is/admin.applications.v1/components/meta/inbound-protocols.meta";
import { AuthProtocolMetaListItemInterface } from "@wso2is/admin.applications.v1/models/application-inbound";
import { ApplicationManagementUtils } from "@wso2is/admin.applications.v1/utils/application-management-utils";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppState } from "@wso2is/admin.core.v1/store";
import { EventPublisher } from "@wso2is/admin.core.v1/utils/event-publisher";
import useExtensionTemplates from "@wso2is/admin.template-core.v1/hooks/use-extension-templates";
import {
    CategorizedExtensionTemplatesInterface,
    ExtensionTemplateListInterface
} from "@wso2is/admin.template-core.v1/models/templates";
import { IdentifiableComponentInterface, LoadableComponentInterface } from "@wso2is/core/models";
import {
    ContentLoader,
    DocumentationLink,
    EmptyPlaceholder,
    GridLayout,
    ResourceGrid,
    SearchWithFilterLabels,
    useDocumentation
} from "@wso2is/react-components";
import union from "lodash-es/union";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ApplicationTemplateCard from "./application-template-card";
import { ApplicationTemplateConstants } from "../constants/templates";
import { ApplicationTemplateCategories } from "../models/templates";
import "./application-templates-grid.scss";

/**
 * Props for the Application templates grid page.
 */
export interface ApplicationTemplateGridPropsInterface extends
    IdentifiableComponentInterface, LoadableComponentInterface {
    /**
     * Callback to be fired when a template is selected.
     */
    onTemplateSelect: (template: ExtensionTemplateListInterface) => void;
}

/**
 * Application templates grid page.
 *
 * @param props - Props injected to the component.
 *
 * @returns Application template select page.
 */
const ApplicationTemplateGrid: FunctionComponent<ApplicationTemplateGridPropsInterface> = ({
    onTemplateSelect,
    ["data-componentid"]: componentId = "application-template-grid"
}: ApplicationTemplateGridPropsInterface): ReactElement => {

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const customInboundProtocols: AuthProtocolMetaListItemInterface[] = useSelector((state: AppState) =>
        state?.application?.meta?.customInboundProtocols);
    const hiddenApplicationTemplates: string[] = useSelector((state: AppState) =>
        state?.config?.ui?.hiddenApplicationTemplates);

    const {
        templates,
        categorizedTemplates,
        isExtensionTemplatesRequestLoading: isApplicationTemplatesRequestLoading
    } = useExtensionTemplates();

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
     * Show/hide custom application template based on the availability of custom inbound authenticators.
     */
    useEffect(() => {
        setShowCustomProtocolApplicationTemplate(customInboundProtocols?.length > 0);
    }, [ customInboundProtocols ]);

    /**
     * Retrieve the filter tags from the `tags` attribute of the application templates.
     */
    const filterTags: string[] = useMemo(() => {
        if (!templates || !Array.isArray(templates) || templates?.length <= 0) {
            return [];
        }

        let tags: string[] = [];

        templates.forEach((template: ExtensionTemplateListInterface) => {
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
    const getSearchResults = (query: string, filterLabels: string[]): ExtensionTemplateListInterface[] => {

        /**
         * Checks if any of the filters are matching.
         *
         * @param template - Application template object.
         * @returns Boolean value indicating whether the filters are matched or not.
         */
        const isFiltersMatched = (template: ExtensionTemplateListInterface): boolean => {

            if (!filterLabels || !Array.isArray(filterLabels) || filterLabels?.length <= 0) {
                return true;
            }

            return template?.tags
                ?.some((tagLabel: string) => filterLabels.includes(tagLabel));
        };

        return templates?.filter((template: ExtensionTemplateListInterface) => {
            if (!query) {
                return isFiltersMatched(template);
            }

            const name: string = template?.name?.toLocaleLowerCase();

            if (name?.includes(query.toLocaleLowerCase())
                || template?.tags?.some(
                    (tag: string) => tag?.toLocaleLowerCase()?.includes(query.toLocaleLowerCase()))
            ) {

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
    const removeIrrelevantTemplates = (templates: ExtensionTemplateListInterface[]) => {
        let removingApplicationTemplateIds: string[] = [];

        // Remove custom protocol application templates if there are no custom inbound protocols.
        if (!showCustomProtocolApplicationTemplate) {
            removingApplicationTemplateIds.push(ApplicationTemplateConstants.CUSTOM_PROTOCOL_APPLICATION_TEMPLATE_ID);
        }

        // Remove hidden application templates based on the UI config.
        removingApplicationTemplateIds = union(removingApplicationTemplateIds, hiddenApplicationTemplates);

        return templates?.filter(
            (template: ExtensionTemplateListInterface) => !removingApplicationTemplateIds.includes(template?.id));
    };

    /**
     * Filter out the application templates based on the selected tags and the search query.
     */
    const filteredTemplates: ExtensionTemplateListInterface[] = useMemo(() => {
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
    const handleTemplateSelection = (
        e: MouseEvent<HTMLDivElement>,
        template: ExtensionTemplateListInterface
    ): void => {
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
        if (list?.length === 0) {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={
                        t("applicationTemplates:placeholders.emptyApplicationTypeList.title")
                    }
                    subtitle={ [
                        t("applicationTemplates:placeholders.emptyApplicationTypeList" +
                            ".subtitles.0"),
                        t("applicationTemplates:placeholders.emptyApplicationTypeList" +
                            ".subtitles.1")
                    ] }
                    data-componentid={ `${ componentId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    /**
     * Resolve the correct documentation link based on the provided category ID.
     *
     * @param category - The category ID requires the documentation link.
     * @returns Documentation link.
     */
    const resolveDocumentationLinks = (category: string) => {
        switch(category) {
            case ApplicationTemplateCategories.DEFAULT:
                return getLink("develop.applications.template." +
                    "categories.default.learnMore");
            case ApplicationTemplateCategories.TECHNOLOGY:
                return getLink("develop.applications.template." +
                    "categories.technology.learnMore");
            case ApplicationTemplateCategories.SSO_INTEGRATION:
                return getLink("develop.applications.template." +
                    "categories.ssoIntegration.learnMore");
            default:
                return null;
        }
    };

    return (
        <GridLayout
            search={ (
                <SearchWithFilterLabels
                    placeholder={ t("console:common.advancedSearch.placeholder", { attribute: "name" }) }
                    onSearch={ handleApplicationTemplateSearch }
                    onFilter={ handleApplicationTemplateTypeFilter }
                    filterLabels={ filterTags }
                />
            ) }
            isLoading={ isApplicationTemplatesRequestLoading }
        >
            {
                (categorizedTemplates && filteredTemplates && !isApplicationTemplatesRequestLoading)
                    ? (
                        searchQuery
                            || (selectedFilters && Array.isArray(selectedFilters)
                            && selectedFilters?.length > 0)
                            ? (
                                <ResourceGrid
                                    isEmpty={ !Array.isArray(filteredTemplates) || filteredTemplates.length <= 0 }
                                    emptyPlaceholder={ showPlaceholders(filteredTemplates) }
                                >
                                    {
                                        filteredTemplates
                                            .map((template: ExtensionTemplateListInterface) => {
                                                return (
                                                    <ApplicationTemplateCard
                                                        key={ template?.id }
                                                        onClick={ (e: MouseEvent<HTMLDivElement>) => {
                                                            handleTemplateSelection(e, template);
                                                        } }
                                                        template={ template }
                                                    />
                                                );
                                            })
                                    }
                                </ResourceGrid>
                            )
                            : (
                                (Array.isArray(categorizedTemplates) && categorizedTemplates?.length === 0)
                                    ? showPlaceholders(categorizedTemplates)
                                    : categorizedTemplates
                                        .map((category: CategorizedExtensionTemplatesInterface) => {
                                            const refinedTemplates: ExtensionTemplateListInterface[] =
                                                removeIrrelevantTemplates(category?.templates);

                                            if (refinedTemplates?.length <= 0) {
                                                return null;
                                            }

                                            return (
                                                <div key={ category?.id } className="application-template-card-group">
                                                    { /* Only render the title if displayName is not empty */ }
                                                    { category?.displayName && (
                                                        <Typography variant="h5">
                                                            { t(category?.displayName) }
                                                        </Typography>
                                                    ) }
                                                    {
                                                        category?.description
                                                            ? (
                                                                <Typography
                                                                    className={
                                                                        `application-template-card-group-description${
                                                                            !category?.displayName
                                                                                ? " application-template-card-group-" +
                                                                                  "empty-title"
                                                                                : ""
                                                                        }`
                                                                    }
                                                                    variant="subtitle1"
                                                                >
                                                                    { t(category?.description) }
                                                                    <DocumentationLink
                                                                        link={ resolveDocumentationLinks(category?.id) }
                                                                    >
                                                                        { t("common:learnMore") }
                                                                    </DocumentationLink>
                                                                </Typography>
                                                            )
                                                            : null
                                                    }
                                                    <ResourceGrid
                                                        isEmpty={
                                                            !Array.isArray(refinedTemplates)
                                                                || refinedTemplates.length <= 0
                                                        }
                                                        emptyPlaceholder={ showPlaceholders(refinedTemplates) }
                                                    >
                                                        {
                                                            refinedTemplates.map(
                                                                (template: ExtensionTemplateListInterface) => {
                                                                    return (
                                                                        <ApplicationTemplateCard
                                                                            key={ template?.id }
                                                                            onClick={
                                                                                (e: MouseEvent<HTMLDivElement>) => {
                                                                                    handleTemplateSelection(
                                                                                        e, template);
                                                                                }
                                                                            }
                                                                            template={ template }
                                                                        />
                                                                    );
                                                                })
                                                        }
                                                    </ResourceGrid>
                                                </div>
                                            );
                                        })
                            )
                    )
                    : <ContentLoader dimmer/>
            }
        </GridLayout>
    );
};

export default ApplicationTemplateGrid;
