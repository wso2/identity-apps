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

import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import _ from "lodash";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { OutboundProvisioningSettings, WizardSummary } from "./steps";
import {
    OutboundProvisioningConnectors
} from "./steps/outbound-provisioning-connector-create-wizard-steps";
import {
    getOutboundProvisioningConnectorMetadata,
    getOutboundProvisioningConnectorsList,
    updateOutboundProvisioningConnector
} from "../../api";
import { getOutboundProvisioningConnectorWizard } from "../../configs";
import {
    IdentityProviderInterface, OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorListItemInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../../models";
import {
    handleGetOutboundProvisioningConnectorMetadataError,
    handleUpdateOutboundProvisioningConnectorError
} from "../utils";

/**
 * Interface for the outbound provisioning create wizard props.
 */
interface OutboundProvisioningConnectorCreateWizardPropsInterface extends TestableComponentInterface {
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

export const OutboundProvisioningConnectorCreateWizard:
    FunctionComponent<OutboundProvisioningConnectorCreateWizardPropsInterface> = (
    props: OutboundProvisioningConnectorCreateWizardPropsInterface
): ReactElement => {

    const {
        identityProvider,
        closeWizard,
        currentStep,
        onUpdate,
        [ "data-testid" ]: testId
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
    const [ isConnectorMetadataRequestLoading, setIsConnectorMetadataRequestLoading ] = useState<boolean>(false);
    const [ defaultConnector, setDefaultConnector ] =
        useState<OutboundProvisioningConnectorListItemInterface>(undefined);

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    /**
     * At the initial load, select the first item from the connector list so that the
     * metadata could be loaded.
     */
    useEffect(() => {
        if (!(connectorList && Array.isArray(connectorList) && connectorList.length > 0)) {
            return;
        }

        setWizardState( {
            [ WizardStepsFormTypes.CONNECTOR_SELECTION ]: {
                connectorId: connectorList[0].connectorId
            }
        });
    }, [ connectorList ]);

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
                    description: t("console:develop.features.idp.notifications.updateOutboundProvisioningConnector." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.idp.notifications.updateOutboundProvisioningConnector." +
                        "success.message")
                }));

                onUpdate(identityProvider.id);
            })
            .catch((error) => {
                handleUpdateOutboundProvisioningConnectorError(error);
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
                    setAlert({
                        description: t("console:develop.features.idp.notifications." + 
                            "getOutboundProvisioningConnectorsList.error.description", 
                            { description: error.response.data.description }
                        ),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.idp.notifications." +
                            "getOutboundProvisioningConnectorsList.error.message")
                    });

                    return;
                }

                setAlert({
                    description: t("console:develop.features.idp.notifications.getOutboundProvisioningConnectorsList." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.idp.notifications.getOutboundProvisioningConnectorsList." +
                        "genericError.message")
                });
            });
    }, []);

    useEffect(() => {
        if (!wizardState && !connectorMetaData) {
            return;
        }

        // Set the loading status.
        setIsConnectorMetadataRequestLoading(true);

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
                handleGetOutboundProvisioningConnectorMetadataError(error);
            })
            .finally(() => {
                setIsConnectorMetadataRequestLoading(false);
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
                    initialSelection={
                        wizardState && wizardState[ WizardStepsFormTypes.CONNECTOR_SELECTION ]?.connectorId
                    }
                    triggerSubmit={ submitConnectorSelection }
                    onSubmit={ (values): void => {
                        handleWizardFormSubmit(values, WizardStepsFormTypes.CONNECTOR_SELECTION);
                    } }
                    connectorList={ connectorList }
                    data-testid={ `${ testId }-connector-selection` }
                />
            ),
            icon: getOutboundProvisioningConnectorWizard().connectorSelection,
            title: t("console:develop.features.idp.wizards.addProvisioningConnector.steps.connectorSelection.title")
        },
        {
            content: (
                <OutboundProvisioningSettings
                    metadata={ connectorMetaData }
                    isLoading={ isConnectorMetadataRequestLoading }
                    initialValues={
                        (wizardState && wizardState[ WizardStepsFormTypes.CONNECTOR_DETAILS ]) ?? identityProvider }
                    onSubmit={ (values): void => handleWizardFormSubmit(
                        values, WizardStepsFormTypes.CONNECTOR_DETAILS) }
                    triggerSubmit={ submitConnectorSettings }
                    defaultConnector={ defaultConnector }
                    data-testid={ `${ testId }-provisioning-settings` }
                />
            ),
            icon: getOutboundProvisioningConnectorWizard().connectorDetails,
            title: t("console:develop.features.idp.wizards.addProvisioningConnector.steps.connectorConfiguration.title")
        },
        {
            content: (
                <WizardSummary
                    provisioningConnectorMetadata={ connectorMetaData }
                    authenticatorMetadata={ undefined }
                    triggerSubmit={ finishSubmit }
                    identityProvider={ generateWizardSummary() }
                    onSubmit={ handleWizardFormFinish }
                    data-testid={ `${ testId }-summary` }
                />
            ),
            icon: getOutboundProvisioningConnectorWizard().summary,
            title: t("console:develop.features.idp.wizards.addProvisioningConnector.steps.summary.title")
        }
    ];

    return (
        <Modal
            open={ true }
            className="wizard application-create-wizard"
            dimmer="blurring"
            size="small"
            onClose={ closeWizard }
            closeOnDimmerClick={ false }
            closeOnEscape
            data-testid={ `${ testId }-modal` }
        >
            <Modal.Header className="wizard-header" data-testid={ `${ testId }-modal-header` }>
                { t("console:develop.features.idp.modals.addProvisioningConnector.title") }
                <Heading as="h6">
                    { t("console:develop.features.idp.modals.addProvisioningConnector.subTitle") }
                </Heading>
            </Modal.Header>
            <Modal.Content className="steps-container" data-testid={ `${ testId }-modal-content-1` }>
                <Steps.Group
                    header={ t("console:develop.features.idp.wizards.addProvisioningConnector.header") }
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
            <Modal.Content className="content-container" scrolling data-testid={ `${ testId }-modal-content-2` }>
                { alert && alertComponent }
                { STEPS[ currentWizardStep ].content }
            </Modal.Content>
            <Modal.Actions data-testid={ `${ testId }-modal-actions` }>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton floated="left" onClick={ () => closeWizard() }
                                        data-testid={ `${ testId }-modal-cancel-button` }>
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < STEPS.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ navigateToNext }
                                    loading={ isConnectorMetadataRequestLoading }
                                    disabled={ isConnectorMetadataRequestLoading }
                                    data-testid={ `${ testId }-modal-next-button` }
                                >
                                    { t("console:develop.features.idp.wizards.buttons.next") }
                                    <Icon name="arrow right"/>
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === STEPS.length - 1 && (
                                <PrimaryButton floated="right" onClick={ navigateToNext }
                                               data-testid={ `${ testId }-modal-finish-button` }>
                                    { t("console:develop.features.idp.wizards.buttons.finish") }
                                </PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton floated="right" onClick={ navigateToPrevious }
                                            data-testid={ `${ testId }-modal-previous-button` }>
                                    <Icon name="arrow left"/>
                                    { t("console:develop.features.idp.wizards.buttons.previous") }
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
    currentStep: 0,
    "data-testid": "idp-edit-provisioning-connector-create-wizard"
};
