/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { GenericIconProps, Heading, LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { ApplicationRoleBasics } from "./application-role-basics";
import { PermissionList } from "./application-role-permission";
import { getRolesWizardStepIcons } from "../../../../../features/roles/configs";
import { createRole } from "../../api/application-roles";
import { CreateRolePayloadInterface, RoleBasicDetailsInterface, SharedApplicationDataInterface } from "../../models";

/**
 * Interface which captures create app role props.
 */
interface CreateApplicationRoleProps extends IdentifiableComponentInterface {
    closeWizard: () => void;
    onRoleUpdate: () => void;
    initStep?: number;
    appId: string;
    sharedApplications: SharedApplicationDataInterface[];
}

/**
 * Enum for wizard steps form types.
 * @readonly
*/
enum WizardStepsFormTypes {
    BASIC_DETAILS = "BasicDetails",
    PERM_LIST = "PermissionList"
}

/**
 * Interface to capture current wizard state.
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
    title: string;
}

/**
 * Component to handle new application role creation.
 *
 * @param props - Props related to the create application role wizard
 */
export const CreateApplicationRoleWizard: FunctionComponent<CreateApplicationRoleProps> = (
    props: CreateApplicationRoleProps): ReactElement => {

    const {
        closeWizard,
        onRoleUpdate,
        appId,
        initStep,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const dispatch: Dispatch<any> = useDispatch();

    const [ currentStep, setCurrentWizardStep ] = useState<number>(initStep);
    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);

    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ submitPermissionList, setSubmitPermissionList ] = useTrigger();
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    // Create app role wizard steps
    const WIZARD_STEPS: WizardStepInterface[] = [ {
        content: (
            <ApplicationRoleBasics
                data-componentid="new-app-role-basics"
                triggerSubmit={ submitGeneralSettings }
                initialValues={ wizardState && wizardState[ WizardStepsFormTypes.BASIC_DETAILS ] }
                onSubmit={ 
                    (values: RoleBasicDetailsInterface) => {
                        handleWizardSubmit(values, WizardStepsFormTypes.BASIC_DETAILS);
                    }
                }
            />
        ),
        icon: getRolesWizardStepIcons().general,
        title: t("extensions:develop.applications.edit.sections.roles.addRoleWizard.wizardSteps.0")
    },{
        content: (
            <PermissionList
                data-componentid="new-app-role-permissions"
                appId={ appId }
                triggerSubmit={ submitPermissionList }
                initialValues={ wizardState && wizardState[ WizardStepsFormTypes.PERM_LIST ] }
                onSubmit={ (values: string[]) => handleWizardSubmit(values, WizardStepsFormTypes.PERM_LIST) }
            />
        ),
        icon: <Icon name="key" inverted size="large" />,
        title: t("extensions:develop.applications.edit.sections.roles.addRoleWizard.wizardSteps.1")
    } ];

    /**
     * Handles the previous button navigation.
     */
    useEffect(() => {
        if (partiallyCompletedStep === undefined) {
            return;
        }
        setCurrentWizardStep(currentStep - 1);
        setPartiallyCompletedStep(undefined);
    }, [ partiallyCompletedStep ]);

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values of the step.
     * @param formType - Form type.
     */
    const handleWizardSubmit = (values: any, formType: WizardStepsFormTypes) => {

        setWizardState({ ...wizardState, [ formType ]: values });

        if (WizardStepsFormTypes.PERM_LIST !== formType) {
            setCurrentWizardStep(currentStep + 1);
        } else {
            addRole(wizardState[WizardStepsFormTypes.BASIC_DETAILS], values);
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
                setSubmitPermissionList();

                break;
        }
    };

    /**
     * Handles the previous button navigation.
     */
    const navigateToPrevious = () => {
        setPartiallyCompletedStep(currentStep);
    };

    /**
     * Create a new application role.
     * 
     * @param basicDetails - Basic details.
     * @param permissions - Permission list.
     */
    const addRole = (basicDetails: RoleBasicDetailsInterface, permissions: string[]) => {

        const roleName: string = basicDetails.basic.roleName;
        const payload: CreateRolePayloadInterface = {
            name: roleName,
            permissions: permissions.map( (permission: string) => { return { name: permission }; } )
        };

        setIsSubmitting(true);

        createRole(appId, payload)
            .then(() => {
                dispatch(addAlert({
                    description: t("extensions:develop.applications.edit.sections.roles.notifications." + 
                        "createApplicationRole.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("extensions:develop.applications.edit.sections.roles.notifications." + 
                        "createApplicationRole.success.message")
                }));
                onRoleUpdate();
            }).catch(() => {
                dispatch(addAlert({
                    description: t("extensions:develop.applications.edit.sections.roles.notifications." + 
                        "createApplicationRole.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("extensions:develop.applications.edit.sections.roles.notifications." + 
                        "createApplicationRole.genericError.message")
                }));
            }).finally(() => {
                setIsSubmitting(false);
                closeWizard();
            });
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
            data-componentid={ componentId }
        >
            <Modal.Header className="wizard-header">
                { t("extensions:develop.applications.edit.sections.roles.addRoleWizard.heading") }
                {
                    wizardState && 
                    (wizardState[ WizardStepsFormTypes.BASIC_DETAILS ])?.basic?.roleName
                        ? " - " + (wizardState[ WizardStepsFormTypes.BASIC_DETAILS ])?.basic.roleName
                        : ""
                }
                <Heading as="h6">
                    {
                        t("extensions:develop.applications.edit.sections.roles.addRoleWizard.subHeading")
                    }
                </Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group
                    current={ currentStep }
                >
                    { WIZARD_STEPS.map((step: WizardStepInterface, index: number) => (
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
                                data-componentid={ `${ componentId }-cancel-button` }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentStep < WIZARD_STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ changeStepToNext }
                                    data-componentid={ `${ componentId }-next-button` }
                                >
                                    { t("extensions:develop.applications.edit.sections.roles.addRoleWizard." + 
                                        "buttons.next") }
                                    <Icon name="arrow right" data-componentid={ `${ componentId }-next-button-icon` }/>
                                </PrimaryButton>
                            ) }
                            { currentStep === WIZARD_STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ changeStepToNext }
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                    data-componentid={ `${ componentId }-finish-button` }
                                >
                                    { t("extensions:develop.applications.edit.sections.roles.addRoleWizard." + 
                                        "buttons.finish") }
                                </PrimaryButton>
                            ) }
                            { currentStep > 0 && (
                                <LinkButton
                                    floated="right"
                                    onClick={ navigateToPrevious }
                                    data-componentid={ `${ componentId }-previous-button` }
                                >
                                    <Icon
                                        name="arrow left"
                                        data-componentid={ `${ componentId }-previous-button-icon` }
                                    />
                                    { t("extensions:develop.applications.edit.sections.roles.addRoleWizard." +
                                        "buttons.previous") }
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
 * Default props for Create application role wizard component.
 */
CreateApplicationRoleWizard.defaultProps = {
    initStep: 0
};
