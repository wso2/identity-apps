/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import { FeatureStatus, useCheckFeatureStatus, useRequiredScopes } from "@wso2is/access-control";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { history } from "@wso2is/admin.core.v1/helpers/history";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { UserRoleInterface } from "@wso2is/admin.core.v1/models/users";
import { AppState } from "@wso2is/admin.core.v1/store";
import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { updateRoleDetails, updateUsersForRole } from "@wso2is/admin.roles.v2/api/roles";
import { PatchRoleDataInterface } from "@wso2is/admin.roles.v2/models/roles";
import { RealmConfigInterface } from "@wso2is/admin.server-configurations.v1";
import { deleteGuestUser } from "@wso2is/admin.users.v1/api";
import {
    AdminAccountTypes,
    UserAccountTypes,
    UserManagementConstants
} from "@wso2is/admin.users.v1/constants/user-management-constants";
import {
    InternalAdminUserListInterface,
    UserBasicInterface,
    UserListInterface
} from "@wso2is/admin.users.v1/models/user";
import { UserManagementUtils } from "@wso2is/admin.users.v1/utils";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { getUserNameWithoutDomain, isFeatureEnabled } from "@wso2is/core/helpers";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    LoadableComponentInterface,
    SBACInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
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
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Header, Icon, Label, ListItemProps, SemanticICONS } from "semantic-ui-react";
import { AdministratorConstants } from "../../constants/users";

/**
 * Prop types for the onboarded collaborator users list component.
 */
interface OnboardedGuestUsersListProps extends SBACInterface<FeatureConfigInterface>, LoadableComponentInterface,
    IdentifiableComponentInterface {

    /**
     * Admin account type.
     */
    adminType?: AdminAccountTypes;
    /**
     * Role ID for administator.
     */
    adminRoleId?: string;
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
     * @param columns - New columns for the accepted admins table.
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
    onboardedGuestUsersList: UserListInterface | InternalAdminUserListInterface;
    /**
     * List of readOnly user stores.
     */
    readOnlyUserStores?: string[];
    /**
     * Logged in user's association type to the current organization.
     */
    associationType?: string;
}

/**
 * Onboarded guest users list component.
 *
 * @returns the react component for the onboarded/accepted admins list.
 */
