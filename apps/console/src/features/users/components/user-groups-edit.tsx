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
    AlertInterface,
    AlertLevels,
    ProfileInfoInterface,
    RolesMemberInterface
} from "@wso2is/core/models";
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
    TransferListItem
} from "@wso2is/react-components";
import escapeRegExp from "lodash-es/escapeRegExp";
import forEachRight from "lodash-es/forEachRight";
import isEmpty from "lodash-es/isEmpty";
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
    Table
} from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations, updateResources } from "../../core";
import { getGroupList } from "../../groups/api";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN, PRIMARY_DOMAIN } from "../../roles/constants";

interface UserGroupsPropsInterface {
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
}

export const UserGroupsList: FunctionComponent<UserGroupsPropsInterface> = (
    props: UserGroupsPropsInterface
): ReactElement => {

    const {
        onAlertFired,
        user,
        handleUserUpdate,
        isReadOnly
    } = props;

    const { t } = useTranslation();

    const [ showAddNewRoleModal, setAddNewRoleModalView ] = useState(false);
    const [ groupList, setGroupList ] = useState<any>([]);
    const [ selectedGroupsList, setSelectedGroupList ] = useState([]);
    const [ initialGroupList, setInitialGroupList ] = useState([]);
    const [ primaryGroups, setPrimaryGroups ] = useState(undefined);
    const [ primaryGroupsList, setPrimaryGroupsList ] = useState<Map<string, string>>(undefined);
    const [ isSelectAllGroupsChecked, setIsSelectAllGroupsChecked ] = useState(false);
    const [ assignedGroups, setAssignedGroups ] = useState<RolesMemberInterface[]>([]);
    const [ isPrimaryGroupsLoading, setPrimaryGroupsLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ oldGroupLis, setOldGroupList ] = useState([]);

    useEffect(() => {
        if (!(user)) {
            return;
        }
        mapUserGroups();
        setAssignedGroups(user.groups);
    }, []);

    /**
     * The following useEffect will be triggered when the
     * roles are updated.
     */
    useEffect(() => {
        if (!(user)) {
            return;
        }
        mapUserGroups();
        setAssignedGroups(user.groups);
    }, [ user ]);

    useEffect(() => {
        if (!(user.groups)) {
            return;
        }
        setInitialLists();
    }, [ user.groups && primaryGroups ]);

    useEffect(() => {
        let domain = "Primary";
        const domainName: string[] = user?.userName?.split("/");

        if (domainName.length > 1) {
            domain = domainName[0];
        }
        setPrimaryGroupsLoading(true);
        getGroupList(domain)
            .then((response) => {
                setPrimaryGroups(response.data.Resources);
            })
            .finally(() => {
                setPrimaryGroupsLoading(false);
            });
    }, []);

    const mapUserGroups = () => {
        const groupsMap = new Map<string, string> ();

        if (user.groups && user.groups instanceof Array) {
            forEachRight (user.groups, (group) => {
                const groupName = group?.display?.split("/");

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
     * The following function enables the user to select all the roles at once.
     */
    const selectAllGroups = () => {
        if (!isSelectAllGroupsChecked) {
            setSelectedGroupList(groupList);
        } else {
            setSelectedGroupList([]);
        }
        setIsSelectAllGroupsChecked(!isSelectAllGroupsChecked);
    };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (group) => {
        const checkedGroups = [ ...selectedGroupsList ];

        if (checkedGroups?.includes(group)) {
            checkedGroups.splice(checkedGroups.indexOf(group), 1);
            setSelectedGroupList(checkedGroups);
        } else {
            checkedGroups.push(group);
            setSelectedGroupList(checkedGroups);
        }
        setIsSelectAllGroupsChecked(checkedGroups.length === groupList.length);
    };

    const setInitialLists = () => {
        const groupListCopy = primaryGroups ? [ ...primaryGroups ] : [];
        const addedGroups = [];
        forEachRight(groupListCopy, (group) => {
            if (primaryGroupsList?.has(group.displayName)) {
                addedGroups.push(group);
            }
        });
        setSelectedGroupList(addedGroups);
        setOldGroupList(addedGroups);
        setGroupList(groupListCopy);
        setInitialGroupList(groupListCopy);
        setIsSelectAllGroupsChecked(groupListCopy.length === addedGroups.length);
    };

    const handleOpenAddNewGroupModal = () => {
        setInitialLists();
        setAddNewRoleModalView(true);
    };

    const handleCloseAddNewGroupModal = () => {
        setIsSelectAllGroupsChecked(false);
        setAddNewRoleModalView(false);
    };

    const handleUnselectedListSearch = (e, { value }) => {
        let isMatch = false;
        const filteredGroupList = [];

        if (!isEmpty(value)) {
            const re = new RegExp(escapeRegExp(value), "i");

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

        const bulkData: any = {
            Operations: [],
            schemas: ["urn:ietf:params:scim:api:messages:2.0:BulkRequest"]
        };

        let removeOperation = {
            data: {
                "Operations": [{
                    "op": "remove",
                    "path": "members[display eq" + " " + user.userName + "]"
                }]
            },
            method: "PATCH"
        };

        let addOperation = {
            data: {
                "Operations": [{
                    "op": "add",
                    "value": {
                        "members": [{
                            "display": user.userName,
                            "value": user.id
                        }]
                    }
                }]
            },
            method: "PATCH"
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
                bulkData.Operations.push(operation);
            });
        }

        if (groupIds && groupIds?.length > 0) {
            groupIds.map((id) => {
                if (!oldGroupLis.find(oldGroup => oldGroup.id === id)) {
                    addOperation = {
                        ...addOperation,
                        ...{ path: "/Groups/" + id }
                    };
                    addOperations.push(addOperation);
                }
            });

            addOperations.map((operation) => {
                bulkData.Operations.push(operation);
            });
        }

        setIsSubmitting(true);

        updateResources(bulkData)
            .then(() => {
                onAlertFired({
                    description: t(
                        "console:manage.features.user.updateUser.groups.notifications.updateUserGroups." +
                        "success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "console:manage.features.user.updateUser.groups.notifications.updateUserGroups." +
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
                            "console:manage.features.user.updateUser.groups.notifications.updateUserGroups." +
                            "error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "console:manage.features.user.updateUser.groups.notifications.updateUserGroups." +
                        "genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "console:manage.features.user.updateUser.groups.notifications.updateUserGroups." +
                        "genericError.message"
                    )
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    const resolveListItemLabel = (displayName: string): ItemTypeLabelPropsInterface => {
        const userGroup = displayName?.split("/");

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
        const userGroup = displayName?.split("/");

        if (userGroup?.length !== 1) {
            displayName = userGroup[1];
        }

        return displayName;
    };

    const addNewGroupModal = () => (
        <Modal
            data-testid="user-mgt-update-groups-modal"
            open={ showAddNewRoleModal }
            size="small"
            className="user-roles"
        >
            <Modal.Header>
                { t("console:manage.features.user.updateUser.groups.addGroupsModal.heading") }
                <Heading subHeading ellipsis as="h6">
                    { t("console:manage.features.user.updateUser.groups.addGroupsModal.subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content image>
                { !isPrimaryGroupsLoading ? (
                    <TransferComponent
                        selectionComponent
                        searchPlaceholder={ t("console:manage.features.transferList.searchPlaceholder",
                            { type: "Groups" }) }
                        handleUnelectedListSearch={ handleUnselectedListSearch }
                        data-testid="user-mgt-update-groups-modal"
                    >
                        <TransferList
                            isListEmpty={ !(groupList.length > 0) }
                            listType="unselected"
                            listHeaders={ [
                                t("console:manage.features.transferList.list.headers.0"),
                                t("console:manage.features.transferList.list.headers.1")
                            ] }
                            handleHeaderCheckboxChange={ selectAllGroups }
                            isHeaderCheckboxChecked={ isSelectAllGroupsChecked }
                            emptyPlaceholderContent={ t("console:manage.features.transferList.list." +
                                    "emptyPlaceholders.users.roles.unselected", { type: "groups" }) }
                            data-testid="user-mgt-update-groups-modal-unselected-groups-select-all-checkbox"
                            emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                                + "emptyPlaceholders.default") }
                        >
                            {
                                groupList?.map((group, index)=> {
                                    return (
                                        <TransferListItem
                                            handleItemChange={
                                                () => handleUnassignedItemCheckboxChange(group)
                                            }
                                            key={ index }
                                            listItem={ resolveListItem(group?.displayName) }
                                            listItemId={ group?.id }
                                            listItemIndex={ index }
                                            listItemTypeLabel={ resolveListItemLabel(group?.displayName) }
                                            isItemChecked={ selectedGroupsList.includes(group) }
                                            showSecondaryActions={ false }
                                            data-testid="user-mgt-update-groups-modal-unselected-groups"
                                        />
                                    );
                                })
                            }
                        </TransferList>
                    </TransferComponent>
                ) : <ContentLoader/> }
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
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                                onClick={ () => updateUserGroup(user, selectedGroupsList) }
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

        if (!isEmpty(value)) {
            const re = new RegExp(escapeRegExp(value), "i");

            assignedGroups && assignedGroups?.map((group) => {
                const groupName = group?.display?.split("/");
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

    const resolveTableContent = (): ReactElement => {
        return (
            <Table.Body>
                {
                    assignedGroups?.map((group, index: number) => {
                        const userGroup = group?.display?.split("/");

                        if (userGroup[0] !== APPLICATION_DOMAIN &&
                            userGroup[0] !== INTERNAL_DOMAIN) {
                            return (
                                <Table.Row key={ index }>
                                    <Table.Cell>
                                        {
                                            userGroup?.length === 1
                                                ? <Label color="olive">
                                                    { PRIMARY_DOMAIN }
                                                </Label>
                                                : <Label color="olive">
                                                    { userGroup[0] }
                                                </Label>
                                        }
                                    </Table.Cell>
                                    <Table.Cell>
                                        {
                                            userGroup?.length === 1
                                                ? group?.display
                                                : userGroup[1]
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
                { t("console:manage.features.user.updateUser.groups.editGroups.heading") }
            </Heading>
            <Heading subHeading ellipsis as="h6">
                { t("console:manage.features.user.updateUser.groups.editGroups.subHeading") }
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
                                                placeholder={ t("console:manage.features.user.updateUser.groups." +
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
                                                            { t("console:manage.features.user.updateUser.groups." +
                                                                "editGroups.groupList.headers.0") }
                                                        </strong>
                                                    </Table.HeaderCell>
                                                    <Table.HeaderCell>
                                                        <strong>
                                                            { t("console:manage.features.user.updateUser.groups." +
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
                                        data-testid="user-mgt-empty-groups-list"
                                        title={ t("console:manage.features.user.updateUser.groups.editGroups." +
                                            "groupList.emptyListPlaceholder.title") }
                                        subtitle={ [
                                            t("console:manage.features.user.updateUser.groups.editGroups." +
                                                    "groupList.emptyListPlaceholder.subTitle.0"),
                                            t("console:manage.features.user.updateUser.groups.editGroups." +
                                                "groupList.emptyListPlaceholder.subTitle.1"),
                                            t("console:manage.features.user.updateUser.groups.editGroups." +
                                                "groupList.emptyListPlaceholder.subTitle.2")
                                        ] }
                                        action={
                                            !isReadOnly && (
                                                <PrimaryButton
                                                    data-testid="user-mgt-empty-groups-list-assign-group-button"
                                                    onClick={ handleOpenAddNewGroupModal }
                                                >
                                                    <Icon name="plus"/>
                                                    Assign Group
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
