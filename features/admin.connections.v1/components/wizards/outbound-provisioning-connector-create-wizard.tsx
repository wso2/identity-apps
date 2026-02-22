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

import { AlertLevels, IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { FinalForm, FormApi, FormRenderProps, FormValue } from "@wso2is/form";
import { useTrigger } from "@wso2is/forms";
import { ContentLoader, Heading, LinkButton, PrimaryButton, Steps, useWizardAlert } from "@wso2is/react-components";
import { AxiosError } from "axios";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import {
    OutboundProvisioningConnectors
} from "./steps/outbound-provisioning-connectors";
import {
    getOutboundProvisioningConnectorMetadata,
    updateOutboundProvisioningConnector
} from "../../api/connections";
import useGetOutboundProvisioningConnectors from "../../api/use-get-outbound-provisioning-connectors";
import { getOutboundProvisioningConnectorWizardIcons } from "../../configs/ui";
import {
    CommonPluggableComponentMetaPropertyInterface,
    ConnectionInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorMetaDataInterface,
    OutboundProvisioningConnectorMetaInterface
} from "../../models/connection";
import {
    handleGetOutboundProvisioningConnectorMetadataError,
    handleUpdateOutboundProvisioningConnectorError
} from "../../utils/connection-utils";
import { getFilteredConnectorMetadataList } from "../../utils/provisioning-utils";
import {
    ConnectorConfigFormFields
} from "../edit/forms/outbound-provisioning-connectors/connector-config-form-fields";

/**
 * Interface for the outbound provisioning create wizard props.
 */
interface OutboundProvisioningConnectorCreateWizardPropsInterface extends TestableComponentInterface,
    IdentifiableComponentInterface {
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
    CONNECTOR_DETAILS = "ConnectorDetails"
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
            [ "data-testid" ]: testId,
            [ "data-componentid" ]: componentId = "connection-edit-provisioning-connector-create-wizard"
        } = props;

        const { t } = useTranslation();
        const dispatch: Dispatch = useDispatch();

        const [ submitConnectorSelection, setSubmitConnectorSelection ] = useTrigger();

        const formRef: React.MutableRefObject<FormApi<Record<string, unknown>> | null> =
            useRef<FormApi<Record<string, unknown>> | null>(null);

        const [ hasConnectorValidationErrors, setHasConnectorValidationErrors ] = useState<boolean>(true);
        const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
        const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
        const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);

        const [
            connectorMetaData,
            setConnectorMetaData
        ] = useState<OutboundProvisioningConnectorMetaInterface>(undefined);
        const [ newConnector, setNewConnector ] = useState(undefined);
        const [ isConnectorMetadataRequestLoading, setIsConnectorMetadataRequestLoading ] = useState<boolean>(false);
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
            () => getFilteredConnectorMetadataList(
                outboundProvisioningConnectorsList ?? [],
                isLoadingOutboundProvisioningConnectorsList as boolean
            ),

            [ outboundProvisioningConnectorsList, isLoadingOutboundProvisioningConnectorsList ]
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
                isDefault: true,
                isEnabled: true,
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

        const handleConnectorValidationChange: (hasErrors: boolean) => void = useCallback(
            (hasErrors: boolean): void => {
                setHasConnectorValidationErrors(hasErrors);
            },
            []
        );

        const navigateToNext = () => {
            switch (currentWizardStep) {
                case 0:
                    setSubmitConnectorSelection();

                    break;
                case 1:
                    setIsSubmitting(true);
                    formRef.current?.submit();

                    break;
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
            if (formType === WizardStepsFormTypes.CONNECTOR_DETAILS) {
                // For the last step, trigger the final submission
                setWizardState({ ...wizardState, [ formType ]: values });
                handleWizardFormFinish();
            } else {
                setCurrentWizardStep(currentWizardStep + 1);
                setWizardState({ ...wizardState, [ formType ]: values });
            }
        };

        /**
     * Handles the final wizard submission.
     */
        const handleWizardFormFinish = (): void => {
            const selectedConnectorId: string = wizardState[
                WizardStepsFormTypes.CONNECTOR_SELECTION ]?.connectorId;

            getOutboundProvisioningConnectorMetadata(selectedConnectorId)
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
                        data-componentid={ `${ componentId }-connector-selection` }
                    />
                ),
                icon: getOutboundProvisioningConnectorWizardIcons().connectorSelection,
                title: t("authenticationProvider:" +
                "wizards.addProvisioningConnector.steps.connectorSelection.title")
            },
            {
                content: (
                    isConnectorMetadataRequestLoading || !connectorMetaData
                        ? <ContentLoader />
                        : (
                            <FinalForm
                                onSubmit={ (values: Record<string, unknown>): void => {
                                    const properties: { key: string; value: string }[] = [];

                                    const processProperty = (
                                        property: CommonPluggableComponentMetaPropertyInterface
                                    ): void => {
                                        if (!property.key) {
                                            return;
                                        }

                                        const fieldValue: string = values[property.key] as string;

                                        if (fieldValue !== undefined
                                            && fieldValue !== null
                                            && fieldValue !== "") {
                                            properties.push({
                                                key: property.key,
                                                value: String(fieldValue)
                                            });
                                        } else if (property.defaultValue) {
                                            properties.push({
                                                key: property.key,
                                                value: property.defaultValue
                                            });
                                        }

                                        property.subProperties?.forEach(processProperty);
                                    };

                                    connectorMetaData.properties?.forEach(processProperty);

                                    const selectedId: string =
                                        wizardState[WizardStepsFormTypes.CONNECTOR_SELECTION]?.connectorId;

                                    handleWizardFormSubmit(
                                        {
                                            provisioning: {
                                                outboundConnectors: {
                                                    connectors: [
                                                        {
                                                            connectorId: selectedId,
                                                            isEnabled: true,
                                                            properties
                                                        }
                                                    ],
                                                    defaultConnectorId: selectedId
                                                }
                                            }
                                        },
                                        WizardStepsFormTypes.CONNECTOR_DETAILS
                                    );
                                } }
                                render={ ({ handleSubmit, form }: FormRenderProps): ReactElement => {
                                    formRef.current = form as FormApi<Record<string, unknown>>;

                                    return (
                                        <form onSubmit={ handleSubmit }>
                                            <ConnectorConfigFormFields
                                                metadata={ connectorMetaData }
                                                onValidationChange={ handleConnectorValidationChange }
                                                data-componentid={
                                                    `${ componentId }-connector-config-fields`
                                                }
                                            />
                                        </form>
                                    );
                                } }
                            />
                        )
                ),
                icon: getOutboundProvisioningConnectorWizardIcons().connectorDetails,
                title: t("authenticationProvider:" +
                "wizards.addProvisioningConnector.steps.connectorConfiguration.title")
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
                data-componentid={ `${ componentId }-modal` }
            >
                <Modal.Header
                    className="wizard-header"
                    data-testid={ `${ testId }-modal-header` }
                    data-componentid={ `${ componentId }-modal-header` }
                >
                    { t("authenticationProvider:modals.addProvisioningConnector.title") }
                    <Heading as="h6">
                        {
                            t("authenticationProvider:" +
                            "modals.addProvisioningConnector.subTitle")
                        }
                    </Heading>
                </Modal.Header>
                <Modal.Content
                    className="steps-container"
                    data-testid={ `${ testId }-modal-content-1` }
                    data-componentid={ `${ componentId }-modal-content-1` }
                >
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
                <Modal.Content
                    className="content-container"
                    scrolling
                    data-testid={ `${ testId }-modal-content-2` }
                    data-componentid={ `${ componentId }-modal-content-2` }
                >
                    { alert && alertComponent }
                    { STEPS[ currentWizardStep ].content }
                </Modal.Content>
                <Modal.Actions
                    data-testid={ `${ testId }-modal-actions` }
                    data-componentid={ `${ componentId }-modal-actions` }
                >
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton
                                    floated="left"
                                    onClick={ () => closeWizard() }
                                    data-testid={ `${ testId }-modal-cancel-button` }
                                    data-componentid={ `${ componentId }-modal-cancel-button` }
                                >
                                    { t("common:cancel") }
                                </LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                { currentWizardStep === 0 && (
                                    <PrimaryButton
                                        floated="right"
                                        onClick={ navigateToNext }
                                        loading={ isConnectorMetadataRequestLoading }
                                        disabled={ isConnectorMetadataRequestLoading }
                                        data-testid={ `${ testId }-modal-next-button` }
                                        data-componentid={ `${ componentId }-modal-next-button` }
                                    >
                                        { t("authenticationProvider:wizards.buttons.next") }
                                        <Icon name="arrow right"/>
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep === 1 && (
                                    <PrimaryButton
                                        floated="right"
                                        onClick={ navigateToNext }
                                        loading={ isSubmitting }
                                        disabled={
                                            isSubmitting
                                            || isConnectorMetadataRequestLoading
                                            || hasConnectorValidationErrors
                                        }
                                        data-testid={ `${ testId }-modal-finish-button` }
                                        data-componentid={ `${ componentId }-modal-finish-button` }
                                    >
                                        { t("authenticationProvider:wizards.buttons.finish") }
                                    </PrimaryButton>
                                ) }
                                { currentWizardStep > 0 && (
                                    <LinkButton
                                        floated="right"
                                        onClick={ navigateToPrevious }
                                        data-testid={ `${ testId }-modal-previous-button` }
                                        data-componentid={ `${ componentId }-modal-previous-button` }
                                    >
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
