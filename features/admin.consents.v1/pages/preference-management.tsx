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

import { Show } from "@wso2is/access-control";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { AppState } from "@wso2is/admin.core.v1/store";
import {
    ConsentListItemInterface,
    deletePurpose,
    useGetPurposes
} from "@wso2is/common.consents.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, FeatureAccessConfigInterface, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ListLayout,
    PageLayout,
    PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { PreferenceManagementList } from "../components/preference-management-list";

/**
 * Props interface for the Preference management page component.
 */
type PreferenceManagementPageProps = IdentifiableComponentInterface;

/**
 * Preference management page.
 *
 * @param props - Props injected to the component.
 * @returns Preference management page component.
 */
const PreferenceManagementPage: FunctionComponent<PreferenceManagementPageProps> = (
    props: PreferenceManagementPageProps
): ReactElement => {
    const {
        ["data-componentid"]: componentId = "preference-management-page"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const preferenceManagementFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consents
    );

    const [ searchQuery, setSearchQuery ] = useState<string | null>(null);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingConsent, setDeletingConsent ] = useState<ConsentListItemInterface | null>(null);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ after, setAfter ] = useState<string>(undefined);
    const [ before, setBefore ] = useState<string>(undefined);
    const [ pageHistory, setPageHistory ] = useState<string[]>([]);

    const {
        data: consentResponse,
        mappedData: consents,
        isLoading: isConsentsLoading,
        mutate: mutateConsents
    } = useGetPurposes({
        after,
        before,
        filter: searchQuery
            ? `${searchQuery} and type eq Preference`
            : "type eq Preference",
        limit: listItemLimit
    });

    const getCursorFromHref = (rel: "next" | "previous"): string | undefined => {
        const link: { rel: string; href: string } | undefined =
            consentResponse?.links?.find((l: { rel: string; href: string }) => l.rel === rel);

        if (!link) {
            return undefined;
        }

        try {
            const url: URL = new URL(link.href);

            return url.searchParams.get(rel === "next" ? "after" : "before") ?? undefined;
        } catch {
            return undefined;
        }
    };

    const hasNextPage: boolean = !!consentResponse?.links?.find(
        (l: { rel: string; href: string }) => l.rel === "next"
    );

    const hasPreviousPage: boolean = pageHistory.length > 0 || !!consentResponse?.links?.find(
        (l: { rel: string; href: string }) => l.rel === "previous"
    );

    const activePage: number = pageHistory.length + 1;

    const virtualTotalPages: number = activePage + (hasNextPage ? 1 : 0);

    /**
     * Handles the search filter.
     *
     * @param query - Search query.
     */
    const handleFilter = (query: string): void => {
        setSearchQuery(query);
        setAfter(undefined);
        setBefore(undefined);
        setPageHistory([]);
    };

    /**
     * Handles the items per page dropdown change.
     *
     * @param _event - Mouse event.
     * @param data - Dropdown data.
     */
    const handleItemsPerPageDropdownChange = (_event: MouseEvent<HTMLAnchorElement>, data: DropdownProps): void => {
        setListItemLimit(data.value as number);
        setAfter(undefined);
        setBefore(undefined);
        setPageHistory([]);
    };

    /**
     * Handles pagination changes.
     *
     * @param _event - Mouse event.
     * @param data - Pagination data.
     */
    const handlePaginationChange = (_event: MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        const targetPage: number = data.activePage as number;

        if (targetPage === activePage) {
            return;
        }

        if (targetPage > activePage) {
            if (!hasNextPage) {
                return;
            }

            const nextAfter: string = getCursorFromHref("next");

            if (nextAfter) {
                setPageHistory([ ...pageHistory, after || "" ]);
                setAfter(nextAfter);
                setBefore(undefined);
            }

            return;
        }

        if (targetPage < activePage) {
            if (!hasPreviousPage) {
                return;
            }

            const newHistory: string[] = [ ...pageHistory ];
            const prevBefore: string = newHistory.pop();

            setPageHistory(newHistory);
            setBefore(prevBefore || undefined);
            setAfter(undefined);
        }
    };

    /**
     * Handles the consent delete action.
     */
    const handleDeleteConsent = (): void => {
        if (!deletingConsent) {
            return;
        }

        setIsDeleting(true);

        deletePurpose(deletingConsent.id)
            .then((): void => {
                dispatch(addAlert({
                    description: t("consents:preferenceManagement.notifications.delete.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consents:preferenceManagement.notifications.delete.success.message")
                }));
                mutateConsents();
            })
            .catch((error: IdentityAppsApiException): void => {
                const status: number = error?.response?.status;
                let description: string;
                let message: string;

                switch (status) {
                    case 404:
                        description = t(
                            "consents:preferenceManagement.notifications.delete.error.notFound.description"
                        );
                        message = t("consents:preferenceManagement.notifications.delete.error.notFound.message");

                        break;
                    case 409:
                        description = t(
                            "consents:preferenceManagement.notifications.delete.error.conflict.description"
                        );
                        message = t("consents:preferenceManagement.notifications.delete.error.conflict.message");

                        break;
                    default:
                        if (status >= 500) {
                            description = t(
                                "consents:preferenceManagement.notifications.delete.error.serverError.description"
                            );
                            message = t(
                                "consents:preferenceManagement.notifications.delete.error.serverError.message"
                            );
                        } else {
                            description = t("consents:preferenceManagement.notifications.delete.error.description");
                            message = t("consents:preferenceManagement.notifications.delete.error.message");
                        }
                }

                dispatch(addAlert({
                    description,
                    level: AlertLevels.ERROR,
                    message
                }));
            })
            .finally((): void => {
                setIsDeleting(false);
                setShowDeleteConfirmationModal(false);
                setDeletingConsent(null);
            });
    };

    return (
        <PageLayout
            pageTitle={ t("consents:preferenceManagement.pages.list.title") }
            title={ t("consents:preferenceManagement.pages.list.heading") }
            description={ t("consents:preferenceManagement.pages.list.description") }
            data-componentid={ `${componentId}-layout` }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
                },
                text: t("governanceConnectors:goBackLoginAndRegistration")
            } }
            action={ (
                (consents?.length ?? 0) > 0 ? (
                    <Show when={ preferenceManagementFeatureConfig?.scopes?.create }>
                        <PrimaryButton
                            onClick={ (): void => {
                                history.push(AppConstants.getPaths().get("PREFERENCE_MANAGEMENT_NEW"));
                            } }
                            data-componentid={ `${componentId}-add-button` }
                        >
                            <Icon name="add" />
                            { t("consents:preferenceManagement.pages.list.actions.addConsent") }
                        </PrimaryButton>
                    </Show>
                ) : null
            ) }
        >
            <ListLayout
                advancedSearch={ (
                    <AdvancedSearchWithBasicFilters
                        onFilter={ handleFilter }
                        filterAttributeOptions={ [
                            {
                                key: 0,
                                text: t("common:name"),
                                value: "name"
                            }
                        ] }
                        filterAttributePlaceholder={ t("common:name") }
                        placeholder={ t("consents:preferenceManagement.pages.list.search.placeholder") }
                        defaultSearchAttribute={ "name" }
                        defaultSearchOperator={ "co" }
                        triggerClearQuery={ triggerClearQuery }
                        data-componentid={ `${ componentId }-list-advanced-search` }
                    />
                ) }
                currentListSize={ consents?.length ?? 0 }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                onPageChange={ handlePaginationChange }
                onSortStrategyChange={ () => { } }
                showPagination={ true }
                showTopActionPanel={ true }
                totalPages={ virtualTotalPages }
                totalListSize={
                    (activePage - 1) * listItemLimit + (consents?.length ?? 0) + (hasNextPage ? 1 : 0)
                }
                isLoading={ isConsentsLoading }
                paginationOptions={ {
                    disableNextButton: !hasNextPage,
                    disablePreviousButton: !hasPreviousPage
                } }
                data-componentid={ `${ componentId }-list-layout` }
            >
                <PreferenceManagementList
                    list={ consents }
                    isLoading={ isConsentsLoading }
                    searchQuery={ searchQuery }
                    onSearchQueryClear={ (): void => {
                        setSearchQuery(null);
                        setTriggerClearQuery(!triggerClearQuery);
                        setAfter(undefined);
                        setBefore(undefined);
                        setPageHistory([]);
                    } }
                    onAddConsentClick={ (): void => {
                        history.push(AppConstants.getPaths().get("PREFERENCE_MANAGEMENT_NEW"));
                    } }
                    onEditConsentClick={ (consent: ConsentListItemInterface) => {
                        history.push(AppConstants.getPaths().get("PREFERENCE_MANAGEMENT_EDIT")
                            .replace(":id", consent.id));
                    } }
                    onDeleteConsentClick={ (consent: ConsentListItemInterface) => {
                        setDeletingConsent(consent);
                        setShowDeleteConfirmationModal(true);
                    } }
                    data-componentid={ `${componentId}-list` }
                />
            </ListLayout>
            {
                showDeleteConfirmationModal && (
                    <ConfirmationModal
                        onClose={ () => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={
                            t("consents:preferenceManagement.pages.deleteConfirmation.assertionHint")
                        }
                        assertionType="checkbox"
                        primaryAction={
                            t("consents:preferenceManagement.pages.deleteConfirmation.primaryAction")
                        }
                        secondaryAction={
                            t("consents:preferenceManagement.pages.deleteConfirmation.secondaryAction")
                        }
                        onSecondaryActionClick={ () => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ () => handleDeleteConsent() }
                        data-componentid={ `${ componentId }-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                        primaryActionLoading={ isDeleting }
                    >
                        <ConfirmationModal.Header
                            data-componentid={ `${ componentId }-delete-confirmation-modal-header` }
                        >
                            { t("consents:preferenceManagement.pages.deleteConfirmation.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-componentid={ `${ componentId }-delete-confirmation-modal-message` }
                        >
                            { t("consents:preferenceManagement.pages.deleteConfirmation.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-componentid={ `${ componentId }-delete-confirmation-modal-content` }
                        >
                            { t("consents:preferenceManagement.pages.deleteConfirmation.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </PageLayout>
    );
};

export default PreferenceManagementPage;
