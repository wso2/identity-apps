/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { getUserNameWithoutDomain, hasRequiredScopes, isFeatureEnabled, resolveUserstore } from "@wso2is/core/helpers";
import {
    LoadableComponentInterface,
    SBACInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    Popup,
    TableActionsInterface,
    TableColumnInterface,
    UserAvatar,
    useConfirmationModalAlert
} from "@wso2is/react-components";
import React, { ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Header, Icon, ListItemProps, SemanticICONS } from "semantic-ui-react";
import {
    AppState,
    FeatureConfigInterface,
    UIConstants,
    getEmptyPlaceholderIllustrations, history
} from "../../../../admin-core-v1";
import { RealmConfigInterface } from "../../../../features/server-configurations";
import { UserManagementConstants } from "../../../../features/users/constants";
import { UserBasicInterface, UserListInterface } from "../../../../features/users/models";
import { administratorConfig } from "../../../configs/administrator";
import { SCIMConfigs } from "../../../configs/scim";
import { AdministratorConstants, UserAccountTypes } from "../constants";
import { UserManagementUtils } from "../../../../features/users/utils";
import { userstoresConfig } from "../../../configs";

/**
 * Prop types for the all users list component.
 */
interface AllUsersListProps extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    TestableComponentInterface {

    /**
     * Default list item limit.
     */
    defaultListItemLimit?: number;
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
     * Admin user details content.
     */
    realmConfigs: RealmConfigInterface;
    /**
     * Enable selection styles.
     */
    selection?: boolean;
    /**
     * Show list item actions.
     */
    showListItemActions?: boolean;
    /**
     * Meta column list for the user list.
     */
    userMetaListContent?: Map<string, string>;
    /**
     * Users list.
     */
    allUsersList: UserListInterface;
    /**
     * Callback to fetch all users list.
     *
     * @param limit - Items per page.
     * @param offset - Offset.
     * @param filter - Filter query.
     * @param attribute - Attribute to sort.
     * @param domain - Domain to filter.
     */
    getAllUsersList: (limit: number, offset: number, filter: string, attribute: string, domain: string) => void;
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
    /**
     * Flag for request loading status.
     */
    isLoading: boolean;
    isNextPage?: boolean;
    /**
     * Callback for the search query clear action.
     */
    onSearchQueryClear?: () => void;
    /**
     * Search query for the list.
     */
    searchQuery?: string;
    /**
     * Consumer user delete callback.
     *
     * @param userId - ID of the deleting user.
     */
    handleConsumerUserDelete?: (userId: string) => Promise<void>;
    /**
     * Guest user delete callback.
     *
     * @param userId - ID of the deleting user.
     */
    handleGuestUserDelete?: (userId: string) => Promise<void>;
}

/**
 * All users list component.
 *
 * @returns All users list component.
 */
