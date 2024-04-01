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
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Header, SemanticICONS } from "semantic-ui-react";
import { InviteeRoleSelection } from "./invitee-role-selection";
import {
    AppState,
    FeatureConfigInterface,
    UserListInterface,
    getEmptyPlaceholderIllustrations
} from "../../../../../admin.core.v1";
import { InvitationStatus, UserInviteInterface } from "../../../../../admin-users-v1/models";
import { deleteInvite, resendInvite, updateInvite } from "../../../../../admin-users-v1/api";


/**
 * Props for the Guest users list component.
 */
interface GuestUsersListInterface extends TestableComponentInterface {
    invitationStatusOption: InvitationStatus.PENDING | InvitationStatus.EXPIRED | InvitationStatus.ACCEPTED;
    guestUsersList: UserInviteInterface[];
    onboardedGuestUserList: UserListInterface;
    getGuestUsersList: () => void;
    isGuestUsersRequestLoading?: boolean;
    onEmptyListPlaceholderActionClick: () => void;
    searchQuery?: string;
    onSearchQueryClear?: () => void;
}

/**
 * Guest users list component.
 *
 * @param props - Props injected to the component.
 * @returns Guest users list component.
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
    const dispatch: Dispatch = useDispatch();

    const [ showDeleteModal, setShowDeleteModal ] = useState<boolean>(false);
    const [ deleteUserInvite, setDeleteUserInvite ] = useState<UserInviteInterface>(undefined);
    const [ showResendConfirmationModal, setShowResendConfirmationModal ] = useState<boolean>(false);
    const [ resendUserInvite, setResendUserInvite ] = useState<UserInviteInterface>(undefined);
    const [ roleSelectionInvite, setRoleSelectionInvite ] = useState<UserInviteInterface>(undefined);
    const [ showRoleSelectionModal, setShowRoleSelectionModal ] = useState<boolean>(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ hideRoles ] = useState<boolean>(true);
    const [ loading, setLoading ] = useState(false);

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state.config.ui.features);

    const handleDeleteInvite = (traceID: string): Promise<void> => {

        return deleteInvite(traceID)
            .then(() => {
                dispatch(addAlert({
                    description: t("invite:notifications.deleteInvite.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("invite:notifications.deleteInvite.success.message")
                }));
                getGuestUsersList();

            }).catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                        ?? t("invite:notifications.deleteInvite.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                        ?? t("invite:notifications.deleteInvite.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("invite:notifications.deleteInvite.genericError." +
                    "description"),
                    level: AlertLevels.ERROR,
                    message: t("invite:notifications.deleteInvite.genericError.message")
                }));
            });
    };

    const handleResendInvite = (traceID: string): Promise<void> => {

        return resendInvite(traceID)
            .then(() => {
                dispatch(addAlert({
                    description: t("invite:notifications.resendInvite.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("invite:notifications.resendInvite.success.message")
                }));

            }).catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                        ?? t("invite:notifications.resendInvite.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                        ?? t("invite:notifications.resendInvite.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("invite:notifications.resendInvite.genericError." +
                    "description"),
                    level: AlertLevels.ERROR,
                    message: t("invite:notifications.resendInvite.genericError.message")
                }));
            });
    };

    const revokeUserInvite = (traceID: string): void => {
        setLoading(true);
        handleDeleteInvite(traceID).finally(() => {
            setLoading(false);
            setShowDeleteModal(false);
            getGuestUsersList();
        });
    };

    const handleResendUserInvite = (traceID: string): void => {
        setLoading(true);
        handleResendInvite(traceID).finally(() => {
            setLoading(false);
            setShowResendConfirmationModal(false);
            getGuestUsersList();
        });
    };

    /**
     * Shows list placeholders.
     *
     * @returns Empty placeholder.
     */
    const showPlaceholders = (): ReactElement => {
        // When the search returns empty.
        if (searchQuery && guestUsersList?.length === 0) {
            return (
                <EmptyPlaceholder
                    action={ (
                        <LinkButton onClick={ onSearchQueryClear }>
                            { t("invite:placeholder.emptySearchResultPlaceholder.clearButton") }
                        </LinkButton>
                    ) }
                    image={ getEmptyPlaceholderIllustrations().emptySearch }
                    imageSize="tiny"
                    title={ t("invite:placeholder.emptySearchResultPlaceholder.title") }
                    subtitle={ [
                        t("invite:placeholder.emptySearchResultPlaceholder.subTitle.0",
                            { query: searchQuery }),
                        t("invite:placeholder.emptySearchResultPlaceholder.subTitle.1")
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
     * @param inviteeID - ID of the invite.
     * @param roleList - Role list of the invitee.
     */
    const handleInviteeRolesUpdate = (inviteeID: string, roleList: string[]) => {
        const inviteeData: {
            roles: string[];
        } = {
            roles: roleList
        };

        setIsSubmitting(true);

        updateInvite(inviteeID, inviteeData)
            .then(() => {
                dispatch(addAlert({
                    description: t("invite:notifications.updateInvite.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("invite:notifications.updateInvite.success.message")
                }));
                getGuestUsersList();

            }).catch((error: AxiosError) => {
                if (error?.response?.data?.description) {
                    dispatch(addAlert({
                        description: error?.response?.data?.description ?? error?.response?.data?.detail
                        ?? t("invite:notifications.updateInvite.error.description"),
                        level: AlertLevels.ERROR,
                        message: error?.response?.data?.message
                        ?? t("invite:notifications.updateInvite.error.message")
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: t("invite:notifications.updateInvite.genericError." +
                    "description"),
                    level: AlertLevels.ERROR,
                    message: t("invite:notifications.updateInvite.genericError.message")
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
     * @returns Resolved columns.
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
                        primaryActionLoading={ loading }
                        data-testid={ `${testId}-confirmation-modal` }
                        onClose={ (): void => setShowDeleteModal(false) }
                        type="negative"
                        open={ showDeleteModal }
                        assertion={ deleteUserInvite.email }
                        assertionHint={ t("invite:confirmationModal.deleteInvite." +
                        "assertionHint") }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowDeleteModal(false) }
                        onPrimaryActionClick={ (): void => revokeUserInvite(deleteUserInvite.id) }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${testId}-confirmation-modal-header` }>
                            { t("invite:confirmationModal.deleteInvite.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-testid={ `${testId}-confirmation-modal-message` }
                            attached
                            negative
                        >
                            { t("invite:confirmationModal.deleteInvite.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${testId}-confirmation-modal-content` }>
                            { t("invite:confirmationModal.deleteInvite.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                showResendConfirmationModal && (
                    <ConfirmationModal
                        primaryActionLoading={ loading }
                        data-testid={ `${testId}-confirmation-modal` }
                        onClose={ (): void => setShowResendConfirmationModal(false) }
                        type="warning"
                        open={ showResendConfirmationModal }
                        assertion={ resendUserInvite.email }
                        assertionHint={ t("invite:confirmationModal.resendInvite." +
                                        "assertionHint") }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => setShowResendConfirmationModal(false) }
                        onPrimaryActionClick={ (): void => handleResendUserInvite(resendUserInvite.id) }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-testid={ `${testId}-confirmation-modal-header` }>
                            { t("invite:confirmationModal.resendInvite.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-testid={ `${testId}-confirmation-modal-message` }
                            attached
                            warning
                        >
                            { t("invite:confirmationModal.resendInvite.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-testid={ `${testId}-confirmation-modal-content` }>
                            { t("invite:confirmationModal.resendInvite.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};
