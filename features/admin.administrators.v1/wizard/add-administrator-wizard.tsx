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

import { FeatureAccessConfigInterface } from "@wso2is/access-control";
import { useApplicationList } from "@wso2is/admin.applications.v1/api/application";
import { ApplicationManagementConstants } from "@wso2is/admin.applications.v1/constants/application-management";
import { AppState, UserBasicInterface } from "@wso2is/admin.core.v1";
import { administratorConfig } from "@wso2is/admin.extensions.v1/configs/administrator";
import { updateRoleDetails } from "@wso2is/admin.roles.v2/api/roles";
import useGetRolesList from "@wso2is/admin.roles.v2/api/use-get-roles-list";
import { PatchRoleDataInterface } from "@wso2is/admin.roles.v2/models/roles";
import { sendInvite, useUsersList } from "@wso2is/admin.users.v1/api";
import { getUserWizardStepIcons } from "@wso2is/admin.users.v1/configs/ui";
import { AdminAccountTypes, UserManagementConstants } from "@wso2is/admin.users.v1/constants/user-management-constants";
import { UserInviteInterface } from "@wso2is/admin.users.v1/models";
import {
    AlertLevels,
    IdentifiableComponentInterface,
    RolesInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import {
    ConfirmationModal,
    GenericIconProps,
    LinkButton,
    PrimaryButton,
    useWizardAlert
} from "@wso2is/react-components";
import { AxiosError } from "axios";
import intersection from "lodash-es/intersection";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { AddAdminUserBasic } from "./steps/admin-user-basic";
import { InternalAdminFormDataInterface } from "../models/invite";
import { isAdminUser } from "../utils/administrators";

interface AddUserWizardPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    closeWizard: () => void;
    compact?: boolean;
    currentStep?: number;
    updateList?: () => void;
    rolesList?: any;
    emailVerificationEnabled: boolean;
    requiredSteps?: WizardStepsFormTypes[] | string[];
    submitStep?: WizardStepsFormTypes | string;
    showStepper?: boolean;
    onSuccessfulUserAddition?: (id: string) => void;
    onInvitationSendSuccessful?: () => void;
    conditionallyShowStepper?: boolean;
    adminTypeSelection? :string;
    /**
     * On user update callback.
     *
     * @param userId - ID of the updated user.
     */
    onUserUpdate?: () => void;
}

/**
 * Interface for wizard step.
 */
interface WizardStepInterface {
    content: ReactElement;
    icon: GenericIconProps | any;
    name: string;
    title: string;
}

/**
 * Enum for wizard steps form types.
 * @readonly
 */
