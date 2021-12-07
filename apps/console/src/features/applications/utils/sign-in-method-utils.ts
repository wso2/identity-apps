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
     * @hideconstructor
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

        return [ leftSideSteps, rightSideSteps ];
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
     * JIT provisioning (in other words, enable proxy mode config
     * ~ {@code !idpModel.provisioning.jit.isEnable === proxyMode}).
     *
     * Then, if they try to add a second factor authentication next system should not allow this
     * operation because with the proxy mode enabled; users aren't provisioned locally.
     * Therefore, making the second factor auth obsolete.
     */
    public static isMFAConflictingWithProxyModeConfig(
        { addingStep, authenticators, steps }: ProxyModeConflictTestArgs
    ): boolean {

        /**
         * In authentication step 0 users aren't allowed to add
         * MFA whatsoever. So, this invariant skips this validation
         * if this is the step 0. 0 maps to id:1 in {@code steps}.
         */
        if (addingStep === 0) return false;

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
         * Yes. It's confusing at first but changing indexes aren't feasible
         * at this time.
         */

        /**
         * This returns the last authentication option of a given
         * step. It only searches for SOCIAL and ENTERPRISE connections.
         * If none found after the filter operation, it will return undefined.
         *
         * @param authStep {AuthenticationStepInterface} target step.
         */
        const getLastOptionOf = (
            authStep: AuthenticationStepInterface
        ): GenericAuthenticatorInterface & { provisioning: ProvisioningInterface } | undefined => {

            try {
                const filteredOptions =  authStep?.options
                    .map(({ idp }) => idp)
                    .map((idpName) => authenticators.find(({ name }) => name === idpName))
                    .filter(Boolean) // Filter the {@code undefined|null} ones
                    .filter(({ category }) => (
                        category === AuthenticatorCategories.SOCIAL.toString() ||
                        category === AuthenticatorCategories.ENTERPRISE.toString()
                    ));

                if (filteredOptions?.length) {
                    return filteredOptions[filteredOptions.length - 1] as GenericAuthenticatorInterface & {
                        provisioning: ProvisioningInterface
                    };
                }
            } catch (error) {
                return undefined;
            }

            return undefined;
        };

        const currentStep = steps.find(({id}) => id === addingStep + 1);
        const previousStep = steps.find(({id}) => id === addingStep);

        const lastOption = getLastOptionOf(currentStep);
        const lastStepLastOption = getLastOptionOf(previousStep);

        // Checks whether the IdP left side of this has proxy mode enabled.
        if (lastOption !== undefined && !lastOption.provisioning?.jit?.isEnabled) return true;
        // Checks above step last option has proxy mode enabled.
        if (lastStepLastOption !== undefined && !lastStepLastOption.provisioning?.jit?.isEnabled) return true;

        return false;

    }

}

type ProxyModeConflictTestArgs = {
    authenticators: GenericAuthenticatorInterface[];
    authenticatorId: string;
    addingStep: number;
    steps: AuthenticationStepInterface[];
};
