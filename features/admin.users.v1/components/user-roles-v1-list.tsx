/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { AppState, getEmptyPlaceholderIllustrations, updateResources } from "@wso2is/admin.core.v1";
import { getOrganizationRoles } from "@wso2is/admin.organizations.v1/api";
import {
    OrganizationResponseInterface,
    OrganizationRoleListItemInterface,
    OrganizationRoleListResponseInterface
} from "@wso2is/admin.organizations.v1/models/organizations";
import { OrganizationUtils } from "@wso2is/admin.organizations.v1/utils";
import { getRolesList } from "@wso2is/admin.roles.v2/api";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN } from "@wso2is/admin.roles.v2/constants";
import {
    AlertInterface,
    AlertLevels,
    ProfileInfoInterface,
    RoleListInterface,
    RolesInterface,
    RolesMemberInterface
} from "@wso2is/core/models";
import {
    ContentLoader,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    LinkButton,
    Popup,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import { AxiosError, AxiosResponse } from "axios";
import escapeRegExp from "lodash-es/escapeRegExp";
import forEachRight from "lodash-es/forEachRight";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Button, Divider, Grid, Icon, Input, InputOnChangeData, Label, Modal, Table } from "semantic-ui-react";
import { UserRolePermissions } from "./user-role-permissions";
import { RolePermissions } from "./wizard/user-role-permissions";

interface UserRolesV1PropsInterface {
    /**
     * User profile
     */
    user: ProfileInfoInterface;
    /**
     * On alert fired callback.
     */
    onAlertFired: (alert: AlertInterface) => void;
    /**
     * Handle user update callback.
     */
    handleUserUpdate: (userId: string) => void;
    /**
     * Show if the user is read only.
     */
    isReadOnly?: boolean;
    /**
     * Enable roles and groups separation.
     */
    isGroupAndRoleSeparationEnabled?: boolean;
    /**
     * Show/ Hide domain
     */
    showDomain?: boolean;
    /**
     * Permissions to hide.
     */
    permissionsToHide?: string[];
    /**
     * Show/ Hide Application roles.
     */
    hideApplicationRoles?: boolean;
}

