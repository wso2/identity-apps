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
import React, { ReactElement, useState, FunctionComponent, useEffect } from "react";
import { Grid, Segment, Input, Icon, Table, Checkbox, Modal } from "semantic-ui-react";
import { Forms } from "@wso2is/forms";
import _ from "lodash";
import { UserBasicInterface, RolesMemberInterface } from "../../../models";
import { getUsersList } from "../../../api";
import { UserConstants } from "../../../constants";
import { 
    TransferComponent,
    TransferList,
    TransferListItem,
    Button,
    EmptyPlaceholder,
    PrimaryButton,
    Heading,
    LinkButton,
    UserAvatar
} from "@wso2is/react-components";
import { EmptyPlaceholderIllustrations } from "../../../configs";

/**
 * Proptypes for the application consents list component.
 */
interface AddRoleUserProps {
    triggerSubmit?: boolean;
    onSubmit?: (values: any) => void;
    assignedUsers?: RolesMemberInterface[];
    isEdit: boolean;
    initialValues?: UserBasicInterface[];
}

export const AddRoleUsers: FunctionComponent<AddRoleUserProps> = (props: AddRoleUserProps): ReactElement => {
    const {
        triggerSubmit,
        onSubmit,
        assignedUsers,
        isEdit,
        initialValues
    } = props;

    const [ tempUserList, setTempUserList ] = useState<UserBasicInterface[]>([]);
    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);
    const [ initialUserList, setInitialUserList ] = useState<UserBasicInterface[]>([]);
    const [ selectedUsers, setSelectedUsers ] = useState<UserBasicInterface[]>([]);
    const [ initialSelectedUsers, setInitialSelectedUsers ] = useState<UserBasicInterface[]>([]);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);
    
    const [ isSelectAllUnAssignedUsers, setIsSelectAllUnAssignedUsers ] = useState<boolean>(false);
    const [ isSelectAllAssignedUsers, setIsSelectAllAssignedUsers ] = useState<boolean>(false);
    
    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<UserBasicInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<UserBasicInterface[]>([]);

    const [ showAddNewUserModal, setAddNewUserModalView ] = useState<boolean>(false);
    

    useEffect(() => {
        if (isSelectAllUnAssignedUsers) {
            setCheckedUnassignedListItems(usersList);
        } else {
            setCheckedUnassignedListItems([])
        }
    }, [ isSelectAllUnAssignedUsers ]);

    useEffect(() => {
        if (isSelectAllAssignedUsers) {
            setCheckedAssignedListItems(tempUserList);
        } else {
            setCheckedAssignedListItems([])
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

    const getList = (limit: number, offset: number, filter: string, attribute: string) => {
        getUsersList(limit, offset, filter, attribute, null)
            .then((response) => {
                setUsersList(response.Resources);
                setInitialUserList(response.Resources);

                if (assignedUsers && assignedUsers.length !== 0) {
                    const selectedUserList: UserBasicInterface[] = [];
                    if (response.Resources && response.Resources instanceof Array ) {
                        response.Resources.forEach(user => {
                            assignedUsers.forEach(assignedUser => {
                                if (user.id === assignedUser.value) {
                                    selectedUserList.push(user);
                                }
                            });
                        });
                        setSelectedUsers(selectedUserList);
                        setInitialSelectedUsers(selectedUserList);
                        setTempUserList(selectedUserList);
                    }
                }

                if (initialValues && initialValues instanceof Array) {
                    const selectedUserList: UserBasicInterface[] = [];
                    if (response.Resources && response.Resources instanceof Array ) {
                        response.Resources.forEach(user => {
                            initialValues.forEach(assignedUser => {
                                if (user.id === assignedUser.id) {
                                    selectedUserList.push(user);
                                }
                            });
                        });
                        setSelectedUsers(selectedUserList);
                        setInitialSelectedUsers(selectedUserList);
                        setTempUserList(selectedUserList);
                    }
                }
            });
    };

    useEffect(() => {
        setListItemLimit(UserConstants.DEFAULT_USER_LIST_ITEM_LIMIT);
        setUserListMetaContent(new Map<string, string>([
            ["name", "name"],
            ["emails", "emails"],
            ["name", "name"],
            ["userName", "userName"],
            ["id", ""],
            ["profileUrl", "profileUrl"],
            ["meta.lastModified", "meta.lastModified"],
            ["meta.created", ""]
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
            getList(listItemLimit, listOffset, null, attributes);
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

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), 'i');

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
        setTempUserList(addedRoles);
        setIsSelectAllUnAssignedUsers(false);
    };

    const removeUser = () => {
        const removedUsers = [ ...tempUserList ];
        
        if (checkedAssignedListItems?.length > 0) {
            checkedAssignedListItems.map((role) => {
                removedUsers.splice(tempUserList.indexOf(role), 1);
                setCheckedAssignedListItems(checkedAssignedListItems.splice(tempUserList.indexOf(role), 1));
                setTempUserList(removedUsers);
            });
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
            const re = new RegExp(_.escapeRegExp(value), 'i');

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
        onSubmit(tempUserList);
        setSelectedUsers(tempUserList)
        setAddNewUserModalView(false);
    }

    const addNewUserModal = () => (
        <Modal open={ showAddNewUserModal } size="small" className="user-roles">
            <Modal.Header>
                Update Role Users
                <Heading subHeading ellipsis as="h6">
                    Add new users or remove existing users assigned to the role.
                </Heading>
            </Modal.Header>
            <Modal.Content image>
                <TransferComponent
                    searchPlaceholder="Search users"
                    addItems={ addUser }
                    removeItems={ removeUser }
                    // TODO: Add two methods to handle the search of each list.
                    handleUnelectedListSearch={ handleSearchFieldChange }
                    handleSelectedListSearch={ handleSearchFieldChange }
                >
                    <TransferList
                        isListEmpty={ !(usersList?.length > 0) }
                        listType="unselected"
                        listHeaders={ [ "Name" ] }
                        handleHeaderCheckboxChange={ selectAllUnAssignedList }
                        isHeaderCheckboxChecked={ isSelectAllUnAssignedUsers }
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
                                    />
                                )
                            })
                        }
                    </TransferList>
                    <TransferList
                        isListEmpty={ !(tempUserList?.length > 0) }
                        listType="selected"
                        listHeaders={ [ "Name" ] }
                        handleHeaderCheckboxChange={ selectAllAssignedList }
                        isHeaderCheckboxChecked={ isSelectAllAssignedUsers }
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
                                    />
                                )
                            })
                        }
                    </TransferList>
                </TransferComponent>
            </Modal.Content>
            <Modal.Actions>
                <PrimaryButton
                    onClick={ () => { 
                        handleAddUserSubmit()
                    } }
                >
                    Save
                </PrimaryButton>
                <LinkButton
                    onClick={ handleCloseAddNewGroupModal }
                >
                    Cancel
                </LinkButton>
            </Modal.Actions>
        </Modal>
    );

    return (
        <>
            { isEdit ? 
                <Grid>
                    <Grid.Row>
                        <Grid.Column computer={ 8 }>
                            {
                                selectedUsers?.length > 0 ? (
                                    <Segment.Group fluid>
                                        <Segment className="user-role-edit-header-segment">
                                            <Grid.Row>
                                                <Grid.Column>
                                                    <Input
                                                        icon={ <Icon name="search"/> }
                                                        onChange={ handleAssignedUserListSearch }
                                                        placeholder="Search users"
                                                        floated="left"
                                                        size="small"
                                                    />
                                                    <Button
                                                        size="medium"
                                                        icon="pencil"
                                                        floated="right"
                                                        onClick={ handleOpenAddNewGroupModal }
                                                    />
                                                </Grid.Column>
                                            </Grid.Row>
                                            <Grid.Row>
                                                <Table singleLine compact>
                                                    <Table.Body>
                                                        {
                                                            selectedUsers?.map((user) => {
                                                                return (
                                                                    <Table.Row>
                                                                        <Table.Cell>
                                                                            <UserAvatar
                                                                                name={ user.userName }
                                                                                size="mini"
                                                                                floated="left"
                                                                                image={ user.profileUrl }
                                                                            />
                                                                            { user.userName }
                                                                        </Table.Cell>
                                                                    </Table.Row>
                                                                )
                                                            })
                                                        }
                                                    </Table.Body>
                                                </Table>
                                            </Grid.Row>
                                        </Segment>
                                    </Segment.Group>
                                ) : (
                                    <Segment>
                                        <EmptyPlaceholder
                                            title="No Users Assigned"
                                            subtitle={ [
                                                "There are no Users assigned to the role at the moment.",
                                            ] }
                                            action={
                                                <PrimaryButton onClick={ handleOpenAddNewGroupModal } icon="plus">
                                                    Assign User
                                                </PrimaryButton>
                                            }
                                            image={ EmptyPlaceholderIllustrations.emptyList }
                                            imageSize="tiny"
                                        />
                                    </Segment>
                                )
                            }
                        </Grid.Column>
                    </Grid.Row>
                    { addNewUserModal() }
                </Grid>
                :
                <Forms
                    onSubmit={ () => {
                        onSubmit(tempUserList);
                    } }
                    submitState={ triggerSubmit }
                >
                    <Grid>
                        <Grid.Row columns={ 2 }>
                            <TransferComponent
                                searchPlaceholder="Search users"
                                addItems={ addUser }
                                removeItems={ removeUser }
                                // TODO: Add two methods to handle the search of each list.
                                handleUnelectedListSearch={ handleSearchFieldChange }
                                handleSelectedListSearch={ handleSearchFieldChange }
                            >
                                <TransferList
                                    isListEmpty={ !(usersList?.length > 0) }
                                    listType="unselected"
                                    listHeaders={ [ "Name" ] }
                                    handleHeaderCheckboxChange={ selectAllUnAssignedList }
                                    isHeaderCheckboxChecked={ isSelectAllUnAssignedUsers }
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
                                                />
                                            )
                                        })
                                    }
                                </TransferList>
                                <TransferList
                                    isListEmpty={ !(tempUserList?.length > 0) }
                                    listType="selected"
                                    listHeaders={ [ "Name" ] }
                                    handleHeaderCheckboxChange={ selectAllAssignedList }
                                    isHeaderCheckboxChecked={ isSelectAllAssignedUsers }
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
                                                />
                                            )
                                        })
                                    }
                                </TransferList>
                            </TransferComponent>
                        </Grid.Row>
                    { isEdit && 
                        <Grid.Row columns={ 1 }>
                            <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                                <Button primary type="submit" size="small" className="form-button">
                                    Update
                                </Button>
                            </Grid.Column>
                        </Grid.Row>
                    }
                    </Grid>
                </Forms>
            }
        </>
    )
};
