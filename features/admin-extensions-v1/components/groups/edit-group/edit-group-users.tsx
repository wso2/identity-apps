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

import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import {
    AlertLevels,
    LoadableComponentInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Button,
    Code,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    LinkButton,
    ListLayout,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem,
    UserAvatar,
    useWizardAlert
} from "@wso2is/react-components";
import escapeRegExp from "lodash-es/escapeRegExp";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Dispatch,
    FormEvent,
    FunctionComponent,
    ReactElement,
    SetStateAction,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch as ReduxDispatch } from "redux";
import { Divider, Grid, Header, Icon, Modal, PaginationProps, Table } from "semantic-ui-react";
import { AdvancedSearchWithBasicFilters, UIConstants,
    getEmptyPlaceholderIllustrations } from "../../../../admin-core-v1";
import {
    CreateGroupMemberInterface,
    GroupsInterface,
    GroupsMemberInterface,
    PatchGroupDataInterface,
    updateGroupDetails
} from "../../../../admin-groups-v1";
import { getUsersList } from "../../../../features/users/api/users";
import { UserBasicInterface, UserListInterface } from "../../../../features/users/models/user";
import { UserManagementUtils } from "../../../../features/users/utils";
import { SCIMConfigs } from "../../../configs/scim";

/**
 * Proptypes for the group users list component.
 */
interface GroupUsersListProps extends TestableComponentInterface, LoadableComponentInterface {
    group: GroupsInterface;
    isGroup: boolean;
    isReadOnly?: boolean;
    onGroupUpdate: (groupId: string) => void;
    isGroupDetailsRequestLoading: boolean;
}

