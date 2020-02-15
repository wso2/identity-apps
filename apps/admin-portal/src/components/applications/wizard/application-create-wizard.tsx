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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { EncodeDecodeUtils } from "@wso2is/core/utils";
import { Heading, LinkButton, Steps, PrimaryButton } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { createApplication } from "../../../api";
import { ApplicationWizardStepIcons } from "../../../configs";
import { history } from "../../../helpers";
import { SupportedQuickStartTemplateTypes } from "../../../models";
import { OAuthWebApplicationTemplate, SPAApplicationTemplate } from "../meta";
import { GeneralSettingsWizardForm } from "./general-settings-wizard-form";
import { OAuthProtocolSettingsWizardForm } from "./oauth-protocol-settings-wizard-form";
import { WizardSummary } from "./wizard-summary";

/**
 * Proptypes for the application creation wizard component.
 */
interface ApplicationCreateWizardPropsInterface {
    currentStep?: number;
    title: string;
    closeWizard: any;
    templateType: SupportedQuickStartTemplateTypes; // TODO: Extend this once more types are available.
    protocol: string;
    subTitle?: string;
}

/**
 * Interface for the wizard state.
 */
interface WizardStateInterface {
    [ key: string ]: any;
}

/**
 * Enum for wizard steps form types.
 * @readonly
 * @enum {string}
 */
enum WizardStepsFormTypes {
    GENERAL_SETTINGS = "generalSettings",
    PROTOCOL_SETTINGS = "protocolSettings",
    SUMMARY = "summary"
}

/**
 * Application creation wizard component.
 *
 * @param {ApplicationCreateWizardPropsInterface} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const ApplicationCreateWizard: FunctionComponent<ApplicationCreateWizardPropsInterface> = (
    props: ApplicationCreateWizardPropsInterface
): JSX.Element => {

    const {
        closeWizard,
        currentStep,
        templateType,
        protocol,
        title,
        subTitle
    } = props;

    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);
    const [ completedStep, setCompletedStep ] = useState<number>(undefined);
    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ template, setTemplate ] = useState<any>(undefined);

    const dispatch = useDispatch();

    /**
     * Loads the application template on initial component load.
     */
    useEffect(() => {
        loadTemplate();
    }, []);

    /**
     * Sets the current wizard step to the next on every `completedStep`
     * value change , and resets the completed step value.
     */
    useEffect(() => {
        if (completedStep === undefined) {
            return;
        }

        setCurrentWizardStep(currentWizardStep + 1);
        setCompletedStep(undefined);
    }, [ completedStep ]);

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

    /**
     * Load the respective template based on the selected type.
     */
    const loadTemplate = () => {
        switch (templateType) {
            case SupportedQuickStartTemplateTypes.SPA:
                setTemplate(SPAApplicationTemplate);
                break;
            case SupportedQuickStartTemplateTypes.OAUTH_WEB_APP:
                setTemplate(OAuthWebApplicationTemplate);
                break;
            default:
                break;
        }
    };

    /**
     * Creates a new application.
     *
     * @param application - The application to be created
     */
    const createNewApplication = (application: any) => {
        createApplication(application)
            .then((response) => {
                dispatch(addAlert({
                    description: "Successfully created the application",
                    level: AlertLevels.SUCCESS,
                    message: "Creation successful"
                }));
                if (!_.isEmpty(response.headers.location)) {
                    const location = response.headers.location;
                    const createdAppID = location.substring(location.lastIndexOf("/") + 1);
                    history.push("/applications/" + createdAppID);
                }
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Application Create Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while creating the application",
                    level: AlertLevels.ERROR,
                    message: "Creation Error"
                }));
            });
    };

    /**
     * Navigates to the next wizard step.
     */
    const navigateToNext = () => {
        setCompletedStep(currentWizardStep);
    };

    /**
     * Navigates to the previous wizard step.
     */
    const navigateToPrevious = () => {
        setPartiallyCompletedStep(currentWizardStep);
    };

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     * @param {WizardStepsFormTypes} formType - Type of the form.
     */
    const handleWizardFormSubmit = (values: any, formType: WizardStepsFormTypes) => {
        setWizardState(_.merge(wizardState, { [ formType ]: values }));
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

        let summary = {};

        for (const value of Object.values(wizardState)) {
            summary = {
                ...summary,
                ...value
            };
        }

        return _.merge(_.cloneDeep(template), summary);
    };

    /**
     * Handles the final wizard submission.
     *
     * @param application - Application data.
     */
    const handleWizardFormFinish = (application: any) => {
        createNewApplication({
            ...application,
            inboundProtocolConfiguration: {
                ...application.inboundProtocolConfiguration,
                oidc: {
                    ...application.inboundProtocolConfiguration.oidc,
                    callbackURLs: EncodeDecodeUtils
                        .decodeURLRegex(application?.inboundProtocolConfiguration?.oidc?.callbackURLs)
                }
            }
        });
        history.push("/applications");
    };

    const STEPS = [
        {
            content: (
                <GeneralSettingsWizardForm
                    triggerSubmit={ completedStep === 0 || partiallyCompletedStep === 0 }
                    initialValues={ wizardState && wizardState[ WizardStepsFormTypes.GENERAL_SETTINGS ] }
                    onSubmit={ (values) => handleWizardFormSubmit(values, WizardStepsFormTypes.GENERAL_SETTINGS) }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "General settings"
        },
        {
            content: (
                <OAuthProtocolSettingsWizardForm
                    triggerSubmit={ completedStep === 1 || partiallyCompletedStep === 1 }
                    templateType={ templateType }
                    initialValues={ wizardState && wizardState[ WizardStepsFormTypes.PROTOCOL_SETTINGS ] }
                    onSubmit={ (values) => handleWizardFormSubmit(values, WizardStepsFormTypes.PROTOCOL_SETTINGS) }
                />
            ),
            icon: ApplicationWizardStepIcons.protocolConfig,
            title: "Protocol Selection"
        },
        {
            content: (
                <WizardSummary
                    triggerSubmit={ completedStep === 2 }
                    summary={ generateWizardSummary() }
                    onSubmit={ handleWizardFormFinish }
                />
            ),
            icon: ApplicationWizardStepIcons.protocolSelection,
            title: "Summary"
        }
    ];

    /**
     * Called when modal close event is triggered.
     */
    const handleWizardClose = () => {
        closeWizard();
    };

    return (
        <Modal
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            onClose={ handleWizardClose }
            closeOnDimmerClick
            closeOnEscape
        >
            <Modal.Header className="wizard-header">
                { title }
                { subTitle && <Heading as="h6">{ subTitle }</Heading> }
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group header="Fill the basic information about your application." current={ currentWizardStep }>
                    { STEPS.map((step, index) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content>
            <Modal.Content className="content-container" scrolling>
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ handleWizardClose }>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ navigateToNext }>
                                    Next Step <Icon name="arrow right"/>
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ navigateToNext }>Finish</PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton floated="right" onClick={ navigateToPrevious }>
                                    <Icon name="arrow left"/> Previous step
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
 * Default props for the application creation wizard.
 */
ApplicationCreateWizard.defaultProps = {
    currentStep: 0
};
