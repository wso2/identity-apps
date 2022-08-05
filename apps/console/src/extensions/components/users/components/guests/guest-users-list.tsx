/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    AnimatedAvatar,
    AppAvatar,
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    TableColumnInterface
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Header, SemanticICONS } from "semantic-ui-react";
import { InviteeRoleSelection } from "./invitee-role-selection";
import { 
    AppState, 
    FeatureConfigInterface, 
    UserListInterface, 
    getEmptyPlaceholderIllustrations 
} from "../../../../../features/core";
import { deleteInvite, resendInvite, updateInvite } from "../../api";
import { InvitationStatus, UserInviteInterface } from "../../models";

/**
 * Props for the Guest users list component.
 */
interface GuestUsersListInterface extends TestableComponentInterface {
    invitationStatusOption: InvitationStatus.PENDING | InvitationStatus.EXPIRED | InvitationStatus.ACCEPTED;
    guestUsersList: UserInviteInterface[];
    onboardedGuestUserList: UserListInterface;
    getGuestUsersList: () => void;
    isGuestUsersRequestLoading: boolean;
    onEmptyListPlaceholderActionClick: () => void;
    searchQuery?: string;
    onSearchQueryClear?: () => void;
}

/**
 * Guest users list component.
 *
 * @param {GuestUsersListInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const GuestUsersList: FunctionComponent<GuestUsersListInterface> = (
    props: GuestUsersListInterface
): ReactElement => {

    const {
        guestUsersList,
        getGuestUsersList,
        isGuestUsersRequestLoading,
        invitationStatusOption,
        searchQuery,
        onSearchQueryClear,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ showDeleteModal, setShowDeleteModal ] = useState<boolean>(false);
    const [ deleteUserInvite, setDeleteUserInvite ] = useState<UserInviteInterface>(undefined);
    const [ showResendConfirmationModal, setShowResendConfirmationModal ] = useState<boolean>(false);
    const [ resendUserInvite, setResendUserInvite ] = useState<UserInviteInterface>(undefined);
    const [ roleSelectionInvite, setRoleSelectionInvite ] = useState<UserInviteInterface>(undefined);
    const [ showRoleSelectionModal, setShowRoleSelectionModal ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ hideRoles ] = useState<boolean>(true);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const handleDeleteInvite = (traceID: string) => {

        deleteInvite(traceID)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.invite.notifications.deleteInvite.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.invite.notifications.deleteInvite.success.message")
                }));
                getGuestUsersList();

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

    const handleResendInvite = (traceID: string) => {

        resendInvite(traceID)
            .then(() => {
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

    const revokeUserInvite = (traceID: string): void => {
        handleDeleteInvite(traceID);
        setShowDeleteModal(false);
        getGuestUsersList();
    };

    const handleResendUserInvite = (traceID: string): void => {
        handleResendInvite(traceID);
        setShowResendConfirmationModal(false);
        getGuestUsersList();
    };

    /**
     * Shows list placeholders.
     *
     * @return {React.ReactElement}
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && guestUsersList?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
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

        if (guestUsersList?.length === 0) {

            if (invitationStatusOption === InvitationStatus.EXPIRED) {
                return (
                    <EmptyPlaceholder
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        subtitle={ [ "There are no collaborator users with expired invitations at the moment." ] }
                    />
                );
            } else {
                return (
                    <EmptyPlaceholder
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        subtitle={ [ "There are no collaborator users with pending invitations at the moment." ] }
                    />
                );
            }
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

        setIsSubmitting(true);

        updateInvite(inviteeID, inviteeData)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:manage.features.invite.notifications.updateInvite.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:manage.features.invite.notifications.updateInvite.success.message")
                }));
                getGuestUsersList();

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
            })
            .finally(() => {
                setIsSubmitting(false);
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
                readOnly={ !hasRequiredScopes(
                    featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes) }
                isSubmitting={ isSubmitting }
            />
        );
    };

    /**
     * Resolves data table columns.
     *
     * @return {TableColumnInterface[]}
     */
    const resolveTableColumns = (): TableColumnInterface[] => {
        const defaultColumns: TableColumnInterface[] = [
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
                                    data-testid={ `${ testId }-item-image-inner` }
                                />
                            ) }
                            size="mini"
                            spaced="right"
                            data-testid={ `${ testId }-item-image` }
                            data-suppress=""
                        />
                        <Header.Content>
                            { invite.email }
                            <Header.Subheader>{ invite.roles.toString() }</Header.Subheader>
                        </Header.Content>
                    </Header>
                ),
                title: "User"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "status",
                id: "status",
                key: 1,
                render: (invite: UserInviteInterface) => {
                    const status: string = invite.status;
                    return status.charAt(0).toUpperCase() + status.substr(1).toLowerCase();
                },
                textAlign: "left",
                title: "Invitation Status"
            },
            {
                allowToggleVisibility: false,
                dataIndex: "action",
                id: "actions",
                key: 3,
                textAlign: "right",
                title: ""
            }
        ];
        return defaultColumns;
    };

    return (
        <>
            <DataTable<UserInviteInterface>
                showSearch={ true }
                padded
                isLoading={ isGuestUsersRequestLoading }
                loadingStateOptions={
                    { count: 5, imageType: "square" }
                }
                placeholders={
                    showPlaceholders()
                }
                actions={ [
                    {
                        hidden: () => hideRoles,
                        icon: (): SemanticICONS => "briefcase",
                        onClick: (e: SyntheticEvent, invite: UserInviteInterface): void => {
                            setRoleSelectionInvite(invite);
                            setShowRoleSelectionModal(true);
                        },
                        popupText: (): string => "roles",
                        renderer: "semantic-icon"
                    },
                    {
                        hidden: () => !hasRequiredScopes(
                            featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes),
                        icon: (): SemanticICONS => "redo alternate",
                        onClick: (e: SyntheticEvent, invite: UserInviteInterface): void => {
                            setResendUserInvite(invite);
                            setShowResendConfirmationModal(true);
                        },
                        popupText: (): string => "resend",
                        renderer: "semantic-icon"
                    },
                    {
                        hidden: () => !hasRequiredScopes(
                            featureConfig?.users, featureConfig?.users?.scopes?.update, allowedScopes),
                        icon: (): SemanticICONS => "trash alternate",
                        onClick: (e: SyntheticEvent, invite: UserInviteInterface): void => {
                            setDeleteUserInvite(invite);
                            setShowDeleteModal(true);
                        },
                        popupText: (): string => "delete",
                        renderer: "semantic-icon"
                    }
                ] }
                data={ guestUsersList }
                columns={ resolveTableColumns() }
                onRowClick={ null }
                showHeader={ true }
                transparent={ !isGuestUsersRequestLoading && (showPlaceholders() !== null) }
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
                        assertionHint={ t("console:manage.features.invite.confirmationModal.deleteInvite." +
                        "assertionHint") }
                        assertionType="checkbox"
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
                            negative
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
                        assertionHint={ t("console:manage.features.invite.confirmationModal.resendInvite." +
                                        "assertionHint") }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowResendConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleResendUserInvite(resendUserInvite.id) }
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
        </>
    );
};
