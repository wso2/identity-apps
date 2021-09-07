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

import { getRolesList } from "@wso2is/core/api";
import { AlertInterface, AlertLevels, ProfileInfoInterface, RolesMemberInterface } from "@wso2is/core/models";
import {
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Button,
    Divider,
    Grid,
    Icon,
    Input,
    Label,
    Modal,
    Popup,
    Table
} from "semantic-ui-react";
import { UserRolePermissions } from "./organisation-role-permissions";
import { RolePermissions } from "./wizard";
import { EmptyPlaceholderIllustrations } from "../../core";
import { updateUserRoles } from "../api";

interface UserGroupsPropsInterface {
    user: ProfileInfoInterface;
    onAlertFired: (alert: AlertInterface) => void;
    handleUserUpdate: (userId: string) => void;
}

export const UserGroupsList: FunctionComponent<UserGroupsPropsInterface> = (
    props: UserGroupsPropsInterface
): ReactElement => {

    const {
        onAlertFired,
        user,
        handleUserUpdate
    } = props;

    const { t } = useTranslation();

    const [ showAddNewRoleModal, setAddNewRoleModalView ] = useState(false);
    const [ groupList, setGroupList ] = useState<any>([]);
    const [ tempGroupList, setTempGroupList ] = useState([]);
    const [ initialGroupList, setInitialGroupList ] = useState([]);
    const [ initialTempGroupList, setInitialTempGroupList ] = useState([]);
    const [ primaryGroups, setPrimaryGroups ] = useState(undefined);
    const [ primaryGroupsList, setPrimaryGroupsList ] = useState<Map<string, string>>(undefined);
    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<RolesMemberInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<RolesMemberInterface[]>([]);
    const [ isSelectUnassignedRolesAllRolesChecked, setIsSelectUnassignedAllRolesChecked ] = useState(false);
    const [ isSelectAssignedAllRolesChecked, setIsSelectAssignedAllRolesChecked ] = useState(false);
    const [ assignedGroups, setAssignedGroups ] = useState<RolesMemberInterface[]>([]);
    const [ showGroupPermissionModal, setGroupPermissionModal ] = useState(false);
    const [ selectedGroupId, setSelectedGroupId ] = useState<string>("");
    const [ isGroupSelected, setGroupSelection ] = useState(false);

    // The following constant are used to persist the state of the unassigned groups permissions.
    const [ viewGroupPermissions, setViewGroupPermissions ] = useState(false);
    const [ groupId, setGroupId ] = useState();
    const [ isSelected, setSelection ] = useState(false);

    useEffect(() => {
        if (!selectedGroupId) {
            return;
        }

        if (isGroupSelected) {
            handleOpenGroupPermissionModal();
        }
    }, [ isGroupSelected ]);

    useEffect(() => {
        if (!groupId) {
            return;
        }

        if (isSelected) {
            setViewGroupPermissions(true);
        }
    }, [ isSelected ]);

    useEffect(() => {
        if (!(user)) {
            return;
        }
        mapUserRoles();
        setAssignedGroups(user.groups);
    }, []);

    useEffect(() => {
        if (isSelectAssignedAllRolesChecked) {
            setCheckedAssignedListItems(tempGroupList);
        } else {
            setCheckedAssignedListItems([])
        }
    }, [ isSelectAssignedAllRolesChecked ]);

    useEffect(() => {
        if (isSelectUnassignedRolesAllRolesChecked) {
            setCheckedUnassignedListItems(groupList);
        } else {
            setCheckedUnassignedListItems([])
        }
    }, [ isSelectUnassignedRolesAllRolesChecked ]);

    /**
     * The following useEffect will be triggered when the
     * roles are updated.
     */
    useEffect(() => {
        if (!(user)) {
            return;
        }
        mapUserRoles();
        setAssignedGroups(user.groups);
    }, [ user ]);

    useEffect(() => {
        let domain = "Primary";
        const domainName: string[] = user?.userName?.split("/");

        if (domainName.length > 1) {
            domain = domainName[0];
        }
        getRolesList(domain)
            .then((response) => {
                setPrimaryGroups(response.data.Resources);
            });
    }, []);

    const mapUserRoles = () => {
        const groupsMap = new Map<string, string> ();

        if (user.groups && user.groups instanceof Array) {
            _.forEachRight (user.groups, (group) => {
                const groupName = group.display.split("/");

                if (groupName.length === 1) {
                    groupsMap.set(group.display, group.value);
                }
            });
            setPrimaryGroupsList(groupsMap);
        }
    };

    /**
     * The following function remove already assigned roles from the initial roles.
     */
    const removeExistingRoles = () => {
        const groupListCopy = primaryGroups ? [ ...primaryGroups ] : [];

        const addedGroups = [];
        _.forEachRight(groupListCopy, (group) => {
            if (primaryGroupsList?.has(group.displayName)) {
                addedGroups.push(group);
                groupListCopy.splice(groupListCopy.indexOf(group), 1);
            }
        });
        setTempGroupList(addedGroups);
        setInitialTempGroupList(addedGroups);
        setGroupList(groupListCopy);
        setInitialGroupList(groupListCopy);
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

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (group) => {
        const checkedGroups = [ ...checkedUnassignedListItems ];

        if (checkedGroups?.includes(group)) {
            checkedGroups.splice(checkedGroups.indexOf(group), 1);
            setCheckedUnassignedListItems(checkedGroups);
        } else {
            checkedGroups.push(group);
            setCheckedUnassignedListItems(checkedGroups);
        }
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an assigned item.
     *
     * @param group
     */
    const handleAssignedItemCheckboxChange = (group) => {
        const checkedGroups = [ ...checkedAssignedListItems ];

        if (checkedGroups?.includes(group)) {
            checkedGroups.splice(checkedGroups.indexOf(group), 1);
            setCheckedAssignedListItems(checkedGroups);
        } else {
            checkedGroups.push(group);
            setCheckedAssignedListItems(checkedGroups);
        }
    };

    const addGroups = () => {
        const addedRoles = [ ...tempGroupList ];

        if (checkedUnassignedListItems?.length > 0) {
            checkedUnassignedListItems.map((role) => {
                if (!(tempGroupList?.includes(role))) {
                    addedRoles.push(role);
                }
            });
        }
        setTempGroupList(addedRoles);
        setInitialTempGroupList(addedRoles);
        setGroupList(groupList.filter(x => !addedRoles?.includes(x)));
        setInitialGroupList(groupList.filter(x => !addedRoles?.includes(x)));
        setIsSelectUnassignedAllRolesChecked(false);
    };

    const removeGroups = () => {
        const removedRoles = [ ...groupList ];

        if (checkedAssignedListItems?.length > 0) {
            checkedAssignedListItems.map((role) => {
                if (!(groupList?.includes(role))) {
                    removedRoles.push(role);
                }
            });
        }
        setGroupList(removedRoles);
        setInitialGroupList(removedRoles);
        setTempGroupList(tempGroupList?.filter(x => !removedRoles?.includes(x)));
        setInitialTempGroupList(tempGroupList?.filter(x => !removedRoles?.includes(x)));
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

    const handleUnselectedListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredGroupList = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), "i");

            groupList && groupList.map((role) => {
                isMatch = re.test(role.displayName);
                if (isMatch) {
                    filteredGroupList.push(role);
                    setGroupList(filteredGroupList);
                }
            });
        } else {
            setGroupList(initialGroupList);
        }
    };

    const handleSelectedListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredGroupList = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), "i");

            tempGroupList && tempGroupList?.map((role) => {
                isMatch = re.test(role.displayName);
                if (isMatch) {
                    filteredGroupList.push(role);
                    setTempGroupList(filteredGroupList);
                }
            });
        } else {
            setTempGroupList(initialTempGroupList);
        }
    };

    /**
     * This function handles assigning the roles to the user.
     *
     * @param user - User object
     * @param groups - Assigned groups
     */
    const updateUserGroup = (user: any, groups: any) => {
        const groupIds = [];

        groups.map((group) => {
            groupIds.push(group.id);
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

        if (primaryGroupsList) {
            removedIds = [...primaryGroupsList.values()];
        }

        if (groupIds?.length > 0) {
            groupIds.map((groupId) => {
                if (removedIds?.includes(groupId)) {
                    removedIds.splice(removedIds.indexOf(groupId), 1);
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
                        description: t(
                            "adminPortal:components.user.updateUser.groups.notifications.removeUserGroups." +
                            "success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "adminPortal:components.user.updateUser.groups.notifications.removeUserGroups." +
                            "success.message"
                        )
                    });
                    handleCloseAddNewGroupModal();
                    handleUserUpdate(user.id);
                })
                .catch((error) => {
                    if (error?.response?.status === 404) {
                        return;
                    }

                    if (error?.response && error?.response?.data && error?.response?.data?.description) {
                        onAlertFired({
                            description: error.response?.data?.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "adminPortal:components.user.updateUser.groups.notifications.removeUserGroups." +
                                "error.message"
                            )
                        });

                        return;
                    }

                    onAlertFired({
                        description: t(
                            "adminPortal:components.user.updateUser.groups.notifications.removeUserGroups." +
                            "genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "adminPortal:components.user.updateUser.groups.notifications.removeUserGroups." +
                            "genericError.message"
                        )
                    });
                });
        } else {
            groupIds.map((id) => {
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
                        description: t(
                            "adminPortal:components.user.updateUser.groups.notifications.addUserGroups." +
                            "success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "adminPortal:components.user.updateUser.groups.notifications.addUserGroups." +
                            "success.message"
                        )
                    });
                    handleCloseAddNewGroupModal();
                    handleUserUpdate(user.id);
                })
                .catch((error) => {
                    if (error?.response?.status === 404) {
                        return;
                    }

                    if (error?.response && error?.response?.data && error?.response?.data?.description) {
                        onAlertFired({
                            description: error.response?.data?.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "adminPortal:components.user.updateUser.groups.notifications.addUserGroups." +
                                "error.message"
                            )
                        });

                        return;
                    }

                    onAlertFired({
                        description: t(
                            "adminPortal:components.user.updateUser.groups.notifications.addUserGroups." +
                            "genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "adminPortal:components.user.updateUser.groups.notifications.addUserGroups." +
                            "genericError.message"
                        )
                    });
                });
        }
    };

    const handleCloseRolePermissionModal = () => {
        setGroupPermissionModal(false);
        setGroupSelection(false);
    };

    const handleOpenGroupPermissionModal = () => {
        setGroupPermissionModal(true);
    };

    const handleSetSelectedId = (groupId: string) => {
        setSelectedGroupId(groupId);
        setGroupSelection(true);
    };

    const viewGroupsPermissionModal = () => {
        if (selectedGroupId) {
            return (
                <UserRolePermissions
                    data-testid="user-mgt-groups-list-group-permission-modal"
                    openRolePermissionModal={ showGroupPermissionModal }
                    handleCloseRolePermissionModal={ handleCloseRolePermissionModal }
                    roleId={ selectedGroupId }
                />
            )
        }
    };

    const handleViewGroupPermission = () => {
        setViewGroupPermissions(!viewGroupPermissions);
        setSelection(false);
    };

    const handleGroupIdSet = (groupId) => {
        setGroupId(groupId);
        setSelection(true);
    };

    const addNewGroupModal = () => (
        <Modal
            data-testid="user-mgt-update-groups-modal"
            open={ showAddNewRoleModal }
            size="small"
            className="user-roles"
        >
            <Modal.Header>
                { t("adminPortal:components.user.updateUser.groups.addGroupsModal.heading") }
                <Heading subHeading ellipsis as="h6">
                    { t("adminPortal:components.user.updateUser.groups.addGroupsModal.subHeading") }
                </Heading>
            </Modal.Header>
            {
                viewGroupPermissions
                    ? (
                        <>
                            <Modal.Content>
                                <RolePermissions
                                    data-testid="user-mgt-update-groups-modal-unselected-group-permissions"
                                    handleNavigateBack={ handleViewGroupPermission }
                                    roleId={ groupId }
                                />
                            </Modal.Content>
                            <Divider hidden/>
                        </>
                    ) : (
                        <Modal.Content image>
                            <TransferComponent
                                searchPlaceholder={ t("adminPortal:components.transferList.searchPlaceholder",
                                    { type: "Groups" }) }
                                addItems={ addGroups }
                                removeItems={ removeGroups }
                                handleUnelectedListSearch={ handleUnselectedListSearch }
                                handleSelectedListSearch={ handleSelectedListSearch }
                                data-testid="user-mgt-update-groups-modal"
                            >
                                <TransferList
                                    isListEmpty={ !(groupList.length > 0) }
                                    listType="unselected"
                                    listHeaders={ [
                                        t("adminPortal:components.transferList.list.headers.0"),
                                        t("adminPortal:components.transferList.list.headers.1"), ""
                                    ] }
                                    handleHeaderCheckboxChange={ selectAllUnAssignedList }
                                    isHeaderCheckboxChecked={ isSelectUnassignedRolesAllRolesChecked }
                                    emptyPlaceholderContent={ t("adminPortal:components.transferList.list." +
                                        "emptyPlaceholders.users.roles.unselected", { type: "groups" }) }
                                    data-testid="user-mgt-update-groups-modal-unselected-groups-select-all-checkbox"
                                >
                                    {
                                        groupList?.map((role, index)=> {
                                            const roleName = role.displayName?.split("/");
                                            if (roleName.length === 1) {
                                                return (
                                                    <TransferListItem
                                                        handleItemChange={
                                                            () => handleUnassignedItemCheckboxChange(role)
                                                        }
                                                        key={ index }
                                                        listItem={ role.displayName }
                                                        listItemId={ role.id }
                                                        listItemIndex={ index }
                                                        listItemTypeLabel={
                                                            {
                                                                labelColor: "olive",
                                                                labelText: "Primary"
                                                            }
                                                        }
                                                        isItemChecked={ checkedUnassignedListItems.includes(role) }
                                                        showSecondaryActions={ true }
                                                        handleOpenPermissionModal={ () => handleGroupIdSet(role.id) }
                                                        data-testid="user-mgt-update-groups-modal-unselected-groups"
                                                    />
                                                )
                                            }
                                        })
                                    }
                                </TransferList>
                                <TransferList
                                    isListEmpty={ !(tempGroupList.length > 0) }
                                    listType="selected"
                                    listHeaders={ [
                                        t("adminPortal:components.transferList.list.headers.0"),
                                        t("adminPortal:components.transferList.list.headers.1")
                                    ] }
                                    handleHeaderCheckboxChange={ selectAllAssignedList }
                                    isHeaderCheckboxChecked={ isSelectAssignedAllRolesChecked }
                                    emptyPlaceholderContent={ t("adminPortal:components.transferList.list." +
                                        "emptyPlaceholders.users.roles.selected", { type: "groups" }) }
                                    data-testid="user-mgt-update-groups-modal-selected-groups-select-all-checkbox"
                                >
                                    {
                                        tempGroupList?.map((role, index)=> {
                                            const userGroup = role.displayName.split("/");
                                            if (userGroup.length === 1) {
                                                return (
                                                    <TransferListItem
                                                        handleItemChange={
                                                            () => handleAssignedItemCheckboxChange(role)
                                                        }
                                                        key={ index }
                                                        listItem={ role.displayName }
                                                        listItemId={ role.id }
                                                        listItemIndex={ index }
                                                        listItemTypeLabel={
                                                            {
                                                                labelColor: "olive",
                                                                labelText: "Primary"
                                                            }
                                                        }
                                                        isItemChecked={ checkedAssignedListItems.includes(role) }
                                                        showSecondaryActions={ false }
                                                        data-testid="user-mgt-update-groups-modal-selected-groups"
                                                    />
                                                )
                                            }
                                        })
                                    }
                                </TransferList>
                            </TransferComponent>
                        </Modal.Content>
                    )
            }
            <Modal.Actions>
                <Grid>
                    <Grid.Row columns={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid="user-mgt-update-groups-modal-cancel-button"
                                floated="left"
                                onClick={ handleCloseAddNewGroupModal }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                data-testid="user-mgt-update-groups-modal-save-button"
                                floated="right"
                                onClick={ () => updateUserGroup(user, tempGroupList) }
                            >
                                { t("common:save") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );

    const handleAssignedGroupListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredGroupList = [];

        if (!_.isEmpty(value)) {
            const re = new RegExp(_.escapeRegExp(value), "i");

            assignedGroups && assignedGroups?.map((group) => {
                const groupName = group.display.split("/");
                if (groupName.length === 1) {
                    isMatch = re.test(group.display);
                    if (isMatch) {
                        filteredGroupList.push(group);
                        setAssignedGroups(filteredGroupList);
                    }
                }
            });
        } else {
            setAssignedGroups(user.groups);
        }
    };

    return (
        <>
            <Heading as="h4">
                { t("adminPortal:components.user.updateUser.groups.editGroups.heading") }
                <Heading subHeading ellipsis as="h6">
                    { t("adminPortal:components.user.updateUser.groups.editGroups.subHeading") }
                </Heading>
            </Heading>
            <Divider hidden/>
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 8 }>
                        {
                            primaryGroupsList?.size > 0 ? (
                                <EmphasizedSegment
                                    data-testid="user-mgt-groups-list"
                                    className="user-role-edit-header-segment"
                                >
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Input
                                                data-testid="user-mgt-groups-list-search-input"
                                                icon={ <Icon name="search"/> }
                                                onChange={ handleAssignedGroupListSearch }
                                                placeholder={ t("adminPortal:components.user.updateUser.groups." +
                                                    "editGroups.searchPlaceholder") }
                                                floated="left"
                                                size="small"
                                            />
                                            <Button
                                                data-testid="user-mgt-groups-list-update-button"
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
                                                    <Table.HeaderCell>
                                                        <strong>
                                                            { t("adminPortal:components.user.updateUser.groups." +
                                                                "editGroups.groupList.headers.0") }
                                                        </strong>
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell>
                                                        <strong>
                                                            { t("adminPortal:components.user.updateUser.groups." +
                                                                "editGroups.groupList.headers.1") }
                                                        </strong>
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell/>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {
                                                    assignedGroups?.map((group) => {
                                                        const userGroup = group.display.split("/");
                                                        if (userGroup.length === 1) {
                                                            return (
                                                                <Table.Row>
                                                                    <Table.Cell>
                                                                        <Label color="olive">Primary</Label>
                                                                    </Table.Cell>
                                                                    <Table.Cell>{ group.display }</Table.Cell>
                                                                    <Table.Cell textAlign="center">
                                                                        <Popup
                                                                            content={ t("adminPortal:components." +
                                                                                "user.updateUser.groups.editGroups." +
                                                                                "popups.viewPermissions") }
                                                                            trigger={
                                                                                <Icon
                                                                                    data-testid={ `user-mgt-groups
                                                                                    -list-${ group.display }
                                                                                    -permissions-button` }
                                                                                    color="grey"
                                                                                    name="key"
                                                                                    onClick={
                                                                                        () => handleSetSelectedId(
                                                                                            group.value
                                                                                        )
                                                                                    }
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
                                </EmphasizedSegment>
                            ) : (
                                <EmphasizedSegment>
                                    <EmptyPlaceholder
                                        data-testid="user-mgt-empty-groups-list"
                                        title={ t("adminPortal:components.user.updateUser.groups.editGroups." +
                                            "groupList.emptyListPlaceholder.title") }
                                        subtitle={ [
                                            t("adminPortal:components.user.updateUser.groups.editGroups." +
                                                    "groupList.emptyListPlaceholder.subTitle.0"),
                                            t("adminPortal:components.user.updateUser.groups.editGroups." +
                                                "groupList.emptyListPlaceholder.subTitle.1"),
                                            t("adminPortal:components.user.updateUser.groups.editGroups." +
                                                "groupList.emptyListPlaceholder.subTitle.2")
                                        ] }
                                        action={
                                            <PrimaryButton
                                                data-testid="user-mgt-empty-groups-list-assign-group-button"
                                                icon="plus"
                                                onClick={ handleOpenAddNewGroupModal }
                                            >
                                                Assign Group
                                            </PrimaryButton>
                                        }
                                        image={ EmptyPlaceholderIllustrations.emptyList }
                                        imageSize="tiny"
                                    />
                                </EmphasizedSegment>
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            { addNewGroupModal() }
            { viewGroupsPermissionModal() }
        </>
    )
};
