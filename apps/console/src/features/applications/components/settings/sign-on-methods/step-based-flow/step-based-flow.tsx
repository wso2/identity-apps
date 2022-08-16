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
import { ConfirmationModal, GenericIcon } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import orderBy from "lodash-es/orderBy";
import union from "lodash-es/union";
import React, { Fragment, FunctionComponent, ReactElement, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Popup } from "semantic-ui-react";
import { AddAuthenticatorModal } from "./add-authenticator-modal";
import { AuthenticationStep } from "./authentication-step";
import { applicationConfig } from "../../../../../../extensions";
import { AppState, ConfigReducerStateInterface, EventPublisher } from "../../../../../core";
import {
    AuthenticatorCategories,
    AuthenticatorMeta,
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface,
    IdentityProviderManagementConstants,
    IdentityProviderTemplateCategoryInterface,
    IdentityProviderTemplateInterface,
    IdentityProviderTemplateItemInterface,
    IdentityProviderTemplateLoadingStrategies,
    IdentityProviderTemplateManagementUtils,
    SupportedAuthenticators
} from "../../../../../identity-providers";
import { getSignInFlowIcons } from "../../../../configs";
import { ApplicationManagementConstants } from "../../../../constants";
import {
    AuthenticationSequenceInterface,
    AuthenticationSequenceType,
    AuthenticationStepInterface,
    AuthenticatorInterface
} from "../../../../models";
import { SignInMethodUtils } from "../../../../utils";

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
    onIDPCreateWizardTrigger: (type: string, cb: () => void, template?: any) => void;
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
    /**
     * Callback to update the button disable state change.
     */
    onAuthenticationSequenceChange: (isDisabled: boolean, updatedSteps: AuthenticationStepInterface[]) => void;
    refreshAuthenticators: () => Promise<void>;
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
        onAuthenticationSequenceChange,
        refreshAuthenticators,
        [ "data-testid" ]: testId
    } = props;

    const { t } = useTranslation();

    const dispatch = useDispatch();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);
    const groupedIDPTemplates: IdentityProviderTemplateItemInterface[] = useSelector(
        (state: AppState) => state.identityProvider?.groupedTemplates
    );

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
    const [ categorizedTemplates, setCategorizedTemplates ] =
        useState<IdentityProviderTemplateCategoryInterface[]>(undefined);
    const [ addNewAuthenticatorClicked, setAddNewAuthenticatorClicked ] = useState<boolean>(false);

    const authenticationStepsDivRef = useRef<HTMLDivElement>(null);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

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
            if (authenticator.name === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR) {
                // Backup code authenticator is not available for customer users at the moment.
                return;
            } else if (ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS.includes(authenticator.id)) {
                secondFactorAuth.push(authenticator);
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
    }, [ JSON.stringify(authenticationSequence) ]);

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

    useEffect(() => {

        if (addNewAuthenticatorClicked
            && groupedIDPTemplates
            && groupedIDPTemplates.length > 0) {
            persistCategorizedTemplates(groupedIDPTemplates);
        }
    }, [ groupedIDPTemplates, addNewAuthenticatorClicked ]);

    /**
     * Disable button when there are no authentication options selected.
     */
    useEffect(() => {

        const steps: AuthenticationStepInterface[] = [ ...authenticationSteps ];

        const hasStepsWithOptions: boolean = steps.some((step: AuthenticationStepInterface) => !isEmpty(step.options));

        if (hasStepsWithOptions) {
            onAuthenticationSequenceChange(false, authenticationSteps);

            return;
        }
        onAuthenticationSequenceChange(true, authenticationSteps);
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

        let isDuplicate: boolean = options.some((option: AuthenticatorInterface) => {
            return option.authenticator === authenticator?.defaultAuthenticator?.name;
        });

        const isEIDP: boolean = ApplicationManagementConstants
            .EIDP_AUTHENTICATORS.includes(authenticator?.defaultAuthenticator?.name as SupportedAuthenticators);

        // If the added option is EIDP, eventhough the authenticator is same,
        // we need to check if it's the same IDP. If it is, then mark as duplicate.
        if (isDuplicate && isEIDP) {
            isDuplicate = options.some((option: AuthenticatorInterface) => {
                return option.idp === authenticator?.idp;
            });
        }

        if (isDuplicate) {
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
                || !SignInMethodUtils.isSecondFactorAdditionValid(authenticator.defaultAuthenticator.authenticatorId,
                    stepIndex, steps))) {

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

        if(!applicationConfig.signInMethod.authenticatorSelection
            .customAuthenticatorAdditionValidation(authenticatorId, stepIndex, dispatch)) {
            return;
        }

        if (!isValid) {
            return;
        }

        const defaultAuthenticator = authenticator.authenticators.find(
            (item) => item.authenticatorId === authenticator.defaultAuthenticator.authenticatorId
        );

        steps[ stepIndex ].options.push({
            authenticator: defaultAuthenticator.name,
            idp: authenticator.idp
        });

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
        ]: AuthenticationStepInterface[][] = SignInMethodUtils.getLeftAndRightSideSteps(stepIndex, steps);

        // Checks if identifier first can be deleted.
        if (
            stepIndex === 0 &&
            steps[0].options[optionIndex].authenticator ===
                IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR &&
            steps[1]?.options?.find(
                (option) => option.authenticator === IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR
            )
        ) {
            dispatchDeleteErrorNotification();

            return;
        }

        const containSecondFactorOnRight: boolean = SignInMethodUtils.hasSpecificFactorsInSteps(
            [ ...ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS ], rightSideSteps);

        // If there are second factor authenticators on the right, evaluate further.
        if (containSecondFactorOnRight) {
            const deletingOption: AuthenticatorInterface = steps[ stepIndex ].options[ optionIndex ];
            const noOfSecondFactorsOnRight: number = SignInMethodUtils.countSpecificFactorInSteps(
                [ ...ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS ], rightSideSteps);
            const noOfSecondFactorsOnRightRequiringHandlers: number = SignInMethodUtils.countSpecificFactorInSteps(
                [
                    IdentityProviderManagementConstants.TOTP_AUTHENTICATOR,
                    IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR
                ], rightSideSteps);
            const onlySecondFactorsRequiringHandlersOnRight: boolean = noOfSecondFactorsOnRight
                === noOfSecondFactorsOnRightRequiringHandlers;
            const isDeletingOptionFirstFactor: boolean = [
                ...ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
                IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR
            ]
                .includes(deletingOption.authenticator);
            const isDeletingOptionSecondFactorHandler: boolean = [
                ...ApplicationManagementConstants.TOTP_HANDLERS,
                ...ApplicationManagementConstants.EMAIL_OTP_HANDLERS
            ].includes(deletingOption.authenticator);
            const immediateStepHavingSpecificFactors: number = SignInMethodUtils.getImmediateStepHavingSpecificFactors(
                ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS, steps);

            // If the deleting step is a first factor, we have to check if there are other handlers that
            // could handle the second factors on the right.
            if (isDeletingOptionFirstFactor || isDeletingOptionSecondFactorHandler) {
                let firstFactorsInTheStep: number = 0;
                let secondFactorHandlersInTheStep: number = 0;

                steps[ stepIndex ].options.filter((option: AuthenticatorInterface) => {
                    if (ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS.includes(option.authenticator)) {
                        firstFactorsInTheStep++;
                    }

                    if ([ ...ApplicationManagementConstants.TOTP_HANDLERS,
                        ...ApplicationManagementConstants.EMAIL_OTP_HANDLERS ].includes(option.authenticator)) {
                        secondFactorHandlersInTheStep++;
                    }
                });

                // If the step that the deleting authenticator has no other first factors or handlers,
                // start evaluation other options.
                if ((onlySecondFactorsRequiringHandlersOnRight && secondFactorHandlersInTheStep <= 1)
                    || (!onlySecondFactorsRequiringHandlersOnRight && firstFactorsInTheStep <= 1)) {

                    // If there is TOTP or Email OTP on the right, evaluate if the left side has necessary handlers.
                    // Else check if there are first factors on the left.
                    const containProperHandlersOnLeft: boolean = onlySecondFactorsRequiringHandlersOnRight
                        ? SignInMethodUtils.hasSpecificFactorsInSteps([ ...ApplicationManagementConstants.TOTP_HANDLERS,
                            ...ApplicationManagementConstants.EMAIL_OTP_HANDLERS ], leftSideSteps)
                        : SignInMethodUtils.hasSpecificFactorsInSteps(
                            ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS, leftSideSteps);

                    // There are no possible authenticators on the left form the deleting option to handle the second
                    // factor authenticators. Evaluate....
                    if (!containProperHandlersOnLeft) {

                        const [
                            leftSideStepsFromImmediateSecondFactor
                        ]: AuthenticationStepInterface[][] = SignInMethodUtils
                            .getLeftAndRightSideSteps(immediateStepHavingSpecificFactors, steps);

                        // Try to find a proper handler in steps left of the immediate second factor.
                        const noOfProperHandlersOnLeft: number = onlySecondFactorsRequiringHandlersOnRight
                            ? SignInMethodUtils.countSpecificFactorInSteps(
                                [
                                    ...ApplicationManagementConstants.TOTP_HANDLERS,
                                    ...ApplicationManagementConstants.EMAIL_OTP_HANDLERS
                                ], leftSideStepsFromImmediateSecondFactor)
                            : SignInMethodUtils.countSpecificFactorInSteps(
                                ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
                                leftSideStepsFromImmediateSecondFactor);

                        // If there are no other handlers, Show a warning and abort option delete.
                        if (noOfProperHandlersOnLeft <= 1) {
                            dispatchDeleteErrorNotification();

                            return;
                        }
                    }
                }
            }
        }

        steps[ stepIndex ].options.splice(optionIndex, 1);
        setAuthenticationSteps(steps);
    };

    /**
     * This method dispatches a notification when there is an error during validating a delete action.
     */
    const dispatchDeleteErrorNotification = (): void => {
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
            rightSideSteps,
            nextStep
        ]: AuthenticationStepInterface[][] = SignInMethodUtils.getLeftAndRightSideSteps(stepIndex, steps);

        const containSecondFactorOnRight: boolean = SignInMethodUtils.hasSpecificFactorsInSteps(
            ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS, rightSideSteps);
        const noOfTOTPOnRight: number = SignInMethodUtils.countSpecificFactorInSteps(
            [ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR ], rightSideSteps);
        const noOfFactorsOnRight: number = SignInMethodUtils.countSpecificFactorInSteps(
            ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS, rightSideSteps)
            + SignInMethodUtils.countSpecificFactorInSteps(
                ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS, rightSideSteps);
        const onlyTOTPOnRight: boolean = noOfFactorsOnRight === noOfTOTPOnRight;

        // If there are second factors in the right side from the step that is to be deleted,
        // Check if there are first factors on the left or if there is an immediate first factor on right.
        // If not, do not delete the step.
        if (containSecondFactorOnRight) {
            const containProperHandlersOnLeft: boolean = onlyTOTPOnRight
                ? SignInMethodUtils.hasSpecificFactorsInSteps(
                    ApplicationManagementConstants.TOTP_HANDLERS,leftSideSteps)
                : (SignInMethodUtils.hasSpecificFactorsInSteps(
                    ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS, leftSideSteps)
                    || SignInMethodUtils.checkImmediateStepHavingSpecificFactors(
                        ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS, nextStep));

            if (!containProperHandlersOnLeft) {
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
     * Handles the addition of new authentication step.
     */
    const handleAuthenticationStepAdd = (): void => {
        const steps = [ ...authenticationSteps ];

        steps.push({
            id: steps.length + 1,
            options: []
        });

        eventPublisher.publish("application-sign-in-method-click-add-new-step");
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

        // Don't allow identifier first being the only authenticator in the flow.
        if ( steps.length === 1
            && steps[ 0 ].options.length === 1
            && steps[ 0 ].options[ 0 ].authenticator
                === IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR ) {
            dispatch(
                addAlert({
                    description: t(
                        "console:develop.features.applications.notifications.updateOnlyIdentifierFirstError" +
                        ".description"
                    ),
                    level: AlertLevels.WARNING,
                    message: t(
                        "console:develop.features.applications.notifications.updateOnlyIdentifierFirstError" +
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

    /**
     * Handles the clock event of add new authenticator button.
     */
    const handleAddNewAuthenticatorClick = (): void => {

        if (groupedIDPTemplates !== undefined) {
            persistCategorizedTemplates(groupedIDPTemplates);

            return;
        }

        const useAPI: boolean = config.ui.identityProviderTemplateLoadingStrategy
            ? (config.ui.identityProviderTemplateLoadingStrategy === IdentityProviderTemplateLoadingStrategies.REMOTE)
            : (IdentityProviderManagementConstants.DEFAULT_IDP_TEMPLATE_LOADING_STRATEGY
                === IdentityProviderTemplateLoadingStrategies.REMOTE);

        IdentityProviderTemplateManagementUtils.getIdentityProviderTemplates(useAPI)
            .finally(() => {
                setAddNewAuthenticatorClicked(true);
            });
    };

    const persistCategorizedTemplates = (templates: IdentityProviderTemplateInterface[]) => {

        IdentityProviderTemplateManagementUtils.categorizeTemplates(templates)
            .then((response: IdentityProviderTemplateCategoryInterface[]) => {

                let tags: string[] = [];

                response.filter((category: IdentityProviderTemplateCategoryInterface) => {
                    // Order the templates by pushing coming soon items to the end.
                    category.templates = orderBy(category.templates, [ "comingSoon" ], [ "desc" ]);

                    category.templates.filter((template: IdentityProviderTemplateInterface) => {
                        if (!(template?.tags && Array.isArray(template.tags) && template.tags.length > 0)) {
                            return;
                        }

                        tags = union(tags, template.tags);
                    });
                });

                setCategorizedTemplates(response);
                setAddNewAuthenticatorClicked(false);
            })
            .catch(() => {
                setCategorizedTemplates([]);
                setAddNewAuthenticatorClicked(false);
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
                refreshAuthenticators={ refreshAuthenticators }
                authenticationSteps={ authenticationSteps }
                allowSocialLoginAddition={ true }
                currentStep={ authenticatorAddStep }
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
                subjectStepId={ subjectStepId }
                attributeStepId={ attributeStepId }
            />
        );
    };

    return (
        <div className="authentication-flow-wrapper" data-testid={ testId }>
            <div className="authentication-flow-section timeline">
                <div className="timeline-button start">
                    <GenericIcon
                        size="x50"
                        transparent
                        icon={ getSignInFlowIcons().startButton }
                    />
                </div>
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
                </div>
                {
                    !readOnly && (
                        <div className="timeline-button add">
                            <Popup
                                trigger={ (
                                    <div>
                                        <GenericIcon
                                            link
                                            transparent
                                            size="mini"
                                            fill="primary"
                                            icon={ getSignInFlowIcons().addButton }
                                            onClick={ handleAuthenticationStepAdd }
                                            data-tourid="add-new-step-button"
                                        />
                                    </div>
                                ) }
                                position="left center"
                                content={ "Add a new authentication step" }
                            />
                        </div>
                    )
                }
                <div className="timeline-button done">
                    <GenericIcon
                        size="x50"
                        transparent
                        icon={ getSignInFlowIcons().doneButton }
                    />
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
