/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com).
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

import { UserstoreConstants } from "@wso2is/core/constants";
import { getUserNameWithoutDomain, hasRequiredScopes, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    SBACInterface
} from "@wso2is/core/models";
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
import React, { ReactElement, ReactNode, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, Icon, ListItemProps, SemanticICONS } from "semantic-ui-react";
import {
    AppState,
    FeatureConfigInterface,
    UIConstants,
    getEmptyPlaceholderIllustrations,
    history
} from "../../../../../features/core";
import { UserManagementConstants } from "../../../../../features/users/constants";
import { UserBasicInterface, UserListInterface } from "../../../../../features/users/models";
import { SCIMConfigs } from "../../../../configs/scim";
import { UsersConstants } from "../../constants";
import { UserManagementUtils } from "../../utils";

/**
 * Prop types for the user list component.
 */
interface UsersListProps extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    IdentifiableComponentInterface {

    /**
     * Advanced Search component.
     */
    advancedSearch?: ReactNode;
    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
    /**
     * User delete callback.
     *
     * @param userId - ID of the deleting user.
     */
    handleUserDelete?: (userId: string) => Promise<void>;
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
     * Path to edit user page.
     */
    userEditPath?: string;
    /**
     * Flag for request loading status.
     */
    isLoading?: boolean;
}

/**
 * Users info page.
 *
 * @returns The users list table.
 */
export const UsersList: React.FunctionComponent<UsersListProps> = (
    props: UsersListProps): ReactElement => {
    const {
        advancedSearch,
        defaultListItemLimit,
        handleUserDelete,
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
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<UserBasicInterface>(undefined);
    const [ loading, setLoading ] = useState(false);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.username);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state?.auth?.isPrivilegedUser);

    const handleUserEdit = (userId: string) => {
        history.push(UsersConstants.getPaths().get("CUSTOMER_USER_EDIT_PATH").replace(":id", userId));
    };

    const deleteUser = (id: string): void => {
        setLoading(true);
        handleUserDelete(id).finally(() => {
            setLoading(false);
            setDeletingUser(undefined);
            setShowDeleteConfirmationModal(false);
        });
    };

    const renderUserIdp = (user: UserBasicInterface): string => {
        const userStore: string = user?.userName?.split("/").length > 1
            ? user?.userName?.split("/")[0]?.toUpperCase()
            : "PRIMARY";

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

    /**
     * Resolves username.
     *
     * @returns Username for the user avatar.
     */
    const resolveAvatarUsername = ( user: UserBasicInterface ): string => {
        const usernameUUID: string = getUserNameWithoutDomain(user?.userName);

        if (user.name?.givenName){
            return user.name.givenName[0];
        } else if (user.name?.familyName) {
            return user.name.familyName[0];
        } else if (user.emails[0]){
            return user.emails[0][0];
        } else if (!checkUUID(usernameUUID)){
            return usernameUUID[0];
        }

        return "";
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
                    const header: string = UserManagementUtils.resolveUserListHeader(user);
                    const subHeader: string = UserManagementUtils.resolveUserListSubheader(user);
                    const isNameAvailable: boolean = user.name?.familyName === undefined &&
                        user.name?.givenName === undefined;

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
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
                                { header }
                                {
                                    (!isNameAvailable) &&
                                        (<Header.Subheader
                                            data-componentid={ `${ componentId }-item-sub-heading` }
                                        >
                                            { subHeader }
                                        </Header.Subheader>)
                                }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "User"
            },
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
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: "actions",
                textAlign: "right",
                title: ""
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
     * @returns the data table actions.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        const actions: TableActionsInterface[] = [
            {
                "data-componentid": "users-list-item-edit-button",
                hidden: (): boolean => !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_READ")),
                icon: (user: UserBasicInterface): SemanticICONS => {
                    const userStore: string = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]?.toUpperCase()
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
                    const userStore: string = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]?.toUpperCase()
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
            "data-componentid": "users-list-item-delete-button",
            hidden: (user: UserBasicInterface): boolean => {
                const userStore: string = user?.userName?.split("/").length > 1
                    ? user?.userName?.split("/")[0]?.toUpperCase()
                    : UserstoreConstants.PRIMARY_USER_STORE;

                return !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_DELETE"))
                    || !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.delete, allowedScopes)
                    || readOnlyUserStores?.includes(userStore.toString())
                    || (isPrivilegedUser && UserManagementUtils.isAuthenticatedUser(authenticatedUser, user?.userName));
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
     * @returns the placeholders to show when the data table is empty.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && usersList?.totalResults === 0) {
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

        if (usersList?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    data-componentid={ `${ componentId }-empty-list-empty-placeholder` }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("users:placeholders.emptyList.title") }
                    subtitle={ [
                        t("users:usersList.list.emptyResultPlaceholder.subTitle.0",
                            { type: "users" })
                    ] }
                />
            );
        }

        return null;
    };

    return (
        <>
            {
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
                    data={ usersList?.Resources }
                    onColumnSelectionChange={ onColumnSelectionChange }
                    onRowClick={ (e: SyntheticEvent, user: UserBasicInterface): void => {
                        handleUserEdit(user?.id);
                        onListItemClick && onListItemClick(e, user);
                    } }
                    placeholders={ showPlaceholders() }
                    selectable={ selection }
                    showHeader={ true }
                    transparent={ !isLoading && (showPlaceholders() !== null) }
                    data-componentid={ componentId }
                />
            }
            {
                deletingUser && (
                    <ConfirmationModal
                        primaryActionLoading={ loading }
                        data-componentid={ `${ componentId }-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("user:deleteUser.confirmationModal.assertionHint") }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => deleteUser(deletingUser.id) }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-componentid={ `${ componentId }-confirmation-modal-header` }>
                            { t("user:deleteUser.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-componentid={ `${ componentId }-confirmation-modal-message` }
                            attached
                            negative
                        >
                            { t("user:deleteUser.confirmationModal.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-componentid={ `${ componentId }-confirmation-modal-content` }>
                            {
                                deletingUser[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId
                                    ? t("user:deleteJITUser.confirmationModal.content")
                                    : t("user:deleteUser.confirmationModal.content")
                            }
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
UsersList.defaultProps = {
    selection: true,
    showListItemActions: true,
    showMetaContent: true
};
