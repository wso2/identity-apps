/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
import { AdvancedSearchWithBasicFilters, UIConstants, getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1";
import { userstoresConfig } from "@wso2is/admin.extensions.v1";
import { useUsersList } from "@wso2is/admin.users.v1/api";
import { UserManagementConstants } from "@wso2is/admin.users.v1/constants";
import { UserBasicInterface } from "@wso2is/admin.users.v1/models/user";
import { UserManagementUtils } from "@wso2is/admin.users.v1/utils";
import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import { AlertLevels, LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
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
import React, {
    FunctionComponent,
    ReactElement,
    ReactNode,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Divider, DropdownProps, Header, Icon, PaginationProps, SemanticICONS } from "semantic-ui-react";
import { AddGroupUserModal } from "./add-group-user-modal";
import { updateGroupDetails } from "../../api/groups";
import { CreateGroupMemberInterface, GroupsInterface, PatchGroupDataInterface } from "../../models/groups";
import "./edit-group-users.scss";

/**
 * Temporary value to append to the list limit to figure out if the next button is there.
 */
const TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET: number = 1;
const NUMBER_OF_PAGES_FOR_LDAP: number = 100;

/**
 * Proptypes for the group users list component.
 */
interface GroupUsersListProps extends TestableComponentInterface, LoadableComponentInterface {
    group: GroupsInterface;
    isGroup: boolean;
    isReadOnly?: boolean;
    onGroupUpdate: (groupId: string) => void;
}

export const GroupUsersList: FunctionComponent<GroupUsersListProps> = (props: GroupUsersListProps): ReactElement => {
    const {
        isReadOnly,
        group,
        onGroupUpdate,
        isLoading,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ showAddNewUserModal, setAddNewUserModalView ] = useState<boolean>(false);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ listOffset, setListOffset ] = useState<number>(0);

    const modifiedLimit: number = listItemLimit + TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET;
    const excludedAttributes: string = UserManagementConstants.GROUPS_AND_ROLES_ATTRIBUTE;
    const userstore: string = group?.displayName?.indexOf("/") === -1
        ? userstoresConfig.primaryUserstoreName
        : group?.displayName?.split("/")[ 0 ];
    const groupName: string = group?.displayName?.indexOf("/") === -1
        ? group?.displayName
        : group?.displayName?.split("/")[ 1 ];
    const groupsFilter: string = `groups eq ${ groupName }`;

    /**
     * Fetch the user list of the group.
     */
    const {
        data: groupUserList,
        isLoading: isGroupUserListFetchRequestLoading,
        error: groupUserListFetchRequestError,
        mutate: mutateGroupUserListFetchRequest
    } = useUsersList(
        modifiedLimit,
        listOffset,
        searchQuery ? `${searchQuery} and ${groupsFilter}` : groupsFilter,
        null,
        userstore,
        excludedAttributes
    );

    /**
     * Handles the user list fetch request error.
     */
    useEffect(() => {
        if (!groupUserListFetchRequestError) {
            return;
        }

        if (groupUserListFetchRequestError.response
            && groupUserListFetchRequestError.response.data
            && groupUserListFetchRequestError.response.data.description) {
            dispatch(addAlert({
                description: groupUserListFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("console:manage.features.users.notifications." +
                    "fetchUsers.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:manage.features.users.notifications.fetchUsers.genericError." +
                "description"),
            level: AlertLevels.ERROR,
            message: t("console:manage.features.users.notifications.fetchUsers.genericError.message")
        }));
    }, [ groupUserListFetchRequestError ]);

    const handleOpenAddNewGroupModal = () => {
        setAddNewUserModalView(true);
    };

    const handleCloseAddNewGroupModal = () => {
        setAddNewUserModalView(false);
    };

    const handleAddUserSubmit = (selectedUsers: UserBasicInterface[]) => {
        updateGroupUsersList(selectedUsers);
    };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const handleItemsPerPageDropdownChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
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

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
    };

    /**
     * Resolves the total number of pages.
     *
     * @returns Total number of pages.
     **/
    const resolveTotalPages = (): number => {
        if (userstore === userstoresConfig.primaryUserstoreName) {
            return Math.ceil(groupUserList?.totalResults / listItemLimit);
        } else {
            /** Response from the LDAP only contains the total items per page.
             * No way to resolve the total number of items. So a large value will be set here and the
             * next button will be disabled if there are no more items to fetch.
            */
            return NUMBER_OF_PAGES_FOR_LDAP;
        }
    };

    /**
     * Updates the group users list.
     *
     * @param selectedUsers - Selected users.
     */
    const updateGroupUsersList = (selectedUsers: UserBasicInterface[]) => {
        const newUsers: CreateGroupMemberInterface[] = [];

        setIsSubmitting(true);

        for (const selectedUser of selectedUsers) {
            newUsers.push({
                display: selectedUser.userName,
                value: selectedUser.id
            });
        }

        const groupData: PatchGroupDataInterface = {
            Operations: [ {
                "op": "add",
                "value": {
                    "members": newUsers
                }
            } ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        updateGroupDetails(group.id, groupData)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.groups.notifications.updateGroup.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.groups.notifications.updateGroup.success.message")
                }));
                onGroupUpdate(group.id);
                mutateGroupUserListFetchRequest();
            }).catch(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.groups.notifications.updateGroup.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.groups.notifications.updateGroup.error.message")
                }));
            }).finally(() => {
                setAddNewUserModalView(false);
                setIsSubmitting(false);
            });
    };

    const unassignUserFromGroup = (user: UserBasicInterface) => {
        const groupData: PatchGroupDataInterface = {
            Operations: [ {
                "op": "remove",
                "path": `members[display eq ${user.userName}]`
            } ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        updateGroupDetails(group.id, groupData)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.groups.notifications.updateGroup.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.groups.notifications.updateGroup.success.message")
                }));
                onGroupUpdate(group.id);
                mutateGroupUserListFetchRequest();
            }).catch(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.groups.notifications.updateGroup.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.groups.notifications.updateGroup.error.message")
                }));
            }).finally(() => {
                setAddNewUserModalView(false);
                setIsSubmitting(false);
            });
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

        if (groupUserList?.totalResults === 0) {
            return (
                <EmptyPlaceholder
                    title={ t("roles:edit.users.list." +
                        "emptyPlaceholder.title") }
                    subtitle={ [
                        t("roles:edit.users.list." +
                            "emptyPlaceholder.subtitles", { type: "group" })
                    ] }
                    action={
                        !isReadOnly && (
                            <PrimaryButton
                                data-testid={
                                    `${ testId }-users-list-empty-assign-users-button`
                                }
                                data-componentid={
                                    `${ testId }-users-list-empty-assign-users-button`
                                }
                                onClick={ handleOpenAddNewGroupModal }
                            >
                                <Icon name="plus"/>
                                { t("roles:edit.users.list." +
                                    "emptyPlaceholder.action") }
                            </PrimaryButton>
                        )
                    }
                    image={ getEmptyPlaceholderIllustrations().emptyList }
                    imageSize="tiny"
                />
            );
        }

        return null;
    };

    const advancedSearchFilter = (): ReactElement => (
        <AdvancedSearchWithBasicFilters
            onFilter={ handleUserFilter }
            disableSearchFilterDropdown={ false }
            filterAttributeOptions={ [
                {
                    key: 0,
                    text: t("users:advancedSearch.form.dropdown." +
                        "filterAttributeOptions.username"),
                    value: "userName"
                },
                {
                    key: 1,
                    text: t("users:advancedSearch.form.dropdown." +
                        "filterAttributeOptions.email"),
                    value: "emails"
                },
                {
                    key: 2,
                    text: "First Name",
                    value: "name.givenName"
                },
                {
                    key: 3,
                    text: "Last Name",
                    value: "name.familyName"
                }
            ] }
            filterAttributePlaceholder={
                t("users:advancedSearch.form.inputs.filterAttribute" +
                    ".placeholder")
            }
            filterConditionsPlaceholder={
                t("users:advancedSearch.form.inputs.filterCondition" +
                    ".placeholder")
            }
            filterValuePlaceholder={
                t("users:advancedSearch.form.inputs.filterValue" +
                    ".placeholder")
            }
            placeholder={ t("users:advancedSearch.placeholder") }
            defaultSearchAttribute="userName"
            defaultSearchOperator="co"
            triggerClearQuery={ triggerClearQuery }
            disableSearchAndFilterOptions={ groupUserList?.totalResults <= 0 && !searchQuery }
        />
    );

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
                                name={ UserManagementUtils.resolveAvatarUsername(user) }
                                size="mini"
                                image={ user.profileUrl }
                                spaced="right"
                                data-suppress=""
                            />
                            <Header.Content>
                                <div>
                                    { header as ReactNode }
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
                "data-componentid": `${ testId }-user-list-item-delete-button`,
                "data-testid": `${ testId }-user-list-item-delete-button`,
                hidden: (): boolean => isReadOnly,
                icon: (): SemanticICONS =>  "trash alternate",
                onClick: (e: SyntheticEvent, user: UserBasicInterface): void =>
                    unassignUserFromGroup(user),
                popupText: (): string => t("common:delete"),
                renderer: "semantic-icon"
            }
        ];

        return actions;
    };

    return (
        <EmphasizedSegment padded="very" className="list-group-roles-section">
            <Box display="flex" justifyContent="space-between">
                <div>
                    <Heading as="h4">
                        { t("groups:edit.users.heading") }
                    </Heading>
                    <Heading subHeading ellipsis as="h6">
                        { t("groups:edit.users.subHeading") }
                    </Heading>
                </div>
                { !isReadOnly && groupUserList?.totalResults > 0 && (
                    <PrimaryButton
                        data-testid={
                            `${ testId }-users-list-edit-button`
                        }
                        data-componentid={
                            `${ testId }-users-list-edit-button`
                        }
                        onClick={ handleOpenAddNewGroupModal }
                    >
                        <Icon name="plus"/>
                        { t("console:manage.features.roles.edit.users.list." +
                            "emptyPlaceholder.action") }
                    </PrimaryButton>
                ) }
            </Box>
            <Divider hidden/>
            <ListLayout
                advancedSearch={ advancedSearchFilter() }
                currentListSize={ groupUserList?.itemsPerPage }
                listItemLimit={ listItemLimit }
                onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
                data-componentid={ `${ testId }-user-list-layout` }
                data-testid={ `${ testId }-user-list-layout` }
                onPageChange={ handlePaginationChange }
                showPagination={ true }
                totalPages={ resolveTotalPages() }
                totalListSize={ groupUserList?.totalResults }
                isLoading={ isGroupUserListFetchRequestLoading || isSubmitting }
                paginationOptions={ {
                    showItemsPerPageDropdown: userstore === userstoresConfig.primaryUserstoreName
                        ? true
                        : false
                } }
                showPaginationPageLimit={ !isReadOnly }
            >
                <DataTable<UserBasicInterface>
                    isLoading={ isLoading }
                    loadingStateOptions={ {
                        count: UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
                        imageType: "circular"
                    } }
                    actions={ resolveTableActions() }
                    columns={ resolveTableColumns() }
                    data={ groupUserList?.Resources }
                    onRowClick={ () =>  null }
                    placeholders={ showPlaceholders() }
                    selectable={ false }
                    showHeader={ true }
                    transparent={ true }
                    data-testid={ testId }
                />
            </ListLayout>
            {
                showAddNewUserModal && (
                    <AddGroupUserModal
                        data-componentid={ testId }
                        showAddNewUserModal={ showAddNewUserModal }
                        handleAddUserSubmit={ handleAddUserSubmit }
                        handleCloseAddNewGroupModal={ handleCloseAddNewGroupModal }
                        group={ group }
                        userstore={ userstore }
                    />
                )
            }
        </EmphasizedSegment>
    );
};
