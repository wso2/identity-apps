/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { AlertInterface, AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    DocumentationLink,
    ListLayout,
    PageLayout,
    PrimaryButton,
    useDocumentation
} from "@wso2is/react-components";
import React, { MouseEvent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { VCCredentialConfigList } from "../components/vc-credential-config-list";
import { AddVCConfigWizard } from "../components/wizard";
import { useGetVCConfigs } from "../hooks/use-get-vc-configs";
import { PaginationLink } from "../models/verifiable-credentials";
import "./verifiable-credentials.scss";

type VerifiableCredentialsPageProps = IdentifiableComponentInterface;

/**
 * Verifiable Credentials configurations list page.
 *
 * @param props - Props injected to the component.
 * @returns React element.
 */
const VerifiableCredentials = ({
    "data-componentid": componentId = "verifiable-credentials"
}: VerifiableCredentialsPageProps): ReactElement => {
    const { t } = useTranslation();
    const { getLink } = useDocumentation();
    const dispatch: Dispatch = useDispatch();

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
    const [ isAddConfigWizardOpen, setIsAddConfigWizardOpen ] = useState<boolean>(false);

    const {
        data: configList,
        isLoading: isConfigListLoading,
        error: configListError,
        mutate: mutateConfigList
    } = useGetVCConfigs(listItemLimit, before, after, searchQuery, null, true);

    /**
     * Update pagination cursors when config list changes.
     */
    useEffect(() => {
        if (configList) {
            setNextAfter(undefined);
            setNextBefore(undefined);

            if (configList.links && configList.links.length > 0) {
                configList.links.forEach((link: PaginationLink) => {
                    if (link.rel === "next" || link.rel === "after") {
                        // Extract cursor from URL
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
    }, [ configList ]);

    /**
     * Handle fetch errors.
     */
    useEffect(() => {
        if (configListError) {
            dispatch(addAlert<AlertInterface>({
                description: t("verifiableCredentials:notifications.fetchConfigs.error.description"),
                level: AlertLevels.ERROR,
                message: t("verifiableCredentials:notifications.fetchConfigs.error.message")
            }));
        }
    }, [ configListError ]);

    /**
     * Refresh list when needed.
     */
    useEffect(() => {
        if (isListUpdated) {
            mutateConfigList();
            setListUpdated(false);
        }
    }, [ isListUpdated ]);

    /**
     * Handles the configuration filter.
     *
     * @param query - Search query.
     */
    const handleConfigFilter = (query: string): void => {
        setSearchQuery(query);
        setAfter(undefined);
        setBefore(undefined);
        setActivePage(1);
    };

    /**
     * Handles the items per page dropdown change.
     *
     * @param event - Mouse event.
     * @param data - Dropdown props.
     */
    const handleItemsPerPageDropdownChange = (
        event: React.MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ): void => {
        setListItemLimit(data.value as number);
        setAfter(undefined);
        setBefore(undefined);
        setActivePage(1);
    };

    /**
     * Handles pagination change.
     *
     * @param event - Mouse event.
     * @param data - Pagination props.
     */
    const handlePaginationChange = (
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

    /**
     * Handles search query clear.
     */
    const handleSearchQueryClear = (): void => {
        setSearchQuery(null);
        setAfter(undefined);
        setBefore(undefined);
        setActivePage(1);
    };

    /**
     * Handles list refresh after delete or create.
     */
    const handleListRefresh = (): void => {
        setAfter(undefined);
        setBefore(undefined);
        setListUpdated(true);
    };

    return (
        <PageLayout
            pageTitle={ t("verifiableCredentials:page.title") }
            title={ t("verifiableCredentials:page.heading") }
            description={
                (<>
                    { t("verifiableCredentials:page.description") }
                    <DocumentationLink
                        link={ getLink("develop.verifiableCredentials.learnMore") }
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
                configList?.VCCredentialConfigurations?.length > 0 &&
                !isConfigListLoading && (
                    <PrimaryButton
                        onClick={ () => {
                            setIsAddConfigWizardOpen(true);
                        } }
                        data-testid={ `${componentId}-add-button` }
                    >
                        <Icon name="add" />
                        { t("verifiableCredentials:buttons.addConfig") }
                    </PrimaryButton>
                )
            }
        >
            <ListLayout
                advancedSearch={
                    (<AdvancedSearchWithBasicFilters
                        onFilter={ handleConfigFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("verifiableCredentials:list.search.attributes.identifier"),
                                value: "identifier"
                            },
                            {
                                key: 1,
                                text: t("verifiableCredentials:list.search.attributes.displayName"),
                                value: "displayName"
                            }
                        ] }
                        filterAttributePlaceholder={
                            t("verifiableCredentials:list.search.filterAttributePlaceholder")
                        }
                        filterConditionsPlaceholder={
                            t("verifiableCredentials:list.search.filterConditionsPlaceholder")
                        }
                        filterValuePlaceholder={
                            t("verifiableCredentials:list.search.filterValuePlaceholder")
                        }
                        placeholder={ t("verifiableCredentials:list.search.placeholder") }
                        style={ { minWidth: "425px" } }
                        defaultSearchAttribute="identifier"
                        defaultSearchOperator="co"
                        triggerClearQuery={ false }
                        data-testid={ `${componentId}-list-advanced-search` }
                    />)
                }
                currentListSize={ configList?.VCCredentialConfigurations?.length ?? 0 }
                isLoading={ isConfigListLoading }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ () => {} }
                showPagination={ true }
                showTopActionPanel={
                    isConfigListLoading ||
                    (configList?.VCCredentialConfigurations?.length > 0) ||
                    searchQuery !== null
                }
                sortOptions={ null }
                sortStrategy={ null }
                totalPages={ Math.ceil((configList?.totalResults ?? 0) / listItemLimit) || 1 }
                totalListSize={ configList?.totalResults ?? 0 }
                paginationOptions={ {
                    disableNextButton: !nextAfter,
                    disablePreviousButton: !nextBefore
                } }
                activePage={ activePage }
                data-testid={ `${componentId}-list-layout` }
            >
                <VCCredentialConfigList
                    advancedSearch={
                        (<AdvancedSearchWithBasicFilters
                            onFilter={ handleConfigFilter }
                            filterAttributeOptions={ [
                                {
                                    key: 0,
                                    text: t("verifiableCredentials:list.search.attributes.identifier"),
                                    value: "identifier"
                                }
                            ] }
                            filterAttributePlaceholder={
                                t("verifiableCredentials:list.search.filterAttributePlaceholder")
                            }
                            filterConditionsPlaceholder={
                                t("verifiableCredentials:list.search.filterConditionsPlaceholder")
                            }
                            filterValuePlaceholder={
                                t("verifiableCredentials:list.search.filterValuePlaceholder")
                            }
                            placeholder={ t("verifiableCredentials:list.search.placeholder") }
                            style={ { minWidth: "425px" } }
                            defaultSearchAttribute="identifier"
                            defaultSearchOperator="co"
                            triggerClearQuery={ false }
                            data-testid={ `${componentId}-list-advanced-search-inner` }
                        />)
                    }
                    mutateConfigList={ handleListRefresh }
                    isLoading={ isConfigListLoading }
                    list={ configList?.VCCredentialConfigurations ?? [] }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                    setShowAddConfigWizard={ () => {
                        setIsAddConfigWizardOpen(true);
                    } }
                    data-componentid={ `${componentId}-list` }
                />
            </ListLayout>

            { isAddConfigWizardOpen && (
                <AddVCConfigWizard
                    closeWizard={ () => setIsAddConfigWizardOpen(false) }
                    onSuccess={ handleListRefresh }
                    data-componentid={ `${componentId}-add-wizard` }
                />
            ) }
        </PageLayout>
    );
};

export default VerifiableCredentials;
