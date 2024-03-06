/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { hasRequiredScopes } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { ConfirmationModal, GenericIcon, Popup } from "@wso2is/react-components";
import isEmpty from "lodash-es/isEmpty";
import React, { Fragment, FunctionComponent, ReactElement, RefObject, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { AddAuthenticatorModal } from "./add-authenticator-modal";
import { AuthenticationStep } from "./authentication-step";
import { applicationConfig, identityProviderConfig } from "../../../../../../extensions";
import { AuthenticatorManagementConstants } from "../../../../../connections/constants/autheticator-constants";
import { AppState, EventPublisher, FeatureConfigInterface } from "../../../../../core";
import {
    IdentityProviderManagementConstants
} from "../../../../../identity-providers/constants/identity-provider-management-constants";
import {
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface,
    SupportedAuthenticators
} from "../../../../../identity-providers/models";
import { getSignInFlowIcons } from "../../../../configs/ui";
import { ApplicationManagementConstants } from "../../../../constants";
import {
    AuthenticationSequenceInterface,
    AuthenticationSequenceType,
    AuthenticationStepInterface,
    AuthenticatorInterface
} from "../../../../models";
import { SignInMethodUtils } from "../../../../utils/sign-in-method-utils";

/**
 * Proptypes for the applications settings component.
 */
interface AuthenticationFlowPropsInterface extends IdentifiableComponentInterface {
    /**
     * Whether the application is shared between organizations or not.
     */
    isApplicationShared: boolean;
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
     * @param sequence - Authentication sequence.
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
}

/**
 * Configure the authentication flow of an application.
 *
 * @param props - Props injected to the component.
 *
 * @returns StepBasedFlow Component
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
        isApplicationShared,
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ enterpriseAuthenticators, setEnterpriseAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ socialAuthenticators, setSocialAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ localAuthenticators, setLocalAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ secondFactorAuthenticators, setSecondFactorAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ recoveryAuthenticators, setRecoveryAuthenticators ] = useState<GenericAuthenticatorInterface[]>([]);
    const [ authenticationSteps, setAuthenticationSteps ] = useState<AuthenticationStepInterface[]>([]);
    const [ subjectStepId, setSubjectStepId ] = useState<number>(1);
    const [ attributeStepId, setAttributeStepId ] = useState<number>(1);
    const [ showHandlerDisclaimerModal, setShowHandlerDisclaimerModal ] = useState<boolean>(false);
    const [ showBackupCodeRemoveConfirmModal, setShowBackupCodeRemoveConfirmModal ] = useState<boolean>(false);
    const [ authenticatorAddStep, setAuthenticatorAddStep ] = useState<number>(1);
    const [ showAuthenticatorAddModal, setShowAuthenticatorAddModal ] = useState<boolean>(false);
    const [ authenticatorRemoveStep, setAuthenticatorRemoveStep ] = useState<number>(0);
    const [ backupCodeRemoveIndex, setBackupCodeRemoveIndex ] = useState<number>(0);
    const [ authenticatorRemoveIndex, setAuthenticatorRemoveIndex ] = useState<number>(0);

    const authenticationStepsDivRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);

    const eventPublisher: EventPublisher = EventPublisher.getInstance();

    const allowedScopes: string = useSelector((state: AppState) => state?.auth?.allowedScopes);
    const featureConfig: FeatureConfigInterface = useSelector((state: AppState) => state?.config?.ui?.features);

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
        const recoveryAuth: GenericAuthenticatorInterface[] = [];

        localAuthenticators.forEach((authenticator: GenericAuthenticatorInterface) => {
            if (authenticator.id === IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID) {
                authenticator.displayName = identityProviderConfig.getOverriddenAuthenticatorDisplayName(
                    authenticator.id, authenticator.displayName);
            }

            if (authenticator.name === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR) {
                recoveryAuth.push(authenticator);
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
        setRecoveryAuthenticators(recoveryAuth);
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
     * @param authenticator - Authenticator to be added.
     * @param options - Current step options
     *
     * @returns True or false - Is step addition is valid or not.
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

        // If the added option is EIDP, even-though the authenticator is same,
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
     * @param stepIndex - Step index.
     * @param authenticatorId - Id of the authenticator.
     */
    const updateAuthenticationStep = (stepIndex: number, authenticatorId: string): void => {
        const authenticators: GenericAuthenticatorInterface[] = [
            ...localAuthenticators,
            ...enterpriseAuthenticators,
            ...socialAuthenticators,
            ...secondFactorAuthenticators,
            ...recoveryAuthenticators
        ];

        const authenticator: GenericAuthenticatorInterface = authenticators
            .find((item: GenericAuthenticatorInterface) => item.id === authenticatorId);

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
        const isFirstFactorAuth: boolean =
            ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS.includes(authenticatorId);
        const isSecondFactorAuth: boolean =
            ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS.includes(authenticatorId);
        const isValidSecondFactorAddition: boolean = SignInMethodUtils.isSecondFactorAdditionValid(
            authenticator?.defaultAuthenticator?.authenticatorId,
            stepIndex,
            steps
        );

        if (ApplicationManagementConstants.HANDLER_AUTHENTICATORS.includes(authenticatorId)) {
            setShowHandlerDisclaimerModal(true);
        }

        // If the adding option is a second factor, and if the adding step is the first or there are no
        // first factor authenticators in previous steps, show a warning and stop adding the option.
        if (
            isSecondFactorAuth
            && (
                (!isFirstFactorAuth && (stepIndex === 0 || !isValidSecondFactorAddition))
                || (isFirstFactorAuth && stepIndex !== 0 && !isValidSecondFactorAddition)
            )
        )  {

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

        if(applicationConfig.signInMethod.authenticatorSelection
            .customAuthenticatorAdditionValidation && !applicationConfig.signInMethod.authenticatorSelection
            .customAuthenticatorAdditionValidation(authenticatorId, stepIndex, dispatch)) {
            return;
        }

        if (!isValid) {
            return;
        }

        const defaultAuthenticator: FederatedAuthenticatorInterface = authenticator.authenticators.find(
            (item: FederatedAuthenticatorInterface) =>
                item.authenticatorId === authenticator.defaultAuthenticator.authenticatorId
        );

        steps[ stepIndex ].options.push({
            authenticator: defaultAuthenticator.name,
            idp: authenticator.idp
        });

        handleIdentifierFirstAsSubjectAttributeStep();

        setAuthenticationSteps(steps);
    };

    /**
     * Handles step option delete action.
     *
     * @param stepIndex - Index of the step.
     * @param optionIndex - Index of the option.
     */
    const handleStepOptionDelete = (stepIndex: number, optionIndex: number): void => {
        const steps: AuthenticationStepInterface[] = [ ...authenticationSteps ];

        const currentStep: AuthenticationStepInterface = steps[stepIndex];
        const currentAuthenticator: string = currentStep.options[optionIndex].authenticator;

        // Do not allow deleting SSO authenticator if the application is shared.
        if (stepIndex === 0
            && currentAuthenticator === AuthenticatorManagementConstants.ORGANIZATION_SSO_AUTHENTICATOR_NAME
            && isApplicationShared) {
            dispatch(
                addAlert({
                    description: t("console:develop.features.applications.notifications" +
                        ".authenticationStepDeleteErrorDueToAppShared.genericError.description"),
                    level: AlertLevels.WARNING,
                    message: t("console:develop.features.applications.notifications" +
                        ".authenticationStepDeleteErrorDueToAppShared.genericError.message")
                })
            );

            return;
        }

        // check whether the authenticator to be deleted is a 2FA
        if (currentAuthenticator === IdentityProviderManagementConstants.TOTP_AUTHENTICATOR ||
            currentAuthenticator === IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR ||
            currentAuthenticator === IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR ) {

            // check whether the current step has the backup code authenticator
            if(SignInMethodUtils.hasSpecificAuthenticatorInCurrentStep(
                IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR, stepIndex, steps
            )) {
                // if there is only one 2FA in the step, prompt delete confirmation modal
                if(SignInMethodUtils.countTwoFactorAuthenticatorsInCurrentStep(stepIndex, steps) < 2) {
                    currentStep.options.map((option: AuthenticatorInterface, optionIndex: number) => {
                        if (option.authenticator === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR) {
                            setBackupCodeRemoveIndex(optionIndex);
                        }
                    });
                    setAuthenticatorRemoveIndex(optionIndex);
                    setAuthenticatorRemoveStep(stepIndex);
                    setShowBackupCodeRemoveConfirmModal(true);

                    return;
                }
            }
        }

        const [
            leftSideSteps,
            rightSideSteps
        ]: AuthenticationStepInterface[][] = SignInMethodUtils.getLeftAndRightSideSteps(stepIndex, steps);

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
                    || (!onlySecondFactorsRequiringHandlersOnRight && firstFactorsInTheStep <= 1
                    && isDeletingOptionFirstFactor)) {

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
     * @param stepIndex - Index of the step.
     * @param optionIndex - Index of the option.
     * @param authenticator - Selected authenticator.
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
     * @param stepIndex - Authentication step.
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

        // If there are second factors on the right side from the step that is to be deleted,
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
        steps.forEach((step: AuthenticationStepInterface, index: number) => (step.id = index + 1));

        setAuthenticationSteps(steps);
        updateSteps(false);
    };

    /**
     * Handles the addition of new authentication step.
     */
    const handleAuthenticationStepAdd = (): void => {
        const steps: AuthenticationStepInterface[] = [ ...authenticationSteps ];

        handleIdentifierFirstAsSubjectAttributeStep();

        steps.push({
            id: steps.length + 1,
            options: []
        });

        eventPublisher.publish("application-sign-in-method-click-add-new-step");
        setAuthenticationSteps(steps);
        updateSteps(true);
    };

    /**
     * Check if the options include the Identifier First as an authenticator.
     *
     * @param options - Authenticator options.
     * @returns true or false - Options include Identifier First or not.
     */
    const handleIdentifierFirstInStep = (options: AuthenticatorInterface[]): boolean =>
        options.some(
            (option: AuthenticatorInterface) =>
                option.authenticator === IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR
        );

    /**
     * Handles the subject identifier value onchange event.
     *
     * @param stepIndex - Step index.
     */
    const handleSubjectRetrievalStepChange = (stepIndex: number): void => {

        setSubjectStepId(stepIndex);
    };

    /**
     * Handles the attribute identifier value onchange event.
     *
     * @param stepIndex - Step index.
     */
    const handleAttributeRetrievalStepChange = (stepIndex: number): void => {

        setAttributeStepId(stepIndex);
    };

    /**
     * Validates if the step deletion is valid.
     *
     * @returns True or false - Is steps are valid or not.
     */
    const validateSteps = (): boolean => {
        const steps: AuthenticationStepInterface[] = [ ...authenticationSteps ];

        const found: AuthenticationStepInterface = steps.find((step: AuthenticationStepInterface) =>
            isEmpty(step.options));

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

        // Don't allow identifier first being with another authenticator in the 1FA flow.
        if (
            steps.length === 1
            && steps[0].options.length > 1
            && handleIdentifierFirstInStep(steps[0].options)
        ) {
            dispatch(
                addAlert({
                    description: t(
                        "console:develop.features.applications.notifications.updateIdentifierFirstInFirstStepError" +
                        ".description"
                    ),
                    level: AlertLevels.WARNING,
                    message: t(
                        "console:develop.features.applications.notifications.updateIdentifierFirstInFirstStepError" +
                        ".message"
                    )
                })
            );

            return false;
        }

        // Validate whether the subject and attribute identifier steps are selected.
        if (!(subjectStepId > 0) || !(attributeStepId > 0)) {
            dispatch(addAlert({
                description: t("console:develop.features.applications.notifications.updateAuthenticationFlow" +
                ".invalidStepIds.description"),
                level: AlertLevels.WARNING,
                message: t("console:develop.features.applications.notifications.updateAuthenticationFlow" +
                ".invalidStepIds.message")
            }));

            return false;
        }

        return true;
    };

    /**
     * Shows a disclaimer to users when a handler is added.
     * @returns Handler disclaimer modal.
     */
    const renderHandlerDisclaimerModal = (): ReactElement => (

        <ConfirmationModal
            onClose={ () => setShowHandlerDisclaimerModal(false) }
            type="warning"
            open={ showHandlerDisclaimerModal }
            primaryAction={ t("common:confirm") }
            secondaryAction={ t("common:cancel") }
            onPrimaryActionClick={ () => setShowHandlerDisclaimerModal(false) }
            data-componentid={ `${ componentId }-handler-disclaimer-modal` }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header
                data-componentid={ `${ componentId }-delete-confirmation-modal-header` }
            >
                { t("console:develop.features.applications.confirmations.handlerAuthenticatorAddition.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Message
                attached
                warning
                data-componentid={ `${ componentId }-delete-confirmation-modal-message` }
            >
                { t("console:develop.features.applications.confirmations.handlerAuthenticatorAddition.message") }
            </ConfirmationModal.Message>
            <ConfirmationModal.Content
                data-componentid={ `${ componentId }-delete-confirmation-modal-content` }
            >
                { t("console:develop.features.applications.confirmations.handlerAuthenticatorAddition.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * Render add authenticator modal.
     *
     * @returns Authenticator add modal.
     */
    const renderAuthenticatorAddModal = (): ReactElement => {

        return (
            <AddAuthenticatorModal
                authenticationSteps={ authenticationSteps }
                allowSocialLoginAddition={ hasRequiredScopes(featureConfig?.identityProviders,
                    featureConfig?.identityProviders?.scopes?.create, allowedScopes) }
                currentStep={ authenticatorAddStep }
                open={ showAuthenticatorAddModal }
                onModalSubmit={ (authenticators: GenericAuthenticatorInterface[]) => {
                    authenticators.map((authenticator: GenericAuthenticatorInterface) => {
                        updateAuthenticationStep(authenticatorAddStep, authenticator.id);
                    });

                    setShowAuthenticatorAddModal(false);
                } }
                onClose={ () => setShowAuthenticatorAddModal(false) }
                header={
                    t("console:develop.features.applications.edit.sections.signOnMethod.sections.authenticationFlow." +
                        "sections.stepBased.addAuthenticatorModal.heading")
                }
                authenticators={ {
                    enterprise: enterpriseAuthenticators,
                    local: localAuthenticators,
                    recovery: recoveryAuthenticators,
                    secondFactor: secondFactorAuthenticators,
                    social: socialAuthenticators
                } }
                showStepSelector={ false }
                stepCount={ authenticationSteps.length }
                onIDPCreateWizardTrigger={ onIDPCreateWizardTrigger }
            />
        );
    };

    /**
     * Prompts user with a confirmation modal to remove the backup code authenticator,
     * if the authenticator to be deleted is coupled with the backup code authenticator.
     *
     * @returns Delete confirmation modal.
     */
    const renderBackupCodeRemoveConfirmationModal = (): ReactElement => (
        <ConfirmationModal
            onClose={ () => setShowBackupCodeRemoveConfirmModal(false) }
            type="negative"
            open={ showBackupCodeRemoveConfirmModal }
            primaryAction={ t("common:continue") }
            secondaryAction={ t("common:cancel") }
            onPrimaryActionClick={ () => {
                handleStepOptionDelete(authenticatorRemoveStep, backupCodeRemoveIndex);
                handleStepOptionDelete(authenticatorRemoveStep, authenticatorRemoveIndex);
                setShowBackupCodeRemoveConfirmModal(false);
            } }
            onSecondaryActionClick={ () => setShowBackupCodeRemoveConfirmModal(false) }
            data-componentid={ `${ componentId }-backupcode-delete-confirm-modal` }
            closeOnDimmerClick={ false }
        >
            <ConfirmationModal.Header
                data-componentid={ `${ componentId }-backupcode-delete-confirmation-modal-header` }
            >
                { t("console:develop.features.applications.confirmations.backupCodeAuthenticatorDelete.header") }
            </ConfirmationModal.Header>
            <ConfirmationModal.Content
                data-componentid={ `${ componentId }-backupcode-delete-confirmation-modal-content` }
            >
                { t("console:develop.features.applications.confirmations.backupCodeAuthenticatorDelete.content") }
            </ConfirmationModal.Content>
        </ConfirmationModal>
    );

    /**
     * Subject or attribute step needs to be increased when the identifier first authenticator
     * is added to a step, and it's set as subject or attribute step.
     * This handles the related validations.
     */
    const handleIdentifierFirstAsSubjectAttributeStep = (): void => {

        authenticationSteps.forEach((step: AuthenticationStepInterface) => {
            if (handleIdentifierFirstInStep(step.options)) {
                if (subjectStepId === step.id && step.id < authenticationSteps.length) {
                    setSubjectStepId(subjectStepId + 1);
                }
                if (attributeStepId === step.id && step.id < authenticationSteps.length) {
                    setAttributeStepId(attributeStepId + 1);
                }
            }
        });
    };

    return (
        <div className="authentication-flow-wrapper" data-componentid={ componentId }>
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
                            ? authenticationSteps.map((step: AuthenticationStepInterface, stepIndex: number) => (
                                <Fragment key={ stepIndex }>
                                    <AuthenticationStep
                                        authenticators={ [
                                            ...localAuthenticators,
                                            ...enterpriseAuthenticators,
                                            ...socialAuthenticators,
                                            ...secondFactorAuthenticators,
                                            ...recoveryAuthenticators
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
                                        showStepDeleteAction={ authenticationSteps.length > 1 }
                                        step={ step }
                                        stepIndex={ stepIndex }
                                        readOnly={ readOnly }
                                        subjectStepId={ subjectStepId }
                                        attributeStepId={ attributeStepId }
                                        onAttributeCheckboxChange={ handleAttributeRetrievalStepChange }
                                        onSubjectCheckboxChange={ handleSubjectRetrievalStepChange }
                                        data-componentid={ `${ componentId }-authentication-step-${ stepIndex }` }
                                        updateAuthenticationStep={ updateAuthenticationStep }
                                        showStepMeta
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
            { showBackupCodeRemoveConfirmModal && renderBackupCodeRemoveConfirmationModal() }
        </div>
    );
};

/**
 * Default props for the step based flow component.
 */
StepBasedFlow.defaultProps = {
    "data-componentid": "step-based-flow"
};
