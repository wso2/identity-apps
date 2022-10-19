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
    TransferListItem,
    useWizardAlert
} from "@wso2is/react-components";
import escapeRegExp from "lodash-es/escapeRegExp";
import forEach from "lodash-es/forEach";
import forEachRight from "lodash-es/forEachRight";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
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
import { AppState, getEmptyPlaceholderIllustrations, updateResources } from "../../../core";
import { getOrganizationRoles } from "../../../organizations/api";
import { OrganizationUtils } from "../../../organizations/utils";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN, getRolesList } from "../../../roles";
import { RolePermissions } from "../../../users/components";
import { UserRolePermissions } from "../../../users/components/user-role-permissions";
import { GroupsInterface } from "../../models";

interface GroupRolesPropsInterface extends TestableComponentInterface {
    /**
     * User profile
     */
    group: GroupsInterface;
    /**
     * Handle user update callback.
     */
    onGroupUpdate: (groupId: string) => void;
    /**
     * Show if the user is read only.
     */
    isReadOnly?: boolean;
}

export const GroupRolesList: FunctionComponent<GroupRolesPropsInterface> = (
    props: GroupRolesPropsInterface
): ReactElement => {

    const {
        group,
        isReadOnly,
        onGroupUpdate
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ showAddNewRoleModal, setAddNewRoleModalView ] = useState(false);
    const [ roleList, setRoleList ] = useState<any>([]);
    const [ tempRoleList, setTempRoleList ] = useState([]);
    const [ initialRoleList, setInitialRoleList ] = useState([]);
    const [ initialTempRoleList, setInitialTempRoleList ] = useState([]);
    const [ primaryRoles, setPrimaryRoles ] = useState(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    // The following constant holds the state of role already assigned roles.
    const [ primaryRolesList, setPrimaryRolesList ] = useState(undefined);

    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<RolesMemberInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<RolesMemberInterface[]>([]);
    const [ isSelectUnassignedRolesAllRolesChecked, setIsSelectUnassignedAllRolesChecked ] = useState(false);
    const [ isSelectAssignedAllRolesChecked, setIsSelectAssignedAllRolesChecked ] = useState(false);
    const [ showRolePermissionModal, setRolePermissionModal ] = useState(false);
    const [ selectedRoleId, setSelectedRoleId ] = useState<string>("");
    const [ isRoleSelected, setRoleSelection ] = useState(false);

    // The following constant are used to persist the state of the unassigned roles permissions.
    const [ viewRolePermissions, setViewRolePermissions ] = useState(false);
    const [ roleId, setRoleId ] = useState<string>();
    const [ isSelected, setSelection ] = useState(false);

    const [ assignedRoles, setAssignedRoles ] = useState([]);

    const currentOrganization = useSelector((state: AppState) => state.organization.organization);
    const isRootOrganization = useMemo(() =>
        OrganizationUtils.isRootOrganization(currentOrganization), [ currentOrganization ]);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    useEffect(() => {
        if (!selectedRoleId) {
            return;
        }

        if (isRoleSelected) {
            handleOpenRolePermissionModal();
        }
    }, [ isRoleSelected ]);

    useEffect(() => {
        if (!roleId) {
            return;
        }

        if (isSelected) {
            setViewRolePermissions(true);
        }
    }, [ isSelected ]);

    useEffect(() => {
        if (isSelectAssignedAllRolesChecked) {
            setCheckedAssignedListItems(tempRoleList);
        } else {
            setCheckedAssignedListItems([]);
        }
    }, [ isSelectAssignedAllRolesChecked ]);

    useEffect(() => {
        if (isSelectUnassignedRolesAllRolesChecked) {
            setCheckedUnassignedListItems(roleList);
        } else {
            setCheckedUnassignedListItems([]);
        }
    }, [ isSelectUnassignedRolesAllRolesChecked ]);

    useEffect(() => {
        if (!(group)) {
            return;
        }
        mapUserRoles();
        setAssignedRoles(group.roles);
    }, []);

    /**
     * The following useEffect will be triggered when the group is updated.
     */
    useEffect(() => {
        if (!(group)) {
            return;
        }
        mapUserRoles();
        setAssignedRoles(group.roles);
    }, [ group ]);

    useEffect(() => {
        if (isRootOrganization) {
            getRolesList(null)
                .then((response) => {
                    setPrimaryRoles(response.data.Resources);
                });
        } else {
            getOrganizationRoles(currentOrganization.id, null, 100, null)
                .then((response) => {
                    setPrimaryRoles(response.Resources);
                });
        }
    }, []);

    /**
     * The following function remove already assigned roles from the initial roles.
     */
    const removeExistingRoles = () => {
        const roleListCopy = primaryRoles ? [ ...primaryRoles ] : [];
        const addedRoles = [];

        if (roleListCopy && primaryRolesList) {
            const primaryRolesValues = Array.from(primaryRolesList?.values());

            forEach(roleListCopy, (role) => {
                if (primaryRolesValues?.includes(role.id)) {
                    addedRoles.push(role);
                }
            });
        }
        setTempRoleList(addedRoles);
        setInitialTempRoleList(addedRoles);
        setRoleList(roleListCopy.filter(x => !addedRoles?.includes(x)));
        setInitialRoleList(roleListCopy.filter(x => !addedRoles?.includes(x)));
    };

    /**
     * The following function maps the role list of the group
     * the role map available. This is required as the format of the role
     * object differs from Users endpoint to Groups endpoint.
     */
    const mapUserRoles = () => {
        const rolesMap = new Map<string, string>();

        if (group.roles && group.roles instanceof Array) {
            forEachRight(group.roles, (roles) => {
                const role = roles.display.split("/");

                if (role.length >= 1) {
                    rolesMap.set(roles.display, roles.value);
                }
            });
            setPrimaryRolesList(rolesMap);
        } else {
            setPrimaryRolesList(undefined);
        }
    };

    const handelAddNewRoleModalClose = () => {
        setAddNewRoleModalView(false);
    };

    /**
     * This function handles updating the roles of the group.
     */
    const updateUserRole = (group: any, roles: any) => {
        const roleIds = [];

        roles.map((role) => {
            roleIds.push(role.id);
        });

        const bulkData: any = {
            Operations: [],
            failOnErrors: 1,
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:BulkRequest" ]
        };

        let addOperation = {
            data: {
                "Operations": [ {
                    "op": "add",
                    "path": "groups",
                    "value": [ {
                        "value": group.id
                    } ]
                } ]
            },
            method: "PATCH"
        };

        const removeOperations = [];
        const addOperations = [];
        let removedIds = [];
        const addedIds = [];

        if (primaryRolesList) {
            removedIds = [ ...primaryRolesList.values() ];
        }

        if (roleIds?.length > 0) {
            roleIds.map((roleId) => {
                if (removedIds?.includes(roleId)) {
                    removedIds.splice(removedIds.indexOf(roleId), 1);
                } else {
                    addedIds.push(roleId);
                }
            });
        }

        if (removedIds && removedIds.length > 0) {
            removedIds.map((id) => {
                const operation = {
                    data: {
                        "Operations": [
                            {
                                op: "remove",
                                path: `groups[value eq ${ group.id }]`
                            }
                        ]
                    },
                    method: "PATCH",
                    path: "/Roles/" + id
                };

                removeOperations.push(operation);
            });

            bulkData.Operations.push(...removeOperations);
        }

        if (addedIds && addedIds?.length > 0) {
            addedIds.map((id) => {
                addOperation = {
                    ...addOperation,
                    ...{ path: "/Roles/" + id }
                };
                addOperations.push(addOperation);
            });

            addOperations.map((operation) => {
                bulkData.Operations.push(operation);
            });
        }

        setIsSubmitting(true);

        updateResources(bulkData)
            .then(() => {
                dispatch(addAlert({
                    description: t(
                        "console:manage.features.groups.notifications.updateGroup." +
                        "success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.groups.notifications.updateGroup.success.message"
                    )
                }));
                handelAddNewRoleModalClose();
                onGroupUpdate(group.id);
            })
            .catch((error) => {
                if (error?.response?.status === 404) {
                    return;
                }

                if (error?.response && error?.response?.data && error?.response?.data?.description) {
                    setAlert({
                        description: error.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: t(
                            "console:manage.features.groups.notifications.updateGroup.error.message"
                        )
                    });

                    return;
                }

                setAlert({
                    description: t(
                        "console:manage.features.groups.notifications.updateGroup.genericError." +
                        "description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.featuresgroups.notifications.updateGroup.genericError.message"
                    )
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleUnselectedListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList = [];

        if (!isEmpty(value)) {
            const re = new RegExp(escapeRegExp(value), "i");

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

        if (!isEmpty(value)) {
            const re = new RegExp(escapeRegExp(value), "i");

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
     * The following function enables the group to select all the roles at once.
     */
    const selectAllUnAssignedList = () => {
        setIsSelectUnassignedAllRolesChecked(!isSelectUnassignedRolesAllRolesChecked);
    };

    /**
     * The following function enables the group to deselect all the roles at once.
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
        setCheckedUnassignedListItems([]);
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
                return {
                    labelColor: null,
                    labelText: "Application",
                    name: "application-label"
                };
            } else {
                return {
                    labelColor: null,
                    labelText: "Internal",
                    name: "internal-label"
                };
            }
        }
    };

    const handleViewRolePermission = () => {
        setViewRolePermissions(!viewRolePermissions);
        setSelection(false);
    };

    const handleRoleIdSet = (roleId) => {
        setRoleId(roleId);
        setSelection(true);
    };

    const addNewGroupModal = () => (
        <Modal
            data-testid="group-mgt-update-roles-modal"
            open={ showAddNewRoleModal }
            size="small"
            className="group-roles"
        >
            <Modal.Header>
                { t("console:manage.features.groups.edit.roles.addRolesModal.heading") }
                <Heading subHeading ellipsis as="h6">
                    { t("console:manage.features.groups.edit.roles.addRolesModal.subHeading") }
                </Heading>
            </Modal.Header>
            {
                viewRolePermissions
                    ? (
                        <>
                            <Modal.Content>
                                { alert && alertComponent }
                                <RolePermissions
                                    data-testid="user-mgt-update-roles-modal-unselected-role-permissions"
                                    handleNavigateBack={ handleViewRolePermission }
                                    roleId={ roleId }
                                />
                            </Modal.Content>
                            <Divider hidden/>
                        </>
                    ) : (
                        <Modal.Content image>
                            { alert && alertComponent }
                            <TransferComponent
                                searchPlaceholder={ t("console:manage.features.transferList.searchPlaceholder",
                                    { type: "Roles" }) }
                                addItems={ addRoles }
                                removeItems={ removeRoles }
                                handleUnelectedListSearch={ handleUnselectedListSearch }
                                handleSelectedListSearch={ handleSelectedListSearch }
                                data-testid="group-mgt-update-roles-modal"
                            >
                                <TransferList
                                    isListEmpty={ !(roleList.length > 0) }
                                    listType="unselected"
                                    listHeaders={ [
                                        t("console:manage.features.transferList.list.headers.0"),
                                        t("console:manage.features.transferList.list.headers.1"), ""
                                    ] }
                                    handleHeaderCheckboxChange={ selectAllUnAssignedList }
                                    isHeaderCheckboxChecked={ isSelectUnassignedRolesAllRolesChecked }
                                    emptyPlaceholderContent={ t("console:manage.features.transferList.list." +
                                        "emptyPlaceholders.users.roles.unselected", { type: "roles" }) }
                                    data-testid="group-mgt-update-roles-modal-unselected-roles-select-all-checkbox"
                                    emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                                        + "emptyPlaceholders.default") }
                                >
                                    {
                                        roleList?.map((role, index) => {
                                            const roleName = role.displayName?.split("/");

                                            if (roleName.length >= 1) {
                                                return (
                                                    <TransferListItem
                                                        handleItemChange={
                                                            () => handleUnassignedItemCheckboxChange(role)
                                                        }
                                                        key={ index }
                                                        listItem={
                                                            roleName.length == 1 ? roleName[ 0 ] : roleName[ 1 ] }
                                                        listItemId={ role.id }
                                                        listItemIndex={ index }
                                                        listItemTypeLabel={ createItemLabel(role?.displayName) }
                                                        isItemChecked={ checkedUnassignedListItems.includes(role) }
                                                        showSecondaryActions={ true }
                                                        handleOpenPermissionModal={ () => handleRoleIdSet(role.id) }
                                                        data-testid="group-mgt-update-roles-modal-unselected-roles"
                                                    />
                                                );
                                            }
                                        })
                                    }
                                </TransferList>
                                <TransferList
                                    isListEmpty={ !(tempRoleList.length > 0) }
                                    listType="selected"
                                    listHeaders={ [
                                        t("console:manage.features.transferList.list.headers.0"),
                                        t("console:manage.features.transferList.list.headers.1")
                                    ] }
                                    handleHeaderCheckboxChange={ selectAllAssignedList }
                                    isHeaderCheckboxChecked={ isSelectAssignedAllRolesChecked }
                                    emptyPlaceholderContent={ t("console:manage.features.transferList.list." +
                                        "emptyPlaceholders.users.roles.selected", { type: "roles" }) }
                                    data-testid="group-mgt-update-roles-modal-selected-roles-select-all-checkbox"
                                    emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                                        + "emptyPlaceholders.default") }
                                >
                                    {
                                        tempRoleList?.map((role, index) => {
                                            const roleName = role.displayName.split("/");

                                            if (roleName.length >= 1) {
                                                return (
                                                    <TransferListItem
                                                        handleItemChange={
                                                            () => handleAssignedItemCheckboxChange(role)
                                                        }
                                                        key={ index }
                                                        listItem={
                                                            roleName.length == 1 ? roleName[ 0 ] : roleName[ 1 ] }
                                                        listItemId={ role.id }
                                                        listItemIndex={ index }
                                                        listItemTypeLabel={ createItemLabel(role?.displayName) }
                                                        isItemChecked={ checkedAssignedListItems.includes(role) }
                                                        showSecondaryActions={ false }
                                                        data-testid="group-mgt-update-roles-modal-selected-roles"
                                                    />
                                                );
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
                    <Grid.Row column={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid="group-mgt-update-roles-modal-cancel-button"
                                floated="left"
                                onClick={ handleCloseAddNewGroupModal }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                data-testid="group-mgt-update-roles-modal-save-button"
                                floated="right"
                                onClick={ () => updateUserRole(group, tempRoleList) }
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

    const handleAssignedRoleListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredRoleList = [];

        if (!isEmpty(value)) {
            const re = new RegExp(escapeRegExp(value), "i");

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
            setAssignedRoles(group.roles);
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
                data-testid="group-mgt-roles-list-roles-permission-modal"
                openRolePermissionModal={ showRolePermissionModal }
                handleCloseRolePermissionModal={ handleCloseRolePermissionModal }
                roleId={ selectedRoleId }
            />
        );
    };

    return (
        <>
            <Heading as="h4">
                { t("console:manage.features.user.updateUser.roles.editRoles.heading") }
            </Heading>
            <Heading subHeading ellipsis as="h6">
                { t("console:manage.features.groups.edit.roles.subHeading") }
            </Heading>
            <Divider hidden/>
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 8 }>
                        {
                            primaryRolesList?.size > 0 ? (
                                <EmphasizedSegment
                                    data-testid="group-mgt-roles-list"
                                    className="user-role-edit-header-segment"
                                >
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Input
                                                data-testid="group-mgt-roles-list-search-input"
                                                icon={ <Icon name="search"/> }
                                                onChange={ handleAssignedRoleListSearch }
                                                placeholder={ t("console:manage.features.user.updateUser.roles." +
                                                    "editRoles.searchPlaceholder") }
                                                floated="left"
                                                size="small"
                                            />
                                            {
                                                !isReadOnly && (
                                                    <Button
                                                        data-testid="group-mgt-roles-list-update-button"
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
                                                            {
                                                                t("console:manage.features.user.updateUser.roles." +
                                                                    "editRoles.roleList.headers.0")
                                                            }
                                                        </strong>
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell>
                                                        <strong>
                                                            {
                                                                t("console:manage.features.user.updateUser.roles." +
                                                                    "editRoles.roleList.headers.1")
                                                            }
                                                        </strong>
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell/>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {
                                                    assignedRoles?.map((group, index: number) => {
                                                        const groupRole = group.display.split("/");

                                                        if (groupRole.length >= 1) {
                                                            return (
                                                                <Table.Row key={ index }>
                                                                    {
                                                                        groupRole[ 0 ] == APPLICATION_DOMAIN ? (
                                                                            <Table.Cell>
                                                                                <Label className="application-label">
                                                                                    { APPLICATION_DOMAIN }
                                                                                </Label>
                                                                            </Table.Cell>
                                                                        ) : (
                                                                            <Table.Cell>
                                                                                <Label className="internal-label">
                                                                                    { INTERNAL_DOMAIN }
                                                                                </Label>
                                                                            </Table.Cell>
                                                                        )
                                                                    }
                                                                    <Table.Cell width={ 8 }>
                                                                        {
                                                                            groupRole.length == 1
                                                                                ? groupRole[ 0 ] : groupRole[ 1 ]
                                                                        }
                                                                    </Table.Cell>
                                                                    <Table.Cell textAlign="center">
                                                                        <Popup
                                                                            content="View permissions"
                                                                            trigger={
                                                                                (<Icon
                                                                                    data-testid={
                                                                                        `group-mgt-roles-list-
                                                                                        ${ groupRole[ 1 ] }-
                                                                                        permissions-button` }
                                                                                    color="grey"
                                                                                    name="key"
                                                                                    onClick={
                                                                                        () => handleSetSelectedId(
                                                                                            group.value
                                                                                        )
                                                                                    }
                                                                                />)
                                                                            }
                                                                        />
                                                                    </Table.Cell>
                                                                </Table.Row>
                                                            );
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
                                        data-testid="group-mgt-group-empty-roles-list"
                                        title={ t("console:manage.features.user.updateUser.roles.editRoles." +
                                            "roleList.emptyListPlaceholder.title") }
                                        subtitle={ [
                                            t("console:manage.features.user.updateUser.roles.editRoles." +
                                                "roleList.emptyListPlaceholder.subTitle.0"),
                                            t("console:manage.features.user.updateUser.roles.editRoles." +
                                                "roleList.emptyListPlaceholder.subTitle.1"),
                                            t("console:manage.features.user.updateUser.roles.editRoles." +
                                                "roleList.emptyListPlaceholder.subTitle.2")
                                        ] }
                                        action={
                                            !isReadOnly && (
                                                <PrimaryButton
                                                    data-testid="group-mgt-group-empty-roles-list-assign-group-button"
                                                    onClick={ handleOpenAddNewGroupModal }
                                                >
                                                    <Icon name="plus"/>
                                                    Assign Role
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
                { viewRolesPermissionModal() }
                { addNewGroupModal() }
            </Grid>
        </>
    );
};
