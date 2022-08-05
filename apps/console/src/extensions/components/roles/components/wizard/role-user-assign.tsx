/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { LoadableComponentInterface, RolesMemberInterface, TestableComponentInterface } from "@wso2is/core/models";
import { Forms } from "@wso2is/forms";
import {
    Button,
    ContentLoader,
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
import { Grid, Header, Icon, Input, Modal, Table } from "semantic-ui-react";
import { UIConstants, getEmptyPlaceholderIllustrations } from "../../../../../features/core";
import { UserBasicInterface, getUsersList } from "../../../../../features/users";
import { CONSUMER_USERSTORE } from "../../../users/constants";

/**
 * Proptypes for the role user list component.
 */
interface AddRoleUserProps extends TestableComponentInterface, LoadableComponentInterface {
    triggerSubmit?: boolean;
    onSubmit?: (values: any) => void;
    assignedUsers?: RolesMemberInterface[];
    isEdit: boolean;
    isGroup: boolean;
    userStore?: string;
    initialValues?: UserBasicInterface[];
    isReadOnly?: boolean;
    /**
     * Fired when a user is removed from teh list.
     */
    handleTempUsersListChange?: (list: UserBasicInterface[]) => void;
}

/**
 * Component to add users to roles.
 *
 * @param {AddRoleUserProps} props - Injected props.
 * @return {React.ReactElement}
 */
export const AddRoleUsers: FunctionComponent<AddRoleUserProps> = (props: AddRoleUserProps): ReactElement => {

    const {
        triggerSubmit,
        onSubmit,
        assignedUsers,
        isEdit,
        initialValues,
        isGroup,
        userStore,
        isReadOnly,
        handleTempUsersListChange,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const [ originalUserList, setOriginalUserList ] = useState<UserBasicInterface[]>([]);
    const [ selectedUsers, setSelectedUsers ] = useState<UserBasicInterface[]>([]);
    const [ newlySelectedUsers, setNewlySelectedUsers ] = useState<UserBasicInterface[]>([]);
    const [ addModalUserList, setAddModalUserList ] = useState<UserBasicInterface[]>([]);
    const [ editViewUserList, setEditViewUserList ] = useState<UserBasicInterface[]>([]);
    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(0);
    const [ userListMetaContent, setUserListMetaContent ] = useState(undefined);
    const [ isSelectAllUsers, setIsSelectAllUsers ] = useState<boolean>(false);
    const [ isUsersFetchRequestLoading, setIsUsersFetchRequestLoading ] = useState<boolean>(true);
    const [ showAddNewUserModal, setAddNewUserModalView ] = useState<boolean>(false);

    useEffect(() => {

        if (!originalUserList) {
            return;
        }

        const selectedUserList: UserBasicInterface[] = resolveAssignedUsers(selectedUsers, assignedUsers, true);

        setSelectedUsers(selectedUserList);
        setEditViewUserList(selectedUserList);
    }, [ assignedUsers ]);

    useEffect(() => {

        let list: UserBasicInterface[] = [];

        if (isSelectAllUsers) {
            list = originalUserList;
        }

        setNewlySelectedUsers(list);
        handleTempUsersListChange && handleTempUsersListChange(list);
    }, [ isSelectAllUsers ]);

    useEffect(() => {
        setListItemLimit(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);
        setUserListMetaContent(new Map<string, string>([
            ["name", "name"],
            ["emails", "emails"],
            ["name", "name"],
            ["userName", "userName"],
            ["id", ""],
            ["profileUrl", "profileUrl"],
            ["meta.lastModified", "meta.lastModified"],
            ["meta.created", ""]
        ]));
    }, []);

    useEffect(() => {
        if (userListMetaContent) {
            const attributes = generateAttributesString(userListMetaContent.values());
            if (isGroup) {
                getList(listItemLimit, listOffset, null, attributes, userStore);
            } else {
                getList(listItemLimit, listOffset, null, attributes, null);
            }
        }
    }, [ listOffset, listItemLimit ]);

    // Commented when the select all option for roles was removed.
    // Uncomment if select all option is reintroduced.
    // /**
    //  * Select all assigned users.
    //  */
    // const selectAllAssignedList = (): void => {
    //     setIsSelectAllUsers(!isSelectAllUsers);
    // };

    /**
     * Get the user list.
     *
     * @param {number} limit - List linit.
     * @param {number} offset - List offset.
     * @param {string} filter - List filter.
     * @param {string} attribute - List attributes.
     * @param {string} userStore - Fetched userstore.
     */
    const getList = (limit: number, offset: number, filter: string, attribute: string, userStore: string): void => {

        setIsUsersFetchRequestLoading(true);

        getUsersList(limit, offset, filter, attribute, userStore)
            .then((response) => {
                const responseUsers = response.Resources
                    .filter((user) => user.userName.split("/")[0] !== CONSUMER_USERSTORE);

                responseUsers.sort((userObject, comparedUserObject) =>
                    userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                );

                setOriginalUserList([ ...responseUsers ]);

                if (assignedUsers && assignedUsers.length !== 0) {
                    const selectedUserList: UserBasicInterface[] = [];

                    if (responseUsers && responseUsers instanceof Array ) {
                        responseUsers.slice().reverse().forEach(user => {
                            assignedUsers.forEach(assignedUser => {
                                if (user.id === assignedUser.value) {
                                    selectedUserList.push(user);
                                    responseUsers.splice(responseUsers.indexOf(user), 1);
                                }
                            });
                        });

                        selectedUserList.sort((userObject, comparedUserObject) =>
                            userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                        );

                        setSelectedUsers(selectedUserList);
                        setEditViewUserList(selectedUserList);
                    }
                }

                if (initialValues && initialValues instanceof Array) {
                    const selectedUserList: UserBasicInterface[] = [];

                    if (responseUsers && responseUsers instanceof Array ) {
                        responseUsers.forEach(user => {
                            initialValues.forEach(assignedUser => {
                                if (user.id === assignedUser.id) {
                                    selectedUserList.push(user);
                                }
                            });
                        });

                        selectedUserList.sort((userObject, comparedUserObject) =>
                            userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
                        );

                        setOriginalUserList(responseUsers.filter(function(user) {
                            return selectedUserList.indexOf(user) == -1;
                        }));

                        setSelectedUsers(selectedUserList);
                        setEditViewUserList(selectedUserList);
                    }
                }
            })
            .finally(() => {
                setIsUsersFetchRequestLoading(false);
            });
    };

    /**
     * Resolve the selected users when the role updates.
     *
     * @param {UserBasicInterface[]} assignedUsers - Assigned users.
     * @param {RolesMemberInterface[]} assignedMembers - Assigned members in role.
     * @param {boolean} sort - Should sort array.
     * @return {any[] | UserBasicInterface[]}
     */
    const resolveAssignedUsers = (assignedUsers: UserBasicInterface[], assignedMembers: RolesMemberInterface[],
                                  sort?: boolean) => {

        if (isEmpty(assignedMembers)) {
            return [];
        }

        let users: UserBasicInterface[] = [];

        if (isEmpty(assignedUsers) && initialValues && Array.isArray(initialValues) && initialValues.length > 0) {
            users = initialValues;
        } else {
            users = [ ...assignedUsers ];
        }

        const resolvedUsers: UserBasicInterface[] = [];

        users.filter((user: UserBasicInterface) => {
            assignedMembers.forEach((member: RolesMemberInterface) => {
                if (user.id === member.value) {
                    resolvedUsers.push(user);
                }
            });
        });

        if (sort) {
            resolvedUsers.sort((userObject, comparedUserObject) =>
                userObject.name?.givenName?.localeCompare(comparedUserObject.name?.givenName)
            );
        }

        return resolvedUsers;
    };

    /**
     * The following method accepts a Map and returns the values as a string.
     *
     * @param attributeMap - IterableIterator<string>
     * @return string
     */
    const generateAttributesString = (attributeMap: IterableIterator<string>) => {
        const attArray = [];
        const iterator1 = attributeMap[Symbol.iterator]();

        for (const attribute of iterator1) {
            if (attribute !== "") {
                attArray.push(attribute);
            }
        }

        return attArray.toString();
    };

    /**
     * Handles search field change.
     * @param {React.FormEvent<HTMLInputElement>} e - Event.
     * @param {string} query - Search query.
     * @param {UserBasicInterface[]} list - List to check.
     * @param {React.Dispatch<React.SetStateAction<any>>} stateAction - Action to set the state.
     */
    const handleSearchFieldChange = (e: FormEvent<HTMLInputElement>, query: string, list: UserBasicInterface[],
                                     stateAction: Dispatch<SetStateAction<any>>): void => {

        let isMatch: boolean = false;
        const filteredRoleList: UserBasicInterface[] = [];

        if (!isEmpty(query)) {
            const regExp = new RegExp(escapeRegExp(query), "i");

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

    /**
     * Handles assigned item checkbox change.
     */
    const handleAssignedItemCheckboxChange = (role): void => {
        const checkedRoles = [ ...newlySelectedUsers ];

        if (checkedRoles.includes(role)) {
            checkedRoles.splice(checkedRoles.indexOf(role), 1);
        } else {
            checkedRoles.push(role);
        }

        setNewlySelectedUsers(checkedRoles);
        handleTempUsersListChange(checkedRoles);
    };

    /**
     * Handles role wizard open action.
     */
    const handleOpenAddNewRoleModal = () => {
        setAddModalUserList(originalUserList);
        setNewlySelectedUsers(selectedUsers);
        setIsSelectAllUsers(selectedUsers?.length === originalUserList?.length);
        setAddNewUserModalView(true);
    };

    /**
     * Handles role wizard close action.
     */
    const handleCloseAddNewRoleModal = (): void => {
        setAddModalUserList(originalUserList);
        setNewlySelectedUsers([]);
        setIsSelectAllUsers(false);
        setAddNewUserModalView(false);
    };

    /**
     * Add user submit callback.
     */
    const handleAddUserSubmit = (): void => {
        onSubmit(newlySelectedUsers);
        setSelectedUsers(newlySelectedUsers);
        setAddNewUserModalView(false);
    };

    /**
     * Renders the add user modal.
     *
     * @return {React.ReactElement}
     */
    const renderAddUserModal = (): ReactElement => (
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
                    handleUnelectedListSearch={ (e: FormEvent<HTMLInputElement>, { value }: { value: string }) => {
                        handleSearchFieldChange(e, value, originalUserList, setAddModalUserList);
                    } }
                    data-testid={ `${ testId }-user-list-transfer` }
                >
                    <TransferList
                        selectionComponent
                        isListEmpty={ false }
                        isLoading={ isUsersFetchRequestLoading }
                        listType="unselected"
                        data-testid={ `${ testId }-unselected-transfer-list` }
                        emptyPlaceholderContent={ t("console:manage.features.transferList.list.emptyPlaceholders." +
                            "roles.selected", { type: "users" }) }
                        emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
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
                                            <Header as="h6">
                                                <Header.Content>
                                                    <Header.Subheader
                                                        data-testid={ `${ testId }-item-sub-heading` }
                                                    >
                                                        { resolvedUsername }
                                                    </Header.Subheader>
                                                </Header.Content>
                                            </Header>
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
                                onClick={ handleCloseAddNewRoleModal }
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
                            >
                                { t("common:save") }
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );

    /**
     * Renders the user table row.
     *
     * @param {UserBasicInterface} user - User obj.
     * @return {React.ReactElement}
     */
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
            </Table.Row>
        );
    };

    /**
     * Renders the edit view shown in edit page.
     *
     * @return {React.ReactElement}
     */
    const renderEditView = (): ReactElement => {

        return (
            <Grid>
                {
                    selectedUsers?.length > 0
                        ? (
                            <>
                                <Grid.Row>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                        <Input
                                            data-testid={ `${ testId }-users-list-search-input` }
                                            icon={ <Icon name="search"/> }
                                            onChange={ (e: FormEvent<HTMLInputElement>,
                                                        { value }: { value: string }) => {
                                                handleSearchFieldChange(e, value, selectedUsers,
                                                    setEditViewUserList);
                                            } }
                                            placeholder={
                                                t("console:manage.features.roles.addRoleWizard." +
                                                    "users.assignUserModal.list.searchPlaceholder")
                                            }
                                            floated="left"
                                            size="small"
                                        />
                                        {
                                            !isReadOnly && (
                                                <Button
                                                    data-testid={ `${ testId }-users-list-edit-button` }
                                                    size="medium"
                                                    icon="pencil"
                                                    floated="right"
                                                    onClick={ handleOpenAddNewRoleModal }
                                                />
                                            )
                                        }
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                        <Table singleLine compact>
                                            <Table.Body>
                                                {
                                                    editViewUserList?.map((user: UserBasicInterface) => {
                                                        return renderUserTableRow(user);
                                                    })
                                                }
                                            </Table.Body>
                                        </Table>
                                    </Grid.Column>
                                </Grid.Row>
                            </>
                        )
                        : (
                            !isUsersFetchRequestLoading
                                ? (
                                    <Grid.Row>
                                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 12 }>
                                            <EmphasizedSegment>
                                                <EmptyPlaceholder
                                                    title={ t("console:manage.features.roles.edit.users.list." +
                                                        "emptyPlaceholder.title") }
                                                    subtitle={ [
                                                        t("console:manage.features.roles.edit.users.list." +
                                                            "emptyPlaceholder.subtitles", { type: "role" })
                                                    ] }
                                                    action={
                                                        !isReadOnly && (
                                                            <PrimaryButton
                                                                data-testid={
                                                                    `${ testId }-users-list-empty-assign-users-button`
                                                                }
                                                                onClick={ handleOpenAddNewRoleModal }
                                                                icon="plus"
                                                            >
                                                                { t("console:manage.features.roles.edit.users.list." +
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
                        )
                }
                { renderAddUserModal() }
            </Grid>
        );
    };

    /**
     * Renders the form view shown in create wizard.
     *
     * @return {React.ReactElement}
     */
    const renderFormView = (): ReactElement => {

        return (
            <Forms
                onSubmit={ () => {
                    onSubmit(newlySelectedUsers);
                } }
                submitState={ triggerSubmit }
            >
                <Grid>
                    <Grid.Row columns={ 2 }>
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
                            handleUnelectedListSearch={ (e: FormEvent<HTMLInputElement>, { value }: { value: string }) => {
                                handleSearchFieldChange(e, value, originalUserList, setAddModalUserList);
                            } }
                            data-testid={ `${ testId }-transfer-component` }
                        >
                            <TransferList
                                selectionComponent
                                isListEmpty={ !isUsersFetchRequestLoading && originalUserList?.length < 1 }
                                isLoading={ isUsersFetchRequestLoading }
                                listType="unselected"
                                selectAllCheckboxLabel="Select all users"
                                emptyPlaceholderContent={
                                    "There are no users available at the moment to assign " +
                                    "to this role."
                                }
                                data-testid={ `${ testId }-unselected-transfer-list` }
                                emptyPlaceholderDefaultContent={ t("console:manage.features.transferList.list."
                                    + "emptyPlaceholders.default") }
                            >
                                {
                                    originalUserList?.map((user: UserBasicInterface, index: number) => {
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
                                                isItemChecked={ newlySelectedUsers.includes(user) }
                                                showSecondaryActions={ false }
                                                showListSubItem={ true }
                                                listSubItem={ resolvedGivenName && (
                                                    <Header as="h6">
                                                        <Header.Content>
                                                            <Header.Subheader
                                                                data-testid={ `${ testId }-item-sub-heading` }
                                                            >
                                                                { resolvedUsername }
                                                            </Header.Subheader>
                                                        </Header.Content>
                                                    </Header>
                                                ) }
                                                data-testid={ `${ testId }-unselected-transfer-list-item-${ index }` }
                                            />
                                        );
                                    })
                                }
                            </TransferList>
                        </TransferComponent>
                    </Grid.Row>
                    { isEdit &&
                    <Grid.Row columns={ 1 }>
                        <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 8 }>
                            <Button
                                data-testid={ `${ testId }-update-user-list-button` }
                                primary
                                type="submit"
                                size="small"
                                className="form-button"
                            >
                                { t("common.update") }
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                    }
                </Grid>
            </Forms>
        );
    };

    return (
        <>
            {
                isEdit
                    ? renderEditView()
                    : renderFormView()
            }
        </>
    );
};

AddRoleUsers.defaultProps = {
    isLoading: false
};
