/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import { useApplicationList } from "@wso2is/admin.applications.v1/api/application";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants/application-management";
import {  UserBasicInterface, UserRoleInterface } from "@wso2is/admin.core.v1/models/users";
import { AppState } from "@wso2is/admin.core.v1/store";
import { administratorConfig } from "@wso2is/admin.extensions.v1/configs/administrator";
import { updateRoleDetails, updateUsersForRole } from "@wso2is/admin.roles.v2/api/roles";
import useGetRolesList from "@wso2is/admin.roles.v2/api/use-get-roles-list";
import { PatchRoleDataInterface } from "@wso2is/admin.roles.v2/models/roles";
import { getUsersList, sendInvite } from "@wso2is/admin.users.v1/api";
import { AdminAccountTypes, UserManagementConstants } from "@wso2is/admin.users.v1/constants/user-management-constants";
import { UserInviteInterface, UserListInterface } from "@wso2is/admin.users.v1/models/user";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    RolesInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ConfirmationModal,
    LinkButton,
    PrimaryButton,
    useWizardAlert
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Modal } from "semantic-ui-react";
import { AddAdminUserBasic, AddAdminUserBasicFormRef } from "./steps/admin-user-basic";
import { InternalAdminFormDataInterface } from "../models/invite";
import { isAdminUser } from "../utils/administrators";

interface AddUserWizardPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    closeWizard: () => void;
    onInvitationSendSuccessful?: () => void;
    adminTypeSelection? :string;
    /**
     * On user update callback.
     *
     * @param userId - ID of the updated user.
     */
    onUserUpdate?: () => void;
}

/**
 * New Administrator creation wizard.
 *
 * @param props - Props injected to the component.
 * @returns Add administrator wizard component.
 */
