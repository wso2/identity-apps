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

import _ from "lodash";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { Modal, Grid, Icon } from "semantic-ui-react";
import { Heading, Steps, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { useTrigger } from "@wso2is/forms";
import { ApplicationWizardStepIcons } from "../../../configs";
import { RoleBasics } from "./role-basics";
import { PermissionList } from "./role-permisson";
import { createRole, updatePermissionForRole } from "../../../api";
import { CreateRoleInterface, AlertLevels } from "../../../models";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { addAlert } from "../../../store/actions";


/**
 * Interface which captures create role props.
 */
interface CreateRoleProps {
    closeWizard: () => void;
    updateList: () => void;
    initStep?: number;
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
        updateList
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ currentStep, setCurrentWizardStep ] = useState<number>(initStep);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);
    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    /**
     * Method to handle the create role wizard finish action.
     * 
     * @param permissions - permission list which was created by the user.
     */
    const handleRoleWizardFinish = (permissions: string[]) => {
        addRole(wizardState, permissions)
    };

    // Create role wizard steps
    const WIZARD_STEPS = [{
        content: (
            <RoleBasics
                triggerSubmit={ submitGeneralSettings }
                onSubmit={ (values) => handleWizardSubmit(values) }
            />
        ),
        icon: ApplicationWizardStepIcons.general,
        title: "Basic Details"
    },{
        content: (
            <PermissionList
                triggerSubmit={ finishSubmit }
                onSubmit={ handleRoleWizardFinish }
            />
        ),
        icon: ApplicationWizardStepIcons.general,
        title: "Permission Selection"
    }]
    
    /**
     * Create role wizard handler.
     * 
     * @param values values which will be taken from the previous wizard step
     */
    const handleWizardSubmit = (values: any) => {
        setCurrentWizardStep(currentStep + 1);
        setWizardState(_.merge(wizardState, { values }));
    }

    /**
     * Method to handle create role action when create role wizard finish action is triggered.
     * 
     * @param basicData - basic data required to create role.
     * @param permissions - permissions selected for the created role.
     */
    const addRole = (basicData: any, permissions: string[]): void => {
        const roleData: CreateRoleInterface = {
            "schemas": [
              "urn:ietf:params:scim:schemas:core:2.0:Group"
            ],
            "displayName": basicData.values.roleName,
        }

        /**
         * Create Role API Call. 
         * Note : Once create role API is successful, the permission API will be called 
         *        to add the selected permissions to the created role.
         */
        createRole(roleData).then(response => {
        
            if (response.status === 201) {
                const createdRoleId = response.data.id;
                const permData = permissions;
                updatePermissionForRole(createdRoleId, permData).then(response => {
                    dispatch(addAlert({
                        description: t(
                            "views:components.roles.notifications.createRole.success.description"
                        ),
                        level: AlertLevels.SUCCESS,
                        message: t(
                            "views:components.roles.notifications.createRole.success.message"
                        )
                    }));
                }).catch(error => {
                    if (!error.response || error.response.status === 401) {
                        dispatch(addAlert({
                            description: t(
                                "views:components.roles.notifications.createPermission.error.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "views:components.roles.notifications.createPermission.error.message"
                            )
                        }));
                    } else if (error.response && error.response.data.detail) {
                        dispatch(addAlert({
                            description: t(
                                "views:components.roles.notifications.createPermission.error.description",
                                { description: error.response.data.detail }
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "views:components.roles.notifications.createPermission.error.message"
                            )
                        }));
                    } else {
                        dispatch(addAlert({
                            description: t(
                                "views:components.roles.notifications.createPermission.genericError.description"
                            ),
                            level: AlertLevels.ERROR,
                            message: t(
                                "views:components.roles.notifications.createPermission.genericError.message"
                            )
                        }));
                    }
                })
            }
            updateList();
            closeWizard();
        }).catch(error => {
            if (!error.response || error.response.status === 401) {
                dispatch(addAlert({
                    description: t(
                        "views:components.roles.notifications.createRole.error.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "views:components.roles.notifications.createRole.error.message"
                    )
                }));
            } else if (error.response && error.response.data.detail) {
                dispatch(addAlert({
                    description: t(
                        "views:components.roles.notifications.createRole.error.description",
                        { description: error.response.data.detail }
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "views:components.roles.notifications.createRole.error.message"
                    )
                }));
            } else {
                dispatch(addAlert({
                    description: t(
                        "views:components.roles.notifications.createRole.genericError.description"
                    ),
                    level: AlertLevels.ERROR,
                    message: t(
                        "views:components.roles.notifications.createRole.genericError.message"
                    )
                }));
            }
        });
    }

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
    }

    /**
     * Function to change the current wizard step to previous.
     */
    const changeStepToPrevious = (): void => {
        setCurrentWizardStep(currentStep == 0 ? currentStep : currentStep - 1);
    }

    return (
        <Modal
            open={ true }
            className="wizard create-role-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape= { false }
        >
            <Modal.Header className="wizard-header">
                Create Role
                <Heading as="h6">Create a new role in the system with specific permissions</Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group header="Fill the following mandatory details of the new role." current={ currentStep }>
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
                            <LinkButton floated="left" onClick={ () => closeWizard() }>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentStep < WIZARD_STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ changeStepToNext }>
                                    Next Step <Icon name="arrow right"/>
                                </PrimaryButton>
                            ) }
                            { currentStep === WIZARD_STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ changeStepToNext }>
                                    Finish
                                </PrimaryButton>
                            ) }
                            { currentStep > 0 && (
                                <LinkButton floated="right" onClick={ changeStepToPrevious }>
                                    <Icon name="arrow left"/> Previous step
                                </LinkButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    );
}

/**
 * Default props for Create role wizard component.
 * NOTE : Current step is set to 0 in order to start from
 *        begening of the wizard. 
 */
CreateRoleWizard.defaultProps = {
    initStep: 0
};
