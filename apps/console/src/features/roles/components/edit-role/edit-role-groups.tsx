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

import {
    AlertLevels,
    RolesInterface,
    RolesMemberInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
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
import { useDispatch } from "react-redux";
import {
    Button,
    Divider,
    Grid,
    Icon,
    Input,
    Label,
    Modal,
    Table
} from "semantic-ui-react";
import { EmptyPlaceholderIllustrations, updateResources } from "../../../core";
import { getGroupList } from "../../../groups/api";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN } from "../../constants";

interface RoleGroupsPropsInterface extends TestableComponentInterface {
    /**
     * User profile
     */
    role: RolesInterface;
    /**
     * Handle user update callback.
     */
    onRoleUpdate: (roleId: string) => void;
    /**
     * Show if the user is read only.
     */
    isReadOnly?: boolean;
}

export const RoleGroupsList: FunctionComponent<RoleGroupsPropsInterface> = (
    props: RoleGroupsPropsInterface
): ReactElement => {

    const {
        role,
        onRoleUpdate,
        isReadOnly
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

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

    useEffect(() => {
        if (!(role)) {
            return;
        }
        mapUserRoles();
        setAssignedGroups(role.groups);
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
        if (!(role)) {
            return;
        }
        mapUserRoles();
        setAssignedGroups(role.groups);
    }, [ role ]);

    useEffect(() => {
        let domain = "Primary";
        const domainName: string[] = role?.displayName?.split("/");

        if (domainName.length > 1 && domainName[0] !== APPLICATION_DOMAIN && domainName[0] !== INTERNAL_DOMAIN) {
            domain = domainName[0];
        }
        getGroupList(domain)
            .then((response) => {
                setPrimaryGroups(response.data.Resources);
            });
    }, []);

    const mapUserRoles = () => {
        const groupsMap = new Map<string, string> ();

        if (role.groups && role.groups instanceof Array) {
            _.forEachRight (role.groups, (group) => {
                const groupName = group.display.split("/");

                if (groupName?.length >= 1) {
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
            if (groupListCopy && primaryGroupsList) {
                const primaryGroupValues = Array.from(primaryGroupsList?.values());

                _.forEach(groupListCopy, (group) => {
                    if (primaryGroupValues.includes(group?.id)) {
                        addedGroups.push(group);
                    }
                });
            }
        setTempGroupList(addedGroups);
        setInitialTempGroupList(addedGroups);
        setGroupList(groupListCopy.filter(x => !addedGroups?.includes(x)));
        setInitialGroupList(groupListCopy.filter(x => !addedGroups?.includes(x)));
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
     * @param role - Role object
     * @param groups - Assigned groups
     */
    const updateRoleGroup = (role: any, groups: any) => {
        const groupIds = [];

        groups.map((group) => {
            groupIds.push(group.id);
        });

        const bulkRemoveData: any = {
            failOnErrors: 1,
            Operations: [],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:BulkRequest"]
        };

        const bulkAddData: any = {
            failOnErrors: 1,
            Operations: [],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:BulkRequest"]
        };

        let removeOperation = {
            data: {
                "Operations": [{
                    "op": "remove",
                    "path": "roles"
                }]
            },
            method: "PATCH"
        };

        const addOperation = {
            data: {
                "Operations": []
            },
            method: "PATCH",
            path: "/Roles/" + role.id
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

        if (removedIds && removedIds?.length > 0) {
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

            updateResources(bulkRemoveData)
                .then(() => {
                    dispatch(addAlert({
                        description: t(
                            "adminPortal:components.user.updateUser.groups.notifications.removeUserGroups." +
                            "success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "adminPortal:components.user.updateUser.groups.notifications.removeUserGroups." +
                            "success.message"
                        )
                    }));
                    handleCloseAddNewGroupModal();
                    onRoleUpdate(role.id);
                })
                .catch((error) => {
                    if (error?.response?.status === 404) {
                        return;
                    }

                    if (error?.response && error?.response?.data && error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error.response?.data?.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "adminPortal:components.user.updateUser.groups.notifications.removeUserGroups." +
                                "error.message"
                            )
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t(
                            "adminPortal:components.user.updateUser.groups.notifications.removeUserGroups." +
                            "genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "adminPortal:components.user.updateUser.groups.notifications.removeUserGroups." +
                            "genericError.message"
                        )
                    }));
                });
        } else {
            groupIds.map((id) => {
                addOperations.push({
                    "op": "add",
                    "value": {
                        "groups": [{
                            "value": id
                        }]
                    }
                });
            });

            addOperation.data.Operations = addOperations;
            bulkAddData.Operations.push(addOperation);

            updateResources(bulkAddData)
                .then(() => {
                    dispatch(addAlert({
                        description: t(
                            "adminPortal:components.user.updateUser.groups.notifications.addUserGroups." +
                            "success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "adminPortal:components.user.updateUser.groups.notifications.addUserGroups." +
                            "success.message"
                        )
                    }));
                    handleCloseAddNewGroupModal();
                    onRoleUpdate(role.id);
                })
                .catch((error) => {
                    if (error?.response?.status === 404) {
                        return;
                    }

                    if (error?.response && error?.response?.data && error?.response?.data?.description) {
                        dispatch(addAlert({
                            description: error.response?.data?.description,
                            level: AlertLevels.ERROR,
                            message: t(
                                "adminPortal:components.user.updateUser.groups.notifications.addUserGroups." +
                                "error.message"
                            )
                        }));

                        return;
                    }

                    dispatch(addAlert({
                        description: t(
                            "adminPortal:components.user.updateUser.groups.notifications.addUserGroups." +
                            "genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "adminPortal:components.user.updateUser.groups.notifications.addUserGroups." +
                            "genericError.message"
                        )
                    }));
                });
        }
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
                            isListEmpty={ !(groupList?.length > 0) }
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
                                groupList?.map((group, index)=> {
                                    const groupName = group.displayName?.split("/");
                                    if (groupName?.length >= 1) {
                                        return (
                                            <TransferListItem
                                                handleItemChange={
                                                    () => handleUnassignedItemCheckboxChange(group)
                                                }
                                                key={ index }
                                                listItem={ group.displayName }
                                                listItemId={ group.id }
                                                listItemIndex={ index }
                                                listItemTypeLabel={
                                                    {
                                                        labelColor: "olive",
                                                        labelText: "Primary"
                                                    }
                                                }
                                                isItemChecked={ checkedUnassignedListItems.includes(group) }
                                                showSecondaryActions={ false }
                                                data-testid="user-mgt-update-groups-modal-unselected-groups"
                                            />
                                        )
                                    }
                                })
                            }
                        </TransferList>
                        <TransferList
                            isListEmpty={ !(tempGroupList?.length > 0) }
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
                                    if (userGroup?.length >= 1) {
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
                                onClick={ () => updateRoleGroup(role, tempGroupList) }
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
            setAssignedGroups(role.groups);
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
                                            {
                                                !isReadOnly && (
                                                    <Button
                                                        data-testid="user-mgt-groups-list-update-button"
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
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {
                                                    assignedGroups?.map((group) => {
                                                        const userGroup = group.display.split("/");
                                                        if (userGroup?.length > 1) {
                                                            return (
                                                                <Table.Row>
                                                                    <Table.Cell>
                                                                        <Label color="olive">
                                                                            { userGroup[0] }
                                                                        </Label>
                                                                    </Table.Cell>
                                                                    <Table.Cell>{ userGroup[1] }</Table.Cell>
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
                                            !isReadOnly && (
                                                <PrimaryButton
                                                    data-testid="user-mgt-empty-groups-list-assign-group-button"
                                                    icon="plus"
                                                    onClick={ handleOpenAddNewGroupModal }
                                                >
                                                    Assign Group
                                                </PrimaryButton>
                                            )
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
        </>
    )
};
