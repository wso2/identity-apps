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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Button,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem,
    UserAvatar,
    useWizardAlert
} from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon, Input, Modal, Table } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../../../core";
import { UserBasicInterface, getUsersList } from "../../../users";
import { updateGroupDetails } from "../../api";
import { CreateGroupMemberInterface, GroupsInterface, PatchGroupDataInterface } from "../../models";

/**
 * Proptypes for the group users list component.
 */
interface GroupUsersListProps extends TestableComponentInterface {
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
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ tempUserList, setTempUserList ] = useState<UserBasicInterface[]>([]);
    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);
    const [ initialUserList, setInitialUserList ] = useState<UserBasicInterface[]>([]);
    const [ selectedUsers, setSelectedUsers ] = useState<UserBasicInterface[]>(undefined);

    const [ isSelectAllUnAssignedUsers, setIsSelectAllUnAssignedUsers ] = useState<boolean>(false);
    const [ isSelectAllAssignedUsers, setIsSelectAllAssignedUsers ] = useState<boolean>(false);

    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<UserBasicInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<UserBasicInterface[]>([]);

    const [ showAddNewUserModal, setAddNewUserModalView ] = useState<boolean>(false);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    useEffect(() => {
        if (isSelectAllUnAssignedUsers) {
            setCheckedUnassignedListItems(usersList);
        } else {
            setCheckedUnassignedListItems([]);
        }
    }, [ isSelectAllUnAssignedUsers ]);

    useEffect(() => {
        if (isSelectAllAssignedUsers) {
            setCheckedAssignedListItems(tempUserList);
        } else {
            setCheckedAssignedListItems([]);
        }
    }, [ isSelectAllAssignedUsers ]);

    useEffect(() => {
        if (selectedUsers !== undefined) {
            return;
        }
        getList();
    }, []);

    /**
     * Select all un-assigned users
     */
    const selectAllUnAssignedList = () => {
        setIsSelectAllUnAssignedUsers(!isSelectAllUnAssignedUsers);
    };

    /**
     * Select all assigned users
     */
    const selectAllAssignedList = () => {
        setIsSelectAllAssignedUsers(!isSelectAllAssignedUsers);
    };

    const getList = () => {
        const userstore = group?.displayName?.indexOf("/") === -1 ? "primary" : group?.displayName?.split("/")[ 0 ];
        getUsersList(null, null, null, null, userstore)
            .then((response) => {
                const responseUsers = response.Resources;
                responseUsers.sort((userObject, comparedUserObject) =>
                    userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                );
                setUsersList(responseUsers);
                setInitialUserList(responseUsers);

                if (group.members && group.members.length > 0) {
                    const selectedUserList: UserBasicInterface[] = [];
                    if (responseUsers && responseUsers instanceof Array) {
                        responseUsers.slice().reverse().forEach(user => {
                            group.members.forEach(assignedUser => {
                                if (user.id === assignedUser.value) {
                                    selectedUserList.push(user);
                                    responseUsers.splice(responseUsers.indexOf(user), 1);
                                }
                            });
                        });
                        selectedUserList.sort((userObject, comparedUserObject) =>
                            userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                        );
                        setSelectedUsers(selectedUserList);
                        setTempUserList(selectedUserList);
                    }
                }
            });
    };

    const handleUnassignedItemCheckboxChange = (role) => {
        const checkedRoles = [ ...checkedUnassignedListItems ];

        if (checkedRoles.includes(role)) {
            checkedRoles.splice(checkedRoles.indexOf(role), 1);
            setCheckedUnassignedListItems(checkedRoles);
        } else {
            checkedRoles.push(role);
            setCheckedUnassignedListItems(checkedRoles);
        }
    };

    const handleSearchFieldChange = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList: UserBasicInterface[] = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), "i");

            usersList && usersList.map((user) => {
                isMatch = re.test(user.userName);
                if (isMatch) {
                    filteredRoleList.push(user);
                    setUsersList(filteredRoleList);
                }
            });
        } else {
            setUsersList(initialUserList);
        }
    };

    const handleAssignedItemCheckboxChange = (role) => {
        const checkedRoles = [ ...checkedAssignedListItems ];

        if (checkedRoles.includes(role)) {
            checkedRoles.splice(checkedRoles.indexOf(role), 1);
            setCheckedAssignedListItems(checkedRoles);
        } else {
            checkedRoles.push(role);
            setCheckedAssignedListItems(checkedRoles);
        }
    };

    const addUser = () => {
        const addedRoles = [ ...tempUserList ];

        if (checkedUnassignedListItems?.length > 0) {
            checkedUnassignedListItems.map((user) => {
                if (!(tempUserList.includes(user))) {
                    addedRoles.push(user);
                }
            });
        }
        setUsersList(usersList.filter(user => (
            checkedUnassignedListItems.indexOf(user) === -1
        )));
        setTempUserList(addedRoles);
        setIsSelectAllUnAssignedUsers(false);
    };

    const removeUser = () => {
        const removedUsers = [ ...tempUserList ];

        if (checkedAssignedListItems?.length > 0) {
            checkedAssignedListItems.map(user => {
                removedUsers.splice(removedUsers.indexOf(user), 1);
                usersList.push(user);
            });
            setUsersList(usersList);
            setTempUserList(removedUsers);
            setCheckedUnassignedListItems([]);
        }

    };

    const handleOpenAddNewGroupModal = () => {
        setAddNewUserModalView(true);
    };

    const handleCloseAddNewGroupModal = () => {
        setTempUserList(selectedUsers);
        setAddNewUserModalView(false);
    };

    const handleAssignedUserListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredUserList: UserBasicInterface[] = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), "i");

            selectedUsers && selectedUsers.map((user) => {
                isMatch = re.test(user.userName);
                if (isMatch) {
                    filteredUserList.push(user);
                    setSelectedUsers(filteredUserList);
                }
            });
        } else {
            setSelectedUsers(initialUserList);
        }
    };

    const handleAddUserSubmit = () => {
        updateGroupUsersList();
        setSelectedUsers(tempUserList);
        setAddNewUserModalView(false);
    };

    const updateGroupUsersList = () => {
        const newUsers: CreateGroupMemberInterface[] = [];

        for (const selectedUser of tempUserList) {
            newUsers.push({
                display: selectedUser.userName,
                value: selectedUser.id
            });
        }

        const groupData: PatchGroupDataInterface = {
            Operations: [ {
                "op": "replace",
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
            }).catch(() => {
                setAlert({
                    description: t("console:manage.features.groups.notifications.updateGroup.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.groups.notifications.updateGroup.error.message")
                });
            });
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
                    t("console:manage.features.roles.addRoleWizard.users.assignUserModal.heading",
                        { type: "Group" })
                }
                <Heading subHeading ellipsis as="h6">
                    {
                        t("console:manage.features.roles.addRoleWizard.users.assignUserModal.subHeading",
                            { type: "group" })
                    }
                </Heading>
            </Modal.Header>
            <Modal.Content image>
                { alert && alertComponent }
                <TransferComponent
                    data-testid={ `${ testId }-user-list-transfer` }
                    searchPlaceholder={ t("console:manage.features.roles.addRoleWizard.users.assignUserModal.list." +
                        "searchPlaceholder") }
                    addItems={ addUser }
                    removeItems={ removeUser }
                    // TODO: Add two methods to handle the search of each list.
                    handleUnelectedListSearch={ handleSearchFieldChange }
                    handleSelectedListSearch={ handleSearchFieldChange }
                >
                    <TransferList
                        isListEmpty={ !(usersList?.length > 0) }
                        listType="unselected"
                        listHeaders={ [
                            t("console:manage.features.roles.addRoleWizard.users.assignUserModal.list.listHeader")
                        ] }
                        handleHeaderCheckboxChange={ selectAllUnAssignedList }
                        isHeaderCheckboxChecked={ isSelectAllUnAssignedUsers }
                        data-testid={ `${ testId }-unselected-users-select-all-checkbox` }
                        emptyPlaceholderContent={ t("console:manage.features.transferList.list.emptyPlaceholders." +
                            "roles.selected", { type: "users" }) }
                    >
                        {
                            usersList?.map((user, index) => {
                                return (
                                    <TransferListItem
                                        handleItemChange={ () =>
                                            handleUnassignedItemCheckboxChange(user)
                                        }
                                        key={ index }
                                        listItem={ user.userName }
                                        listItemId={ user.id }
                                        listItemIndex={ index }
                                        isItemChecked={ checkedUnassignedListItems?.includes(user) }
                                        showSecondaryActions={ false }
                                        data-testid={ `${ testId }-unselected-users` }
                                    />
                                );
                            })
                        }
                    </TransferList>
                    <TransferList
                        isListEmpty={ !(tempUserList?.length > 0) }
                        listType="selected"
                        listHeaders={ [
                            t("console:manage.features.roles.addRoleWizard.users.assignUserModal.list.listHeader")
                        ] }
                        handleHeaderCheckboxChange={ selectAllAssignedList }
                        isHeaderCheckboxChecked={ isSelectAllAssignedUsers }
                        data-testid={ `${ testId }-selected-users-select-all-checkbox` }
                        emptyPlaceholderContent={ t("console:manage.features.transferList.list.emptyPlaceholders." +
                            "roles.selected", { type: "users" }) }
                    >
                        {
                            tempUserList?.map((user, index) => {
                                return (
                                    <TransferListItem
                                        handleItemChange={ () =>
                                            handleAssignedItemCheckboxChange(user)
                                        }
                                        key={ index }
                                        listItem={ user.userName }
                                        listItemId={ user.id }
                                        listItemIndex={ index }
                                        isItemChecked={ checkedAssignedListItems?.includes(user) }
                                        showSecondaryActions={ false }
                                        data-testid={ `${ testId }-selected-users` }
                                    />
                                );
                            })
                        }
                    </TransferList>
                </TransferComponent>
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
                            >
                                { t("common:save") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );

    return (
        <>
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 8 }>
                        {
                            selectedUsers?.length > 0 ? (
                                <EmphasizedSegment className="user-role-edit-header-segment">
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Input
                                                data-testid={ `${ testId }-users-list-search-input` }
                                                icon={ <Icon name="search" /> }
                                                onChange={ handleAssignedUserListSearch }
                                                placeholder={ t("console:manage.features.roles.addRoleWizard." +
                                                    "users.assignUserModal.list.searchPlaceholder") }
                                                floated="left"
                                                size="small"
                                            />
                                            {
                                                !isReadOnly && (
                                                    <Button
                                                        data-testid={ `${ testId }-users-list-edit-button` }
                                                        size="medium"
                                                        icon="pencil"
                                                        floated="right"
                                                        onClick={ handleOpenAddNewGroupModal }
                                                    />
                                                )
                                            }
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Table singleLine compact>
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell />
                                                    <Table.HeaderCell>
                                                        { t("console:manage.features.roles.edit.users.list." +
                                                            "header") }
                                                    </Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {
                                                    selectedUsers?.map((user) => {
                                                        return (
                                                            <Table.Row key={ user.id }>
                                                                <Table.Cell collapsing>
                                                                    <UserAvatar
                                                                        data-testid={ `${ testId }-users-list-
                                                                            ${ user.userName }-avatar` }
                                                                        name={ user.userName }
                                                                        size="mini"
                                                                        floated="left"
                                                                        image={ user.profileUrl }
                                                                    />
                                                                </Table.Cell>
                                                                <Table.Cell>
                                                                    { user.userName }
                                                                </Table.Cell>
                                                            </Table.Row>
                                                        );
                                                    })
                                                }
                                            </Table.Body>
                                        </Table>
                                    </Grid.Row>
                                </EmphasizedSegment>
                            ) : (
                                <EmphasizedSegment>
                                    <EmptyPlaceholder
                                        title={ t("console:manage.features.roles.edit.users.list." +
                                            "emptyPlaceholder.title") }
                                        subtitle={ [
                                            t("console:manage.features.roles.edit.users.list." +
                                                "emptyPlaceholder.subtitles", { type: "group" })
                                        ] }
                                        action={
                                            !isReadOnly && (
                                                <PrimaryButton
                                                    data-testid={ `${ testId }-users-list-empty-assign-users-
                                                    button` }
                                                    onClick={ handleOpenAddNewGroupModal }
                                                >
                                                    <Icon name="plus" />
                                                    { t("console:manage.features.roles.edit.users.list." +
                                                        "emptyPlaceholder.action") }
                                                </PrimaryButton>
                                            )
                                        }
                                        image={ getEmptyPlaceholderIllustrations().emptyList }
                                        imageSize="tiny"
                                    />
                                </EmphasizedSegment>
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
                { addNewUserModal() }
            </Grid>
        </>
    );
};
