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

import { RolesMemberInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Forms } from "@wso2is/forms";
import {
    Button,
    ContentLoader,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem,
    UserAvatar
} from "@wso2is/react-components";
import escapeRegExp from "lodash-es/escapeRegExp";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Grid, Icon, Input, Modal, Table } from "semantic-ui-react";
import { UIConstants, getEmptyPlaceholderIllustrations } from "../../../core";
import { UserBasicInterface, getUsersList } from "../../../users";
import { CONSUMER_USERSTORE } from "../../../userstores";

/**
 * Proptypes for the role user list component.
 */
interface AddRoleUserProps extends TestableComponentInterface {
    triggerSubmit?: boolean;
    onSubmit?: (values: any) => void;
    assignedUsers?: RolesMemberInterface[];
    isEdit: boolean;
    isGroup: boolean;
    userStore?: string;
    initialValues?: UserBasicInterface[];
    isReadOnly?: boolean;
    /**
     * Fired when a user is removed from teh list.
     */
    handleTempUsersListChange?: (list: UserBasicInterface[]) => void;
    /**
     * Specifies if the there is a submission being carried out.
     */
    isSubmitting?: boolean;
}

export const AddRoleUsers: FunctionComponent<AddRoleUserProps> = (props: AddRoleUserProps): ReactElement => {
    const {
        triggerSubmit,
        onSubmit,
        assignedUsers,
        isEdit,
        initialValues,
        isGroup,
        userStore,
        isReadOnly,
        handleTempUsersListChange,
        isSubmitting,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ tempUserList, setTempUserList ] = useState<UserBasicInterface[]>([]);
    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);
    const [ initialUserList, setInitialUserList ] = useState<UserBasicInterface[]>([]);
    const [ selectedUsers, setSelectedUsers ] = useState<UserBasicInterface[]>([]);
    const [ , setInitialSelectedUsers ] = useState<UserBasicInterface[]>([]);
    const [ listOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);

    const [ isSelectAllUnAssignedUsers, setIsSelectAllUnAssignedUsers ] = useState<boolean>(false);
    const [ isSelectAllAssignedUsers, setIsSelectAllAssignedUsers ] = useState<boolean>(false);

    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<UserBasicInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<UserBasicInterface[]>([]);

    const [ showAddNewUserModal, setAddNewUserModalView ] = useState<boolean>(false);

    const [ isSelectedUsersLoading, setIsSelectedUsersLoading ] = useState<boolean>(true);

    const initialRenderTempUsers = useRef(true);

    useEffect(() => {
        if (initialRenderTempUsers.current) {
            initialRenderTempUsers.current = false;
        } else {
            handleTempUsersListChange && handleTempUsersListChange(tempUserList);
        }

    }, [ tempUserList ]);

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

    const getList = (limit: number, offset: number, filter: string, attribute: string, userStore: string) => {
        getUsersList(limit, offset, filter, attribute, userStore)
            .then((response) => {
                const responseUsers = response.Resources.filter((user
                ) => user.userName.split("/")[0] !== CONSUMER_USERSTORE);

                responseUsers.sort((userObject, comparedUserObject) =>
                    userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                );
                setUsersList(responseUsers);
                setInitialUserList(responseUsers);

                if (assignedUsers && assignedUsers.length !== 0) {
                    const selectedUserList: UserBasicInterface[] = [];

                    if (responseUsers && responseUsers instanceof Array ) {
                        responseUsers.slice().reverse().forEach(user => {
                            assignedUsers.forEach(assignedUser => {
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
                        setInitialSelectedUsers(selectedUserList);
                        setTempUserList(selectedUserList);
                    }
                }

                setIsSelectedUsersLoading(false);

                if (initialValues && initialValues instanceof Array) {
                    const selectedUserList: UserBasicInterface[] = [];

                    if (responseUsers && responseUsers instanceof Array ) {
                        responseUsers.forEach(user => {
                            initialValues.forEach(assignedUser => {
                                if (user.id === assignedUser.id) {
                                    selectedUserList.push(user);
                                }
                            });
                        });
                        selectedUserList.sort((userObject, comparedUserObject) =>
                            userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                        );
                        setUsersList(responseUsers.filter(function(user) {
                            return selectedUserList.indexOf(user) == -1;
                        }));
                        setSelectedUsers(selectedUserList);
                        setInitialSelectedUsers(selectedUserList);
                        setTempUserList(selectedUserList);
                    }
                }
            });
    };

    useEffect(() => {
        setListItemLimit(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
        setUserListMetaContent(new Map<string, string>([
            [ "name", "name" ],
            [ "emails", "emails" ],
            [ "name", "name" ],
            [ "userName", "userName" ],
            [ "id", "" ],
            [ "profileUrl", "profileUrl" ],
            [ "meta.lastModified", "meta.lastModified" ],
            [ "meta.created", "" ]
        ]));
    }, []);

    /**
     * The following method accepts a Map and returns the values as a string.
     *
     * @param attributeMap - IterableIterator<string>
     * @return string
     */
    const generateAttributesString = (attributeMap: IterableIterator<string>) => {
        const attArray = [];
        const iterator1 = attributeMap[Symbol.iterator]();

        for (const attribute of iterator1) {
            if (attribute !== "") {
                attArray.push(attribute);
            }
        }

        return attArray.toString();
    };

    useEffect(() => {
        if (userListMetaContent) {
            const attributes = generateAttributesString(userListMetaContent.values());

            if (isGroup) {
                getList(listItemLimit, listOffset, null, attributes, userStore);
            } else {
                getList(listItemLimit, listOffset, null, attributes, null);
            }
        }
    }, [ listOffset, listItemLimit ]);

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

        if (!isEmpty(value)) {
            const re = new RegExp(escapeRegExp(value), "i");

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
        setCheckedAssignedListItems([]);
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

        if (!isEmpty(value)) {
            const re = new RegExp(escapeRegExp(value), "i");

            selectedUsers && selectedUsers.map((user) => {
                isMatch = re.test(user.userName);
                if (isMatch) {
                    filteredUserList.push(user);
                    setSelectedUsers(filteredUserList);
                }
            });
        } else {
            setSelectedUsers(tempUserList);
        }
    };

    const handleAddUserSubmit = () => {
        onSubmit(tempUserList);
        setSelectedUsers(tempUserList);
        setAddNewUserModalView(false);
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
                        { type: "Role" })
                }
                <Heading subHeading ellipsis as="h6">
                    {
                        t("console:manage.features.roles.addRoleWizard.users.assignUserModal.subHeading",
                            { type: "role" })
                    }
                </Heading>
            </Modal.Header>
            <Modal.Content image>
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
                        emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            usersList?.map((user, index)=> {
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
                        emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            tempUserList?.map((user, index)=> {
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

    return (
        <>
            { isEdit ? (
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
                                                    icon={ <Icon name="search"/> }
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
                                                        <Table.HeaderCell/>
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
                                    !isSelectedUsersLoading
                                        ? (
                                            <EmphasizedSegment>
                                                <EmptyPlaceholder
                                                    title={ t("console:manage.features.roles.edit.users.list." +
                                                        "emptyPlaceholder.title") }
                                                    subtitle={ [
                                                        t("console:manage.features.roles.edit.users.list." +
                                                            "emptyPlaceholder.subtitles", { type: "role" })
                                                    ] }
                                                    action={
                                                        !isReadOnly && (
                                                            <PrimaryButton
                                                                data-testid={ `${ testId }-users-list-empty-assign-
                                                                users-button` }
                                                                onClick={ handleOpenAddNewGroupModal }
                                                                icon="plus"
                                                            >
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
                                        : <ContentLoader className="p-3" active />
                                )
                            }
                        </Grid.Column>
                    </Grid.Row>
                    { addNewUserModal() }
                </Grid>
            )
                : (
                    <Forms
                        onSubmit={ () => {
                            onSubmit(tempUserList);
                        } }
                        submitState={ triggerSubmit }
                    >
                        <Grid>
                            <Grid.Row columns={ 2 }>
                                <TransferComponent
                                    data-testid={ `${ testId }-update-user-list-transfer` }
                                    searchPlaceholder={ t("console:manage.features.roles.addRoleWizard.users." +
                                    "assignUserModal.list.searchPlaceholder") }
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
                                            t("console:manage.features.roles.addRoleWizard.users.assignUserModal." +
                                            "list.listHeader")
                                        ] }
                                        handleHeaderCheckboxChange={ selectAllUnAssignedList }
                                        isHeaderCheckboxChecked={ isSelectAllUnAssignedUsers }
                                        data-testid={ `${ testId }-update-unselected-users-select-all-checkbox` }
                                        emptyPlaceholderContent={ t("console:manage.features.transferList.list." +
                                        "emptyPlaceholders.roles.unselected", { type: "users" }) }
                                        emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                                            + "emptyPlaceholders.default") }
                                    >
                                        {
                                            usersList?.map((user, index)=> {
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
                                                        data-testid={ `${ testId }-update-unselected-users` }
                                                    />
                                                );
                                            })
                                        }
                                    </TransferList>
                                    <TransferList
                                        isListEmpty={ !(tempUserList?.length > 0) }
                                        listType="selected"
                                        listHeaders={ [
                                            t("console:manage.features.roles.addRoleWizard.users.assignUserModal." +
                                            "list.listHeader")
                                        ] }
                                        handleHeaderCheckboxChange={ selectAllAssignedList }
                                        isHeaderCheckboxChecked={ isSelectAllAssignedUsers }
                                        data-testid={ `${ testId }-update-selected-users-select-all-checkbox` }
                                        emptyPlaceholderContent={ t("console:manage.features.transferList.list." +
                                        "emptyPlaceholders.roles.unselected", { type: "users" }) }
                                        emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                                            + "emptyPlaceholders.default") }
                                    >
                                        {
                                            tempUserList?.map((user, index)=> {
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
                                                        data-testid={ `${ testId }-update-selected-users` }
                                                    />
                                                );
                                            })
                                        }
                                    </TransferList>
                                </TransferComponent>
                            </Grid.Row>
                            { isEdit && (
                                <Grid.Row columns={ 1 }>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                        <Button
                                            data-testid={ `${ testId }-update-user-list-button` }
                                            primary
                                            type="submit"
                                            size="small"
                                            loading={ isSubmitting }
                                            disabled={ isSubmitting }
                                            className="form-button"
                                        >
                                            { t("common.update") }
                                        </Button>
                                    </Grid.Column>
                                </Grid.Row> )
                            }
                        </Grid>
                    </Forms>
                )
            }
        </>
    );
};
