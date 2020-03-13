/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import React, { useState } from "react";
import { Modal, Grid, Icon } from "semantic-ui-react";
import { LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import { FormValue, useTrigger } from "@wso2is/forms";
import { ApplicationWizardStepIcons } from "../../configs";
import { BasicDetailsUserStore, ConnectionDetails } from "./wizards";

interface AddUserStoreProps {
    open: boolean;
    onClose: () => void;

}
export const AddUserStore = (props: AddUserStoreProps): React.ReactElement => {

    const { open, onClose } = props;

    const [currentWizardStep, setCurrentWizardStep] = useState(0);
    const [basicDetailsData, setBasicDetailsData] = useState<Map<string, FormValue>>(null);
    const [connectionDetailsData, setConnectionDetailsData] = useState<Map<string, FormValue>>(null);

    const [firstStep, setFirstStep] = useTrigger();
    const [secondStep, setSecondStep] = useTrigger();

    const handleSubmit = () => {
        alert("")
    };
    const onSubmitBasicDetails = (values: Map<string, FormValue>) => {
        setBasicDetailsData(values);
        setCurrentWizardStep(1);
    }

    const onSubmitConnectionDetails = (values: Map<string, FormValue>) => {
        setConnectionDetailsData(values);
        setCurrentWizardStep(2);
    }

    const STEPS = [
        {
            content: (
                <BasicDetailsUserStore
                    submitState={ firstStep }
                    onSubmit={ onSubmitBasicDetails }
                    values={ basicDetailsData }
                />
            ),
            title: "Basic User Store Details",
            icon: ApplicationWizardStepIcons.general
        },
        {
            content: (
                <ConnectionDetails
                    submitState={ secondStep }
                    onSubmit={ onSubmitConnectionDetails }
                    values={ connectionDetailsData }
                    typeId={ basicDetailsData?.get("type").toString() }
                />
            ),
            title: "Connection Details",
            icon: ApplicationWizardStepIcons.general
        },
        {
            content: (
                null
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "Summary"

        }
    ];

    const next = () => {
        switch (currentWizardStep) {
            case 0:
                setFirstStep();
                break;
            case 1:
                setSecondStep();
                break;
            case 2:
                handleSubmit();
                break;
        }
    }

    const previous = () => {
        setCurrentWizardStep(currentWizardStep - 1);
    }

    return (
        <Modal
            open={ open }
            onClose={ onClose }
            dimmer="blurring"
            size="small"
            className="wizard application-create-wizard"
        >
            <Modal.Header className="wizard-header">
                Add a User Store
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group header="Fill in the following details to create a local claim." current={ currentWizardStep }>
                    {STEPS.map((step, index) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                        />
                    ))}
                </Steps.Group>
            </Modal.Content >
            <Modal.Content className="content-container" scrolling>
                {STEPS[currentWizardStep].content}
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ () => onClose() }>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            {currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ next }>
                                    Next Step <Icon name="arrow right" />
                                </PrimaryButton>
                            )}
                            {currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ next }>
                                    Finish</PrimaryButton>
                            )}
                            {currentWizardStep > 0 && (
                                <LinkButton floated="right" onClick={ previous }>
                                    <Icon name="arrow left" /> Previous step
                                </LinkButton>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal>
    )
}
