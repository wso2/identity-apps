/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { useTrigger } from "@wso2is/forms";
import { GenericIconProps, Heading, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import intersection from "lodash-es/intersection";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Button, Grid, Icon, Modal } from "semantic-ui-react";
import { AddGroupUsers } from "./group-assign-users";
import { AppConstants, history } from "../../../../features/core";
import { EventPublisher } from "../../../../features/core/utils";
import { createGroup } from "../../../../features/groups/api";
import { CreateGroupSummary } from "../../../../features/groups/components/wizard";
import { getGroupsWizardStepIcons } from "../../../../features/groups/configs";
import {
    CreateGroupInterface,
    CreateGroupMemberInterface
} from "../../../../features/groups/models";
import { updateRole } from "../../../../features/roles/api";
import { CONSUMER_USERSTORE } from "../../users/constants";

/**
 * Interface which captures create group props.
 */
interface CreateGroupProps extends TestableComponentInterface {
    closeWizard: () => void;
    updateList: () => void;
    initStep?: number;
    requiredSteps?: WizardStepsFormTypes[] | string[];
    showStepper?: boolean;
    submitStep?: WizardStepsFormTypes | string;
}

/**
 * Enum for wizard steps form types.
 * @readonly
 * @enum {string}
 */
enum WizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails",
    SUMMARY = "summary"
}

/**
 * Interface to capture current wizard state
 */
interface WizardStateInterface {
    [ key: string ]: any;
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
 * Component to handle addition of a new group to the system.
 *
 * @param props props related to the create group wizard
 */
export const CreateGroupWizard: FunctionComponent<CreateGroupProps> = (props: CreateGroupProps): ReactElement => {

    const {
        closeWizard,
        initStep,
        requiredSteps,
        showStepper,
        submitStep,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ currentStep, setCurrentWizardStep ] = useState<number>(initStep);
    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>(undefined);
    const [ selectedUserStore, setSelectedUserStore ] = useState<string>(CONSUMER_USERSTORE);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ isEnded, setEnded ] = useState<boolean>(false);
    const [ isWizardActionDisabled, setIsWizardActionDisabled ] = useState<boolean>(true);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    useEffect(() => {
        setWizardSteps(filterSteps([
            WizardStepsFormTypes.BASIC_DETAILS,
            WizardStepsFormTypes.SUMMARY ]));
    }, []);

    /**
     * Sets the current wizard step to the previous on every `partiallyCompletedStep`
     * value change , and resets the partially completed step value.
     */
    useEffect(() => {
        if (partiallyCompletedStep === undefined) {
            return;
        }

        setCurrentWizardStep(currentStep - 1);
        setPartiallyCompletedStep(undefined);
    }, [ partiallyCompletedStep ]);

