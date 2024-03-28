/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com).
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
    ContentLoader,
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
import React, { FormEvent, FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
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
import { AppState, getEmptyPlaceholderIllustrations } from "../../../admin-core-v1";
import { getGroupList } from "../../../groups/api";
import { GroupListInterface, GroupsInterface } from "../../../groups/models";
import { patchOrganizationRoleDetails } from "../../api";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN, PRIMARY_DOMAIN } from "../../constants";
import {
    OrganizationResponseInterface,
    OrganizationRoleInterface,
    PatchOrganizationRoleDataInterface
} from "../../models";

interface RoleGroupsPropsInterface extends TestableComponentInterface {
    /**
     * User profile
     */
    role: OrganizationRoleInterface;
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
    const [ groupList, setGroupList ] = useState<GroupsInterface[]>([]);
    const [ tempGroupList, setTempGroupList ] = useState<GroupsInterface[]>([]);
    const [ initialGroupList, setInitialGroupList ] = useState<GroupsInterface[]>([]);
    const [ initialTempGroupList, setInitialTempGroupList ] = useState<GroupsInterface[]>([]);
    const [ primaryGroups, setPrimaryGroups ] = useState(undefined);
    const [ primaryGroupsList, setPrimaryGroupsList ] = useState<Map<string, string>>(undefined);
    const [ checkedUnassignedListItems, setCheckedUnassignedListItems ] = useState<GroupsInterface[]>([]);
    const [ checkedAssignedListItems, setCheckedAssignedListItems ] = useState<GroupsInterface[]>([]);
    const [ isSelectUnassignedRolesAllRolesChecked, setIsSelectUnassignedAllRolesChecked ] = useState(false);
    const [ isSelectAssignedAllRolesChecked, setIsSelectAssignedAllRolesChecked ] = useState(false);
    const [ assignedGroups, setAssignedGroups ] = useState<RoleGroupsInterface[]>([]);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isLoadingAssignedGroups, setIsLoadingAssignedGroups ] = useState<boolean>(true);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();
    const currentOrganization: OrganizationResponseInterface = useSelector(
        (state: AppState) => state.organization.organization
    );

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
            .then((response: GroupListInterface | any) => {
                setPrimaryGroups(response.data.Resources as GroupsInterface[]);
            });
        setIsLoadingAssignedGroups(false);
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
     * The following function remove already assigned groups from the initial groups.
     */
    const removeExistingRoles = () => {
        const groupListCopy: GroupsInterface[] = primaryGroups ? [ ...primaryGroups ] : [];

        const addedGroups: GroupsInterface[] = [];

        if (groupListCopy && primaryGroupsList) {
            const primaryGroupValues: string[] = Array.from(primaryGroupsList?.values());

            forEach(groupListCopy, (group: GroupsInterface) => {
                if (primaryGroupValues.includes(group?.id)) {
                    addedGroups.push(group);
                }
            });
        }
        setTempGroupList(addedGroups);
        setInitialTempGroupList(addedGroups);
        setGroupList(groupListCopy.filter((group: GroupsInterface) => !addedGroups?.includes(group)));
        setInitialGroupList(groupListCopy.filter((group: GroupsInterface) => !addedGroups?.includes(group)));
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
    const handleUnassignedItemCheckboxChange = (group: GroupsInterface) => {
        const checkedGroups:GroupsInterface[] = [ ...checkedUnassignedListItems ];

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
     * @param group - The role that's changed
     */
    const handleAssignedItemCheckboxChange = (group: GroupsInterface) => {
        const checkedGroups: GroupsInterface[] = [ ...checkedAssignedListItems ];

        if (checkedGroups?.includes(group)) {
            checkedGroups.splice(checkedGroups.indexOf(group), 1);
            setCheckedAssignedListItems(checkedGroups);
        } else {
            checkedGroups.push(group);
            setCheckedAssignedListItems(checkedGroups);
        }
    };

    const addGroups = () => {
        const addedRoles: GroupsInterface[]  = [ ...tempGroupList ];

        if (checkedUnassignedListItems?.length > 0) {
            checkedUnassignedListItems.map((group: GroupsInterface) => {
                if (!(tempGroupList?.includes(group))) {
                    addedRoles.push(group);
                }
            });
        }
        setTempGroupList(addedRoles);
        setInitialTempGroupList(addedRoles);
        setGroupList(groupList.filter((group: GroupsInterface) => !addedRoles?.includes(group)));
        setInitialGroupList(groupList.filter((group: GroupsInterface) => !addedRoles?.includes(group)));
        setCheckedAssignedListItems([]);
        setIsSelectUnassignedAllRolesChecked(false);
    };

    const removeGroups = () => {
        const removedRoles: GroupsInterface[] = [ ...groupList ];

        if (checkedAssignedListItems?.length > 0) {
            checkedAssignedListItems.map((group: GroupsInterface) => {
                if (!(groupList?.includes(group))) {
                    removedRoles.push(group);
                }
            });
        }
        setGroupList(removedRoles);
        setInitialGroupList(removedRoles);
        setTempGroupList(tempGroupList?.filter((group: GroupsInterface) => !removedRoles?.includes(group)));
        setInitialTempGroupList(tempGroupList?.filter((group: GroupsInterface) => !removedRoles?.includes(group)));
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

    const handleUnselectedListSearch = (_e: FormEvent<HTMLInputElement>, { value }: { value: string; }) => {
        let isMatch: boolean = false;
        const filteredGroupList: GroupsInterface[] = [];

        if (!isEmpty(value)) {
            const groupListFilterRegExp: RegExp = new RegExp(escapeRegExp(value), "i");

            groupList && groupList.map((group: GroupsInterface) => {
                isMatch = groupListFilterRegExp.test(group.displayName);
                if (isMatch) {
                    filteredGroupList.push(group);
                    setGroupList(filteredGroupList);
                }
            });
        } else {
            setGroupList(initialGroupList);
        }
    };

    const handleSelectedListSearch = (_e: FormEvent<HTMLInputElement>, { value }: { value: string; }) => {
        let isMatch: boolean = false;
        const filteredGroupList: GroupsInterface[] = [];

        if (!isEmpty(value)) {
            const groupListFilterRegExp: RegExp = new RegExp(escapeRegExp(value), "i");

            tempGroupList && tempGroupList?.map((group: GroupsInterface) => {
                isMatch = groupListFilterRegExp.test(group.displayName);
                if (isMatch) {
                    filteredGroupList.push(group);
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
    const updateRoleGroup = (role: RolesInterface, groups: GroupsInterface[]) => {
        const groupIds: string[] = groups.map((group: GroupsInterface) => group.id);

        const roleData: PatchOrganizationRoleDataInterface = {
            operations: [ {
                "op": "REPLACE",
                "path": "groups",
                "value": groupIds
            } ]
        };

        setIsSubmitting(true);

        patchOrganizationRoleDetails(currentOrganization.id, role.id, roleData)
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
            })
        ;
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
                            groupList?.map((group: GroupsInterface, index: number)=> {
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
                            tempGroupList?.map((group: GroupsInterface, index: number)=> {
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

    const handleAssignedGroupListSearch = (_e: FormEvent<HTMLInputElement>, { value }: { value: string; }) => {
        let isMatch: boolean = false;
        const filteredGroupList: RoleGroupsInterface[] = [];

        if (!isEmpty(value)) {
            const groupListFilterRegExp: RegExp = new RegExp(escapeRegExp(value), "i");

            assignedGroups && assignedGroups?.map((group: RoleGroupsInterface) => {
                const groupName: string[] = group.display.split("/");

                if (groupName.length === 1) {
                    isMatch = groupListFilterRegExp.test(group.display);
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
        <EmphasizedSegment padded="very">
            <Heading as="h4">
                { t("roles:edit.groups.heading") }
                <Heading subHeading ellipsis as="h6">
                    { t("roles:edit.groups.subHeading") }
                </Heading>
            </Heading>
            <Divider hidden />
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 16 }>
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
                                !isLoadingAssignedGroups
                                    ? (
                                        <EmphasizedSegment>
                                            <EmptyPlaceholder
                                                data-testid="role-mgt-empty-groups-list"
                                                title={ t("roles:edit.groups.placeholders." +
                                                        "emptyPlaceholder.title") }
                                                subtitle={ [
                                                    t("roles:edit.groups.placeholders." +
                                                            "emptyPlaceholder.subtitles.0")
                                                ] }
                                                action={
                                                    !isReadOnly && (
                                                        <PrimaryButton
                                                            data-testid="role-mgt-empty-groups-list-assign-group-button"
                                                            icon="plus"
                                                            onClick={ handleOpenAddNewGroupModal }
                                                        >
                                                            { t("roles:edit.groups." +
                                                                    "placeholders.emptyPlaceholder.action") }
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
            </Grid>
            { addNewGroupModal() }
        </EmphasizedSegment>
    );
};
