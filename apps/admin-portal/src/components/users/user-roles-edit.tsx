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

import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { AlertInterface, BasicProfileInterface } from "../../models";
import { useTranslation } from "react-i18next";
import {
    EmptyPlaceholder,
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList, TransferListItem
} from "@wso2is/react-components";
import {
    Button,
    Checkbox,
    Divider,
    Grid,
    Icon,
    Input,
    Label,
    Modal,
    Popup,
    Segment,
    Table
} from "semantic-ui-react";
import { getRolesList, updateUserRoles } from "../../api";
import _ from "lodash";
import { AlertLevels } from "@wso2is/core/models";
import { RolesMemberInterface } from "../../models";
import { EmptyPlaceholderIllustrations } from "../../configs";
import { UserRolePermissions } from "./user-role-permissions";

interface UserRolesPropsInterface {
    user: BasicProfileInterface;
    onAlertFired: (alert: AlertInterface) => void;
    handleUserUpdate: (userId: string) => void;
}

/**
 * Enum for role types.
 * @readonly
 * @enum { string }
 */
enum RoleTypes {
    APPLICATION = "Application",
    INTERNAL= "Internal",
    PRIMARY = "Primary"
}

export const UserRolesList: FunctionComponent<UserRolesPropsInterface> = (
    props: UserRolesPropsInterface
): ReactElement => {

    const {
        onAlertFired,
        user,
        handleUserUpdate
    } = props;

    const [ showAddNewRoleModal, setAddNewRoleModalView ] = useState(false);
    const [ roleList, setRoleList ] = useState<any>([]);
    const [ tempRoleList, setTempRoleList ] = useState([]);
    const [ initialRoleList, setInitialRoleList ] = useState([]);
    const [ initialTempRoleList, setInitialTempRoleList ] = useState([]);

    // The following constants holds the state of application and internal roles
    // that are currently in the system.
    const [ applicationRoles, setApplicationRoles ] = useState(undefined);
    const [ internalRoles, setInternalRoles ] = useState(undefined);

    // The following constant holds the state of role already assigned roles.
    const [ primaryRolesList, setPrimaryRolesList ] = useState(undefined);

    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<RolesMemberInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<RolesMemberInterface[]>([]);
    const [ isSelectUnassignedRolesAllRolesChecked, setIsSelectUnassignedAllRolesChecked ] = useState(false);
    const [ isSelectAssignedAllRolesChecked, setIsSelectAssignedAllRolesChecked ] = useState(false);
    const [ showRolePermissionModal, setRolePermissionModal ] = useState(false);
    const [ selectedRoleId, setSelectedRoleId ] = useState<string>("");
    const [ isRoleSelected, setRoleSelection ] = useState(false);

    const [ assignedRoles, setAssignedRoles ] = useState([]);

    const { t } = useTranslation();

    useEffect(() => {
        if (!selectedRoleId) {
            return;
        }

        if (isRoleSelected) {
            handleOpenRolePermissionModal();
        }
    }, [ isRoleSelected ]);

    useEffect(() => {
        if (isSelectAssignedAllRolesChecked) {
            setCheckedAssignedListItems(tempRoleList);
        } else {
            setCheckedAssignedListItems([])
        }
    }, [ isSelectAssignedAllRolesChecked ]);

    useEffect(() => {
        if (isSelectUnassignedRolesAllRolesChecked) {
            setCheckedUnassignedListItems(roleList);
        } else {
            setCheckedUnassignedListItems([])
        }
    }, [ isSelectUnassignedRolesAllRolesChecked ]);

    useEffect(() => {
        if (!(user)) {
            return;
        }
        setAssignedRoles(user.groups);
        mapUserRoles();
    }, []);

    /**
     * The following useEffect will be triggered when the roles are updated.
     */
    useEffect(() => {
        if (!(user)) {
            return;
        }
        mapUserRoles();
        setAssignedRoles(user.groups);
    }, [ user ]);

    useEffect(() => {
        getRolesList("Application")
            .then((response) => {
                setApplicationRoles(response.data.Resources);
            });
    }, []);

    useEffect(() => {
        getRolesList("Internal")
            .then((response) => {
                setInternalRoles(response.data.Resources);
            });
    }, []);

    /**
     * The following function remove already assigned roles from the initial roles.
     *
     * @param domain
     * @param roleList
     */
    const removeExistingRoles = () => {
        const roleListCopy = _.concat(applicationRoles, internalRoles);

        const addedRoles = [];
            _.forEachRight(roleListCopy, (role) => {
                if (primaryRolesList?.has(role.displayName)) {
                    addedRoles.push(role);
                    roleListCopy.splice(roleListCopy.indexOf(role), 1);
                }
            });
            setTempRoleList(addedRoles);
            setInitialTempRoleList(addedRoles);
            setRoleList(roleListCopy);
            setInitialRoleList(roleListCopy);
    };

    /**
     * The following function maps the role list of the user
     * the role map available. This is required as the format of the role
     * object differs from Users endpoint to Groups endpoint.
     */
    const mapUserRoles = () => {
        const rolesMap = new Map<string, string> ();

        if (user.groups && user.groups instanceof Array) {
            _.forEachRight (user.groups, (group) => {
                const role = group.display.split("/");

                if (role.length > 1) {
                    rolesMap.set(group.display, group.value);
                }
            });
            setPrimaryRolesList(rolesMap);
        }
    };

    const handelAddNewRoleModalClose = () => {
        setAddNewRoleModalView(false);
    };

    /**
     * This function handles assigning the roles to the user.
     */
    const updateUserRole = (user: any, roles: any) => {
        const roleIds = [];

        roles.map((role) => {
            roleIds.push(role.id);
        });

        const bulkRemoveData: any = {
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:BulkRequest" ],
            Operations: []
        };

        const bulkAddData: any = {
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:BulkRequest" ],
            Operations: []
        };

        let removeOperation = {
            method: "PATCH",
            data: {
                "Operations": [
                    {
                        "op": "remove",
                        "path": "members[display eq" + " " + user.userName + "]"
                    }
                ]
            }
        };

        let addOperation = {
            method: "PATCH",
            data: {
                "Operations": [
                    {
                        "op": "add",
                        "value": {
                            "members": [
                                {
                                    "display": user.userName,
                                    "value": user.id
                                }
                            ]
                        }
                    }
                ]
            }
        };

        const removeOperations = [];
        const addOperations = [];
        let removedIds = [];

        if (primaryRolesList) {
            removedIds = [...primaryRolesList.values()];
        }

        if (roleIds?.length > 0) {
            roleIds.map((roleId) => {
                if (removedIds?.includes(roleId)) {
                    removedIds.splice(removedIds.indexOf(roleId), 1);
                }
            });
        }

        if (removedIds && removedIds.length > 0) {
            removedIds.map((id) => {
                removeOperation = {
                    ...removeOperation,
                    ...{ path: "/Groups/" + id }
                };
                removeOperations.push(removeOperation);
            });

            removeOperations.map((operation) => {
                bulkRemoveData.Operations.push(operation);
            });

            updateUserRoles(bulkRemoveData)
                .then(() => {
                    onAlertFired({
                        description: "Removing assigned roles for the user successful",
                        level: AlertLevels.SUCCESS,
                        message: "Update user roles successful"
                    });
                    handelAddNewRoleModalClose();
                    handleUserUpdate(user.id);
                })
                .catch((error) => {
                    onAlertFired({
                        description: "An error occurred while updating user roles",
                        level: AlertLevels.ERROR,
                        message: "Something went wrong"
                    });
                });
        } else {
            roleIds.map((id) => {
                addOperation = {
                    ...addOperation,
                    ...{ path: "/Groups/" + id }
                };
                addOperations.push(addOperation);
            });

            addOperations.map((operation) => {
                bulkAddData.Operations.push(operation);
            });

            updateUserRoles(bulkAddData)
                .then(() => {
                    onAlertFired({
                        description: "Assigning new roles for the user successful",
                        level: AlertLevels.SUCCESS,
                        message: "Update user roles successful"
                    });
                    handelAddNewRoleModalClose();
                    handleUserUpdate(user.id);
                })
                .catch((error) => {
                    onAlertFired({
                        description: "An error occurred while updating user roles",
                        level: AlertLevels.ERROR,
                        message: "Something went wrong"
                    });
                });
        }
    };

    const handleUnselectedListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), 'i');

            roleList && roleList.map((role) => {
                isMatch = re.test(role.displayName);
                if (isMatch) {
                    filteredRoleList.push(role);
                    setRoleList(filteredRoleList);
                }
            });
        } else {
            setRoleList(initialRoleList);
        }
    };

    const handleSelectedListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), 'i');

            tempRoleList && tempRoleList?.map((role) => {
                isMatch = re.test(role.displayName);
                if (isMatch) {
                    filteredRoleList.push(role);
                    setTempRoleList(filteredRoleList);
                }
            });
        } else {
            setTempRoleList(initialTempRoleList);
        }
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (role) => {
        const checkedRoles = [ ...checkedUnassignedListItems ];

        if (checkedRoles?.includes(role)) {
            checkedRoles.splice(checkedRoles.indexOf(role), 1);
            setCheckedUnassignedListItems(checkedRoles);
        } else {
            checkedRoles.push(role);
            setCheckedUnassignedListItems(checkedRoles);
        }
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an assigned item.
     */
    const handleAssignedItemCheckboxChange = (role) => {
        const checkedRoles = [ ...checkedAssignedListItems ];

        if (checkedRoles?.includes(role)) {
            checkedRoles.splice(checkedRoles.indexOf(role), 1);
            setCheckedAssignedListItems(checkedRoles);
        } else {
            checkedRoles.push(role);
            setCheckedAssignedListItems(checkedRoles);
        }
    };

    /**
     * The following function enables the user to select all the roles at once.
     */
    const selectAllUnAssignedList = () => {
        setIsSelectUnassignedAllRolesChecked(!isSelectUnassignedRolesAllRolesChecked);
    };

    /**
     * The following function enables the user to deselect all the roles at once.
     */
    const selectAllAssignedList = () => {
        setIsSelectAssignedAllRolesChecked(!isSelectAssignedAllRolesChecked);
    };

    const addRoles = () => {
        const addedRoles = [ ...tempRoleList ];
        if (checkedUnassignedListItems?.length > 0) {
            checkedUnassignedListItems.map((role) => {
                if (!(tempRoleList?.includes(role))) {
                    addedRoles.push(role);
                }
            });
        }
        setTempRoleList(addedRoles);
        setInitialTempRoleList(addedRoles);
        setRoleList(roleList.filter(x => !addedRoles?.includes(x)));
        setInitialRoleList(roleList.filter(x => !addedRoles?.includes(x)));
        setIsSelectUnassignedAllRolesChecked(false);
    };

    const removeRoles = () => {
        const removedRoles = [ ...roleList ];
        if (checkedAssignedListItems?.length > 0) {
            checkedAssignedListItems.map((role) => {
                if (!(roleList?.includes(role))) {
                    removedRoles.push(role);
                }
            });
        }
        setRoleList(removedRoles);
        setInitialRoleList(removedRoles);
        setTempRoleList(tempRoleList?.filter(x => !removedRoles?.includes(x)));
        setInitialTempRoleList(tempRoleList?.filter(x => !removedRoles?.includes(x)));
        setCheckedAssignedListItems(checkedAssignedListItems.filter(x => !removedRoles?.includes(x)));
        setIsSelectAssignedAllRolesChecked(false);
    };

    const handleOpenAddNewGroupModal = () => {
        removeExistingRoles();
        setAddNewRoleModalView(true);
    };

    const handleCloseAddNewGroupModal = () => {
        setAddNewRoleModalView(false);
    };

    /**
     * The following method handles creating a label for the list item.
     *
     * @param roleName: string
     */
    const createItemLabel = (roleName: string) => {
        const role = roleName.split("/");
        if (role.length > 0) {
            if (role[0] == "Application") {
                return { labelText: "Application", labelColor: null, name: "application-label" };
            } else {
                return { labelText: "Internal", labelColor: null, name: "internal-label" };
            }
        }
    };

    const addNewGroupModal = () => (
        <Modal open={ showAddNewRoleModal } size="small" className="user-roles">
            <Modal.Header>
                Update User Roles
                <Heading subHeading ellipsis as="h6">
                    Add new roles or remove existing roles assigned to the user.
                </Heading>
            </Modal.Header>
            <Modal.Content image>
                <TransferComponent
                    searchPlaceholder="Search roles"
                    addItems={ addRoles }
                    removeItems={ removeRoles }
                    handleUnelectedListSearch={ handleUnselectedListSearch }
                    handleSelectedListSearch={ handleSelectedListSearch }
                >
                    <TransferList
                        isListEmpty={ !(roleList.length > 0) }
                        listType="unselected"
                        listHeaders={ [ "Domain", "Name", "" ] }
                        handleHeaderCheckboxChange={ selectAllUnAssignedList }
                        isHeaderCheckboxChecked={ isSelectUnassignedRolesAllRolesChecked }
                    >
                        {
                            roleList?.map((role, index)=> {
                                const roleName = role.displayName?.split("/");
                                if (roleName.length > 1) {
                                    return (
                                        <TransferListItem
                                            handleItemChange={ () => handleUnassignedItemCheckboxChange(role) }
                                            key={ index }
                                            listItem={ roleName[1] }
                                            listItemId={ role.id }
                                            listItemIndex={ index }
                                            listItemTypeLabel={ createItemLabel(role?.displayName) }
                                            isItemChecked={ checkedUnassignedListItems.includes(role) }
                                            showSecondaryActions={ true }
                                        />
                                    )
                                }
                            })
                        }
                    </TransferList>
                    <TransferList
                        isListEmpty={ !(tempRoleList.length > 0) }
                        listType="selected"
                        listHeaders={ [ "Domain", "Name" ] }
                        handleHeaderCheckboxChange={ selectAllAssignedList }
                        isHeaderCheckboxChecked={ isSelectAssignedAllRolesChecked }
                    >
                        {
                            tempRoleList?.map((role, index)=> {
                                const userGroup = role.displayName.split("/");
                                if (userGroup.length > 1) {
                                    return (
                                        <TransferListItem
                                            handleItemChange={ () => handleAssignedItemCheckboxChange(role) }
                                            key={ index }
                                            listItem={ userGroup[1] }
                                            listItemId={ role.id }
                                            listItemIndex={ index }
                                            listItemTypeLabel={ createItemLabel(role?.displayName) }
                                            isItemChecked={ checkedAssignedListItems.includes(role) }
                                            showSecondaryActions={ false }
                                        />
                                    )
                                }
                            })
                        }
                    </TransferList>
                </TransferComponent>
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ handleCloseAddNewGroupModal }
                            >
                                Cancel
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                floated="right"
                                onClick={ () => updateUserRole(user, tempRoleList) }
                            >
                                Save
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );

    const handleAssignedRoleListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), 'i');

            assignedRoles && assignedRoles?.map((role) => {
                const groupName = role.display.split("/");
                if (groupName.length > 1) {
                    isMatch = re.test(role.display);
                    if (isMatch) {
                        filteredRoleList.push(role);
                        setAssignedRoles(filteredRoleList);
                    }
                }
            });
        } else {
            setAssignedRoles(user.groups);
        }
    };

    const handleCloseRolePermissionModal = () => {
        setRolePermissionModal(false);
        setRoleSelection(false);
    };

    const handleOpenRolePermissionModal = () => {
        setRolePermissionModal(true);
    };

    const handleSetSelectedId = (roleId: string) => {
        setSelectedRoleId(roleId);
        setRoleSelection(true);
    };

    const viewRolesPermissionModal = () => {
        return (
            <UserRolePermissions
                openRolePermissionModal={ showRolePermissionModal }
                handleCloseRolePermissionModal={ handleCloseRolePermissionModal }
                roleId={ selectedRoleId }
            />
        )
    };

    return (
        <>
            <Heading as="h4">
                Assigned Roles
                <Heading subHeading ellipsis as="h6">
                    Add or remove the roles user is assigned  with and note that this will affect performing certain tasks.
                </Heading>
            </Heading>
            <Divider hidden/>
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 8 }>
                        {
                            primaryRolesList?.size > 0 ? (
                            <Segment.Group fluid>
                                <Segment className="user-role-edit-header-segment">
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Input
                                                icon={ <Icon name="search"/> }
                                                onChange={ handleAssignedRoleListSearch }
                                                placeholder="Search roles"
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
                                            <Table.Header>
                                                <Table.Row>
                                                    <Table.HeaderCell/>
                                                    <Table.HeaderCell><strong>Name</strong></Table.HeaderCell>
                                                    <Table.HeaderCell><strong>Type</strong></Table.HeaderCell>
                                                    <Table.HeaderCell/>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {
                                                    assignedRoles?.map((group) => {
                                                        const userGroup = group.display.split("/");
                                                        if (userGroup.length > 1) {
                                                            return (
                                                                <Table.Row>
                                                                    <Table.Cell>
                                                                        <Checkbox checked disabled/>
                                                                    </Table.Cell>
                                                                    {
                                                                        userGroup[0] == "Application" ? (
                                                                            <Table.Cell>
                                                                                <Label className="application-label">
                                                                                    { userGroup[0] }
                                                                                </Label>
                                                                            </Table.Cell>
                                                                        ) : (
                                                                            <Table.Cell>
                                                                                <Label className="internal-label">
                                                                                    { userGroup[0] }
                                                                                </Label>
                                                                            </Table.Cell>
                                                                        )
                                                                    }
                                                                    <Table.Cell width={ 8 }>
                                                                        { userGroup[1] }
                                                                    </Table.Cell>
                                                                    <Table.Cell textAlign="center">
                                                                        <Popup
                                                                            content="View permissions"
                                                                            trigger={
                                                                                <Icon
                                                                                    color="grey"
                                                                                    name="key"
                                                                                    onClick={ () => handleSetSelectedId(group.value) }
                                                                                />
                                                                            }
                                                                        />
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            )
                                                        }
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
                                        title="No Roles Assigned"
                                        subtitle={ [
                                            "There are no Roles assigned to the user at the moment.",
                                            "This might restrict user from performing certain",
                                            "tasks bound to the roles created by the admin."
                                        ] }
                                        action={
                                            <PrimaryButton onClick={ handleOpenAddNewGroupModal } icon="plus">
                                                Assign Role
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
                { viewRolesPermissionModal() }
                { addNewGroupModal() }
            </Grid>
        </>
    );
};