export enum WizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails"
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
        currentStep,
        requiredSteps,
        onInvitationSendSuccessful,
        onUserUpdate,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const administratorsFeatureConfig: FeatureAccessConfigInterface =
        useSelector((state: AppState) => state?.config?.ui?.features?.administrators);
    const consoleSettingsFeatureConfig: FeatureAccessConfigInterface =
        useSelector((state: AppState) => state?.config?.ui?.features?.consoleSettings);
    const primaryUserStoreDomainName: string = useSelector((state: AppState) =>
        state?.config?.ui?.primaryUserStoreDomainName);

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();

    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>([]);
    const [ isStepsUpdated, setIsStepsUpdated ] = useState(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isFinishButtonDisabled, setFinishButtonDisabled ] = useState<boolean>(false);
    const [ searchQuery, setSearchQuery ] = useState<string>(null);
    const [ invite, setInvite ] = useState<UserInviteInterface>(null);
    const [ showAdminRoleAddConfirmationModal, setShowAdminRoleAddConfirmationModal ] = useState<boolean>(false);
    const [ confirmationModalLoading, setConfirmationModalLoading ] = useState<boolean>(false);
    const [ adminRoleId, setAdminRoleId ] = useState<string>(null);
    const [ selectedUser, setSelectedUser ] = useState<UserBasicInterface>(null);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    // Excluding groups and roles from getUserList API call to improve performance.
    const excludedAttributes: string = UserManagementConstants.GROUPS_ATTRIBUTE;

    const {
        data: originalAdminUserList,
        error: adminUserListFetchRequestError
    } = useUsersList(
        1,
        0,
        searchQuery,
        null,
        primaryUserStoreDomainName,
        excludedAttributes,
        !!searchQuery
    );

    /**
     * Retrieve the application data for the console application, filtering by name.
     */
    const {
        data: applicationListData ,
        error: applicationListFetchRequestError
    } = useApplicationList(
        null,
        null,
        null,
        `name eq ${ApplicationManagementConstants.CONSOLE_APP_NAME}`,
        !!searchQuery
    );

    /**
     * Build the roles filter to search for roles specific to the console application.
     */
    const roleSearchFilter: string = useMemo(() => {
        if (applicationListData?.applications && applicationListData?.applications?.length > 0) {
            return `audience.value eq ${applicationListData?.applications[0]?.id}`;
        }

        return null;
    }, [ applicationListData ]);

    /**
     * Retrieve the roles list.
     * Only retrieve roles when there an edge case where the user
     * is already in the system and the user is not an admin user.
     */
    const {
        data: rolesList,
        error: rolesListFetchRequestError
    } = useGetRolesList(
        null,
        null,
        roleSearchFilter,
        null,
        !!searchQuery
    );

    useEffect(() => {
        setWizardSteps(filterSteps([
            WizardStepsFormTypes.BASIC_DETAILS ]));
        setIsStepsUpdated(true);
    }, []);

    /**
     * This hook will check if the user is an admin user and prompt to add the admin role to the user.
     */
    useEffect(() => {
        if (!originalAdminUserList || !invite?.email) {
            return;
        }

        // If total results are 0, the user does not exists.
        // This means there is a pending invitation for the user.
        if (originalAdminUserList.totalResults <= 0) {
            dispatch(addAlert({
                description: t(
                    "extensions:manage.invite.notifications.sendInvite.inviteAlreadyExistsError.description",
                    { userName: invite.email }
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "extensions:manage.invite.notifications.sendInvite.inviteAlreadyExistsError.message"
                )
            }));
            setIsSubmitting(false);
            closeWizard();

            return;
        }

        // Check if the user in the first index is with Administrator role.
        // If an admin, show an error message.
        if (isAdminUser(originalAdminUserList.Resources[ 0 ])) {
            dispatch(addAlert({
                description: t(
                    "extensions:manage.invite.notifications.sendInvite.userAlreadyExistsError.description",
                    { userName: invite.email }
                ),
                level: AlertLevels.ERROR,
                message: t(
                    "extensions:manage.invite.notifications.sendInvite.userAlreadyExistsError.message"
                )
            }));
            setIsSubmitting(false);
            closeWizard();
        } else {
            // When the user is already in the PRIMARY userstore in managed deployment, administrators is hidden,
            // and console settings is enabled, assign already selected roles to the user.
            if (
                !administratorsFeatureConfig?.enabled &&
                consoleSettingsFeatureConfig?.enabled
            ) {
                const assignedRoles: RolesInterface[] = invite?.roles.map(
                    (roleDisplayName: string) => rolesList?.Resources?.find(
                        (role: RolesInterface) => role?.displayName === roleDisplayName
                    )
                ).filter(Boolean);

                assignUserRoles(originalAdminUserList.Resources, assignedRoles);

                return;
            // otherwise, prompt for assigning the admin role back
            } else {
                // If not, prompt to assign the admin role to the user.
                setIsSubmitting(false);
                setShowAdminRoleAddConfirmationModal(true);
                setSelectedUser(originalAdminUserList.Resources[ 0 ]);
            }
        }
    }, [ originalAdminUserList ]);

    /**
     * Dispatches error notifications for Admin user fetch request error.
     */
    useEffect(() => {
        if (!adminUserListFetchRequestError) {
            return;
        }

        if (adminUserListFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: adminUserListFetchRequestError?.response?.data?.description
                    ?? adminUserListFetchRequestError?.response?.data?.detail
                        ?? t("users:notifications.fetchUsers.error.description"),
                level: AlertLevels.ERROR,
                message: adminUserListFetchRequestError?.response?.data?.message
                    ?? t("users:notifications.fetchUsers.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("users:notifications.fetchUsers.genericError." +
                "description"),
            level: AlertLevels.ERROR,
            message: t("users:notifications.fetchUsers.genericError.message")
        }));
    }, [ adminUserListFetchRequestError ]);

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
        if (!rolesListFetchRequestError) {
            return;
        }

        if (rolesListFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: rolesListFetchRequestError?.response?.data?.description
                    ?? rolesListFetchRequestError?.response?.data?.detail
                        ?? t("roles:notifications.fetchRoles.error.description"),
                level: AlertLevels.ERROR,
                message: rolesListFetchRequestError?.response?.data?.message
                    ?? t("roles:notifications.fetchRoles.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("roles:notifications.fetchRoles.genericError.description"),
            level: AlertLevels.ERROR,
            message: t("roles:notifications.fetchRoles.genericError.message")
        }));
    }, [ rolesListFetchRequestError ]);

    /**
     * Get the administrator role from the roles list.
     */
    useEffect(() => {
        if (!rolesList || rolesList.Resources.length <= 0) {
            return;
        }

        const adminRole: RolesInterface = rolesList.Resources.find((role: RolesInterface) =>
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
    }, [ rolesList ]);

    /**
     * Sets the current wizard step to the previous on every `partiallyCompletedStep`
     * value change, and resets the partially completed step value.
     */
    useEffect(() => {
        if (partiallyCompletedStep === undefined) {
            return;
        }

        setCurrentWizardStep(currentWizardStep - 1);
        setPartiallyCompletedStep(undefined);
    }, [ partiallyCompletedStep ]);

    /**
     * Navigates to the next step.
     */
    const navigateToNext = () => {
        switch (wizardSteps[ currentWizardStep ]?.name) {
            case WizardStepsFormTypes.BASIC_DETAILS:
                setSubmitGeneralSettings();

                break;
            default:
                break;
        }
    };

    /**
     * Navigates to the previous step.
     */
    const navigateToPrevious = () => {
        setPartiallyCompletedStep(currentWizardStep);
    };

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
        const roleData: PatchRoleDataInterface = {
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

                await updateRoleDetails(roleId, roleData)
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
        const roleData: PatchRoleDataInterface = {
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

        updateRoleDetails(adminRoleId, roleData)
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
                        // We need to check if this user is having the Administator role.
                        handleAlredyExistingUser(invite);
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
    const handleAlredyExistingUser = (invite: UserInviteInterface): void => {
        if (!invite?.email) {
            setIsSubmitting(false);

            return;
        }

        if (!selectedUser || selectedUser?.userName !== invite.email) {
            // If the user is not selected. Query the user.
            setSearchQuery(`userName eq ${ invite.email }`);
            setInvite(invite);
        } else {
            // If the user is already selected, prompt to assign the admin role.
            // Handles cancelling and re-opening the modal.
            setShowAdminRoleAddConfirmationModal(true);
            setIsSubmitting(false);
        }
    };

    /**
     * This function handles sending the invitation to the external admin user.
     */
    const sendInternalInvitation = (data: InternalAdminFormDataInterface) => {
        assignUserRoles(data?.checkedUsers, data?.selectedRoles);
    };

    /**
     * Resolves the step content.
     *
     * @returns Step content.
     */
    const resolveStepContent = (): ReactElement => {
        switch (wizardSteps[ currentWizardStep ]?.name) {
            case WizardStepsFormTypes.BASIC_DETAILS:
                return getAdminBasicDetailsWizardStep()?.content;
        }
    };

    /**
     * Filters the steps evaluating the requested steps.
     *
     * @param steps - Steps to filter.
     * @returns Filtered steps.
     */
    const filterSteps = (steps: WizardStepsFormTypes[]): WizardStepInterface[] => {

        const getStepContent = (stepsToFilter: WizardStepsFormTypes[] | string[]) => {

            const filteredSteps: any[] = [];

            stepsToFilter.forEach((step: WizardStepsFormTypes) => {
                if (step === WizardStepsFormTypes.BASIC_DETAILS) {
                    filteredSteps.push(getAdminBasicDetailsWizardStep());
                }
            });

            return filteredSteps;
        };

        if (!requiredSteps) {
            return getStepContent(steps);
        }

        return getStepContent(intersection(steps, requiredSteps));
    };

    /**
     * Basic Wizard Step.
     * @returns Basic details wizard step.
     */
    const getAdminBasicDetailsWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <AddAdminUserBasic
                    administratorType={ adminTypeSelection }
                    triggerSubmit={ submitGeneralSettings }
                    onSubmit={ (values: InternalAdminFormDataInterface | UserInviteInterface) =>
                        (adminTypeSelection === AdminAccountTypes.INTERNAL)
                            ? sendInternalInvitation(values as InternalAdminFormDataInterface)
                            : sendExternalInvitation(values as UserInviteInterface)
                    }
                    setFinishButtonDisabled={ setFinishButtonDisabled }
                />
            ),
            icon: getUserWizardStepIcons().general,
            name: WizardStepsFormTypes.BASIC_DETAILS,
            title: t("console:manage.features.user.modals.addUserWizard.steps.basicDetails")
        };
    };

    return (
        wizardSteps && isStepsUpdated ? (
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
                        { resolveStepContent() }
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
                                    { (currentWizardStep < wizardSteps?.length - 1) && (
                                        <PrimaryButton
                                            data-componentid={ `${ componentId }-next-button` }
                                            data-testid={ `${ testId }-next-button` }
                                            floated="right"
                                            onClick={ navigateToNext }
                                        >
                                            { t("console:manage.features.user.modals.addUserWizard.buttons.next") }
                                            <Icon name="arrow right" />
                                        </PrimaryButton>
                                    ) }
                                    { currentWizardStep === wizardSteps?.length - 1 && (
                                        <PrimaryButton
                                            data-componentid={ `${ componentId }-finish-button` }
                                            data-testid={ `${ testId }-finish-button` }
                                            floated="right"
                                            loading={ isSubmitting }
                                            disabled={ isSubmitting || isFinishButtonDisabled }
                                            onClick={ navigateToNext }
                                        >
                                            {
                                                adminTypeSelection === AdminAccountTypes.INTERNAL
                                                    ? t("extensions:manage.features.user.addUser.add")
                                                    : t("extensions:manage.features.user.addUser.invite")
                                            }
                                        </PrimaryButton>
                                    ) }
                                    { (wizardSteps?.length > 1 && currentWizardStep > 0) && (
                                        <LinkButton
                                            data-componentid={ `${ componentId }-previous-button` }
                                            data-testid={ `${ testId }-previous-button` }
                                            floated="right"
                                            onClick={ navigateToPrevious }
                                        >
                                            <Icon name="arrow left" />
                                            { t("console:manage.features.user.modals.addUserWizard.buttons.previous") }
                                        </LinkButton>
                                    ) }
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
                                setSubmitGeneralSettings();
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
                                setSubmitGeneralSettings();
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
        ) : null
    );
};

/**
 * Default props for the add administrator wizard.
 */
AddAdministratorWizard.defaultProps = {
    compact: false,
    conditionallyShowStepper: false,
    currentStep: 0,
    emailVerificationEnabled: false,
    showStepper: true,
    submitStep: WizardStepsFormTypes.BASIC_DETAILS
};
