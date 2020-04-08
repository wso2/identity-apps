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

import { addDialect, addExternalClaim } from "../../../api";
import { AddExternalClaim, AlertLevels } from "../../../models";
import { FormValue, useTrigger } from "@wso2is/forms";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import React, { useState } from "react";

import { addAlert } from "@wso2is/core/store";
import { ApplicationWizardStepIcons } from "../../../configs";
import { DialectDetails } from "../wizard/dialect-details-add-dialect";
import { ExternalClaims } from "../wizard/external-claims-add-dialect";
import { SummaryAddDialect } from "../wizard/summary-add-dialect";
import { useDispatch } from "react-redux";

/**
 * Prop types for `AddDialect` component.
 */
interface AddDialectPropsInterface {
    /**
     * Open the modal.
     */
    open: boolean;
    /**
     * Handler to be called when the modal is closed.
     */
    onClose: () => void;
    /**
     * Function to be called to initiate an update.
     */
    update: () => void;
}

/**
 * A component that lets you add a dialect.
 * 
 * @param {AddLocalClaimsPropsInterface} props
 * 
 * @return {React.ReactElement} component.
 */
export const AddDialect = (props: AddDialectPropsInterface): React.ReactElement => {

    const { open, onClose, update } = props;
    const [ currentWizardStep, setCurrentWizardStep ] = useState(0);
    const [ dialectDetailsData, setDialectDetailsData ] = useState<Map<string, FormValue>>(null);
    const [ externalClaims, setExternalClaims ] = useState<AddExternalClaim[]>([]);

    const [ firstStep, setFirstStep ] = useTrigger();
    const [ secondStep, setSecondStep ] = useTrigger();

    const dispatch = useDispatch();

    /**
     * Submit handler that sends the API request to add the local claim.
     */
    const handleSubmit = () => {
        addDialect(dialectDetailsData?.get("dialectURI").toString()).then(() => {
            const dialectID = window.btoa(dialectDetailsData?.get("dialectURI").toString()).replace(/=/g, "");
            const externalClaimPromises = [];
            externalClaims.forEach(claim => {
                externalClaimPromises.push(addExternalClaim(dialectID, claim));
            });
            Promise.all(externalClaimPromises).then(() => {
                dispatch(addAlert({
                    description: "The external dialect has been added successfully",
                    level: AlertLevels.SUCCESS,
                    message: "External Dialect added successfully"
                }))
            }).catch(() => {
                dispatch(addAlert({
                    description: "The external dialect has been added but not all external " +
                        "claims were added successfully",
                    level: AlertLevels.WARNING,
                    message: "External claims couldn't be added"
                }))
            }).finally(() => {
                onClose();
                update();
            });
        }).catch(error => {
            dispatch(addAlert({
                description: error?.description || "An error occurred while adding the external dialect",
                level: AlertLevels.ERROR,
                message: error?.message || "Something went wrong"
            }));
        })
    }

    /**
     * Handler that is called when the `Dialect Details` wizard step is completed.
     * 
     * @param {Map<string, FormValue>} values Form values.
     */
    const onSubmitDialectDetails = (values: Map<string, FormValue>) => {
        setCurrentWizardStep(1);
        setDialectDetailsData(values);
    }

    /**
     * Handler that is called when the `Add External CLaims` step of the wizard is completed.
     * 
     * @param {AddExternalClaim[]} values Claim Values.
     */
    const onSubmitExternalClaims = (claims: AddExternalClaim[]) => {
        setCurrentWizardStep(2);
        setExternalClaims(claims);
    }

    /**
     * An array of objects that contains data of each step of the wizard.
     */
    const STEPS = [
        {
            content: (
                <DialectDetails
                    submitState={ firstStep }
                    onSubmit={ onSubmitDialectDetails }
                    values={ dialectDetailsData }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "Dialect URI"
        },
        {
            content: (
                <ExternalClaims
                    submitState={ secondStep }
                    onSubmit={ onSubmitExternalClaims }
                    values={ externalClaims }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "External claims"
        },
        {
            content: (
                <SummaryAddDialect
                    dialectURI={ dialectDetailsData?.get("dialectURI").toString() }
                    claims={ externalClaims }
                />
            ),
            icon: ApplicationWizardStepIcons.general,
            title: "Summary"

        }
    ];

    /**
     * Moves the wizard to the next step.
     */
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

    /**
     * Moves wizard to the previous step.
     */
    const previous = () => {
        setCurrentWizardStep(currentWizardStep - 1);
    }

    return (
        <Modal
            dimmer="blurring"
            size="small"
            className="wizard application-create-wizard"
            open={ open }
            onClose={ onClose }
        >
            <Modal.Header className="wizard-header">
                Add external dialect
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group
                    header="Fill in the following details to create an external dialect."
                    current={ currentWizardStep }
                >
                    { STEPS.map((step, index) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                        />
                    )) }
                </Steps.Group>
            </Modal.Content >
            <Modal.Content className="content-container" scrolling>
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ () => onClose() }>Cancel</LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ next }>
                                    Next <Icon name="arrow right" />
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ next }>
                                    Finish</PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton floated="right" onClick={ previous }>
                                    <Icon name="arrow left" /> Previous
                                </LinkButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal >
    )
}
