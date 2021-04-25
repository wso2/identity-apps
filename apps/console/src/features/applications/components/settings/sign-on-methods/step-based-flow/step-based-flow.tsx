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
import {
    ConfirmationModal,
    Hint,
    LinkButton
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Fragment,
    FunctionComponent,
    ReactElement,
    SyntheticEvent,
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
    Divider,
    DropdownProps,
    Form,
    Grid,
    Icon } from "semantic-ui-react";
import { AddAuthenticatorModal } from "./add-authenticator-modal";
import { AuthenticationStep } from "./authentication-step";
import { AppState, ConfigReducerStateInterface } from "../../../../../core";
import {
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface
} from "../../../../../identity-providers";
import { ApplicationManagementConstants } from "../../../../constants";
import {
    AuthenticationSequenceInterface,
    AuthenticationSequenceType,
    AuthenticationStepInterface,
    AuthenticatorInterface
} from "../../../../models";

/**
 * Proptypes for the applications settings component.
 */
interface AuthenticationFlowPropsInterface extends TestableComponentInterface {
    /**
     * All authenticators in the system.
     */
    authenticators: GenericAuthenticatorInterface[][];
    /**
     * Currently configured authentication sequence for the application.
     */
    authenticationSequence: AuthenticationSequenceInterface;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     * @param {AuthenticationSequenceInterface} sequence - Authentication sequence.
     */
    onUpdate: (sequence: AuthenticationSequenceInterface) => void;
    /**
     * Trigger for update.
     */
    triggerUpdate: boolean;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Update authentication steps.
     */
    updateSteps: (add: boolean) => void;
}

