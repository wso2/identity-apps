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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    LoadableComponentInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    Code,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface,
    TableDataInterface
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { ApplicationManagementConstants } from "../../admin.applications.v1/constants";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    getEmptyPlaceholderIllustrations,
    history
} from "../../admin.core.v1";
import { deleteOIDCScope } from "../api";
import { OIDCScopesManagementConstants } from "../constants";
import { OIDCScopesListInterface } from "../models";

/**
 *
 * Proptypes for the OIDC scopes list component.
 */
interface OIDCScopesListPropsInterface extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    TestableComponentInterface {

    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * Application list.
     */
    list: OIDCScopesListInterface[];
    /**
     * On scope delete callback.
     */
    onScopeDelete?: () => void;
    /**
     * On list item select callback.
     *
     * @param event - Click event.
     * @param scope - Selected Scope.
     */
    onListItemClick?: (event: SyntheticEvent, scope: OIDCScopesListInterface) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Search query string
     */
    searchResult?: number;
    /**
     * Callback to clear the search query string.
     */
    clearSearchQuery?: () => void;
}

/**
 * OIDC scope list component.
 *
 * @param props - Props injected to the component.
 *
 * @returns The OIDC Scope List Component.
 */
export const OIDCScopeList: FunctionComponent<OIDCScopesListPropsInterface> = (
    props: OIDCScopesListPropsInterface
): ReactElement => {

    const {
        advancedSearch,
        defaultListItemLimit,
        featureConfig,
        isLoading,
        list,
        searchResult,
        clearSearchQuery,
        onScopeDelete,
        onListItemClick,
        onEmptyListPlaceholderActionClick,
        selection,
        showListItemActions,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingScope, setDeletingScope ] = useState<OIDCScopesListInterface>(undefined);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    /**
     * Redirects to the OIDC scope edit page when the edit button is clicked.
     *
     * @param scopeName - The Scope name.
     */
    const handleOIDCScopesEdit = (scopeName: string): void => {
        history.push(AppConstants.getPaths().get("OIDC_SCOPES_EDIT").replace(":id", scopeName));
    };

    /**
     * Deletes a scope when the delete scope button is clicked.
     *
     * @param scopeName - The Scope name.
     */
    const handleOIDCScopeDelete = (scopeName: string): void => {
        deleteOIDCScope(scopeName)
            .then(() => {
                setDeletingScope(undefined);
                onScopeDelete();
                dispatch(addAlert({
                    description: t("oidcScopes:notifications.deleteOIDCScope.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("oidcScopes:notifications.deleteOIDCScope.success.message")
                }));

                setShowDeleteConfirmationModal(false);
            })
            .catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("oidcScopes:notifications.deleteOIDCScope.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("oidcScopes:notifications.deleteOIDCScope" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("oidcScopes:notifications.deleteOIDCScope.genericError" +
                        ".message")
                }));
            });
    };

    /**
     * Resolves data table columns.
     *
     * @returns - The table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (scope: OIDCScopesListInterface): ReactNode => (
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-testid={ `${ testId }-item-heading` }
                    >
                        <AppAvatar
                            image={ (
                                <AnimatedAvatar
                                    name={ scope.displayName }
                                    size="mini"
                                    data-testid={ `${ testId }-item-image-inner` }
                                />
                            ) }
                            size="mini"
                            spaced="right"
                            data-testid={ `${ testId }-item-image` }
                        />
                        <Header.Content>
                            { scope.displayName }
                            <Header.Subheader>
                                <Code withBackground>{ scope.name }</Code>
                                { " " + (scope.description ?? "") }
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                ),
                title: t("oidcScopes:list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("oidcScopes:list.columns.actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @returns - The table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        const actions: TableActionsInterface[] = [
            {
                hidden: (): boolean => !isFeatureEnabled(
                    featureConfig?.applications,
                    ApplicationManagementConstants.FEATURE_DICTIONARY.get("APPLICATION_EDIT")),
                icon: (): SemanticICONS =>
                    hasRequiredScopes(
                        featureConfig?.oidcScopes, featureConfig?.oidcScopes?.scopes?.update, allowedScopes)
                        ? "pencil alternate"
                        : "eye",
                onClick: (e: SyntheticEvent, scope: OIDCScopesListInterface): void =>
                    handleOIDCScopesEdit(scope?.name),
                popupText: (): string => hasRequiredScopes(
                    featureConfig?.oidcScopes, featureConfig?.oidcScopes?.scopes?.update, allowedScopes)
                    ? t("common:edit")
                    : t("common:view"),
                renderer: "semantic-icon"
            }
        ];

        actions.push({
            hidden: (item: TableDataInterface<OIDCScopesListInterface>): boolean => {
                return !hasRequiredScopes(
                    featureConfig?.applications,
                    featureConfig?.applications?.scopes?.delete, allowedScopes)
                    || item.name === OIDCScopesManagementConstants.OPEN_ID_SCOPE
                    || OIDCScopesManagementConstants.OIDC_READONLY_SCOPES.includes(item.name);
            },
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e: SyntheticEvent, scope: OIDCScopesListInterface): void => {
                setShowDeleteConfirmationModal(true);
                setDeletingScope(scope);
            },
            popupText: (): string => t("common:delete"),
            renderer: "semantic-icon"
        });

        return actions;
    };

    /**
     * Resolve the relevant placeholder.
     *
     * @returns The placeholders.
     */
    const showPlaceholders = (): ReactElement => {

        if (searchResult === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ () => clearSearchQuery() }>
                            { t("oidcScopes:placeholders.emptySearch.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("oidcScopes:placeholders.emptySearch.title") }
                    subtitle={ [
                        t("oidcScopes:placeholders.emptySearch.subtitles.0"),
                        t("oidcScopes:placeholders.emptySearch.subtitles.1")
                    ] }
                    data-testid={ `${ testId }-empty-search-placeholder` }
                />
            );
        }

        if (!isLoading && list?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ onEmptyListPlaceholderActionClick && (
                        <Show when={ AccessControlConstants.SCOPE_WRITE }>
                            <PrimaryButton onClick={ onEmptyListPlaceholderActionClick }>
                                <Icon name="add"/>
                                { t("oidcScopes:placeholders.emptyList.action") }
                            </PrimaryButton>
                        </Show>
                    ) }
                    image={ getEmptyPlaceholderIllustrations()?.newList }
                    imageSize="tiny"
                    title={ t("oidcScopes:placeholders.emptyList.title") }
                    subtitle={ [
                        t("oidcScopes:placeholders.emptyList.subtitles.0"),
                        t("oidcScopes:placeholders.emptyList.subtitles.1"),
                        t("oidcScopes:placeholders.emptyList.subtitles.2")
                    ] }
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <>
            {
                <DataTable<OIDCScopesListInterface>
                    className="oidc-scopes-table"
                    externalSearch={ advancedSearch }
                    isLoading={ isLoading }
                    loadingStateOptions={ {
                        count: defaultListItemLimit,
                        imageType: "square"
                    } }
                    actions={ resolveTableActions() }
                    columns={ resolveTableColumns() }
                    data={ list }
                    onRowClick={
                        (e: SyntheticEvent, scope: OIDCScopesListInterface): void => {
                            handleOIDCScopesEdit(scope?.name);
                            onListItemClick(e, scope);
                        }
                    }
                    placeholders={ showPlaceholders() }
                    transparent={ !isLoading && (showPlaceholders() !== null) }
                    selectable={ selection }
                    showHeader={ false }
                    data-testid={ testId }
                />
            }
            {
                deletingScope && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingScope.name }
                        assertionHint={ t("oidcScopes:confirmationModals.deleteScope" +
                        ".assertionHint") }
                        assertionType="checkbox"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleOIDCScopeDelete(deletingScope.name) }
                        data-testid={ `${ testId }-delete-confirmation-modal` }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${ testId }-delete-confirmation-modal-header` }
                        >
                            { t("oidcScopes:confirmationModals.deleteScope.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            negative
                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                        >
                            { t("oidcScopes:confirmationModals.deleteScope.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                        >
                            { t("oidcScopes:confirmationModals.deleteScope.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};

/**
 * Default props for the component.
 */
OIDCScopeList.defaultProps = {
    "data-testid": "scope-list",
    defaultListItemLimit: 10,
    isLoading: false,
    onListItemClick: () => null,
    selection: true,
    showListItemActions: true
};
