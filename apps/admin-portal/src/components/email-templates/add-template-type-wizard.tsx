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

import React, { ReactElement, FunctionComponent, useState } from "react";
import { Modal, Grid } from "semantic-ui-react";
import { Heading, Steps, LinkButton, PrimaryButton } from "@wso2is/react-components";
import { AddEmailTemplateType } from "./add-template-type";
import { ApplicationWizardStepIcons } from "../../configs";
import { useTrigger } from "@wso2is/forms";

export const EmailTemplateTypeWizard: FunctionComponent<any> = (props: any): ReactElement => {

    const [ currentStep, setCurrentWizardStep ] = useState<number>(0);
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const handleFormSubmit = (values: any): void => {
        //TODO handle form submit
    }

    const WIZARD_STEPS = [{
        content: (
            <AddEmailTemplateType 
                onSubmit={ (values) =>  handleFormSubmit(values) }
            />
        ),
        icon: ApplicationWizardStepIcons.general,
        title: "Template Type"
    }]

    return (
        <Modal
            open={ true }
            className="wizard create-template-type-wizard"
            dimmer="blurring"
            size="small"
            onClose={ () => { console.log() } }
            closeOnDimmerClick={ false }
            closeOnEscape={ false }
        >
            <Modal.Header className="wizard-header">
                Create Email Template Type
                <Heading as="h6">Create a new Email Template Type in the system.</Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group 
                    header="Fill the following mandatory details of the new template type." 
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
                {WIZARD_STEPS[currentStep].content}
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ () => { console.log() } }>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <PrimaryButton floated="right" onClick={ setFinishSubmit }>
                                Finish
                            </PrimaryButton>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    )
}