export const GroupUsersList: FunctionComponent<GroupUsersListProps> = (props: GroupUsersListProps): ReactElement => {
    const {
        isReadOnly,
        group,
        onGroupUpdate,
        isGroupDetailsRequestLoading,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: ReduxDispatch = useDispatch();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const [ allUserListPerPage, setAllUserListPerPage ] = useState<UserBasicInterface[]>([]);
    const [ groupUsersListPerPage, setGroupUsersListPerPage ] = useState<UserBasicInterface[]>([]);
    const [ addModalUserList, setAddModalUserList ] = useState<UserBasicInterface[]>([]);
    const [ , setIsSelectAllUsers ] = useState<boolean>(false);
    const [ showAddNewUserModal, setAddNewUserModalView ] = useState<boolean>(false);
    const [ isSelectedUsersFetchRequestLoading, setIsSelectedUsersFetchRequestLoading ] = useState<boolean>(true);
    const [ isUsersFetchRequestLoading, setIsUsersFetchRequestLoading ] = useState<boolean>(true);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ modalListOffset, setModalListOffset ] = useState<number>(0);
    const [ isUsersNextPageAvailable, setIsUsersNextPageAvailable ] = useState<boolean>(true);
    const [ isUserModalNextPageAvailable, setIsUserModalNextPageAvailable ] = useState<boolean>(true);
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ modalSearchQuery, setModalSearchQuery ] = useState<string>("");
    const [ addedUsers, setAddedUsers ] = useState<UserBasicInterface[]>([]);
    const [ removedUsers, setRemovedUsers ] = useState<UserBasicInterface[]>([]);

    const listItemLimit: number = UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT + 1;
    const numberOfPages: number = 100;

    // used to resolve pagination of group's user list vs all users list
    enum USER_LIST_TYPE {
        GROUP_USERS,
        ALL_USERS
    }

    useEffect(() => {

        getSelectedUserList();
    }, [ group, listOffset, searchQuery ]);

    useEffect(() => {

        getUserList();
    }, [ modalListOffset, showAddNewUserModal, modalSearchQuery ]);

    /**
     * Get the users list.
     */
    const getUserList = (): Promise<void> => {

        const userstore: string = group?.displayName?.indexOf("/") === -1
            ? "primary"
            : group?.displayName?.split("/")[ 0 ];

        const query: string | null = modalSearchQuery?.length > 0 ? modalSearchQuery : null;

        setIsUsersFetchRequestLoading(true);

        return getUsersList(listItemLimit, modalListOffset, query, null, userstore)
            .then((response: UserListInterface) => {
                let moderatedUserList: UserBasicInterface[] = moderateUsersList(response?.Resources,
                    listItemLimit, USER_LIST_TYPE.ALL_USERS);

                // Exclude JIT users.
                moderatedUserList = response?.Resources?.filter(
                    (user: UserBasicInterface) => !user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId);

                setAllUserListPerPage(moderatedUserList);
                setAddModalUserList(moderatedUserList);
            }).catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("users:notifications.fetchUsers.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("users:notifications.fetchUsers.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("users:notifications.fetchUsers.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("users:notifications.fetchUsers.genericError.message")
                }));

                setAllUserListPerPage([]);
                setAddModalUserList([]);
            })
            .finally(() => {
                setIsUsersFetchRequestLoading(false);
            });
    };

    /**
     * Get the selected users list.
     */
    const getSelectedUserList = (): void => {

        const userstore: string = group?.displayName?.indexOf("/") === -1
            ? "primary"
            : group?.displayName?.split("/")[ 0 ];

        let query: string = "groups eq " + group?.displayName?.split("/")[ 1 ];

        if (searchQuery?.length > 0) {
            query = query + " and " + searchQuery;
        }

        setIsSelectedUsersFetchRequestLoading(true);

        getUsersList(listItemLimit, listOffset, query, null, userstore)
            .then((response: UserListInterface) => {
                let moderatedUserList: UserBasicInterface[] = moderateUsersList(response?.Resources,
                    listItemLimit, USER_LIST_TYPE.GROUP_USERS);

                // Exclude JIT users.
                moderatedUserList = moderatedUserList?.filter(
                    (user: UserBasicInterface) => !user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId);

                setGroupUsersListPerPage(moderatedUserList);
            }).catch((error: IdentityAppsApiException) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("users:notifications.fetchUsers.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("users:notifications.fetchUsers.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("users:notifications.fetchUsers.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("users:notifications.fetchUsers.genericError.message")
                }));

                setGroupUsersListPerPage([]);
            })
            .finally(() => {
                setIsSelectedUsersFetchRequestLoading(false);
            });
    };

    const moderateUsersList = (list: UserBasicInterface[] | null, requestedLimit: number,
        listType: USER_LIST_TYPE): UserBasicInterface[] => {

        if (list?.length < requestedLimit) {
            if (listType === USER_LIST_TYPE.GROUP_USERS) {
                setIsUsersNextPageAvailable(false);
            } else {
                setIsUserModalNextPageAvailable(false);
            }
        } else {
            list?.splice(-1, 1);
            if (listType === USER_LIST_TYPE.GROUP_USERS) {
                setIsUsersNextPageAvailable(true);
            } else {
                setIsUserModalNextPageAvailable(true);
            }
        }

        return list;
    };

    // Commented to temporarily remove the Select All option in user selection.
    // Uncomment when the Select All option needs to be re-enabled.
    // /**
    //  * Select all assigned users
    //  */
    // const selectAllAssignedList = () => {
    //
    //     if (!isSelectAllUsers) {
    //         setNewlySelectedUsers(originalUserList);
    //     } else {
    //         setNewlySelectedUsers([]);
    //     }
    //
    //     setIsSelectAllUsers(!isSelectAllUsers);
    // };

    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setListOffset((data.activePage as number - 1) * UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT + 1);
    };

    const handleModalPaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps): void => {
        setModalListOffset((data.activePage as number - 1) * UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT + 1);
    };

    const handleSearchFieldChange = (e: FormEvent<HTMLInputElement>, query: string, list: UserBasicInterface[],
        stateAction: Dispatch<SetStateAction<any>>) => {

        let isMatch: boolean = false;
        const filteredRoleList: UserBasicInterface[] = [];

        if (!isEmpty(query)) {
            const regExp: RegExp = new RegExp(escapeRegExp(query), "i");

            list && list.map((user: UserBasicInterface) => {
                isMatch = regExp.test(user.userName) || (user.name && regExp.test(user.name.givenName))
                    || (user.name && regExp.test(user.name.familyName));

                if (isMatch) {
                    filteredRoleList.push(user);
                }
            });

            stateAction(filteredRoleList);

            return;
        }

        stateAction(list);

        return;
    };

    // check the user details returned from backend to see if the user is already in the group
    const isAlreadyInGroup = (user: UserBasicInterface) => {
        let currentGroupName: string = "";
        let isInGroup: boolean = false;

        if (group?.displayName?.indexOf("/") != -1) {
            currentGroupName = group?.displayName?.split("/")[ 1 ];

            user.groups?.map((group: GroupsMemberInterface) => {

                if(group.display?.indexOf("/") != -1 &&
                    group.display?.split("/")[ 1 ] === currentGroupName) {
                    isInGroup =  true;
                }
            });
        }

        return isInGroup;
    };

    const handleAssignedItemCheckboxChange = (user: UserBasicInterface) => {
        const newlyAddedUsers: UserBasicInterface[] = !isEmpty(addedUsers)
            ? [ ...addedUsers ]
            : [];

        const newlyRemovedUsers: UserBasicInterface[] = !isEmpty(removedUsers)
            ? [ ...removedUsers ]
            : [];

        if (isAlreadyInGroup(user)) {
            if (newlyRemovedUsers.some((removedUser: UserBasicInterface) => removedUser.id===user.id)) {
                newlyRemovedUsers.splice(newlyRemovedUsers.findIndex(
                    (removedUser: UserBasicInterface) => removedUser.id===user.id), 1);
                setRemovedUsers(newlyRemovedUsers);
            } else {
                newlyRemovedUsers.push(user);
                setRemovedUsers(newlyRemovedUsers);
            }
        } else {
            if (newlyAddedUsers.some((addedUser: UserBasicInterface) => addedUser.id===user.id)) {
                newlyAddedUsers.splice(newlyAddedUsers.findIndex(
                    (addedUser: UserBasicInterface) => addedUser.id===user.id), 1);
                setAddedUsers(newlyAddedUsers);
            } else {
                newlyAddedUsers.push(user);
                setAddedUsers(newlyAddedUsers);
            }
        }
    };

    const resolveCheckboxStatus = (user: UserBasicInterface): boolean => {
        if(isAlreadyInGroup(user)) {
            if (removedUsers.some((removedUser: UserBasicInterface) => removedUser.id===user.id)) {
                return false;

            }

            return true;
        } else {
            if (addedUsers.some((addedUser: UserBasicInterface) => addedUser.id===user.id)) {
                return true;
            }

            return false;
        }
    };

    const handleOpenAddNewGroupModal = () => {
        getUserList()
            .then(() => {
                setIsSelectAllUsers(groupUsersListPerPage?.length === allUserListPerPage?.length);
                setAddNewUserModalView(true);
            }).catch(() => {
                dispatch(addAlert({
                    description: t("users:notifications.fetchUsers.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("users:notifications.fetchUsers.genericError.message")
                }));
            });
    };

    const handleCloseAddNewGroupModal = () => {
        setAddModalUserList(allUserListPerPage);
        setModalListOffset(0);
        setIsSelectAllUsers(false);
        setAddNewUserModalView(false);
    };

    const handleAddUserSubmit = () => {
        updateGroupUsersList();
        setAddNewUserModalView(false);
    };

    const updateGroupUsersList = () => {
        const newlyAddedUsers: CreateGroupMemberInterface[] = [];

        for (const addedUser of addedUsers) {
            newlyAddedUsers.push({
                display: addedUser.userName,
                value: addedUser.id
            });
        }

        const groupData: PatchGroupDataInterface = {
            Operations:
            [
                {
                    "op": "add",
                    "value": {
                        "members": newlyAddedUsers
                    }
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        for (const removedUser of removedUsers) {
            groupData.Operations.push({
                "op": "remove",
                "path": "members[display eq " + removedUser.userName + "]"
            });
        }

        setIsSubmitting(true);

        updateGroupDetails(group.id, groupData)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.groups.notifications.updateGroup.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.groups.notifications.updateGroup.success.message")
                }));
                onGroupUpdate(group.id);
            }).catch(() => {
                setAlert({
                    description: t("console:manage.features.groups.notifications.updateGroup.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.groups.notifications.updateGroup.error.message")
                });
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    const resolveListItemElement = (listItemValue: string) => {

        return (
            <div data-suppress="">
                { listItemValue }
            </div>
        );
    };

    const handleUserFilter = (query: string): void => {
        if (showAddNewUserModal) {
            setModalListOffset(0);
            setModalSearchQuery(query);
        } else {
            setSearchQuery(query);
        }
    };

    const handleSearchQueryClear = (): void => {
        if (showAddNewUserModal) {
            setModalListOffset(0);
            setModalSearchQuery("");
        } else {
            setSearchQuery("");
        }
    };

    const advancedSearchFilter = (): ReactElement => (
        <AdvancedSearchWithBasicFilters
            data-testid={ `${ testId }-user-list-advanced-search` }
            style={ { maxHeight: 20 } }
            onFilter={ handleUserFilter }
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
                t("users:advancedSearch.form.inputs.filterAttribute.placeholder")
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
            defaultSearchAttribute="emails"
            defaultSearchOperator="co"
        />
    );

    const renderUserList = (): ReactElement => {
        if (groupUsersListPerPage?.length > 0) {
            return (<Table singleLine compact>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>
                            <strong>
                                { t(
                                    "user:updateUser." +
                                    "groups.editGroups.groupList.headers.1"
                                ) }
                            </strong>
                        </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    { groupUsersListPerPage?.map(
                        (user: UserBasicInterface) => {
                            return renderUserTableRow(user);
                        })
                    }
                </Table.Body>
            </Table>);
        }

        if (searchQuery.length > 0) {
            return (<EmptyPlaceholder
                action={ (
                    <LinkButton onClick={ handleSearchQueryClear }>
                        { t("users:usersList.search." +
                            "emptyResultPlaceholder.clearButton") }
                    </LinkButton>
                ) }
                image={ getEmptyPlaceholderIllustrations().emptySearch }
                imageSize="tiny"
                title={ t("users:usersList.search." +
                    "emptyResultPlaceholder.title") }
                subtitle={ [
                    t("users:usersList.search." +
                        "emptyResultPlaceholder.subTitle.0",
                    { query: searchQuery }),
                    t("users:usersList.search." +
                        "emptyResultPlaceholder.subTitle.1")
                ] }
            />);
        } else {
            return (<EmptyPlaceholder
                title={ t(
                    "roles:edit.users.list." +
                    "emptyPlaceholder.title"
                ) }
                subtitle={ [
                    t(
                        "roles:edit.users.list." +
                        "emptyPlaceholder.subtitles",
                        { type: "group" }
                    )
                ] }
                action={
                    !isReadOnly && (
                        <PrimaryButton
                            data-testid={
                                `${ testId }-users-list-empty-assign-users-button` }
                            onClick={ handleOpenAddNewGroupModal }
                        >
                            <Icon name="plus" />
                            { t(
                                "roles:edit.users.list." +
                                "emptyPlaceholder.action"
                            ) }
                        </PrimaryButton>
                    )
                }
                image={ getEmptyPlaceholderIllustrations().emptyList }
                imageSize="tiny"
            />);
        }
    };

    const addNewUserModal = () => (
        <Modal
            data-testid={ `${ testId }-assign-user-wizard-modal` }
            dimmer="blurring"
            open={ showAddNewUserModal }
            size="small"
            className="user-roles"
        >
            <Modal.Header>
                {
                    t("roles:addRoleWizard.users.assignUserModal.heading",
                        { type: "Group" })
                }
                <Heading subHeading ellipsis as="h6">
                    {
                        t("roles:addRoleWizard.users.assignUserModal.subHeading",
                            { type: "group" })
                    }
                </Heading>
            </Modal.Header>
            <Modal.Content>
                { alert && alertComponent }
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={ 16 }>
                            <EmphasizedSegment>
                                { advancedSearchFilter() }
                            </EmphasizedSegment>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={ 16 }>
                            <ListLayout
                                showTopActionPanel={ false }
                                currentListSize={ addModalUserList?.length }
                                listItemLimit={ listItemLimit }
                                onItemsPerPageDropdownChange={ null }
                                data-componentid="group-mgt-user-list-layout"
                                data-testid="group-mgt-user-list-layout"
                                onPageChange={ handleModalPaginationChange }
                                showPagination={ true }
                                totalPages={ numberOfPages }
                                totalListSize={ allUserListPerPage?.length }
                                isLoading={ isUsersFetchRequestLoading }
                                paginationOptions={ {
                                    disableNextButton: !isUserModalNextPageAvailable,
                                    showItemsPerPageDropdown: false
                                } }
                                showPaginationPageLimit={ false }
                            >
                                <TransferComponent
                                    compact
                                    basic
                                    bordered
                                    className="group-add-user-model-transfer-list"
                                    selectionComponent
                                    searchPlaceholder={
                                        t("roles:addRoleWizard.users.assignUserModal.list" +
                                            ".searchPlaceholder")
                                    }
                                    isLoading={ isUsersFetchRequestLoading }
                                    showListSearch={ false }
                                    handleUnelectedListSearch={ (e: FormEvent<HTMLInputElement>,
                                        { value }: { value: string }) => {
                                        handleSearchFieldChange(e, value, allUserListPerPage, setAddModalUserList);
                                    } }
                                    data-testid={ `${ testId }-user-list-transfer` }
                                >
                                    <TransferList
                                        selectionComponent
                                        isListEmpty={ !(allUserListPerPage?.length > 0) }
                                        isLoading={ isUsersFetchRequestLoading }
                                        listType="unselected"
                                        data-testid={ `${ testId }-unselected-transfer-list` }
                                        emptyPlaceholderContent={ t("transferList:list." +
                                            "emptyPlaceholders.groups.common", { type: "users" }) }
                                        emptyPlaceholderDefaultContent={ t("transferList:list."
                                            + "emptyPlaceholders.default") }
                                    >
                                        { allUserListPerPage?.map((user: UserBasicInterface, index: number) => {
                                            const header: string = getUserNameWithoutDomain(user?.userName);
                                            const subHeader: string =
                                                UserManagementUtils.resolveUserListSubheader(user);

                                            return (
                                                <TransferListItem
                                                    handleItemChange={ () => handleAssignedItemCheckboxChange(user) }
                                                    key={ index }
                                                    listItem={ {
                                                        listItemElement: resolveListItemElement(header),
                                                        listItemValue: subHeader
                                                    } }
                                                    listItemId={ user.id }
                                                    listItemIndex={ index }
                                                    isItemChecked={ resolveCheckboxStatus(user) }
                                                    showSecondaryActions={ false }
                                                    showListSubItem={ true }
                                                    listSubItem={ header !== subHeader && (
                                                        <Code compact withBackground={ false }>{ subHeader }</Code>
                                                    ) }
                                                    data-testid={
                                                        `${ testId }-unselected-transfer-list-item-${ index }` }
                                                />
                                            );
                                        })
                                        }
                                    </TransferList>
                                </TransferComponent>
                            </ListLayout>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid={ `${ testId }-assign-user-wizard-modal-cancel-button` }
                                onClick={ handleCloseAddNewGroupModal }
                                floated="left"
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                data-testid={ `${ testId }-assign-user-wizard-modal-save-button` }
                                onClick={ () => {
                                    handleAddUserSubmit();
                                } }
                                floated="right"
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                            >
                                { t("common:save") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );

    const renderUserTableRow = (user: UserBasicInterface): ReactElement => {

        const header: string = getUserNameWithoutDomain(user?.userName);
        const subHeader: string = UserManagementUtils.resolveUserListSubheader(user);
        const isNameAvailable: boolean = user.name?.familyName === undefined && user.name?.givenName === undefined;

        return (
            <Table.Row key={ user.id }>
                <Table.Cell>
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-testid={ `${ testId }-item-heading` }
                    >
                        <UserAvatar
                            data-testid={
                                `${ testId }-users-list-${
                                    user.userName }-avatar`
                            }
                            name={ header }
                            spaced="right"
                            size="mini"
                            floated="left"
                            image={ user.profileUrl }
                            data-suppress=""
                        />
                        <Header.Content>
                            <div className={ isNameAvailable ? "mt-2" : "" } data-suppress="">{ header }</div>
                            {
                                (!isNameAvailable) &&
                                    (
                                        <Header.Subheader
                                            data-testid={ `${ testId }-item-sub-heading` }
                                        >
                                            { subHeader }
                                        </Header.Subheader>
                                    ) }
                        </Header.Content>
                    </Header>
                </Table.Cell>
            </Table.Row>
        );
    };

    return (
        <EmphasizedSegment padded="very">
            <Heading as="h4">{ t("extensions:manage.groups.edit.users.heading") }</Heading>
            <Heading subHeading ellipsis as="h6">
                { t("extensions:manage.groups.edit.users.description") }
            </Heading>
            <Divider hidden />
            <Grid>
                { (groupUsersListPerPage?.length > 0 || searchQuery?.length > 0) ? (<Grid.Row columns={ 2 }>
                    <Grid.Column width={ 13 }>
                        <EmphasizedSegment
                            data-testid="group-mgt-users-list-se"
                            className="user-role-edit-header-segment-se"
                        >
                            { advancedSearchFilter() }
                        </EmphasizedSegment>
                    </Grid.Column>
                    <Grid.Column width={ 3 }>
                        { !isReadOnly && (
                            <Button
                                data-testid={ `${ testId }-users-list-edit-button` }
                                size="large"
                                icon="pencil"
                                floated="right"
                                onClick={ handleOpenAddNewGroupModal }
                            />
                        ) }
                    </Grid.Column>
                </Grid.Row>) : null }
                <Grid.Row>
                    <Grid.Column computer={ 16 }>
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                <ListLayout
                                    showTopActionPanel={ false }
                                    currentListSize={ groupUsersListPerPage?.length }
                                    listItemLimit={ listItemLimit }
                                    onItemsPerPageDropdownChange={ null }
                                    data-componentid="group-mgt-user-list-layout"
                                    data-testid="group-mgt-user-list-layout"
                                    onPageChange={ handlePaginationChange }
                                    showPagination={ groupUsersListPerPage?.length > 0 }
                                    totalPages={ numberOfPages }
                                    totalListSize={ groupUsersListPerPage?.length }
                                    isLoading={ isSelectedUsersFetchRequestLoading || isGroupDetailsRequestLoading }
                                    paginationOptions={ {
                                        disableNextButton: !isUsersNextPageAvailable,
                                        showItemsPerPageDropdown: false
                                    } }
                                    showPaginationPageLimit={ false }
                                >
                                    { renderUserList() }
                                </ListLayout>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                <Divider hidden />
                            </Grid.Column>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                <Divider hidden />
                            </Grid.Column>
                        </Grid.Row>
                        { addNewUserModal() }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EmphasizedSegment>
    );
};
