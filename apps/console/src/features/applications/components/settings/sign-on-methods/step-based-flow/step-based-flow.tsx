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
    LinkButton
} from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, {
    Fragment,
    FunctionComponent,
    ReactElement,
    useEffect,
    useRef,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "semantic-ui-react";
import { AddAuthenticatorModal } from "./add-authenticator-modal";
import { AuthenticationStep } from "./authentication-step";
import { AppState, ConfigReducerStateInterface } from "../../../../../core";
import {
    AuthenticatorCategories, AuthenticatorMeta,
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface,
    IdentityProviderManagementConstants,
    IdentityProviderTemplateCategoryInterface,
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateItemInterface,
    IdentityProviderTemplateLoadingStrategies,
    IdentityProviderTemplateManagementUtils
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
     * Callback to trigger IDP create wizard.
     */
    onIDPCreateWizardTrigger: (type: string, cb: () => void) => void;
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
        onIDPCreateWizardTrigger,
        onUpdate,
        readOnly,
        triggerUpdate,
        updateSteps,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const identityProviderTemplates: IdentityProviderTemplateItemInterface[] = useSelector(
        (state: AppState) => state.identityProvider.templates);

    const [ enterpriseAuthenticators, setEnterpriseAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ socialAuthenticators, setSocialAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ localAuthenticators, setLocalAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ secondFactorAuthenticators, setSecondFactorAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ authenticationSteps, setAuthenticationSteps ] = useState<AuthenticationStepInterface[]>([]);
    const [ subjectStepId, setSubjectStepId ] = useState<number>(1);
    const [ attributeStepId, setAttributeStepId ] = useState<number>(1);
    const [ showHandlerDisclaimerModal, setShowHandlerDisclaimerModal ] = useState<boolean>(false);
    const [ authenticatorAddStep, setAuthenticatorAddStep ] = useState<number>(1);
    const [ showAuthenticatorAddModal, setShowAuthenticatorAddModal ] = useState<boolean>(false);
    const [ categorizedTemplates, setCategorizedTemplates ] = useState<IdentityProviderTemplateCategoryInterface[]>([]);
    const [
        isIDPTemplateRequestLoading,
        setIDPTemplateRequestLoadingStatus
    ] = useState<boolean>(false);

    const authenticationStepsDivRef = useRef<HTMLDivElement>(null);

    /**
     * Separates out the different authenticators to their relevant categories.
     */
    useEffect(() => {

        if (!authenticators || !Array.isArray(authenticators) || !authenticators[ 0 ] || !authenticators[ 1 ]) {
            return;
        }

        const localAuthenticators: GenericAuthenticatorInterface[] = authenticators[ 0 ];
        const federatedAuthenticators: GenericAuthenticatorInterface[] = authenticators[ 1 ];
        const filteredSocialAuthenticators: GenericAuthenticatorInterface[] = [];
        const filteredEnterpriseAuthenticators: GenericAuthenticatorInterface[] = [];

        const moderatedLocalAuthenticators: GenericAuthenticatorInterface[] = [];
        const secondFactorAuth: GenericAuthenticatorInterface[] = [];

        localAuthenticators.forEach((authenticator: GenericAuthenticatorInterface) => {
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
        
        federatedAuthenticators.forEach((authenticator: GenericAuthenticatorInterface) => {
            if (ApplicationManagementConstants.SOCIAL_AUTHENTICATORS
                .includes(authenticator.defaultAuthenticator.authenticatorId)) {
                
                filteredSocialAuthenticators.push(authenticator);
            } else {
                filteredEnterpriseAuthenticators.push(authenticator);
            }
        });

        setSecondFactorAuthenticators(secondFactorAuth);
        setLocalAuthenticators(moderatedLocalAuthenticators);
        setEnterpriseAuthenticators(filteredEnterpriseAuthenticators);
        setSocialAuthenticators(filteredSocialAuthenticators);
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

    /**
     * Set second factor authenticators.
     */
    useEffect(() => {
        
        if (isEmpty(secondFactorAuthenticators)) {
            return;
        }

        let shouldEnable: boolean = hasSpecificFactorsInSteps(
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
     * Try to scroll to the end when a new step is added.
     */
    useEffect(() => {
        
        if (!authenticationStepsDivRef?.current) {
            return;
        }

        try {
            authenticationStepsDivRef.current.scrollLeft = authenticationStepsDivRef.current.scrollWidth;
        } catch (e) {
            // Silent any issues occurred when trying to scroll.
            // Add debug logs here one a logger is added.
            // Tracked here https://github.com/wso2/product-is/issues/11650.
        }
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
            ...enterpriseAuthenticators,
            ...socialAuthenticators,
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

        const steps: AuthenticationStepInterface[] = [ ...authenticationSteps ];

        const [
            leftSideSteps,
            rightSideSteps
        ]: AuthenticationStepInterface[][] = getLeftAndRightSideSteps(stepIndex, steps);

        const containSecondFactorOnRight: boolean = hasSpecificFactorsInSteps(
            ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS, rightSideSteps);
        
        // If there are second factor authenticators on the right, evaluate further.
        if (containSecondFactorOnRight) {
            const deletingOption = steps[ stepIndex ].options[ optionIndex ];
            const isDeletingOptionFirstFactor = ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS
                .includes(deletingOption.authenticator);
            
            // If the deleting step is a first factor, we have to check if there are other handlers that 
            // could handle the second factors on the right.
            if (isDeletingOptionFirstFactor) {
                let firstFactorsInTheStep = 0;
                
                steps[ stepIndex ].options.filter((option: AuthenticatorInterface) => {
                    if (ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS
                        .includes(option.authenticator)) {
                        firstFactorsInTheStep++;
                    }
                });
                
                // If the step that the deleting authenticator has no other first factors,
                // start evaluation other options.
                if (firstFactorsInTheStep <= 1) {
                    const containFirstFactorOnLeft: boolean = hasSpecificFactorsInSteps(
                        ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS, leftSideSteps);
                    
                    // There are no possible authenticators left to handle the second factor authenticators. ABORT....
                    if (!containFirstFactorOnLeft) {
                        dispatch(
                            addAlert({
                                description: t(
                                    "console:develop.features.applications.notifications." +
                                    "deleteOptionErrorDueToSecondFactorsOnRight.genericError.description"
                                ),
                                level: AlertLevels.WARNING,
                                message: t(
                                    "console:develop.features.applications.notifications." +
                                    "deleteOptionErrorDueToSecondFactorsOnRight.genericError.message"
                                )
                            })
                        );

                        return;
                    }
                }
            }
        }

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

        const [
            leftSideSteps,
            rightSideSteps
        ]: AuthenticationStepInterface[][] = getLeftAndRightSideSteps(stepIndex, steps);

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
     * Splits the steps to two parts based on the passed in index.
     *
     * @param {number} stepIndex - Index to split.
     * @param {AuthenticationStepInterface[]} steps - All steps.
     *
     * @return {AuthenticationStepInterface[][]}
     */
    const getLeftAndRightSideSteps = (stepIndex: number,
                                      steps: AuthenticationStepInterface[]): AuthenticationStepInterface[][] => {

        const leftSideSteps: AuthenticationStepInterface[] = (stepIndex !== 0)
            ? steps.slice(0, stepIndex)
            : [];

        const rightSideSteps: AuthenticationStepInterface[] = ((stepIndex + 1) in steps)
            ? steps.slice(stepIndex + 1)
            : [];
        
        return [ leftSideSteps, rightSideSteps ];
    };

    /**
     * Checks if certain factors are available in the passed in steps.
     *
     * @param {string[]} factors - Set of factors to check.
     * @param {[]} steps - Authentication steps.
     * @return {boolean}
     */
    const hasSpecificFactorsInSteps = (factors: string[], steps: AuthenticationStepInterface[]): boolean => {

        let isFound: boolean = false;

        for (const step of steps) {
            for (const option of step.options) {
                if (factors.includes(option.authenticator)) {
                    isFound = true;
                    break;
                }
            }

            if (isFound) {
                break;
            }
        }

        return isFound;
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
     * @param {number} stepIndex - Step index.
     */
    const handleSubjectRetrievalStepChange = (stepIndex: number): void => {

        setSubjectStepId(stepIndex);
    };

    /**
     * Handles the attribute identifier value onchange event.
     *
     * @param {number} stepIndex - Step index.
     */
    const handleAttributeRetrievalStepChange = (stepIndex: number): void => {

        setAttributeStepId(stepIndex);
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
     * Filter out the displayable set of authenticators by validating against
     * the array of authenticators defined to be hidden in the config.
     *
     * @param {GenericAuthenticatorInterface[]} authenticators - Authenticators to be filtered.
     * @param {string} category - Authenticator category.
     * @param {string} categoryDisplayName - Authenticator category display name.
     * @param {string} description - Authenticator description.
     *
     * @return {GenericAuthenticatorInterface[]}
     */
    const moderateAuthenticators = (authenticators: GenericAuthenticatorInterface[],
                                    category: string,
                                    categoryDisplayName: string) => {

        if (isEmpty(authenticators)) {
            return [];
        }

        // If the config is undefined or empty, return the original.
        if (!config.ui?.hiddenAuthenticators
            || !Array.isArray(config.ui.hiddenAuthenticators)
            || config.ui.hiddenAuthenticators.length < 1) {

            return authenticators;
        }

        return authenticators
            .filter((authenticator: GenericAuthenticatorInterface) => {
                return !config.ui.hiddenAuthenticators.includes(authenticator.name);
            })
            .map((authenticator: GenericAuthenticatorInterface) => {
                return {
                    ...authenticator,
                    category,
                    categoryDisplayName
                };
            });
    };
    
    const handleAddNewAuthenticatorClick = () => {
        
        const persistCategorizedTemplates = (templates: IdentityProviderTemplateInterface[]) => {

            IdentityProviderTemplateManagementUtils.categorizeTemplates(templates)
                .then((response: IdentityProviderTemplateCategoryInterface[]) => {
                    setCategorizedTemplates(response);
                })
                .catch(() => {
                    setCategorizedTemplates([]);
                });
        };

        if (identityProviderTemplates !== undefined) {
            persistCategorizedTemplates(identityProviderTemplates);
            return;
        }

        setIDPTemplateRequestLoadingStatus(true);

        const useAPI: boolean = config.ui.identityProviderTemplateLoadingStrategy
            ? (config.ui.identityProviderTemplateLoadingStrategy === IdentityProviderTemplateLoadingStrategies.REMOTE)
            : (IdentityProviderManagementConstants.DEFAULT_IDP_TEMPLATE_LOADING_STRATEGY
                === IdentityProviderTemplateLoadingStrategies.REMOTE);

        IdentityProviderTemplateManagementUtils.getIdentityProviderTemplates(useAPI)
            .then((response: IdentityProviderTemplateInterface[]) => {
                persistCategorizedTemplates(response);
            })
            .finally(() => {
                setIDPTemplateRequestLoadingStatus(false);
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
    const renderAuthenticatorAddModal = (): ReactElement => {

        return (
            <AddAuthenticatorModal
                allowSocialLoginAddition={ true }
                open={ showAuthenticatorAddModal }
                onModalSubmit={ (authenticators) => {
                    authenticators.map((authenticator) => {
                        updateAuthenticationStep(authenticatorAddStep, authenticator.id);
                    });

                    setShowAuthenticatorAddModal(false);
                } }
                onClose={ () => setShowAuthenticatorAddModal(false) }
                header={
                    t("console:develop.features.applications.edit.sections.signOnMethod.sections.authenticationFlow." +
                        "sections.stepBased.addAuthenticatorModal.heading")
                }
                authenticators={ [
                    ...moderateAuthenticators(localAuthenticators,
                        AuthenticatorCategories.LOCAL,
                        t(AuthenticatorMeta.getAuthenticatorTypeDisplayName(AuthenticatorCategories.LOCAL))),
                    ...moderateAuthenticators(socialAuthenticators,
                        AuthenticatorCategories.SOCIAL,
                        t(AuthenticatorMeta.getAuthenticatorTypeDisplayName(AuthenticatorCategories.SOCIAL))),
                    ...moderateAuthenticators(secondFactorAuthenticators,
                        AuthenticatorCategories.SECOND_FACTOR,
                        t(AuthenticatorMeta.getAuthenticatorTypeDisplayName(AuthenticatorCategories.SECOND_FACTOR))),
                    ...moderateAuthenticators(enterpriseAuthenticators,
                        AuthenticatorCategories.ENTERPRISE,
                        t(AuthenticatorMeta.getAuthenticatorTypeDisplayName(AuthenticatorCategories.ENTERPRISE)))
                ] }
                showStepSelector={ false }
                stepCount={ authenticationSteps.length }
                onAddNewClick={ handleAddNewAuthenticatorClick }
                onIDPCreateWizardTrigger={ onIDPCreateWizardTrigger }
                categorizedIDPTemplates={ categorizedTemplates }
            />
        );
    };

    return (
        <div className="authentication-flow-wrapper" data-testid={ testId }>
            <div className="authentication-flow-section">
                <div className="authentication-steps-section" ref={ authenticationStepsDivRef }>
                    {
                        authenticationSteps &&
                        authenticationSteps instanceof Array &&
                        authenticationSteps.length > 0
                            ? authenticationSteps.map((step, stepIndex) => (
                                <Fragment key={ stepIndex }>
                                    <AuthenticationStep
                                        authenticators={ [
                                            ...localAuthenticators,
                                            ...enterpriseAuthenticators,
                                            ...socialAuthenticators,
                                            ...secondFactorAuthenticators
                                        ] }
                                        onStepDelete={ handleStepDelete }
                                        onStepOptionAuthenticatorChange={
                                            handleStepOptionAuthenticatorChange
                                        }
                                        onAddAuthenticationClick={ () => {
                                            setShowAuthenticatorAddModal(true);
                                            setAuthenticatorAddStep(stepIndex);
                                        } }
                                        onStepOptionDelete={ handleStepOptionDelete }
                                        showStepMeta={ authenticationSteps.length > 1 }
                                        showStepDeleteAction={ authenticationSteps.length > 1 }
                                        step={ step }
                                        stepIndex={ stepIndex }
                                        readOnly={ readOnly }
                                        subjectStepId={ subjectStepId }
                                        attributeStepId={ attributeStepId }
                                        onAttributeCheckboxChange={ handleAttributeRetrievalStepChange }
                                        onSubjectCheckboxChange={ handleSubjectRetrievalStepChange }
                                        data-testid={ `${ testId }-authentication-step-${ stepIndex }` }
                                    />
                                </Fragment>
                            ))
                            : null
                    }
                    {
                        !readOnly && (
                            <div className="step-actions-container">
                                <div className="action-button-group">
                                    <LinkButton
                                        fluid
                                        data-tourid="add-new-step-button"
                                        className="text-left pl-0"
                                        onClick={ handleAuthenticationStepAdd }
                                    >
                                        <Icon name="plus"/>
                                        {
                                            t("console:develop.features.applications.edit.sections.signOnMethod." +
                                                "sections.authenticationFlow.sections.stepBased.actions.addNewStep")
                                        }
                                    </LinkButton>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
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
