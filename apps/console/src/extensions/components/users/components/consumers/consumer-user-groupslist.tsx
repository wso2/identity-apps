/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
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
    EmptyPlaceholder, GenericIcon,
    Heading,
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
    Modal,
    Segment,
    Table
} from "semantic-ui-react";
import {
    getEmptyPlaceholderIllustrations,
    getSidePanelIcons,
    updateResources
} from "../../../../../features/core";
import { getGroupList } from "../../../../../features/groups";
import { APPLICATION_DOMAIN, INTERNAL_DOMAIN } from "../../../../../features/roles";
import { CONSUMER_USERSTORE } from "../../../../../features/userstores";

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
}

export const ConsumerUserGroupsList: FunctionComponent<ConsumerUserGroupsPropsInterface> = (
    props: ConsumerUserGroupsPropsInterface
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
    const [ , setIsSelectAllGroupsChecked ] = useState(false);
    const [ assignedGroups, setAssignedGroups ] = useState<RolesMemberInterface[]>([]);
    const [ isPrimaryGroupsLoading, setPrimaryGroupsLoading ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

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
        setPrimaryGroupsLoading(true);
        getGroupList(CONSUMER_USERSTORE)
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
        let displayName = null;
        const filteredGroupList = [];

        if (!isEmpty(value)) {
            const re = new RegExp(escapeRegExp(value), "i");

            initialGroupList && initialGroupList.map((role) => {
                displayName = role.displayName.includes(`${CONSUMER_USERSTORE}/`) 
                    ? role.displayName.split(`${CONSUMER_USERSTORE}/`)[1]
                    : role.displayName;
                isMatch = re.test(displayName);
                if (isMatch) {
                    filteredGroupList.push(role);
                }
            });

            setGroupList(filteredGroupList);
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
                addOperation = {
                    ...addOperation,
                    ...{ path: "/Groups/" + id }
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
                                            listItemTypeLabel={ null }
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
                const groupName = group?.display?.split("/")[1];
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
                    assignedGroups?.map((group, index: number) => {
                        const userGroup = group?.display?.split("/");

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
                { t("console:manage.features.user.updateUser.groups.editGroups.heading") }
            </Heading>
            <Heading subHeading ellipsis as="h6">
                { t("console:manage.features.user.updateUser.groups.editGroups.subHeading") }
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
                                                placeholder={ t("console:manage.features.user.updateUser.groups." +
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
                                                            { t("console:manage.features.user.updateUser.groups." +
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
                                        title={ t("console:manage.features.user.updateUser.groups.editGroups." +
                                            "groupList.emptyListPlaceholder.title") }
                                        subtitle={ [
                                            t("console:manage.features.user.updateUser.groups.editGroups." +
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