    useEffect(() => {
        if(!isEnded) {
            return;
        }

        if (wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]) {
            addGroup(wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]);
        }
    }, [ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] ]);

    /**
     * Method to handle create group action when create group wizard finish action is triggered.
     *
     * @param groupDetails - basic data required to create group.
     */
    const addGroup = (groupDetails: any): void => {
        let groupName = "";

        groupDetails?.domain !== "primary"
            ? groupName = groupDetails?.BasicDetails.basic
                ? groupDetails?.BasicDetails?.basic?.domain + "/" + groupDetails?.BasicDetails?.basic?.groupName
                : groupDetails?.domain + "/" + groupDetails?.groupName
            : groupName = groupDetails?.BasicDetails?.basic
                ? groupDetails?.BasicDetails?.groupName
                : groupDetails?.groupName;

        const members: CreateGroupMemberInterface[] = [];
        const users = groupDetails?.BasicDetails?.users;

        if (users?.length > 0) {
            users?.forEach(user => {
                members?.push({
                    display: user.userName,
                    value: user.id
                });
            });
        }

        const groupData: CreateGroupInterface = {
            "displayName": groupName,
            "members" : members,
            "schemas": [
                "urn:ietf:params:scim:schemas:core:2.0:Group"
            ]

        };

        setIsSubmitting(true);

        /**
         * Create Group API Call.
         */
        createGroup(groupData).then(response => {
            if (response.status === 201) {

                const createdGroup = response.data;
                const rolesList: string[] = [];

                if (groupDetails?.RoleList?.roles) {
                    groupDetails?.RoleList?.roles.forEach(role => {
                        rolesList?.push(role.id);
                    });
                }

                const roleData = {
                    "Operations": [ {
                        "op": "add",
                        "value": {
                            "groups": [ {
                                "display": createdGroup.displayName,
                                "value": createdGroup.id
                            } ]
                        }
                    } ],
                    "schemas": [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
                };

                if (rolesList && rolesList.length > 0) {
                    for (const roleId of rolesList) {
                        updateRole(roleId, roleData)
                            .catch(error => {
                                if (!error.response || error.response.status === 401) {
                                    setAlert({
                                        description: t("console:manage.features.groups.notifications." +
                                            "createPermission." +
                                            "error.description"),
                                        level: AlertLevels.ERROR,
                                        message: t("console:manage.features.groups.notifications.createPermission." +
                                            "error.message")
                                    });
                                } else if (error.response && error.response.data.detail) {
                                    setAlert({
                                        description: t("console:manage.features.groups.notifications." +
                                            "createPermission." +
                                            "error.description",
                                        { description: error.response.data.detail }),
                                        level: AlertLevels.ERROR,
                                        message: t("console:manage.features.groups.notifications.createPermission." +
                                            "error.message")
                                    });
                                } else {
                                    setAlert({
                                        description: t("console:manage.features.groups.notifications." +
                                            "createPermission." +
                                            "genericError.description"),
                                        level: AlertLevels.ERROR,
                                        message: t("console:manage.features.groups.notifications.createPermission." +
                                            "genericError." +
                                            "message")
                                    });
                                }
                            });
                    }
                }

                dispatch(
                    addAlert({
                        description: t("console:manage.features.groups.notifications.createGroup.success." +
                            "description"),
                        level: AlertLevels.SUCCESS,
                        message: t("console:manage.features.groups.notifications.createGroup.success." +
                            "message")
                    })
                );
            }

            closeWizard();
            history.push(AppConstants.getPaths().get("GROUP_EDIT").replace(":id", response.data.id));
        }).catch(error => {
            if (!error.response || error.response.status === 401) {
                closeWizard();
                dispatch(
                    addAlert({
                        description: t("console:manage.features.groups.notifications.createGroup.error.description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.groups.notifications.createGroup.error.message")
                    })
                );
            } else if (error.response && error.response.data.detail) {
                closeWizard();
                dispatch(
                    addAlert({
                        description: t("console:manage.features.groups.notifications.createGroup.error.description",
                            { description: error.response.data.detail }),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.groups.notifications.createGroup.error.message")
                    })
                );
            } else {
                closeWizard();
                dispatch(addAlert({
                    description: t("console:manage.features.groups.notifications.createGroup.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:manage.features.groups.notifications.createGroup.genericError.message")
                }));
            }
        }).finally(() => {
            setIsSubmitting(false);
        })
        ;
    };

    /**
     * Method to handle the create group wizard finish action.
     *
     */
    const handleGroupWizardFinish = (values: any) => {
        eventPublisher.publish("manage-groups-finish-create-new-group");
        addGroup(values);
    };

    /**
     * Generates a summary of the wizard.
     *
     * @return {any}
     */
    const generateWizardSummary = () => {
        if (!wizardState) {
            return;
        }

        return wizardState;
    };

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     * @param {WizardStepsFormTypes} formType - Type of the form.
     */
    const handleWizardSubmit = (values: any, formType: WizardStepsFormTypes) => {
        if (WizardStepsFormTypes.BASIC_DETAILS === formType) {
            setSelectedUserStore(values.basic.domain);
        }

        if (submitStep !== formType && !isEnded) {
            setCurrentWizardStep(currentStep + 1);
        }

        setWizardState({ ...wizardState, [ formType ]: values });

        // If the submit step is not default, and submit step is the current step, submit the form.
        if (submitStep !== WizardStepsFormTypes.SUMMARY && submitStep === formType) {
            handleGroupWizardFinish({ ...wizardState, [ formType ]: values });

            return;
        }
    };

    /**
     * Function to change the current wizard step to next.
     */
    const changeStepToNext = (): void => {
        switch(currentStep) {
            case 0:
                setSubmitGeneralSettings();

                break;
            case 1:
                setFinishSubmit();

                break;
        }
    };

    const navigateToPrevious = () => {
        setPartiallyCompletedStep(currentStep);
    };

    const handleFinishFlow = () => {
        setEnded(true);
        setSubmitGeneralSettings();
    };

    /**
     * Filters the steps evaluating the requested steps.
     *
     * @param {WizardStepsFormTypes[]} steps - Steps to filter.
     * @return {WizardStepInterface[]}
     */
    const filterSteps = (steps: WizardStepsFormTypes[]): WizardStepInterface[] => {

        const getStepContent = (stepsToFilter: WizardStepsFormTypes[] | string[]) => {

            const filteredSteps: any[] = [];

            stepsToFilter.forEach((step: WizardStepsFormTypes) => {
                if (step === WizardStepsFormTypes.BASIC_DETAILS) {
                    filteredSteps.push(getBasicDetailsWizardStep());
                } else if (step === WizardStepsFormTypes.SUMMARY) {
                    filteredSteps.push(getSummaryWizardStep());
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
     * Get the wizard basic step.
     *
     * @return {WizardStepInterface}
     */
    const getBasicDetailsWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <>
                    <AddGroupUsers
                        data-testid="new-group"
                        isEdit={ false }
                        triggerSubmit={ submitGeneralSettings }
                        userStore={ selectedUserStore }
                        initialValues={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] }
                        onSubmit={ (values) => handleWizardSubmit(values, WizardStepsFormTypes.BASIC_DETAILS) }
                        onUserFetchRequestFinish={ () => setIsWizardActionDisabled(false) }
                    />
                </>
            ),
            icon: getGroupsWizardStepIcons().general,
            name: WizardStepsFormTypes.BASIC_DETAILS,
            title: t("console:manage.features.roles.addRoleWizard.wizardSteps.0")
        };
    };

    /**
     * Get the summary wizard step.
     *
     * @return {WizardStepInterface}
     */
    const getSummaryWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <CreateGroupSummary
                    data-testid="add-group-summary"
                    triggerSubmit={ finishSubmit }
                    onSubmit={ () => handleGroupWizardFinish(wizardState) }
                    summary={ generateWizardSummary() }
                />
            ),
            icon: getGroupsWizardStepIcons().summary,
            name: WizardStepsFormTypes.SUMMARY,
            title: t("console:manage.features.roles.addRoleWizard.wizardSteps.3")
        };
    };

    /**
     * Resolves the step content.
     *
     * @return {React.ReactElement} Step content.
     */
    const resolveStepContent = (): ReactElement => {

        if (!wizardSteps) {
            return null;
        }

        switch (wizardSteps[currentStep]?.name) {
            case WizardStepsFormTypes.BASIC_DETAILS:
                return getBasicDetailsWizardStep()?.content;
            case WizardStepsFormTypes.SUMMARY:
                return getSummaryWizardStep()?.content;
        }
    };

    return (
        <Modal
            open={ true }
            className="wizard create-role-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape= { false }
            data-testid={ testId }
        >
            <Modal.Header className="wizard-header">
                {
                    t("console:manage.features.roles.addRoleWizard.heading", { type: "Group" })
                }
                {
                    wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.groupName
                        ? " - " + wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]?.groupName
                        :""
                }
                <Heading as="h6">Create new group and add customers to the group.</Heading>
            </Modal.Header>
            {
                showStepper && (
                    <Modal.Content className="steps-container">
                        <Steps.Group
                            current={ currentStep }
                        >
                            { wizardSteps?.map((step, index) => (
                                <Steps.Step
                                    key={ index }
                                    icon={ step.icon }
                                    title={ step.title }
                                />
                            )) }
                        </Steps.Group>
                    </Modal.Content>
                )
            }
            <Modal.Content className="content-container" scrolling>
                { alert && alertComponent }
                { resolveStepContent() }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => closeWizard() }
                                data-testid={ `${ testId }-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentStep < wizardSteps?.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ changeStepToNext }
                                    disabled={ isWizardActionDisabled }
                                    data-testid={ `${ testId }-next-button` }
                                >
                                    { t("console:manage.features.roles.addRoleWizard.buttons.next") }
                                    <Icon name="arrow right" data-testid={ `${ testId }-next-button-icon` }/>
                                </PrimaryButton>
                            ) }
                            { (wizardSteps?.length > 1 && currentStep === 0) && (
                                <Button
                                    basic
                                    color="orange"
                                    floated="right"
                                    onClick={ handleFinishFlow }
                                    disabled={ isWizardActionDisabled }
                                    data-testid={ `${ testId }-initial-finish-button` }
                                >
                                    { t("console:manage.features.roles.addRoleWizard.buttons.finish") }
                                </Button>
                            ) }
                            { currentStep === wizardSteps?.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ changeStepToNext }
                                    data-testid={ `${ testId }-finish-button` }
                                    disabled={ isWizardActionDisabled || isSubmitting }
                                    loading={ isSubmitting }
                                >
                                    { t("console:manage.features.roles.addRoleWizard.buttons.finish") }
                                </PrimaryButton>
                            ) }
                            { (wizardSteps?.length > 1 && currentStep > 0) && (
                                <LinkButton
                                    floated="right"
                                    onClick={ navigateToPrevious }
                                    data-testid={ `${ testId }-previous-button` }
                                    disabled={ isWizardActionDisabled }
                                >
                                    <Icon name="arrow left" data-testid={ `${ testId }-previous-button-icon` }/>
                                    { t("console:manage.features.roles.addRoleWizard.buttons.previous") }
                                </LinkButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
};

/**
 * Default props for Create group wizard component.
 * NOTE : Current step is set to 0 in order to start from
 *        beginning of the wizard.
 */
CreateGroupWizard.defaultProps = {
    initStep: 0,
    requiredSteps: [ WizardStepsFormTypes.BASIC_DETAILS, WizardStepsFormTypes.SUMMARY ],
    showStepper: false,
    submitStep: WizardStepsFormTypes.SUMMARY
};
