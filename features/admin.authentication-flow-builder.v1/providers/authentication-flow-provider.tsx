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

import { AlertLevels, FeatureAccessConfigInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import isEqual from "lodash-es/isEqual";
import React, { PropsWithChildren, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { useGetAdaptiveAuthTemplates } from "../../admin.applications.v1/api";
import { ApplicationManagementConstants } from "../../admin.applications.v1/constants/application-management";
import {
    ApplicationInterface,
    AuthenticationSequenceInterface,
    AuthenticationSequenceType,
    AuthenticationStepInterface,
    AuthenticatorInterface
} from "../../admin.applications.v1/models/application";
import { AdaptiveScriptUtils } from "../../admin.applications.v1/utils/adaptive-script-utils";
import { SignInMethodUtils } from "../../admin.applications.v1/utils/sign-in-method-utils";
import { AuthenticatorManagementConstants } from "../../admin.connections.v1/constants/autheticator-constants";
import { AuthenticatorMeta } from "../../admin.connections.v1/meta/authenticator-meta";
import { ConnectionInterface } from "../../admin.connections.v1/models/connection";
import { ConnectionsManagementUtils } from "../../admin.connections.v1/utils/connection-utils";
import useUIConfig from "../../admin.core.v1/hooks/use-ui-configs";
import { AppState } from "../../admin.core.v1/store";
import { applicationConfig } from "../../admin.extensions.v1";
import { identityProviderConfig } from "../../admin.extensions.v1/configs/identity-provider";
import {
    IdentityProviderManagementConstants
} from "../../admin.identity-providers.v1/constants/identity-provider-management-constants";
import {
    FederatedAuthenticatorInterface,
    GenericAuthenticatorInterface,
    SupportedAuthenticators
} from "../../admin.identity-providers.v1/models/identity-provider";
import { OrganizationType } from "../../admin.organizations.v1/constants";
import { LEGACY_EDITOR_FEATURE_ID, VISUAL_EDITOR_FEATURE_ID } from "../constants/editor-constants";
import AuthenticationFlowContext from "../context/authentication-flow-context";
import DefaultFlowConfigurationSequenceTemplate from "../data/flow-sequences/basic/default-sequence.json";
import { AuthenticationFlowBuilderModes } from "../models/flow-builder";
import { VisualEditorFlowNodeMetaInterface } from "../models/visual-editor";

/**
 * Props interface for the Authentication flow provider.
 */
export interface AuthenticationFlowProviderProps {
    /**
     * Editing application.
     */
    application: ApplicationInterface;
    /**
     * All authenticators in the system.
     */
    authenticators: GenericAuthenticatorInterface[][];
    /**
     * Callback to refetch the authenticators.
     */
    onAuthenticatorsRefetch: () => Promise<void>;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Callback to update the application details.
     */
    onUpdate: (id: string) => void;
    /**
     * Make the form read only.
     */
    readOnly?: boolean;
    /**
     * Flag to determine if the updated application a system application.
     */
    isSystemApplication?: boolean;
    /**
     * List of hidden authenticators.
     */
    hiddenAuthenticators: string[];
    /**
     * Authentication sequence passed from sign-on-methods-core component.
     */
    authenticationSequence: AuthenticationSequenceInterface;
}

/**
 * Authentication flow provider.
 *
 * @param props - Props for the client.
 * @returns Authentication flow provider.
 */
const AuthenticationFlowProvider = (props: PropsWithChildren<AuthenticationFlowProviderProps>): ReactElement => {
    const {
        application,
        authenticators,
        children,
        isSystemApplication,
        onUpdate,
        onAuthenticatorsRefetch,
        hiddenAuthenticators,
        authenticationSequence: initialAuthenticationSequence
    } = props;

    const featureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) => {
        return state.config?.ui?.features?.applications;
    });
    const orgType: OrganizationType = useSelector((state: AppState) => state?.organization?.organizationType);

    const { data: adaptiveAuthTemplates } = useGetAdaptiveAuthTemplates();
    const { UIConfig } = useUIConfig();

    const connectionResourcesUrl: string = UIConfig?.connectionResourcesUrl;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const [ authenticationSequence, setAuthenticationSequence ] = useState<AuthenticationSequenceInterface>(
        cloneDeep(application?.authenticationSequence)
    );
    const [ isConditionalAuthenticationEnabled, setIsConditionalAuthenticationEnabled ] = useState<boolean>(false);
    const [ filteredAuthenticators, setFilteredAuthenticators ] = useState<{
        enterprise: GenericAuthenticatorInterface[];
        local: GenericAuthenticatorInterface[];
        recovery: GenericAuthenticatorInterface[];
        secondFactor: GenericAuthenticatorInterface[];
        social: GenericAuthenticatorInterface[];
    }>({
        enterprise: [],
        local: [],
        recovery: [],
        secondFactor: [],
        social: []
    });
    const [ visualEditorFlowNodeMeta, setVisualEditorFlowNodeMeta ] = useState<VisualEditorFlowNodeMetaInterface>({
        height: 0,
        width: 0
    });

    /**
     * On mount, if the script is undefined, set it to a default script.
     */
    useEffect(() => {
        if (!application?.authenticationSequence?.script) {
            setAuthenticationSequence({
                ...authenticationSequence,
                script: defaultAuthenticationSequence.script
            });
        }
    }, []);

    /**
     * On initialAuthenticationSequence change,
     * if the authentication sequence passed is not empty, set it to the state.
     */
    useEffect(() => {
        if (initialAuthenticationSequence) {
            setAuthenticationSequence(initialAuthenticationSequence);
        }
    }, [ initialAuthenticationSequence ]);

    /**
     * Separates out the different authenticators to their relevant categories.
     */
    useEffect(() => {
        if (!authenticators || !Array.isArray(authenticators) || !authenticators[0] || !authenticators[1]) {
            return;
        }

        const localAuthenticators: GenericAuthenticatorInterface[] = authenticators[0];
        const federatedAuthenticators: GenericAuthenticatorInterface[] = authenticators[1];
        const socialAuthenticators: GenericAuthenticatorInterface[] = [];
        const enterpriseAuthenticators: GenericAuthenticatorInterface[] = [];
        const secondFactorAuthenticators: GenericAuthenticatorInterface[] = [];
        const recoveryAuthenticators: GenericAuthenticatorInterface[] = [];

        const moderatedLocalAuthenticators: GenericAuthenticatorInterface[] = [];

        localAuthenticators.forEach((authenticator: GenericAuthenticatorInterface) => {
            if (authenticator.id === IdentityProviderManagementConstants.FIDO_AUTHENTICATOR_ID) {
                authenticator.displayName = identityProviderConfig.getOverriddenAuthenticatorDisplayName(
                    authenticator.id,
                    authenticator.displayName
                );
            }

            if (authenticator.name === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR) {
                recoveryAuthenticators.push(authenticator);
            } else if (ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS.includes(authenticator.id)) {
                secondFactorAuthenticators.push(authenticator);
            } else {
                moderatedLocalAuthenticators.push(authenticator);
            }
        });

        federatedAuthenticators.forEach((authenticator: GenericAuthenticatorInterface) => {
            authenticator.image = authenticator.defaultAuthenticator?.authenticatorId ===
            AuthenticatorManagementConstants.ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID
                ? AuthenticatorMeta.getAuthenticatorIcon(
                    (authenticator as ConnectionInterface)
                        .federatedAuthenticators?.defaultAuthenticatorId
                            ?? authenticator.defaultAuthenticator?.authenticatorId)
                : ConnectionsManagementUtils
                    .resolveConnectionResourcePath(connectionResourcesUrl, authenticator.image);

            if (
                ApplicationManagementConstants.SOCIAL_AUTHENTICATORS.includes(
                    authenticator.defaultAuthenticator.authenticatorId
                )
            ) {
                socialAuthenticators.push(authenticator);
            } else {
                enterpriseAuthenticators.push(authenticator);
            }
        });

        setFilteredAuthenticators({
            enterprise: enterpriseAuthenticators,
            local: moderatedLocalAuthenticators,
            recovery: recoveryAuthenticators,
            secondFactor: secondFactorAuthenticators,
            social: socialAuthenticators
        });
    }, [ authenticators ]);

    const isAdaptiveAuthAvailable: boolean = useMemo(() => {
        if (orgType === OrganizationType.SUBORGANIZATION) {
            return false;
        }

        return isAdaptiveAuthenticationAvailable;
    }, [ isAdaptiveAuthenticationAvailable, orgType ]);

    const isVisualEditorEnabled: boolean = useMemo(() => {
        const disabledFeatures: string[] = featureConfig?.disabledFeatures;

        return !disabledFeatures.includes(VISUAL_EDITOR_FEATURE_ID);
    }, [ featureConfig ]);

    const isLegacyEditorEnabled: boolean = useMemo(() => {
        const disabledFeatures: string[] = featureConfig?.disabledFeatures;

        return !disabledFeatures.includes(LEGACY_EDITOR_FEATURE_ID);
    }, [ featureConfig ]);

    const isValidAuthenticationFlow: boolean = useMemo(() => {
        const stepsHaveOptions: boolean = authenticationSequence?.steps?.every(
            (step: AuthenticationStepInterface) => !isEmpty(step.options)
        );

        return stepsHaveOptions;
    }, [ authenticationSequence ]);

    /**
     * Handles the addition of new authentication step.
     */
    const addSignInStep = (): void => {
        const steps: AuthenticationStepInterface[] = [ ...authenticationSequence?.steps ];
        let script: string = authenticationSequence.script;

        // If the script is default, append a new `executeStep(id);`.
        if (AdaptiveScriptUtils.isDefaultScript(script, steps.length)) {
            script = AdaptiveScriptUtils.generateScript(steps.length + 2).join("\n");
        }

        steps.push({
            id: steps.length + 1,
            options: []
        });

        // eventPublisher.publish("application-sign-in-method-click-add-new-step");
        setAuthenticationSequence({
            ...authenticationSequence,
            script,
            steps
        });
    };

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
        let isDuplicate: boolean = options?.some((option: AuthenticatorInterface) => {
            return option.authenticator === authenticator?.defaultAuthenticator?.name;
        });

        const isEIDP: boolean = ApplicationManagementConstants.EIDP_AUTHENTICATORS.includes(
            authenticator?.defaultAuthenticator?.name as SupportedAuthenticators
        );

        // If the added option is EIDP, even-though the authenticator is same,
        // we need to check if it's the same IDP. If it is, then mark as duplicate.
        if (isDuplicate && isEIDP) {
            isDuplicate = options?.some((option: AuthenticatorInterface) => {
                return option.idp === authenticator?.idp;
            });
        }

        if (isDuplicate) {
            dispatch(
                addAlert({
                    description: t(
                        "applications:notifications.duplicateAuthenticationStep" +
                            ".genericError.description"
                    ),
                    level: AlertLevels.WARNING,
                    message: t(
                        "applications:notifications.duplicateAuthenticationStep" +
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
    const addSignInOption = (stepIndex: number, authenticatorId: string): void => {
        const authenticators: GenericAuthenticatorInterface[] = Object.values(filteredAuthenticators).flat();

        const authenticator: GenericAuthenticatorInterface = authenticators.find(
            (item: GenericAuthenticatorInterface) => {
                return item.id === authenticatorId || item.defaultAuthenticator?.name === authenticatorId;
            }
        );

        if (!authenticator) {
            return;
        }

        const steps: AuthenticationStepInterface[] = [ ...authenticationSequence?.steps ];

        const isValid: boolean = validateStepAddition(authenticator, steps[stepIndex]?.options);

        if (ApplicationManagementConstants.HANDLER_AUTHENTICATORS.includes(authenticatorId)) {
            // TODO: setShowHandlerDisclaimerModal(true);
        }

        const isFirstFactorAuth: boolean =
            ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS.includes(authenticatorId);
        const isSecondFactorAuth: boolean =
            ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS.includes(authenticatorId);
        const isValidSecondFactorAddition: boolean = SignInMethodUtils.isSecondFactorAdditionValid(
            authenticator.defaultAuthenticator.authenticatorId,
            stepIndex,
            steps
        );

        // If the adding option is a second factor, and if the adding step is the first or there are no
        // first factor authenticators in previous steps, show a warning and stop adding the option.
        if (
            isSecondFactorAuth
            && (
                (!isFirstFactorAuth && (stepIndex === 0 || !isValidSecondFactorAddition))
                || (isFirstFactorAuth && stepIndex !== 0 && !isValidSecondFactorAddition)
            )
        ) {
            dispatch(
                addAlert({
                    description: t(
                        "applications:notifications.secondFactorAuthenticatorToFirstStep" +
                            ".genericError.description"
                    ),
                    level: AlertLevels.WARNING,
                    message: t(
                        "applications:notifications.secondFactorAuthenticatorToFirstStep" +
                            ".genericError.message"
                    )
                })
            );

            return;
        }

        if (
            applicationConfig.signInMethod.authenticatorSelection.customAuthenticatorAdditionValidation &&
            !applicationConfig.signInMethod.authenticatorSelection.customAuthenticatorAdditionValidation(
                authenticatorId,
                stepIndex,
                dispatch
            )
        ) {
            return;
        }

        if (!isValid) {
            return;
        }

        const defaultAuthenticator: FederatedAuthenticatorInterface = authenticator.authenticators.find(
            (item: FederatedAuthenticatorInterface) =>
                item.authenticatorId === authenticator.defaultAuthenticator.authenticatorId
        );

        steps[stepIndex]?.options?.push({
            authenticator: defaultAuthenticator.name,
            idp: authenticator.idp
        });

        setAuthenticationSequence({ ...authenticationSequence, steps });
    };

    /**
     * Handles step delete action.
     *
     * @param stepIndex - Authentication step.
     */
    const removeSignInStep = (stepIndex: number): void => {
        const steps: AuthenticationStepInterface[] = [ ...authenticationSequence?.steps ];
        let script: string = authenticationSequence.script;

        if (steps.length <= 1) {
            dispatch(
                addAlert({
                    description: t(
                        "applications:notifications.authenticationStepMin" +
                            ".genericError.description"
                    ),
                    level: AlertLevels.WARNING,
                    message: t(
                        "applications:notifications.authenticationStepMin.genericError" +
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
            ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS,
            rightSideSteps
        );
        const noOfTOTPOnRight: number = SignInMethodUtils.countSpecificFactorInSteps(
            [ IdentityProviderManagementConstants.TOTP_AUTHENTICATOR ],
            rightSideSteps
        );
        const noOfFactorsOnRight: number =
            SignInMethodUtils.countSpecificFactorInSteps(
                ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS,
                rightSideSteps
            ) +
            SignInMethodUtils.countSpecificFactorInSteps(
                ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
                rightSideSteps
            );
        const onlyTOTPOnRight: boolean = noOfFactorsOnRight === noOfTOTPOnRight;

        // If there are second factors on the right side from the step that is to be deleted,
        // Check if there are first factors on the left or if there is an immediate first factor on right.
        // If not, do not delete the step.
        if (containSecondFactorOnRight) {
            const containProperHandlersOnLeft: boolean = onlyTOTPOnRight
                ? SignInMethodUtils.hasSpecificFactorsInSteps(
                    ApplicationManagementConstants.TOTP_HANDLERS,
                    leftSideSteps
                )
                : SignInMethodUtils.hasSpecificFactorsInSteps(
                    ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
                    leftSideSteps
                ) ||
                  SignInMethodUtils.checkImmediateStepHavingSpecificFactors(
                      ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
                      nextStep
                  );

            if (!containProperHandlersOnLeft) {
                dispatch(
                    addAlert({
                        description: t(
                            "applications:notifications." +
                                "authenticationStepDeleteErrorDueToSecondFactors.genericError.description"
                        ),
                        level: AlertLevels.WARNING,
                        message: t(
                            "applications:notifications." +
                                "authenticationStepDeleteErrorDueToSecondFactors.genericError.message"
                        )
                    })
                );

                return;
            }
        }

        // If the script is default, remove the last `executeStep(id);`.
        if (AdaptiveScriptUtils.isDefaultScript(script, steps.length)) {
            script = AdaptiveScriptUtils.generateScript(steps.length).join("\n");
        }

        // Remove the step.
        steps.splice(stepIndex, 1);

        // Rebuild the step ids.
        steps.forEach((step: AuthenticationStepInterface, index: number) => (step.id = index + 1));

        setAuthenticationSequence({ ...authenticationSequence, script, steps });
    };

    /**
     * Handles step option delete action.
     *
     * @param stepIndex - Index of the step.
     * @param optionIndex - Index of the option.
     */
    const removeSignInOption = (stepIndex: number, authenticatorId: string): void => {
        const steps: AuthenticationStepInterface[] = [ ...authenticationSequence?.steps ];

        const currentStep: AuthenticationStepInterface = steps[stepIndex];
        const currentAuthenticator: AuthenticatorInterface = currentStep.options?.find(
            (option: AuthenticatorInterface) => option.authenticator === authenticatorId
        );
        let backupCodeAuthenticatorIndex: number = -1;

        // If the authenticator to be deleted is a 2FA.
        if (
            currentAuthenticator?.authenticator === IdentityProviderManagementConstants.TOTP_AUTHENTICATOR ||
            currentAuthenticator?.authenticator === IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR ||
            currentAuthenticator?.authenticator === IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR
        ) {
            // Check whether the current step has the backup code authenticator
            if (SignInMethodUtils.hasSpecificAuthenticatorInCurrentStep(
                IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR, stepIndex, steps
            )) {
                // if there is only one 2FA in the step, prompt delete confirmation modal
                if (SignInMethodUtils.countTwoFactorAuthenticatorsInCurrentStep(stepIndex, steps) < 2) {
                    currentStep.options.map((option: AuthenticatorInterface, optionIndex: number) => {
                        if (option.authenticator === IdentityProviderManagementConstants.BACKUP_CODE_AUTHENTICATOR) {
                            backupCodeAuthenticatorIndex = optionIndex;
                        }
                    });
                }
            }
        }

        const [
            leftSideSteps,
            rightSideSteps
        ]: AuthenticationStepInterface[][] = SignInMethodUtils.getLeftAndRightSideSteps(stepIndex, steps);

        const containSecondFactorOnRight: boolean = SignInMethodUtils.hasSpecificFactorsInSteps(
            [ ...ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS ],
            rightSideSteps
        );

        // If there are second factor authenticators on the right, evaluate further.
        if (containSecondFactorOnRight) {
            const deletingOption: AuthenticatorInterface = { ...currentAuthenticator };
            const noOfSecondFactorsOnRight: number = SignInMethodUtils.countSpecificFactorInSteps(
                [ ...ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS ],
                rightSideSteps
            );
            const noOfSecondFactorsOnRightRequiringHandlers: number = SignInMethodUtils.countSpecificFactorInSteps(
                [
                    IdentityProviderManagementConstants.TOTP_AUTHENTICATOR,
                    IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR
                ],
                rightSideSteps
            );
            const onlySecondFactorsRequiringHandlersOnRight: boolean =
                noOfSecondFactorsOnRight === noOfSecondFactorsOnRightRequiringHandlers;
            const isDeletingOptionFirstFactor: boolean = [
                ...ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
                IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR
            ].includes(deletingOption.authenticator);
            const isDeletingOptionSecondFactorHandler: boolean = [
                ...ApplicationManagementConstants.TOTP_HANDLERS,
                ...ApplicationManagementConstants.EMAIL_OTP_HANDLERS
            ].includes(deletingOption.authenticator);
            const immediateStepHavingSpecificFactors: number = SignInMethodUtils.getImmediateStepHavingSpecificFactors(
                ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS,
                steps
            );

            // If the deleting step is a first factor, we have to check if there are other handlers that
            // could handle the second factors on the right.
            if (isDeletingOptionFirstFactor || isDeletingOptionSecondFactorHandler) {
                let firstFactorsInTheStep: number = 0;
                let secondFactorHandlersInTheStep: number = 0;

                steps[stepIndex].options.filter((option: AuthenticatorInterface) => {
                    if (ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS.includes(option.authenticator)) {
                        firstFactorsInTheStep++;
                    }

                    if (
                        [
                            ...ApplicationManagementConstants.TOTP_HANDLERS,
                            ...ApplicationManagementConstants.EMAIL_OTP_HANDLERS
                        ].includes(option.authenticator)
                    ) {
                        secondFactorHandlersInTheStep++;
                    }
                });

                // If the step that the deleting authenticator has no other first factors or handlers,
                // start evaluation other options.
                if (
                    (onlySecondFactorsRequiringHandlersOnRight && secondFactorHandlersInTheStep <= 1) ||
                    (!onlySecondFactorsRequiringHandlersOnRight && firstFactorsInTheStep <= 1)
                ) {
                    // If there is TOTP or Email OTP on the right, evaluate if the left side has necessary handlers.
                    // Else check if there are first factors on the left.
                    const containProperHandlersOnLeft: boolean = onlySecondFactorsRequiringHandlersOnRight
                        ? SignInMethodUtils.hasSpecificFactorsInSteps(
                            [
                                ...ApplicationManagementConstants.TOTP_HANDLERS,
                                ...ApplicationManagementConstants.EMAIL_OTP_HANDLERS
                            ],
                            leftSideSteps
                        )
                        : SignInMethodUtils.hasSpecificFactorsInSteps(
                            ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
                            leftSideSteps
                        );

                    // There are no possible authenticators on the left form the deleting option to handle the second
                    // factor authenticators. Evaluate....
                    if (!containProperHandlersOnLeft) {
                        const [
                            leftSideStepsFromImmediateSecondFactor
                        ]: AuthenticationStepInterface[][] = SignInMethodUtils.getLeftAndRightSideSteps(
                            immediateStepHavingSpecificFactors,
                            steps
                        );

                        // Try to find a proper handler in steps left of the immediate second factor.
                        const noOfProperHandlersOnLeft: number = onlySecondFactorsRequiringHandlersOnRight
                            ? SignInMethodUtils.countSpecificFactorInSteps(
                                [
                                    ...ApplicationManagementConstants.TOTP_HANDLERS,
                                    ...ApplicationManagementConstants.EMAIL_OTP_HANDLERS
                                ],
                                leftSideStepsFromImmediateSecondFactor
                            )
                            : SignInMethodUtils.countSpecificFactorInSteps(
                                ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
                                leftSideStepsFromImmediateSecondFactor
                            );

                        // If there are no other handlers, Show a warning and abort option delete.
                        if (noOfProperHandlersOnLeft <= 1) {
                            dispatchDeleteErrorNotification();

                            return;
                        }
                    }
                }
            }
        }

        if (backupCodeAuthenticatorIndex !== -1) {
            steps[stepIndex].options.splice(backupCodeAuthenticatorIndex, 1);
        }

        const optionIndex: number = steps[stepIndex].options.findIndex(
            (option: AuthenticatorInterface) => option.authenticator === authenticatorId
        );

        if (optionIndex !== -1) {
            steps[stepIndex].options.splice(optionIndex, 1);
        }

        setAuthenticationSequence({ ...authenticationSequence, steps });
    };

    const dispatchDeleteErrorNotification = (): void => {
        dispatch(
            addAlert({
                description: t(
                    "applications:notifications." +
                        "deleteOptionErrorDueToSecondFactorsOnRight.genericError.description"
                ),
                level: AlertLevels.WARNING,
                message: t(
                    "applications:notifications." +
                        "deleteOptionErrorDueToSecondFactorsOnRight.genericError.message"
                )
            })
        );
    };

    const updateAuthenticationSequence = (sequence: AuthenticationSequenceInterface): void => {
        setAuthenticationSequence({
            ...authenticationSequence,
            ...cloneDeep(sequence),
            type: AuthenticationSequenceType.USER_DEFINED
        });
    };

    const revertAuthenticationSequenceToDefault = (): void => {
        setAuthenticationSequence(defaultAuthenticationSequence);
    };

    const defaultAuthenticationSequence: AuthenticationSequenceInterface = useMemo(() => {
        return {
            ...DefaultFlowConfigurationSequenceTemplate,
            attributeStepId: 1,
            requestPathAuthenticators: [],
            script: AdaptiveScriptUtils.generateScript(2).join("\n"),
            subjectStepId: 1,
            type: AuthenticationSequenceType.DEFAULT
        };
    }, []);

    const isAuthenticationSequenceDefault: boolean = useMemo(() => {
        const { script: _, ...rest }: AuthenticationSequenceInterface = defaultAuthenticationSequence;

        return isEqual(rest, authenticationSequence);
    }, [ authenticationSequence, defaultAuthenticationSequence ]);

    const updateVisualEditorFlowNodeMeta: (
        stepId: number | string,
        meta: VisualEditorFlowNodeMetaInterface
    ) => void = useCallback((stepId: number | string, meta: VisualEditorFlowNodeMetaInterface) => {
        setVisualEditorFlowNodeMeta((previousMeta: VisualEditorFlowNodeMetaInterface) => ({
            ...previousMeta,
            [stepId]: meta
        }));
    }, []);

    /**
     * Handles the change of the active flow mode.
     *
     * @param mode - Active flow mode.
     */
    const onActiveFlowModeChange = (_: AuthenticationFlowBuilderModes): void => {
        // When the flow mode changes, assign any changes that happened to the authentication sequence from other modes.
        setAuthenticationSequence(application?.authenticationSequence);
    };

    return (
        <AuthenticationFlowContext.Provider
            value={ {
                adaptiveAuthTemplates,
                addSignInOption,
                addSignInStep,
                applicationMetaData: application,
                authenticationSequence,
                authenticators: filteredAuthenticators,
                defaultAuthenticationSequence,
                hiddenAuthenticators,
                isAdaptiveAuthAvailable,
                isAuthenticationSequenceDefault,
                isConditionalAuthenticationEnabled,
                isLegacyEditorEnabled,
                isSystemApplication,
                isValidAuthenticationFlow,
                isVisualEditorEnabled,
                onActiveFlowModeChange,
                onConditionalAuthenticationToggle: (enabled: boolean) => setIsConditionalAuthenticationEnabled(enabled),
                refetchApplication: () => onUpdate(application.id),
                refetchAuthenticators: onAuthenticatorsRefetch,
                removeSignInOption,
                removeSignInStep,
                revertAuthenticationSequenceToDefault,
                updateAuthenticationSequence,
                updateVisualEditorFlowNodeMeta,
                visualEditorFlowNodeMeta
            } }
        >
            { children }
        </AuthenticationFlowContext.Provider>
    );
};

export default AuthenticationFlowProvider;
