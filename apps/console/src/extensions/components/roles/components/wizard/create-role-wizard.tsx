/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { GenericIconProps, Heading, LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import intersection from "lodash-es/intersection";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch} from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { RoleBasics } from "./role-basics";
import { CreateRoleSummary } from "./role-sumary";
import { AddRoleUsers } from "./role-user-assign";
import { AppConstants } from "../../../../../features/core/constants";
import { history } from "../../../../../features/core/helpers";
import { CreateGroupMemberInterface } from "../../../../../features/groups/models";
import { createRole } from "../../../../../features/roles/api";
import { getRolesWizardStepIcons } from "../../../../../features/roles/configs";
import { CreateRoleInterface, CreateRoleMemberInterface, TreeNode } from "../../../../../features/roles/models";
import { UserBasicInterface } from "../../../../../features/users";
import { CONSUMER_USERSTORE } from "../../../users/constants";

/**
 * Interface which captures create role props.
 */
interface CreateRoleProps extends TestableComponentInterface {
    closeWizard: () => void;
    updateList: () => void;
    isAddGroup: boolean;
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
    PERM_LIST = "PermissionList",
    USER_LIST = "UserList",
    GROUP_LIST = "GroupList",
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
    name: WizardStepsFormTypes;
    title: string;
}

/**
 * Component to handle addition of a new role to the system.
 *
 * @param props props related to the create role wizard
 */
