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

import IconButton from "@oxygen-ui/react/IconButton";
import { GearIcon } from "@oxygen-ui/react-icons";
import { Show } from "@wso2is/access-control";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import { AlertInterface, AlertLevels, FeatureAccessConfigInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DocumentationLink,
    ListLayout,
    PageLayout,
    Popup,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { PresentationDefinitionList } from "../components/presentation-definition-list";
import AddPresentationDefinitionWizard from "../components/wizard/add-presentation-definition";
import { useGetPresentationDefinitions } from "../hooks/use-get-presentation-definitions";
import {
    PaginationLinkInterface,
    PresentationDefinitionListItemInterface,
    PresentationDefinitionsPagePropsInterface
} from "../models/presentation-definitions";

/**
 * Presentation Definitions list page.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const PresentationDefinitions: FunctionComponent<PresentationDefinitionsPagePropsInterface> = ({
    "data-componentid": componentId = "presentation-definitions"
}: PresentationDefinitionsPagePropsInterface): ReactElement => {
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const dispatch: Dispatch = useDispatch();

    const presentationDefinitionsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.presentationDefinitions
    );

    const [ activePage, setActivePage ] = useState<number>(1);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ after, setAfter ] = useState<string>(undefined);
    const [ before, setBefore ] = useState<string>(undefined);
    const [ nextAfter, setNextAfter ] = useState<string>(undefined);
    const [ nextBefore, setNextBefore ] = useState<string>(undefined);
    const [ isListUpdated, setListUpdated ] = useState<boolean>(false);
    const [ listItemLimit, setListItemLimit ] = useState<number>(
        UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT
    );
    const [ isAddWizardOpen, setIsAddWizardOpen ] = useState<boolean>(false);

    const {
        data: definitionList,
        isLoading,
        error,
        mutate: mutateList
    } = useGetPresentationDefinitions(listItemLimit, before, after, searchQuery, true);

    useEffect(() => {
        if (definitionList) {
            setNextAfter(undefined);
            setNextBefore(undefined);

            if (definitionList.links && definitionList.links.length > 0) {
                definitionList.links.forEach((link: PaginationLinkInterface) => {
                    if (link.rel === "next" || link.rel === "after") {
                        const afterMatch: RegExpMatchArray = link.href.match(/after=([^&]*)/);

                        if (afterMatch) {
                            setNextAfter(afterMatch[1]);
                        }
                    } else if (link.rel === "previous" || link.rel === "before") {
                        const beforeMatch: RegExpMatchArray = link.href.match(/before=([^&]*)/);

                        if (beforeMatch) {
                            setNextBefore(beforeMatch[1]);
                        }
                    }
                });
            }
        }
    }, [ definitionList ]);

    useEffect(() => {
        if (error) {
            dispatch(addAlert<AlertInterface>({
                description: t("presentationDefinitions:notifications.fetchDefinitions.error.description"),
                level: AlertLevels.ERROR,
                message: t("presentationDefinitions:notifications.fetchDefinitions.error.message")
            }));
        }
    }, [ error ]);

    useEffect(() => {
        if (isListUpdated) {
            mutateList();
            setListUpdated(false);
        }
    }, [ isListUpdated ]);

    const handleDefinitionFilter: (query: string) => void = (query: string): void => {
        setSearchQuery(query);
        setAfter(undefined);
        setBefore(undefined);
        setActivePage(1);
    };

    const handleItemsPerPageDropdownChange: (
        event: React.MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ) => void = (
        event: React.MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ): void => {
        setListItemLimit(data.value as number);
        setAfter(undefined);
        setBefore(undefined);
        setActivePage(1);
    };

    const handlePaginationChange: (
        event: MouseEvent<HTMLAnchorElement>,
        data: PaginationProps
    ) => void = (
        event: MouseEvent<HTMLAnchorElement>,
        data: PaginationProps
    ): void => {
        const newPage: number = parseInt(data?.activePage as string);

        if (newPage > activePage) {
            setAfter(nextAfter);
            setBefore(undefined);
        } else if (newPage < activePage) {
            setBefore(nextBefore);
            setAfter(undefined);
        }
        setActivePage(newPage);
    };

    const handleSearchQueryClear: () => void = (): void => {
        setSearchQuery(null);
        setAfter(undefined);
        setBefore(undefined);
        setActivePage(1);
    };

    const handleListRefresh: () => void = (): void => {
        setAfter(undefined);
        setBefore(undefined);
        setListUpdated(true);
    };

    const handleSettingsButton = (): void => {
        history.push(AppConstants.getPaths().get("OPENID4VP_CONFIG"));
    };

    const definitions: PresentationDefinitionListItemInterface[] =
        definitionList?.presentationDefinitions ?? [];

    return (
        <PageLayout
            pageTitle={ t("presentationDefinitions:page.title") }
            title={ t("presentationDefinitions:page.heading") }
            description={
                (<>
                    { t("presentationDefinitions:page.description") }
                    <DocumentationLink
                        link={ getLink("develop.presentationDefinitions.learnMore") }
                        showEmptyLink={ false }
                    >
                        { t("common:learnMore") }
                    </DocumentationLink>
                </>)
            }
            data-componentid={ `${componentId}-page-layout` }
            bottomMargin={ false }
            contentTopMargin={ true }
            pageHeaderMaxWidth={ false }
            action={
                <>
                    <Popup
                        trigger={ (
                            <IconButton
                                onClick={ handleSettingsButton }
                                data-componentid={ `${componentId}-settings-button` }
                            >
                                <GearIcon />
                            </IconButton>
                        ) }
                        content={ t("openid4vp:title") }
                        position="top center"
                        size="mini"
                        hideOnScroll
                        inverted
                    />
                    { definitions.length > 0 && !isLoading && (
                        <Show when={ presentationDefinitionsFeatureConfig?.scopes?.create }>
                            <PrimaryButton
                                onClick={ () => setIsAddWizardOpen(true) }
                                data-componentid={ `${componentId}-add-button` }
                            >
                                <Icon name="add" />
                                { t("presentationDefinitions:buttons.addDefinition") }
                            </PrimaryButton>
                        </Show>
                    ) }
                </>
            }
        >
            <ListLayout
                advancedSearch={
                    (<AdvancedSearchWithBasicFilters
                        onFilter={ handleDefinitionFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("presentationDefinitions:list.search.attributes.name"),
                                value: "displayName"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("presentationDefinitions:list.search.filterAttributePlaceholder")
                        }
                        filterConditionsPlaceholder={
                            t("presentationDefinitions:list.search.filterConditionsPlaceholder")
                        }
                        filterValuePlaceholder={
                            t("presentationDefinitions:list.search.filterValuePlaceholder")
                        }
                        placeholder={ t("presentationDefinitions:list.search.placeholder") }
                        style={ { minWidth: "425px" } }
                        defaultSearchAttribute="displayName"
                        defaultSearchOperator="co"
                        triggerClearQuery={ false }
                        data-componentid={ `${componentId}-list-advanced-search` }
                    />)
                }
                currentListSize={ definitions.length }
                isLoading={ isLoading }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ () => { } }
                showPagination={ true }
                showTopActionPanel={
                    isLoading ||
                    definitions.length > 0 ||
                    searchQuery !== null
                }
                sortOptions={ null }
                sortStrategy={ null }
                totalPages={ Math.ceil((definitionList?.totalResults ?? 0) / listItemLimit) || 1 }
                totalListSize={ definitionList?.totalResults ?? 0 }
                paginationOptions={ {
                    disableNextButton: !nextAfter,
                    disablePreviousButton: !nextBefore
                } }
                activePage={ activePage }
                data-componentid={ `${componentId}-list-layout` }
            >
                <PresentationDefinitionList
                    isLoading={ isLoading }
                    list={ definitions }
                    mutateList={ handleListRefresh }
                    onAddClick={ () => setIsAddWizardOpen(true) }
                    searchQuery={ searchQuery }
                    onSearchQueryClear={ handleSearchQueryClear }
                    data-componentid={ `${componentId}-list` }
                />
            </ListLayout>

            { isAddWizardOpen && (
                <AddPresentationDefinitionWizard
                    closeWizard={ () => setIsAddWizardOpen(false) }
                    data-componentid={ `${componentId}-add-wizard` }
                />
            ) }
        </PageLayout>
    );
};

export default PresentationDefinitions;
