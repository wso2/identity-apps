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
import { Grid } from "semantic-ui-react";
import { Forms } from "@wso2is/forms";
import _ from "lodash";
import { UserBasicInterface, RolesMemberInterface } from "../../../models";
import { getUsersList } from "../../../api";
import { DEFAULT_USER_LIST_ITEM_LIMIT } from "../../../constants";
import { TransferComponent, TransferList, TransferListItem, Button } from "@wso2is/react-components";

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

    const [ tempUserList, setTempUserList ] = useState([]);
    const [ usersList, setUsersList ] = useState<UserBasicInterface[]>([]);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);
    
    const [ isSelectAllUnAssignedUsers, setIsSelectAllUnAssignedUsers ] = useState<boolean>(false);
    const [ isSelectAllAssignedUsers, setIsSelectAllAssignedUsers ] = useState<boolean>(false);
    
    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<UserBasicInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<UserBasicInterface[]>([]);
    

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
                        setTempUserList(selectedUserList);
                    }
                }
            });
    };

    useEffect(() => {
        setListItemLimit(DEFAULT_USER_LIST_ITEM_LIMIT);
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
            setUsersList(usersList);
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
                setCheckedAssignedListItems(removedUsers.splice(tempUserList.indexOf(role), 1));
                setTempUserList(removedUsers);
            });
        }
    };

    return (
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
                        handleListSearch={ handleSearchFieldChange }
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
                                            handleItemChange={ () => handleUnassignedItemCheckboxChange(user)  }
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
                                            handleItemChange={ () => handleAssignedItemCheckboxChange(user) }
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
    )
}
