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

import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Grid, Icon, Modal } from "semantic-ui-react";

import _ from "lodash";

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { Heading, LinkButton, PrimaryButton, Steps } from "@wso2is/react-components";

import { createIdentityProvider, getFederatedAuthenticatorMetadata } from "../../../api";
import { history } from "../../../helpers";
import { AuthenticatorProperty, FederatedAuthenticatorMetaInterface, IdentityProviderInterface } from "../../../models";
import { AppState, store } from "../../../store";
import { IdentityProviderConstants } from "../../../constants";
import { IdentityProviderWizardStepIcons } from "../../../configs";
import { IdentityProviderManagementUtils } from "../../../utils/identity-provider-management-utils";

import { AuthenticatorSettings, GeneralSettings, WizardSummary } from "./steps";

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

    const [wizardSteps, setWizardSteps] = useState<WizardStepInterface[]>(undefined);
    const [isSelectionHidden, setIsSelectionHidden] = useState<boolean>(false);
    const [wizardState, setWizardState] = useState<WizardStateInterface>(undefined);
    const [partiallyCompletedStep, setPartiallyCompletedStep] = useState<number>(undefined);
    const [currentWizardStep, setCurrentWizardStep] = useState<number>(currentStep);
    const [authenticatorMetadata, setAuthenticatorMetadata] = useState<FederatedAuthenticatorMetaInterface>(
        undefined);

    const dispatch = useDispatch();

    const availableAuthenticators = useSelector((state: AppState) =>
        state.identityProvider.meta.authenticators);

    const [submitGeneralSettings, setSubmitGeneralSettings] = useTrigger();
    const [submitAuthenticator, setSubmitAuthenticator] = useTrigger();
    const [finishSubmit, setFinishSubmit] = useTrigger();

    /**
     * Creates a new identity provider.
     *
     * @param {IdentityProviderInterface} identity provider - The identity provider to be created.
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

        switch (step) {
            case 0:
                setSubmitGeneralSettings();
                break;
            case 1:
                setSubmitAuthenticator();
                break;
            case 2:
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
        closeWizard();
    };

    /**
     * Resolves the step content.
     *
     * @return {React.ReactElement} Step content.
     */
    const resolveStepContent = (): ReactElement => {
        let step = currentWizardStep;

        if (isSelectionHidden) {
            step = currentWizardStep + 1;
        }

        switch (step) {
            case 0: {
                return (
                    <GeneralSettings
                        triggerSubmit={ submitGeneralSettings }
                        initialValues={ wizardState && wizardState[WizardConstants.IDENTITY_PROVIDER] }
                        onSubmit={ (values): void => handleWizardFormSubmit(values,
                            WizardConstants.IDENTITY_PROVIDER) }
                    />
                );
            }
            case 1: {
                return (
                    <AuthenticatorSettings
                        metadata={ authenticatorMetadata }
                        initialValues={ wizardState[WizardConstants.IDENTITY_PROVIDER] }
                        onSubmit={ (values): void => handleWizardFormSubmit(
                            values, WizardConstants.IDENTITY_PROVIDER) }
                        triggerSubmit={ submitAuthenticator }
                    />
                )
            }
            case 2: {
                return (
                    <WizardSummary
                        authenticatorMetadata={ authenticatorMetadata }
                        triggerSubmit={ finishSubmit }
                        identityProvider={ generateWizardSummary() }
                        onSubmit={ handleWizardFormFinish }
                    />
                )
            }
        }
    };

    const STEPS: WizardStepInterface[] = [
        {
            icon: IdentityProviderWizardStepIcons.general,
            title: "General settings"
        },
        {
            icon: IdentityProviderWizardStepIcons.authenticator,
            title: "Authenticator"
        },
        {
            icon: IdentityProviderWizardStepIcons.summary,
            title: "Summary"
        }
    ];

    /**
     * Loads the identity provider authenticators on initial component load.
     */
    useEffect(() => {
        if (!_.isEmpty(availableAuthenticators)) {
            return;
        }
        IdentityProviderManagementUtils.getAuthenticators();
    }, []);

    /**
     * Gets the authenticator meta data.
     *
     * @param authenticatorId
     */
    const getAuthenticatorMetadata = (authenticatorId: string): Promise<void> => {
        return getFederatedAuthenticatorMetadata(authenticatorId)
            .then((response) => {
                setAuthenticatorMetadata(response);
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
     * Called when `availableAuthenticators` are changed.
     */
    useEffect(() => {
        // todo Handle multiple authenticators in the template.
        const availableAuthenticator = _.find(availableAuthenticators, {
            authenticatorId: template
                .federatedAuthenticators?.authenticators[0]?.authenticatorId
        });
        if (availableAuthenticator) {
            getAuthenticatorMetadata(availableAuthenticator.authenticatorId);
        }
    }, [availableAuthenticators]);

    const getAuthenticatorProperties = () => {
        return authenticatorMetadata?.properties.map(
            (eachProp): AuthenticatorProperty => {
                return {
                    key: eachProp?.key,
                    value: eachProp?.defaultValue
                }
            });
    };

    /**
     * Called when `authenticatorMetadata` is changed.
     */
    useEffect(() => {
        if (authenticatorMetadata) {
            const identityProvider: IdentityProviderInterface = {
                federatedAuthenticators: {
                    authenticators: [{
                        authenticatorId: authenticatorMetadata?.authenticatorId,
                        name: authenticatorMetadata?.name,
                        properties: getAuthenticatorProperties()
                    }],
                    defaultAuthenticatorId: authenticatorMetadata?.authenticatorId
                }
            };

            setWizardState(_.merge(wizardState, {
                [WizardConstants.IDENTITY_PROVIDER]: identityProvider
            }));

            setWizardSteps(STEPS);
        }
    }, [authenticatorMetadata]);

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
                <Modal.Content className="content-container" scrolling>{resolveStepContent()}</Modal.Content>
                <Modal.Actions>
                    <Grid>
                        <Grid.Row column={ 1 }>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                <LinkButton floated="left" onClick={ handleWizardClose }>Cancel</LinkButton>
                            </Grid.Column>
                            <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                                {currentWizardStep < wizardSteps.length - 1 && (
                                    <PrimaryButton floated="right" onClick={ navigateToNext }>
                                        Next Step <Icon name="arrow right"/>
                                    </PrimaryButton>
                                )}
                                {currentWizardStep === wizardSteps.length - 1 && (
                                    <PrimaryButton floated="right" onClick={ navigateToNext }>Finish</PrimaryButton>
                                )}
                                {currentWizardStep > 0 && (
                                    <LinkButton floated="right" onClick={ navigateToPrevious }>
                                        <Icon name="arrow left"/> Previous step
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
