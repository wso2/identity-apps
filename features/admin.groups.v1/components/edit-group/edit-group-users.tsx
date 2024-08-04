/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { Show } from "@wso2is/access-control";
import { AppState, FeatureConfigInterface, getEmptyPlaceholderIllustrations } from "@wso2is/admin.core.v1";
import { UserBasicInterface } from "@wso2is/admin.users.v1/models/user";
import { AlertLevels, LoadableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Button, Code, ContentLoader,
    EmphasizedSegment,
    EmptyPlaceholder,
    Heading,
    LinkButton,
    Popup,
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
import { useDispatch, useSelector } from "react-redux";
import { Dispatch as ReduxDispatch } from "redux";
import { Grid, Header, Icon, Input, Modal, Table } from "semantic-ui-react";
import { updateGroupDetails } from "../../api";
import { CreateGroupMemberInterface, GroupsInterface, PatchGroupDataInterface } from "../../models";

/**
 * Proptypes for the group users list component.
 */
interface GroupUsersListProps extends TestableComponentInterface, LoadableComponentInterface {
    group: GroupsInterface;
    isGroup: boolean;
    isReadOnly?: boolean;
    onGroupUpdate: (groupId: string) => void;
    users: UserBasicInterface[];
    selectedUsers: UserBasicInterface[];
}

export const GroupUsersList: FunctionComponent<GroupUsersListProps> = (props: GroupUsersListProps): ReactElement => {
    const {
        isReadOnly,
        group,
        onGroupUpdate,
        users,
        isLoading,
        selectedUsers,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: ReduxDispatch = useDispatch();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const [ originalUserList, setOriginalUserList ] = useState<UserBasicInterface[]>(users);
    const [ selectedUserList, setSelectedUserList ] = useState<UserBasicInterface[]>(selectedUsers);
    const [ addModalUserList, setAddModalUserList ] = useState<UserBasicInterface[]>(users);
    const [ isSelectAllUsers, setIsSelectAllUsers ] = useState<boolean>(false);
    const [ newlySelectedUsers, setNewlySelectedUsers ] = useState<UserBasicInterface[]>([]);
    const [ showAddNewUserModal, setAddNewUserModalView ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    useEffect(() => {
        setOriginalUserList(users);
    }, [ users ]);

    useEffect(() => {
        setSelectedUserList(selectedUsers);
    }, [ selectedUsers ]);

    /**
     * Select all assigned users
     */
    const selectAllAssignedList = () => {

        if (!isSelectAllUsers) {
            setNewlySelectedUsers(originalUserList);
        } else {
            setNewlySelectedUsers([]);
        }

        setIsSelectAllUsers(!isSelectAllUsers);
    };

    const handleSearchFieldChange = (e: FormEvent<HTMLInputElement>, query: string, list: UserBasicInterface[],
        stateAction: Dispatch<SetStateAction<any>>) => {

        let isMatch: boolean = false;
        const filteredRoleList: UserBasicInterface[] = [];

        if (!isEmpty(query)) {
            const regExp: RegExp = new RegExp(escapeRegExp(query), "i");

            list && list.map((user: UserBasicInterface) => {
                isMatch = regExp.test(user.userName);

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

    const handleAssignedItemCheckboxChange = (role: UserBasicInterface) => {
        const checkedRoles: UserBasicInterface[] = !isEmpty(newlySelectedUsers)
            ? [ ...newlySelectedUsers ]
            : [];

        if (checkedRoles.includes(role)) {
            checkedRoles.splice(checkedRoles.indexOf(role), 1);
            setNewlySelectedUsers(checkedRoles);
        } else {
            checkedRoles.push(role);
            setNewlySelectedUsers(checkedRoles);
        }

        setIsSelectAllUsers(addModalUserList?.length === checkedRoles?.length);
    };

    const deleteGroupUser = (user: UserBasicInterface) => {
        const selectedUsers: UserBasicInterface[] = !isEmpty(selectedUserList)
            ? [ ...selectedUserList ]
            : [];

        if (selectedUsers.includes(user)) {
            selectedUsers.splice(selectedUsers.indexOf(user), 1);
            setSelectedUserList(selectedUsers);
            updateGroupUsersList(selectedUsers);
        }
    };

    const handleOpenAddNewGroupModal = () => {
        setAddModalUserList(originalUserList);
        setNewlySelectedUsers(selectedUsers);
        setIsSelectAllUsers(selectedUsers?.length === originalUserList?.length);
        setAddNewUserModalView(true);
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
                    t("roles:addRoleWizard.users.assignUserModal.heading",
                        { type: "Group" })
                }
                <Heading subHeading ellipsis as="h6">
                    {
                        t("roles:addRoleWizard.users.assignUserModal.subHeading",
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
                        t("roles:addRoleWizard.users.assignUserModal.list" +
                            ".searchPlaceholder")
                    }
                    isLoading={ isLoading }
                    handleHeaderCheckboxChange={ selectAllAssignedList }
                    isHeaderCheckboxChecked={ isSelectAllUsers }
                    handleUnelectedListSearch={ (e: FormEvent<HTMLInputElement>, { value }: { value: string }) => {
                        handleSearchFieldChange(e, value, originalUserList, setAddModalUserList);
                    } }
                    showSelectAllCheckbox={ !isLoading && users?.length > 0 }
                    data-testid={ `${ testId }-user-list-transfer` }
                >
                    <TransferList
                        selectionComponent
                        isListEmpty={ !(users?.length > 0) }
                        isLoading={ isLoading }
                        listType="unselected"
                        selectAllCheckboxLabel={ "Select all users" }
                        data-testid={ `${ testId }-unselected-transfer-list` }
                        emptyPlaceholderContent={ t("transferList:list.emptyPlaceholders." +
                            "groups.selected", { type: "users" }) }
                        emptyPlaceholderDefaultContent={ t("transferList:list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            addModalUserList?.map((user: UserBasicInterface, index: number) => {
                                const resolvedGivenName: string = (user.name && user.name.givenName !== undefined)
                                    ? user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "")
                                    : undefined;

                                const resolvedUsername: string = user.userName.split("/")?.length > 1
                                    ? user.userName.split("/")[ 1 ]
                                    : user.userName.split("/")[ 0 ];

                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleAssignedItemCheckboxChange(user) }
                                        key={ index }
                                        listItem={ resolvedGivenName ?? resolvedUsername }
                                        listItemId={ user.id }
                                        listItemIndex={ index }
                                        isItemChecked={
                                            newlySelectedUsers && newlySelectedUsers.includes(user)
                                        }
                                        showSecondaryActions={ false }
                                        showListSubItem={ true }
                                        listSubItem={ resolvedGivenName && (
                                            <Code compact withBackground={ false }>{ resolvedUsername }</Code>
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
                                    setIsSubmitting(true);
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

        const resolvedGivenName: string = (user.name && user.name.givenName !== undefined)
            ? user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "")
            : undefined;

        const resolvedUsername: string = user.userName.split("/")?.length > 1
            ? user.userName.split("/")[ 1 ]
            : user.userName.split("/")[ 0 ];

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
                            name={ resolvedUsername }
                            spaced="right"
                            size="mini"
                            floated="left"
                            image={ user.profileUrl }
                        />
                        <Header.Content>
                            { resolvedGivenName ?? resolvedUsername }
                            <Header.Subheader data-testid={ `${ testId }-item-sub-heading` }>
                                { resolvedGivenName && resolvedUsername }
                            </Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell textAlign="right">
                    <Show
                        when={ featureConfig?.groups?.scopes?.update }
                    >
                        <Popup
                            trigger={ (
                                <Icon
                                    link={ true }
                                    data-testid={ `${ testId }-user-delete-button` }
                                    className="list-icon pr-4"
                                    size="large"
                                    color="grey"
                                    name="trash alternate"
                                    onClick={ () => {
                                        deleteGroupUser(user);
                                    } }
                                />
                            ) }
                            position="top right"
                            content={ t("common:remove") }
                            inverted
                        />
                    </Show>
                </Table.Cell>
            </Table.Row>
        );
    };

    return (
        <EmphasizedSegment padded="very">
            <Grid>
                {
                    selectedUsers?.length > 0
                        ? (
                            <>
                                <Grid.Row>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 6 }>
                                        <Input
                                            data-testid={ `${ testId }-users-list-search-input` }
                                            icon={ <Icon name="search"/> }
                                            onChange={ (e: FormEvent<HTMLInputElement>,
                                                { value }: { value: string }) => {
                                                handleSearchFieldChange(e, value, selectedUsers,
                                                    setSelectedUserList);
                                            } }
                                            placeholder={
                                                t("roles:addRoleWizard." +
                                                    "users.assignUserModal.list.searchPlaceholder")
                                            }
                                            floated="left"
                                            fluid
                                        />
                                    </Grid.Column>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 4 }>
                                        {
                                            !isReadOnly && (
                                                <Button
                                                    data-testid={ `${ testId }-users-list-edit-button` }
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
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                        <Table singleLine compact>
                                            <Table.Body>
                                                {
                                                    selectedUserList?.map((user: UserBasicInterface) => {
                                                        return renderUserTableRow(user);
                                                    })
                                                }
                                            </Table.Body>
                                        </Table>
                                    </Grid.Column>
                                </Grid.Row>
                            </>
                        )
                        : !isLoading
                            ? (
                                <Grid.Row>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 10 }>
                                        <EmphasizedSegment>
                                            <EmptyPlaceholder
                                                title={ t("roles:edit.users.list." +
                                                    "emptyPlaceholder.title") }
                                                subtitle={ [
                                                    t("roles:edit.users.list." +
                                                        "emptyPlaceholder.subtitles", { type: "group" })
                                                ] }
                                                action={
                                                    !isReadOnly && (
                                                        <PrimaryButton
                                                            data-testid={
                                                                `${ testId }-users-list-empty-assign-users-button`
                                                            }
                                                            onClick={ handleOpenAddNewGroupModal }
                                                        >
                                                            <Icon name="plus"/>
                                                            { t("roles:edit.users.list." +
                                                                "emptyPlaceholder.action") }
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
                            : <ContentLoader/>
                }
                { addNewUserModal() }
            </Grid>
        </EmphasizedSegment>
    );
};