export const CreateRoleWizard: FunctionComponent<CreateRoleProps> = (props: CreateRoleProps): ReactElement => {

    const {
        closeWizard,
        initStep,
        isAddGroup,
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
    const [ selectedUserStore, setSelectedUserStrore ] = useState<string>(CONSUMER_USERSTORE);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ tempUsersList, setTempUsersList ] = useState<UserBasicInterface[]>([]);
    const [ isEnded, setEnded ] = useState<boolean>(false);

    useEffect(() => {
        setWizardSteps(filterSteps([
            WizardStepsFormTypes.BASIC_DETAILS,
            WizardStepsFormTypes.USER_LIST ]));
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
            addRole(wizardState[ WizardStepsFormTypes.BASIC_DETAILS ]);
        }
    }, [ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] ]);

    /**
     * Method to handle create role action when create role wizard finish action is triggered.
     *
     * @param basicData - basic data required to create role.
     */
    const addRole = (basicData: any): void => {

        const users: CreateRoleMemberInterface[] = [];
        const groups: CreateGroupMemberInterface[] = [];
        const permissions: string[] = [];

        if (basicData?.UserList?.length > 0) {
            basicData?.UserList?.forEach(user => {
                users?.push({
                    display: user?.userName,
                    value: user?.id
                });
            });
        }

        if (basicData?.GroupList?.length > 0) {
            basicData?.GroupList?.forEach(group => {
                groups?.push({
                    display: group.displayName,
                    value: group.id
                });
            });
        }

        if (basicData?.BasicDetails?.permissions?.length > 0) {
            basicData.BasicDetails.permissions.forEach((permission: TreeNode) => {
                permissions?.push(permission?.key.toString());
            });
        }

        const roleData: CreateRoleInterface = {
            "displayName": basicData?.BasicDetails?.basic?.roleName
                ? basicData.BasicDetails.basic.roleName
                : basicData?.roleName,
            "groups": groups,
            "permissions": permissions,
            "schemas": [
                "urn:ietf:params:scim:schemas:extension:2.0:Role"
            ],
            "users": users
        };

        setIsSubmitting(true);

        // Create Role API Call.
        createRole(roleData)
            .then(response => {
                if (response.status === 201) {
                    dispatch(
                        addAlert({
                            description: t("console:manage.features.roles.notifications.createRole.success" +
                                ".description"),
                            level: AlertLevels.SUCCESS,
                            message: t("console:manage.features.roles.notifications.createRole.success.message")
                        })
                    );

                    history.push(AppConstants.getPaths().get("ROLE_EDIT").replace(":id", response.data.id));
                }

            })
            .catch(error => {
                if (!error.response || error.response.status === 401) {

                    dispatch(
                        addAlert({
                            description: t("console:manage.features.roles.notifications.createRole.error" +
                                ".description"),
                            level: AlertLevels.ERROR,
                            message: t("console:manage.features.roles.notifications.createRole.error.message")
                        })
                    );
                } else if (error.response && error.response.data.detail) {

                    dispatch(
                        addAlert({
                            description: t("console:manage.features.roles.notifications.createRole.error" +
                                ".description",
                                { description: error.response.data.detail }),
                            level: AlertLevels.ERROR,
                            message: t("console:manage.features.roles.notifications.createRole.error.message")
                        })
                    );
                } else {

                    dispatch(addAlert({
                        description: t("console:manage.features.roles.notifications.createRole.genericError" +
                            ".description"),
                        level: AlertLevels.ERROR,
                        message: t("console:manage.features.roles.notifications.createRole.genericError.message")
                    }));
                }
            })
            .finally(() => {
                setIsSubmitting(false);
                closeWizard();
            });
    };

    /**
     * Method to handle the create role wizard finish action.
     *
     */
    const handleRoleWizardFinish = (values: any): void => {
        addRole(values);
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
            setSelectedUserStrore(values.domain);
        }

        if (submitStep !== formType && !isEnded) {
            setCurrentWizardStep(currentStep + 1);
        }

        setWizardState({ ...wizardState, [ formType ]: values });

        // If the submit step is not default, and submit step is the current step, submit the form.
        if (submitStep !== WizardStepsFormTypes.SUMMARY && submitStep === formType) {
            handleRoleWizardFinish({ ...wizardState, [ formType ]: values });
            return;
        }
    };

    const handleGroupUserSubmit = (value: { [ WizardStepsFormTypes.USER_LIST ]: any }): void => {

        if (submitStep !== WizardStepsFormTypes.USER_LIST && !isEnded) {
            setCurrentWizardStep(currentStep + 1);
        }

        // If the submit step is not default, and submit step is the current step, submit the form.
        if (submitStep !== WizardStepsFormTypes.SUMMARY && submitStep === WizardStepsFormTypes.USER_LIST) {
            handleRoleWizardFinish({ ...wizardState, ...value });
            return;
        }

        setWizardState({ ...wizardState, ...value });
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
                handleGroupUserSubmit({
                    [ WizardStepsFormTypes.USER_LIST ]: tempUsersList
                });
                break;
            case 3:
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
                } else if (step === WizardStepsFormTypes.USER_LIST) {
                    filteredSteps.push(getUserListWizardStep());
                }else if (step === WizardStepsFormTypes.SUMMARY) {
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
                <RoleBasics
                    data-testid="add-role-form"
                    isAddGroup={ isAddGroup }
                    triggerSubmit={ submitGeneralSettings }
                    initialValues={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] }
                    onSubmit={ (values) => handleWizardSubmit(values, WizardStepsFormTypes.BASIC_DETAILS) }
                />
            ),
            icon: <Icon name="key" inverted size="large"/>,
            name: WizardStepsFormTypes.BASIC_DETAILS,
            title: "Permissions"
        };
    };

    /**
     * Get the wizard user list step.
     *
     * @return {WizardStepInterface}
     */
    const getUserListWizardStep = (): WizardStepInterface => {

        return {
            content: (
                <AddRoleUsers
                    data-testid="new-role"
                    isEdit={ false }
                    isGroup={ false }
                    userStore={ selectedUserStore }
                    initialValues={ tempUsersList }
                    handleTempUsersListChange={ (list: UserBasicInterface[]) => {
                        setTempUsersList(list);
                    } }
                />
            ),
            icon: getRolesWizardStepIcons().assignUser,
            name: WizardStepsFormTypes.USER_LIST,
            title: "Users"
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
                <CreateRoleSummary
                    data-testid="add-role-summary"
                    isAddGroup={ isAddGroup }
                    triggerSubmit={ finishSubmit }
                    onSubmit={ handleRoleWizardFinish }
                    summary={ generateWizardSummary() }
                />
            ),
            icon: getRolesWizardStepIcons().summary,
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
            case WizardStepsFormTypes.USER_LIST:
                return getUserListWizardStep()?.content;
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
                { t("console:manage.features.roles.addRoleWizard.heading", { type: "Role" }) }
                <Heading as="h6">
                    Assign permissions to a new role and add collaborator users to the role.
                </Heading>
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
                                    data-testid={ `${ testId }-next-button` }
                                >
                                    { t("console:manage.features.roles.addRoleWizard.buttons.next") }
                                    <Icon name="arrow right" data-testid={ `${ testId }-next-button-icon` }/>
                                </PrimaryButton>
                            ) }
                            { currentStep === wizardSteps?.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ changeStepToNext }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                    data-testid={ `${ testId }-finish-button` }
                                >
                                    { t("console:manage.features.roles.addRoleWizard.buttons.finish") }
                                </PrimaryButton>
                            ) }
                            { currentStep > 0 && (
                                <LinkButton
                                    floated="right"
                                    onClick={ navigateToPrevious }
                                    data-testid={ `${ testId }-previous-button` }
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
 * Default props for Create role wizard component.
 * NOTE : Current step is set to 0 in order to start from
 *        beginning of the wizard.
 */
CreateRoleWizard.defaultProps = {
    initStep: 0,
    requiredSteps: [ WizardStepsFormTypes.BASIC_DETAILS, WizardStepsFormTypes.USER_LIST ],
    showStepper: true,
    submitStep: WizardStepsFormTypes.SUMMARY
};
