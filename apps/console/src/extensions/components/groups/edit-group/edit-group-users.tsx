/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import {
    AlertLevels,
    LoadableComponentInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Button, Code, ContentLoader,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    LinkButton,
    PrimaryButton,
    TransferComponent,
    TransferList,
    TransferListItem,
    UserAvatar,
    useWizardAlert
} from "@wso2is/react-components";
import escapeRegExp from "lodash-es/escapeRegExp";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Dispatch,
    FormEvent,
    FunctionComponent,
    ReactElement,
    SetStateAction,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Divider, Grid, Header, Icon, Input, Modal, Table } from "semantic-ui-react";
import { getEmptyPlaceholderIllustrations } from "../../../../features/core";
import {
    CreateGroupMemberInterface,
    GroupsInterface,
    PatchGroupDataInterface,
    updateGroupDetails
} from "../../../../features/groups";
import { UserBasicInterface, getUsersList } from "../../../../features/users";
import { SCIMConfigs } from "../../../configs/scim";
import { UserManagementUtils } from "../../users/utils";

/**
 * Proptypes for the group users list component.
 */
interface GroupUsersListProps extends TestableComponentInterface, LoadableComponentInterface {
    group: GroupsInterface;
    isGroup: boolean;
    isReadOnly?: boolean;
    onGroupUpdate: (groupId: string) => void;
    isGroupDetailsRequestLoading: boolean;
}

