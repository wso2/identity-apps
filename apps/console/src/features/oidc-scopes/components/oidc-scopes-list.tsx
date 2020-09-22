/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    FeatureConfigInterface,
    LoadableComponentInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { ApplicationManagementConstants } from "../../applications";
import {
    AppConstants,
    AppState,
    EmptyPlaceholderIllustrations,
    history
} from "../../core";
import { deleteOIDCScope } from "../api";
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
     * @param {React.SyntheticEvent} event - Click event.
     * @param {OIDCScopesListInterface} scope - Selected Scope.
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
}

/**
 * OIDC scope list component.
 *
 * @param {OIDCScopesListPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
        onScopeDelete,
        onListItemClick,
        onEmptyListPlaceholderActionClick,
        selection,
        showListItemActions,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingScope, setDeletingScope ] = useState<OIDCScopesListInterface>(undefined);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.scope);

    /**
     * Redirects to the OIDC scope edit page when the edit button is clicked.
     *
     * @param {string} scopeName - scope name.
     */
    const handleOIDCScopesEdit = (scopeName: string): void => {
        history.push(AppConstants.getPaths().get("OIDC_SCOPES_EDIT").replace(":id", scopeName));
    };

    /**
     * Deletes a scope when the delete scope button is clicked.
     *
     * @param scopeName
     */
    const handleOIDCScopeDelete = (scopeName: string): void => {
        deleteOIDCScope(scopeName)
            .then(() => {
                setDeletingScope(undefined);
                onScopeDelete();
                dispatch(addAlert({
                    description: t("devPortal:components.oidcScopes.notifications.deleteOIDCScope.success" +
                        ".description"),
                    level: AlertLevels.SUCCESS,
                    message: t("devPortal:components.oidcScopes.notifications.deleteOIDCScope.success.message")
                }));

                setShowDeleteConfirmationModal(false);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: t("devPortal:components.oidcScopes.notifications.deleteOIDCScope.error" +
                            ".message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("devPortal:components.oidcScopes.notifications.deleteOIDCScope" +
                        ".genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("devPortal:components.oidcScopes.notifications.deleteOIDCScope.genericError" +
                        ".message")
                }));
            });
    };

    /**
     * Resolves data table columns.
     *
     * @return {TableColumnInterface[]}
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (scope: OIDCScopesListInterface): ReactNode => (
                    <Header as="h6" image>
                        <AnimatedAvatar
                            name={ scope.name }
                            size="mini"
                            floated="left"
                            data-testid={ `${ testId }-item-image` }
                        />
                        <Header.Content>
                            { scope.displayName || scope.name }
                            <Header.Subheader>
                                { scope.description }
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                ),
                title: t("devPortal:components.oidcScopes.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("devPortal.components.oidcScopes.list.columns.actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @return {TableActionsInterface[]}
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
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (e: SyntheticEvent, scope: OIDCScopesListInterface): void =>
                    handleOIDCScopesEdit(scope?.name),
                popupText: (): string => t("common:edit"),
                renderer: "semantic-icon"
            }
        ];

        actions.push({
            hidden: (): boolean => !hasRequiredScopes(
                featureConfig?.applications,
                featureConfig?.applications?.scopes?.delete, allowedScopes),
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
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        if (list instanceof Array && list?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ onEmptyListPlaceholderActionClick && (
                        <PrimaryButton onClick={ onEmptyListPlaceholderActionClick }>
                            <Icon name="add"/>
                            { t("devPortal:components.oidcScopes.placeholders.emptyList.action") }
                        </PrimaryButton>
                    ) }
                    image={ EmptyPlaceholderIllustrations?.newList }
                    imageSize="tiny"
                    title={ t("devPortal:components.oidcScopes.placeholders.emptyList.title") }
                    subtitle={ [
                        t("devPortal:components.oidcScopes.placeholders.emptyList.subtitles.0"),
                        t("devPortal:components.oidcScopes.placeholders.emptyList.subtitles.1"),
                        t("devPortal:components.oidcScopes.placeholders.emptyList.subtitles.2")
                    ] }
                    data-testid={ `${ testId }-empty-placeholder` }
                />
            );
        }

        return null;
    };

    return (
        <>
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
            {
                deletingScope && (
                    <ConfirmationModal
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="warning"
                        open={ showDeleteConfirmationModal }
                        assertion={ deletingScope.name }
                        assertionHint={ (
                            <p>
                                <Trans
                                    i18nKey={
                                        "devPortal:components.oidcScopes.confirmationModals.deleteScope" +
                                        ".assertionHint"
                                    }
                                    tOptions={ { name: deletingScope.name } }
                                >
                                    Please type <strong>{ deletingScope.name }</strong> to confirm.
                                </Trans>
                            </p>
                        ) }
                        assertionType="input"
                        primaryAction={ t("common:confirm") }
                        secondaryAction={ t("common:cancel") }
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleOIDCScopeDelete(deletingScope.name) }
                        data-testid={ `${ testId }-delete-confirmation-modal` }
                    >
                        <ConfirmationModal.Header
                            data-testid={ `${ testId }-delete-confirmation-modal-header` }
                        >
                            { t("devPortal:components.oidcScopes.confirmationModals.deleteScope.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            attached
                            warning
                            data-testid={ `${ testId }-delete-confirmation-modal-message` }
                        >
                            { t("devPortal:components.oidcScopes.confirmationModals.deleteScope.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content
                            data-testid={ `${ testId }-delete-confirmation-modal-content` }
                        >
                            { t("devPortal:components.oidcScopes.confirmationModals.deleteScope.content") }
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
    selection: true,
    showListItemActions: true
};
