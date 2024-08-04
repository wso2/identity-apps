/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
import { FormValue } from "@wso2is/form";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import { AxiosError } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import merge from "lodash-es/merge";
import React, { FunctionComponent, ReactElement, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import {
    OutboundProvisioningConnectors
} from "./steps/outbound-provisioning-connectors";
import { OutboundProvisioningSettings } from "./steps/shared-steps/outbound-provisioning-settings";
import { WizardSummary } from "./steps/shared-steps/wizard-summary";
import {
    getOutboundProvisioningConnectorMetadata,
    updateOutboundProvisioningConnector
} from "../../api/connections";
import useGetOutboundProvisioningConnectors from "../../api/use-get-outbound-provisioning-connectors";
import { getOutboundProvisioningConnectorWizardIcons } from "../../configs/ui";
import { AuthenticatorManagementConstants } from "../../constants/autheticator-constants";
import {
    ConnectionInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorListItemInterface,
    OutboundProvisioningConnectorMetaDataInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../../models/connection";
import {
    handleGetOutboundProvisioningConnectorMetadataError,
    handleUpdateOutboundProvisioningConnectorError
} from "../../utils/connection-utils";
import { getOutboundProvisioningConnectorsMetaData } from "../meta/connectors";

/**
 * Interface for the outbound provisioning create wizard props.
 */
interface OutboundProvisioningConnectorCreateWizardPropsInterface extends TestableComponentInterface {
    identityProvider: ConnectionInterface;
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
        const dispatch: Dispatch = useDispatch();

        const [ submitConnectorSelection, setSubmitConnectorSelection ] = useTrigger();
        const [ submitConnectorSettings, setSubmitConnectorSettings ] = useTrigger();
        const [ finishSubmit, setFinishSubmit ] = useTrigger();

        const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
        const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
        const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);

        const [
            connectorMetaData,
            setConnectorMetaData
        ] = useState<OutboundProvisioningConnectorMetaInterface>(undefined);
        const [ newConnector, setNewConnector ] = useState(undefined);
        const [ isConnectorMetadataRequestLoading, setIsConnectorMetadataRequestLoading ] = useState<boolean>(false);
        const [ defaultConnector, setDefaultConnector ] =
        useState<OutboundProvisioningConnectorListItemInterface>(undefined);
        const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

        const [ alert, setAlert, alertComponent ] = useWizardAlert();

        /**
         * Get the list of outbound provisioning connectors.
         */
        const {
            data: outboundProvisioningConnectorsList,
            isLoading: isLoadingOutboundProvisioningConnectorsList,
            error: outboundProvisioningConnectorsListError
        } = useGetOutboundProvisioningConnectors();

        /**
         * Transforms the outbound provisioning connectors list into
         * a list of outbound provisioning connectors metadata.
         */
        const outboundProvisioningConnectorsMetadataList: OutboundProvisioningConnectorMetaDataInterface[] = useMemo(
            () => {
                if (isLoadingOutboundProvisioningConnectorsList || !outboundProvisioningConnectorsList) {
                    return [];
                }

                const filteredConnectorList: OutboundProvisioningConnectorListItemInterface[]
                    = outboundProvisioningConnectorsList.filter(
                        (connector: OutboundProvisioningConnectorListItemInterface) =>
                            connector.connectorId !== AuthenticatorManagementConstants
                                .DEPRECATED_SCIM1_PROVISIONING_CONNECTOR_ID
                    );

                return filteredConnectorList.map((connector: OutboundProvisioningConnectorListItemInterface) => {
                    const metadata: OutboundProvisioningConnectorMetaDataInterface
                        = getOutboundProvisioningConnectorsMetaData()
                            .find((meta: OutboundProvisioningConnectorMetaDataInterface) =>
                                meta.connectorId === connector.connectorId
                            );

                    return {
                        ...connector,
                        ...metadata
                    };
                });
            }, [ outboundProvisioningConnectorsList, isLoadingOutboundProvisioningConnectorsList ]
        );

        /**
         * Handles outbound provisioning connectors list fetch error.
         */
        useEffect(() => {
            if (!outboundProvisioningConnectorsListError) {
                return;
            }

            if (outboundProvisioningConnectorsListError.response?.data?.description) {
                setAlert({
                    description: t("authenticationProvider:notifications." +
                        "getOutboundProvisioningConnectorsList.error.description",
                    { description: outboundProvisioningConnectorsListError.response.data.description }
                    ),
                    level: AlertLevels.ERROR,
                    message: t("authenticationProvider:notifications." +
                        "getOutboundProvisioningConnectorsList.error.message")
                });

                return;
            }

            setAlert({
                description: t("authenticationProvider:notifications." +
                    "getOutboundProvisioningConnectorsList." +
                    "genericError.description"),
                level: AlertLevels.ERROR,
                message: t("authenticationProvider:notifications." +
                    "getOutboundProvisioningConnectorsList." +
                    "genericError.message")
            });
        }, [ outboundProvisioningConnectorsListError ]);

        /**
     * At the initial load, select the first item from the connector list so that the
     * metadata could be loaded.
     */
        useEffect(() => {
            if (!(outboundProvisioningConnectorsList
                && Array.isArray(outboundProvisioningConnectorsList)
                && outboundProvisioningConnectorsList.length > 0)) {
                return;
            }

            setWizardState( {
                [ WizardStepsFormTypes.CONNECTOR_SELECTION ]: {
                    connectorId: outboundProvisioningConnectorsList[0].connectorId
                }
            });
        }, [ outboundProvisioningConnectorsList ]);

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
                        description: t("authenticationProvider:notifications." +
                        "updateOutboundProvisioningConnector." +
                        "success.description"),
                        level: AlertLevels.SUCCESS,
                        message: t("authenticationProvider:notifications." +
                        "updateOutboundProvisioningConnector." +
                        "success.message")
                    }));

                    onUpdate(identityProvider.id);
                })
                .catch((error: AxiosError) => {
                    handleUpdateOutboundProvisioningConnectorError(error);
                });
        }, [ newConnector ]);

        useEffect(() => {
            if (!wizardState && !connectorMetaData) {
                return;
            }

            // Set the loading status.
            setIsConnectorMetadataRequestLoading(true);

            const selectedId: string = wizardState[ WizardStepsFormTypes.CONNECTOR_SELECTION ]?.connectorId;
            let initialConnector: OutboundProvisioningConnectorListItemInterface =
            outboundProvisioningConnectorsList.find((connector: OutboundProvisioningConnectorListItemInterface) =>
                connector.connectorId === selectedId);

            initialConnector = {
                ...initialConnector,
                isEnabled: true
            };

            setDefaultConnector(initialConnector);

            getOutboundProvisioningConnectorMetadata(selectedId)
                .then((response: OutboundProvisioningConnectorMetaInterface) => {
                    setConnectorMetaData(response);
                })
                .catch((error: AxiosError) => {
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
            outboundProvisioningConnectorsList.find((connector: OutboundProvisioningConnectorListItemInterface) =>
                connector.connectorId === selectedId);

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
                    setIsSubmitting(true);
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
         * @param WizardStepsFormTypes - Type of the form.
         */
        const handleWizardFormSubmit = (values: any, formType: WizardStepsFormTypes) => {
            setCurrentWizardStep(currentWizardStep + 1);
            setWizardState({ ...wizardState, [ formType ]: values });
        };

        /**
         * Generates a summary of the wizard.
         *
         */
        const generateWizardSummary = () => {
            if (!wizardState) {
                return;
            }

            const wizardData: WizardStateInterface = { ...wizardState };
            let summary: WizardStateInterface = {};

            for (const value of Object.values(wizardData)) {
                summary = {
                    ...summary,
                    ...value
                };
            }

            return merge(cloneDeep(summary));
        };

        /**
     * Handles the final wizard submission.
     */
        const handleWizardFormFinish = (): void => {
            getOutboundProvisioningConnectorMetadata(wizardState[
                WizardStepsFormTypes.CONNECTOR_SELECTION ]?.connectorId)
                .then((response: OutboundProvisioningConnectorMetaInterface) => {
                    setNewConnector(response);
                })
                .finally(() => {
                    setIsSubmitting(false);
                    closeWizard();
                });
        };

        const STEPS: { content: ReactElement, icon: any, title: string }[] = [
            {
                content: (
                    <OutboundProvisioningConnectors
                        initialSelection={
                            wizardState && wizardState[ WizardStepsFormTypes.CONNECTOR_SELECTION ]?.connectorId
                        }
                        triggerSubmit={ submitConnectorSelection }
                        onSubmit={ (values: Map<string, FormValue>): void => {
                            handleWizardFormSubmit(values, WizardStepsFormTypes.CONNECTOR_SELECTION);
                        } }
                        connectorList={ outboundProvisioningConnectorsMetadataList }
                        data-testid={ `${ testId }-connector-selection` }
                    />
                ),
                icon: getOutboundProvisioningConnectorWizardIcons().connectorSelection,
                title: t("authenticationProvider:" +
                "wizards.addProvisioningConnector.steps.connectorSelection.title")
            },
            {
                content: (
                    <OutboundProvisioningSettings
                        metadata={ connectorMetaData }
                        isLoading={ isConnectorMetadataRequestLoading }
                        initialValues={
                            (wizardState && wizardState[ WizardStepsFormTypes.CONNECTOR_DETAILS ]) ?? identityProvider }
                        onSubmit={ (values: ConnectionInterface): void => handleWizardFormSubmit(
                            values, WizardStepsFormTypes.CONNECTOR_DETAILS) }
                        triggerSubmit={ submitConnectorSettings }
                        defaultConnector={ defaultConnector }
                        data-testid={ `${ testId }-provisioning-settings` }
                    />
                ),
                icon: getOutboundProvisioningConnectorWizardIcons().connectorDetails,
                title: t("authenticationProvider:" +
                "wizards.addProvisioningConnector.steps.connectorConfiguration.title")
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
                icon: getOutboundProvisioningConnectorWizardIcons().summary,
                title: t("authenticationProvider:" +
                "wizards.addProvisioningConnector.steps.summary.title")
            }
        ];

        return (
            <Modal
                open={ true }
                className="wizard application-create-wizard"
                dimmer="blurring"
                onClose={ closeWizard }
                closeOnDimmerClick={ false }
                closeOnEscape
                data-testid={ `${ testId }-modal` }
            >
                <Modal.Header className="wizard-header" data-testid={ `${ testId }-modal-header` }>
                    { t("authenticationProvider:modals.addProvisioningConnector.title") }
                    <Heading as="h6">
                        {
                            t("authenticationProvider:" +
                            "modals.addProvisioningConnector.subTitle")
                        }
                    </Heading>
                </Modal.Header>
                <Modal.Content className="steps-container" data-testid={ `${ testId }-modal-content-1` }>
                    <Steps.Group
                        header={ t("authenticationProvider:wizards." +
                        "addProvisioningConnector.header") }
                        current={ currentWizardStep }
                    >
                        {
                            STEPS.map(
                                (step: {
                                    content: ReactElement;
                                    icon: any;
                                    title: string;
                                },
                                index: number) => (
                                    <Steps.Step
                                        key={ index }
                                        icon={ step.icon }
                                        title={ step.title }
                                    />
                                )
                            )
                        }
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
                                <LinkButton
                                    floated="left"
                                    onClick={ () => closeWizard() }
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
                                        { t("authenticationProvider:wizards.buttons.next") }
                                        <Icon name="arrow right"/>
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep === STEPS.length - 1 && (
                                    <PrimaryButton
                                        floated="right"
                                        onClick={ navigateToNext }
                                        loading={ isSubmitting }
                                        disabled={ isSubmitting }
                                        data-testid={ `${ testId }-modal-finish-button` }
                                    >
                                        { t("authenticationProvider:wizards.buttons.finish") }
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep > 0 && (
                                    <LinkButton
                                        floated="right"
                                        onClick={ navigateToPrevious }
                                        data-testid={ `${ testId }-modal-previous-button` }>
                                        <Icon name="arrow left"/>
                                        {
                                            t("authenticationProvider:wizards.buttons.previous")
                                        }
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
