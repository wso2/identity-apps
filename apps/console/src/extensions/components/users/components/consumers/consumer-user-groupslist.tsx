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
    AlertInterface,
    AlertLevels,
    ProfileInfoInterface,
    RolesMemberInterface
} from "@wso2is/core/models";
import {
    EmphasizedSegment,
    EmptyPlaceholder, GenericIcon,
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem
} from "@wso2is/react-components";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import escapeRegExp from "lodash-es/escapeRegExp";
import forEachRight from "lodash-es/forEachRight";
import isEmpty from "lodash-es/isEmpty";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Button,
    Divider,
    Grid,
    Icon,
    Input,
    Modal,
    Segment,
    Table
} from "semantic-ui-react";
import {
    getEmptyPlaceholderIllustrations,
    getSidePanelIcons,
    updateResources
} from "../../../../../features/core";
import { 
    GroupsInterface, 
    GroupsMemberInterface, 
    SearchGroupInterface, 
    searchGroupList 
} from "../../../../../features/groups";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN } from "../../../../../features/roles/constants/role-constants";
import { UsersConstants } from "../../constants";

interface ConsumerUserGroupsPropsInterface {
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
     * Primary groups in the organization.
     */
    primaryGroups: GroupsInterface[];
}

export const ConsumerUserGroupsList: FunctionComponent<ConsumerUserGroupsPropsInterface> = (
    props: ConsumerUserGroupsPropsInterface
): ReactElement => {

    const {
        onAlertFired,
        user,
        handleUserUpdate,
        isReadOnly,
        primaryGroups
    } = props;

    const { t } = useTranslation();

    const [ showAddNewRoleModal, setAddNewRoleModalView ] = useState(false);
    const [ groupList, setGroupList ] = useState<GroupsInterface[]>([]);
    const [ selectedGroupsList, setSelectedGroupsList ] = useState<GroupsInterface[]>(undefined);
    const [ primaryGroupsList, setPrimaryGroupsList ] = useState<Map<string, GroupsInterface>>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isGroupFilterLoading, setGroupFilterLoading ] = useState<boolean>(false);
    const [ groupSearchQuery, setGroupSearchQuery ] = useState<string>(undefined);
    const [ , setIsSelectAllGroupsChecked ] = useState(false);
    const [ assignedGroups, setAssignedGroups ] = useState<RolesMemberInterface[]>([]);

    /**
     * The following useEffect will be triggered when the
     * roles are updated.
     */
    useEffect(() => {
        if (user) {
            mapUserGroups();
            setAssignedGroups(user.groups);
        }
    }, [ user ]);

    useEffect(() => {
        if (primaryGroupsList) {
            setInitialLists();
        }
    }, [ primaryGroupsList, primaryGroups ]);

    useEffect(() => {
        if (groupSearchQuery) {
            filterGroups(groupSearchQuery);
        } else {
            setInitialLists();
        }
    }, [ groupSearchQuery ]);

    /**
     * Filter the groups by the search query.
     * 
     * @param query - Search query
     */
    const filterGroups = (query: string) => {
        if(query) {
            setGroupFilterLoading(true);

            const searchData: SearchGroupInterface = {
                filter: `displayName co ${query}`,
                schemas: [
                    "urn:ietf:params:scim:api:messages:2.0:SearchRequest"
                ],
                startIndex: 1
            };

            searchGroupList(searchData)
                .then((response: AxiosResponse) => {
                    setGroupLists(response.data.Resources);
                }).catch(() => {
                    setGroupLists([]);
                }).finally(() => {
                    setGroupFilterLoading(false);
                });
        }
    };

    const mapUserGroups = () => {
        const groupsMap: Map<string, GroupsInterface> = new Map<string, GroupsInterface> ();

        if (user.groups && user.groups instanceof Array) {

            forEachRight (user.groups, (group: GroupsMemberInterface) => {
                const groupName: string[] = group?.display?.split("/");

                if (groupName[0] !== APPLICATION_DOMAIN && groupName[0] !== INTERNAL_DOMAIN) {
                    const groupObject: GroupsInterface = {
                        displayName: group.display,
                        id: group.value
                    };

                    groupsMap.set(group.display, groupObject);
                }
            });
            setPrimaryGroupsList(groupsMap);
        } else {
            setPrimaryGroupsList(undefined);
        }
    };

    // Commented to temporarily remove the Select All option in group selection.
    // Uncomment when the Select All option needs to be re-enabled.
    // /**
    //  * The following function enables the user to select all the roles at once.
    //  */
    // const selectAllGroups = () => {
    //     if (!isSelectAllGroupsChecked) {
    //         setSelectedGroupList(groupList);
    //     } else {
    //         setSelectedGroupList([]);
    //     }
    //     setIsSelectAllGroupsChecked(!isSelectAllGroupsChecked);
    // };

    /**
     * The following method handles the onChange event of the
     * checkbox field of an unassigned item.
     */
    const handleUnassignedItemCheckboxChange = (group: GroupsInterface) => {
        const checkedGroups: GroupsInterface[] = selectedGroupsList ? [ ...selectedGroupsList ] : [];
        const groupIndex: number = checkedGroups.findIndex(
            (selectedGroup: GroupsInterface) => selectedGroup.id === group.id);

        if (groupIndex !== -1) {
            checkedGroups.splice(groupIndex, 1);
        } else {
            checkedGroups.push(group);
        }
        setSelectedGroupsList(checkedGroups);
        setIsSelectAllGroupsChecked(checkedGroups.length === groupList.length);
    };

    /**
     * Set the initial group lists and set the group lists when the query is empty.
     */
    const setInitialLists = () => {
        const selectedGroups: GroupsInterface[] = selectedGroupsList || 
            (primaryGroupsList ? Array.from(primaryGroupsList.values()) : null);

        let uniqueGroups: GroupsInterface[];

        if (selectedGroups) {
            uniqueGroups = primaryGroups.filter(
                (group: GroupsInterface) => !selectedGroups?.some(
                    (selectedGroup: GroupsInterface) => selectedGroup.id === group.id));
            setGroupLists([ ...selectedGroups, ...uniqueGroups ]);
        } else {
            uniqueGroups = primaryGroups;
            setGroupLists(uniqueGroups);
        }

        setSelectedGroupsList(selectedGroups);
    };

    /**
     * Set the group list.
     * @param groupList - Group list
     */
    const setGroupLists = (groupList: GroupsInterface[]) => {
        setGroupList(groupList ? groupList : []);
    };

    const handleOpenAddNewGroupModal = () => {
        setInitialLists();
        setAddNewRoleModalView(true);
    };

    const handleCloseAddNewGroupModal = () => {
        setIsSelectAllGroupsChecked(false);
        setAddNewRoleModalView(false);
    };

    /**
     * The following function handles the search query for the groups list.
     */
    const searchGroups: DebouncedFunc<(query: string) => void> = 
        useCallback(debounce((query: string) => {
            query = !isEmpty(query) ? query : null;
            setGroupSearchQuery(query);
        }, UsersConstants.DEBOUNCE_TIMEOUT), []);

    /**
     * This function handles assigning the roles to the user.
     *
     * @param user - User object
     * @param groups - Assigned groups
     */
    const updateUserGroup = (user: ProfileInfoInterface, groups: GroupsInterface[]) => {
        const groupIds: string[] = groups.map((group: GroupsInterface) => group.id);

        const bulkData: any = {
            Operations: [],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:BulkRequest" ]
        };

        let removeOperation: AxiosRequestConfig = {
            data: {
                "Operations": [ {
                    "op": "remove",
                    "path": "members[display eq" + " " + user.userName + "]"
                } ]
            },
            method: "PATCH"
        };

        let addOperation: AxiosRequestConfig = {
            data: {
                "Operations": [ {
                    "op": "add",
                    "value": {
                        "members": [ {
                            "display": user.userName,
                            "value": user.id
                        } ]
                    }
                } ]
            },
            method: "PATCH"
        };

        const removeOperations: AxiosRequestConfig[] = [];
        const addOperations: AxiosRequestConfig[] = [];
        let removedIds: string[] = [];

        if (primaryGroupsList) {
            removedIds = Array.from(primaryGroupsList.values()).map((group: GroupsInterface) => group.id);
        }

        if (groupIds?.length > 0) {
            groupIds.map((groupId: string) => {
                if (removedIds?.includes(groupId)) {
                    removedIds.splice(removedIds.indexOf(groupId), 1);
                }
            });
        }

        if (removedIds && removedIds.length > 0) {
            removedIds.map((id: string) => {
                removeOperation = {
                    ...removeOperation,
                    ...{ path: "/Groups/" + id }
                };
                removeOperations.push(removeOperation);
            });

            removeOperations.map((operation: AxiosRequestConfig) => {
                bulkData.Operations.push(operation);
            });
        }

        if (groupIds?.length > 0) {
            groupIds.map((id: string) => {
                if (!assignedGroups?.some((group: RolesMemberInterface)=> group.value === id)) {
                    addOperation = {
                        ...addOperation,
                        ...{ path: "/Groups/" + id }
                    };
                    addOperations.push(addOperation);
                }
            });

            addOperations.length > 0 && addOperations.map((operation: AxiosRequestConfig) => {
                bulkData.Operations.push(operation);
            });
        }

        setIsSubmitting(true);

        updateResources(bulkData)
            .then(() => {
                onAlertFired({
                    description: t(
                        "user:updateUser.groups.notifications.updateUserGroups." +
                        "success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "user:updateUser.groups.notifications.updateUserGroups." +
                        "success.message"
                    )
                });
                handleCloseAddNewGroupModal();
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
                            "user:updateUser.groups.notifications.updateUserGroups." +
                            "error.message"
                        )
                    });

                    return;
                }

                onAlertFired({
                    description: t(
                        "user:updateUser.groups.notifications.updateUserGroups." +
                        "genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "user:updateUser.groups.notifications.updateUserGroups." +
                        "genericError.message"
                    )
                });
            })
            .finally(() => {
                setIsSubmitting(false);
            });
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
            data-testid="user-mgt-update-groups-modal"
            open={ showAddNewRoleModal }
            size="small"
            className="user-roles"
        >
            <Modal.Header>
                { t("user:updateUser.groups.addGroupsModal.heading") }
                <Heading subHeading ellipsis as="h6">
                    { t("user:updateUser.groups.addGroupsModal.subHeading") }
                </Heading>
            </Modal.Header>
            <Modal.Content image>
                <TransferComponent
                    selectionComponent
                    searchPlaceholder={ t("transferList:searchPlaceholder",
                        { type: "Groups" }) }
                    handleUnelectedListSearch={ 
                        (e: React.FormEvent<HTMLInputElement>, { value }: { value: string; }) =>  searchGroups(value)
                    }
                    isLoading={ isGroupFilterLoading }
                    data-testid="user-mgt-update-groups-modal"
                >
                    <TransferList
                        isListEmpty={ !(groupList.length > 0) }
                        listType="unselected"
                        emptyPlaceholderContent={ t("transferList:list." +
                            "emptyPlaceholders.users.roles.unselected", { type: "groups" }) }
                        data-testid="user-mgt-update-groups-modal-unselected-groups-select-all-checkbox"
                        emptyPlaceholderDefaultContent={ t("transferList:list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            groupList?.map((group: GroupsInterface, index: number)=> (
                                <TransferListItem
                                    handleItemChange={
                                        () => handleUnassignedItemCheckboxChange(group)
                                    }
                                    key={ index }
                                    listItem={ resolveListItem(group?.displayName) }
                                    listItemId={ group?.id }
                                    listItemIndex={ index }
                                    listItemTypeLabel={ null }
                                    isItemChecked={ selectedGroupsList?.some(
                                        (selectedGroup: GroupsInterface) => group.id === selectedGroup.id) 
                                    }
                                    showSecondaryActions={ false }
                                    data-testid="user-mgt-update-groups-modal-unselected-groups"
                                />
                            ))
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

    const handleAssignedGroupListSearch = (e: React.ChangeEvent<HTMLInputElement>, { value }: { value: string }) => {
        let isMatch: boolean = false;
        const filteredGroupList: RolesMemberInterface[] = [];

        if (!isEmpty(value)) {
            const re: RegExp = new RegExp(escapeRegExp(value), "i");

            assignedGroups && assignedGroups?.map((group: RolesMemberInterface) => {
                const groupName: string = group?.display?.split("/")[1];

                isMatch = re.test(groupName);
                if (isMatch) {
                    filteredGroupList.push(group);
                    setAssignedGroups(filteredGroupList);
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
                    assignedGroups?.map((group: RolesMemberInterface, index: number) => {
                        const userGroup: string[] = group?.display?.split("/");

                        if (userGroup[0] !== APPLICATION_DOMAIN &&
                            userGroup[0] !== INTERNAL_DOMAIN) {
                            return (
                                <Table.Row key={ index } >
                                    <Table.Cell width={ 1 }>
                                        <GenericIcon
                                            bordered
                                            size={ "micro" }
                                            hoverable={ true }
                                            hoverType="circular"
                                            transparent={ true }
                                            icon={ getSidePanelIcons().groups }
                                        />
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
        <EmphasizedSegment padded="very">
            <Heading as="h4">
                { t("user:updateUser.groups.editGroups.heading") }
            </Heading>
            <Heading subHeading ellipsis as="h6">
                { t("user:updateUser.groups.editGroups.subHeading") }
            </Heading>
            <Divider hidden/>
            <Grid padded>
                <Grid.Row>
                    <Grid.Column computer={ 10 } tablet={ 16 } mobile={ 16 }>
                        {
                            primaryGroupsList?.size > 0 ? (
                                <Segment
                                    data-testid="user-mgt-groups-list"
                                    className="user-role-edit-header-segment"
                                >
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Input
                                                data-testid="user-mgt-groups-list-search-input"
                                                icon={ <Icon name="search"/> }
                                                onChange={ handleAssignedGroupListSearch }
                                                placeholder={ t("user:updateUser.groups." +
                                                    "editGroups.searchPlaceholder") }
                                                floated="left"
                                                size="small"
                                            />
                                            {
                                                !isReadOnly &&
                                                    (
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
                                                    <Table.HeaderCell/>
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
                                </Segment>
                            ) : (
                                <Segment>
                                    <EmptyPlaceholder
                                        data-testid="user-mgt-empty-groups-list"
                                        title={ t("user:updateUser.groups.editGroups." +
                                            "groupList.emptyListPlaceholder.title") }
                                        subtitle={ [
                                            t("user:updateUser.groups.editGroups." +
                                                "groupList.emptyListPlaceholder.subTitle.0")
                                        ] }
                                        action={
                                            !isReadOnly &&
                                                (
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
                                </Segment>
                            )
                        }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            { addNewGroupModal() }
        </EmphasizedSegment>
    );
};
