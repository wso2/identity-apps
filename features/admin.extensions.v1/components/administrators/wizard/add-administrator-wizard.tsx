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

import {
    AlertLevels,
    IdentifiableComponentInterface,
    RolesInterface,
    TestableComponentInterface
} from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { GenericIconProps, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import { AxiosError } from "axios";
import intersection from "lodash-es/intersection";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import {
    AddAdminUserBasic
} from "./steps/admin-user-basic";
import { UserBasicInterface } from "../../../../admin.core.v1";
import { updateRoleDetails } from "../../../../admin.roles.v2/api/roles";
import { PatchRoleDataInterface } from "../../../../admin.roles.v2/models/roles";
import { getUserWizardStepIcons } from "../../../../admin.users.v1/configs/ui";
import { AdminAccountTypes } from "../constants";
import { InternalAdminFormDataInterface } from "../models";
import { UserInviteInterface } from "../../../../admin.users.v1/models";
import { sendInvite } from "../../../../admin.users.v1/api";
import { UserManagementConstants } from "../../../../admin.users.v1/constants";

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

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();

    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>([]);
    const [ isStepsUpdated, setIsStepsUpdated ] = useState(false);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isFinishButtonDisabled, setFinishButtonDisabled ] = useState<boolean>(false);


    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    useEffect(() => {
        setWizardSteps(filterSteps([
            WizardStepsFormTypes.BASIC_DETAILS ]));
        setIsStepsUpdated(true);
    }, []);

    /**
     * Sets the current wizard step to the previous on every `partiallyCompletedStep`
     * value change , and resets the partially completed step value.
     */
    useEffect(() => {
        if (partiallyCompletedStep === undefined) {
            return;
        }

        setCurrentWizardStep(currentWizardStep - 1);
        setPartiallyCompletedStep(undefined);
    }, [ partiallyCompletedStep ]);

    const navigateToNext = () => {
        switch (wizardSteps[ currentWizardStep ]?.name) {
            case WizardStepsFormTypes.BASIC_DETAILS:
                setSubmitGeneralSettings();

                break;
            default:
                break;
        }
    };

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
                    closeWizard();
                    onInvitationSendSuccessful();
                })
                .catch((error: AxiosError) => {
                    // Axios throws a generic `Network Error` for 401 status.
                    // As a temporary solution, a check to see if a response
                    // is available has be used.
                    if (!error.response || error.response.status === 401) {
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
                    } else if (error?.response?.data?.description) {
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
                })
                .finally(() => {
                    setIsSubmitting(false);
                });
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
