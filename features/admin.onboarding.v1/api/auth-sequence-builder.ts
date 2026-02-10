/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { SignInOptionsConfigInterface } from "../models";

/**
 * Authenticator configuration for authentication sequence.
 */
export interface AuthenticatorConfigInterface {
    idp: string;
    authenticator: string;
}

/**
 * Authentication step configuration.
 */
export interface AuthenticationStepInterface {
    id: number;
    options: AuthenticatorConfigInterface[];
}

/**
 * Authentication sequence configuration.
 */
export interface AuthenticationSequenceInterface {
    type: "DEFAULT" | "USER_DEFINED";
    steps: AuthenticationStepInterface[];
    subjectStepId?: number;
    attributeStepId?: number;
}

/**
 * Build authentication sequence from sign-in options.
 *
 * The authentication flow depends on whether password is selected:
 *
 * **Password Selected (Traditional Login):**
 * - Step 1: BasicAuthenticator (identifier + password combined in single step)
 * - Step 2 (optional): Other selected methods as additional options
 *
 * **Password NOT Selected (Identifier First Flow):**
 * - Step 1: IdentifierExecutor (collects identifier only)
 * - Step 2: All selected login methods as alternatives (OR logic)
 *
 * @param options - Sign-in options configuration
 * @returns Authentication sequence configuration
 */
export const buildAuthSequence = (options: SignInOptionsConfigInterface): AuthenticationSequenceInterface => {
    const { loginMethods } = options;

    const step2Options: AuthenticatorConfigInterface[] = [];

    if (loginMethods.passkey) {
        step2Options.push({
            authenticator: "FIDOAuthenticator",
            idp: "LOCAL"
        });
    }

    if (loginMethods.magicLink) {
        step2Options.push({
            authenticator: "MagicLinkAuthenticator",
            idp: "LOCAL"
        });
    }

    if (loginMethods.emailOtp) {
        step2Options.push({
            authenticator: "email-otp-authenticator",
            idp: "LOCAL"
        });
    }

    if (loginMethods.totp) {
        step2Options.push({
            authenticator: "totp",
            idp: "LOCAL"
        });
    }

    if (loginMethods.pushNotification) {
        step2Options.push({
            authenticator: "push-notification-authenticator",
            idp: "LOCAL"
        });
    }

    const step1Authenticator: string = loginMethods.password
        ? "BasicAuthenticator"
        : "IdentifierExecutor";

    const steps: AuthenticationStepInterface[] = [
        {
            id: 1,
            options: [
                {
                    authenticator: step1Authenticator,
                    idp: "LOCAL"
                }
            ]
        }
    ];

    if (step2Options.length > 0) {
        steps.push({
            id: 2,
            options: step2Options
        });
    }

    return {
        attributeStepId: 1,
        steps,
        subjectStepId: 1,
        type: "USER_DEFINED"
    };
};

/**
 * Get a default authentication sequence with basic auth.
 *
 * @returns Default authentication sequence
 */
export const getDefaultAuthSequence = (): AuthenticationSequenceInterface => {
    return {
        attributeStepId: 1,
        steps: [
            {
                id: 1,
                options: [
                    {
                        authenticator: "BasicAuthenticator",
                        idp: "LOCAL"
                    }
                ]
            }
        ],
        subjectStepId: 1,
        type: "DEFAULT"
    };
};

/**
 * Check if the authentication sequence is using default configuration.
 *
 * @param sequence - Authentication sequence to check
 * @returns True if using default configuration
 */
export const isDefaultAuthSequence = (sequence: AuthenticationSequenceInterface): boolean => {
    if (sequence.type === "DEFAULT") {
        return true;
    }

    if (sequence.steps.length !== 1) {
        return false;
    }

    const step: AuthenticationStepInterface = sequence.steps[0];

    if (step.options.length !== 1) {
        return false;
    }

    const option: AuthenticatorConfigInterface = step.options[0];

    return option.idp === "LOCAL" && option.authenticator === "BasicAuthenticator";
};

/**
 * Check if the authentication sequence has multiple login methods.
 * In the Identifier First approach, this checks if Step 2 has multiple alternatives.
 *
 * Note: In this simplified flow, multiple login methods in Step 2 are alternatives (OR logic),
 * not traditional MFA (which would require sequential verification).
 *
 * @param sequence - Authentication sequence to check
 * @returns True if sequence has multiple login method options
 */
export const hasMultipleLoginMethods = (sequence: AuthenticationSequenceInterface): boolean => {
    if (sequence.steps.length < 2) {
        return false;
    }

    const step2: AuthenticationStepInterface | undefined = sequence.steps[1];

    return step2 ? step2.options.length > 1 : false;
};
