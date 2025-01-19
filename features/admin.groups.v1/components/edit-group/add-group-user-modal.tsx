/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import Button from "@oxygen-ui/react/Button";
import { UserBasicInterface, UserRoleInterface } from "@wso2is/admin.core.v1/models/users";
import { useUsersList } from "@wso2is/admin.users.v1/api";
import { UserManagementUtils } from "@wso2is/admin.users.v1/utils";
import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    Code,
    Heading,
    LinkButton,
    TransferComponent,
    TransferList,
    TransferListItem,
    useWizardAlert
} from "@wso2is/react-components";
import debounce, { DebouncedFunc } from "lodash-es/debounce";
import isEmpty from "lodash-es/isEmpty";
import React, { FormEvent, FunctionComponent, ReactElement, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Modal } from "semantic-ui-react";
import { GroupsInterface } from "../../models/groups";

/**
 * Proptypes for the group users list component.
 */
interface AddGroupUserModalProps extends IdentifiableComponentInterface {
    group: GroupsInterface;
    handleAddUserSubmit: (selectedUsers: UserBasicInterface[]) => void;
    handleCloseAddNewGroupModal: () => void;
    showAddNewUserModal: boolean;
    userstore: string;
}

export const AddGroupUserModal: FunctionComponent<AddGroupUserModalProps> = (
    props: AddGroupUserModalProps
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId,
        handleAddUserSubmit,
        handleCloseAddNewGroupModal,
        showAddNewUserModal,
        group,
        userstore
    } = props;

    const { t } = useTranslation();

    const [ alert, , alertComponent ] = useWizardAlert();

    const dispatch: Dispatch = useDispatch();

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isSelectAllUsers, setIsSelectAllUsers ] = useState<boolean>(false);
    const [ userList, setUserList ] = useState<UserBasicInterface[]>([]);
    const [ selectedUsers, setSelectedUsers ] = useState<UserBasicInterface[]>([]);
    const [ searchQuery, setSearchQuery ] = useState<string>("");

    /**
     * Fetch the user list.
     */
    const {
        data: originalUserList,
        isLoading: isUserListFetchRequestLoading,
        isValidating: isUserListFetchRequestValidating,
        error: userListFetchRequestError
    } = useUsersList(
        20,
        0,
        !isEmpty(searchQuery) ? searchQuery : null,
        null,
        userstore,
        null
    );

    /**
     * Set the user list.
     * This will be triggered when the user list is fetched.
     * This will also check if the user is already assigned to the group.
     * If the user is already assigned to the group, it will be added to the selected users list.
     */
    useEffect(() => {
        if (!originalUserList || isUserListFetchRequestLoading) {
            return;
        }

        if (originalUserList.Resources) {
            const filteredUsers: UserBasicInterface[] = [];

            originalUserList.Resources.map((user: UserBasicInterface) => {
                let isUserExistInGroup: boolean = false;

                if (user?.groups?.length > 0) {
                    user.groups.map((userGroup: UserRoleInterface) => {
                        if (userGroup.display === group.displayName) {
                            isUserExistInGroup = true;
                        }
                    });
                }

                // Do not show the user if the user is already assigned to the group.
                if (!isUserExistInGroup) {
                    filteredUsers.push(user);
                }
            });

            setUserList(filteredUsers);
        } else {
            setUserList([]);
        }
    }, [ originalUserList, isUserListFetchRequestLoading ]);

    /**
     * Handles the user list fetch request error.
     */
    useEffect(() => {
        if (!userListFetchRequestError) {
            return;
        }

        if (userListFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: userListFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("console:manage.features.users.notifications." +
                    "fetchUsers.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("console:manage.features.users.notifications.fetchUsers.genericError." +
                "description"),
            level: AlertLevels.ERROR,
            message: t("console:manage.features.users.notifications.fetchUsers.genericError.message")
        }));
    }, [ userListFetchRequestError ]);

    /**
     * This is a debounced function to handle the user search by email address.
     * Debounced to limit users api call.
     * @param FormEvent - form event
     * @param string - query
     */
    const handleSearchFieldChange: DebouncedFunc<(e: FormEvent<HTMLInputElement>, query: string) => void>
    = useCallback(debounce((e: FormEvent<HTMLInputElement>, query: string) => {
        if (isEmpty(query.trim())) {
            setSearchQuery("");
        } else {
            const processedQuery: string = "userName co " + query;

            setSearchQuery(processedQuery);
        }
    }, 1000), []);

    /**
     * Handles action when a checkbox is checked/unchecked.
     * @param user - UserBasicInterface
     */
    const handleItemCheckboxChange = (user: UserBasicInterface) => {
        const checkedUsers: UserBasicInterface[] = !isEmpty(selectedUsers)
            ? [ ...selectedUsers ]
            : [];

        // Check if the user is already selected.
        if (checkedUsers.includes(user)) {
            // If yes, remove it from the list.
            checkedUsers.splice(checkedUsers.indexOf(user), 1);
        } else {
            // If not add it to the list.
            checkedUsers.push(user);
        }

        setSelectedUsers(checkedUsers);
        setIsSelectAllUsers(userList?.length === checkedUsers?.length);
    };

    /**
     * Action to select/deselect all assigned users
     */
    const selectAllAssignedList = () => {

        if (!isSelectAllUsers) {
            setSelectedUsers(userList);
        } else {
            setSelectedUsers([]);
        }

        setIsSelectAllUsers(!isSelectAllUsers);
    };

    return (
        <Modal
            data-testid={ `${ componentId }-assign-user-wizard-modal` }
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
                    searchPlaceholder={ t("groups:edit.users.searchUsers") }
                    isLoading={ isUserListFetchRequestLoading || isUserListFetchRequestValidating }
                    handleHeaderCheckboxChange={ () => selectAllAssignedList() }
                    isHeaderCheckboxChecked={ isSelectAllUsers }
                    handleUnelectedListSearch={ (e: FormEvent<HTMLInputElement>, { value }: { value: string }) => {
                        handleSearchFieldChange(e, value);
                    } }
                    showSelectAllCheckbox={ !isUserListFetchRequestLoading && userList.length > 0 }
                    data-testid={ `${ componentId }-user-list-transfer` }
                >
                    <TransferList
                        selectionComponent
                        isListEmpty={ userList.length <= 0 }
                        isLoading={ isUserListFetchRequestLoading || isUserListFetchRequestValidating }
                        listType="unselected"
                        selectAllCheckboxLabel={ t("groups:edit.users.selectAllUsers") }
                        data-testid={ `${ componentId }-unselected-transfer-list` }
                        emptyPlaceholderContent={ t("transferList:list.emptyPlaceholders." +
                            "groups.selected", { type: "users" }) }
                        emptyPlaceholderDefaultContent={ t("transferList:list."
                            + "emptyPlaceholders.default") }
                    >
                        {
                            userList?.map((user: UserBasicInterface, index: number) => {
                                const resolvedGivenName: string = UserManagementUtils.resolveUserListSubheader(user);
                                const resolvedUsername: string = getUserNameWithoutDomain(user?.userName);

                                return (
                                    <TransferListItem
                                        handleItemChange={ () => handleItemCheckboxChange(user) }
                                        key={ index }
                                        listItem={ resolvedGivenName ?? resolvedUsername }
                                        listItemId={ user.id }
                                        listItemIndex={ index }
                                        isItemChecked={
                                            selectedUsers?.findIndex((selectedUser: UserBasicInterface) =>
                                                selectedUser.id === user.id) !== -1
                                        }
                                        showSecondaryActions={ false }
                                        showListSubItem={ true }
                                        listSubItem={ resolvedGivenName && (
                                            <Code compact withBackground={ false }>{ resolvedUsername }</Code>
                                        ) }
                                        data-testid={ `${ componentId }-unselected-transfer-list-item-${ index }` }
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
                                data-componentid={ `${ componentId }-assign-user-wizard-modal-cancel-button` }
                                data-testid={ `${ componentId }-assign-user-wizard-modal-cancel-button` }
                                onClick={ handleCloseAddNewGroupModal }
                                floated="left"
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <Button
                                variant="contained"
                                color="primary"
                                data-componentid={ `${ componentId }-assign-user-wizard-modal-save-button` }
                                data-testid={ `${ componentId }-assign-user-wizard-modal-save-button` }
                                onClick={ () => {
                                    setIsSubmitting(true);
                                    handleAddUserSubmit(selectedUsers);
                                } }
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                            >
                                { t("common:save") }
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};
