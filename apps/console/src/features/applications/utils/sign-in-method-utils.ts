/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 *
 */

import flatten from "lodash-es/flatten";
import {
    GenericAuthenticatorInterface,
    IdentityProviderManagementConstants,
    ProvisioningInterface
} from "../../identity-providers";
import { ApplicationManagementConstants } from "../constants";
import { AuthenticationStepInterface } from "../models";

/**
 * Utility class for Sign In Method.
 */
export class SignInMethodUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideConstructor
     */
    private constructor() { }

    /**
     * Splits the steps to two parts based on the passed in index.
     *
     * @param {number} stepIndex - Index to split.
     * @param {AuthenticationStepInterface[]} steps - All steps.
     *
     * @return {AuthenticationStepInterface[][]}
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
     * @param {string[]} factors - Set of factors to check.
     * @param {[]} steps - Authentication steps.
     *
     * @return {boolean}
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
     * @param {string[]} factors - Set of factors to check.
     * @param {[]} steps - Authentication steps.
     *
     * @return {number}
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
      * @param {string[]} factors - Set of factors to check.
      * @param {[]} steps - Authentication steps.
      *
      * @return {boolean}
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
     * @param {string[]} factors - Set of factors to check.
     * @param {[]} steps - Authentication steps.
     *
     * @return {number}
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
     * @param {string} authenticatorId - ID of the prospective authenticator to be added.
     * @param {number} addingStep - Step to add the authenticator.
     * @param {AuthenticationStepInterface[]} steps - Authenticator steps.
     *
     * @return {boolean}
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

        return this.hasSpecificFactorsInSteps(ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
            leftSideSteps);
    }

    /**
     * This method decides if the magic-link authenticator can be added to the current step.
     *
     * @param {number} currentStep The current step.
     * @param {AuthenticationStepInterface} authenticationSteps The authentication steps.
     *
     * @returns {boolean}
     */
    public static isMagicLinkAuthenticatorValid(currentStep: number,
        authenticationSteps: AuthenticationStepInterface[]): boolean {
        // The magic link authenticator can only be added to the second step.
        if (currentStep !== 1) {
            return false;
        }

        const identifierFirst = authenticationSteps[ 0 ].options.find(
            authenticator =>
                authenticator.authenticator === IdentityProviderManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR);

        // The first step should have the identifier first authenticator.
        if (authenticationSteps.length > 1 && !identifierFirst) {
            return false;
        }

        return true;
    }

    /**
     * Checks if a identifier first or basic auth already exists. Returns false if it does or tru otherwise.
     *
     * @param {number} currentStep The current step.
     * @param {AuthenticationStepInterface} authenticationSteps The authentication steps.
     *
     * @returns {boolean}
     */
    public static isFirstFactorValid(currentStep: number, authenticationSteps: AuthenticationStepInterface[]): boolean {
        const firstFactor = authenticationSteps[currentStep].options.find(
            (authenticator) =>
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
         *    We have an array of {@code federatedAuthenticators} and
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

            const allOptions = flatten(
                steps
                    .filter(({ id }) => id === subjectStepId)
                    .map(({ options }) => options)
            );

            /**
             * Checks whether all auth steps has at least 1 or more
             * proxied (JIT disabled) handlers. If yes then there
             * can be a conflict.
             */
            const jitDisabledIdPsInSubjectIdStep =
                // Extract all the IdP names.
                [ ...(new Set(allOptions.map(({ idp }) => idp))) ]
                    // Find the authenticator model.
                    .map((idpName) => federatedAuthenticators.find(({ name }) => name === idpName))
                    // Remove all the {@code undefined|null} ones please.
                    .filter(Boolean)
                    // Find all the JIT disabled ones in the subject identifier step.
                    .filter((auth: GenericAuthenticatorWithProvisioningConfigs) => (
                        !auth?.provisioning?.jit?.isEnabled
                    )) as GenericAuthenticatorWithProvisioningConfigs[];

            /** Start solving the 2nd problem **/

            /**
             * This means that we have only one step, and implies =>
             * no MFA is being configured. This is because the interface only
             * allows MFA to be added to step 2 or beyond.
             */
            if (steps.length < 2) {
                return {
                    conflicting: false,
                    idpList: []
                };
            }

            const allOtherOptions = flatten(
                steps
                    .slice(1) // Remove the first element (subject identifier step)
                    .map(({ options }) => options) // Get all the options.
            );

            const LOCAL_MFA_OPTIONS = new Set(
                ApplicationManagementConstants.SECOND_FACTOR_AUTHENTICATORS
            );

            /**
             * If this list contains one or more items it means
             * somewhere in the sequence we have MFA configured.
             */
            const configuredForwardMFA = allOtherOptions.filter(
                (op) => LOCAL_MFA_OPTIONS.has(op.authenticator)
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
