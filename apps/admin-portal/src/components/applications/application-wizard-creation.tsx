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

import { isEmpty } from "lodash";
import React, { FunctionComponent, useState } from "react";
import { Modal } from "semantic-ui-react";
import { history } from "../../helpers";
import { ApplicationBasicWizard, MainApplicationInterface } from "../../models";
import { OAuthWebApplication, SPApplication } from "./meta";
import { WizardGeneralSettings } from "./wizard-general-settings";
import { WizardOAuthProtocolSettings } from "./wizard-protocol-oauth-settings";
import { WizardSummary } from "./wizard-summary";

interface AppCreationProps {
    startWizard: boolean;
    closeWizard: any;
    templateID: string;
    protocol: string;
}

/**
 * Initiates the application creation wizard.
 *
 * @param props AppCreationProps.
 */
export const ApplicationWizardCreation: FunctionComponent<AppCreationProps> = (props): JSX.Element => {

    const {
        startWizard,
        closeWizard,
        templateID,
        protocol
    } = props;

    const [creationStep, setCreationStep] = useState("GeneralSettings");

    // OIDC protocol settings.
    const [OIDCProtocolSetting, setOIDCProtocolSetting] = useState("");

    const setCallBackURL = (callbackUrls: string) => setOIDCProtocolSetting(callbackUrls);

    // General settings
    const [generalSettingsData, setGeneralSettingsData] = useState<ApplicationBasicWizard>();

    const setGeneralSettings = (applicationGeneral: ApplicationBasicWizard) => {
        setGeneralSettingsData(applicationGeneral);
    };

    const [application, setApplication] = useState<MainApplicationInterface>();

    const updateMainApplication = (applicationData: MainApplicationInterface) => {
        if (applicationData !== application) {
            setApplication(applicationData);
        }
    };

    // Stages order for application creation.
    const steps = ["GeneralSettings", "ProtocolSettings", "Summary", "exit"];

    // Advance to next step defined in the steps array.
    const stepForward = () => {
        const currentStep = creationStep;
        const currentIndex = steps.indexOf(currentStep);
        if ((currentIndex + 1) < steps.length) {
            const newstep = steps[currentIndex + 1];
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
            const newstep = steps[currentIndex - 1];
            setCreationStep(newstep);
        } else if (currentStep === "GeneralSettings") {
            // clean up all the states.
            setApplication({ name: "" });
            setGeneralSettings({ name: "" })
            setOIDCProtocolSetting("")
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
            applicationData.inboundProtocolConfiguration.oidc.callbackURLs = [OIDCProtocolSetting];
        }
    };

    return (
        <>
            { creationStep === "GeneralSettings" && startWizard &&
            (
                <Modal open={ creationStep === "GeneralSettings" }>
                    <Modal.Header>General Details</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <WizardGeneralSettings
                                next={ stepForward }
                                cancel={ closeWizard }
                                applicationData={ generalSettingsData }
                                setApplicationData={ setGeneralSettings }
                                loadTemplate={ loadTemplateData }
                            />
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            )
            }
            { creationStep === "ProtocolSettings" &&
            (
                <Modal
                    open={ creationStep === "ProtocolSettings" }
                    size="small"
                >
                    <Modal.Header>{ protocol } Settings</Modal.Header>
                    <Modal.Content>
                        <WizardOAuthProtocolSettings
                            back={ stepBackward }
                            next={ stepForward }
                            callBackURL={ OIDCProtocolSetting }
                            setCallBackURL={ setCallBackURL }
                        />
                    </Modal.Content>
                </Modal>
            )
            }
            {
                creationStep === "Summary" &&
                (
                    <Modal
                        open={ creationStep === "Summary" }
                        size="small"
                    >
                        <Modal.Header>Summary</Modal.Header>
                        <Modal.Content>
                            <WizardSummary
                                back={ stepBackward }
                                next={ stepForward }
                                data={ application }
                                loadData={ updateTemplateData }
                            />
                        </Modal.Content>
                    </Modal>
                )
            }
        </>
    );
};
