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

import { IdentityAppsError } from "@wso2is/core/errors";
import { AlertLevels, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { ContentLoader, Heading, LinkButton, PrimaryButton, useWizardAlert } from "@wso2is/react-components";
import get from "lodash-es/get";
import isEmpty from "lodash-es/isEmpty";
import merge from "lodash-es/merge";
import React, { FunctionComponent, ReactElement, Suspense, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Icon } from "semantic-ui-react";
import { AuthenticatorSettings, GeneralSettings, OutboundProvisioningSettings, WizardSummary } from "./steps";
import { identityProviderConfig } from "../../../../extensions/configs";
import { AppState, ModalWithSidePanel } from "../../../core";
import {
    createIdentityProvider,
    getFederatedAuthenticatorMetadata,
    getOutboundProvisioningConnectorMetadata
} from "../../api";
import { getIdentityProviderWizardStepIcons } from "../../configs";
import { IdentityProviderManagementConstants } from "../../constants";
import {
    AuthenticatorPropertyInterface,
    CommonPluggableComponentPropertyInterface,
    FederatedAuthenticatorMetaInterface,
    GenericIdentityProviderCreateWizardPropsInterface,
    IdentityProviderInterface,
    OutboundProvisioningConnectorInterface,
    OutboundProvisioningConnectorMetaInterface,
    ProvisioningInterface
} from "../../models";
import { IdentityProviderManagementUtils } from "../../utils";
import {
    handleGetFederatedAuthenticatorMetadataAPICallError,
    handleGetOutboundProvisioningConnectorMetadataError
} from "../utils";

/**
 * Proptypes for the identity provider creation wizard component.
 */
interface IdentityProviderCreateWizardPropsInterface extends TestableComponentInterface,
    GenericIdentityProviderCreateWizardPropsInterface { }

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
        onWizardClose,
        onIDPCreate,
        currentStep,
        title,
        subTitle,
        template,
        [ "data-testid" ]: testId
    } = props;

    const [ initWizard, setInitWizard ] = useState<boolean>(false);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>(undefined);
    const [ isSelectionHidden, setIsSelectionHidden ] = useState<boolean>(false);
    const [ wizardState, setWizardState] = useState<WizardStateInterface>(undefined);
    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ defaultAuthenticatorMetadata, setDefaultAuthenticatorMetadata ] =
        useState<FederatedAuthenticatorMetaInterface>(undefined);
    const [ defaultOutboundProvisioningConnectorMetadata, setDefaultOutboundProvisioningConnectorMetadata ] =
        useState<OutboundProvisioningConnectorMetaInterface>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    const availableAuthenticators = useSelector((state: AppState) =>
        state.identityProvider.meta.authenticators);

    // Triggers for each wizard step.
    const [ submitGeneralSettings, setSubmitGeneralSettings ] = useTrigger();
    const [ submitAuthenticator, setSubmitAuthenticator ] = useTrigger();
    const [ submitOutboundProvisioningSettings, setSubmitOutboundProvisioningSettings ] = useTrigger();
    const [ finishSubmit, setFinishSubmit ] = useTrigger();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    /**
     * Creates a new identity provider.
     *
     * @param identityProvider Identity provider object.
     */
    const createNewIdentityProvider = (identityProvider: IdentityProviderInterface): void => {
        // TODO Uncomment below once BE support is available for templateId
        // identityProvider.templateId = template.id
        setIsSubmitting(true);

        createIdentityProvider(identityProvider)
            .then((response) => {
                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider.notifications." +
                        "addIDP.success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider.notifications." +
                        "addIDP.success.message")
                }));

                // The created resource's id is sent as a location header.
                // If that's available, navigate to the edit page.
                if (!isEmpty(response.headers.location)) {
                    const location = response.headers.location;
                    const createdIdpID = location.substring(location.lastIndexOf("/") + 1);

                    onIDPCreate(createdIdpID);

                    return;
                }

                // Since the location header is not present, trigger callback without the id.
                onIDPCreate();
            })
            .catch((error) => {
                const identityAppsError: IdentityAppsError = identityProviderConfig.useNewConnectionsView
                ? IdentityProviderManagementConstants.ERROR_CREATE_LIMIT_REACHED
                : IdentityProviderManagementConstants.ERROR_CREATE_LIMIT_REACHED_IDP;

                if (error.response.status === 403 &&
                    error?.response?.data?.code ===
                    identityAppsError.getErrorCode()) {

                    setAlert({
                        code: identityAppsError.getErrorCode(),
                        description: t(
                            identityAppsError.getErrorDescription()
                        ),
                        level: AlertLevels.ERROR,
                        message: t(
                            identityAppsError.getErrorMessage()
                        ),
                        traceId: identityAppsError.getErrorTraceId()
                    });

                    return;
                }

                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: t("console:develop.features.authenticationProvider.notifications." +
                            "addIDP.error.description",
                            { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.authenticationProvider.notifications." +
                            "addIDP.error.message")
                    });

                    return;
                }

                setAlert({
                    description: t("console:develop.features.authenticationProvider.notifications." +
                        "addIDP.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.authenticationProvider.notifications." +
                        "addIDP.genericError.message")
                });
            })
            .finally(() => {
                setIsSubmitting(false);
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
        !isEnterpriseMode() && setCurrentWizardStep(currentWizardStep + 1);
        if (wizardSteps[currentWizardStep]?.name === WizardSteps.AUTHENTICATOR_SETTINGS ||
            wizardSteps[currentWizardStep]?.name === WizardSteps.OUTBOUND_PROVISIONING_SETTINGS) {
            setWizardState({
                [ WizardConstants.IDENTITY_PROVIDER ]: values
            });
        } else {
            setWizardState(merge(wizardState, { [formType]: values }));
        }
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

        const connector: OutboundProvisioningConnectorInterface =
            identityProvider?.provisioning?.outboundConnectors?.connectors[0];

        const isGoogleConnector: boolean = get(connector,
            IdentityProviderManagementConstants.PROVISIONING_CONNECTOR_DISPLAY_NAME) ===
            IdentityProviderManagementConstants.PROVISIONING_CONNECTOR_GOOGLE;

        // If the outbound connector is Google, remove the displayName from the connector.
        if (connector && isGoogleConnector) {
            delete connector[
                IdentityProviderManagementConstants.PROVISIONING_CONNECTOR_DISPLAY_NAME
            ];
        }

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
        onWizardClose();
    };

    /**
     * Returns if the wizard is in the expert mode.
     *
     * @return {boolean} isEnterpriseMode - True if it's the expert mode.
     */
    const isEnterpriseMode = (): boolean => {
        return template?.id === "enterprise-idp";
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
                        onSubmit={ (values): void => {
                            handleWizardFormSubmit(values,
                                WizardConstants.IDENTITY_PROVIDER);

                            isEnterpriseMode() && handleWizardFormFinish(generateWizardSummary());

                        }
                        }
                        template={ template }
                        data-testid={ `${ testId }-general-settings` }
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
                        data-testid={ `${ testId }-authenticator-settings` }
                    />
                );
            }
            case WizardSteps.OUTBOUND_PROVISIONING_SETTINGS: {
                return (
                    <OutboundProvisioningSettings
                        metadata={ defaultOutboundProvisioningConnectorMetadata }
                        initialValues={ wizardState[WizardConstants.IDENTITY_PROVIDER] }
                        onSubmit={ (values): void => handleWizardFormSubmit(
                            values, WizardConstants.IDENTITY_PROVIDER) }
                        triggerSubmit={ submitOutboundProvisioningSettings }
                        data-testid={ `${ testId }-outbound-provisioning-settings` }
                    />
                );
            }
            case WizardSteps.SUMMARY: {
                return (
                    <WizardSummary
                        provisioningConnectorMetadata={ defaultOutboundProvisioningConnectorMetadata }
                        authenticatorMetadata={ defaultAuthenticatorMetadata }
                        triggerSubmit={ finishSubmit }
                        identityProvider={ generateWizardSummary() }
                        onSubmit={ handleWizardFormFinish }
                        data-testid={ `${ testId }-summary` }
                    />
                );
            }
        }
    };

    /**
     * Loads the identity provider authenticators on initial component load.
     */
    useEffect(() => {
        let isWaiting = false;
        if (isAuthenticatorSettingsStepAvailable() && isEmpty(availableAuthenticators)) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const status = IdentityProviderManagementUtils.getAuthenticators();
            isWaiting = true;
        }

        if (isOutboundProvisioningSettingsStepAvailable()) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const status = getProvisioningConnectorMetadata(template?.idp?.provisioning.outboundConnectors
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
    const setAuthenticatorMetadata = (authenticatorId: string) => {
        getFederatedAuthenticatorMetadata(authenticatorId)
            .then((response) => {
                setDefaultAuthenticatorMetadata(response);
            })
            .catch((error) => {
                handleGetFederatedAuthenticatorMetadataAPICallError(error);
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
                handleGetOutboundProvisioningConnectorMetadataError(error);
            });
    };

    /**
     * Called when `availableAuthenticators` are changed.
     */
    useEffect(() => {
        if (availableAuthenticators?.find(eachAuthenticator => eachAuthenticator.authenticatorId ===
            template?.idp?.federatedAuthenticators?.defaultAuthenticatorId)) {
            setAuthenticatorMetadata(template?.idp?.federatedAuthenticators?.defaultAuthenticatorId);
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
            (eachProp): AuthenticatorPropertyInterface => {
                return {
                    key: eachProp?.key,
                    value: eachProp?.defaultValue
                };
            });

        // For the default authenticator, update values of it's properties with the corresponding value from the
        // template, if any.
        // todo Need to do the same for rest of the configured authenticators in the template.
        const authenticatorsInTemplate = template?.idp?.federatedAuthenticators.authenticators;
        return {
            authenticators: authenticatorsInTemplate.map((authenticator) => {
                return authenticator.authenticatorId === template?.idp?.federatedAuthenticators.defaultAuthenticatorId ?
                    {
                        ...authenticator,
                        properties: getUpdatedElementsByKey(defaultAuthenticatorPropertiesFromMetadata,
                            authenticator.properties, "key")
                        // properties: merge(defaultAuthenticatorPropertiesFromMetadata, authenticator.properties)
                    } : authenticator;
            }),
            defaultAuthenticatorId: template?.idp?.federatedAuthenticators.defaultAuthenticatorId
        };
    };

    /**
     * Validate and get outbound provisioning connectors.
     */
    const getValidatedOutboundProvisioningConnectors = () => {
        const defaultConnectorPropertiesFromMetadata = defaultOutboundProvisioningConnectorMetadata?.properties.map(
            (eachProp): CommonPluggableComponentPropertyInterface => {
                return {
                    key: eachProp?.key,
                    value: eachProp?.defaultValue
                };
            });

        // For the default connector, update values of it's properties with the corresponding value from the
        // template, if any.
        // todo Need to do the same for rest of the configured authenticators in the template.
        const connectorsInTemplate = template?.idp?.provisioning.outboundConnectors.connectors;
        return {
            connectors: connectorsInTemplate.map((templateConnector) => {
                return templateConnector.connectorId === template?.idp?.provisioning.outboundConnectors
                    .defaultConnectorId ?
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
        return template?.idp?.federatedAuthenticators?.defaultAuthenticatorId;
    };

    const isOutboundProvisioningSettingsStepAvailable = () => {
        return template?.idp?.provisioning?.outboundConnectors?.defaultConnectorId;
    };

    const getWizardSteps = () => {
        let STEPS: WizardStepInterface[] = [
            {
                icon: getIdentityProviderWizardStepIcons().general,
                name: WizardSteps.GENERAL_DETAILS,
                submitCallback: setSubmitGeneralSettings,
                title: t("console:develop.features.authenticationProvider.wizards.addIDP.steps.generalSettings.title")
            }
        ];

        if (isAuthenticatorSettingsStepAvailable()) {
            STEPS = [
                ...STEPS,
                {
                    icon: getIdentityProviderWizardStepIcons().authenticatorSettings,
                    name: WizardSteps.AUTHENTICATOR_SETTINGS,
                    submitCallback: setSubmitAuthenticator,
                    title: t("console:develop.features.authenticationProvider.wizards.addIDP.steps." +
                        "authenticatorConfiguration.title")
                }
            ];
        }

        if (isOutboundProvisioningSettingsStepAvailable()) {
            STEPS = [
                ...STEPS,
                {
                    icon: getIdentityProviderWizardStepIcons().outboundProvisioningSettings,
                    name: WizardSteps.OUTBOUND_PROVISIONING_SETTINGS,
                    submitCallback: setSubmitOutboundProvisioningSettings(),
                    title: t("console:develop.features.authenticationProvider.wizards.addIDP.steps." +
                        "provisioningConfiguration.title")
                }
            ];
        }

        //Prevent summary step from showing in the expert mode
        if (!isEnterpriseMode()) {
            STEPS = [
                ...STEPS,
                {
                    icon: getIdentityProviderWizardStepIcons().summary,
                    name: WizardSteps.SUMMARY,
                    submitCallback: setFinishSubmit,
                    title: t("console:develop.features.authenticationProvider.wizards.addIDP.steps.summary.title")
                }
            ];
        }

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

        setWizardState(merge(wizardState, {
            [WizardConstants.IDENTITY_PROVIDER]: {
                ...template?.idp,
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

    const renderModalActions = (): ReactElement => {
        return (
            <Grid>
                <Grid.Row column={ 1 }>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                        <LinkButton floated="left" onClick={ handleWizardClose }
                            data-testid={ `${ testId }-modal-cancel-button` }>
                            { t("common:cancel") }
                        </LinkButton>
                    </Grid.Column>
                    <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                        { currentWizardStep < wizardSteps.length - 1 && (
                            <PrimaryButton floated="right" onClick={ navigateToNext }
                                data-testid={ `${ testId }-modal-next-button` }>
                                { t("console:develop.features.authenticationProvider.wizards.buttons.next") }
                                <Icon name="arrow right" />
                            </PrimaryButton>
                        ) }
                        { currentWizardStep === wizardSteps.length - 1 && (
                            <PrimaryButton
                                floated="right"
                                onClick={ navigateToNext }
                                loading={ isSubmitting }
                                disabled={ isSubmitting }
                                data-testid={ `${ testId }-modal-finish-button` }>
                                { t("console:develop.features.authenticationProvider.wizards.buttons.finish") }
                            </PrimaryButton>
                        ) }
                        { currentWizardStep > 0 && (
                            <LinkButton floated="right" onClick={ navigateToPrevious }
                                data-testid={ `${ testId }-modal-previous-button` }>
                                <Icon name="arrow left" />
                                { t("console:develop.features.authenticationProvider.wizards.buttons.previous") }
                            </LinkButton>
                        ) }
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    };

    /**
     * Renders the help panel containing wizard help.
     *
     * @return {React.ReactElement}
     */
    const renderHelpPanel = (): ReactElement => {

        // Return null when `showHelpPanel` is false or `wizardHelp` is not defined in `selectedTemplate` object.
        if (!template?.content?.wizardHelp) {
            return null;
        }

        const {
            wizardHelp: WizardHelp
        } = template?.content;

        return (
            <ModalWithSidePanel.SidePanel>
                <ModalWithSidePanel.Header className="wizard-header help-panel-header muted">
                    <div className="help-panel-header-text">
                        { t("console:develop.features.applications.wizards.minimalAppCreationWizard.help.heading") }
                    </div>
                </ModalWithSidePanel.Header>
                <ModalWithSidePanel.Content>
                    <Suspense fallback={ <ContentLoader /> }>
                        <WizardHelp />
                    </Suspense>
                </ModalWithSidePanel.Content>
            </ModalWithSidePanel.SidePanel>
        );
    };

    return (
        (
            wizardSteps ?
                <ModalWithSidePanel
                    open={ true }
                    className="wizard identity-provider-create-wizard"
                    dimmer="blurring"
                    onClose={ handleWizardClose }
                    closeOnDimmerClick={ false }
                    closeOnEscape
                    data-testid={ `${ testId }-modal` }
                >
                    <ModalWithSidePanel.MainPanel>
                        <ModalWithSidePanel.Header className="wizard-header" data-testid={ `${ testId }-modal-header` }>
                            { title }
                            { subTitle && <Heading as="h6">{ subTitle }</Heading> }
                        </ModalWithSidePanel.Header>
                        <ModalWithSidePanel.Content
                            className="content-container"
                            data-testid={ `${ testId }-modal-content-2` }
                        >
                            { alert && alertComponent }
                            { resolveStepContent(currentWizardStep) }
                        </ModalWithSidePanel.Content>
                        <ModalWithSidePanel.Actions data-testid={ `${ testId }-modal-actions` }>
                            { renderModalActions() }
                        </ModalWithSidePanel.Actions>
                    </ModalWithSidePanel.MainPanel>
                    { renderHelpPanel() }
                </ModalWithSidePanel> : null
        )
    );
};

/**
 * Default props for the identity provider creation wizard.
 */
IdentityProviderCreateWizard.defaultProps = {
    currentStep: 0,
    "data-testid": "idp-edit-idp-create-wizard"
};