export const AddAdministratorWizard: FunctionComponent<AddUserWizardPropsInterface> = (
    props: AddUserWizardPropsInterface
): ReactElement => {

    const {
        adminTypeSelection,
        closeWizard,
        onInvitationSendSuccessful,
        onUserUpdate,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName);

    const adminUserBasicFormRef: MutableRefObject<AddAdminUserBasicFormRef> = useRef<AddAdminUserBasicFormRef>(null);

    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isFinishButtonDisabled, setFinishButtonDisabled ] = useState<boolean>(false);
    const [ showAdminRoleAddConfirmationModal, setShowAdminRoleAddConfirmationModal ] = useState<boolean>(false);
    const [ confirmationModalLoading, setConfirmationModalLoading ] = useState<boolean>(false);
    const [ adminRoleId, setAdminRoleId ] = useState<string>(null);
    const [ selectedUser, setSelectedUser ] = useState<UserBasicInterface>(null);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const userRolesV3FeatureEnabled: boolean = useSelector(
        (state: AppState) => state?.config?.ui?.features?.userRolesV3?.enabled
    );
    const updateUsersForRoleFunction: (roleId: string, data: PatchRoleDataInterface) => Promise<any> =
        userRolesV3FeatureEnabled ? updateUsersForRole : updateRoleDetails;

    /**
     * Retrieve the application data for the console application, filtering by name.
     */
    const {
        data: applicationListData,
        isLoading: isApplicationListRequestLoading,
        error: applicationListFetchRequestError
    } = useApplicationList(
        null,
        null,
        null,
        `name eq ${ApplicationManagementConstants.CONSOLE_APP_NAME}`
    );

    /**
     * Build the roles filter to search for roles specific to the console application.
     */
    const roleSearchFilter: string = useMemo(() => {
        if (applicationListData?.applications?.length > 0) {
            return `audience.value eq ${applicationListData?.applications[0]?.id}`;
        }

        return null;
    }, [ applicationListData ]);

    /**
     * Retrieve the roles list for the console application.
     */
    const {
        data: consoleRolesList,
        isLoading: isConsoleRolesListRequestLoading,
        error: consoleRolesListFetchRequestError
    } = useGetRolesList(
        null,
        null,
        roleSearchFilter,
        null,
        !!roleSearchFilter
    );

    /**
     * Dispatches error notifications for application list fetch request error.
     */
    useEffect(() => {
        if (!applicationListFetchRequestError) {
            return;
        }

        if (applicationListFetchRequestError.response
            && applicationListFetchRequestError.response.data
            && applicationListFetchRequestError.response.data.description) {
            dispatch(addAlert({
                description: applicationListFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications." +
                    "fetchApplications.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchApplications" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications." +
                "fetchApplications.genericError.message")
        }));
    }, [ applicationListFetchRequestError ]);

    /**
     * Dispatches error notifications for roles list fetch request error.
     */
    useEffect(() => {
        if (!consoleRolesListFetchRequestError) {
            return;
        }

        if (consoleRolesListFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: consoleRolesListFetchRequestError?.response?.data?.description
                    ?? consoleRolesListFetchRequestError?.response?.data?.detail
                        ?? t("roles:notifications.fetchRoles.error.description"),
                level: AlertLevels.ERROR,
                message: consoleRolesListFetchRequestError?.response?.data?.message
                    ?? t("roles:notifications.fetchRoles.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("roles:notifications.fetchRoles.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("roles:notifications.fetchRoles.genericError.message")
        }));
    }, [ consoleRolesListFetchRequestError ]);

    /**
     * Get the administrator role from the roles list.
     */
    useEffect(() => {
        if (!consoleRolesList || consoleRolesList.Resources.length <= 0) {
            return;
        }

        const adminRole: RolesInterface = consoleRolesList.Resources.find((role: RolesInterface) =>
            role.displayName === administratorConfig.adminRoleName);

        // If the admin role is not found, show an error message.
        if (!adminRole) {
            dispatch(addAlert({
                description: t(
                    "extensions:manage.users.wizard.addAdmin.internal.noAdminRoleError.description"
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "extensions:manage.users.wizard.addAdmin.internal.noAdminRoleError.message"
                )
            }));
        } else {
            // Else, set the admin role ID.
            setAdminRoleId(adminRole?.id);
        }
    }, [ consoleRolesList ]);

    /**
     * This function handles assigning the roles to the user.
     */
    const assignUserRoles = async (users: UserBasicInterface[], roles: RolesInterface[]) => {
        const roleIds: string[] = [];
        const userList: {display: string, value: string}[] = [];

        if (users.length > 0) {
            users.map((user: UserBasicInterface) => {
                userList.push({
                    display: user.userName,
                    value: user.id
                });
            });
        }

        // Payload for the update role request.
        const roleData: PatchRoleDataInterface = userRolesV3FeatureEnabled ? {
            Operations: [
                {
                    op: "add",
                    value: userList
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        } : {
            Operations: [
                {
                    op: "add",
                    value: {
                        users: userList
                    }
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        if (roles.length > 0) {
            roles.map((role: RolesInterface) => {
                roleIds.push(role.id);
            });

            for (const roleId of roleIds) {
                setIsSubmitting(true);

                await updateUsersForRoleFunction(roleId, roleData)
                    .catch((error: AxiosError) => {
                        if (!error.response || error.response.status === 401) {
                            setAlert({
                                description: t(
                                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.error.description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.error.message"
                                )
                            });
                        } else if (error.response && error.response.data && error.response.data.detail) {
                            setAlert({
                                description: t(
                                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.error.description",
                                    { description: error.response.data.detail }
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.error.message"
                                )
                            });
                        } else {
                            // Generic error message
                            setAlert({
                                description: t(
                                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.genericError" +
                                    ".description"
                                ),
                                level: AlertLevels.ERROR,
                                message: t(
                                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.genericError.message"
                                )
                            });
                        }
                    })
                    .finally(() => {
                        setIsSubmitting(false);
                    });
            }
            dispatch(addAlert({
                description: t(
                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.success.description"
                ),
                level: AlertLevels.SUCCESS,
                message: t(
                    "extensions:manage.users.wizard.addAdmin.internal.updateRole.success.message"
                )
            }));
            closeWizard();
            onUserUpdate();
        }
    };

    /**
     * Assigns the admin role to the user.
     */
    const assignAdminRole = () => {
        if (!selectedUser || !adminRoleId) {
            return;
        }

        // Payload for the update role request.
        const roleData: PatchRoleDataInterface = userRolesV3FeatureEnabled ? {
            Operations: [
                {
                    op: "add",
                    value: [
                        {
                            display: selectedUser?.userName,
                            value: selectedUser?.id
                        }
                    ]
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        } : {
            Operations: [
                {
                    op: "add",
                    value: {
                        users: [
                            {
                                display: selectedUser?.userName,
                                value: selectedUser?.id
                            }
                        ]
                    }
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        setConfirmationModalLoading(true);

        updateUsersForRoleFunction(adminRoleId, roleData)
            .then(() => {
                dispatch(addAlert({
                    description: t(
                        "extensions:manage.users.wizard.addAdmin.internal.updateRole.success.description"
                    ),
                    level: AlertLevels.SUCCESS,
                    message: t(
                        "extensions:manage.users.wizard.addAdmin.internal.updateRole.success.message"
                    )
                }));
                onUserUpdate();
            })
            .catch((error: AxiosError) => {
                if (!error.response || error.response.status === 401) {
                    setAlert({
                        description: t(
                            "extensions:manage.users.wizard.addAdmin.internal.updateRole.error.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "extensions:manage.users.wizard.addAdmin.internal.updateRole.error.message"
                        )
                    });
                } else if (error.response && error.response.data && error.response.data.detail) {
                    setAlert({
                        description: t(
                            "extensions:manage.users.wizard.addAdmin.internal.updateRole.error.description",
                            { description: error.response.data.detail }
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "extensions:manage.users.wizard.addAdmin.internal.updateRole.error.message"
                        )
                    });
                } else {
                    // Generic error message
                    setAlert({
                        description: t(
                            "extensions:manage.users.wizard.addAdmin.internal.updateRole.genericError.description"
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            "extensions:manage.users.wizard.addAdmin.internal.updateRole.genericError.message"
                        )
                    });
                }
            })
            .finally(() => {
                setIsSubmitting(false);
                setConfirmationModalLoading(false);
                closeWizard();
            });
    };

    /**
     * This function handles sending the invitation to the external admin user.
     */
    const sendExternalInvitation = (invite: UserInviteInterface) => {
        if (invite != null) {
            setIsSubmitting(true);

            sendInvite(invite)
                .then(() => {
                    dispatch(addAlert({
                        description: t(
                            "console:manage.features.invite.notifications.sendInvite.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "console:manage.features.invite.notifications.sendInvite.success.message"
                        )
                    }));
                    setIsSubmitting(false);
                    closeWizard();
                    onInvitationSendSuccessful();
                })
                .catch((error: AxiosError) => {
                    // Axios throws a generic `Network Error` for 401 status.
                    // As a temporary solution, a check to see if a response
                    // is available has be used.
                    if (!error.response || error.response.status === 401) {
                        setIsSubmitting(false);
                        closeWizard();
                        dispatch(addAlert({
                            description: t(
                                "console:manage.features.invite.notifications.sendInvite.error.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.invite.notifications.sendInvite.error.message"
                            )
                        }));
                    } else if (error.response.status === 403 &&
                        error?.response?.data?.code === UserManagementConstants.ERROR_COLLABORATOR_USER_LIMIT_REACHED) {
                        setIsSubmitting(false);
                        closeWizard();
                        dispatch(addAlert({
                            description: t(
                                "extensions:manage.invite.notifications.sendInvite.limitReachError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "extensions:manage.invite.notifications.sendInvite.limitReachError.message"
                            )
                        }));
                    } else if (error.response.status === 409) {
                        // User already exists in the system.
                        // We need to check if this user is having the Administrator role.
                        handleAlreadyExistingUser(invite);
                    } else if (error?.response?.data?.description) {
                        setIsSubmitting(false);
                        closeWizard();
                        dispatch(addAlert({
                            description: t(
                                "console:manage.features.invite.notifications.sendInvite.error.description",
                                { description: error.response.data.description }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.invite.notifications.sendInvite.error.message"
                            )
                        }));
                    } else {
                        setIsSubmitting(false);
                        closeWizard();
                        // Generic error message
                        dispatch(addAlert({
                            description: t(
                                "console:manage.features.invite.notifications.sendInvite.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "console:manage.features.invite.notifications.sendInvite.genericError.message"
                            )
                        }));
                    }
                });
        }
    };

    /**
     * Handles the already existing user.
     *
     * @param error - Axios error response.
     */
    const handleAlreadyExistingUser = (invite: UserInviteInterface): void => {
        if (!invite?.email) {
            setIsSubmitting(false);

            return;
        }

        getUsersList(
            1,
            0,
            `userName eq ${invite.email}`,
            null,
            primaryUserStoreDomainName,
            UserManagementConstants.GROUPS_ATTRIBUTE
        )
            .then((response: UserListInterface) => {
                if (response.totalResults === 0) {
                    dispatch(
                        addAlert({
                            description: t(
                                "extensions:manage.invite.notifications.sendInvite." +
                                    "inviteAlreadyExistsError.description",
                                { userName: invite.email }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "extensions:manage.invite.notifications.sendInvite.inviteAlreadyExistsError.message"
                            )
                        })
                    );
                    setIsSubmitting(false);
                    closeWizard();

                    return;
                }

                const existingUser: UserBasicInterface = response.Resources[0];

                if (isAdminUser(existingUser)) {
                    dispatch(
                        addAlert({
                            description: t(
                                "extensions:manage.invite.notifications.sendInvite.userAlreadyExistsError.description",
                                { userName: invite.email }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "extensions:manage.invite.notifications.sendInvite.userAlreadyExistsError.message"
                            )
                        })
                    );
                    setIsSubmitting(false);
                    closeWizard();

                    return;
                }

                const userHasAConsoleRole: boolean = existingUser.roles?.some((role: UserRoleInterface) =>
                    consoleRolesList?.Resources?.some((consoleRole: RolesInterface) => consoleRole.id === role.value)
                );

                if (userHasAConsoleRole) {
                    const assignedRoles: RolesInterface[] = invite?.roles
                        .map((roleDisplayName: string) =>
                            consoleRolesList?.Resources?.find(
                                (role: RolesInterface) => role?.displayName === roleDisplayName
                            )
                        )
                        .filter(Boolean);

                    assignUserRoles([ existingUser ], assignedRoles);

                    return;
                }

                setIsSubmitting(false);
                setSelectedUser(existingUser);
                setShowAdminRoleAddConfirmationModal(true);
            })
            .catch(() => {
                dispatch(
                    addAlert({
                        description: t("users:notifications.fetchUsers.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: t("users:notifications.fetchUsers.genericError.message")
                    })
                );
                setIsSubmitting(false);
            });
    };

    /**
     * This function handles sending the invitation to the external admin user.
     */
    const sendInternalInvitation = (data: InternalAdminFormDataInterface) => {
        assignUserRoles(data?.checkedUsers, data?.selectedRoles);
    };

    return (
        <>
            <Modal
                data-componentid={ componentId }
                data-testid={ testId }
                open={ true }
                className="wizard application-create-wizard"
                dimmer="blurring"
                size="small"
                onClose={ closeWizard }
                closeOnDimmerClick={ false }
                closeOnEscape
            >
                <Modal.Header className="wizard-header">
                    { adminTypeSelection === AdminAccountTypes.INTERNAL
                        ? t("extensions:manage.users.wizard.addAdmin.internal.title")
                        : t("extensions:manage.users.wizard.addAdmin.external.title")
                    }
                </Modal.Header>
                <Modal.Content className={ "content-container" } scrolling>
                    { alert && alertComponent }
                    <AddAdminUserBasic
                        ref={ adminUserBasicFormRef }
                        administratorType={ adminTypeSelection }
                        onSubmit={ (values: InternalAdminFormDataInterface | UserInviteInterface) =>
                            (adminTypeSelection === AdminAccountTypes.INTERNAL)
                                ? sendInternalInvitation(values as InternalAdminFormDataInterface)
                                : sendExternalInvitation(values as UserInviteInterface)
                        }
                        setFinishButtonDisabled={ setFinishButtonDisabled }
                        consoleRolesList={ consoleRolesList?.Resources }
                        isConsoleRolesListLoading={
                            isApplicationListRequestLoading
                            || isConsoleRolesListRequestLoading
                        }
                    />
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton
                                    data-componentid={ `${ componentId }-cancel-button` }
                                    data-testid={ `${ testId }-cancel-button` }
                                    floated="left"
                                    onClick={ () => closeWizard() }
                                >
                                    { t("common:cancel") }
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <PrimaryButton
                                    data-componentid={ `${ componentId }-finish-button` }
                                    data-testid={ `${ testId }-finish-button` }
                                    floated="right"
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting || isFinishButtonDisabled }
                                    onClick={ () => adminUserBasicFormRef?.current?.triggerSubmit() }
                                >
                                    {
                                        adminTypeSelection === AdminAccountTypes.INTERNAL
                                            ? t("extensions:manage.features.user.addUser.add")
                                            : t("extensions:manage.features.user.addUser.invite")
                                    }
                                </PrimaryButton>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal>
            {
                selectedUser && adminRoleId && (
                    <ConfirmationModal
                        primaryActionLoading={ confirmationModalLoading }
                        data-componentid={ `${ componentId }-confirmation-modal` }
                        onClose={ (): void => {
                            setShowAdminRoleAddConfirmationModal(false);
                        } }
                        type="warning"
                        open={ showAdminRoleAddConfirmationModal }
                        assertionHint={
                            t("extensions:manage.invite.assignAdminUser.confirmationModal.assertionHint") }
                        assertionType="checkbox"
                        primaryAction="Confirm"
                        secondaryAction="Cancel"
                        onSecondaryActionClick={ (): void => {
                            setShowAdminRoleAddConfirmationModal(false);
                            setAlert(null);
                        } }
                        onPrimaryActionClick={ (): void => {
                            setConfirmationModalLoading(true);
                            assignAdminRole();
                        } }
                        closeOnDimmerClick={ false }
                    >
                        <ConfirmationModal.Header data-componentid={ `${ componentId }-confirmation-modal-header` }>
                            { t("extensions:manage.invite.assignAdminUser.confirmationModal.header") }
                        </ConfirmationModal.Header>
                        <ConfirmationModal.Content
                            data-componentid={ `${ componentId }-confirmation-modal-message` }
                            attached
                            warning
                        >
                            { t("extensions:manage.invite.assignAdminUser.confirmationModal.message") }
                        </ConfirmationModal.Content>
                    </ConfirmationModal>
                )
            }
        </>
    );
};
