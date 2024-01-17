/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { getEmptyPlaceholderIllustrations } from "@wso2is/common/src/configs/ui";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels, IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import {
    Code,
    EmptyPlaceholder,
    Heading,
    LinkButton,
    PrimaryButton,
    Steps,
    useWizardAlert
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import merge from "lodash-es/merge";
import React, { FunctionComponent, MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { Grid, Icon, Modal } from "semantic-ui-react";
import { AuthenticatorTemplateSelection } from "./steps/authenticator-template-selection";
import { AuthenticatorSettings } from "../../../identity-providers/components/wizards/steps";
import {
    getFederatedAuthenticatorMetadata,
    updateFederatedAuthenticator
} from "../../api/connections";
import { getConnectionWizardStepIcons } from "../../configs/ui";
import {
    FederatedAuthenticatorMetaDataInterface
} from "../../models/authenticators";
import {
    CommonPluggableComponentPropertyInterface,
    ConnectionInterface,
    ConnectionTemplateInterface,
    FederatedAuthenticatorListItemInterface,
    FederatedAuthenticatorMetaInterface
} from "../../models/connection";
import { handleGetFederatedAuthenticatorMetadataAPICallError } from "../../utils/connection-utils";

/**
 * Proptypes for the identity provider creation wizard component.
 */
interface AddAuthenticatorWizardPropsInterface extends TestableComponentInterface, IdentifiableComponentInterface {
    currentStep?: number;
    title: string;
    closeWizard: () => void;
    subTitle?: string;
    manualModeOptions: FederatedAuthenticatorMetaDataInterface[];
    availableTemplates?: ConnectionTemplateInterface[];
    idpId?: string;
    isDefaultAuthenticatorAvailable?: boolean;
}

/**
 * Enum for wizard.
 *
 * @readonly
 */
enum WizardConstants {
    AUTHENTICATOR = "authenticator"
}

/**
 * Constants for wizard steps.
 */
enum WizardSteps {
    TEMPLATE_SELECTION = "TemplateSelection",
    AUTHENTICATOR_SETTINGS = "AuthenticatorSettings"
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
 * @param props - Props injected to the component.
 * @returns ReactElement
 */
export const AuthenticatorCreateWizard: FunctionComponent<AddAuthenticatorWizardPropsInterface> = (
    props: AddAuthenticatorWizardPropsInterface
): ReactElement => {

    const {
        closeWizard,
        currentStep,
        title,
        subTitle,
        manualModeOptions,
        availableTemplates,
        idpId,
        isDefaultAuthenticatorAvailable,
        [ "data-testid" ]: testId,
        [ "data-componentid" ]: componentId
    } = props;

    const [ initWizard, setInitWizard ] = useState<boolean>(true);
    const [ wizardSteps, setWizardSteps ] = useState<WizardStepInterface[]>(undefined);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [ isSelectionHidden, setIsSelectionHidden ] = useState<boolean>(false);
    const [ wizardState, setWizardState ] = useState<WizardStateInterface>(undefined);
    const [ partiallyCompletedStep, setPartiallyCompletedStep ] = useState<number>(undefined);
    const [ currentWizardStep, setCurrentWizardStep ] = useState<number>(currentStep);
    const [ selectedAuthenticatorMetadata, setSelectedAuthenticatorMetadata ] =
        useState<FederatedAuthenticatorMetaInterface>(undefined);
    const [ selectedTemplateId, setSelectedTemplateId ] = useState<string>(undefined);
    const [ selectedManualModeOptionId, setSelectedManualModeOptionId ] = useState<string>(undefined);
    const [ isSubmitting, setIsSubmitting ] = useState<boolean>(false);
    const [ isTemplateSelected, setIsTemplateSelected ] = useState<boolean>(false);

    const dispatch: Dispatch = useDispatch();
    const { t } = useTranslation();

    // Triggers for each wizard step.
    const [ submitTemplateSelection, setSubmitTemplateSelection ] = useTrigger();
    const [ submitAuthenticator, setSubmitAuthenticator ] = useTrigger();

    const [ alert, setAlert, alertComponent ] = useWizardAlert();

    const formTopRef: MutableRefObject<HTMLDivElement> = useRef<HTMLDivElement>();

    /**
     * Scrolls to the top of the form.
     */
    const scrollToTop = (): void => {
        const options: ScrollIntoViewOptions = {
            behavior: "smooth",
            block: "center"
        };

        formTopRef.current.scrollIntoView(options);
    };

    /**
     * Navigates to the next wizard step.
     */
    const navigateToNext = (): void => {
        let step: number = currentWizardStep;

        if (isSelectionHidden) {
            step = currentWizardStep + 1;
        }

        switch (wizardSteps[step]?.name) {
            case WizardSteps.TEMPLATE_SELECTION:
                setSubmitTemplateSelection();

                break;
            case WizardSteps.AUTHENTICATOR_SETTINGS:
                setSubmitAuthenticator();

                break;
            default:
                break;
        }
    };

    /**
     * Navigates to the previous wizard step.
     */
    const navigateToPrevious = (): void => {
        if (wizardSteps[currentWizardStep]?.name === WizardSteps.AUTHENTICATOR_SETTINGS) {
            setSelectedAuthenticatorMetadata(undefined);
            setSelectedTemplateId(undefined);
            setSelectedManualModeOptionId(undefined);
        }
        setPartiallyCompletedStep(currentWizardStep);
    };

    /**
     * Handles wizard step submit.
     *
     * @param values - Forms values to be stored in state.
     */
    const handleWizardFormSubmit = (values: any, isFinal: boolean): void => {
        if (values.templateId) {
            setSelectedTemplateId(values.templateId);
        } else if (values.manualModeOptionId) {
            setSelectedManualModeOptionId(values.manualModeOptionId);
        } else {
            setWizardState({
                [ WizardConstants.AUTHENTICATOR ]: values
            });
        }

        if (isFinal) {
            handleWizardFormFinish(values);

            return;
        }

        setCurrentWizardStep(currentWizardStep + 1);
    };

    /**
     * Handles the final wizard submission.
     *
     * @param identityProvider - Identity provider data.
     */
    const handleWizardFormFinish = (identityProvider: ConnectionInterface): void => {
        const authenticator: FederatedAuthenticatorListItemInterface =
            identityProvider?.federatedAuthenticators?.authenticators.find(
                (a: FederatedAuthenticatorListItemInterface) =>
                    a.authenticatorId === identityProvider?.federatedAuthenticators?.defaultAuthenticatorId
            );

        authenticator.properties = authenticator?.properties.filter(
            (property: CommonPluggableComponentPropertyInterface) => {
                if (isEmpty(property.key)) {
                    return false;
                }

                return true;
            }
        );
        authenticator.properties.filter(Boolean);

        /**
         * If the default authenticator is not available then the currently adding
         * new authenticator is set as the default authenticator.
         */
        authenticator.isDefault = !isDefaultAuthenticatorAvailable;

        addNewAuthenticator(authenticator);
    };

    const addNewAuthenticator = (authenticator: FederatedAuthenticatorListItemInterface) => {
        setIsSubmitting(true);
        updateFederatedAuthenticator(idpId, authenticator)
            .then(() => {
                dispatch(addAlert({
                    description: t("console:develop.features.authenticationProvider" +
                        ".notifications.addFederatedAuthenticator." +
                        "success.description"),
                    level: AlertLevels.SUCCESS,
                    message: t("console:develop.features.authenticationProvider" +
                        ".notifications.addFederatedAuthenticator.success.message")
                }));
                closeWizard();
            })
            .catch((error: IdentityAppsApiException) => {
                if (error.response && error.response.data && error.response.data.description) {
                    setAlert({
                        description: t("console:develop.features.authenticationProvider." +
                            "notifications.addFederatedAuthenticator." +
                            "error.description", { description: error.response.data.description }),
                        level: AlertLevels.ERROR,
                        message: t("console:develop.features.authenticationProvider.notifications." +
                            "addFederatedAuthenticator.error.message")
                    });
                    scrollToTop();

                    return;
                }
                setAlert({
                    description: t("console:develop.features.authenticationProvider." +
                        "notifications.addFederatedAuthenticator." +
                        "genericError.description"),
                    level: AlertLevels.ERROR,
                    message: t("console:develop.features.authenticationProvider." +
                        "notifications.addFederatedAuthenticator." +
                        "genericError.message")
                });
                scrollToTop();
            })
            .finally(() => {
                setIsSubmitting(false);
            });
    };

    /**
     * Called when modal close event is triggered.
     */
    const handleWizardClose = (): void => {

        // Clear data.
        setSelectedAuthenticatorMetadata(undefined);

        // Trigger the close method from props.
        closeWizard();
    };

    /**
     * Resolves the step content.
     *
     * @returns Step content.
     */
    const resolveStepContent = (currentStep: number): ReactElement => {
        let step: number = currentStep;

        if (isSelectionHidden) {
            step = currentStep + 1;
        }

        switch (wizardSteps[step]?.name) {
            case WizardSteps.TEMPLATE_SELECTION: {
                return (
                    <AuthenticatorTemplateSelection
                        triggerSubmit={ submitTemplateSelection }
                        onSubmit={ (values: ConnectionInterface): void => handleWizardFormSubmit(values, false) }
                        manualModeOptions={ manualModeOptions }
                        authenticatorTemplates={ availableTemplates }
                        onTemplateSelect={ (): void => setIsTemplateSelected(true) }
                        data-testid={ `${ testId }-template-selection` }
                    />
                );
            }
            case WizardSteps.AUTHENTICATOR_SETTINGS: {
                return (
                    <>
                        {
                            selectedAuthenticatorMetadata && isEmpty(selectedAuthenticatorMetadata?.properties) && (
                                <EmptyPlaceholder
                                    data-componentid={ `${ componentId }-empty-placeholder` }
                                    image={ getEmptyPlaceholderIllustrations().newList }
                                    imageSize="tiny"
                                    title={
                                        t("console:develop.features.authenticationProvider.wizards.addAuthenticator." +
                                            "steps.authenticatorSettings.emptyPlaceholder.title")
                                    }
                                    subtitle={ [
                                        t("console:develop.features.authenticationProvider.wizards.addAuthenticator." +
                                            "steps.authenticatorSettings.emptyPlaceholder.subtitles.0"),
                                        <Trans
                                            key="0"
                                            i18nKey={
                                                "console:develop.features.authenticationProvider.wizards." +
                                                "addAuthenticator.steps.authenticatorSettings.emptyPlaceholder." +
                                                "subtitles.1"
                                            }
                                        >
                                            configured at this level. Simply click on <Code>Finish</Code>.
                                        </Trans>
                                    ] }
                                />
                            )
                        }
                        <AuthenticatorSettings
                            metadata={ selectedAuthenticatorMetadata }
                            initialValues={ wizardState[WizardConstants.AUTHENTICATOR] }
                            onSubmit={ (values: ConnectionInterface): void => handleWizardFormSubmit(values, true) }
                            triggerSubmit={ submitAuthenticator }
                            data-testid={ `${ testId }-authenticator-settings` }
                        />
                    </>
                );
            }
        }
    };

    const loadAuthenticatorMetadata = (authenticatorId: string) => {
        getFederatedAuthenticatorMetadata(authenticatorId)
            .then((response: FederatedAuthenticatorMetaInterface) => {
                setSelectedAuthenticatorMetadata(response);
            })
            .catch((error: IdentityAppsApiException) => {
                handleGetFederatedAuthenticatorMetadataAPICallError(error);
            });
    };

    useEffect(() => {
        if (selectedTemplateId) {
            const selectedTemplate: ConnectionTemplateInterface = availableTemplates.find(
                (template: ConnectionTemplateInterface) => {
                    return template.id === selectedTemplateId;
                }
            );

            loadAuthenticatorMetadata(selectedTemplate.idp.federatedAuthenticators.defaultAuthenticatorId);
            setWizardState({
                ...wizardState,
                [WizardConstants.AUTHENTICATOR]: selectedTemplate.idp
            });
        }
    }, [ selectedTemplateId ]);

    useEffect(() => {
        if (selectedManualModeOptionId) {
            loadAuthenticatorMetadata(selectedManualModeOptionId);
            setWizardState({
                ...wizardState,
                [WizardConstants.AUTHENTICATOR]: {}
            });
        }
    }, [ selectedManualModeOptionId ]);

    /**
     * Called when required backend data are gathered.
     */
    useEffect(() => {
        if (!initWizard) {
            return;
        }

        setWizardState(merge(wizardState, {
            [WizardConstants.AUTHENTICATOR]: {}
        }));
        setWizardSteps([
            {
                icon: getConnectionWizardStepIcons().general,
                name: WizardSteps.TEMPLATE_SELECTION,
                submitCallback: setSubmitTemplateSelection,
                title: t("console:develop.features.authenticationProvider.wizards.addAuthenticator." +
                    "steps.authenticatorSelection.title")
            },
            {
                icon: getConnectionWizardStepIcons().authenticatorSettings,
                name: WizardSteps.AUTHENTICATOR_SETTINGS,
                submitCallback: setSubmitAuthenticator,
                title: t("console:develop.features.authenticationProvider.wizards.addAuthenticator." +
                    "steps.authenticatorConfiguration.title")
            }
        ].filter(Boolean));

        setInitWizard(false);
    }, [ idpId ]);

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

    if (!wizardSteps) {
        return null;
    }

    return (
        <Modal
            open={ true }
            className="wizard identity-provider-create-wizard"
            dimmer="blurring"
            onClose={ handleWizardClose }
            closeOnDimmerClick={ false }
            closeOnEscape
            data-testid={ `${ testId }-modal` }
        >
            <Modal.Header className="wizard-header" data-testid={ `${ testId }-modal-header` }>
                { title }
                { subTitle &&
                    <Heading as="h6">{ subTitle }</Heading>
                }
            </Modal.Header>
            <Modal.Content className="steps-container" data-testid={ `${ testId }-modal-content-1` }>
                <Steps.Group
                    header={ t("console:develop.features.authenticationProvider." +
                    "wizards.addAuthenticator.header") }
                    current={ currentWizardStep }>
                    { wizardSteps.map((step: WizardStepInterface, index: number) => (
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
                <div ref={ formTopRef } />
                { resolveStepContent(currentWizardStep) as any }
            </Modal.Content>
            <Modal.Actions data-testid={ `${ testId }-modal-actions` }>
                <Grid>
                    <Grid.Row column={ 1 }>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            <LinkButton
                                floated="left"
                                onClick={ handleWizardClose }
                                data-testid="add-connection-modal-cancel-button"
                            >
                                { t("common:cancel") }
                            </LinkButton>
                        </Grid.Column>
                        <Grid.Column mobile={ 8 } tablet={ 8 } computer={ 8 }>
                            { currentWizardStep < wizardSteps.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ navigateToNext }
                                    disabled={ !isTemplateSelected }
                                    data-testid="add-connection-modal-next-button"
                                >
                                    { t("console:develop.features.authenticationProvider.wizards.buttons.next") }
                                    <Icon name="arrow right"/>
                                </PrimaryButton>
                            ) }
                            { currentWizardStep === wizardSteps.length - 1 && (
                                <PrimaryButton
                                    floated="right"
                                    onClick={ navigateToNext }
                                    data-testid="add-connection-modal-finish-button"
                                    loading={ isSubmitting }
                                    disabled={ isSubmitting }
                                >
                                    { t("console:develop.features.authenticationProvider.wizards.buttons.finish") }
                                </PrimaryButton>
                            ) }
                            { currentWizardStep > 0 && (
                                <LinkButton
                                    floated="right"
                                    onClick={ navigateToPrevious }
                                    data-testid={ `${ testId }-modal-previous-button` }>
                                    <Icon name="arrow left"/>
                                    { t("console:develop.features.authenticationProvider" +
                                        ".wizards.buttons.previous") }
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
 * Default props for the identity provider creation wizard.
 */
AuthenticatorCreateWizard.defaultProps = {
    currentStep: 0,
    "data-testid": "idp-edit-authenticator-create-wizard"
};
