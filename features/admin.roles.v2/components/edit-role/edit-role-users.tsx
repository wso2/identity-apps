/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import Box from "@oxygen-ui/react/Box";
import { useGetAgents } from "@wso2is/admin.agents.v1/hooks/use-get-agents";
import { AdvancedSearchWithBasicFilters } from "@wso2is/admin.core.v1/components/advanced-search-with-basic-filters";
import { getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1/configs/ui";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import { userstoresConfig } from "@wso2is/admin.extensions.v1/configs/userstores";
import { UserBasicInterface } from "@wso2is/admin.users.v1/models/user";
import { UserManagementUtils } from "@wso2is/admin.users.v1/utils/user-management-utils";
import { PRIMARY_USERSTORE } from "@wso2is/admin.userstores.v1/constants";
import useUserStores from "@wso2is/admin.userstores.v1/hooks/use-user-stores";
import { UserStoreDropdownItem, UserStoreListItem } from "@wso2is/admin.userstores.v1/models/user-stores";
import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import {
    AlertLevels,
    FeatureAccessConfigInterface,
    IdentifiableComponentInterface,
    RolesMemberInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { StringUtils } from "@wso2is/core/utils";
import {
    DataTable,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    LinkButton,
    ListLayout,
    PrimaryButton,
    TableActionsInterface,
    TableColumnInterface,
    UserAvatar
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import isEmpty from "lodash-es/isEmpty";
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useMemo,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Divider, Dropdown, DropdownProps, Header, Icon, PaginationProps, SemanticICONS } from "semantic-ui-react";
import { AddRoleUserModal } from "./add-role-user-modal";
import { updateRoleDetails, updateUsersForRole } from "../../api";
import { CreateRoleMemberInterface, PatchRoleDataInterface, RoleEditSectionsInterface } from "../../models/roles";
import "./edit-role.scss";

type RoleUsersPropsInterface = IdentifiableComponentInterface & RoleEditSectionsInterface;

export const RoleUsersList: FunctionComponent<RoleUsersPropsInterface> = (
    props: RoleUsersPropsInterface
): ReactElement => {

    const {
        role,
        onRoleUpdate,
        isReadOnly,
        tabIndex,
        activeUserStore,
        isForNonHumanUser,
        isPrivilegedUsersToggleVisible = false,
        [ "data-componentid" ]: componentId = "edit-role-users"
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const {
        data: agentList
    } = useGetAgents(
        UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
        0,
        null,
        null,
        isForNonHumanUser
    );

    const baseI18nKey: string = isForNonHumanUser ? "roles:edit.agents." : "roles:edit.users.";

    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName);

    const systemReservedUserStores: string[] = useSelector((state: AppState) =>
        state.config.ui?.systemReservedUserStores);

    const consoleSettingsFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.consoleSettings
    );

    const isUserstoreSelectionInAdministratorsEnabled: boolean =
        !consoleSettingsFeatureConfig?.disabledFeatures?.includes(
            "consoleSettings.userstoreSelectionInAdministrators"
        );

    const [ selectedUserStoreDomainName, setSelectedUserStoreDomainName ] = useState<string>(
        isEmpty(activeUserStore) ? userstoresConfig?.primaryUserstoreName : activeUserStore
    );
    const [ selectedUsersFromUserStore, setSelectedUsersFromUserStore ] = useState<UserBasicInterface[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ paginatedUsers, setPaginatedUsers ] = useState<UserBasicInterface[]>([]);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ showAddNewUserModal, setShowAddNewUserModal ] = useState<boolean>(false);

    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );

    const updateUsersOfRoleFunction: (roleId: string, roleData: PatchRoleDataInterface) => Promise<any> =
        userRolesV3FeatureEnabled ? updateUsersForRole : updateRoleDetails;

    const shouldShowUserstoreDropdown: boolean =
    selectedUserStoreDomainName !== "AGENT" &&
    (
        (!isPrivilegedUsersToggleVisible && isUserstoreSelectionInAdministratorsEnabled) ||
        selectedUserStoreDomainName !== PRIMARY_USERSTORE
    );

    const {
        isLoading: isUserStoresLoading,
        userStoresList
    } = useUserStores();

    const availableUserStores: UserStoreDropdownItem[] = useMemo(() => {
        const storeOptions: UserStoreDropdownItem[] = isForNonHumanUser
            ? [
                {
                    key: -1,
                    text: "AGENT",
                    value: "AGENT"
                }
            ] : [
                {
                    key: -1,
                    text: userstoresConfig?.primaryUserstoreName,
                    value: userstoresConfig?.primaryUserstoreName
                }
            ];

        if (userStoresList && !isUserStoresLoading && !isForNonHumanUser) {
            if (userStoresList?.length > 0) {
                userStoresList
                    ?.filter((userStore: UserStoreListItem) => !systemReservedUserStores?.includes(userStore.name))
                    ?.forEach((store: UserStoreListItem, index: number) => {
                        const isEnabled: boolean = store.enabled;

                        if (store.name.toUpperCase() !== userstoresConfig.primaryUserstoreName && isEnabled) {
                            const storeOption: UserStoreDropdownItem = {
                                key: index,
                                text: store.name,
                                value: store.name
                            };

                            storeOptions.push(storeOption);
                        }
                    });
            }
        }

        return storeOptions;
    }, [ userStoresList, isUserStoresLoading, isForNonHumanUser, systemReservedUserStores ]);

    useEffect(() => {
        if (!role?.users?.length) {
            setSelectedUsersFromUserStore([]);

            return;
        }

        const alreadyAssignedUsersFromSelectedUserStore: UserBasicInterface[] = role?.users?.map(
            (user: RolesMemberInterface) => ({
                id: user.value,
                userName: user.display
            })
        ).filter((user: UserBasicInterface) =>
            isUserBelongToSelectedUserStore(user, selectedUserStoreDomainName)
        ) ?? [];

        setSelectedUsersFromUserStore(alreadyAssignedUsersFromSelectedUserStore);
    },[ role, selectedUserStoreDomainName ]);

    /**
     * Performs the pagination of the users list.
     */
    useEffect(() => {
        resolvePaginatedUsersList(listOffset, listItemLimit, selectedUsersFromUserStore, searchQuery);
    }, [
        listOffset,
        listItemLimit,
        selectedUsersFromUserStore,
        searchQuery
    ]);

    /**
     * Sets the selected user store domain name.
     * If the active user store is empty, it sets the primary user store domain name.
     */
    useEffect(() => {
        setSelectedUserStoreDomainName(
            isEmpty(activeUserStore) ? userstoresConfig?.primaryUserstoreName : activeUserStore
        );
    }, [ activeUserStore ]);

    /**
     * Checks whether the user belongs to the selected user store.
     *
     * @param user - User.
     * @param userStoreName - User store name.
     */
    const isUserBelongToSelectedUserStore = (user: UserBasicInterface, userStoreName: string) => {
        const userNameChunks: string[] = user.userName.split("/");

        return (userNameChunks.length === 1 &&
            StringUtils.isEqualCaseInsensitive(userStoreName, primaryUserStoreDomainName))
        || (userNameChunks.length === 2 && StringUtils.isEqualCaseInsensitive(userNameChunks[0], userStoreName));
    };

    /**
     * Util method to paginate retrieved users list.
     *
     * @param offsetValue - pagination offset value.
     * @param itemLimit - pagination item limit.
     * @param list - users list.
     * @param searchQuery - Search query.
     */
    const resolvePaginatedUsersList = (
        offsetValue: number,
        itemLimit: number,
        list: UserBasicInterface[],
        searchQuery?: string
    ): void => {
        if (!list) {
            setPaginatedUsers([]);

            return;
        }

        if (!isEmpty(searchQuery)) {
            const filteredList: UserBasicInterface[] = list.filter((user: UserBasicInterface) => {
                return user.userName.toLowerCase().includes(searchQuery.toLowerCase());
            });

            setPaginatedUsers(filteredList?.slice(offsetValue, itemLimit + offsetValue));

            return;
        }

        setPaginatedUsers(list?.slice(offsetValue, itemLimit + offsetValue));
    };

    /**
     * Assigns users to the role.
     *
     * @param selectedUsers - selected users.
     */
    const assignUsersToRole = (selectedUsers: UserBasicInterface[]): void => {
        const addedUsers: CreateRoleMemberInterface[] = selectedUsers?.map((user: UserBasicInterface) => {
            return {
                "display": user.userName,
                "value": user.id
            };
        });

        const roleData: PatchRoleDataInterface = userRolesV3FeatureEnabled ? {
            Operations: [
                {
                    op: "add",
                    value: addedUsers
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        } : {
            Operations: [
                {
                    op: "add",
                    value: {
                        users: addedUsers
                    }
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        setIsSubmitting(true);
        updateUsersOfRoleFunction(role.id, roleData)
            .then((response: AxiosResponse) => {
                if (response?.status === 200) {
                    dispatch(
                        addAlert({
                            description: t(baseI18nKey + "notifications.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t(baseI18nKey + "notifications.success.message")
                        })
                    );
                } else if (response?.status === 202) {
                    dispatch(
                        addAlert({
                            description: t(baseI18nKey + "notifications.pendingApproval.description"),
                            level: AlertLevels.WARNING,
                            message: t(baseI18nKey + "notifications.pendingApproval.message")
                        })
                    );
                }
                onRoleUpdate(tabIndex);
            })
            .catch( (error: AxiosError) => {
                if (error?.response?.data?.detail) {
                    dispatch(
                        addAlert({
                            description:
                                t("roles:edit.groups.notifications.error.description",
                                    { description: error.response.data.detail }),
                            level: AlertLevels.ERROR,
                            message: t("roles:edit.groups.notifications.error.message")
                        })
                    );
                } else {
                    dispatch(
                        addAlert({
                            description: t("roles:edit.groups.notifications.genericError" +
                                ".description"),
                            level: AlertLevels.ERROR,
                            message: t("roles:edit.groups.notifications.genericError.message")
                        })
                    );
                }
            })
            .finally(() => {
                setIsSubmitting(false);
                setShowAddNewUserModal(false);
            });
    };

    /**
     * Unassigns users from the role.
     *
     * @param user - user to be unassigned.
     */
    const unassignUserFromRole = (user: UserBasicInterface): void => {
        const roleData: PatchRoleDataInterface = userRolesV3FeatureEnabled ? {
            Operations: [ {
                "op": "remove",
                "path": `value eq ${ user.id }`
            } ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        } : {
            Operations: [ {
                "op": "remove",
                "path": `users[value eq ${ user.id }]`
            } ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        setIsSubmitting(true);
        updateUsersOfRoleFunction(role.id, roleData)
            .then((response: AxiosResponse) => {
                if (response?.status === 200) {
                    dispatch(
                        addAlert({
                            description: t(baseI18nKey + "notifications.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: t(baseI18nKey + "notifications.success.message")
                        })
                    );
                } else if (response?.status === 202) {
                    dispatch(
                        addAlert({
                            description: t(baseI18nKey + "notifications.pendingApproval.description"),
                            level: AlertLevels.WARNING,
                            message: t(baseI18nKey + "notifications.pendingApproval.message")
                        })
                    );
                }
                onRoleUpdate(tabIndex);
            })
            .catch( (error: AxiosError) => {
                if (error?.response?.data?.detail) {
                    dispatch(
                        addAlert({
                            description:
                                t("roles:edit.groups.notifications.error.description",
                                    { description: error.response.data.detail }),
                            level: AlertLevels.ERROR,
                            message: t("roles:edit.groups.notifications.error.message")
                        })
                    );
                } else {
                    dispatch(
                        addAlert({
                            description: t("roles:edit.groups.notifications.genericError" +
                                ".description"),
                            level: AlertLevels.ERROR,
                            message: t("roles:edit.groups.notifications.genericError.message")
                        })
                    );
                }
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleOpenAddNewUserModal = () => {
        setShowAddNewUserModal(true);
    };

    const handleCloseAddNewUserModal = () => {
        setShowAddNewUserModal(false);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        const offsetValue: number = (data.activePage as number - 1) * listItemLimit;

        setListOffset(offsetValue);
    };

    const handleItemsPerPageDropdownChange = (
        event: React.MouseEvent<HTMLAnchorElement>,
        data: DropdownProps
    ): void => {
        setListItemLimit(data.value as number);
    };

    /**
     * Handles the `onFilter` callback action from the
     * users search component.
     *
     * @param query - Search query.
     */
    const handleUserFilter = (query: string): void => {
        setSearchQuery(query);
        setListOffset(0);
    };

    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery(null);
    };

    const handleDomainChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setListOffset(0);
        setListItemLimit(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
        setSelectedUserStoreDomainName(
            data.value as string
        );
    };

    /**
     * Shows list placeholders.
     *
     * @returns Placeholders.
     */
    const showPlaceholders = (): ReactElement => {
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ handleSearchQueryClear }>
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

        if (paginatedUsers.length === 0) {
            return (
                <EmptyPlaceholder
                    title={ t(baseI18nKey + "list." +
                        "emptyPlaceholder.title") }
                    subtitle={ [
                        t(baseI18nKey + "list." +
                            "emptyPlaceholder.subtitles", { type: "role" })
                    ] }
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    imageSize="tiny"
                />
            );
        }

        return null;
    };

    /**
     * Retrieves the agent display name if available.
     *
     * Note: This is a hack to display the agent's display name
     * in the role assign wizard. Ideally, the role details API
     * response should include the agent's display name.
     *
     * @param user - The user object.
     * @returns The display name of the agent if available, otherwise undefined.
     */
    const getAgentDisplayName = (user: UserBasicInterface): string => {
        const matchingAgent: UserBasicInterface =
            agentList?.Resources?.find((agent: UserBasicInterface) => agent.userName === user.userName);

        return matchingAgent?.["urn:scim:wso2:agent:schema"]?.DisplayName;
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
                    const header: ReactNode = isForNonHumanUser
                        ? getAgentDisplayName(user) ?? getUserNameWithoutDomain(user?.userName)
                        : getUserNameWithoutDomain(user?.userName);

                    return (
                        <Header
                            image
                            as="h6"
                            className="header-with-icon"
                            data-componentid={ `${ componentId }-list-item-heading` }
                        >
                            <UserAvatar
                                data-componentid={ `${ componentId }-list-item-image` }
                                name={ isForNonHumanUser
                                    ? getAgentDisplayName(user) ?? "Agent"
                                    : UserManagementUtils.resolveAvatarUsername(user)
                                }
                                size="mini"
                                image={ user.profileUrl }
                                spaced="right"
                                data-suppress=""
                            />
                            <Header.Content>
                                <div>
                                    { header as ReactNode }
                                    { isForNonHumanUser && (
                                        <Header.Subheader
                                            data-testid={ `${ componentId }-item-sub-heading` }
                                        >
                                            { getAgentDisplayName(user) &&
                                                getUserNameWithoutDomain(user?.userName) }
                                        </Header.Subheader>
                                    ) }
                                </div>
                            </Header.Content>
                        </Header>
                    );
                },
                title: null
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
                "data-componentid": `${ componentId }-list-item-delete-button`,
                hidden: (): boolean => isReadOnly,
                icon: (): SemanticICONS =>  "trash alternate",
                onClick: (e: SyntheticEvent, user: UserBasicInterface): void =>
                    unassignUserFromRole(user),
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];

        return actions;
    };

    const advancedSearchFilter = (): ReactElement => (
        <AdvancedSearchWithBasicFilters
            data-componentid={ `${ componentId }-list-advanced-search` }
            onFilter={ (query: string) => handleUserFilter(query?.trim()) }
            disableSearchFilterDropdown
            filterAttributeOptions={ [] }
            placeholder={ t("users:advancedSearch.placeholder") }
            defaultSearchAttribute=""
            defaultSearchOperator=""
            triggerClearQuery={ triggerClearQuery }
            disableSearchAndFilterOptions={ selectedUsersFromUserStore?.length === 0 }
        />
    );

    return (
        <EmphasizedSegment padded="very" className="list-role-users-section">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <div>
                    <Heading as="h4" data-componentid={ componentId + "-heading" }>
                        { t(baseI18nKey + "heading") }
                    </Heading>
                    <Heading subHeading ellipsis as="h6">
                        { t(baseI18nKey + "subHeading") }
                    </Heading>
                </div>
                { !isReadOnly && (
                    <PrimaryButton
                        data-componentid={
                            `${ componentId }-list-edit-button`
                        }
                        onClick={ handleOpenAddNewUserModal }
                    >
                        <Icon name="plus"/>
                        { t(baseI18nKey + "list." +
                            "emptyPlaceholder.action") }
                    </PrimaryButton>
                ) }
            </Box>
            <Divider hidden/>
            <ListLayout
                advancedSearch={ advancedSearchFilter() }
                currentListSize={ role?.users?.length }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-componentid={ `${ componentId }-list-layout` }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                totalPages={ Math.ceil(selectedUsersFromUserStore?.length / listItemLimit) }
                totalListSize={ selectedUsersFromUserStore?.length }
                isLoading={ isUserStoresLoading || isSubmitting }
                showPaginationPageLimit={ !isReadOnly }
                rightActionPanel={ (
                    shouldShowUserstoreDropdown && (
                        <Dropdown
                            data-componentid={ `${ componentId }-list-usertore-dropdown` }
                            selection
                            options={ availableUserStores }
                            placeholder={ t("console:manage.features.groups.list.storeOptions") }
                            onChange={ handleDomainChange }
                            defaultValue={ activeUserStore ? activeUserStore : userstoresConfig.primaryUserstoreName }
                        />
                    )
                ) }
            >
                <DataTable<UserBasicInterface>
                    isLoading={ isUserStoresLoading }
                    loadingStateOptions={ {
                        count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                        imageType: "circular"
                    } }
                    actions={ resolveTableActions() }
                    columns={ resolveTableColumns() }
                    data={ paginatedUsers }
                    onRowClick={ () =>  null }
                    placeholders={ showPlaceholders() }
                    selectable={ false }
                    showHeader={ true }
                    transparent={ true }
                />
            </ListLayout>
            {
                showAddNewUserModal && (
                    <AddRoleUserModal
                        data-componentid={ `${ componentId }-add-user-modal` }
                        showAddNewUserModal={ showAddNewUserModal }
                        handleAddUserSubmit={ assignUsersToRole }
                        handleCloseAddNewUserModal={ handleCloseAddNewUserModal }
                        role={ role }
                        userstore={ selectedUserStoreDomainName }
                        availableUserStores={ ((!isPrivilegedUsersToggleVisible &&
                            isUserstoreSelectionInAdministratorsEnabled) ||
                            selectedUserStoreDomainName !== PRIMARY_USERSTORE)
                            ? availableUserStores
                            : []
                        }
                        isForNonHumanUser={ isForNonHumanUser }
                    />
                )
            }
        </EmphasizedSegment>
    );
};