export const UserRolesV1List: FunctionComponent<UserRolesV1PropsInterface> = (
    props: UserRolesV1PropsInterface
): ReactElement => {

    const {
        onAlertFired,
        user,
        handleUserUpdate,
        isReadOnly,
        isGroupAndRoleSeparationEnabled,
        showDomain,
        permissionsToHide,
        hideApplicationRoles
    } = props;

    const { t } = useTranslation();

    const [ showAddNewRoleModal, setAddNewRoleModalView ] = useState(false);
    const [ roleList, setRoleList ] = useState<(RolesInterface | OrganizationRoleListItemInterface)[]>([]);
    const [ selectedRoleList, setSelectedRoleList ] = useState<
        (RolesInterface | OrganizationRoleListItemInterface)[]>([]);
    const [ initialRoleList, setInitialRoleList ] = useState([]);
    const [ primaryRoles, setPrimaryRoles ] = useState<
        RolesInterface[] | OrganizationRoleListItemInterface[]
    >(undefined);

    // The following constant holds the state of role already assigned roles.
    const [ primaryRolesList, setPrimaryRolesList ] = useState(undefined);

    const [ isSelectAllRolesChecked, setIsSelectAllRolesChecked ] = useState(false);
    const [ showRolePermissionModal, setRolePermissionModal ] = useState(false);
    const [ selectedRoleId, setSelectedRoleId ] = useState<string>("");
    const [ isRoleSelected, setRoleSelection ] = useState(false);

    // The following constant are used to persist the state of the unassigned roles permissions.
    const [ viewRolePermissions, setViewRolePermissions ] = useState(false);
    const [ roleId, setRoleId ] = useState<string>();
    const [ isSelected, setSelection ] = useState(false);

    // The following constant is used to persist the state whether user's assigned roles are still loading or finished.
    const [ isPrimaryRolesLoading, setPrimaryRolesLoading ] = useState<boolean>(false);

    const [ assignedRoles, setAssignedRoles ] = useState<RolesMemberInterface[]>([]);
    const [ displayedRoles, setDisplayedRoles ] = useState([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization);
    const isRootOrganization: boolean = useMemo(() =>
        OrganizationUtils.isSuperOrganization(currentOrganization), [ currentOrganization ]);

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
        setAssignedRoles(displayedRoles);
    }, [ displayedRoles ]);

    /**
     * The following useEffect will be triggered when the roles are updated.
     */
    useEffect(() => {
        if (!(user)) {
            return;
        }
        if (!hideApplicationRoles) {
            setDisplayedRoles(user.roles);
            mapUserRoles();
            resolveUserRoles();

            return;
        }
        setDisplayedRoles(user.roles.filter((role: RolesMemberInterface) =>
            (role.display?.split("/").length !== 2) && (role.display?.split("/")[0] !== "Application")));
        mapUserRoles();
        resolveUserRoles();
    }, [ user ]);

    useEffect(() => {
        if (!(user)) {
            return;
        }
        setInitialLists();
    }, [ user.roles && primaryRoles ]);

    useEffect(() => {
        setPrimaryRolesLoading(true);

        if (isRootOrganization) {
            // Get Roles from SCIM API
            getRolesList(null)
                .then((response: AxiosResponse<RoleListInterface>) => {
                    const roleResources: RolesInterface[] = response.data.Resources;

                    if (hideApplicationRoles) {
                        if (roleResources && roleResources instanceof Array) {
                            response.data.Resources = roleResources.filter((role: RolesInterface) => {
                                if (role.displayName?.includes(APPLICATION_DOMAIN)) {
                                    return false;
                                }

                                return role;
                            });
                        }
                    }
                    setPrimaryRoles(response.data.Resources);
                })
                .finally(() => {
                    setPrimaryRolesLoading(false);
                });
        } else {
            // Get Roles from Organization API
            getOrganizationRoles(currentOrganization.id, null, 100, null)
                .then((response: OrganizationRoleListResponseInterface) => {
                    const roleResources: OrganizationRoleListItemInterface[] = response.Resources;

                    if (hideApplicationRoles) {
                        if (roleResources && roleResources instanceof Array) {
                            response.Resources = roleResources.filter((role: RolesInterface) => {
                                if (role.displayName?.includes(APPLICATION_DOMAIN)) {
                                    return false;
                                }

                                return role;
                            });
                        }
                    }
                    setPrimaryRoles(response.Resources);
                }).finally(() => {
                    setPrimaryRolesLoading(false);
                });
        }
    }, []);

    /**
     * Resolves user roles depending on whether the separation is enabled.
     */
    const resolveUserRoles = (): void => {
        if (isGroupAndRoleSeparationEnabled) {
            setAssignedRoles(hideApplicationRoles? displayedRoles : user?.roles);
        } else {
            const userRoles: RolesMemberInterface[] = [];

            user?.groups?.map((group: any) => {
                const displayName: string[] = group?.display?.split("/");

                if(displayName?.length > 1
                    && (displayName[0] == APPLICATION_DOMAIN || displayName[0] == INTERNAL_DOMAIN)) {
                    if (hideApplicationRoles && group[0] === "Application" && group.length === 2) {
                        return;
                    }
                    userRoles.push(group);
                }
            });
            setDisplayedRoles(userRoles);
            setAssignedRoles(userRoles);
        }
    };

    const setInitialLists = () => {
        const roleListCopy: (RolesInterface | OrganizationRoleListItemInterface)[] = primaryRoles
            ? [ ...primaryRoles ]
            : [];
        const addedRoles: (RolesInterface | OrganizationRoleListItemInterface)[] = [];

        if (roleListCopy && primaryRolesList) {
            const primaryRolesValues: unknown[] = Array.from(primaryRolesList?.values());

            forEachRight(roleListCopy, (role: RolesInterface | OrganizationRoleListItemInterface) => {
                if (primaryRolesValues?.includes(role.id)) {
                    addedRoles.push(role);
                }
            });
        }
        setSelectedRoleList(addedRoles);
        setRoleList(roleListCopy);
        setInitialRoleList(roleListCopy);
        setIsSelectAllRolesChecked(roleListCopy.length === addedRoles.length);
    };

    /**
     * The following function maps the role list of the user
     * the role map available. This is required as the format of the role
     * object differs from Users endpoint to Groups endpoint.
     */
    const mapUserRoles = () => {
        const rolesMap: Map<string, string> = new Map<string, string>();

        if(!isGroupAndRoleSeparationEnabled) {
            const groupsMap: Map<string, string> = new Map<string, string>();

            if (user.groups && user.groups instanceof Array) {
                forEachRight (user.groups, (group: any) => {
                    const groupName: string[] = group?.display?.split("/");

                    if (groupName?.length >= 1) {
                        if (hideApplicationRoles && group[0] === "Application" && group.length === 2) {
                            return;
                        }
                        groupsMap?.set(group.display, group.value);
                    }
                });
                setPrimaryRolesList(groupsMap);
            }

            return;
        }

        if (user.roles && user.roles instanceof Array) {
            forEachRight (user.roles, (roles: RolesMemberInterface) => {
                const role: string[] = roles?.display?.split("/");

                if (role?.length >= 1 && roles?.value) {
                    if (hideApplicationRoles && role[0] === "Application" && role.length === 2) {
                        return;
                    }
                    rolesMap.set(roles?.display, roles?.value);
                }
            });
            setPrimaryRolesList(rolesMap);
        }
    };

    const handelAddNewRoleModalClose = () => {
        setAddNewRoleModalView(false);
    };

    /**
     * This function handles updating the roles of the user.
     */
    const updateUserRole = (user: any, roles: (RolesInterface | OrganizationRoleListItemInterface)[]) => {
        const roleIds: string[] = [];

        roles.map((role: RolesInterface | OrganizationRoleListItemInterface) => {
            roleIds.push(role.id);
        });

        const bulkData: any = {
            Operations: [],
            failOnErrors: 1,
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:BulkRequest" ]
        };

        let removeOperation: {
            data: {
                Operations: {
                    op: string;
                    path: string;
                }[];
                schemas: string[];
            };
            method: string;
        } = {
            data: {
                "Operations": [ {
                    "op": "remove",
                    "path": "users[value eq " + user.id + "]"
                } ],
                "schemas": [ "urn:ietf:params:scim:schemas:core:2.0:Role" ]
            },
            method: "PATCH"
        };

        let addOperation: {
            data: {
                Operations: {
                    op: string;
                    value: {
                        users: {
                            value: any;
                        }[];
                    };
                }[];
                schemas: string[];
            };
            method: string;
        } = {
            data: {
                "Operations": [ {
                    "op": "add",
                    "value": {
                        "users": [ {
                            "value": user.id
                        } ]
                    }
                } ],
                "schemas": [ "urn:ietf:params:scim:schemas:core:2.0:Role" ]
            },
            method: "PATCH"
        };

        const removeOperations: {
            data: {
                Operations: {
                    op: string;
                    path: string;
                }[];
                schemas: string[];
            };
            method: string;
        }[] = [];
        const addOperations: {
            data: {
                Operations: {
                    op: string;
                    value: {
                        users: {
                            value: any;
                        }[];
                    };
                }[];
                schemas: string[];
            };
            method: string;
        }[] = [];
        let removedIds: string[] = [];
        const addedIds: string[] = [];

        if (primaryRolesList) {
            removedIds = [ ...primaryRolesList.values() ];
        }

        if (roleIds?.length > 0) {
            roleIds.map((roleId: string) => {
                if (removedIds?.includes(roleId)) {
                    removedIds.splice(removedIds.indexOf(roleId), 1);
                } else {
                    addedIds.push(roleId);
                }
            });
        }

        if (removedIds && removedIds?.length > 0) {
            removedIds.map((id: string) => {
                removeOperation = {
                    ...removeOperation,
                    ...{ path: "/Roles/" + id }
                };
                removeOperations.push(removeOperation);
            });

            removeOperations.map((operation: {
                data: {
                    Operations: {
                        op: string;
                        path: string;
                    }[];
                    schemas: string[];
                };
                method: string;
            }) => {
                bulkData.Operations.push(operation);
            });
        }

        if (addedIds && addedIds?.length > 0) {
            addedIds.map((id: string) => {
                addOperation = {
                    ...addOperation,
                    ...{ path: "/Roles/" + id }
                };
                addOperations.push(addOperation);
            });

            addOperations.map((operation: {
                data: {
                    Operations: {
                        op: string;
                        value: {
                            users: {
                                value: any;
                            }[];
                        };
                    }[];
                    schemas: string[];
                };
                method: string;
            }) => {
                bulkData.Operations.push(operation);
            });
        }

        setIsSubmitting(true);

        updateResources(bulkData)
            .then(() => {
                onAlertFired({
                    description: t(
                        "user:updateUser.roles.notifications.updateUserRoles." +
                        "success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "user:updateUser.roles.notifications.updateUserRoles." +
                        "success.message"
                    )
                });
                handelAddNewRoleModalClose();
                handleUserUpdate(user.id);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.status === 404) {
                    return;
                }

                if (error?.response && error?.response?.data && error?.response?.data?.description) {
                    onAlertFired({
                        description: error.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: t(
                            "user:updateUser.roles.notifications.updateUserRoles." +
                            "error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "user:updateUser.roles.notifications.updateUserRoles." +
                        "genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "user:updateUser.roles.notifications.updateUserRoles." +
                        "genericError.message"
                    )
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const handleUnselectedListSearch = (
        e: React.FormEvent<HTMLInputElement>,
        { value }: { value: string; }
    ) => {
        let isMatch: boolean = false;
        const filteredRoleList: (RolesInterface | OrganizationRoleListItemInterface)[] = [];

        if (!isEmpty(value)) {
            const re: RegExp = new RegExp(escapeRegExp(value), "i");

            roleList && roleList.map((role: RolesInterface | OrganizationRoleListItemInterface) => {
                isMatch = re.test(role.displayName);
                if (!showDomain && role.displayName.split("/").length > 1) {
                    isMatch = re.test(role.displayName.split("/")[1]);
                }
                if (isMatch) {
                    filteredRoleList.push(role);
                    setRoleList(filteredRoleList);
                }
            });
        } else {
            setRoleList(initialRoleList);
        }
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (role: RolesInterface | OrganizationRoleListItemInterface) => {

        const checkedRoles: (RolesInterface | OrganizationRoleListItemInterface)[] = [ ...selectedRoleList ];

        if (checkedRoles?.includes(role)) {
            checkedRoles.splice(checkedRoles.indexOf(role), 1);
            setSelectedRoleList(checkedRoles);
        } else {
            checkedRoles.push(role);
            setSelectedRoleList(checkedRoles);
        }
        setIsSelectAllRolesChecked(checkedRoles.length === roleList.length);
    };

    /**
     * The following function enables the user to select all the roles at once.
     */
    const selectAllRoles = () => {
        if (!isSelectAllRolesChecked) {
            setSelectedRoleList(roleList);
        } else {
            setSelectedRoleList([]);
        }
        setIsSelectAllRolesChecked(!isSelectAllRolesChecked);
    };

    const handleOpenAddNewGroupModal = () => {
        setInitialLists();
        setAddNewRoleModalView(true);
    };

    const handleCloseAddNewGroupModal = () => {
        setIsSelectAllRolesChecked(false);
        setAddNewRoleModalView(false);
    };

    /**
     * The following method handles creating a label for the list item.
     *
     * @param roleName - Name of the role.
     */
    const createItemLabel = (roleName: string) => {
        const role: string[] = roleName?.split("/");

        if (role?.length > 0) {
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

    const handleRoleIdSet = (roleId: string) => {
        setRoleId(roleId);
        setSelection(true);
    };

    const addNewGroupModal = () => (
        <Modal
            data-testid="user-mgt-update-roles-modal"
            open={ showAddNewRoleModal }
            size="small"
            className="user-roles"
        >
            <Modal.Header>
                { t("user:updateUser.roles.addRolesModal.heading") }
                <Heading subHeading ellipsis as="h6">
                    { t("user:updateUser.roles.addRolesModal.subHeading") }
                </Heading>
            </Modal.Header>
            {
                viewRolePermissions
                    ? (
                        <>
                            <Modal.Content>
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
                            { !isPrimaryRolesLoading ? (
                                <TransferComponent
                                    selectionComponent
                                    searchPlaceholder={ t("transferList:searchPlaceholder",
                                        { type: "Roles" }) }
                                    handleUnelectedListSearch={ handleUnselectedListSearch }
                                    data-testid="user-mgt-update-roles-modal"
                                >
                                    <TransferList
                                        isListEmpty={ !(roleList?.length > 0) }
                                        listType="unselected"
                                        listHeaders={ showDomain ? [
                                            t("transferList:list.headers.0"),
                                            t("transferList:list.headers.1"), ""
                                        ] : [
                                            t("transferList:list.headers.1"), ""
                                        ] }
                                        handleHeaderCheckboxChange={ selectAllRoles }
                                        isHeaderCheckboxChecked={ isSelectAllRolesChecked }
                                        emptyPlaceholderContent={ t("transferList:list." +
                                            "emptyPlaceholders.users.roles.unselected", { type: "roles" }) }
                                        data-testid="user-mgt-update-roles-modal-unselected-roles-select-all-checkbox"
                                        emptyPlaceholderDefaultContent={ t("transferList:list."
                                            + "emptyPlaceholders.default") }
                                    >
                                        {
                                            roleList?.map((
                                                role: RolesInterface | OrganizationRoleListItemInterface,
                                                index: number
                                            ) => {
                                                const roleName: string[] = role?.displayName?.split("/");

                                                if (roleName?.length >= 1) {
                                                    return (
                                                        <TransferListItem
                                                            handleItemChange={
                                                                () => handleUnassignedItemCheckboxChange(role)
                                                            }
                                                            key={ index }
                                                            listItem={
                                                                roleName?.length > 1 ? roleName[ 1 ] : roleName[ 0 ]
                                                            }
                                                            listItemId={ role.id }
                                                            listItemIndex={ index }
                                                            listItemTypeLabel={ showDomain ?
                                                                createItemLabel(role?.displayName) : null }
                                                            isItemChecked={ selectedRoleList.includes(role) }
                                                            showSecondaryActions={ true }
                                                            handleOpenPermissionModal={ () => handleRoleIdSet(role.id) }
                                                            data-testid="user-mgt-update-roles-modal-unselected-roles"
                                                        />
                                                    );
                                                }
                                            })
                                        }
                                    </TransferList>
                                </TransferComponent>
                            ) : <ContentLoader/> }
                        </Modal.Content>
                    )
            }
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 2 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                data-testid="user-mgt-update-roles-modal-cancel-button"
                                floated="left"
                                onClick={ handleCloseAddNewGroupModal }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                data-testid="user-mgt-update-roles-modal-save-button"
                                floated="right"
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                                onClick={ () => updateUserRole(user, selectedRoleList) }
                            >
                                { t("common:save") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );

    const handleAssignedRoleListSearch = (e: React.ChangeEvent<HTMLInputElement>, { value }: InputOnChangeData) => {
        let isMatch: boolean = false;
        const filteredRoleList: RolesMemberInterface[] = [];

        if (!isEmpty(value)) {
            const re: RegExp = new RegExp(escapeRegExp(value), "i");

            assignedRoles && assignedRoles?.map((role: RolesMemberInterface) => {
                const groupName: string[] = role?.display?.split("/");

                if (groupName?.length >= 1) {
                    isMatch = re.test(role.display);
                    if (!showDomain && groupName?.length > 1) {
                        isMatch = re.test(groupName[1]);
                    }
                    if (isMatch) {
                        filteredRoleList.push(role);
                        setAssignedRoles(filteredRoleList);
                    }
                }
            });
        } else {
            setAssignedRoles(displayedRoles);
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
                data-testid="user-mgt-roles-list-roles-permission-modal"
                openRolePermissionModal={ showRolePermissionModal }
                handleCloseRolePermissionModal={ handleCloseRolePermissionModal }
                roleId={ selectedRoleId }
                permissionsToHide={ permissionsToHide }
            />
        );
    };

    return (
        <>
            <Heading as="h4">
                { t("user:updateUser.roles.editRoles.heading") }
            </Heading>
            <Heading subHeading ellipsis as="h6">
                { t("user:updateUser.roles.editRoles.subHeading") }
            </Heading>
            <Divider hidden/>
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 10 } tablet={ 16 } mobile={ 16 }>
                        {
                            !isPrimaryRolesLoading && primaryRolesList?.size > 0 ? (
                                <EmphasizedSegment
                                    clearing
                                    data-testid="user-mgt-roles-list"
                                    className="user-role-edit-header-segment"
                                >
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Input
                                                data-testid="user-mgt-roles-list-search-input"
                                                icon={ <Icon name="search"/> }
                                                onChange={ handleAssignedRoleListSearch }
                                                placeholder={ t("user:updateUser.roles." +
                                                    "editRoles.searchPlaceholder") }
                                                floated="left"
                                                size="small"
                                            />
                                            {
                                                !isReadOnly && (
                                                    <Button
                                                        data-testid="user-mgt-roles-list-update-button"
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
                                                    {
                                                        showDomain && (
                                                            <Table.HeaderCell>
                                                                <strong>
                                                                    {
                                                                        t("user:updateUser" +
                                                                            ".roles.editRoles.roleList.headers.0")
                                                                    }
                                                                </strong>
                                                            </Table.HeaderCell>
                                                        )
                                                    }
                                                    <Table.HeaderCell>
                                                        <strong>
                                                            {
                                                                t("user:updateUser.roles." +
                                                                "editRoles.roleList.headers.1")
                                                            }
                                                        </strong>
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell/>
                                                </Table.Row>
                                            </Table.Header>
                                            <Table.Body>
                                                {
                                                    assignedRoles?.map((group: RolesMemberInterface, index: number) => {
                                                        const userRole: string[] = group?.display?.split("/");

                                                        if (userRole?.length >= 1 && group?.value) {
                                                            return (
                                                                <Table.Row key={ index }>
                                                                    { showDomain && (
                                                                        userRole[ 0 ] == "Application" ? (
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
                                                                    ) }
                                                                    <Table.Cell width={ 8 }>
                                                                        {
                                                                            userRole?.length == 1
                                                                                ? userRole[ 0 ] : userRole[ 1 ]
                                                                        }
                                                                    </Table.Cell>
                                                                    <Table.Cell textAlign="right">
                                                                        <Popup
                                                                            content="View permissions"
                                                                            position="top right"
                                                                            trigger={
                                                                                (<Icon
                                                                                    data-testid={
                                                                                        `user-mgt-roles-list-
                                                                                        ${ userRole[ 1 ] }-
                                                                                        permissions-button` }
                                                                                    color="grey"
                                                                                    className="mr-2"
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
                            ) : primaryRolesList?.size === 0 ? (
                                <EmphasizedSegment>
                                    <EmptyPlaceholder
                                        data-testid="user-mgt-user-empty-roles-list"
                                        title={ t("user:updateUser.roles.editRoles." +
                                            "roleList.emptyListPlaceholder.title") }
                                        subtitle={ [
                                            t("user:updateUser.roles.editRoles." +
                                                "roleList.emptyListPlaceholder.subTitle.0"),
                                            t("user:updateUser.roles.editRoles." +
                                                "roleList.emptyListPlaceholder.subTitle.1"),
                                            t("user:updateUser.roles.editRoles." +
                                                "roleList.emptyListPlaceholder.subTitle.2")
                                        ] }
                                        action={
                                            !isReadOnly && (
                                                <PrimaryButton
                                                    data-testid="user-mgt-user-empty-roles-list-assign-group-button"
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
                            ) : <ContentLoader/>
                        }
                    </Grid.Column>
                </Grid.Row>
                { viewRolesPermissionModal() }
                { addNewGroupModal() }
            </Grid>
        </>
    );
};

/**
 * Default props for the component.
 */
UserRolesV1List.defaultProps = {
    hideApplicationRoles: false,
    showDomain: true
};