export const GroupUsersList: FunctionComponent<GroupUsersListProps> = (props: GroupUsersListProps): ReactElement => {
    const {
        isReadOnly,
        group,
        onGroupUpdate,
        isGroupDetailsRequestLoading,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const [ originalUserList, setOriginalUserList ] = useState<UserBasicInterface[]>([]);
    const [ selectedUserList, setSelectedUserList ] = useState<UserBasicInterface[]>([]);
    const [ addModalUserList, setAddModalUserList ] = useState<UserBasicInterface[]>([]);
    const [ , setIsSelectAllUsers ] = useState<boolean>(false);
    const [ newlySelectedUsers, setNewlySelectedUsers ] = useState<UserBasicInterface[]>([]);
    const [ showAddNewUserModal, setAddNewUserModalView ] = useState<boolean>(false);
    const [ selectedFilteredUserList, setSelectedFilteredUserList ] = useState<UserBasicInterface[]>([]);
    const [ isSelectedUsersFetchRequestLoading, setIsSelectedUsersFetchRequestLoading ] = useState<boolean>(true);
    const [ isUsersFetchRequestLoading, setIsUsersFetchRequestLoading ] = useState<boolean>(true);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {

        getSelectedUserList();
    }, [ group ]);

    /**
     * Get the users list.
     */
    const getUserList = (): Promise<void> => {

        const userstore: string = group?.displayName?.indexOf("/") === -1
            ? "primary"
            : group?.displayName?.split("/")[ 0 ];

        setIsUsersFetchRequestLoading(true);

        return getUsersList(null, null, null, null, userstore)
            .then((response) => {

                // Exclude JIT users.
                const moderatedUserList = response?.Resources?.filter(
                    (user) => !user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId);

                setOriginalUserList(moderatedUserList);
                setAddModalUserList(moderatedUserList);
            }).catch((error) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("console:manage.features.users.notifications.fetchUsers.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("console:manage.features.users.notifications.fetchUsers.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:manage.features.users.notifications.fetchUsers.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.fetchUsers.genericError.message")
                }));

                setOriginalUserList([]);
                setAddModalUserList([]);
            })
            .finally(() => {
                setIsUsersFetchRequestLoading(false);
            });
    };

    /**
     * Get the selected users list.
     */
    const getSelectedUserList = (): void => {

        const userstore: string = group?.displayName?.indexOf("/") === -1
            ? "primary"
            : group?.displayName?.split("/")[ 0 ];

        const query: string = "groups eq " + group?.displayName?.split("/")[ 1 ];

        setIsSelectedUsersFetchRequestLoading(true);

        getUsersList(null, null, query, null, userstore)
            .then((response) => {

                // Exclude JIT users.
                const moderatedUserList = response?.Resources?.filter(
                    (user) => !user[ SCIMConfigs.scim.enterpriseSchema ]?.userSourceId);

                setSelectedUserList(moderatedUserList);
                setSelectedFilteredUserList(moderatedUserList);
            }).catch((error) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                            ?? t("console:manage.features.users.notifications.fetchUsers.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                            ?? t("console:manage.features.users.notifications.fetchUsers.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("console:manage.features.users.notifications.fetchUsers.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.fetchUsers.genericError.message")
                }));

                setSelectedUserList([]);
                setSelectedFilteredUserList([]);
            })
            .finally(() => {
                setIsSelectedUsersFetchRequestLoading(false);
            });
    };

    // Commented to temporarily remove the Select All option in user selection.
    // Uncomment when the Select All option needs to be re-enabled.
    // /**
    //  * Select all assigned users
    //  */
    // const selectAllAssignedList = () => {
    //
    //     if (!isSelectAllUsers) {
    //         setNewlySelectedUsers(originalUserList);
    //     } else {
    //         setNewlySelectedUsers([]);
    //     }
    //
    //     setIsSelectAllUsers(!isSelectAllUsers);
    // };

    const handleSearchFieldChange = (e: FormEvent<HTMLInputElement>, query: string, list: UserBasicInterface[],
        stateAction: Dispatch<SetStateAction<any>>) => {

        let isMatch: boolean = false;
        const filteredRoleList: UserBasicInterface[] = [];

        if (!isEmpty(query)) {
            const regExp = new RegExp(escapeRegExp(query), "i");

            list && list.map((user: UserBasicInterface) => {
                isMatch = regExp.test(user.userName) || (user.name && regExp.test(user.name.givenName))
                    || (user.name && regExp.test(user.name.familyName));

                if (isMatch) {
                    filteredRoleList.push(user);
                }
            });

            stateAction(filteredRoleList);

            return;
        }

        stateAction(list);

        return;
    };

    const handleAssignedItemCheckboxChange = (user: UserBasicInterface) => {
        const checkedUsers: UserBasicInterface[] = !isEmpty(newlySelectedUsers)
            ? [ ...newlySelectedUsers ]
            : [];

        if (checkedUsers.some(checkedUser => checkedUser.id===user.id)) {
            checkedUsers.splice(checkedUsers.findIndex(checkedUser => checkedUser.id===user.id), 1);
            setNewlySelectedUsers(checkedUsers);
        } else {
            checkedUsers.push(user);
            setNewlySelectedUsers(checkedUsers);
        }

        setIsSelectAllUsers(addModalUserList?.length === checkedUsers?.length);
    };

    const handleOpenAddNewGroupModal = () => {
        getUserList()
            .then(() => {
                setNewlySelectedUsers(selectedUserList);
                setIsSelectAllUsers(selectedUserList?.length === originalUserList?.length);
                setAddNewUserModalView(true);
            }).catch(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.users.notifications.fetchUsers.genericError." +
                        "description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.users.notifications.fetchUsers.genericError.message")
                }));
            });
    };

    const handleCloseAddNewGroupModal = () => {
        setAddModalUserList(originalUserList);
        setNewlySelectedUsers([]);
        setIsSelectAllUsers(false);
        setAddNewUserModalView(false);
    };

    const handleAddUserSubmit = () => {
        updateGroupUsersList(newlySelectedUsers);
        setAddNewUserModalView(false);
    };

    const updateGroupUsersList = (selectedUsers: UserBasicInterface[]) => {
        const newUsers: CreateGroupMemberInterface[] = [];

        for (const selectedUser of selectedUsers) {
            newUsers.push({
                display: selectedUser.userName,
                value: selectedUser.id
            });
        }

        const groupData: PatchGroupDataInterface = {
            Operations: [ {
                "op": "replace",
                "value": {
                    "members": newUsers
                }
            } ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        setIsSubmitting(true);

        updateGroupDetails(group.id, groupData)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.groups.notifications.updateGroup.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.groups.notifications.updateGroup.success.message")
                }));
                onGroupUpdate(group.id);
            }).catch(() => {
                setAlert({
                    description: t("console:manage.features.groups.notifications.updateGroup.error.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.groups.notifications.updateGroup.error.message")
                });
            }).finally(() => {
                setIsSubmitting(false);
            });
    };

    const resolveListItemElement = (listItemValue: string) => {

        return (
            <div data-suppress="">
                { listItemValue }
            </div>
        );
    };

    const addNewUserModal = () => (
        <Modal
            data-testid={ `${ testId }-assign-user-wizard-modal` }
            dimmer="blurring"
            open={ showAddNewUserModal }
            size="small"
            className="user-roles"
        >
            <Modal.Header>
                {
                    t("console:manage.features.roles.addRoleWizard.users.assignUserModal.heading",
                        { type: "Group" })
                }
                <Heading subHeading ellipsis as="h6">
                    {
                        t("console:manage.features.roles.addRoleWizard.users.assignUserModal.subHeading",
                            { type: "group" })
                    }
                </Heading>
            </Modal.Header>
            <Modal.Content image>
                { alert && alertComponent }
                <TransferComponent
                    compact
                    basic
                    bordered
                    className="one-column-selection"
                    selectionComponent
                    searchPlaceholder={
                        t("console:manage.features.roles.addRoleWizard.users.assignUserModal.list" +
                            ".searchPlaceholder")
                    }
                    isLoading={ isUsersFetchRequestLoading }
                    // handleHeaderCheckboxChange={ selectAllAssignedList }
                    // isHeaderCheckboxChecked={ isSelectAllUsers }
                    handleUnelectedListSearch={ (e: FormEvent<HTMLInputElement>, { value }: { value: string }) => {
                        handleSearchFieldChange(e, value, originalUserList, setAddModalUserList);
                    } }
                    // showSelectAllCheckbox={ !isLoading && users?.length > 0 }
                    data-testid={ `${ testId }-user-list-transfer` }
                >
                    <TransferList
                        selectionComponent
                        isListEmpty={ !(originalUserList?.length > 0) }
                        isLoading={ isUsersFetchRequestLoading }
                        listType="unselected"
                        // selectAllCheckboxLabel={ "Select all users" }
                        data-testid={ `${ testId }-unselected-transfer-list` }
                        emptyPlaceholderContent={ t("console:manage.features.transferList.list.emptyPlaceholders." +
                            "groups.selected", { type: "users" }) }
                        emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            addModalUserList?.map((user: UserBasicInterface, index: number) => {
                                const header: string = UserManagementUtils.resolveUserListHeader(user);
                                const subHeader: string = UserManagementUtils.resolveUserListSubheader(user);

                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleAssignedItemCheckboxChange(user) }
                                        key={ index }
                                        listItem={ {
                                            listItemElement: resolveListItemElement(header),
                                            listItemValue: header
                                        } }
                                        listItemId={ user.id }
                                        listItemIndex={ index }
                                        isItemChecked={
                                            newlySelectedUsers && 
                                                newlySelectedUsers.some(newUser => newUser.id===user.id)
                                        }
                                        showSecondaryActions={ false }
                                        showListSubItem={ true }
                                        listSubItem={ header !== subHeader && (
                                            <Code compact withBackground={ false }>{ subHeader }</Code>
                                        ) }
                                        data-testid={ `${ testId }-unselected-transfer-list-item-${ index }` }
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
                                data-testid={ `${ testId }-assign-user-wizard-modal-cancel-button` }
                                onClick={ handleCloseAddNewGroupModal }
                                floated="left"
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton
                                data-testid={ `${ testId }-assign-user-wizard-modal-save-button` }
                                onClick={ () => {
                                    handleAddUserSubmit();
                                } }
                                floated="right"
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

    const renderUserTableRow = (user: UserBasicInterface): ReactElement => {

        const header: string = UserManagementUtils.resolveUserListHeader(user);
        const subHeader: string = UserManagementUtils.resolveUserListSubheader(user);
        const isNameAvailable = user.name?.familyName === undefined && user.name?.givenName === undefined;

        return (
            <Table.Row key={ user.id }>
                <Table.Cell>
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-testid={ `${ testId }-item-heading` }
                    >
                        <UserAvatar
                            data-testid={
                                `${ testId }-users-list-${
                                    user.userName }-avatar`
                            }
                            name={ header }
                            spaced="right"
                            size="mini"
                            floated="left"
                            image={ user.profileUrl }
                            data-suppress=""
                        />
                        <Header.Content>
                            <div className={ isNameAvailable ? "mt-2" : "" } data-suppress="">{ header }</div>
                            {
                                (!isNameAvailable) &&
                                    (
                                        <Header.Subheader
                                            data-testid={ `${ testId }-item-sub-heading` }
                                        >
                                            { subHeader }
                                        </Header.Subheader>
                            ) }
                        </Header.Content>
                    </Header>
                </Table.Cell>
            </Table.Row>
        );
    };

    return (
        <EmphasizedSegment padded="very">
            <Heading as="h4">{ t("extensions:manage.groups.edit.users.heading") }</Heading>
            <Heading subHeading ellipsis as="h6">
                { t("extensions:manage.groups.edit.users.description") }
            </Heading>
            <Divider hidden />
            <Grid>
                <Grid.Row>
                    <Grid.Column computer={ 7 }>
                        { (!isGroupDetailsRequestLoading && !isSelectedUsersFetchRequestLoading) ? (
                            selectedUserList?.length > 0 ? (
                                <EmphasizedSegment
                                    data-testid="group-mgt-users-list"
                                    className="user-role-edit-header-segment"
                                >
                                    <Grid.Row>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                            <Input
                                                data-testid={ `${ testId }-users-list-search-input` }
                                                icon={ <Icon name="search" /> }
                                                onChange={ (
                                                    e: FormEvent<HTMLInputElement>,
                                                    { value }: { value: string; }
                                                ) => {
                                                    handleSearchFieldChange(e, value, selectedUserList, 
                                                        setSelectedFilteredUserList);
                                                } }
                                                placeholder={ t(
                                                    "console:manage.features.roles.addRoleWizard." +
                                                    "users.assignUserModal.list.searchPlaceholder"
                                                ) }
                                                floated="left"
                                                size="small"
                                            />
                                            { !isReadOnly && (
                                                <Button
                                                    data-testid={ `${ testId }-users-list-edit-button` }
                                                    size="medium"
                                                    icon="pencil"
                                                    floated="right"
                                                    onClick={ handleOpenAddNewGroupModal }
                                                />
                                            ) }
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                            <Table singleLine compact>
                                                <Table.Header>
                                                    <Table.Row>
                                                        <Table.HeaderCell>
                                                            <strong>
                                                                { t(
                                                                    "console:manage.features.user.updateUser.groups." +
                                                                    "editGroups.groupList.headers.1"
                                                                ) }
                                                            </strong>
                                                        </Table.HeaderCell>
                                                    </Table.Row>
                                                </Table.Header>
                                                <Table.Body>
                                                    { selectedFilteredUserList?.map((user: UserBasicInterface) => {
                                                        return renderUserTableRow(user);
                                                    }) }
                                                </Table.Body>
                                            </Table>
                                        </Grid.Column>
                                    </Grid.Row>
                                </EmphasizedSegment>
                            ) : (
                                <Grid.Row>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                        <EmphasizedSegment>
                                            <EmptyPlaceholder
                                                title={ t(
                                                    "console:manage.features.roles.edit.users.list." +
                                                    "emptyPlaceholder.title"
                                                ) }
                                                subtitle={ [
                                                    t(
                                                        "console:manage.features.roles.edit.users.list." +
                                                        "emptyPlaceholder.subtitles",
                                                        { type: "group" }
                                                    )
                                                ] }
                                                action={
                                                    !isReadOnly && (
                                                        <PrimaryButton
                                                            data-testid={
                                                                `${ testId }-users-list-empty-assign-users-button` }
                                                            onClick={ handleOpenAddNewGroupModal }
                                                        >
                                                            <Icon name="plus" />
                                                            { t(
                                                                "console:manage.features.roles.edit.users.list." +
                                                                "emptyPlaceholder.action"
                                                            ) }
                                                        </PrimaryButton>
                                                    )
                                                }
                                                image={ getEmptyPlaceholderIllustrations().emptyList }
                                                imageSize="tiny"
                                            />
                                        </EmphasizedSegment>
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        ) : (
                            <ContentLoader />
                        ) }
                        { addNewUserModal() }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EmphasizedSegment>
    );
};
