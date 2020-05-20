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
/* eslint-disable */
//TODO Temporary disable of lint due to merge conflicts

import { TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useState, useEffect } from "react";
import { Modal, Grid, Icon } from "semantic-ui-react";
import { Heading, Steps, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { useTrigger } from "@wso2is/forms";
import { RolesWizardStepIcons } from "../../../configs";
import { RoleBasics } from "./role-basics";
import { PermissionList } from "./role-permisson";
import { createRole, updateRolePermissions } from "../../../api";
import { CreateRoleInterface, AlertLevels, CreateRoleMemberInterface } from "../../../models";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { AddRoleUsers } from "./role-user-assign";
import { CreateRoleSummary } from "./role-sumary";

/**
 * Interface which captures create role props.
 */
interface CreateRoleProps extends TestableComponentInterface {
    closeWizard: () => void;
    updateList: () => void;
    isAddGroup: boolean;
    initStep?: number;
}

/**
 * Enum for wizard steps form types.
 * @readonly
 * @enum {string}
 */
enum WizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails",
    PERM_LIST = "PermissionList",
    USER_LIST = "RoleUserList",
    SUMMARY = "summary"
}

/**
 * Interface to capture current wizard state
 */
interface WizardStateInterface {
    [ key: string ]: any;
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
        updateList,
        isAddGroup,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ currentStep, setCurrentWizardStep ] = useState<number>(initStep);
    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);
    const [ selectedUserStore, setSelectedUserStrore ] = useState<string>('');

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ submitRoleUserList, setSubmitRoleUserList ] = useTrigger();
    const [ submitPermissionList, setSubmitPermissionList ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

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

    /**
     * Method to handle create role action when create role wizard finish action is triggered.
     *
     * @param basicData - basic data required to create role.
     */
    const addRole = (basicData: any): void => {
        const members: CreateRoleMemberInterface[] = [];
        const users = basicData.RoleUserList;
        if (users.length > 0) {
            users.forEach(user => {
                members.push({
                    value: user.id,
                    display: user.userName
                })
            })
        }
        
        const roleData: CreateRoleInterface = {
            "schemas": [
                "urn:ietf:params:scim:schemas:core:2.0:Group"
            ],
            "displayName": basicData.BasicDetails.domain + "/" + basicData.BasicDetails.roleName,
            "members" : members
        };

        /**
         * Create Role API Call. 
         * Note : Once create role API is successful, the permission API will be called 
         *        to add the selected permissions to the created role.
         */
        createRole(roleData).then(response => {
            if (response.status === 201) {
                const createdRoleId = response.data.id;
                const permData: string[] = [];

                if (basicData.PermissionList) {
                    basicData.PermissionList.forEach(perm => {
                        permData.push(perm.fullPath);
                    })
                }

                updateRolePermissions(createdRoleId, permData).then(() => {
                    dispatch(
                        addAlert({
                            description: isAddGroup ? 
                                t("devPortal:components.groups.notifications.createGroup.success.description") : 
                                t("devPortal:components.roles.notifications.createRole.success.description"),
                            level: AlertLevels.SUCCESS,
                            message: isAddGroup ? 
                                t("devPortal:components.groups.notifications.createGroup.success.message") : 
                                t("devPortal:components.roles.notifications.createRole.success.message")
                        })
                    );
                }).catch(error => {
                    if (!error.response || error.response.status === 401) {
                        dispatch(
                            addAlert({
                                description: isAddGroup ? 
                                    t("devPortal:components.groups.notifications.createPermission.error.description") : 
                                    t("devPortal:components.roles.notifications.createPermission.error.description"),
                                level: AlertLevels.ERROR,
                                message: isAddGroup ? 
                                    t("devPortal:components.groups.notifications.createPermission.error.message") : 
                                    t("devPortal:components.roles.notifications.createPermission.error.message")
                            })
                        );
                    } else if (error.response && error.response.data.detail) {
                        dispatch(
                            addAlert({
                                description: isAddGroup ? 
                                    t("devPortal:components.groups.notifications.createPermission.error.description", 
                                    { description: error.response.data.detail }) : 
                                    t("devPortal:components.roles.notifications.createPermission.error.description", 
                                    { description: error.response.data.detail }),
                                level: AlertLevels.ERROR,
                                message: isAddGroup ? 
                                    t("devPortal:components.groups.notifications.createPermission.error.message") : 
                                    t("devPortal:components.roles.notifications.createPermission.error.message")
                            })
                        );
                    } else {
                        dispatch(
                            addAlert({
                                description: isAddGroup ? 
                                    t("devPortal:components.groups.notifications.createPermission.genericError."+
                                    "description") : 
                                    t("devPortal:components.roles.notifications.createPermission.genericError."+
                                    "description"),
                                level: AlertLevels.ERROR,
                                message: isAddGroup ? 
                                    t("devPortal:components.groups.notifications.createPermission.genericError."+
                                    "message") : 
                                    t("devPortal:components.roles.notifications.createPermission.genericError."+
                                    "message")
                            })
                        );
                    }
                })
            }
            updateList();
            closeWizard();
        }).catch(error => {
            if (!error.response || error.response.status === 401) {
                dispatch(
                    addAlert({
                        description: isAddGroup ? 
                            t("devPortal:components.groups.notifications.createGroup.error.description") : 
                            t("devPortal:components.roles.notifications.createRole.error.description"),
                        level: AlertLevels.ERROR,
                        message: isAddGroup ? 
                            t("devPortal:components.groups.notifications.createGroup.error.message") : 
                            t("devPortal:components.roles.notifications.createRole.error.message")
                    })
                );
            } else if (error.response && error.response.data.detail) {
                dispatch(
                    addAlert({
                        description: isAddGroup ? 
                            t("devPortal:components.groups.notifications.createGroup.error.description", 
                            { description: error.response.data.detail }) : 
                            t("devPortal:components.roles.notifications.createRole.error.description",
                            { description: error.response.data.detail }),
                        level: AlertLevels.ERROR,
                        message: isAddGroup ? 
                            t("devPortal:components.groups.notifications.createGroup.error.message") : 
                            t("devPortal:components.roles.notifications.createRole.error.message")
                    })
                );
            } else {
                dispatch(addAlert({
                    description: isAddGroup ? 
                        t("devPortal:components.groups.notifications.createGroup.genericError.description") : 
                        t("devPortal:components.roles.notifications.createRole.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: isAddGroup ? 
                        t("devPortal:components.groups.notifications.createGroup.genericError.message") : 
                        t("devPortal:components.roles.notifications.createRole.genericError.message")
                }));
            }
        });
    };

    /**
     * Method to handle the create role wizard finish action.
     * 
     */
    const handleRoleWizardFinish = () => {
        addRole(wizardState)
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
        setCurrentWizardStep(currentStep + 1);
        setWizardState({...wizardState, [ formType ]: values});
    };

    // Create role wizard steps
    const WIZARD_STEPS = [{
        content: (
            <RoleBasics
                data-testid={ isAddGroup ? "add-group-form" : "add-role-form" }
                isAddGroup={ isAddGroup }
                triggerSubmit={ submitGeneralSettings }
                initialValues={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] }
                onSubmit={ (values) => handleWizardSubmit(values, WizardStepsFormTypes.BASIC_DETAILS) }
            />
        ),
        icon: RolesWizardStepIcons.general,
        title: t("devPortal:components.roles.addRoleWizard.wizardSteps.0")
    },{
        content: (
            <PermissionList
                data-testid={ isAddGroup ? "new-group-permissions" : "new-role-permissions" }
                isEdit={ false }
                triggerSubmit={ submitPermissionList }
                initialValues={ wizardState && wizardState[ WizardStepsFormTypes.PERM_LIST ] }
                onSubmit={ (values) => handleWizardSubmit(values, WizardStepsFormTypes.PERM_LIST) }
            />
        ),
        icon: <Icon name="key" inverted size="large" />,
        title: t("devPortal:components.roles.addRoleWizard.wizardSteps.1")
    },{
        content: (
            <AddRoleUsers
                data-testid={ isAddGroup ? "new-group" : "new-role" }
                isEdit={ false }
                isGroup={ isAddGroup }
                triggerSubmit={ submitRoleUserList }
                userStore={ selectedUserStore }
                initialValues={ wizardState && wizardState[ WizardStepsFormTypes.USER_LIST ] }
                onSubmit={ (values) => handleWizardSubmit(values, WizardStepsFormTypes.USER_LIST) }
            />
        ),
        icon: RolesWizardStepIcons.assignUser,
        title: t("devPortal:components.roles.addRoleWizard.wizardSteps.2")
    },{
        content: (
            <CreateRoleSummary
                data-testid={ isAddGroup ? "add-group-summary" : "add-role-summary" }
                isAddGroup={ isAddGroup }
                triggerSubmit={ finishSubmit }
                onSubmit={ handleRoleWizardFinish }
                summary={ generateWizardSummary() }
            />
        ),
        icon: RolesWizardStepIcons.summary,
        title: t("devPortal:components.roles.addRoleWizard.wizardSteps.3")
    }];

    /**
     * Function to change the current wizard step to next.
     */
    const changeStepToNext = (): void => {
        switch(currentStep) {
            case 0:
                setSubmitGeneralSettings();
                break;
            case 1:
                setSubmitPermissionList();
                break;
            case 2:
                setSubmitRoleUserList();
                break;
            case 3:
                setFinishSubmit();
                break;
            
        }
    };

    const navigateToPrevious = () => {
        setPartiallyCompletedStep(currentStep);
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
                    isAddGroup ?
                        t("devPortal:components.roles.addRoleWizard.heading", { type: "Group" }) :
                        t("devPortal:components.roles.addRoleWizard.heading", { type: "Role" })
                }
                <Heading as="h6">
                    {
                        isAddGroup ?
                            t("devPortal:components.roles.addRoleWizard.subHeading", { type: "group" }) :
                            t("devPortal:components.roles.addRoleWizard.subHeading", { type: "role" })
                    }
                </Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group
                    current={ currentStep }
                >
                    { WIZARD_STEPS.map((step, index) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content>
            <Modal.Content className="content-container" scrolling>
                { WIZARD_STEPS[ currentStep ].content }
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
                            { currentStep < WIZARD_STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ changeStepToNext }
                                    data-testid={ `${ testId }-next-button` }
                                >
                                    { t("devPortal:components.roles.addRoleWizard.buttons.next") }
                                    <Icon name="arrow right" data-testid={ `${ testId }-next-button-icon` }/>
                                </PrimaryButton>
                            ) }
                            { currentStep === WIZARD_STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ changeStepToNext }
                                    data-testid={ `${ testId }-finish-button` }
                                >
                                    { t("devPortal:components.roles.addRoleWizard.buttons.finish") }
                                </PrimaryButton>
                            ) }
                            { currentStep > 0 && (
                                <LinkButton
                                    floated="right"
                                    onClick={ navigateToPrevious }
                                    data-testid={ `${ testId }-previous-button` }
                                >
                                    <Icon name="arrow left" data-testid={ `${ testId }-previous-button-icon` }/>
                                    { t("devPortal:components.roles.addRoleWizard.buttons.previous") }
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
    initStep: 0
};
