/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    getEmptyPlaceholderIllustrations,
    history
} from "@wso2is/admin.core.v1";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import { UserstoreConstants } from "@wso2is/core/constants";
import { IdentityAppsError } from "@wso2is/core/errors";
import { hasRequiredScopes } from "@wso2is/core/helpers";
import {
    AlertLevels,
    LoadableComponentInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    GenericIcon,
    LinkButton,
    Popup,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Header, Icon, SemanticICONS } from "semantic-ui-react";
import { deleteUserStore } from "../api";
import { getTableIcons } from "../configs";
import { CONSUMER_USERSTORE, CONSUMER_USERSTORE_ID } from "../constants";
import { UserStoreListItem } from "../models";

/**
 * Prop types of the `UserStoresList` component
 */
interface UserStoresListPropsInterface extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
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
     * The userstore list
     */
    list: UserStoreListItem[];
    /**
     * Initiate an update
     */
    update: () => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear: () => void;
    /**
     * Callback to be fired when clicked on the empty list placeholder action.
     */
    onEmptyListPlaceholderActionClick: () => void;
    /**
     * Search query for the list.
     */
    searchQuery: string;
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
 * This component renders the Userstore List.
 *
 * @param props - Props injected to the component.
 *
 * @returns user store list component.
 */
