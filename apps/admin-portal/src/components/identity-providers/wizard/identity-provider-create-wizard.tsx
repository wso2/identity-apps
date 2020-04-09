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

import { Grid, Icon, Modal } from "semantic-ui-react";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import _ from "lodash";

import { Heading, LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";
import { addAlert } from "@wso2is/core/store";
import { AlertLevels } from "@wso2is/core/models";
import { useTrigger } from "@wso2is/forms";

import {
    createIdentityProvider,
    getFederatedAuthenticatorMetadata,
    getOutboundProvisioningConnectorMetadata
} from "../../../api";
import { history } from "../../../helpers";
import {
    AuthenticatorProperty,
    FederatedAuthenticatorMetaInterface,
    IdentityProviderInterface,
    OutboundProvisioningConnectorMetaInterface,
    OutboundProvisioningConnectorProperty,
    ProvisioningInterface
} from "../../../models";
import { AppState, store } from "../../../store";
import { IdentityProviderConstants } from "../../../constants";
import { IdentityProviderWizardStepIcons } from "../../../configs";
import { IdentityProviderManagementUtils } from "../../../utils";

import { AuthenticatorSettings, GeneralSettings, WizardSummary } from "./steps";
import { OutboundProvisioningSettings } from "./steps";

/**
 * Proptypes for the identity provider creation wizard component.
 */
interface IdentityProviderCreateWizardPropsInterface {
    currentStep?: number;
    title: string;
    closeWizard: () => void;
    template: IdentityProviderInterface;
    subTitle?: string;
}

/**
 * Enum for wizard.
 *
 * @readonly
 * @enum {string}
 */
enum WizardConstants {
    IDENTITY_PROVIDER = "identityProvider"
}

/**
 * Constants for wizard steps.
 */
enum WizardSteps {
    GENERAL_DETAILS = "GeneralDetails",
    AUTHENTICATOR_SETTINGS = "AuthenticatorSettings",
    OUTBOUND_PROVISIONING_SETTINGS = "OutboundProvisioningSettings",
    SUMMARY = "Summary"
}

/**
 * Interface for the wizard state.
 */
interface WizardStateInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

/**
 * Interface for the wizard steps.
 */
interface WizardStepInterface {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any;
    title: string;
    submitCallback: any;
    name: WizardSteps;
}

/**
 * Identity provider creation wizard component.
 *
 * @param {IdentityProviderCreateWizardPropsInterface} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const IdentityProviderCreateWizard: FunctionComponent<IdentityProviderCreateWizardPropsInterface> = (
    props: IdentityProviderCreateWizardPropsInterface
): ReactElement => {

    const {
        closeWizard,
        currentStep,
        title,
        subTitle,
        template
    } = props;

    const [initWizard, setInitWizard] = useState<boolean>(false);
    const [wizardSteps, setWizardSteps] = useState<WizardStepInterface[]>(undefined);
    const [isSelectionHidden, setIsSelectionHidden] = useState<boolean>(false);
    const [wizardState, setWizardState] = useState<WizardStateInterface>(undefined);
    const [partiallyCompletedStep, setPartiallyCompletedStep] = useState<number>(undefined);
    const [currentWizardStep, setCurrentWizardStep] = useState<number>(currentStep);
    const [defaultAuthenticatorMetadata, setDefaultAuthenticatorMetadata] =
        useState<FederatedAuthenticatorMetaInterface>(undefined);
    const [defaultOutboundProvisioningConnectorMetadata, setDefaultOutboundProvisioningConnectorMetadata] =
        useState<OutboundProvisioningConnectorMetaInterface>(undefined);

    const dispatch = useDispatch();

    const availableAuthenticators = useSelector((state: AppState) =>
        state.identityProvider.meta.authenticators);

    // Triggers for each wizard step.
    const [submitGeneralSettings, setSubmitGeneralSettings] = useTrigger();
    const [submitAuthenticator, setSubmitAuthenticator] = useTrigger();
    const [submitOutboundProvisioningSettings, setSubmitOutboundProvisioningSettings] = useTrigger();
    const [finishSubmit, setFinishSubmit] = useTrigger();

    /**
     * Creates a new identity provider.
     *
     * @param identityProvider Identity provider object.
     */
    const createNewIdentityProvider = (identityProvider: IdentityProviderInterface): void => {
        createIdentityProvider(identityProvider)
            .then((response) => {
                dispatch(addAlert({
                    description: "Successfully created the identity provider",
                    level: AlertLevels.SUCCESS,
                    message: "Creation successful"
                }));

                // The created resource's id is sent as a location header.
                // If that's available, navigate to the edit page.
                if (!_.isEmpty(response.headers.location)) {
                    const location = response.headers.location;
                    const createdIdpID = location.substring(location.lastIndexOf("/") + 1);
                    history.push(IdentityProviderConstants.PATHS.get("IDENTITY_PROVIDER_EDIT").replace(":id",
                        createdIdpID));
                    return;
                }

                // Fallback to identity providers page, if the location header is not present.
                history.push(IdentityProviderConstants.PATHS.get("IDENTITY_PROVIDERS"));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Identity provider Create Error"
                    }));

                    return;
                }

                dispatch(addAlert({
                    description: "An error occurred while creating the identity provider",
                    level: AlertLevels.ERROR,
                    message: "Creation Error"
                }));
            });
    };

    /**
     * Navigates to the next wizard step.
     */
    const navigateToNext = (): void => {
        let step = currentWizardStep;

        if (isSelectionHidden) {
            step = currentWizardStep + 1;
        }

        switch (wizardSteps[step]?.name) {
            case WizardSteps.GENERAL_DETAILS:
                setSubmitGeneralSettings();
                break;
            case WizardSteps.AUTHENTICATOR_SETTINGS:
                setSubmitAuthenticator();
                break;
            case WizardSteps.OUTBOUND_PROVISIONING_SETTINGS:
                setSubmitOutboundProvisioningSettings();
                break;
            case WizardSteps.SUMMARY:
                setFinishSubmit();
                break;
            default:
                break;
        }
    };

    /**
     * Navigates to the previous wizard step.
     */
    const navigateToPrevious = (): void => {
        setPartiallyCompletedStep(currentWizardStep);
    };

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     * @param {WizardConstants} formType - Type of the form.
     */
    const handleWizardFormSubmit = (values: any, formType: WizardConstants): void => {
        setCurrentWizardStep(currentWizardStep + 1);
        setWizardState(_.merge(wizardState, { [formType]: values }));
    };

    /**
     * Generates a summary of the wizard.
     */
    const generateWizardSummary = (): IdentityProviderInterface => {
        if (!wizardState) {
            return;
        }

        return wizardState[WizardConstants.IDENTITY_PROVIDER];
    };

    /**
     * Handles the final wizard submission.
     *
     * @param identityProvider - Identity provider data.
     */
    const handleWizardFormFinish = (identityProvider: IdentityProviderInterface): void => {
        createNewIdentityProvider(identityProvider);
    };

    /**
     * Called when modal close event is triggered.
     */
    const handleWizardClose = (): void => {

        // Clear data.
        setDefaultOutboundProvisioningConnectorMetadata(undefined);
        setDefaultAuthenticatorMetadata(undefined);

        // Trigger the close method from props.
        closeWizard();
    };

    /**
     * Resolves the step content.
     *
     * @return {React.ReactElement} Step content.
     */
    const resolveStepContent = (currentStep: number): ReactElement => {
        let step = currentStep;

        if (isSelectionHidden) {
            step = currentStep + 1;
        }

        switch (wizardSteps[step]?.name) {
            case WizardSteps.GENERAL_DETAILS: {
                return (
                    <GeneralSettings
                        triggerSubmit={ submitGeneralSettings }
                        initialValues={ wizardState && wizardState[WizardConstants.IDENTITY_PROVIDER] }
                        onSubmit={ (values): void => handleWizardFormSubmit(values,
                            WizardConstants.IDENTITY_PROVIDER) }
                    />
                );
            }
            case WizardSteps.AUTHENTICATOR_SETTINGS: {
                return (
                    <AuthenticatorSettings
                        metadata={ defaultAuthenticatorMetadata }
                        initialValues={ wizardState[WizardConstants.IDENTITY_PROVIDER] }
                        onSubmit={ (values): void => handleWizardFormSubmit(
                            values, WizardConstants.IDENTITY_PROVIDER) }
                        triggerSubmit={ submitAuthenticator }
                    />
                )
            }
            case WizardSteps.OUTBOUND_PROVISIONING_SETTINGS: {
                return (
                    <OutboundProvisioningSettings
                        metadata={ defaultOutboundProvisioningConnectorMetadata }
                        initialValues={ wizardState[WizardConstants.IDENTITY_PROVIDER] }
                        onSubmit={ (values): void => handleWizardFormSubmit(
                            values, WizardConstants.IDENTITY_PROVIDER) }
                        triggerSubmit={ submitOutboundProvisioningSettings }
                    />
                )
            }
            case WizardSteps.SUMMARY: {
                return (
                    <WizardSummary
                        provisioningConnectorMetadata={ defaultOutboundProvisioningConnectorMetadata }
                        authenticatorMetadata={ defaultAuthenticatorMetadata }
                        triggerSubmit={ finishSubmit }
                        identityProvider={ generateWizardSummary() }
                        onSubmit={ handleWizardFormFinish }
                    />
                )
            }
        }
    };

    /**
     * Loads the identity provider authenticators on initial component load.
     */
    useEffect(() => {
        let isWaiting = false;
        if (isAuthenticatorSettingsStepAvailable() && _.isEmpty(availableAuthenticators)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const status = IdentityProviderManagementUtils.getAuthenticators();
            isWaiting = true;
        }

        if (isOutboundProvisioningSettingsStepAvailable()) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const status = getProvisioningConnectorMetadata(template.provisioning.outboundConnectors
                .defaultConnectorId);
            isWaiting = true;
        }

        // If there are no data retrieval requirements.
        if (!isWaiting) {
            setInitWizard(true);
        }
    }, []);

    /**
     * Gets the authenticator meta data.
     *
     * @param authenticatorId
     */
    const getAuthenticatorMetadata = (authenticatorId: string): Promise<void> => {
        return getFederatedAuthenticatorMetadata(authenticatorId)
            .then((response) => {
                setDefaultAuthenticatorMetadata(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    store.dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));
                    return;
                }
                store.dispatch(addAlert({
                    description: "An error occurred retrieving the authenticator: ." + authenticatorId,
                    level: AlertLevels.ERROR,
                    message: "Retrieval error"
                }));
            });
    };

    /**
     * Gets the outbound authenticator meta data.
     *
     * @param connectorId ID of the outbound provisioning connector.
     */
    const getProvisioningConnectorMetadata = (connectorId: string): Promise<void> => {
        return getOutboundProvisioningConnectorMetadata(connectorId)
            .then((response) => {
                setDefaultOutboundProvisioningConnectorMetadata(response);
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    store.dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: "Retrieval error"
                    }));
                    return;
                }
                store.dispatch(addAlert({
                    description: "An error occurred retrieving the outbound provisioning connector: ." + connectorId,
                    level: AlertLevels.ERROR,
                    message: "Retrieval error"
                }));
            });
    };

    /**
     * Called when `availableAuthenticators` are changed.
     */
    useEffect(() => {
        if (availableAuthenticators?.find(eachAuthenticator => eachAuthenticator.authenticatorId ===
            template?.federatedAuthenticators?.defaultAuthenticatorId)) {
            getAuthenticatorMetadata(template?.federatedAuthenticators?.defaultAuthenticatorId);
        }
    }, [availableAuthenticators]);

    /**
     * Update initial elements with a matching element form the source elements, if exists. Matching is done via the
     * provided `key` attribute.
     *
     * @param initial Initial elements array.
     * @param source Source elements array.
     * @param key String attribute which is used to match elements.
     * @return Updated initial elements array, with the matching elements in the source elements array.
     */
    const getUpdatedElementsByKey = (initial: any[], source: any[], key: string) => {
        return initial?.map(eachInitialElement => {
            const match = source.find(eachSourceElement => eachSourceElement[key] === eachInitialElement[key]);
            return match ? match : eachInitialElement;
        });
    };

    /**
     * Validate and get federate authenticators.
     */
    const getValidatedAuthenticators = () => {
        const defaultAuthenticatorPropertiesFromMetadata = defaultAuthenticatorMetadata?.properties.map(
            (eachProp): AuthenticatorProperty => {
                return {
                    key: eachProp?.key,
                    value: eachProp?.defaultValue
                }
            });

        // For the default authenticator, update values of it's properties with the corresponding value from the
        // template, if any.
        // todo Need to do the same for rest of the configured authenticators in the template.
        const authenticatorsInTemplate = template?.federatedAuthenticators.authenticators;
        return {
            authenticators: authenticatorsInTemplate.map((authenticator) => {
                return authenticator.authenticatorId === template.federatedAuthenticators.defaultAuthenticatorId ?
                    {
                        ...authenticator,
                        properties: getUpdatedElementsByKey(defaultAuthenticatorPropertiesFromMetadata, 
                            authenticator.properties, "key")
                        // properties: _.merge(defaultAuthenticatorPropertiesFromMetadata, authenticator.properties)
                    } : authenticator;
            }),
            defaultAuthenticatorId: template.federatedAuthenticators.defaultAuthenticatorId
        };
    };

    /**
     * Validate and get outbound provisioning connectors.
     */
    const getValidatedOutboundProvisioningConnectors = () => {
        const defaultConnectorPropertiesFromMetadata = defaultOutboundProvisioningConnectorMetadata?.properties.map(
            (eachProp): OutboundProvisioningConnectorProperty => {
                return {
                    key: eachProp?.key,
                    value: eachProp?.defaultValue
                }
            });

        // For the default connector, update values of it's properties with the corresponding value from the
        // template, if any.
        // todo Need to do the same for rest of the configured authenticators in the template.
        const connectorsInTemplate = template?.provisioning.outboundConnectors.connectors;
        return {
            connectors: connectorsInTemplate.map((templateConnector) => {
                return templateConnector.connectorId === template.provisioning.outboundConnectors.defaultConnectorId ?
                    {
                        ...templateConnector,
                        properties: getUpdatedElementsByKey(defaultConnectorPropertiesFromMetadata,
                            templateConnector?.properties, "key")
                    } : templateConnector;
            }),
            defaultConnectorId: template.provisioning.outboundConnectors.defaultConnectorId
        } as IdentityProviderInterface;
    };

    const isAuthenticatorSettingsStepAvailable = () => {
        return template?.federatedAuthenticators?.defaultAuthenticatorId;
    };

    const isOutboundProvisioningSettingsStepAvailable = () => {
        return template?.provisioning?.outboundConnectors?.defaultConnectorId;
    };

    const getWizardSteps = () => {
        let STEPS: WizardStepInterface[] = [
            {
                icon: IdentityProviderWizardStepIcons.general,
                name: WizardSteps.GENERAL_DETAILS,
                submitCallback: setSubmitGeneralSettings,
                title: "General settings"
            }
        ];

        if (isAuthenticatorSettingsStepAvailable()) {
            STEPS = [
                ...STEPS,
                {
                    icon: IdentityProviderWizardStepIcons.authenticatorSettings,
                    name: WizardSteps.AUTHENTICATOR_SETTINGS,
                    submitCallback: setSubmitAuthenticator,
                    title: "Authenticator Configuration"
                }
            ];
        }

        if (isOutboundProvisioningSettingsStepAvailable()) {
            STEPS = [
                ...STEPS,
                {
                    icon: IdentityProviderWizardStepIcons.outboundProvisioningSettings,
                    name: WizardSteps.OUTBOUND_PROVISIONING_SETTINGS,
                    submitCallback: setSubmitOutboundProvisioningSettings(),
                    title: "Provisioning Configuration"
                }
            ];
        }

        STEPS = [
            ...STEPS,
            {
                icon: IdentityProviderWizardStepIcons.summary,
                name: WizardSteps.SUMMARY,
                submitCallback: setFinishSubmit,
                title: "Summary"
            }
        ];
        return STEPS;
    };

    const initializeWizard = () => {
        // Each of the IdP attributes which require validation or any modification prior initializing, are stored in
        // this object.
        let validatedIdpAttributes = {} as IdentityProviderInterface;

        if (isAuthenticatorSettingsStepAvailable()) {
            validatedIdpAttributes = {
                ...validatedIdpAttributes,
                federatedAuthenticators: getValidatedAuthenticators()
            };
        }

        if (isOutboundProvisioningSettingsStepAvailable()) {
            validatedIdpAttributes = {
                ...validatedIdpAttributes,
                provisioning: {
                    ...validatedIdpAttributes?.provisioning?.jit,
                    outboundConnectors: getValidatedOutboundProvisioningConnectors()
                } as ProvisioningInterface
            };
        }

        setWizardState(_.merge(wizardState, {
            [WizardConstants.IDENTITY_PROVIDER]: {
                ...template,
                ...validatedIdpAttributes
            }
        }));
        setWizardSteps(getWizardSteps());
    };

    /**
     * Called when required backend data are gathered.
     */
    useEffect(() => {
        if (!initWizard) {
            return;
        }

        initializeWizard();

        setInitWizard(false);
    }, [initWizard]);

    const isAuthenticatorSettingsStepReady =
        (authenticatorMetadata: FederatedAuthenticatorMetaInterface): boolean => {
            return isAuthenticatorSettingsStepAvailable() ? authenticatorMetadata !== undefined : true;
        };

    const isOutboundProvisioningSettingsStepReady =
        (connectorMetadata: OutboundProvisioningConnectorMetaInterface): boolean => {
            return isOutboundProvisioningSettingsStepAvailable() ? connectorMetadata !== undefined : true;
        };

    const isWizardReady = () => {
        return isAuthenticatorSettingsStepReady(defaultAuthenticatorMetadata)
            && isOutboundProvisioningSettingsStepReady(defaultOutboundProvisioningConnectorMetadata);
    };

    /**
     * Called to initialize the wizard, once all the data gathered from the backend.
     */
    useEffect(() => {

        if (isWizardReady()) {
            setInitWizard(true);
        }
    }, [defaultAuthenticatorMetadata, defaultOutboundProvisioningConnectorMetadata]);

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
    }, [partiallyCompletedStep]);

    return (
        (
            wizardSteps ? <Modal
                open={ true }
                className="wizard identity-provider-create-wizard"
                dimmer="blurring"
                onClose={ handleWizardClose }
                closeOnDimmerClick
                closeOnEscape
            >
                <Modal.Header className="wizard-header">
                    {title}
                    {subTitle && <Heading as="h6">{subTitle}</Heading>}
                </Modal.Header>
                <Modal.Content className="steps-container">
                    <Steps.Group header="Fill the basic information about your identity provider."
                                 current={ currentWizardStep }>
                        {wizardSteps.map((step, index) => (
                            <Steps.Step
                                key={ index }
                                icon={ step.icon }
                                title={ step.title }
                            />
                        ))}
                    </Steps.Group>
                </Modal.Content>
                <Modal.Content className="content-container" scrolling>{resolveStepContent(currentWizardStep)}
                </Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton floated="left" onClick={ handleWizardClose }>Cancel</LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                {currentWizardStep < wizardSteps.length - 1 && (
                                    <PrimaryButton floated="right" onClick={ navigateToNext }>
                                        Next<Icon name="arrow right"/>
                                    </PrimaryButton>
                                )}
                                {currentWizardStep === wizardSteps.length - 1 && (
                                    <PrimaryButton floated="right" onClick={ navigateToNext }>Finish</PrimaryButton>
                                )}
                                {currentWizardStep > 0 && (
                                    <LinkButton floated="right" onClick={ navigateToPrevious }>
                                        <Icon name="arrow left"/> Previous
                                    </LinkButton>
                                )}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Actions>
            </Modal> : null
        )
    );
};

/**
 * Default props for the identity provider creation wizard.
 */
IdentityProviderCreateWizard.defaultProps = {
    currentStep: 0
};