/**
 * Configure the authentication flow of an application.
 *
 * @param {AuthenticationFlowPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const StepBasedFlow: FunctionComponent<AuthenticationFlowPropsInterface> = (
    props: AuthenticationFlowPropsInterface
): ReactElement => {

    const {
        authenticators,
        authenticationSequence,
        onUpdate,
        readOnly,
        triggerUpdate,
        updateSteps,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const [ federatedAuthenticators, setFederatedAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ localAuthenticators, setLocalAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ secondFactorAuthenticators, setSecondFactorAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ authenticationSteps, setAuthenticationSteps ] = useState<AuthenticationStepInterface[]>([]);
    const [ subjectStepId, setSubjectStepId ] = useState<number>(1);
    const [ attributeStepId, setAttributeStepId ] = useState<number>(1);
    const [ showAuthenticatorsSidePanel, setAuthenticatorsSidePanelVisibility ] = useState<boolean>(true);
    const [ showHandlerDisclaimerModal, setShowHandlerDisclaimerModal ] = useState<boolean>(false);
    const [ showAuthenticatorAddModal, setShowAuthenticatorAddModal ] = useState<boolean>(false);

    /**
     * Separates out the different authenticators to their relevant categories.
     */
    useEffect(() => {

        if (!authenticators || !Array.isArray(authenticators) || !authenticators[ 0 ] || !authenticators[ 1 ]) {
            return;
        }

        const localAuthenticators: GenericAuthenticatorInterface[] = authenticators[ 0 ];
        const federatedAuthenticators: GenericAuthenticatorInterface[] = authenticators[ 1 ];

        const moderatedLocalAuthenticators: GenericAuthenticatorInterface[] = [];
        const secondFactorAuth: GenericAuthenticatorInterface[] = [];

        localAuthenticators.forEach((authenticator) => {
            if (ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS.includes(authenticator.name)) {
                const newAuthenticator: GenericAuthenticatorInterface = {
                    ...authenticator,
                    isEnabled: hasSpecificFactorsInSteps(
                        ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS, [ ...authenticationSteps ])
                };
                secondFactorAuth.push(newAuthenticator);
            } else {
                moderatedLocalAuthenticators.push(authenticator);
            }
        });

        setSecondFactorAuthenticators(secondFactorAuth);
        setLocalAuthenticators(moderatedLocalAuthenticators);
        setFederatedAuthenticators(federatedAuthenticators);
    }, [ authenticators ]);

    /**
     * If the `authenticationSequence` prop is available, sets the authentication steps,
     * subject step id, and attribute step id.
     */
    useEffect(() => {
        if (!authenticationSequence) {
            return;
        }

        setAuthenticationSteps(authenticationSequence?.steps);
        setSubjectStepId(authenticationSequence?.subjectStepId);
        setAttributeStepId(authenticationSequence?.attributeStepId);
    }, [ authenticationSequence ]);

    /**
     * Called when update is triggered.
     */
    useEffect(() => {
        if (!triggerUpdate) {
            return;
        }

        const isValid: boolean = validateSteps();

        if (!isValid) {
            return;
        }

        onUpdate({
            attributeStepId,
            requestPathAuthenticators: [],
            steps: authenticationSteps,
            subjectStepId,
            type: AuthenticationSequenceType.USER_DEFINED
        });
    }, [ triggerUpdate ]);

    useEffect(() => {

        let shouldEnable = hasSpecificFactorsInSteps(
            ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS, [ ...authenticationSteps ]);

        if (authenticationSteps.length === 1) {
            shouldEnable = false;
        }

        setSecondFactorAuthenticators(
            [ ...secondFactorAuthenticators ].map((authenticator) => {
                authenticator.isEnabled = shouldEnable;
                return authenticator;
            })
        );
    }, [ authenticationSteps ]);

    /**
     * Validates if the addition to the step is valid.
     *
     * @param {GenericAuthenticatorInterface} authenticator - Authenticator to be added.
     * @param {AuthenticatorInterface[]} options - Current step options
     *
     * @return {boolean} True or false.
     */
    const validateStepAddition = (
        authenticator: GenericAuthenticatorInterface,
        options: AuthenticatorInterface[]
    ): boolean => {

        if (options.find((option) => option.authenticator === authenticator?.defaultAuthenticator?.name)) {
            dispatch(
                addAlert({
                    description: t(
                        "console:develop.features.applications.notifications.duplicateAuthenticationStep" +
                        ".genericError.description"
                    ),
                    level: AlertLevels.WARNING,
                    message: t(
                        "console:develop.features.applications.notifications.duplicateAuthenticationStep" +
                        ".genericError.message"
                    )
                })
            );

            return false;
        }

        return true;
    };

    /**
     * Updates the authentication step based on the newly added authenticators.
     *
     * @param {number} stepIndex - Step index.
     * @param {string} authenticatorId - Id of the authenticator.
     */
    const updateAuthenticationStep = (stepIndex: number, authenticatorId: string): void => {
        const authenticators: GenericAuthenticatorInterface[] = [
            ...localAuthenticators,
            ...federatedAuthenticators,
            ...secondFactorAuthenticators
        ];

        const authenticator: GenericAuthenticatorInterface = authenticators.find((item) => item.id === authenticatorId);

        if (!authenticator) {
            return;
        }

        const steps: AuthenticationStepInterface[] = [ ...authenticationSteps ];

        // Check a new step is required. If so, create one.
        if (stepIndex === steps.length) {
            steps.push({
                id: steps.length + 1,
                options: []
            });
            updateSteps(true);
        }

        const isValid: boolean = validateStepAddition(authenticator, steps[ stepIndex ].options);

        if (ApplicationManagementConstants.HANDLER_AUTHENTICATORS.includes(authenticatorId)) {
            setShowHandlerDisclaimerModal(true);
        }

        // If the adding option is a second factor, and if the adding step is the first or there are no
        // first factor authenticators in previous steps, show a warning and stop adding the option.
        if (ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS.includes(authenticatorId)
            && (stepIndex === 0
                || !hasSpecificFactorsInSteps(ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
                    steps.slice(0, stepIndex)))) {

            dispatch(
                addAlert({
                    description: t(
                        "console:develop.features.applications.notifications.secondFactorAuthenticatorToFirstStep" +
                        ".genericError.description"
                    ),
                    level: AlertLevels.WARNING,
                    message: t(
                        "console:develop.features.applications.notifications.secondFactorAuthenticatorToFirstStep" +
                        ".genericError.message"
                    )
                })
            );

            return;
        }

        if (!isValid) {
            return;
        }

        const defaultAuthenticator = authenticator.authenticators.find(
            (item) => item.authenticatorId === authenticator.defaultAuthenticator.authenticatorId
        );

        steps[ stepIndex ].options.push({ authenticator: defaultAuthenticator.name, idp: authenticator.idp });

        setAuthenticationSteps(steps);
    };

    /**
     * Handles step option delete action.
     *
     * @param {number} stepIndex - Index of the step.
     * @param {number} optionIndex - Index of the option.
     */
    const handleStepOptionDelete = (stepIndex: number, optionIndex: number): void => {
        const steps = [ ...authenticationSteps ];
        steps[ stepIndex ].options.splice(optionIndex, 1);
        setAuthenticationSteps(steps);
    };

    /**
     * Handles step option authenticator change.
     *
     * @param {number} stepIndex - Index of the step.
     * @param {number} optionIndex - Index of the option.
     * @param {FederatedAuthenticatorInterface} authenticator - Selected authenticator.
     */
    const handleStepOptionAuthenticatorChange = (
        stepIndex: number,
        optionIndex: number,
        authenticator: FederatedAuthenticatorInterface
    ): void => {
        const steps: AuthenticationStepInterface[] = [ ...authenticationSteps ];

        steps[ stepIndex ].options[ optionIndex ].authenticator = authenticator.name;
        setAuthenticationSteps(steps);
    };

    /**
     * Handles step delete action.
     *
     * @param {number} stepIndex - Authentication step.
     */
    const handleStepDelete = (stepIndex: number): void => {

        const steps: AuthenticationStepInterface[] = [ ...authenticationSteps ];

        if (steps.length <= 1) {
            dispatch(
                addAlert({
                    description: t(
                        "console:develop.features.applications.notifications.authenticationStepMin" +
                        ".genericError.description"
                    ),
                    level: AlertLevels.WARNING,
                    message: t(
                        "console:develop.features.applications.notifications.authenticationStepMin.genericError" +
                        ".message"
                    )
                })
            );

            return;
        }

        const leftSideSteps: AuthenticationStepInterface[] = (stepIndex !== 0)
            ? steps.slice(0, stepIndex)
            : [];
        const rightSideSteps: AuthenticationStepInterface[] = ((stepIndex + 1) in steps)
            ? steps.slice(stepIndex + 1)
            : [];

        const containSecondFactorOnRight: boolean = hasSpecificFactorsInSteps(
            ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS, rightSideSteps);

        // If there are second factors in the right side from the step that is to be deleted,
        // Check if there are first factors on the left. If not, do not delete the step.
        if (containSecondFactorOnRight) {
            const containFirstFactorOnLeft: boolean = hasSpecificFactorsInSteps(
                ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS, leftSideSteps);

            if (!containFirstFactorOnLeft) {
                dispatch(
                    addAlert({
                        description: t("console:develop.features.applications.notifications." +
                            "authenticationStepDeleteErrorDueToSecondFactors.genericError.description"),
                        level: AlertLevels.WARNING,
                        message: t("console:develop.features.applications.notifications." +
                            "authenticationStepDeleteErrorDueToSecondFactors.genericError.message"
                        )
                    })
                );

                return;
            }
        }

        // Remove the step.
        steps.splice(stepIndex, 1);

        // Rebuild the step ids.
        steps.forEach((step, index) => (step.id = index + 1));

        setAuthenticationSteps(steps);
        updateSteps(false);
    };

    /**
     * Checks if certain factors are available in the passed in steps.
     *
     * @param {string[]} factors - Set of factors to check.
     * @param {[]} steps - Authentication steps.
     * @return {boolean}
     */
    const hasSpecificFactorsInSteps = (factors: string[], steps: AuthenticationStepInterface[]): boolean => {

        let hasFirstFactors: boolean = false;

        for (const step of steps) {
            for (const option of step.options) {
                if (factors.includes(option.authenticator)) {
                    hasFirstFactors = true;
                    break;
                }
            }

            if (hasFirstFactors) {
                break;
            }
        }

        return hasFirstFactors;
    };

    /**
     * Handles the addition of new authentication step.
     */
    const handleAuthenticationStepAdd = (): void => {
        const steps = [ ...authenticationSteps ];

        steps.push({
            id: steps.length + 1,
            options: []
        });

        setAuthenticationSteps(steps);
        updateSteps(true);
    };

    /**
     * Handles the subject identifier value onchange event.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - Change Event.
     * @param data - Dropdown data.
     */
    const handleSubjectRetrievalStepChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        const { value } = data;
        setSubjectStepId(value as number);
    };

    /**
     * Handles the attribute identifier value onchange event.
     *
     * @param {React.SyntheticEvent<HTMLElement>} event - Change Event.
     * @param data - Dropdown data.
     */
    const handleAttributeRetrievalStepChange = (event: SyntheticEvent<HTMLElement>, data: DropdownProps): void => {
        const { value } = data;
        setAttributeStepId(value as number);
    };

    /**
     * Validates if the step deletion is valid.
     *
     * @return {boolean} True or false.
     */
    const validateSteps = (): boolean => {
        const steps: AuthenticationStepInterface[] = [ ...authenticationSteps ];

        const found = steps.find((step) => isEmpty(step.options));

        if (found) {
            dispatch(
                addAlert({
                    description: t(
                        "console:develop.features.applications.notifications.emptyAuthenticationStep" +
                        ".genericError.description"
                    ),
                    level: AlertLevels.WARNING,
                    message: t(
                        "console:develop.features.applications.notifications.emptyAuthenticationStep.genericError" +
                        ".message"
                    )
                })
            );

            return false;
        }

        return true;
    };

    /**
     * Toggles the authenticator side panel visibility.
     */
    const toggleAuthenticatorsSidePanelVisibility = (): void => {
        setAuthenticatorsSidePanelVisibility(!showAuthenticatorsSidePanel);
    };

    /**
     * Filter out the displayable set of authenticators by validating against
     * the array of authenticators defined to be hidden in the config.
     *
     * @param {GenericAuthenticatorInterface[]} authenticators - Authenticators to be filtered.
     * @return {GenericAuthenticatorInterface[]}
     */
    const moderateAuthenticators = (authenticators: GenericAuthenticatorInterface[]) => {

        if (isEmpty(authenticators)) {
            return [];
        }

        // If the config is undefined or empty, return the original.
        if (!config.ui?.hiddenAuthenticators
            || !Array.isArray(config.ui.hiddenAuthenticators)
            || config.ui.hiddenAuthenticators.length < 1) {

            return authenticators;
        }

        return authenticators.filter((authenticator: GenericAuthenticatorInterface) => {
            return !config.ui.hiddenAuthenticators
                .some((hiddenAuthenticator: string) => hiddenAuthenticator === authenticator.name);
        });
    };

    /**
     * Shows a disclaimer to users when a handler is added.
     * @return {ReactElement}
     */
    const renderHandlerDisclaimerModal = (): ReactElement => (
        <ConfirmationModal
            onClose={ () => setShowHandlerDisclaimerModal(false) }
            type="warning"
            open={ showHandlerDisclaimerModal }
            primaryAction={ t("common:confirm") }
            secondaryAction={ t("common:cancel") }
            onPrimaryActionClick={ () => setShowHandlerDisclaimerModal(false) }
            data-testid={ `${ testId }-handler-disclaimer-modal` }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header
                data-testid={ `${ testId }-delete-confirmation-modal-header` }
            >
                { t("console:develop.features.applications.confirmations.handlerAuthenticatorAddition.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-testid={ `${ testId }-delete-confirmation-modal-message` }
            >
                { t("console:develop.features.applications.confirmations.handlerAuthenticatorAddition.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content
                data-testid={ `${ testId }-delete-confirmation-modal-content` }
            >
                { t("console:develop.features.applications.confirmations.handlerAuthenticatorAddition.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * Render add authenticator modal.
     *
     * @return {React.ReactElement}
     */
    const renderAuthenticatorAddModal = (): ReactElement => (

        <AddAuthenticatorModal
            open={ showAuthenticatorAddModal }
            onModalSubmit={ (authenticators, stepToAdd: number) => {
                authenticators.map((authenticator) => {
                    updateAuthenticationStep(stepToAdd - 1, authenticator.id);
                });

                setShowAuthenticatorAddModal(false);
            } }
            onClose={ () => setShowAuthenticatorAddModal(false) }
            header={
                t("console:develop.features.applications.edit.sections.signOnMethod.sections.authenticationFlow." +
                    "sections.stepBased.addAuthenticatorModal.heading")
            }
            authenticatorGroups={ [
                {
                    authenticators: moderateAuthenticators(localAuthenticators),
                    category: ApplicationManagementConstants.AUTHENTICATOR_CATEGORIES.LOCAL,
                    description: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                        "authenticationFlow.sections.stepBased.addAuthenticatorModal.content.authenticatorGroups." +
                        "basic.description", { productName: config.ui.productName }),
                    heading: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                        "authenticationFlow.sections.stepBased.addAuthenticatorModal.content.authenticatorGroups." +
                        "basic.heading")
                },
                {
                    authenticators: moderateAuthenticators(federatedAuthenticators),
                    category: ApplicationManagementConstants.AUTHENTICATOR_CATEGORIES.SOCIAL,
                    description: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                        "authenticationFlow.sections.stepBased.addAuthenticatorModal.content.authenticatorGroups." +
                        "social.description"),
                    heading: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                        "authenticationFlow.sections.stepBased.addAuthenticatorModal.content.authenticatorGroups." +
                        "social.heading")
                },
                {
                    authenticators: moderateAuthenticators(secondFactorAuthenticators),
                    category: ApplicationManagementConstants.AUTHENTICATOR_CATEGORIES.SECOND_FACTOR,
                    description: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                        "authenticationFlow.sections.stepBased.addAuthenticatorModal.content.authenticatorGroups." +
                        "mfa.description"),
                    heading: t("console:develop.features.applications.edit.sections.signOnMethod.sections." +
                        "authenticationFlow.sections.stepBased.addAuthenticatorModal.content.authenticatorGroups." +
                        "mfa.heading")
                }
            ] }
            showStepSelector={ authenticationSteps.length > 1 }
            stepCount={ authenticationSteps.length }
        />
    );

    return (
        <div className="authentication-flow-wrapper" data-testid={ testId }>
            <div className="authentication-flow-section">
                <div className="authentication-steps-section">
                    {
                        authenticationSteps &&
                        authenticationSteps instanceof Array &&
                        authenticationSteps.length > 0
                            ? authenticationSteps.map((step, stepIndex) => (
                                <Fragment key={ stepIndex }>
                                    <AuthenticationStep
                                        authenticators={ [
                                            ...localAuthenticators,
                                            ...federatedAuthenticators,
                                            ...secondFactorAuthenticators
                                        ] }
                                        onStepDelete={ handleStepDelete }
                                        onStepOptionAuthenticatorChange={
                                            handleStepOptionAuthenticatorChange
                                        }
                                        onStepOptionDelete={ handleStepOptionDelete }
                                        showStepMeta={ authenticationSteps.length > 1 }
                                        showStepDeleteAction={ authenticationSteps.length > 1 }
                                        step={ step }
                                        stepIndex={ stepIndex }
                                        readOnly={ readOnly }
                                        data-testid={ `${ testId }-authentication-step-${ stepIndex }` }
                                    />
                                    {
                                        (stepIndex < (authenticationSteps.length - 1)) && (
                                            <div
                                                className="flow-button-container with-trail with-margin start"
                                            ></div>
                                        )
                                    }
                                </Fragment>
                            ))
                            : null
                    }
                    <div className="step-actions-container">
                        <div className="action-button-group">
                            <LinkButton
                                fluid
                                className="text-left"
                                onClick={ () => {
                                    setShowAuthenticatorAddModal(true);
                                } }
                            >
                                <Icon name="plus"/>
                                Add Authentication
                            </LinkButton>
                            <LinkButton
                                fluid
                                className="text-left"
                                onClick={ handleAuthenticationStepAdd }
                            >
                                <Icon name="plus"/>
                                Add new step
                            </LinkButton>
                        </div>
                    </div>
                </div>
            </div>
            { !readOnly && authenticationSteps.length > 1 && (
                <>
                    <Divider hidden/>
                    <Form>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column computer={ 4 } tablet={ 6 } mobile={ 16 }>
                                    <Form.Select
                                        scrolling
                                        label={ t(
                                            "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.authenticationFlow.sections" +
                                            ".stepBased.forms.fields.subjectIdentifierFrom.label"
                                        ) }
                                        placeholder={ t(
                                            "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.authenticationFlow.sections" +
                                            ".stepBased.forms.fields.subjectIdentifierFrom" +
                                            ".placeholder"
                                        ) }
                                        options={
                                            authenticationSteps &&
                                            authenticationSteps instanceof Array &&
                                            authenticationSteps.length > 0
                                                ? authenticationSteps.map((step, index) => {
                                                    return {
                                                        key: step.id,
                                                        text: `${ t("common:step") } ${ index + 1 }`,
                                                        value: index + 1
                                                    };
                                                })
                                                : []
                                        }
                                        onChange={ handleSubjectRetrievalStepChange }
                                        value={ subjectStepId }
                                        data-testid={ `${ testId }-use-subject-identifier-from-step-select` }
                                    />
                                    <Hint>
                                        Select from which step the user&apos;s subject identifier is taken.
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column computer={ 4 } tablet={ 6 } mobile={ 16 }>
                                    <Form.Select
                                        scrolling
                                        label={ t(
                                            "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.authenticationFlow.sections" +
                                            ".stepBased.forms.fields.attributesFrom.label"
                                        ) }
                                        placeholder={ t(
                                            "console:develop.features.applications.edit.sections" +
                                            ".signOnMethod.sections.authenticationFlow.sections" +
                                            ".stepBased.forms.fields.attributesFrom.placeholder"
                                        ) }
                                        options={
                                            authenticationSteps &&
                                            authenticationSteps instanceof Array &&
                                            authenticationSteps.length > 0
                                                ? authenticationSteps.map((step, index) => {
                                                    return {
                                                        key: step.id,
                                                        text: `${ t("common:step") } ${ index + 1 }`,
                                                        value: index + 1
                                                    };
                                                })
                                                : []
                                        }
                                        onChange={ handleAttributeRetrievalStepChange }
                                        value={ attributeStepId }
                                        data-testid={ `${ testId }-use-attributes-from-step-select` }
                                    />
                                    <Hint>
                                        Select from which step the user&apos;s attributes(other than subject identifier)
                                        are taken.
                                    </Hint>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Form>
                </>
            ) }

            { showAuthenticatorAddModal && renderAuthenticatorAddModal() }
            { showHandlerDisclaimerModal && renderHandlerDisclaimerModal() }
        </div>
    );
};

/**
 * Default props for the step based flow component.
 */
StepBasedFlow.defaultProps = {
    "data-testid": "step-based-flow"
};
