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

import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import {
    ConsentListItemInterface,
    deletePurpose,
    useGetPurposes
} from "@wso2is/common.consents.v1";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    ListLayout,
    PageLayout,
    PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, MouseEvent, ReactElement, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { DropdownProps, Icon, PaginationProps } from "semantic-ui-react";
import { PolicyConsentsList } from "../components/policy-consents-list";

/**
 * Props interface for the Policy Consents page component.
 */
type PolicyConsentsPageProps = IdentifiableComponentInterface;

/**
 * Policy Consents page.
 *
 * @param props - Props injected to the component.
 * @returns Policy Consents page component.
 */
const PolicyConsentsPage: FunctionComponent<PolicyConsentsPageProps> = (props: PolicyConsentsPageProps): ReactElement => {
    const {
        ["data-componentid"]: componentId = "policy-consents-page"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingConsent, setDeletingConsent ] = useState<ConsentListItemInterface>(null);
    const [ isDeleting, setIsDeleting ] = useState<boolean>(false);

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
            ? `${searchQuery} and type eq Policy`
            : "type eq Policy",
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

    const hasNextPage: boolean = useMemo((): boolean => {
        return !!consentResponse?.links?.find(l => l.rel === "next");
    }, [ consentResponse ]);

    const hasPreviousPage: boolean = useMemo((): boolean => {
        return pageHistory.length > 0 || !!consentResponse?.links?.find(l => l.rel === "previous");
    }, [ consentResponse, pageHistory ]);

    const activePage: number = useMemo((): number => {
        return pageHistory.length + 1;
    }, [ pageHistory ]);

    const virtualTotalPages: number = useMemo((): number => {
        return activePage + (hasNextPage ? 1 : 0);
    }, [ activePage, hasNextPage ]);

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
                setPageHistory([ ...pageHistory, before || "" ]);
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
                    description: t("consents:notifications.delete.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("consents:notifications.delete.success.message")
                }));
                mutateConsents();
            })
            .catch((error: IdentityAppsApiException): void => {
                const status: number = error?.response?.status;
                let description: string;
                let message: string;

                switch (status) {
                    case 404:
                        description = t("consents:notifications.delete.error.notFound.description");
                        message = t("consents:notifications.delete.error.notFound.message");

                        break;
                    case 409:
                        description = t("consents:notifications.delete.error.conflict.description");
                        message = t("consents:notifications.delete.error.conflict.message");

                        break;
                    default:
                        if (status >= 500) {
                            description = t("consents:notifications.delete.error.serverError.description");
                            message = t("consents:notifications.delete.error.serverError.message");
                        } else {
                            description = t("consents:notifications.delete.error.description");
                            message = t("consents:notifications.delete.error.message");
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
            pageTitle={ t("consents:pages.list.title") }
            title={ t("consents:pages.list.heading") }
            description={ t("consents:pages.list.description") }
            data-componentid={ `${componentId}-layout` }
            backButton={ {
                onClick: () => {
                    history.push(AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"));
                },
                text: t("consents:pages.list.backButton")
            } }
            action={ (
                <PrimaryButton
                    onClick={ (): void => {
                        history.push(AppConstants.getPaths().get("POLICY_CONSENTS_NEW"));
                    } }
                    data-componentid={ `${componentId}-add-button` }
                >
                    <Icon name="add" />
                    { t("consents:pages.list.actions.addPolicy") }
                </PrimaryButton>
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
                        placeholder={ t("consents:pages.list.search.placeholder") }
                        defaultSearchAttribute={ "name" }
                        defaultSearchOperator={ "co" }
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
                totalListSize={ (activePage - 1) * listItemLimit + (consents?.length ?? 0) + (hasNextPage ? 1 : 0) }
                isLoading={ isConsentsLoading }
                paginationOptions={ {
                    disableNextButton: !hasNextPage,
                    disablePreviousButton: !hasPreviousPage
                } }
                data-componentid={ `${ componentId }-list-layout` }
            >
                <PolicyConsentsList
                    list={ consents }
                    isLoading={ isConsentsLoading }
                    onAddConsentClick={ (): void => {
                        history.push(AppConstants.getPaths().get("POLICY_CONSENTS_NEW"));
                    } }
                    onEditConsentClick={ (consent: ConsentListItemInterface) => {
                        history.push(AppConstants.getPaths().get("POLICY_CONSENTS_EDIT")
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
                        assertionHint={ t("consents:pages.list.deleteConfirmation.assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("consents:pages.list.deleteConfirmation.primaryAction") }
                        secondaryAction={ t("consents:pages.list.deleteConfirmation.secondaryAction") }
                        onSecondaryActionClick={ () => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ () => handleDeleteConsent() }
                        data-componentid={ `${ componentId }-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                        primaryActionLoading={ isDeleting }
                    >
                        <ConfirmationModal.Header
                            data-componentid={ `${ componentId }-delete-confirmation-modal-header` }
                        >
                            { t("consents:pages.list.deleteConfirmation.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-componentid={ `${ componentId }-delete-confirmation-modal-message` }
                        >
                            { t("consents:pages.list.deleteConfirmation.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-componentid={ `${ componentId }-delete-confirmation-modal-content` }
                        >
                            { t("consents:pages.list.deleteConfirmation.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </PageLayout>
    );
};

export default PolicyConsentsPage;
