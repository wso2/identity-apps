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

import { IdentityProviderManagementConstants } from "../../identity-providers";
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
}
