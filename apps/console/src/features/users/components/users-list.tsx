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

import { AccessControlConstants, Show } from "@wso2is/access-control";
import { UserstoreConstants } from "@wso2is/core/constants";
import { hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    LoadableComponentInterface,
    MultiValueAttributeInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface,
    UserAvatar
} from "@wso2is/react-components";
import moment from "moment";
import React, { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Header, Icon, ListItemProps, SemanticICONS } from "semantic-ui-react";
import { SCIMConfigs } from "../../../extensions/configs/scim";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    getEmptyPlaceholderIllustrations,
    history
} from "../../core";
import { RealmConfigInterface } from "../../server-configurations";
import { deleteUser } from "../api";
import { UserManagementConstants } from "../constants";
import { UserBasicInterface, UserListInterface } from "../models";

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
    usersList: UserListInterface;
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
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
        readOnlyUserStores,
        featureConfig,
        onColumnSelectionChange,
        onEmptyListPlaceholderActionClick,
        onListItemClick,
        onSearchQueryClear,
        realmConfigs,
        searchQuery,
        selection,
        showListItemActions,
        showMetaContent,
        userMetaListContent,
        usersList,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<UserBasicInterface>(undefined);
    const [ loading, setLoading ] = useState(false);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const handleUserEdit = (userId: string) => {
        history.push(AppConstants.getPaths().get("USER_EDIT").replace(":id", userId));
    };

    const handleUserDelete = (userId: string): Promise<void> => {
        return deleteUser(userId)
            .then(() => {
                dispatch(
                    addAlert({
                        description: t(
                            "console:manage.features.users.notifications.deleteUser.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.users.notifications.deleteUser.success.message"
                        )
                    })
                );
                onUserDelete();
            }).catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(
                        addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t("console:manage.features.users." +
                        "notifications.deleteUser.error.message")
                        })
                    );

                    return;
                }
                dispatch(
                    addAlert({
                        description: t("console:manage.features.users." +
                            "notifications.deleteUser.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.users." +
                            "notifications.deleteUser.genericError.message")
                    })
                );
            });
    };

    /**
     * Resolves data table columns.
     *
     * @returns Table columns.
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        const defaultColumns: TableColumnInterface[] = [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (user: UserBasicInterface): ReactNode => {
                    let header: string | MultiValueAttributeInterface;
                    let subHeader: string | MultiValueAttributeInterface;
                    const isNameAvailable = user.name?.familyName === undefined && user.name?.givenName === undefined;

                    if (user[SCIMConfigs.scim.enterpriseSchema]?.userSourceId) {
                        subHeader = user.emails[0]
                            ? user.emails[0]
                            : user.id;

                        header = (user.name && user.name.givenName !== undefined)
                            ? user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "")
                            : subHeader;

                    } else {
                        subHeader = user.userName.split("/")?.length > 1
                            ? user.userName.split("/")[ 1 ]
                            : user.userName.split("/")[ 0 ];

                        header = (user.name && user.name.givenName !== undefined)
                            ? user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "")
                            : subHeader;
                    }

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-testid={ `${testId}-item-heading` }
                        >
                            <UserAvatar
                                data-testid="users-list-item-image"
                                name={ user.userName }
                                size="mini"
                                image={ user.profileUrl }
                                spaced="right"
                            />
                            <Header.Content>
                                <div className={ isNameAvailable ? "mt-2" : "" }>{ header as ReactNode }</div>
                                {
                                    (!isNameAvailable) &&
                                    (
                                        <Header.Subheader
                                            data-testid={ `${testId}-item-sub-heading` }>
                                            { subHeader as ReactNode }
                                        </Header.Subheader>
                                    )
                                }
                            </Header.Content>
                        </Header>
                    );
                },
                title: t("console:manage.features.users.list.columns.name")
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: t("console:manage.features.users.list.columns.actions")
            }
        ];

        if (!showMetaContent || !userMetaListContent) {
            return defaultColumns;
        }

        const dynamicColumns: TableColumnInterface[]= [];

        for (const [ key, value ] of userMetaListContent.entries()) {
            if (key === "name" || key === "emails" || key === "profileUrl" || value === "") {
                continue;
            }

            let dynamicColumn: TableColumnInterface = {
                allowToggleVisibility: true,
                dataIndex: value,
                id: key,
                key: key,
                title: value
            };

            if (key === "meta.lastModified") {
                dynamicColumn = {
                    ...dynamicColumn,
                    render: (user: UserBasicInterface): ReactNode => {
                        const now = moment(new Date());
                        const receivedDate = moment(user?.meta?.lastModified);

                        return t("console:common.dateTime.humanizedDateString", {
                            date: moment.duration(now.diff(receivedDate)).humanize()
                        });
                    }
                };
            }

            dynamicColumns.push(dynamicColumn);
        }

        dynamicColumns.unshift(defaultColumns[0]);
        dynamicColumns.push(defaultColumns[1]);

        return dynamicColumns;
    };

    /**
     * Resolves data table actions.
     *
     * @returns Table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        const actions: TableActionsInterface[] = [
            {
                "data-testid": "users-list-item-edit-button",
                hidden: (): boolean => !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_READ")),
                icon: (user: UserBasicInterface): SemanticICONS => {
                    const userStore = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : "PRIMARY";

                    return !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
                    || !isFeatureEnabled(featureConfig?.users,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                        ? "eye"
                        : "pencil alternate";
                },
                onClick: (e: SyntheticEvent, user: UserBasicInterface): void =>
                    handleUserEdit(user?.id),
                popupText: (user: UserBasicInterface): string => {
                    const userStore = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : "PRIMARY";

                    return !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
                    || !isFeatureEnabled(featureConfig?.users,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                        ? t("common:view")
                        : t("common:edit");
                },
                renderer: "semantic-icon"
            }
        ];

        actions.push({
            "data-testid": "users-list-item-delete-button",
            hidden: (user: UserBasicInterface): boolean => {
                const userStore = user?.userName?.split("/").length > 1
                    ? user?.userName?.split("/")[0]
                    : UserstoreConstants.PRIMARY_USER_STORE;

                return !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_DELETE"))
                    || !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.delete, allowedScopes)
                    || readOnlyUserStores?.includes(userStore.toString())
                    || user.userName === realmConfigs?.adminUser;
            },
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e: SyntheticEvent, user: UserBasicInterface): void => {
                setShowDeleteConfirmationModal(true);
                setDeletingUser(user);
            },
            popupText: (): string => t("console:manage.features.users.usersList.list.iconPopups.delete"),
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
                            { t("console:manage.features.users.usersList.search.emptyResultPlaceholder.clearButton") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.features.users.usersList.search.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("console:manage.features.users.usersList.search.emptyResultPlaceholder.subTitle.0",
                            { query: searchQuery }),
                        t("console:manage.features.users.usersList.search.emptyResultPlaceholder.subTitle.1")
                    ] }
                />
            );
        }

        if (usersList.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    data-testid={ `${testId}-empty-placeholder` }
                    action={ (
                        <Show when={ AccessControlConstants.USER_WRITE }>
                            <PrimaryButton
                                data-testid={ `${testId}-empty-placeholder-add-user-button` }
                                onClick={ () => onEmptyListPlaceholderActionClick() }
                            >
                                <Icon name="add"/>
                                { t("console:manage.features.users.usersList.list.emptyResultPlaceholder.addButton") }
                            </PrimaryButton>
                        </Show>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("console:manage.features.users.usersList.list.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("console:manage.features.users.usersList.list.emptyResultPlaceholder.subTitle.0"),
                        t("console:manage.features.users.usersList.list.emptyResultPlaceholder.subTitle.1"),
                        t("console:manage.features.users.usersList.list.emptyResultPlaceholder.subTitle.2")
                    ] }
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
                data={ usersList.Resources }
                onColumnSelectionChange={ onColumnSelectionChange }
                onRowClick={ (e: SyntheticEvent, user: UserBasicInterface): void => {
                    handleUserEdit(user?.id);
                    onListItemClick && onListItemClick(e, user);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ false }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
            <ConfirmationModal
                primaryActionLoading={ loading }
                data-testid={ `${testId}-confirmation-modal` }
                onClose={ (): void => setShowDeleteConfirmationModal(false) }
                type="negative"
                open={ showDeleteConfirmationModal }
                assertionHint={ t("console:manage.features.user.deleteUser.confirmationModal." +
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
                <ConfirmationModal.Header data-testid={ `${testId}-confirmation-modal-header` }>
                    { t("console:manage.features.user.deleteUser.confirmationModal.header") }
                </ConfirmationModal.Header>
                <ConfirmationModal.Message
                    data-testid={ `${testId}-confirmation-modal-message` }
                    attached
                    negative
                >
                    { t("console:manage.features.user.deleteUser.confirmationModal.message") }
                </ConfirmationModal.Message>
                <ConfirmationModal.Content data-testid={ `${testId}-confirmation-modal-content` }>
                    {
                        deletingUser && deletingUser[SCIMConfigs.scim.enterpriseSchema]?.userSourceId
                            ? t("console:manage.features.user.deleteJITUser.confirmationModal.content")
                            : t("console:manage.features.user.deleteUser.confirmationModal.content")
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
