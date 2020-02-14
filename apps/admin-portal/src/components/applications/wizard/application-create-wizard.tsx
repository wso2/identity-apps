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

import { Heading, LinkButton, Steps } from "@wso2is/react-components";
import { isEmpty } from "lodash";
import React, { FunctionComponent, useState } from "react";
import { Grid, Modal } from "semantic-ui-react";
import { ApplicationWizardStepIcons } from "../../../configs";
import { history } from "../../../helpers";
import { ApplicationBasicWizard, MainApplicationInterface, OIDCDataInterface } from "../../../models";
import { OAuthWebApplication, SPApplication } from "../meta";
import { WizardGeneralSettings } from "./wizard-general-settings";
import { WizardOAuthProtocolSettings } from "./wizard-protocol-oauth-settings";
import { WizardSummary } from "./wizard-summary";

interface ApplicationCreateWizardPropsInterface {
    currentStep?: number;
    title: string;
    closeWizard: any;
    templateID: string;
    protocol: string;
    subTitle?: string;
}

/**
 * Application creation wizard.
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
        templateID,
        protocol,
        title,
        subTitle
    } = props;

    const [ creationStep, setCreationStep ] = useState("GeneralSettings");
    const [ completedStep, setCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);

    // OIDC protocol settings.
    const [OIDCProtocolSetting, setOIDCProtocolSetting] = useState<OIDCDataInterface>();

    const setOIDCSettings = (OIDCdata: OIDCDataInterface) => setOIDCProtocolSetting(OIDCdata);

    // General settings
    const [ generalSettingsData, setGeneralSettingsData ] = useState<ApplicationBasicWizard>();

    const setGeneralSettings = (applicationGeneral: ApplicationBasicWizard) => {
        setGeneralSettingsData(applicationGeneral);
    };

    const [ application, setApplication ] = useState<MainApplicationInterface>();

    const updateMainApplication = (applicationData: MainApplicationInterface) => {
        if (applicationData !== application) {
            setApplication(applicationData);
        }
    };

    // Stages order for application creation.
    const steps = [ "GeneralSettings", "ProtocolSettings", "Summary", "exit" ];

    // Advance to next step defined in the steps array.
    const stepForward = () => {
        const currentStep = creationStep;
        const currentIndex = steps.indexOf(currentStep);
        if ((currentIndex + 1) < steps.length) {
            const newstep = steps[ currentIndex + 1 ];
            setCreationStep(newstep);
        } else {
            history.push("/application");
        }
    };

    // Rollback to previous step defined in the steps array.
    const stepBackward = () => {
        const currentStep = creationStep;
        const currentIndex = steps.indexOf(currentStep);
        if ((currentIndex - 1) >= 0) {
            const newstep = steps[ currentIndex - 1 ];
            setCreationStep(newstep);
        } else if (currentStep === "GeneralSettings") {
            // clean up all the states.
            setApplication({ name: "" });
            setGeneralSettings({ name: "" })
            setOIDCProtocolSetting({ grantTypes: [] })
            history.push("application/new/template");
        } else {
            history.push("application/new/template");
        }
    };

    // Load data from the templates.
    const loadTemplateData = () => {
        let applicationData: MainApplicationInterface = { ...application };
        if (templateID === "SPApplication") {
            applicationData = { ...SPApplication };
        } else if (templateID === "OAuthWebApplication") {
            applicationData = { ...OAuthWebApplication };
        }
        updateMainApplication(applicationData);
    };

    // Update the template data with user data.
    const updateTemplateData = () => {
        const applicationData: MainApplicationInterface = { ...application };
        updateGeneralDetails(applicationData);
        // TODO update protocol settings based on the protocol.
        updateOIDCProtocolDetails(applicationData);
        updateMainApplication(applicationData);
    };

    // Update General settings data.
    const updateGeneralDetails = (applicationData: MainApplicationInterface) => {
        if (generalSettingsData) {
            applicationData.name = generalSettingsData.name;
            applicationData.advancedConfigurations.discoverableByEndUsers =
                generalSettingsData.discoverableByEndUsers;
            if (!isEmpty(generalSettingsData.accessUrl)) {
                applicationData.accessUrl = generalSettingsData.accessUrl;
            }
            if (!isEmpty(generalSettingsData.description)) {
                applicationData.description = generalSettingsData.description;
            }
            if (!isEmpty(generalSettingsData.imageUrl)) {
                applicationData.imageUrl = generalSettingsData.imageUrl;
            }
        }
    };

    // Update Protocol Settings.
    const updateOIDCProtocolDetails = (applicationData: MainApplicationInterface) => {
        if (OIDCProtocolSetting) {
            applicationData.inboundProtocolConfiguration.oidc.callbackURLs = OIDCProtocolSetting.callbackURLs;
            applicationData.inboundProtocolConfiguration.oidc.publicClient = OIDCProtocolSetting.publicClient;
        }
    };

    const navigateToNext = () => {
        setCurrentWizardStep(currentWizardStep + 1);
    };

    const navigateToPrevious = () => {
        setCurrentWizardStep(currentWizardStep - 1);
    };

    const STEPS = [
        {
            content: (
                <WizardGeneralSettings
                    next={ stepForward }
                    cancel={ closeWizard }
                    triggerSubmit={ false }
                    applicationData={ generalSettingsData }
                    setApplicationData={ setGeneralSettings }
                    loadTemplate={ loadTemplateData }
                    onSubmit={ null }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "General settings"
        },
        {
            content: (
                <WizardOAuthProtocolSettings
                    back={ stepBackward }
                    next={ stepForward }
                    OIDCdata={ OIDCProtocolSetting }
                    setOIDCdata={ setOIDCSettings }
                    templateData={ application }
                />
            ),
            icon: ApplicationWizardStepIcons.protocolConfig,
            title: "Protocol Selection"
        },
        {
            content: (
                <WizardSummary
                    back={ stepBackward }
                    next={ stepForward }
                    data={ application }
                    loadData={ updateTemplateData }
                />
            ),
            icon: ApplicationWizardStepIcons.protocolSelection,
            title: "Summary"
        }
    ];

    return (
        <Modal
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
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
                            <LinkButton floated="left" onClick={ () => closeWizard() }>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && (
                                <LinkButton floated="right" onClick={ navigateToNext }>Next Step</LinkButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton floated="right" onClick={ navigateToPrevious }>Previous step</LinkButton>
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
