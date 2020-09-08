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

import { AlertLevels, Claim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FormValue, useTrigger } from "@wso2is/forms";
import { LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { addLocalClaim } from "../../api";
import { AddLocalClaimWizardStepIcons } from "../../configs";
import { BasicDetailsLocalClaims, MappedAttributes, SummaryLocalClaims } from "../wizard";

/**
 * Prop types for `AddLocalClaims` component
 */
interface AddLocalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * Open the modal
     */
    open: boolean;
    /**
     * Handler to be called when the modal is closed
     */
    onClose: () => void;
    /**
     * Function to be called to initiate an update
     */
    update: () => void;
    /**
     * The base URI of the claim
     */
    claimURIBase: string;
}

/**
 * A component that lets you add a local claim
 *
 * @param {AddLocalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AddLocalClaims: FunctionComponent<AddLocalClaimsPropsInterface> = (
    props: AddLocalClaimsPropsInterface
): ReactElement => {

    const {
        open,
        onClose,
        update,
        claimURIBase,
        [ "data-testid" ]: testId
    } = props;

    const [ currentWizardStep, setCurrentWizardStep ] = useState(0);
    const [ data, setData ] = useState<Claim>(null);
    const [ basicDetailsData, setBasicDetailsData ] = useState<Map<string, FormValue>>(null);
    const [ mappedAttributesData, setMappedAttributesData ] = useState<Map<string, FormValue>>(null);

    const [ firstStep, setFirstStep ] = useTrigger();
    const [ secondStep, setSecondStep ] = useTrigger();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    /**
     * Submit handler that sends the API request to add the local claim
     */
    const handleSubmit = () => {
        addLocalClaim(data).then(() => {
            dispatch(addAlert(
                {
                    description: t("adminPortal:components.claims.local.notifications." +
                        "addLocalClaim.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("adminPortal:components.claims.local.notifications." +
                        "addLocalClaim.success.message")
                }
            ));
            onClose();
            update();
        }).catch(error => {
            dispatch(addAlert(
                {
                    description: error?.description
                        || t("adminPortal:components.claims.local.notifications." +
                            "addLocalClaim.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: error?.message
                        || t("adminPortal:components.claims.local.notifications.addLocalClaim.genericError.message")
                }
            ));
        })
    };

    /**
     * Handler that is called when the `Basic Details` wizard step is completed
     * @param {Claim} dataFromForm
     * @param {Map<string, FormValue>} values
     */
    const onSubmitBasicDetails = (dataFromForm: Claim, values: Map<string, FormValue>) => {
        setCurrentWizardStep(1);
        const tempData = { ...data, ...dataFromForm };
        setData(tempData);
        setBasicDetailsData(values);
    };

    /**
     * Handler that is called when the `Mapped Attributes` step of the wizard is completed
     * @param {Claim} dataFromForm
     * @param {KeyValue[]} values
     */
    const onSubmitMappedAttributes = (dataFromForm: Claim, values: Map<string, FormValue>) => {
        setCurrentWizardStep(2);
        const tempData = { ...data, ...dataFromForm };
        setData(tempData);
        setMappedAttributesData(values);
    };

    /**
     * An array of objects that contains data of each step of the wizard
     */
    const STEPS = [
        {
            content: (
                <BasicDetailsLocalClaims
                    submitState={ firstStep }
                    onSubmit={ onSubmitBasicDetails }
                    values={ basicDetailsData }
                    claimURIBase={ claimURIBase }
                    data-testid={ `${ testId }-local-claims-basic-details` }
                />
            ),
            icon: AddLocalClaimWizardStepIcons.general,
            title: t("adminPortal:components.claims.local.wizard.steps.general")
        },
        {
            content: (
                <MappedAttributes
                    submitState={ secondStep }
                    onSubmit={ onSubmitMappedAttributes }
                    values={ mappedAttributesData }
                    data-testid={ `${ testId }-mapped-attributes` }
                />
            ),
            icon: AddLocalClaimWizardStepIcons.general,
            title: t("adminPortal:components.claims.local.wizard.steps.mapAttributes")
        },
        {
            content: (
                <SummaryLocalClaims
                    data={ data }
                    data-testid={ `${ testId }-local-claims-summary` }
                />
            ),
            icon: AddLocalClaimWizardStepIcons.general,
            title: t("adminPortal:components.claims.local.wizard.steps.summary")

        }
    ];

    /**
     * Moves the wizard to the next step
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
    };

    /**
     * Moves wizard to teh previous step
     */
    const previous = () => {
        setCurrentWizardStep(currentWizardStep - 1);
    };

    return (
        <Modal
            dimmer="blurring"
            size="small"
            className="wizard application-create-wizard"
            open={ open }
            onClose={ onClose }
            data-testid={ testId }
        >
            <Modal.Header className="wizard-header">
                { t("adminPortal:components.claims.local.wizard.header") }
            </Modal.Header>
            <Modal.Content className="steps-container" data-testid={ `${ testId }-steps` }>
                <Steps.Group
                    current={ currentWizardStep }
                >
                    { STEPS.map((step, index) => (
                        <Steps.Step
                            key={ index }
                            icon={ step.icon }
                            title={ step.title }
                            data-testid={ `${ testId }-step-${ index }` }
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
                                <PrimaryButton
                                    floated="right"
                                    onClick={ next }
                                    data-testid={ `${ testId }-next-button` }
                                >
                                    { t("common:next") } <Icon name="arrow right" />
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ next }
                                    data-testid={ `${ testId }-finish-button` }
                                >
                                    { t("common:finish") }</PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton
                                    floated="right"
                                    onClick={ previous }
                                    data-testid={ `${ testId }-previous-button` }
                                >
                                    <Icon name="arrow left" /> { t("common:previous") }
                                </LinkButton>
                            ) }
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Modal.Actions>
        </Modal >
    )
};

/**
 * Default props for the component.
 */
AddLocalClaims.defaultProps = {
    "data-testid": "add-local-claims-wizard"
};
