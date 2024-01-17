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

import flatten from "lodash-es/flatten";
import {
    IdentityProviderManagementConstants
} from "../../identity-providers/constants/identity-provider-management-constants";
import {
    GenericAuthenticatorInterface,
    ProvisioningInterface
} from "../../identity-providers/models/identity-provider";
import { ApplicationManagementConstants } from "../constants";
import {
    AuthenticationStepInterface,
    AuthenticatorInterface,
    FederatedConflictWithSMSOTPArgsInterface,
    FederatedConflictWithSMSOTPReturnValueInterface
} from "../models";

/**
 * Utility class for Sign In Method.
 */
export class SignInMethodUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    /**
     * Splits the steps to two parts based on the passed in index.
     *
     * @param stepIndex - Index to split.
     * @param  steps - All steps.
     *
     * @returns AuthenticationStepInterface[][]
     */
    public static getLeftAndRightSideSteps = (stepIndex: number,
        steps: AuthenticationStepInterface[]
    ): AuthenticationStepInterface[][] => {

        const leftSideSteps: AuthenticationStepInterface[] = (stepIndex !== 0)
            ? steps.slice(0, stepIndex)
            : [];

        const rightSideSteps: AuthenticationStepInterface[] = ((stepIndex + 1) in steps)
            ? steps.slice(stepIndex + 1)
            : [];

        const nextStep: AuthenticationStepInterface[] = ((stepIndex + 1) in steps)
            ? steps.slice(stepIndex + 1, stepIndex + 2)
            : [];

        return [ leftSideSteps, rightSideSteps, nextStep ];
    };

    /**
     * Checks if at least on the passed in factors are available in the in steps.
     *
     * @param factors - Set of factors to check.
     * @param steps - Authentication steps.
     *
     * @returns boolean
     */
    public static hasSpecificFactorsInSteps = (factors: string[], steps: AuthenticationStepInterface[]): boolean => {

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
     * Returns the number of the immediate step having at least one of the passed in factors.
     *
     * @param factors - Set of factors to check.
     * @param steps - Authentication steps.
     *
     * @returns number
     */
    public static getImmediateStepHavingSpecificFactors = (factors: string[],
        steps: AuthenticationStepInterface[]): number => {

        let isFound: boolean = false;
        let foundInStep: number = -1;

        for (const [ index, step ] of steps.entries()) {
            for (const option of step.options) {
                if (factors.includes(option.authenticator)) {
                    isFound = true;
                    foundInStep = index;

                    break;
                }
            }

            if (isFound) {
                break;
            }
        }

        return foundInStep;
    };

    /**
      * Checks if immediate step is having at least one of the passed factors.
      *
      * @param factors - Set of factors to check.
      * @param steps - Authentication steps.
      *
      * @returns boolean
      */
      public static checkImmediateStepHavingSpecificFactors = (factors: string[],
          steps: AuthenticationStepInterface[]): boolean => {

          let isFound: boolean = false;

          for (const [ , step ] of steps.entries()) {
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
     * Counts the occurrence of a specific factors in the passed in steps.
     *
     * @param factors - Set of factors to check.
     * @param steps - Authentication steps.
     *
     * @returns number
     */
    public static countSpecificFactorInSteps = (factors: string[], steps: AuthenticationStepInterface[]): number => {

        let count: number = 0;

        for (const step of steps) {
            for (const option of step.options) {
                if (factors.includes(option.authenticator)) {
                    count++;
                }
            }
        }

        return count;
    };

    /**
     * Checks if a certain second factor authenticator is a valid addition.
     *
     * @param authenticatorId - ID of the prospective authenticator to be added.
     * @param addingStep - Step to add the authenticator.
     * @param steps - Authenticator steps.
     *
     * @returns boolean
     */
    public static isSecondFactorAdditionValid(authenticatorId: string, addingStep: number,
        steps: AuthenticationStepInterface[]): boolean {

        const [ leftSideSteps ]: AuthenticationStepInterface[][] = this.getLeftAndRightSideSteps(addingStep, steps);

        // If the adding authenticator is TOTP, evaluate if there are valid TOTP handlers in previous steps.
        if (authenticatorId === IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID) {
            return this.hasSpecificFactorsInSteps(ApplicationManagementConstants.TOTP_HANDLERS, leftSideSteps);
        }

        // If the adding authenticator is Email OTP, evaluate if there are valid handlers in previous steps.
        if (authenticatorId === IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID) {
            return this.hasSpecificFactorsInSteps(ApplicationManagementConstants.EMAIL_OTP_HANDLERS, leftSideSteps);
        }

        // If the adding authenticator is SMS OTP, evaluate if there are valid handlers in previous steps.
        if (authenticatorId === IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID) {
            return this.hasSpecificFactorsInSteps(ApplicationManagementConstants.SMS_OTP_HANDLERS, leftSideSteps);
        }

        return this.hasSpecificFactorsInSteps(ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
            leftSideSteps);
    }

    /**
     * Checks if a identifier first or basic auth already exists. Returns false if it does or tru otherwise.
     *
     * @param currentStep - The current step.
     * @param authenticationSteps - The authentication steps.
     *
     * @returns boolean
     */
    public static isFirstFactorValid(currentStep: number, authenticationSteps: AuthenticationStepInterface[]): boolean {
        const firstFactor: AuthenticatorInterface = authenticationSteps[currentStep]?.options?.find(
            (authenticator: AuthenticatorInterface) =>
                authenticator.authenticator === IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR ||
                authenticator.authenticator === IdentityProviderManagementConstants.BASIC_AUTHENTICATOR
        );

        return !firstFactor;
    }

    public static isConnectionsJITUPConflictWithMFA(
        args: ConnectionsJITUPConflictWithMFAArgs
    ): ConnectionsJITUPConflictWithMFAReturnValue {

        const { federatedAuthenticators, steps, subjectStepId } = args;

        /**
         * We are solving two problems:
         *
         * 1) Find out the subject step all federated IdPs:
         *    We have an array of `federatedAuthenticators` and
         *    the configured steps. We are only focused on federated
         *    authentications configured on subject identifier step and
         *    pick only the ones that have JIT disabled.
         *
         * 2) Walk forward and check other steps (step 2 and beyond) for MFA:
         *    The reason to do this check is that, MFA(s) are the
         *    authenticators that are affected by JIT disabled state.
         */

        try {
            /** Start solving the 1st problem **/
            const allOptions: AuthenticatorInterface[] = flatten(
                steps
                    .filter(({ id } : { id: number }) => id === subjectStepId)
                    .map(({ options } : { options: AuthenticatorInterface[] }) => options)
            );

            /**
             * Checks whether all auth steps has at least 1 or more
             * proxied (JIT disabled) handlers. If yes then there
             * can be a conflict.
             */
            const jitDisabledIdPsInSubjectIdStep: GenericAuthenticatorWithProvisioningConfigs[] =
                // Extract all the IdP names.
                [ ...(new Set((allOptions).map(({ idp } : { idp: string }) => idp))) ]
                    // Find the authenticator model.
                    .map((idpName: string) => federatedAuthenticators.find(
                        ({ name } : { name: string }) => name === idpName))
                    // Remove all the {@code undefined|null} ones please.
                    .filter(Boolean)
                    // Find all the JIT disabled ones in the subject identifier step.
                    .filter((auth: GenericAuthenticatorWithProvisioningConfigs) => (
                        !auth?.provisioning?.jit?.isEnabled
                    )) as GenericAuthenticatorWithProvisioningConfigs[];

            /** Start solving the 2nd problem **/

            /**
             * This means that we have only one step, and implies that
             * no MFA is being configured. This is because the interface only
             * allows MFA to be added to step 2 or beyond.
             */
            if (steps.length < 2) {
                return {
                    conflicting: false,
                    idpList: []
                };
            }

            const allOtherOptions: AuthenticatorInterface[] = flatten(
                steps
                    .slice(1) // Remove the first element (subject identifier step)
                    .map(({ options } : { options: AuthenticatorInterface[] }) => options) // Get all the options.
            );

            const LOCAL_MFA_OPTIONS: Set<string> = new Set(
                ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS
            );

            /**
             * If this list contains one or more items it means
             * somewhere in the sequence we have MFA configured.
             */
            const configuredForwardMFA: AuthenticatorInterface[] = allOtherOptions.filter(
                (op: AuthenticatorInterface) => LOCAL_MFA_OPTIONS.has(op.authenticator)
            );

            /** Finally compose the outcome **/
            return {
                conflicting: jitDisabledIdPsInSubjectIdStep.length > 0
                    && configuredForwardMFA.length > 0,
                idpList: jitDisabledIdPsInSubjectIdStep ?? []
            };

        } catch (e) {
            return {
                conflicting: false,
                idpList: []
            };
        }
    }

    public static isFederatedConflictWithSMSOTP(
        args: FederatedConflictWithSMSOTPArgsInterface
    ): FederatedConflictWithSMSOTPReturnValueInterface {

        const { federatedAuthenticators, steps, subjectStepId } = args;

        /**
         * We are solving two problems:
         *
         * 1) Find out the subject step all federated IdPs:
         *    We have an array of `federatedAuthenticators` and
         *    the configured steps. We are only focused on federated
         *    authentications configured on subject identifier step.
         *
         * 2) Walk forward and check other steps (step 2 and beyond) for SMS OTP:
         *    The reason to do this check is that, if SMS OTP is configured with
         *    a federated authenticator, Asgardeo should receive the user's profile
         *    (including the mobile number) configured on the federated IdP.
         */

        try {

            /** Start solving the 1st problem **/

            const allOptions: AuthenticatorInterface[] = flatten(
                steps
                    .filter(({ id } : { id: number }) => id === subjectStepId)
                    .map(({ options } : { options: AuthenticatorInterface[] }) => options)
            );

            /** Get the list of idps configured in the subject identifier step. **/

            // Extract all the IdP names.
            const uniqueIdpNames: string[] = [ ...(new Set((allOptions).map(({ idp } : { idp: string }) => idp))) ];
            // Find the authenticator model.
            const idPsInSubjectIdStep: GenericAuthenticatorInterface[] =
                uniqueIdpNames.map((idpName: string) => federatedAuthenticators
                    .find(({ name } : { name: string }) => name === idpName)).filter(Boolean);

            /** Start solving the 2nd problem. **/

            /**
             * This means that we have only one step, and implies =\>
             * no SMS OTP is being configured. This is because the interface only
             * allows SMS OTP to be added to step 2 or beyond.
             */
            if (steps.length < 2) {
                return {
                    conflicting: false,
                    idpList: []
                };
            }

            const allOtherOptions: AuthenticatorInterface[] = flatten(
                steps
                    .slice(1) // Remove the first element (subject identifier step)
                    .map(({ options } : { options: AuthenticatorInterface[] }) => options) // Get all the options.
            );

            const SMS_OTP_AUTHENTICATOR_NAME: string = "sms-otp-authenticator";
            const isSMSOTPConfigured: boolean = allOtherOptions.some(
                (op: AuthenticatorInterface) => op.authenticator === SMS_OTP_AUTHENTICATOR_NAME);

            /** Finally compose the outcome **/
            return {
                conflicting: idPsInSubjectIdStep.length > 0 && isSMSOTPConfigured,
                idpList: idPsInSubjectIdStep ?? []
            };

        } catch (e) {
            return {
                conflicting: false,
                idpList: []
            };
        }
    }

    /**
     * Returns the count of 2FAs in a certain authentication step.
     *
     * @param currentStep - The current step.
     * @param authenticationSteps - The authentication steps.
     *
     * @returns number of 2FAs
     */
    public static countTwoFactorAuthenticatorsInCurrentStep(
        currentStep: number, authenticationSteps: AuthenticationStepInterface[]
    ): number {
        const secondFactor: AuthenticatorInterface[] = authenticationSteps[currentStep].options.filter(
            (authenticator: AuthenticatorInterface) =>
                authenticator.authenticator === IdentityProviderManagementConstants.TOTP_AUTHENTICATOR ||
                authenticator.authenticator === IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR ||
                authenticator.authenticator === IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR
        );

        return secondFactor.length;
    }

    /**
     * Checks whether a specified authenticator is there in the current step.
     *
     * @param currentStep - The current step.
     * @param authenticationSteps - The authentication steps.
     *
     * @returns boolean
     */
    public static hasSpecificAuthenticatorInCurrentStep(
        authenticator: string, currentStep: number, authenticationSteps: AuthenticationStepInterface[]
    ): boolean {
        const hasAuthenticator: AuthenticatorInterface = authenticationSteps[currentStep].options.find(
            (el: AuthenticatorInterface) =>
                el.authenticator === authenticator
        );

        if (hasAuthenticator) {
            return true;
        } else {
            return false;
        }
    }
}

export type ConnectionsJITUPConflictWithMFAArgs = {
    /**
     * This parameter should only pass in the configured federated
     * authenticators under a tenant.
     */
    federatedAuthenticators: GenericAuthenticatorInterface[];
    /**
     * All the steps in the authentication sequence. Callee must pass
     * all the authentication options without skipping any.
     */
    steps: AuthenticationStepInterface[];
    subjectStepId: number;
};

export type GenericAuthenticatorWithProvisioningConfigs = GenericAuthenticatorInterface & {
    provisioning: ProvisioningInterface
};

export type ConnectionsJITUPConflictWithMFAReturnValue = {
    conflicting: boolean;
    idpList: GenericAuthenticatorWithProvisioningConfigs[];
};
