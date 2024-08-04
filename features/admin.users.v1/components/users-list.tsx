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

import { useRequiredScopes } from "@wso2is/access-control";
import {
    AppConstants,
    AppState,
    FeatureConfigInterface,
    UIConstants,
    getEmptyPlaceholderIllustrations,
    history
} from "@wso2is/admin.core.v1";
import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";
import { userConfig } from "@wso2is/admin.extensions.v1/configs/user";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import { RealmConfigInterface } from "@wso2is/admin.server-configurations.v1";
import { getUserNameWithoutDomain, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    LoadableComponentInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { CommonUtils } from "@wso2is/core/utils";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    Popup,
    TableActionsInterface,
    TableColumnInterface,
    UserAvatar
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Header, Icon, Label, ListItemProps, SemanticICONS } from "semantic-ui-react";
import { deleteUser } from "../api";
import { UserManagementConstants } from "../constants";
import { UserBasicInterface, UserListInterface } from "../models";
import { UserManagementUtils } from "../utils/user-management-utils";

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
        readOnlyUserStores,
        featureConfig,
        onColumnSelectionChange,
        onListItemClick,
        onSearchQueryClear,
        searchQuery,
        selection,
        showListItemActions,
        showMetaContent,
        userMetaListContent,
        usersList,
        isReadOnlyUserStore,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<UserBasicInterface>(undefined);
    const [ loading, setLoading ] = useState(false);

    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.providedUsername);
    const isAuthUserPrivileged: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);

    const hasUsersUpdatePermissions: boolean = useRequiredScopes(
        featureConfig?.users?.scopes?.update
    );

    const hasUsersDeletePermissions: boolean = useRequiredScopes(
        featureConfig?.users?.scopes?.delete
    );

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
     * Checks whether the username is a UUID.
     *
     * @returns If the username is a UUID.
     */
    const checkUUID = ( username : string ): boolean => {

        const regexExp: RegExp = new RegExp(
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
        );

        return regexExp.test(username);
    };

    /* Resolves username.
    *
    * @returns Username for the user avatar.
    */
    const resolveAvatarUsername = ( user: UserBasicInterface ): string => {
        const usernameUUID: string = getUserNameWithoutDomain(user?.userName);

        if (user?.name?.givenName){
            return user.name.givenName[0];
        } else if (user?.name?.familyName) {
            return user.name.familyName[0];
        } else if (user?.emails?.length > 0 && user?.emails[0]) {
            return user.emails[0][0];
        } else if (!checkUUID(usernameUUID)){
            return usernameUUID[0];
        }

        return "";
    };

    const renderUserIdp = (user: UserBasicInterface): string => {
        if (user[SCIMConfigs?.scim?.enterpriseSchema]?.managedOrg) {
            return UserManagementConstants.MANAGED_BY_PARENT_TEXT;
        }

        const userStore: string = user?.userName?.split("/").length > 1
            ? user?.userName?.split("/")[0]?.toUpperCase()
            : userstoresConfig.primaryUserstoreName;

        const userIdp: string = user[ SCIMConfigs.scim.enterpriseSchema ]?.idpType;

        if (!userIdp) {
            return "N/A";
        }

        if (userIdp.split("/").length > 1) {
            if (readOnlyUserStores?.includes(userStore.toString())) {
                // For remote userstores.
                return userIdp.split("/")[1] + "-remote";
            } else {
                // For default userstore.
                return userIdp.split("/")[1];
            }
        } else {
            return userIdp;
        }
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
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (user: UserBasicInterface): ReactNode => {
                    const header: string = getUserNameWithoutDomain(user?.userName);
                    const subHeader: string = UserManagementUtils.resolveUserListSubheader(user);
                    const isNameAvailable: boolean = user.name?.familyName === undefined &&
                        user.name?.givenName === undefined;

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ testId }-item-heading` }
                        >
                            <UserAvatar
                                data-componentid="users-list-item-image"
                                name={ resolveAvatarUsername(user) }
                                size="mini"
                                image={ user.profileUrl }
                                spaced="right"
                                data-suppress=""
                            />
                            <Header.Content>
                                <div>
                                    { header as ReactNode }
                                    {
                                        userConfig?.disableManagedByColumn
                                            && user[SCIMConfigs?.scim?.enterpriseSchema]?.managedOrg
                                            && (
                                                <Label size="mini" className="client-id-label">
                                                    { t("parentOrgInvitations:invitedUserLabel") }
                                                </Label>
                                            )
                                    }
                                </div>
                                {
                                    (!isNameAvailable) &&
                                        (<Header.Subheader
                                            data-componentid={ `${ testId }-item-sub-heading` }
                                        >
                                            { subHeader }
                                        </Header.Subheader>)
                                }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "User"
            }
        ];

        !userConfig.disableManagedByColumn && defaultColumns.push(
            {
                allowToggleVisibility: false,
                dataIndex: "idpType",
                id: "idpType",
                key: "idpType",
                render: (user: UserBasicInterface): ReactNode => renderUserIdp(user),
                title: (
                    <>
                        <div className={ "header-with-popup" }>
                            <span>
                                { t("extensions:manage.users.list.columns.idpType") }
                            </span>
                            <Popup
                                trigger={ (
                                    <div className="inline" >
                                        <Icon disabled name="info circle" className="link pointing pl-1" />
                                    </div>
                                ) }
                                content={ t("extensions:manage.users.list.popups.content.idpTypeContent") }
                                position="top center"
                                size="mini"
                                hideOnScroll
                                inverted
                            />
                        </div>
                    </>
                )
            }
        );

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
                    render: (user: UserBasicInterface): ReactNode =>
                        CommonUtils.humanizeDateDifference(user?.meta?.lastModified)
                };
            }

            if(key === "userName") {
                dynamicColumn = {
                    ...dynamicColumn,
                    render: (user: UserBasicInterface): ReactNode =>
                        getUserNameWithoutDomain(user?.userName)
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
                "data-componentid": "users-list-item-edit-button",
                "data-testid": "users-list-item-edit-button",
                hidden: (): boolean => !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_READ")),
                icon: (user: UserBasicInterface): SemanticICONS => {
                    const userStore: string = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : userstoresConfig.primaryUserstoreName;

                    return !hasUsersUpdatePermissions
                    || !isFeatureEnabled(featureConfig?.users,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                    || user[SCIMConfigs.scim.enterpriseSchema]?.managedOrg
                        ? "eye"
                        : "pencil alternate";
                },
                onClick: (e: SyntheticEvent, user: UserBasicInterface): void =>
                    handleUserEdit(user?.id),
                popupText: (user: UserBasicInterface): string => {
                    const userStore: string = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : userstoresConfig.primaryUserstoreName;

                    return !hasUsersUpdatePermissions
                    || !isFeatureEnabled(featureConfig?.users,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                    || user[SCIMConfigs.scim.enterpriseSchema]?.managedOrg
                        ? t("common:view")
                        : t("common:edit");
                },
                renderer: "semantic-icon"
            }
        ];

        actions.push({
            "data-componentid": "users-list-item-delete-button",
            "data-testid": "users-list-item-delete-button",
            hidden: (user: UserBasicInterface): boolean => {
                const userStore: string = user?.userName?.split("/").length > 1
                    ? user?.userName?.split("/")[0]
                    : userstoresConfig.primaryUserstoreName;

                return !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_DELETE"))
                    || !hasUsersDeletePermissions
                    || readOnlyUserStores?.includes(userStore.toString())
                    || authenticatedUser === getUserNameWithoutDomain(user?.userName) && isAuthUserPrivileged;
            },
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

        if (usersList.totalResults === 0) {
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
                data={ usersList.Resources }
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
                        deletingUser && deletingUser[SCIMConfigs.scim.enterpriseSchema]?.userSourceId
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
