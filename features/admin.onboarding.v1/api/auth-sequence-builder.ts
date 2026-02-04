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

import { SignInOptionsConfig } from "../models";

/**
 * Authenticator configuration for authentication sequence.
 */
export interface AuthenticatorConfig {
    idp: string;
    authenticator: string;
}

/**
 * Authentication step configuration.
 */
export interface AuthenticationStep {
    id: number;
    options: AuthenticatorConfig[];
}

/**
 * Authentication sequence configuration.
 */
export interface AuthenticationSequence {
    type: "DEFAULT" | "USER_DEFINED";
    steps: AuthenticationStep[];
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
export const buildAuthSequence = (options: SignInOptionsConfig): AuthenticationSequence => {
    const { loginMethods } = options;

    // ========== Build Step 2 Options (non-password methods) ==========
    // Note: BasicAuthenticator goes in Step 1 when password is selected
    const step2Options: AuthenticatorConfig[] = [];

    // Passkey/FIDO authentication
    if (loginMethods.passkey) {
        step2Options.push({
            authenticator: "FIDOAuthenticator",
            idp: "LOCAL"
        });
    }

    // Magic Link authentication
    if (loginMethods.magicLink) {
        step2Options.push({
            authenticator: "MagicLinkAuthenticator",
            idp: "LOCAL"
        });
    }

    // Email OTP
    if (loginMethods.emailOtp) {
        step2Options.push({
            authenticator: "email-otp-authenticator",
            idp: "LOCAL"
        });
    }

    // TOTP (Time-based One-Time Password)
    if (loginMethods.totp) {
        step2Options.push({
            authenticator: "totp",
            idp: "LOCAL"
        });
    }

    // Push Notification
    if (loginMethods.pushNotification) {
        step2Options.push({
            authenticator: "push-notification-authenticator",
            idp: "LOCAL"
        });
    }

    // ========== Conditional Step 1 Logic ==========
    // If password is selected: BasicAuthenticator in Step 1 (traditional login)
    // If password is NOT selected: IdentifierExecutor in Step 1 (Identifier First flow)

    const step1Authenticator: string = loginMethods.password
        ? "BasicAuthenticator"
        : "IdentifierExecutor";

    const steps: AuthenticationStep[] = [
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

    // ========== Add Step 2 if there are additional options ==========
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
export const getDefaultAuthSequence = (): AuthenticationSequence => {
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
export const isDefaultAuthSequence = (sequence: AuthenticationSequence): boolean => {
    if (sequence.type === "DEFAULT") {
        return true;
    }

    if (sequence.steps.length !== 1) {
        return false;
    }

    const step: AuthenticationStep = sequence.steps[0];

    if (step.options.length !== 1) {
        return false;
    }

    const option: AuthenticatorConfig = step.options[0];

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
export const hasMultipleLoginMethods = (sequence: AuthenticationSequence): boolean => {
    if (sequence.steps.length < 2) {
        return false;
    }

    const step2: AuthenticationStep | undefined = sequence.steps[1];

    return step2 ? step2.options.length > 1 : false;
};
