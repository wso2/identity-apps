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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    ListLayout,
    PrimaryButton
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dropdown, DropdownProps, Header, Icon, Label, PaginationProps, SemanticICONS } from "semantic-ui-react";
import {
    AdvancedSearchWithBasicFilters,
    UIConstants,
    getEmptyPlaceholderIllustrations
} from "../../../../features/core";
import { deleteInvite, resendInvite, updateInvite } from "../api";
import { InviteeRoleSelection } from "../components";
import { InviteUserStatus, UserInviteInterface } from "../models";


interface UsersPageInterface extends TestableComponentInterface {
    setUpdateInviteList: (value: boolean) => void;
    setHideAddWizardButton: (value: boolean) => void;
    setShowWizard: (value: boolean) => void;
    updateInviteList: boolean;
    totalAdminDevList: UserInviteInterface[];
    setTotalAdminDevList: (value: UserInviteInterface[]) => void;
    isUserListRequestLoading: boolean;
}

/**
 * Temporary value to append to the list limit to figure out if the next button is there.
 * @type {number}
 */
const TEMP_RESOURCE_LIST_ITEM_LIMIT_OFFSET: number = 1;

/**
 * Users info page.
 *
 * @param {UsersPageInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
const AdminDevPage: FunctionComponent<UsersPageInterface> = (
    props: UsersPageInterface
): ReactElement => {

    const {
        ["data-testid"]: testId,
        setUpdateInviteList,
        totalAdminDevList,
        setShowWizard,
        isUserListRequestLoading
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const [ changeStatus, setChangeStatus ] = useState<string>("");

    const [ listOffset, setListOffset ] = useState<number>(0);
    const [ listItemLimit, setListItemLimit ] = useState<number>(UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT);

    const [ showDeleteModal, setShowDeleteModal ] = useState<boolean>(false);
    const [ deleteUserInvite, setDeleteUserInvite ] = useState<UserInviteInterface>(undefined);
    const [ showResendConfirmationModal, setShowResendConfirmationModal ] = useState<boolean>(false);
    const [ resendUserInvite, setResendUserInvite ] = useState<UserInviteInterface>(undefined);
    const [ roleSelectionInvite, setRoleSelectionInvite ] = useState<UserInviteInterface>(undefined);
    const [ showRoleSelectionModal, setShowRoleSelectionModal ] = useState<boolean>(false);

    const [ paginateAdminDevList, setPaginateAdminDevList ] = useState<UserInviteInterface[]>([]);
    const [ finalAdminDevList, setFinalAdminDevList ] = useState<UserInviteInterface[]>([]);
    const [ filterAdminDevList, setFilterAdminDevList ] = useState<UserInviteInterface[]>([]);
    const [ sortAdminDevList, setSortAdminDevList ] = useState<UserInviteInterface[]>([]);

    const [ isListUpdated, setListUpdated ] = useState(true);
    const [ triggerClearQuery, setTriggerClearQuery ] = useState<boolean>(false);

    const [ isNextPageAvailable, setIsNextPageAvailable ] = useState<boolean>(false);
    const [ isPreviousPageAvailable, setIsPreviousPageAvailable ] = useState<boolean>(false);

    const HandleDeleteInvite = (traceID: string) => {

        deleteInvite(traceID)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.invite.notifications.deleteInvite.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.invite.notifications.deleteInvite.success.message")
                }));
                setUpdateInviteList(true);

            }).catch((error) => {
            if (error?.response?.data?.description) {
                dispatch(addAlert({
                    description: error?.response?.data?.description ?? error?.response?.data?.detail
                        ?? t("console:manage.features.invite.notifications.deleteInvite.error.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        ?? t("console:manage.features.invite.notifications.deleteInvite.error.message")
                }));

                return;
            }

            dispatch(addAlert({
                description: t("console:manage.features.invite.notifications.deleteInvite.genericError." +
                    "description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.invite.notifications.deleteInvite.genericError.message")
            }));
        });
    };

    const HandleResendInvite = (traceID: string) => {

        resendInvite(traceID)
            .then((response) => {
                dispatch(addAlert({
                    description: t("console:manage.features.invite.notifications.resendInvite.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.invite.notifications.resendInvite.success.message")
                }));

            }).catch((error) => {
            if (error?.response?.data?.description) {
                dispatch(addAlert({
                    description: error?.response?.data?.description ?? error?.response?.data?.detail
                        ?? t("console:manage.features.invite.notifications.resendInvite.error.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        ?? t("console:manage.features.invite.notifications.resendInvite.error.message")
                }));

                return;
            }

            dispatch(addAlert({
                description: t("console:manage.features.invite.notifications.resendInvite.genericError." +
                    "description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.invite.notifications.resendInvite.genericError.message")
            }));
        });
    };


    /**
     * User effect to handle Invite List update.
     */
    useEffect(() => {
        if (isListUpdated) {
            setUpdateInviteList(true);
            setListUpdated(false);
        }
    }, [ isListUpdated ]);

    useEffect(() => {
        setPaginateAdminDevList(totalAdminDevList);
    }, [ totalAdminDevList ]);

    /**
     * User effect to handle Invite List update.
     */
    useEffect(() => {
        if (triggerClearQuery) {
            handleSearchQueryClear();
            setTriggerClearQuery(false);
        }
    }, [ triggerClearQuery ]);

    /**
     * User effect to handle Pagination.
     */
    useEffect(() => {
        let finalInvitations: UserInviteInterface[] = paginateAdminDevList;
        if (finalInvitations.length > listItemLimit) {
            finalInvitations = finalInvitations.slice(listOffset, listOffset + listItemLimit);
            setFinalAdminDevList(finalInvitations);
            setIsNextPageAvailable(finalInvitations.length === listItemLimit);
            setIsPreviousPageAvailable(listOffset > 1);
        } else {
            setFinalAdminDevList(finalInvitations);
            setIsNextPageAvailable(false);
        }
    }, [ paginateAdminDevList, listOffset ]);

    /**
     * Handles the `onSearchQueryClear` callback action.
     */
    const handleSearchQueryClear = (): void => {
        // setTriggerClearQuery(!triggerClearQuery);
        setSearchQuery("");
    };

    /**
     * User effect to handle Invite List update.
     */
    useEffect(() => {
        setListOffset(0);
        if (changeStatus === "all") {
            if (filterAdminDevList.length > 0) {
                setPaginateAdminDevList(filterAdminDevList);
            } else {
                setPaginateAdminDevList(totalAdminDevList);
            }
            setSortAdminDevList([]);
        } else {
            let searchList: UserInviteInterface[] = totalAdminDevList;
            if (filterAdminDevList.length > 0) {
                searchList = filterAdminDevList;
            }
            searchList = searchList.filter((invite) => {
                return invite.status.includes(changeStatus);
            });
            setPaginateAdminDevList(searchList);
            setSortAdminDevList(searchList);
        }
    }, [ changeStatus ]);


    useEffect(() => {
        setListOffset(0);
        if (searchQuery === "email co " || searchQuery === "") {
            if (sortAdminDevList.length > 0) {
                setPaginateAdminDevList(sortAdminDevList);
            } else {
                setPaginateAdminDevList(totalAdminDevList);
            }
            setFilterAdminDevList([]);
            return;
        } else if (searchQuery.includes("email co ")) {
            let searchList: UserInviteInterface[] = totalAdminDevList;
            if (sortAdminDevList.length > 0) {
                searchList = sortAdminDevList;
            }
            const searchValue = searchQuery.split("co ")[1];
            searchList = searchList.filter((invite) => {
                return invite.email.includes(searchValue);
            });
            setPaginateAdminDevList(searchList);
            setFilterAdminDevList(searchList);
        } else if (searchQuery.includes("status")) {
            let searchList: UserInviteInterface[] = totalAdminDevList;
            if (sortAdminDevList.length > 0) {
                searchList = sortAdminDevList;
            }
            const searchValue = searchQuery.split("co ")[1];
            searchList = searchList.filter((invite) => {
                return invite.status.includes(searchValue);
            });
            setPaginateAdminDevList(searchList);
            setFilterAdminDevList(searchList);
        }
    }, [ searchQuery ]);

    const handleStatusChange = (event: React.MouseEvent<HTMLAnchorElement>, data: DropdownProps) => {
        setChangeStatus(data.value.toString());
    };

    const handleUserFilter = (query: string): void => {
        setSearchQuery(query);
    };

    const revokeUserInvite = (traceID: string): void => {
        // handleUserDelete(id);
        HandleDeleteInvite(traceID);
        setShowDeleteModal(false);
        setListUpdated(true);
    };

    const reSendUserInvite = (traceID: string): void => {
        // handleUserDelete(id);
        HandleResendInvite(traceID);
        setShowResendConfirmationModal(false);
        setListUpdated(true);
    };


    const handlePaginationChange = (event: React.MouseEvent<HTMLAnchorElement>, data: PaginationProps) => {
        setListOffset((data.activePage as number - 1) * listItemLimit);
    };

    const determineInviteStatus = (status: InviteUserStatus): ReactNode => {
        if (status === InviteUserStatus.EXPIRED) {
            return <Label color={ "red" }>{ status }</Label>;
        } else {
            return <Label color={ "blue" }>{ status }</Label>;
        }

    };

    /**
     * Shows list placeholders.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ handleSearchQueryClear }>
                            { t("console:manage.features.invite.placeholder.emptySearchResultPlaceholder.clearButton") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("console:manage.features.invite.placeholder.emptySearchResultPlaceholder.title") }
                    subtitle={ [
                        t("console:manage.features.invite.placeholder.emptySearchResultPlaceholder.subTitle.0",
                            { query: searchQuery }),
                        t("console:manage.features.invite.placeholder.emptySearchResultPlaceholder.subTitle.1")
                    ] }
                />
            );
        }

        if (totalAdminDevList.length === 0) {
            return (
                <EmptyPlaceholder
                    action={
                        <PrimaryButton
                            onClick={ () => setShowWizard(true) }
                        >
                            <Icon name="add"/>
                            { t("console:manage.features.invite.placeholder.emptyResultPlaceholder.addButton") }
                        </PrimaryButton>
                    }
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    title={ t("console:manage.features.invite.placeholder.emptyResultPlaceholder.title") }
                    subtitle={ [
                        t("console:manage.features.invite.placeholder.emptyResultPlaceholder.subTitle.0"),
                        t("console:manage.features.invite.placeholder.emptyResultPlaceholder.subTitle.1"),
                        t("console:manage.features.invite.placeholder.emptyResultPlaceholder.subTitle.2")
                    ] }
                />
            );
        }

        return null;
    };

    /**
     * Handles updating the invitee role list.
     *
     * @param {string} inviteeID - ID of the invite.
     * @param {string[]} roleList - Role list of the invitee.
     */
    const handleInviteeRolesUpdate = (inviteeID: string, roleList: string[]) => {
        const inviteeData = {
            roles: roleList
        };

        updateInvite(inviteeID, inviteeData)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.invite.notifications.updateInvite.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.invite.notifications.updateInvite.success.message")
                }));
                setUpdateInviteList(true);

            }).catch((error) => {
            if (error?.response?.data?.description) {
                dispatch(addAlert({
                    description: error?.response?.data?.description ?? error?.response?.data?.detail
                        ?? t("console:manage.features.invite.notifications.updateInvite.error.description"),
                    level: AlertLevels.ERROR,
                    message: error?.response?.data?.message
                        ?? t("console:manage.features.invite.notifications.updateInvite.error.message")
                }));

                return;
            }

            dispatch(addAlert({
                description: t("console:manage.features.invite.notifications.updateInvite.genericError." +
                    "description"),
                level: AlertLevels.ERROR,
                message: t("console:manage.features.invite.notifications.updateInvite.genericError.message")
            }));
            });

        setShowRoleSelectionModal(false);
    };

    /**
     * Handle displaying the role selection modal.
     */
    const resolveInviteeRoleSelection = () => {
        return (
            <InviteeRoleSelection
                invitee={ roleSelectionInvite }
                showSelectionModal={ showRoleSelectionModal }
                handleSelectionModalClose={ () => setShowRoleSelectionModal(false) }
                handleInviteeRolesUpdate={ handleInviteeRolesUpdate }
            />
        );
    };

    return (
        <ListLayout
            // TODO add sorting functionality.
            advancedSearch={ (
                <AdvancedSearchWithBasicFilters
                    onFilter={ handleUserFilter }
                    filterAttributeOptions={ [
                        {
                            key: 1,
                            text: t("console:manage.features.invite.advancedSearch.form.dropdown." +
                                "filterAttributeOptions.email"),
                            value: "emails"
                        }
                    ] }
                    filterAttributePlaceholder={
                        t("console:manage.features.invite.advancedSearch.form.inputs.filterAttribute.placeholder")
                    }
                    filterConditionsPlaceholder={
                        t("console:manage.features.invite.advancedSearch.form.inputs.filterCondition" +
                            ".placeholder")
                    }
                    filterValuePlaceholder={
                        t("console:manage.features.invite.advancedSearch.form.inputs.filterValue" +
                            ".placeholder")
                    }
                    placeholder={ t("console:manage.features.invite.advancedSearch.placeholder") }
                    defaultSearchAttribute="email"
                    defaultSearchOperator="co"
                    triggerClearQuery={ triggerClearQuery }
                />
            ) }
            currentListSize={ finalAdminDevList.length }
            listItemLimit={ listItemLimit }
            //Todo add handler for items per page change.
            // onItemsPerPageDropdownChange={ handleItemsPerPageDropdownChange }
            onPageChange={ handlePaginationChange }
            showPagination={ totalAdminDevList.length > listItemLimit }
            showTopActionPanel={ isUserListRequestLoading || !(totalAdminDevList.length < 5) }
            totalPages={ Math.ceil(totalAdminDevList.length / listItemLimit) }
            totalListSize={ totalAdminDevList.length }
            paginationOptions={ {
                disableNextButton: !isNextPageAvailable,
                disablePreviousButton: !isPreviousPageAvailable
            } }
            rightActionPanel={
                <Dropdown
                    data-testid="user-mgt-user-list-userstore-dropdown"
                    selection
                    options={ [
                        {
                            key: "all",
                            text: "All",
                            value: "all"
                        },
                        {
                            key: InviteUserStatus.EXPIRED,
                            text: "Expired",
                            value: InviteUserStatus.EXPIRED
                        },
                        {
                            key: InviteUserStatus.PENDING,
                            text: "Pending",
                            value: InviteUserStatus.PENDING
                        }
                    ] }
                    onChange={ handleStatusChange }
                    defaultValue="all"
                />
            }
        >
            <DataTable<UserInviteInterface>
                padded
                isLoading={ isUserListRequestLoading }
                loadingStateOptions={
                    { count: 5, imageType: "square" }
                }
                placeholders={
                    showPlaceholders()
                }
                actions={ [
                    {
                        icon: (): SemanticICONS => "briefcase",
                        onClick: (e: SyntheticEvent, invite: UserInviteInterface): void => {
                            setRoleSelectionInvite(invite);
                            setShowRoleSelectionModal(true);
                        },
                        popupText: (): string => "roles",
                        renderer: "semantic-icon"
                    },
                    {
                        icon: (): SemanticICONS => "redo alternate",
                        onClick: (e: SyntheticEvent, invite: UserInviteInterface): void => {
                            setResendUserInvite(invite);
                            setShowResendConfirmationModal(true);
                        },
                        popupText: (): string => "resend",
                        renderer: "semantic-icon"
                    },
                    {
                        icon: (): SemanticICONS => "trash alternate",
                        onClick: (e: SyntheticEvent, invite: UserInviteInterface): void => {
                            setDeleteUserInvite(invite);
                            setShowDeleteModal(true);
                        },
                        popupText: (): string => "delete",
                        renderer: "semantic-icon"
                    }
                ] }
                data={ finalAdminDevList }
                columns={ [
                    {
                        allowToggleVisibility: false,
                        dataIndex: "email",
                        id: "email",
                        key: 0,
                        render: (invite: UserInviteInterface) => (
                            <Header as="h6" image>
                                <AppAvatar
                                    image={ (
                                        <AnimatedAvatar
                                            name={ invite.email }
                                            size="mini"
                                            data-testid={ `${testId}-item-image-inner` }
                                        />
                                    ) }
                                    size="mini"
                                    spaced="right"
                                    data-testid={ `${testId}-item-image` }
                                />
                                <Header.Content>
                                    { invite.email }
                                    <Header.Subheader>{ invite.roles.toString() }</Header.Subheader>
                                </Header.Content>
                            </Header>
                        ),
                        title: "Email"
                    },
                    {
                        allowToggleVisibility: false,
                        dataIndex: "status",
                        id: "status",
                        textAlign: "right",
                        key: 1,
                        render: (invite: UserInviteInterface) => (
                            determineInviteStatus(invite.status)
                        ),
                        title: "Status"
                    },
                    {
                        allowToggleVisibility: false,
                        dataIndex: "action",
                        id: "actions",
                        key: 3,
                        textAlign: "right",
                        title: "Actions"
                    }
                ] }
                onRowClick={ null }
                showHeader={ false }
                transparent={ !isUserListRequestLoading && (showPlaceholders() !== null) }
            />
            { resolveInviteeRoleSelection() }
            {
                showDeleteModal && (
                    <ConfirmationModal
                        data-testid={ `${testId}-confirmation-modal` }
                        onClose={ (): void => setShowDeleteModal(false) }
                        type="negative"
                        open={ showDeleteModal }
                        assertion={ deleteUserInvite.email }
                        assertionHint={
                            (
                                <p>
                                    <Trans
                                        i18nKey={ "console:manage.features.invite.confirmationModal.deleteInvite." +
                                        "assertionHint" }
                                        tOptions={ { name: deleteUserInvite.email } }
                                    >
                                        Please type <strong>{ deleteUserInvite.email }</strong> to confirm.
                                    </Trans>
                                </p>
                            )
                        }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteModal(false) }
                        onPrimaryActionClick={ (): void => revokeUserInvite(deleteUserInvite.id) }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${testId}-confirmation-modal-header` }>
                            { t("console:manage.features.invite.confirmationModal.deleteInvite.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-testid={ `${testId}-confirmation-modal-message` }
                            attached
                            warning
                        >
                            { t("console:manage.features.invite.confirmationModal.deleteInvite.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${testId}-confirmation-modal-content` }>
                            { t("console:manage.features.invite.confirmationModal.deleteInvite.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                showResendConfirmationModal && (
                    <ConfirmationModal
                        data-testid={ `${testId}-confirmation-modal` }
                        onClose={ (): void => setShowResendConfirmationModal(false) }
                        type="warning"
                        open={ showResendConfirmationModal }
                        assertion={ resendUserInvite.email }
                        assertionHint={
                            (
                                <p>
                                    <Trans
                                        i18nKey={ "console:manage.features.invite.confirmationModal.resendInvite." +
                                        "assertionHint" }
                                        tOptions={ { name: resendUserInvite.email } }
                                    >
                                        Please type <strong>{ resendUserInvite.email }</strong> to confirm.
                                    </Trans>
                                </p>
                            )
                        }
                        assertionType="input"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowResendConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => reSendUserInvite(resendUserInvite.id) }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${testId}-confirmation-modal-header` }>
                            { t("console:manage.features.invite.confirmationModal.resendInvite.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-testid={ `${testId}-confirmation-modal-message` }
                            attached
                            warning
                        >
                            { t("console:manage.features.invite.confirmationModal.resendInvite.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${testId}-confirmation-modal-content` }>
                            { t("console:manage.features.invite.confirmationModal.resendInvite.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </ListLayout>
    );
};

AdminDevPage.defaultProps = {
    "data-testid": "users"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AdminDevPage;
