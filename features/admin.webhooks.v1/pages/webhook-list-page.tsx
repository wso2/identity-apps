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

import { Show } from "@wso2is/access-control";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { DocumentationLink, ListLayout, PageLayout, PrimaryButton, useDocumentation } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "semantic-ui-react";
import deleteWebhook from "../api/delete-webhook";
import useGetWebhooks from "../api/use-get-webhooks";
import WebhookList from "../components/webhook-list";
import usePagination from "../hooks/use-pagination";
import useWebhookNavigation from "../hooks/use-webhook-navigation";
import useWebhookSearch from "../hooks/use-webhook-search";
import { WebhookListInterface, WebhookListItemInterface } from "../models/webhooks";
import { useHandleWebhookError, useHandleWebhookSuccess } from "../utils/alert-utils";

type WebhooksPageInterface = IdentifiableComponentInterface;

const WebhooksPage: FunctionComponent<WebhooksPageInterface> = ({
    ["data-componentid"]: _componentId = "webhook-list-page"
}: WebhooksPageInterface): ReactElement => {
    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const [ isDeletingWebhook, setIsDeletingWebhook ] = useState<boolean>(false);

    // Data fetching using the new hook
    const {
        data: webhookListResponse,
        isLoading: isWebhookListFetchRequestLoading,
        error: webhookListFetchRequestError,
        mutate: mutateWebhooks
    } = useGetWebhooks();

    const webhooks: WebhookListItemInterface[] = useMemo(() => {
        return webhookListResponse?.webhooks || [];
    }, [ webhookListResponse ]);

    // Search functionality
    const {
        searchQuery,
        triggerClearQuery,
        filteredWebhooks,
        handleWebhookFilter,
        handleSearchQueryClear
    } = useWebhookSearch(webhooks);

    // Pagination functionality
    const {
        totalPages,
        paginatedItems: paginatedWebhooks,
        handlePaginationChange,
        handleItemsPerPageDropdownChange,
        resetToFirstPage,
        itemsPerPage
    } = usePagination(filteredWebhooks);

    // Navigation
    const { navigateToWebhookCreation, navigateToWebhookEdit } = useWebhookNavigation();

    const handleSuccess: (action: string) => void = useHandleWebhookSuccess();
    const handleError: (error: unknown, action: string) => void = useHandleWebhookError();

    useEffect(() => {
        resetToFirstPage();
    }, [ searchQuery, resetToFirstPage ]);

    useEffect(() => {
        if (webhookListFetchRequestError) {
            handleError(webhookListFetchRequestError, "fetchWebhooks");
        }
    }, [ webhookListFetchRequestError, handleError ]);

    const handleWebhookDelete = (webhook: WebhookListItemInterface): void => {
        setIsDeletingWebhook(true);
        deleteWebhook(webhook.id)
            .then(() => {
                mutateWebhooks();
                handleSuccess("deleteWebhook");
            })
            .catch((error: AxiosError) => {
                handleError(error, "deleteWebhook");
            })
            .finally(() => {
                setIsDeletingWebhook(false);
            });
    };

    const enhancedWebhookList: WebhookListInterface = useMemo(
        () => ({
            totalResults: filteredWebhooks.length,
            webhooks: paginatedWebhooks
        }),
        [ paginatedWebhooks, filteredWebhooks.length ]
    );

    const renderAddButton = () =>
        enhancedWebhookList?.totalResults > 0 ? (
            <Show>
                <PrimaryButton
                    onClick={ navigateToWebhookCreation }
                    data-componentid={ `${_componentId}-list-layout-add-button` }
                >
                    <Icon name="add" />
                    { t("webhooks:pages.list.buttons.add") }
                </PrimaryButton>
            </Show>
        ) : null;

    const renderAdvancedSearch = () => (
        <AdvancedSearchWithBasicFilters
            onFilter={ handleWebhookFilter }
            filterAttributeOptions={ [
                {
                    key: 0,
                    text: t("webhooks:advancedSearch.filterAttributeOptions.name.label"),
                    value: "name"
                },
                {
                    key: 1,
                    text: t("webhooks:advancedSearch.filterAttributeOptions.endpoint.label"),
                    value: "endpoint"
                }
            ] }
            filterAttributePlaceholder={ t("webhooks:advancedSearch.filterAttribute.placeholder") }
            filterConditionsPlaceholder={ t("webhooks:advancedSearch.filterCondition.placeholder") }
            filterValuePlaceholder={ t("webhooks:advancedSearch.form.filterValue.placeholder") }
            placeholder={ t("webhooks:advancedSearch.placeholder") }
            style={ { minWidth: "425px" } }
            defaultSearchAttribute="name"
            defaultSearchOperator="co"
            triggerClearQuery={ triggerClearQuery }
            data-componentid={ `${_componentId}-list-advanced-search` }
        />
    );

    return (
        <PageLayout
            pageTitle="Webhooks"
            action={ renderAddButton() }
            title={ t("webhooks:pages.list.heading") }
            description={
                (<p>
                    { t("webhooks:pages.list.subHeading") }
                    <DocumentationLink link={ getLink("develop.webhooks.learnMore") }>
                        { t("common:learnMore") }
                    </DocumentationLink>
                </p>)
            }
            contentTopMargin={ true }
            data-componentid={ `${_componentId}-page-layout` }
        >
            <ListLayout
                advancedSearch={ renderAdvancedSearch() }
                currentListSize={ paginatedWebhooks.length }
                isLoading={ isWebhookListFetchRequestLoading || isDeletingWebhook }
                listItemLimit={ itemsPerPage }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                showPagination={ totalPages > 1 }
                showTopActionPanel={
                    isWebhookListFetchRequestLoading ||
                    !((!searchQuery || searchQuery.trim() === "") && enhancedWebhookList?.totalResults <= 0)
                }
                totalPages={ totalPages }
                totalListSize={ filteredWebhooks.length }
                data-componentid={ `${_componentId}-list-layout` }
            >
                <WebhookList
                    isLoading={ isWebhookListFetchRequestLoading || isDeletingWebhook }
                    list={ enhancedWebhookList }
                    onWebhookDelete={ handleWebhookDelete }
                    onWebhookEdit={ navigateToWebhookEdit }
                    onEmptyListPlaceholderActionClick={ navigateToWebhookCreation }
                    onSearchQueryClear={ handleSearchQueryClear }
                    searchQuery={ searchQuery }
                />
            </ListLayout>
        </PageLayout>
    );
};

export default WebhooksPage;