export const UserStoresList: FunctionComponent<UserStoresListPropsInterface> = (
    props: UserStoresListPropsInterface
): ReactElement => {

    const {
        advancedSearch,
        defaultListItemLimit,
        isLoading,
        featureConfig,
        list,
        onEmptyListPlaceholderActionClick,
        onSearchQueryClear,
        searchQuery,
        selection,
        showListItemActions,
        update,
        [ "data-testid" ]: testId
    } = props;

    const [ deleteConfirm, setDeleteConfirm ] = useState(false);
    const [ deleteID, setDeleteID ] = useState<string>(null);
    const [ deleteName, setDeleteName ] = useState<string>("");

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);

    const dispatch: Dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Delete a userstore.
     *
     * @param id -  userstore id.
     * @param name - userstore name.
     */
    const initDelete = (id: string, name: string) => {
        setDeleteID(id);
        setDeleteName(name);
        setDeleteConfirm(true);
    };

    /**
     * Closes the delete confirmation modal
     */
    const closeDeleteConfirm = () => {
        setDeleteConfirm(false);
        setDeleteName("");
        setDeleteID(null);
    };

    /**
     * Shows the delete confirmation modal
     * @returns delete confirmation modal component
     */
    const showDeleteConfirm = (): ReactElement => (
        <ConfirmationModal
            onClose={ closeDeleteConfirm }
            type={ "negative" }
            open={ deleteConfirm }
            assertion={ deleteName }
            assertionHint={
                t("userstores:confirmation.hint")
            }
            assertionType={ "checkbox" }
            primaryAction={ t("common:confirm") }
            secondaryAction={ t("common:cancel") }
            onSecondaryActionClick={ closeDeleteConfirm }
            onPrimaryActionClick={ (): void => {
                deleteUserStore(deleteID)
                    .then(() => {
                        dispatch(addAlert({
                            description: t("userstores:notifications." +
                                "deleteUserstore.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t("userstores:notifications." +
                                "deleteUserstore.success.message")

                        }));
                        dispatch(addAlert({
                            description: t("userstores:notifications." +
                                "delay.description"),
                            level: AlertLevels.WARNING,
                            message: t("userstores:notifications." +
                                "delay.message")
                        }));
                        update();
                    })
                    .catch((error: IdentityAppsError) => {
                        dispatch(addAlert({
                            description: error?.description
                                ?? t("userstores:notifications." +
                                    "deleteUserstore.genericError.description"),
                            level: AlertLevels.ERROR,
                            message: error?.message
                                ?? t("userstores:notifications." +
                                    "deleteUserstore.genericError.message")
                        }));
                    }).finally(() => {
                        closeDeleteConfirm();
                    });
            } }
            data-testid={ `${ testId }-delete-confirmation-modal` }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header
                data-testid={ `${ testId }-delete-confirmation-modal-header` }
            >
                { t("userstores:confirmation.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                negative
                data-testid={ `${ testId }-delete-confirmation-modal-message` }
            >
                { t("userstores:confirmation.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content
                data-testid={ `${ testId }-delete-confirmation-modal-content` }
            >
                { t("userstores:confirmation.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * Shows list placeholders.
     *
     * @returns placeholders for the list component when list is empty.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("console:manage.placeholders.emptySearchResult.action") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.placeholders.emptySearchResult.title") }
                    subtitle={ [
                        t("console:manage.placeholders.emptySearchResult.subtitles.0", { query: searchQuery }),
                        t("console:manage.placeholders.emptySearchResult.subtitles.1")
                    ] }
                    data-testid={ `${ testId }-empty-search-placeholder` }
                />
            );
        }

        if (list?.length === 0) {
            if (!hasRequiredScopes(featureConfig?.userStores, featureConfig?.userStores?.scopes?.create,
                allowedScopes)) {
                return (
                    <EmptyPlaceholder
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title={ t("userstores:placeholders.emptyListReadOnly.title") }
                        subtitle={ [
                            t("userstores:placeholders.emptyListReadOnly.subtitles")
                        ] }
                        data-testid={ `${ testId }-empty-placeholder` }
                    />
                );
            }

            if (!userstoresConfig.userstoreList.renderEmptyPlaceholder(onEmptyListPlaceholderActionClick)) {
                return (
                    <EmptyPlaceholder
                        action={ (
                            <PrimaryButton onClick={ onEmptyListPlaceholderActionClick }>
                                <Icon name="add" />
                                { t("userstores:placeholders.emptyList.action") }
                            </PrimaryButton>
                        ) }
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        title={ t("userstores:placeholders.emptyList.title") }
                        subtitle={ [
                            t("userstores:placeholders.emptyList.subtitles")
                        ] }
                        data-testid={ `${ testId }-empty-placeholder` }
                    />
                );
            } else {
                return userstoresConfig.userstoreList.renderEmptyPlaceholder(onEmptyListPlaceholderActionClick);
            }
        }

        return null;
    };

    const handleUserstoreEdit = (userstoreId: string) => {
        if (userstoresConfig.onUserstoreEdit(userstoreId)) {
            history.push(AppConstants.getPaths().get("USERSTORES_EDIT").replace(":id", userstoreId));
        } else {
            history.push(AppConstants.getPaths().get("USERSTORES_EDIT").replace(":id", userstoreId).replace(
                "edit-user-store", userstoresConfig.userstoreEdit.remoteUserStoreEditPath));
        }
    };

    /**
     * Resolves data table columns.
     *
     * @returns data table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        return [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (userstore: UserStoreListItem) => (
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-testid={ `${ testId }-item-heading` }
                    >
                        <GenericIcon
                            defaultIcon
                            relaxed="very"
                            size="micro"
                            shape="rounded"
                            spaced="right"
                            hoverable={ false }
                            icon={ getTableIcons().header.default }
                        />
                        <Header.Content>
                            {
                                userstore.enabled
                                    ? (
                                        <Popup
                                            trigger={ (
                                                <Icon
                                                    className="mr-2 ml-0 vertical-aligned-baseline"
                                                    size="small"
                                                    name="circle"
                                                    color="green"
                                                />
                                            ) }
                                            content={ t("common:enabled") }
                                            inverted
                                        />
                                    ) : (
                                        <Popup
                                            trigger={ (
                                                <Icon
                                                    className="mr-2 ml-0 vertical-aligned-baseline"
                                                    size="small"
                                                    name="circle"
                                                    color="orange"
                                                />
                                            ) }
                                            content={ t("common:disabled") }
                                            inverted
                                        />
                                    )
                            }
                        </Header.Content>
                        <Header.Content>
                            {
                                userstore?.name === CONSUMER_USERSTORE
                                    ? UserstoreConstants.CUSTOMER_USER_STORE_MAPPING
                                    : userstore?.name
                            }
                            <Header.Subheader>
                                { userstore.description }
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                ),
                title: t("common:name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("common:actions")
            }
        ];
    };

    /**
     * Resolves data table actions.
     *
     * @returns data table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return [];
        }

        return [
            {
                icon: (): SemanticICONS => hasRequiredScopes(featureConfig?.userStores,
                    featureConfig?.userStores?.scopes?.update, allowedScopes) ?  "pencil alternate" : "eye",
                onClick: (e: SyntheticEvent, userstore: UserStoreListItem): void => handleUserstoreEdit(userstore?.id),
                popupText: (): string => hasRequiredScopes(featureConfig?.userStores,
                    featureConfig?.userStores?.scopes?.update, allowedScopes) ? t("common:edit") : t("common:view"),
                renderer: "semantic-icon"
            },
            {
                hidden: (userstore: UserStoreListItem): boolean => {
                    return !hasRequiredScopes(featureConfig?.userStores, featureConfig?.userStores?.scopes?.delete,
                        allowedScopes) || userstore.id == CONSUMER_USERSTORE_ID || isPrivilegedUser;
                },
                icon: (): SemanticICONS => "trash alternate",
                onClick: (e: SyntheticEvent, userstore: UserStoreListItem): void =>
                    initDelete(userstore?.id, userstore?.name),
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];
    };

    return (
        <>
            { deleteConfirm && showDeleteConfirm() }
            <DataTable<UserStoreListItem>
                className="userstores-table"
                externalSearch={ advancedSearch }
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "square"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ list }
                onRowClick={ (e: SyntheticEvent, userstore: UserStoreListItem): void => {
                    handleUserstoreEdit(userstore?.id);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ false }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
        </>
    );
};

/**
 * Default props for the component.
 */
UserStoresList.defaultProps = {
    "data-testid": "userstores-list",
    selection: true,
    showListItemActions: true
};
