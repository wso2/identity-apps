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

import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";
import { RealmConfigInterface } from "@wso2is/admin.server-configurations.v1";
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
    LinkButton,
    TableActionsInterface,
    TableColumnInterface,
    UserAvatar
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Header, ListItemProps, SemanticICONS } from "semantic-ui-react";
import { deleteUser } from "../api";
import { UserBasicInterface } from "../models/user";

/**
 * Prop types for the liked accounts component.
 */
interface UsersListProps extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
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
     * On user delete callback.
     *
     * @param userId - ID of the deleting user.
     */
    onUserDelete?: () => void;
    /**
     * Callback to inform the new set of visible columns.
     * @param columns - New columns.
     */
    onColumnSelectionChange?: (columns: TableColumnInterface[]) => void;
    /**
     * Callback to be fired when the empty list placeholder action is clicked.
     */
    onEmptyListPlaceholderActionClick?: () => void;
    /**
     * On list item select callback.
     */
    onListItemClick?: (event: SyntheticEvent, data: ListItemProps) => void;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Admin user details content.
     */
    realmConfigs: RealmConfigInterface;
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
     * Show/Hide meta content.
     */
    showMetaContent?: boolean;
    /**
     * Meta column list for the user list.
     */
    userMetaListContent?: Map<string, string>;
    /**
     * Users list.
     */
    usersList: any;
    /**
     * Indicates whether the currently selected user store is read-only or not.
     */
    isReadOnlyUserStore?: boolean;
}

/**
 * Users info page.
 *
 * @param props - Props injected to the component.
 * @returns Users list component.
 */
