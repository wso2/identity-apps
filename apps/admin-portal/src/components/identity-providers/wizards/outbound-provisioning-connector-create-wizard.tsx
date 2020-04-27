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

import { FunctionComponent, ReactElement, useEffect, useState } from "react";
import * as React from "react";
import {
    IdentityProviderInterface, OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorListItemInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../../../models";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useTrigger } from "@wso2is/forms";
import { OutboundProvisioningConnectorWizard } from "../../../configs";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { Heading, LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import {
    OutboundProvisioningConnectors
} from "./steps/outbound-provisioning-connector-create-wizard-steps";
import { addAlert } from "@wso2is/core/dist/src/store";
import { AlertLevels } from "@wso2is/core/dist/src/models";
import {
    getOutboundProvisioningConnectorMetadata,
    getOutboundProvisioningConnectorsList,
    updateOutboundProvisioningConnector
} from "../../../api";
import { OutboundProvisioningSettings, WizardSummary } from "./steps";
import _ from "lodash";

/**
 * Interface for the outbound provisioning create wizard props.
 */
interface OutboundProvisioningConnectorCreateWizardPropsInterface {
    identityProvider: IdentityProviderInterface;
    updateIdentityProvider: (id: string) => void;
    closeWizard: () => void;
    currentStep?: number;
    onUpdate: (id: string) => void;
}

/**
 * Interface for the wizard state.
 */
interface WizardStateInterface {
    [ key: string ]: any;
}

/**
 * Enum for wizard steps types.
 * @readonly
 * @enum {string}
 */
enum WizardStepsFormTypes {
    CONNECTOR_SELECTION = "ConnectorSelection",
    CONNECTOR_DETAILS = "ConnectorDetails",
    SUMMARY = "summary"
}

export const OutboundProvisioningConnectorCreateWizard: FunctionComponent<OutboundProvisioningConnectorCreateWizardPropsInterface> = (
    props: OutboundProvisioningConnectorCreateWizardPropsInterface
): ReactElement => {

    const {
        identityProvider,
        closeWizard,
        currentStep,
        onUpdate
    } = props;

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const [ submitConnectorSelection, setSubmitConnectorSelection ] = useTrigger();
    const [ submitConnectorSettings, setSubmitConnectorSettings ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);

    const [ connectorList, setConnectorList ] = useState<OutboundProvisioningConnectorListItemInterface[]>([]);
    const [ connectorMetaData, setConnectorMetaData ] = useState<OutboundProvisioningConnectorMetaInterface>(undefined);
    const [ newConnector, setNewConnector ] = useState(undefined);
    const [ defaultConnector, setDefaultConnector ] = useState<OutboundProvisioningConnectorListItemInterface>(undefined);

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

    useEffect(() => {
        if (newConnector === undefined) {
            return;
        }

        let connector: OutboundProvisioningConnectorInterface = { ...newConnector };

        connector = {
            ...connector,
            connectorId: wizardState[ WizardStepsFormTypes.CONNECTOR_SELECTION ]?.connectorId,
            properties: wizardState[ WizardStepsFormTypes.CONNECTOR_DETAILS ]?.provisioning?.outboundConnectors?.
                connectors[0]?.properties
        };

        delete connector["displayName"];
        updateOutboundProvisioningConnector(identityProvider.id, connector)
            .then(() => {
                dispatch(addAlert({
                    description: "Successfully added the new outbound provisioning connector.",
                    level: AlertLevels.SUCCESS,
                    message: "Update successful"
                }));

                onUpdate(identityProvider.id);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Update error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while adding new outbound provisioning connector.",
                    level: AlertLevels.ERROR,
                    message: "Update error"
                }));
            });
    }, [ newConnector ]);

    /**
     * Get the list of outbound provisioning connectors available.
     */
    useEffect(() => {
        getOutboundProvisioningConnectorsList()
            .then(response => {
                setConnectorList(response);
        })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred retrieving the outbound provisioning connectors list.",
                    level: AlertLevels.ERROR,
                    message: "Retrieval error"
                }));
            });
    }, []);

    useEffect(() => {
        if (!wizardState && !connectorMetaData) {
            return;
        }

        const selectedId: string = wizardState[ WizardStepsFormTypes.CONNECTOR_SELECTION ]?.connectorId;
        let initialConnector: OutboundProvisioningConnectorListItemInterface =
            connectorList.find(connector => connector.connectorId === selectedId);

        initialConnector = {
            ...initialConnector,
            isEnabled: true
        };
        setDefaultConnector(initialConnector);

        getOutboundProvisioningConnectorMetadata(selectedId)
            .then(response => {
                setConnectorMetaData(response);
            })
            .catch(error => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred retrieving the outbound provisioning connector meta data.",
                    level: AlertLevels.ERROR,
                    message: "Retrieval error"
                }));
            });
    }, [ wizardState && wizardState[ WizardStepsFormTypes.CONNECTOR_SELECTION ]?.connectorId ]);

    useEffect(() => {
        if (!wizardState && !defaultConnector) {
            return;
        }

        const selectedId: string = wizardState[ WizardStepsFormTypes.CONNECTOR_SELECTION ]?.connectorId;
        let initialConnector: OutboundProvisioningConnectorListItemInterface =
            connectorList.find(connector => connector.connectorId === selectedId);

        initialConnector = {
            ...initialConnector,
            isEnabled: true
        };
        setDefaultConnector(initialConnector);
    }, [ wizardState && wizardState[ WizardStepsFormTypes.CONNECTOR_SELECTION ]?.connectorId ]);

    const navigateToNext = () => {
        switch (currentWizardStep) {
            case 0:
                setSubmitConnectorSelection();
                break;
            case 1:
                setSubmitConnectorSettings();
                break;
            case 2:
                setFinishSubmit();
        }
    };

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
        setCurrentWizardStep(currentWizardStep + 1);
        setWizardState({ ...wizardState, [ formType ]: values });
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

        const wizardData: WizardStateInterface = { ...wizardState };
        let summary = {};

        for (const value of Object.values(wizardData)) {
            summary = {
                ...summary,
                ...value
            };
        }

        return _.merge(_.cloneDeep(summary));
    };

    /**
     * Handles the final wizard submission.
     */
    const handleWizardFormFinish = (): void => {
        getOutboundProvisioningConnectorMetadata(wizardState[ WizardStepsFormTypes.CONNECTOR_SELECTION ]?.connectorId)
            .then((response) => {
                setNewConnector(response);
            })
            .finally(() => {
                closeWizard();
            });
    };

    const STEPS = [
        {
            content: (
                <OutboundProvisioningConnectors
                    initialSelection={ wizardState && wizardState[ WizardStepsFormTypes.CONNECTOR_SELECTION ]?.connectorId }
                    triggerSubmit={ submitConnectorSelection }
                    onSubmit={ (values): void => handleWizardFormSubmit(values,
                        WizardStepsFormTypes.CONNECTOR_SELECTION) }
                    connectorList={ connectorList }
                />
            ),
            icon: OutboundProvisioningConnectorWizard.connectorSelection,
            title: t("Connector selection")
        },
        {
            content: (
                <OutboundProvisioningSettings
                    metadata={ connectorMetaData }
                    initialValues={ identityProvider }
                    onSubmit={ (values): void => handleWizardFormSubmit(
                        values, WizardStepsFormTypes.CONNECTOR_DETAILS) }
                    triggerSubmit={ submitConnectorSettings }
                    defaultConnector={ defaultConnector }
                />
            ),
            icon: OutboundProvisioningConnectorWizard.connectorDetails,
            title: t("Connector Details")
        },
        {
            content: (
                <WizardSummary
                    provisioningConnectorMetadata={ wizardState && wizardState[ WizardStepsFormTypes.CONNECTOR_DETAILS ] }
                    authenticatorMetadata={ undefined }
                    triggerSubmit={ finishSubmit }
                    identityProvider={ generateWizardSummary() }
                    onSubmit={ handleWizardFormFinish }
                />
            ),
            icon: OutboundProvisioningConnectorWizard.summary,
            title: t("Summary")
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
                Create outbound provisioning connector
                <Heading as="h6">Follow the steps to add new outbound provisioning connector</Heading>
            </Modal.Header>
            <Modal.Content className="steps-container">
                <Steps.Group
                    header="Fill the following details"
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
            </Modal.Content>
            <Modal.Content className="content-container" scrolling>
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ () => closeWizard() }
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ navigateToNext }
                                >
                                    Next
                                    <Icon name="arrow right"/>
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ navigateToNext }
                                >
                                    Finish</PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton
                                    floated="right"
                                    onClick={ navigateToPrevious }
                                >
                                    <Icon name="arrow left"/>
                                    Previous
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
 * Default props for the add user wizard.
 */
OutboundProvisioningConnectorCreateWizard.defaultProps = {
    currentStep: 0
};