export const OnboardedGuestUsersList: React.FunctionComponent<OnboardedGuestUsersListProps> = (
    props: OnboardedGuestUsersListProps): ReactElement => {

    const {
        adminType,
        adminRoleId,
        advancedSearch,
        defaultListItemLimit,
        onUserDelete,
        isLoading,
        readOnlyUserStores,
        featureConfig,
        onColumnSelectionChange,
        onListItemClick,
        onSearchQueryClear,
        realmConfigs,
        searchQuery,
        selection,
        showListItemActions,
        onboardedGuestUsersList,
        associationType,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const hasUserUpdatePermissions: boolean = useRequiredScopes(featureConfig?.users?.scopes?.update);
    const hasUserDeletePermissions: boolean = useRequiredScopes(featureConfig?.users?.scopes?.delete);

    const [ showDeleteConfirmationModal, setShowDeleteConfirmationModal ] = useState<boolean>(false);
    const [ deletingUser, setDeletingUser ] = useState<UserBasicInterface | UserRoleInterface>(undefined);
    const [ alert, setAlert, alertComponent ] = useConfirmationModalAlert();
    const [ usersList, setUsersList ] = useState<UserListInterface | InternalAdminUserListInterface>({});
    const [ loading, setLoading ] = useState(false);

    const authenticatedUser: string = useSelector((state: AppState) => state?.auth?.username);
    const isPrivilegedUser: boolean = useSelector((state: AppState) => state.auth.isPrivilegedUser);
    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName);

    const saasFeatureStatus : FeatureStatus = useCheckFeatureStatus(FeatureGateConstants.SAAS_FEATURES_IDENTIFIER);

    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );

    const updateUsersForRoleFunction: (roleId: string, data: PatchRoleDataInterface) => Promise<any> =
        userRolesV3FeatureEnabled ? updateUsersForRole : updateRoleDetails;

    /**
     * Set users list.
     */
    useEffect(() => {
        if (!onboardedGuestUsersList) {
            setUsersList({});

            return;
        }

        setUsersList(onboardedGuestUsersList);
    }, [ onboardedGuestUsersList ]);

    const handleUserEdit = (user: UserBasicInterface | UserRoleInterface) => {
        if ("id" in user) {
            history.push(AdministratorConstants.getPaths().get("COLLABORATOR_USER_EDIT_PATH").replace(":id", user.id));
        }

        if ("value" in user) {
            history.push(AdministratorConstants.getPaths().get("COLLABORATOR_USER_EDIT_PATH")
                .replace(":id", user.value));
        }
    };

    const handleUserDelete = (user: UserBasicInterface | UserRoleInterface): Promise<void> => {
        const accountType: string = user[ SCIMConfigs.scim.systemSchema ]?.userAccountType
            ? user[ SCIMConfigs.scim.systemSchema ]?.userAccountType
            : UserAccountTypes.CUSTOMER;

        if (accountType === UserAccountTypes.COLLABORATOR && "id" in user) {
            return deleteGuestUser(user.id)
                .then(() => {
                    dispatch(addAlert({
                        description: t(
                            "invite:notifications.deleteInvite.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "users:notifications.deleteUser.success.message"
                        )
                    }));
                    onUserDelete();
                }).catch((error: IdentityAppsApiException) => {
                    if (error.response && error.response.data && error.response.data.description) {
                        dispatch(addAlert({
                            description: error.response.data.description,
                            level: AlertLevels.ERROR,
                            message: t("users:notifications.deleteUser.error.message")
                        }));

                        return;
                    }
                    dispatch(addAlert({
                        description: t("users:notifications.deleteUser." +
                            "genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("users:notifications.deleteUser.genericError" +
                            ".message")
                    }));
                }).finally(() => {
                    setLoading(false);
                    setShowDeleteConfirmationModal(false);
                    setDeletingUser(undefined);
                });
        } else if (accountType === UserAccountTypes.CUSTOMER) {

            const userId: string = "value" in user ? user?.value : ("id" in user ? user?.id : undefined);

            const pathValue: string = userRolesV3FeatureEnabled
                ? `value eq ${userId}`
                : `users[value eq ${userId}]`;

            // Payload for the update role request.
            const roleData: PatchRoleDataInterface = {
                Operations: [
                    {
                        op: "remove",
                        path: pathValue,
                        value: {}
                    }
                ],
                schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
            };

            return updateUsersForRoleFunction(adminRoleId, roleData)
                .then(() => {
                    dispatch(addAlert({
                        description: t("users:notifications.revokeAdmin.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("users:notifications.revokeAdmin.success.message")
                    }));
                    onUserDelete();
                })
                .catch((error: IdentityAppsApiException) => {
                    if (error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error?.response?.data?.description,
                            level: AlertLevels.ERROR,
                            message: t("users:notifications.revokeAdmin.error.message")
                        }));

                        return;
                    }
                    dispatch(addAlert({
                        description: t("users:notifications.revokeAdmin." +
                            "genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("users:notifications.revokeAdmin.genericError.message")
                    }));
                }).finally(() => {
                    setLoading(false);
                    setShowDeleteConfirmationModal(false);
                    setDeletingUser(undefined);
                });
        }
    };

    /**
     * Resolves data table columns.
     *
     * @returns the columns of the accepted admin users table.
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
                    const isNameAvailable: boolean = user.name?.familyName !== undefined ||
                        user.name?.givenName !== undefined;

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            <UserAvatar
                                data-componentid="users-list-item-image"
                                name={ user.userName.split("/")?.length > 1
                                    ? user.userName.split("/")[ 1 ]
                                    : user.userName.split("/")[ 0 ]
                                }
                                size="mini"
                                image={ user.profileUrl }
                                spaced="right"
                                data-suppress=""
                            />
                            <Header.Content>
                                { header }
                                { resolveOwnershipLabel(user) }
                                { resolveMyselfLabel(user) }
                                {
                                    (isNameAvailable) &&
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
            }
        ];

        if (saasFeatureStatus === FeatureStatus.ENABLED) {
            const managedByColumn: TableColumnInterface = {
                allowToggleVisibility: false,
                dataIndex: "idpType",
                id: "idpType",
                key: "idpType",
                render: (user: UserBasicInterface): ReactNode => {
                    if (user[ SCIMConfigs.scim.systemSchema ]?.idpType) {
                        if (user[ SCIMConfigs.scim.systemSchema ]?.idpType.split("/").length > 1) {
                            return user[ SCIMConfigs.scim.systemSchema ]?.idpType.split("/")[1];
                        }

                        return user[ SCIMConfigs.scim.systemSchema ]?.idpType;
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
            };

            defaultColumns.push(managedByColumn);
        }

        defaultColumns.push({
            allowToggleVisibility: false,
            dataIndex: "action",
            id: "actions",
            key: "actions",
            textAlign: "right",
            title: ""
        });

        const internalAdminColumns: TableColumnInterface[] = [
            {
                allowToggleVisibility: false,
                dataIndex: "name",
                id: "name",
                key: "name",
                render: (user: UserRoleInterface): ReactNode => {
                    const username: string = user.display.split("/")?.length > 1
                        ? user.display.split("/")[ 1 ]
                        : user.display.split("/")[ 0 ];

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-item-heading` }
                        >
                            <UserAvatar
                                data-componentid="users-list-item-image"
                                name={ username }
                                size="mini"
                                spaced="right"
                                data-suppress=""
                            />
                            <Header.Content>
                                { username }
                            </Header.Content>
                        </Header>
                    );
                },
                title: "User"
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

        return adminType === AdminAccountTypes.INTERNAL ? internalAdminColumns : defaultColumns;
    };

    /**
     * Resolves data table actions.
     *
     * @returns actions of the accepted admin users table.
     */
    const resolveTableActions = (): TableActionsInterface[] => {
        if (!showListItemActions) {
            return;
        }

        // TODO: Add edit option for internal users onboarded as admins.
        const actions: TableActionsInterface[] = [
            {
                "data-componentid": "administrators-list-item-edit-button",
                hidden: (): boolean => !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_READ")),
                icon: (user: UserBasicInterface): SemanticICONS => {
                    const userStore: string = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : primaryUserStoreDomainName;

                    return (
                        !hasUserUpdatePermissions
                    || !isFeatureEnabled(featureConfig?.users,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                    || adminType === AdminAccountTypes.EXTERNAL)
                        ? "eye"
                        : "pencil alternate";

                },
                onClick: (e: SyntheticEvent, user: UserBasicInterface | UserRoleInterface): void =>
                    handleUserEdit(user),
                popupText: (user: UserBasicInterface): string => {
                    const userStore: string = user?.userName?.split("/").length > 1
                        ? user?.userName?.split("/")[0]
                        : primaryUserStoreDomainName;

                    return (
                        !hasUserUpdatePermissions
                    || !isFeatureEnabled(featureConfig?.users,
                        UserManagementConstants.FEATURE_DICTIONARY.get("USER_UPDATE"))
                    || readOnlyUserStores?.includes(userStore.toString())
                    || adminType === AdminAccountTypes.EXTERNAL)
                        ? t("common:view")
                        : t("common:edit");
                },
                renderer: "semantic-icon"
            }
        ];

        actions.push({
            "data-componentid": "administrators-list-item-delete-button",
            hidden: (user: UserBasicInterface): boolean => {
                const userStore: string = user?.userName?.split("/").length > 1
                    ? user?.userName?.split("/")[0]
                    : primaryUserStoreDomainName;

                return !isFeatureEnabled(featureConfig?.users,
                    UserManagementConstants.FEATURE_DICTIONARY.get("USER_DELETE"))
                    || isPrivilegedUser
                    || !hasUserDeletePermissions
                    || readOnlyUserStores?.includes(userStore.toString())
                    || (adminType === AdminAccountTypes.EXTERNAL
                    && (getUserNameWithoutDomain(user?.userName) === realmConfigs?.adminUser
                    || authenticatedUser?.includes(getUserNameWithoutDomain(user?.userName))))
                    || associationType === UserManagementConstants.GUEST_ADMIN_ASSOCIATION_TYPE;
            },
            icon: (): SemanticICONS => "trash alternate",
            onClick: (e: SyntheticEvent, user: UserBasicInterface | UserRoleInterface): void => {
                setShowDeleteConfirmationModal(true);
                setDeletingUser(user);
            },
            popupText: (): string => t("users:usersList.list.iconPopups.delete"),
            renderer: "semantic-icon"
        });

        return actions;
    };

    /**
     * Resolves ownership label of admins.
     * @param user - admin user object.
     *
     * @returns - The label indication of the ownership within the table.
     */
    const resolveOwnershipLabel = (user: UserBasicInterface): ReactNode => {
        if (adminType === AdminAccountTypes.EXTERNAL &&
            user[ SCIMConfigs.scim.systemSchema ]?.userAccountType === UserAccountTypes.OWNER) {
            return (
                <Label size="small">
                    Owner
                </Label>
            );
        }

        return null;
    };

    /**
     * Returns a label if your own account is listed.
     *
     * @param user - each admin user belonging to a row of the table.
     * @returns the label indication of your own account.
     */
    const resolveMyselfLabel = (user: UserBasicInterface): ReactNode => {
        if (adminType === AdminAccountTypes.INTERNAL || authenticatedUser?.split("@").length < 3) {
            return null;
        }
        // Extracting the current username from authenticatedUser.
        const currentUsername: string = authenticatedUser?.split("@").slice(0, 2).join("@");

        if (currentUsername === getUserNameWithoutDomain(user?.userName)) {
            return (
                <Label size="small">
                    Me
                </Label>
            );
        }

        return null;
    };

    /**
     * Shows list placeholders.
     *
     * @returns placeholder for empty admins list
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
                    data-componentid={ `${ componentId }-empty-placeholder` }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [ "There are no administrator users associated with your organization at the moment." ] }
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
                    handleUserEdit(user);
                    onListItemClick && onListItemClick(e, user);
                } }
                placeholders={ showPlaceholders() }
                selectable={ selection }
                showHeader={ saasFeatureStatus === FeatureStatus.ENABLED }
                transparent={ !isLoading && (showPlaceholders() !== null) }
                data-componentid={ componentId }
            />
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
                        onSecondaryActionClick={ (): void => {
                            setShowDeleteConfirmationModal(false);
                            setAlert(null);
                        } }
                        onPrimaryActionClick={ (): void => {
                            setLoading(true);
                            handleUserDelete(deletingUser);
                        } }
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
                            { t("extensions:manage.guest.deleteUser.confirmationModal.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-componentid={ `${ componentId }-confirmation-modal-content` }>
                            <div className="modal-alert-wrapper"> { alert && alertComponent }</div>
                            { t("extensions:manage.guest.deleteUser.confirmationModal.content") }
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
OnboardedGuestUsersList.defaultProps = {
    selection: true,
    showListItemActions: true,
    showMetaContent: true
};