export const UsersList: React.FunctionComponent<UsersListProps> = (props: UsersListProps): ReactElement => {
    const {
        advancedSearch,
        defaultListItemLimit,
        onUserDelete,
        isLoading,
        onColumnSelectionChange,
        onListItemClick,
        onSearchQueryClear,
        searchQuery,
        selection,
        usersList,
        isReadOnlyUserStore,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<UserBasicInterface>(undefined);
    const [ loading, setLoading ] = useState(false);

    const handleUserEdit = (userId: string) => {
        history.push(AppConstants.getPaths().get("USER_EDIT").replace(":id", userId));
    };

    const handleUserDelete = (userId: string): Promise<void> => {
        return deleteUser(userId)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "users:notifications.deleteUser.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "users:notifications.deleteUser.success.message"
                        )
                    })
                );
                onUserDelete();
            }).catch((error: AxiosError) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t("users:" +
                        "notifications.deleteUser.error.message")
                        })
                    );

                    return;
                }
                dispatch(
                    addAlert({
                        description: t("users:" +
                            "notifications.deleteUser.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("users:" +
                            "notifications.deleteUser.genericError.message")
                    })
                );
            });
    };

    /**
     * Resolves data table columns.
     *
     * @returns the data table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        const defaultColumns: TableColumnInterface[] = [
            {
                allowToggleVisibility: false,
                dataIndex: "id",
                id: "id",
                key: "id",
                render: (user: any): ReactNode => {
                    const header: string = user?.attributes?.username ?? user?.id;
                    const firstName: string = user?.attributes?.name?.givenname;
                    const givenName: string = user?.attributes?.name?.lastname;

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ testId }-item-heading` }
                        >
                            <UserAvatar
                                data-componentid="users-list-item-image"
                                name={ user?.id }
                                size="mini"
                                image={ user.profileUrl }
                                spaced="right"
                                data-suppress=""
                            />
                            <Header.Content className="pl-0">
                                <div>
                                    { header as ReactNode }
                                </div>
                                {
                                    (!isEmpty(firstName) || !isEmpty(givenName)) &&
                                        (<Header.Subheader
                                            data-componentid={ `${ testId }-item-sub-heading` }
                                        >
                                            { `${ firstName && firstName } ${ givenName && givenName }` }
                                        </Header.Subheader>)
                                }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "User"
            }
        ];

        defaultColumns.push(
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: ""
            }
        );

        return defaultColumns;
    };

    /**
     * Resolves data table actions.
     *
     * @returns Table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        const actions: TableActionsInterface[] = [
            {
                "data-componentid": "users-list-item-edit-button",
                icon: (): SemanticICONS => "pencil alternate",
                onClick: (e: SyntheticEvent, user: UserBasicInterface): void =>
                    handleUserEdit(user?.id),
                popupText: () => t("common:edit"),
                renderer: "semantic-icon"
            }
        ];

        actions.push({
            "data-componentid": "users-list-item-delete-button",
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e: SyntheticEvent, user: UserBasicInterface): void => {
                setShowDeleteConfirmationModal(true);
                setDeletingUser(user);
            },
            popupText: (): string => t("users:usersList.list.iconPopups.delete"),
            renderer: "semantic-icon"
        });

        return actions;
    };

    /**
     * Shows list placeholders.
     *
     * @returns Placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("users:usersList.search.emptyResultPlaceholder.clearButton") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("users:usersList.search.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("users:usersList.search.emptyResultPlaceholder.subTitle.0",
                            { query: searchQuery }),
                        t("users:usersList.search.emptyResultPlaceholder.subTitle.1")
                    ] }
                />
            );
        }

        if (isEmpty(usersList) || usersList.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${testId}-empty-placeholder` }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={
                        isReadOnlyUserStore
                            ? t("users:usersList.list.emptyResultPlaceholder.emptyUsers")
                            : t("users:usersList.list.emptyResultPlaceholder.title")
                    }
                    subtitle={
                        isReadOnlyUserStore
                            ? [
                                t("users:usersList.list.emptyResultPlaceholder.subTitle.0")
                            ]
                            : [
                                t("users:usersList.list.emptyResultPlaceholder.subTitle.0"),
                                t("users:usersList.list.emptyResultPlaceholder.subTitle.1"),
                                t("users:usersList.list.emptyResultPlaceholder.subTitle.2")
                            ]
                    }
                />
            );
        }

        return null;
    };

    return (
        <>
            <DataTable<UserBasicInterface>
                className="users-table"
                externalSearch={ advancedSearch }
                isLoading={ isLoading }
                loadingStateOptions={ {
                    count: defaultListItemLimit ?? UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                    imageType: "circular"
                } }
                actions={ resolveTableActions() }
                columns={ resolveTableColumns() }
                data={ usersList }
                onColumnSelectionChange={ onColumnSelectionChange }
                onRowClick={ (e: SyntheticEvent, user: UserBasicInterface): void => {
                    handleUserEdit(user?.id);
                    onListItemClick && onListItemClick(e, user);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ true }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
            <ConfirmationModal
                primaryActionLoading={ loading }
                data-testid={ `${ testId }-confirmation-modal` }
                data-componentid={ `${ testId }-confirmation-modal` }
                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                type="negative"
                open={ showDeleteConfirmationModal }
                assertionHint={ t("user:deleteUser.confirmationModal." +
                    "assertionHint") }
                assertionType="checkbox"
                primaryAction="Confirm"
                secondaryAction="Cancel"
                onSecondaryActionClick={ (): void => {
                    setShowDeleteConfirmationModal(false);
                } }
                onPrimaryActionClick={ (): void => {
                    setLoading(true);
                    handleUserDelete(deletingUser?.id).finally(() => {
                        setLoading(false);
                        setDeletingUser(undefined);
                        setShowDeleteConfirmationModal(false);
                    });
                } }
                closeOnDimmerClick={ false }
            >
                <ConfirmationModal.Header
                    data-testid={ `${ testId }-confirmation-modal-header` }
                    data-componentid={ `${ testId }-confirmation-modal-header` }
                >
                    { t("user:deleteUser.confirmationModal.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    data-testid={ `${testId}-confirmation-modal-message` }
                    attached
                    negative
                >
                    { t("user:deleteUser.confirmationModal.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content
                    data-testid={ `${ testId }-confirmation-modal-content` }
                    data-componentid={ `${ testId }-confirmation-modal-content` }
                >
                    {
                        deletingUser && deletingUser[SCIMConfigs.scim.systemSchema]?.userSourceId
                            ? t("user:deleteJITUser.confirmationModal.content")
                            : t("user:deleteUser.confirmationModal.content")
                    }
                </ConfirmationModal.Content>
            </ConfirmationModal>
        </>
    );
};

/**
 * Default props for the component.
 */
UsersList.defaultProps = {
    selection: true,
    showListItemActions: true,
    showMetaContent: true
};
