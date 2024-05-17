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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    DataTable,
    EmptyPlaceholder,
    LinkButton,
    TableColumnInterface,
    UserAvatar
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, SyntheticEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Header, SemanticICONS } from "semantic-ui-react";
import {
    AppState,
    FeatureConfigInterface,
    UserListInterface,
    getEmptyPlaceholderIllustrations
} from "@wso2is/admin.core.v1";
import { deleteInvite, resendInvite } from "../../../api/invite";
import { UserAccountTypesMain } from "../../../constants";
import { InvitationStatus } from "../../../models";
import { deleteParentOrgInvite } from "../api/invite";
import { UserInviteInterface } from "../models/invite";

/**
 * Props for the Guest users list component.
 */
interface GuestUsersListInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    invitationStatusOption: InvitationStatus.PENDING | InvitationStatus.EXPIRED | InvitationStatus.ACCEPTED;
    guestUsersList: UserInviteInterface[];
    onboardedGuestUserList: UserListInterface;
    getGuestUsersList: () => void;
    isGuestUsersRequestLoading?: boolean;
    onEmptyListPlaceholderActionClick: () => void;
    searchQuery?: string;
    onSearchQueryClear?: () => void;
    userTypeSelection? :string;
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
        userTypeSelection,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const [ showDeleteModal, setShowDeleteModal ] = useState<boolean>(false);
    const [ deleteUserInvite, setDeleteUserInvite ] = useState<UserInviteInterface>(undefined);
    const [ showResendConfirmationModal, setShowResendConfirmationModal ] = useState<boolean>(false);
    const [ resendUserInvite, setResendUserInvite ] = useState<UserInviteInterface>(undefined);
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

    const handleParentOrgDeleteInvite = (traceID: string): Promise<void> => {

        return deleteParentOrgInvite(traceID)
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

        if (userTypeSelection === UserAccountTypesMain.EXTERNAL) {
            handleParentOrgDeleteInvite(traceID).finally(() => {
                setLoading(false);
                setShowDeleteModal(false);
                getGuestUsersList();
            });
        } else {
            handleDeleteInvite(traceID).finally(() => {
                setLoading(false);
                setShowDeleteModal(false);
                getGuestUsersList();
            });
        }
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
                        subtitle={
                            [ userTypeSelection === UserAccountTypesMain.EXTERNAL
                                ?  t("parentOrgInvitations:" +
                                    "emptyPlaceholder.noExpiredInvitations")
                                :   t("parentOrgInvitations:" +
                                    "emptyPlaceholder.noCollaboratorUserInvitations")
                            ]
                        }
                    />
                );
            } else {
                return (
                    <EmptyPlaceholder
                        image={ getEmptyPlaceholderIllustrations().newList }
                        imageSize="tiny"
                        subtitle={
                            [ userTypeSelection === UserAccountTypesMain.EXTERNAL
                                ? t("parentOrgInvitations:" +
                                "emptyPlaceholder.noPendingInvitations")
                                : "There are no collaborator users with pending invitations at the moment."
                            ]
                        }
                    />
                );
            }
        } else {
            return (
                <EmptyPlaceholder
                    image={ getEmptyPlaceholderIllustrations().newList }
                    imageSize="tiny"
                    subtitle={ [ t("parentOrgInvitations:" +
                    "emptyPlaceholder.noInvitations") ] }
                />
            );
        }

        return null;
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
                    <Header
                        image
                        as="h6"
                        className="header-with-icon"
                        data-componentid={ `${ componentId }-item-image` }
                    >
                        <UserAvatar
                            data-componentid={ `${ componentId }-item-image-inner` }
                            name={ invite.email }
                            size="mini"
                            image={ invite.email }
                            spaced="right"
                        />
                        <Header.Content>
                            { userTypeSelection === UserAccountTypesMain.EXTERNAL
                                ? invite?.username
                                : invite?.email
                            }
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

                    return (
                        <Header as="h6" data-componentid={ `${ componentId }-invite-status` }>
                            <Header.Content>
                                <Header.Subheader>
                                    { status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() }
                                </Header.Subheader>
                            </Header.Content>
                        </Header>
                    );
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
                isLoading={ isGuestUsersRequestLoading }
                loadingStateOptions={
                    { count: 5, imageType: "circular" }
                }
                placeholders={
                    showPlaceholders()
                }
                actions={ [
                    {
                        hidden: () =>
                            userTypeSelection === UserAccountTypesMain.EXTERNAL
                            || !hasRequiredScopes(
                                featureConfig?.users,
                                featureConfig?.users?.scopes?.update,
                                allowedScopes
                            ),
                        icon: (): SemanticICONS => "redo alternate",
                        onClick: (e: SyntheticEvent, invite: UserInviteInterface): void => {
                            setResendUserInvite(invite);
                            setShowResendConfirmationModal(true);
                        },
                        popupText: (): string => "resend",
                        renderer: "semantic-icon"
                    },
                    {
                        "data-componentid": `${ componentId }-users-list-item-delete-invitation-button`,
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
                onRowClick={ () => null }
                showHeader={ false }
                transparent={ !isGuestUsersRequestLoading && (showPlaceholders() !== null) }
            />
            {
                showDeleteModal && (
                    <ConfirmationModal
                        primaryActionLoading={ loading }
                        data-componentid={ `${componentId}-confirmation-modal` }
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
                        <ConfirmationModal.Header data-componentid={ `${componentId}-confirmation-modal-header` }>
                            { t("invite:confirmationModal.deleteInvite.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-componentid={ `${componentId}-confirmation-modal-message` }
                            attached
                            negative
                        >
                            { t("invite:confirmationModal.deleteInvite.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-componentid={ `${componentId}-confirmation-modal-content` }>
                            { t("invite:confirmationModal.deleteInvite.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
            {
                showResendConfirmationModal && (
                    <ConfirmationModal
                        primaryActionLoading={ loading }
                        data-componentid={ `${componentId}-confirmation-modal` }
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
                        <ConfirmationModal.Header data-componentid={ `${componentId}-confirmation-modal-header` }>
                            { t("invite:confirmationModal.resendInvite.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Message
                            data-componentid={ `${componentId}-confirmation-modal-message` }
                            attached
                            warning
                        >
                            { t("invite:confirmationModal.resendInvite.message") }
                        </ConfirmationModal.Message>
                        <ConfirmationModal.Content data-componentid={ `${componentId}-confirmation-modal-content` }>
                            { t("invite:confirmationModal.resendInvite.content") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};
