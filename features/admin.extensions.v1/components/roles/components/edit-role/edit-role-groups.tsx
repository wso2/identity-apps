/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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

import {
    AlertLevels,
    RoleGroupsInterface,
    RolesInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    ItemTypeLabelPropsInterface,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem,
    useWizardAlert
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import escapeRegExp from "lodash-es/escapeRegExp";
import forEach from "lodash-es/forEach";
import forEachRight from "lodash-es/forEachRight";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
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
import { getEmptyPlaceholderIllustrations, updateResources } from "../../../../../admin.core.v1";
import { getGroupList } from "../../../../../admin.groups.v1/api";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN, PRIMARY_DOMAIN } from "../../../../../admin.roles.v2/constants";

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
    const dispatch: Dispatch = useDispatch();

    const [ showAddNewRoleModal, setAddNewRoleModalView ] = useState(false);
    const [ groupList, setGroupList ] = useState<any>([]);
    const [ tempGroupList, setTempGroupList ] = useState([]);
    const [ initialGroupList, setInitialGroupList ] = useState([]);
    const [ initialTempGroupList, setInitialTempGroupList ] = useState([]);
    const [ primaryGroups, setPrimaryGroups ] = useState(undefined);
    const [ primaryGroupsList, setPrimaryGroupsList ] = useState<Map<string, string>>(undefined);
    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<RoleGroupsInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<RoleGroupsInterface[]>([]);
    const [ isSelectUnassignedRolesAllRolesChecked, setIsSelectUnassignedAllRolesChecked ] = useState(false);
    const [ isSelectAssignedAllRolesChecked, setIsSelectAssignedAllRolesChecked ] = useState(false);
    const [ assignedGroups, setAssignedGroups ] = useState<RoleGroupsInterface[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

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
            setCheckedAssignedListItems([]);
        }
    }, [ isSelectAssignedAllRolesChecked ]);

    useEffect(() => {
        if (isSelectUnassignedRolesAllRolesChecked) {
            setCheckedUnassignedListItems(groupList);
        } else {
            setCheckedUnassignedListItems([]);
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
        getGroupList(null)
            .then((response: any) => {
                setPrimaryGroups(response.data.Resources);
            });
    }, []);

    const mapUserRoles = () => {
        const groupsMap: Map<string, string> = new Map<string, string> ();

        if (role.groups && role.groups instanceof Array) {
            forEachRight (role.groups, (group: RoleGroupsInterface) => {
                const groupName: string[] = group.display.split("/");

                if (groupName[0] !== APPLICATION_DOMAIN && groupName[0] !== INTERNAL_DOMAIN) {
                    groupsMap.set(group.display, group.value);
                }
            });
            setPrimaryGroupsList(groupsMap);
        } else {
            setPrimaryGroupsList(undefined);
        }
    };

    /**
     * The following function remove already assigned roles from the initial roles.
     */
    const removeExistingRoles = () => {
        const groupListCopy: any = primaryGroups ? [ ...primaryGroups ] : [];

        const addedGroups: any = [];

        if (groupListCopy && primaryGroupsList) {
            const primaryGroupValues: string[] = Array.from(primaryGroupsList?.values());

            forEach(groupListCopy, (group: any) => {
                if (primaryGroupValues.includes(group?.id)) {
                    addedGroups.push(group);
                }
            });
        }
        setTempGroupList(addedGroups);
        setInitialTempGroupList(addedGroups);
        setGroupList(groupListCopy.filter((x: any) => !addedGroups?.includes(x)));
        setInitialGroupList(groupListCopy.filter((x: any) => !addedGroups?.includes(x)));
    };

    /**
     * The following function enables the user to select all the groups at once.
     */
    const selectAllUnAssignedList = () => {
        setIsSelectUnassignedAllRolesChecked(!isSelectUnassignedRolesAllRolesChecked);
    };

    /**
     * The following function enables the user to deselect all the groups at once.
     */
    const selectAllAssignedList = () => {
        setIsSelectAssignedAllRolesChecked(!isSelectAssignedAllRolesChecked);
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (group: RoleGroupsInterface) => {
        const checkedGroups: RoleGroupsInterface[] = [ ...checkedUnassignedListItems ];

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
     * @param group - group object
     */
    const handleAssignedItemCheckboxChange = (group: RoleGroupsInterface) => {
        const checkedGroups: RoleGroupsInterface[] = [ ...checkedAssignedListItems ];

        if (checkedGroups?.includes(group)) {
            checkedGroups.splice(checkedGroups.indexOf(group), 1);
            setCheckedAssignedListItems(checkedGroups);
        } else {
            checkedGroups.push(group);
            setCheckedAssignedListItems(checkedGroups);
        }
    };

    const addGroups = () => {
        const addedRoles: RoleGroupsInterface[] = [ ...tempGroupList ];

        if (checkedUnassignedListItems?.length > 0) {
            checkedUnassignedListItems.map((role: RoleGroupsInterface) => {
                if (!(tempGroupList?.includes(role))) {
                    addedRoles.push(role);
                }
            });
        }
        setTempGroupList(addedRoles);
        setInitialTempGroupList(addedRoles);
        setGroupList(groupList.filter((x: any) => !addedRoles?.includes(x)));
        setInitialGroupList(groupList.filter((x: any) => !addedRoles?.includes(x)));
        setCheckedAssignedListItems([]);
        setIsSelectUnassignedAllRolesChecked(false);
    };

    const removeGroups = () => {
        const removedRoles: RoleGroupsInterface[] = [ ...groupList ];

        if (checkedAssignedListItems?.length > 0) {
            checkedAssignedListItems.map((role: RoleGroupsInterface) => {
                if (!(groupList?.includes(role))) {
                    removedRoles.push(role);
                }
            });
        }
        setGroupList(removedRoles);
        setInitialGroupList(removedRoles);
        setTempGroupList(tempGroupList?.filter((x: any) => !removedRoles?.includes(x)));
        setInitialTempGroupList(tempGroupList?.filter((x: any) => !removedRoles?.includes(x)));
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

    const handleUnselectedListSearch = ({ value }: any) => {
        let isMatch: boolean = false;
        const filteredGroupList: any[] = [];

        if (!isEmpty(value)) {
            const re: RegExp = new RegExp(escapeRegExp(value), "i");

            groupList && groupList.map((role: any) => {
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

    const handleSelectedListSearch = ({ value }: any) => {
        let isMatch: boolean = false;
        const filteredGroupList: any[] = [];

        if (!isEmpty(value)) {
            const re: RegExp = new RegExp(escapeRegExp(value), "i");

            tempGroupList && tempGroupList?.map((role: any) => {
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
        const groupIds: any[] = [];

        groups.map((group: any) => {
            groupIds.push(group.id);
        });

        const bulkData: any = {
            Operations: [],
            failOnErrors: 1,
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:BulkRequest" ]
        };

        const operation: any = {
            data: {
                "Operations": []
            },
            method: "PATCH",
            path: "/Roles/" + role.id
        };

        const removeOperations: any = [];
        const addOperations: any = [];
        let removedIds: any = [];
        const addedIds: any = [];

        if (primaryGroupsList) {
            removedIds = [ ...primaryGroupsList.values() ];
        }

        if (groupIds?.length > 0) {
            groupIds.map((groupId: any) => {
                if (removedIds?.includes(groupId)) {
                    removedIds.splice(removedIds.indexOf(groupId), 1);
                } else {
                    addedIds.push(groupId);
                }
            });
        }

        if (removedIds && removedIds?.length > 0) {
            removedIds.map((id: any) => {
                const operation: any = {
                    op: "remove",
                    path: `groups[value eq ${ id }]`
                };

                removeOperations.push(operation);
            });

            operation.data.Operations.push(...removeOperations);
            bulkData.Operations.push(operation);
        }

        if (addedIds && addedIds?.length > 0) {
            addedIds.map((id: any) => {
                addOperations.push({
                    "op": "add",
                    "value": {
                        "groups": [ {
                            "value": id
                        } ]
                    }
                });
            });

            operation.data.Operations.push(...addOperations);
            bulkData.Operations.push(operation);
        }

        setIsSubmitting(true);

        updateResources(bulkData)
            .then(() => {
                dispatch(addAlert({
                    description: t(
                        "roles:notifications.updateRole.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "roles:notifications.updateRole.success.message"
                    )
                }));
                handleCloseAddNewGroupModal();
                onRoleUpdate(role.id);
            })
            .catch((error: AxiosError) => {
                if (error?.response?.status === 404) {
                    return;
                }

                if (error?.response && error?.response?.data && error?.response?.data?.description) {
                    setAlert({
                        description: error.response?.data?.description,
                        level: AlertLevels.ERROR,
                        message: t(
                            "roles:notifications.updateRole.error.message"
                        )
                    });

                    return;
                }

                setAlert({
                    description: t(
                        "roles:notifications.updateRole.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "roles:notifications.updateRole.genericError.message"
                    )
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const resolveListItemLabel = (displayName: string): ItemTypeLabelPropsInterface => {
        const userGroup: string[] = displayName?.split("/");

        let item: ItemTypeLabelPropsInterface = {
            labelColor: "olive",
            labelText: PRIMARY_DOMAIN
        };

        if (userGroup[0] !== APPLICATION_DOMAIN &&
            userGroup[0] !== INTERNAL_DOMAIN) {
            if (userGroup?.length > 1) {
                item = {
                    ...item,
                    labelText: userGroup[0]
                };
            }
        }

        return item;
    };

    const resolveListItem = (displayName: string): string => {
        const userGroup: string[] = displayName?.split("/");

        if (userGroup?.length !== 1) {
            displayName = userGroup[1];
        }

        return displayName;
    };

    const addNewGroupModal = () => (
        <Modal
            data-testid="role-mgt-update-groups-modal"
            open={ showAddNewRoleModal }
            size="small"
            className="user-roles"
        >
            <Modal.Header>
                { t("roles:edit.groups.addGroupsModal.heading") }
                <Heading subHeading ellipsis as="h6">
                    { t("roles:edit.groups.addGroupsModal.subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content image>
                { alert && alertComponent }
                <TransferComponent
                    searchPlaceholder={ t("transferList:searchPlaceholder",
                        { type: "groups" }) }
                    addItems={ addGroups }
                    removeItems={ removeGroups }
                    handleUnelectedListSearch={ handleUnselectedListSearch }
                    handleSelectedListSearch={ handleSelectedListSearch }
                    data-testid="role-mgt-update-groups-modal"
                >
                    <TransferList
                        isListEmpty={ !(groupList?.length > 0) }
                        listType="unselected"
                        listHeaders={ [
                            t("transferList:list.headers.0"),
                            t("transferList:list.headers.1"), ""
                        ] }
                        handleHeaderCheckboxChange={ selectAllUnAssignedList }
                        isHeaderCheckboxChecked={ isSelectUnassignedRolesAllRolesChecked }
                        emptyPlaceholderContent={ t("transferList:list." +
                            "emptyPlaceholders.roles.unselected", { type: "groups" }) }
                        data-testid="role-mgt-update-groups-modal-unselected-groups-select-all-checkbox"
                        emptyPlaceholderDefaultContent={ t("transferList:list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            groupList?.map((group: any, index: number)=> {
                                return (
                                    <TransferListItem
                                        handleItemChange={
                                            () => handleUnassignedItemCheckboxChange(group)
                                        }
                                        key={ index }
                                        listItem={ resolveListItem(group?.displayName) }
                                        listItemId={ group.id }
                                        listItemIndex={ index }
                                        listItemTypeLabel={ resolveListItemLabel(group?.displayName) }
                                        isItemChecked={ checkedUnassignedListItems.includes(group) }
                                        showSecondaryActions={ false }
                                        data-testid="role-mgt-update-groups-modal-unselected-groups"
                                    />
                                );
                            })
                        }
                    </TransferList>
                    <TransferList
                        isListEmpty={ !(tempGroupList?.length > 0) }
                        listType="selected"
                        listHeaders={ [
                            t("transferList:list.headers.0"),
                            t("transferList:list.headers.1")
                        ] }
                        handleHeaderCheckboxChange={ selectAllAssignedList }
                        isHeaderCheckboxChecked={ isSelectAssignedAllRolesChecked }
                        emptyPlaceholderContent={ t("transferList:list." +
                            "emptyPlaceholders.roles.selected", { type: "groups" }) }
                        data-testid="role-mgt-update-groups-modal-selected-groups-select-all-checkbox"
                        emptyPlaceholderDefaultContent={ t("transferList:list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            tempGroupList?.map((group: any, index: number)=> {
                                return (
                                    <TransferListItem
                                        handleItemChange={
                                            () => handleAssignedItemCheckboxChange(group)
                                        }
                                        key={ index }
                                        listItem={ resolveListItem(group?.displayName) }
                                        listItemId={ group?.id }
                                        listItemIndex={ index }
                                        listItemTypeLabel={ resolveListItemLabel(group?.displayName) }
                                        isItemChecked={ checkedAssignedListItems.includes(group) }
                                        showSecondaryActions={ false }
                                        data-testid="role-mgt-update-groups-modal-selected-groups"
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
                                data-testid="role-mgt-update-groups-modal-cancel-button"
                                floated="left"
                                onClick={ handleCloseAddNewGroupModal }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                data-testid="role-mgt-update-groups-modal-save-button"
                                floated="right"
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
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

    const handleAssignedGroupListSearch = ({ value }: any) => {
        let isMatch: boolean = false;
        const filteredGroupList: any[] = [];

        if (!isEmpty(value)) {
            const re: RegExp = new RegExp(escapeRegExp(value), "i");

            assignedGroups && assignedGroups?.map((group: RoleGroupsInterface) => {
                const groupName: string[] = group.display.split("/");

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

    const resolveTableContent = (): ReactElement => {
        return (
            <Table.Body>
                {
                    assignedGroups?.map((group: RoleGroupsInterface, index: number) => {
                        const userGroup: string[] = group?.display?.split("/");

                        if (userGroup[0] !== APPLICATION_DOMAIN &&
                            userGroup[0] !== INTERNAL_DOMAIN) {
                            return (
                                <Table.Row key={ index }>
                                    <Table.Cell>
                                        {
                                            userGroup?.length === 1
                                                ? (
                                                    <Label color="olive">
                                                        { PRIMARY_DOMAIN }
                                                    </Label>
                                                )
                                                : (
                                                    <Label color="olive">
                                                        { userGroup[ 0 ] }
                                                    </Label>
                                                )
                                        }
                                    </Table.Cell>
                                    <Table.Cell>
                                        {
                                            userGroup?.length === 1
                                                ? group?.display
                                                : userGroup[ 1 ]
                                        }
                                    </Table.Cell>
                                </Table.Row>
                            );
                        }
                    })
                }
            </Table.Body>
        );
    };

    return (
        <>
            <Heading as="h4">
                { t("roles:edit.groups.heading") }
                <Heading subHeading ellipsis as="h6">
                    { t("roles:edit.groups.subHeading") }
                </Heading>
            </Heading>
            <Divider hidden />
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 8 }>
                        {
                            primaryGroupsList?.size > 0 ? (
                                <EmphasizedSegment
                                    data-testid="role-mgt-groups-list"
                                    className="user-role-edit-header-segment"
                                >
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Input
                                                data-testid="role-mgt-groups-list-search-input"
                                                icon={ <Icon name="search" /> }
                                                onChange={ handleAssignedGroupListSearch }
                                                placeholder={ t("user:updateUser.groups." +
                                                    "editGroups.searchPlaceholder") }
                                                floated="left"
                                                size="small"
                                            />
                                            {
                                                !isReadOnly && (
                                                    <Button
                                                        data-testid="role-mgt-groups-list-update-button"
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
                                                            { t("user:updateUser.groups." +
                                                                "editGroups.groupList.headers.0") }
                                                        </strong>
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell>
                                                        <strong>
                                                            { t("user:updateUser.groups." +
                                                                "editGroups.groupList.headers.1") }
                                                        </strong>
                                                    </Table.HeaderCell>
                                                </Table.Row>
                                            </Table.Header>
                                            { resolveTableContent() }
                                        </Table>
                                    </Grid.Row>
                                </EmphasizedSegment>
                            ) : (
                                <EmphasizedSegment>
                                    <EmptyPlaceholder
                                        data-testid="role-mgt-empty-groups-list"
                                        title={ t("roles:edit.groups.placeholders." +
                                            "emptyPlaceholder.title") }
                                        subtitle={ [
                                            t("roles:edit.groups." +
                                                "emptyPlaceholder.subtitles")
                                        ] }
                                        action={
                                            !isReadOnly && (
                                                <PrimaryButton
                                                    data-testid="role-mgt-empty-groups-list-assign-group-button"
                                                    icon="plus"
                                                    onClick={ handleOpenAddNewGroupModal }
                                                >
                                                    { t("roles:edit.groups.placeholders." +
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
            </Grid>
            { addNewGroupModal() }
        </>
    );
};