export const AllUsersList: React.FunctionComponent<AllUsersListProps> = (props: AllUsersListProps): ReactElement => {
    const {
        defaultListItemLimit,
        isLoading,
        readOnlyUserStores,
        featureConfig,
        onColumnSelectionChange,
        onListItemClick,
        realmConfigs,
        selection,
        showListItemActions,
        allUsersList,
        onSearchQueryClear,
        searchQuery,
        handleConsumerUserDelete,
        handleGuestUserDelete,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<UserBasicInterface>(undefined);
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();
    const [ usersList, setUsersList ] = useState<UserListInterface>({});
    const [ tenantAdmin, setTenantAdmin ] = useState<string>("");
    const [ loading, setLoading ] = useState(false);

    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.username);

    /**
     * Set tenant admin.
     */
    useEffect(() => {
        if (!realmConfigs) {
            return;
        }

        setTenantAdmin(realmConfigs?.adminUser);
    }, [ realmConfigs ]);

    /**
     * Set users list.
     */
    useEffect(() => {
        if (!allUsersList) {
            return;
        }

        setUsersList(allUsersList);
    }, [ allUsersList ]);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);

    const handleUserEdit = (user: UserBasicInterface) => {
        if (resolveUserstore(user.userName) === userstoresConfig.primaryUserstoreName) {
            history.push(AdministratorConstants.getPaths().get("CUSTOMER_USER_EDIT_PATH").replace(":id", user.id));
        } else {
            history.push(AdministratorConstants.getPaths().get("COLLABORATOR_USER_EDIT_PATH").replace(":id", user.id));
        }

    };

    /**
     * Handles user deletion.
     *
     *
     */
    const deleteUser = (): void => {
        setLoading(true);
        if (deletingUser.userName?.split("/")[0] === userstoresConfig.primaryUserstoreName) {
            handleConsumerUserDelete(deletingUser.id).finally(() => {
                setLoading(false);
                setDeletingUser(undefined);
                setShowDeleteConfirmationModal(false);
            });
        } else {
            handleGuestUserDelete(deletingUser.id).finally(() => {
                setLoading(false);
                setDeletingUser(undefined);
                setShowDeleteConfirmationModal(false);
            });
        }
    };

    /**
     * Resolves data table columns.
     *
     * @returns Table columns
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
                            data-testid={ `${ testId }-item-heading` }
                        >
                            <UserAvatar
                                data-testid="all-users-list-item-image"
                                name={
                                    user.userName.split("/")?.length > 1
                                        ? user.userName.split("/")[ 1 ]
                                        : user.userName.split("/")[ 0 ]
                                }
                                size="mini"
                                image={ user.profileUrl }
                                spaced="right"
                                data-suppress=""
                            />
                            <Header.Content>
                                <div className={ isNameAvailable ? "mt-2" : "" } data-suppress="">{ header }</div>
                                {
                                    (!isNameAvailable) && (
                                        <Header.Subheader
                                            data-testid={ `${ testId }-item-sub-heading` }
                                        >
                                            { subHeader }
                                        </Header.Subheader>
                                    )
                                }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "User"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "type",
                id: "type",
                key: "type",
                render: (user: UserBasicInterface): ReactNode => {
                    if (user.userName === tenantAdmin) {
                        return "Owner";
                    }
                    if (resolveUserstore(user.userName) === userstoresConfig.primaryUserstoreName) {
                        return UserAccountTypes.USER;
                    } else {
                        return administratorConfig.adminRoleName;
                    }
                },
                title: (
                    <>
                        <div className={ "header-with-popup" }>
                            <span>
                                { t("extensions:manage.users.list.columns.accountType") }
                            </span>
                            <Popup
                                trigger={ (
                                    <div className="inline" >
                                        <Icon disabled name="info circle" className="link pointing pl-1" />
                                    </div>
                                ) }
                                content={ t("extensions:manage.users.list.popups.content.AccountTypeContent") }
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
                dataIndex: "idpType",
                id: "idpType",
                key: "idpType",
                render: (user: UserBasicInterface): ReactNode => {
                    if (user[ SCIMConfigs.scim.enterpriseSchema ]?.idpType) {
                        return user[ SCIMConfigs.scim.enterpriseSchema ]?.idpType;
                    } else {
                        return "N/A";
                    }
                },
                title: (
                    <>
                        <div className={ "header-with-popup" }>
                            <span>
                                { t("extensions:manage.users.list.columns.idpType") }
                            </span>
                            <Popup
                                trigger={
                                    (<div className="inline" >
                                        <Icon disabled name="info circle" className="link pointing pl-1" />
                                    </div>)
                                }
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
                dataIndex: "userStore",
                id: "userStore",
                key: "userStore",
                render: (user: UserBasicInterface): ReactNode => {
                    if (user[ SCIMConfigs.scim.enterpriseSchema ]?.userSource) {
                        return user[ SCIMConfigs.scim.enterpriseSchema ]?.userSource;
                    } else {
                        return "N/A";
                    }
                },
                title: (
                    <>
                        <div className={ "header-with-popup" }>
                            <span>
                                { t("extensions:manage.users.list.columns.userStore") }
                            </span>
                            <Popup
                                trigger={
                                    (<div className="inline" >
                                        <Icon disabled name="info circle" className="link pointing pl-1" />
                                    </div>)
                                }
                                content={ t("extensions:manage.users.list.popups.content.sourceContent") }
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

        return defaultColumns;
        // if (!showMetaContent || !userMetaListContent) {
        //     return defaultColumns;
        // }
        //
        // const dynamicColumns: TableColumnInterface[]= [];
        //
        // for (const [key, value] of userMetaListContent.entries()) {
        //     if (key === "name" || key === "emails" || key === "profileUrl" || value === "") {
        //         continue;
        //     }
        //
        //     let dynamicColumn: TableColumnInterface = {
        //         allowToggleVisibility: true,
        //         dataIndex: value,
        //         id: key,
        //         key: key,
        //         title: value
        //     };
        //
        //     if (key === "meta.lastModified") {
        //         dynamicColumn = {
        //             ...dynamicColumn,
        //             render: (user: UserBasicInterface): ReactNode =>
        //                 CommonUtils.humanizeDateDifference(user?.meta?.lastModified),
        //             title: "Modified Time"
        //         };
        //     }
        //
        //     dynamicColumns.push(dynamicColumn);
        // }
        //
        // dynamicColumns.unshift(defaultColumns[0]);
        // dynamicColumns.push(defaultColumns[1);
        //
        // return dynamicColumns;
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
                "data-testid": "all-users-list-item-edit-button",
                hidden: (): boolean => !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_READ")),
                icon: (user: UserBasicInterface): SemanticICONS => {
                    const userStore: string = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : AdministratorConstants.ASGARDEO_USERSTORE;

                    return !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes)
                    || !isFeatureEnabled(featureConfig?.users,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                        ? "eye"
                        : "pencil alternate";
                },
                onClick: (e: SyntheticEvent, user: UserBasicInterface): void =>
                    handleUserEdit(user),
                popupText: (user: UserBasicInterface): string => {
                    const userStore: string = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : AdministratorConstants.ASGARDEO_USERSTORE;

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
            "data-testid": "all-users-list-item-delete-button",
            hidden: (user: UserBasicInterface): boolean => {
                const userStore: string = user?.userName?.split("/").length > 1
                    ? user?.userName?.split("/")[0]
                    : AdministratorConstants.ASGARDEO_USERSTORE;

                return !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_DELETE"))
                    || !hasRequiredScopes(featureConfig?.users, featureConfig?.users?.scopes?.delete, allowedScopes)
                    || readOnlyUserStores?.includes(userStore.toString())
                    || user.userName === realmConfigs?.adminUser || authenticatedUser.includes(user.userName);
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
     * @returns Placeholder component.
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
                    data-testid={ `${ testId }-empty-placeholder` }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("users:usersList.list.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("users:usersList.list.emptyResultPlaceholder.subTitle.0"),
                        t("users:usersList.list.emptyResultPlaceholder.subTitle.1"),
                        t("users:usersList.list.emptyResultPlaceholder.subTitle.2")
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
                    handleUserEdit(user);
                    onListItemClick && onListItemClick(e, user);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ true }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-testid={ testId }
            />
            {
                deletingUser && (
                    <ConfirmationModal
                        primaryActionLoading={ loading }
                        data-testid={ `${ testId }-confirmation-modal` }
                        onClose={ (): void => setShowDeleteConfirmationModal(false) }
                        type="negative"
                        open={ showDeleteConfirmationModal }
                        assertionHint={ t("user:deleteUser.confirmationModal.assertionHint") }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void =>{
                            setShowDeleteConfirmationModal(false);
                            setAlert(null);
                        } }
                        onPrimaryActionClick={ deleteUser }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${ testId }-confirmation-modal-header` }>
                            { t("user:deleteUser.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-testid={ `${ testId }-confirmation-modal-message` }
                            attached
                            negative
                        >
                            { resolveUserstore(deletingUser.userName) === userstoresConfig.primaryUserstoreName
                                ? t("user:deleteUser.confirmationModal.message")
                                : t("extensions:manage.guest.deleteUser.confirmationModal.message")
                            }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${ testId }-confirmation-modal-content` }>
                            <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                            { resolveUserstore(deletingUser.userName) === userstoresConfig.primaryUserstoreName
                                ? (
                                    deletingUser[SCIMConfigs.scim.enterpriseSchema]?.userSourceId
                                        ? t("user:deleteJITUser.confirmationModal.content")
                                        : t("user:deleteUser.confirmationModal.content")
                                )
                                : t("extensions:manage.guest.deleteUser.confirmationModal.content")
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
AllUsersList.defaultProps = {
    selection: true,
    showListItemActions: true
};
