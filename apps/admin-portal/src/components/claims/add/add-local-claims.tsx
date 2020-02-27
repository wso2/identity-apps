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
import { useTrigger, FormValue } from "@wso2is/forms";
import { addLocalClaim } from "../../../api";
import { Steps, PrimaryButton, LinkButton } from "@wso2is/react-components";
import { ApplicationWizardStepIcons } from "../../../configs";
import { BasicDetailsLocalClaims, MappedAttributes, SummaryLocalClaims } from "../wizard";
import { Claim } from "../../../models";

interface AddLocalClaimsPropsInterface {
    open: boolean;
    onClose: () => void;
    claimID: string;
    update: () => void;
    claimURIBase: string;
}
export const AddLocalClaims = (props: AddLocalClaimsPropsInterface): React.ReactElement => {

    const { open, onClose, update, claimURIBase } = props;
    const [currentWizardStep, setCurrentWizardStep] = useState(0);
    const [data, setData] = useState<Claim>(null);
    const [basicDetailsData, setBasicDetailsData] = useState<Map<string, FormValue>>(null);
    const [additionalPropertiesData, setAdditionalPropertiesData] = useState<Map<string, FormValue>>(null);
    const [mappedAttributes, setMappedAttributes] = useState<Set<number>>(new Set([0]));

    const [firstStep, setFirstStep] = useTrigger();
    const [secondStep, setSecondStep] = useTrigger();

    const handleSubmit = () => {
        addLocalClaim(data).then(response => {
            // TODO: Notify
            onClose();
            update();
        }).catch(error => {
            // TODO: Notify
        })
    }

    const onSubmitBasicDetails = (dataFromForm, values: Map<string, FormValue>) => {
        setCurrentWizardStep(1);
        const tempData = { ...data, ...dataFromForm };
        setData(tempData);
        setBasicDetailsData(values);
        
    }

    const onSubmitAdditionalProperties = (dataFromForm, values: Map<string, FormValue>, attributes: Set<number>) => {
        setCurrentWizardStep(2);
        const tempData = { ...data, ...dataFromForm };
        setData(tempData);
        setAdditionalPropertiesData(values);
        setMappedAttributes(attributes);
    }

    const STEPS = [
        {
            content: (
                <BasicDetailsLocalClaims
                    submitState={firstStep}
                    onSubmit={onSubmitBasicDetails}
                    values={basicDetailsData}
                    claimURIBase={claimURIBase}
                />
            ),
            title: "Basic Local Claim Details",
            icon: ApplicationWizardStepIcons.general
        },
        {
            content: (
                <MappedAttributes
                    submitState={secondStep}
                    onSubmit={onSubmitAdditionalProperties}
                    values={additionalPropertiesData}
                    mappedAttributes={mappedAttributes}
                />
            ),
            title: "Mapped Attributes",
            icon: ApplicationWizardStepIcons.general
        },
        {
            content: (
                <SummaryLocalClaims data={data} />
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
            dimmer="blurring"
            size="small"
            className="wizard application-create-wizard"
            open={open}
            onClose={onClose}
        >
            <Modal.Header className="wizard-header">
                Add a Local Claim
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group header="Fill in the following details to create a local claim." current={currentWizardStep}>
                    {STEPS.map((step, index) => (
                        <Steps.Step
                            key={index}
                            icon={step.icon}
                            title={step.title}
                        />
                    ))}
                </Steps.Group>
            </Modal.Content >
            <Modal.Content className="content-container" scrolling>
                {STEPS[currentWizardStep].content}
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={1}>
                        <Grid.Column mobile={8} tablet={8} computer={8}>
                            <LinkButton floated="left" onClick={() => onClose()}>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={8} tablet={8} computer={8}>
                            {currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={next}>
                                    Next Step <Icon name="arrow right" />
                                </PrimaryButton>
                            )}
                            {currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={next}>
                                    Finish</PrimaryButton>
                            )}
                            {currentWizardStep > 0 && (
                                <LinkButton floated="right" onClick={previous}>
                                    <Icon name="arrow left" /> Previous step
                                </LinkButton>
                            )}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal >
    )
}
