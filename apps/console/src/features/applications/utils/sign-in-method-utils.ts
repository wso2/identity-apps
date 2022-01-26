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
    AuthenticatorCategories,
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
     * Context
     * -------
     * When a application developer / someone with privileges adds federated IdP as a
     * step through the sign-in configurations to a targeted application and disable
     * JIT provisioning.
     *
     * Then, if they try to add a second factor authentication next system should not allow this
     * operation because with the proxy mode enabled; users aren't provisioned locally.
     * Therefore, making the second factor auth obsolete.
     *
     * ProxyMode === JIT Disabled ~ vice versa
     * {@code isProxyMode = !idpModel.provisioning.jit.isEnable}
     */
    public static isMFAConflictingWithProxyModeConfig(
        { addingStep, authenticators, steps, subjectStepId }: ProxyModeConflictTestArgs
    ): ProxyModeConflictTestReturn {

        /**
         * In authentication step 0 users aren't allowed to add
         * MFA whatsoever. So, this invariant skips this validation
         * if this is the step 0. 0 maps to id:1 in {@code steps}.
         */
        if (addingStep === 0)
            return { conflicting: false, idpList: [] };

        /**
         * More Context
         * ------------
         * Authentication steps are isolated. However, according to our requirement
         * the user should not be able to plug in MFA in any step if one or more
         * proxy mode identity providers were configured.
         *
         * If you check the interface, you'd see that you can only configure one
         * idp of the same category in a targeted step. But you can configure the
         * same idp in a different step. So, our validation MUST ensure that
         * cases like these also be handled properly. Also, a MFA instance can be
         * absolute first option in a authentication step (except 1 step).
         *
         * Clarification
         * -------------
         * For some reason {@code addingStep} starts from index 0 and {@code steps}
         * ids start from index 1. So, if you want to get the options in the previous
         * step in {@link steps} you just do {@code steps[addingStep]} and if you
         * want to get the options in current step you do {@code steps[addingStep + 1]}.
         */

        const allOptions = flatten(
            steps
                .filter(({ id }) => id === subjectStepId)
                .map(({ options }) => options)
        );

        const limit = ApplicationManagementConstants.MAXIMUM_NUMBER_OF_LIST_ITEMS_TO_SHOW_INSIDE_POPUP;

        try {

            /**
             * Checks whether all auth steps has at least 1 or more proxied
             * handlers. If yes then there's a conflict.
             */
            const result = [ ...(new Set(allOptions.map(({ idp }) => idp))) ] // Extract all the IdP names.
                .map((idpName) => authenticators.find(({ name }) => name === idpName)) // Find the authenticator model.
                .filter(Boolean) // Remove all the {@code undefined|null} ones please.
                .filter(({ category }) => (
                    category === AuthenticatorCategories.SOCIAL.toString() ||
                    category === AuthenticatorCategories.ENTERPRISE.toString()
                )) // Give me only ENTERPRISE and SOCIAL IdPs.
                .filter((auth: GenericAuthenticatorWithProvisioningConfigs) => {
                    return !auth?.provisioning?.jit?.isEnabled;
                }) as GenericAuthenticatorWithProvisioningConfigs[];

            return {
                // If there's one or more proxy mode enabled IdPs means we have a conflict.
                conflicting: result?.length > 0,
                idpList: result.slice(0, limit)
            };

        } catch (e) {
            return {
                conflicting: false,
                idpList: []
            };
        }

    }

}

export type ProxyModeConflictTestArgs = {
    authenticators: GenericAuthenticatorInterface[];
    authenticatorId: string;
    addingStep: number;
    steps: AuthenticationStepInterface[];
    subjectStepId: number;
    attributeStepId: number;
};

export type GenericAuthenticatorWithProvisioningConfigs = GenericAuthenticatorInterface & {
    provisioning: ProvisioningInterface
};

export type ProxyModeConflictTestReturn = {
    conflicting: boolean;
    idpList: GenericAuthenticatorWithProvisioningConfigs[];
};
