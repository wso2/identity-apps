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
}

/**
 * Build authentication sequence from sign-in options.
 *
 * @param options - Sign-in options configuration
 * @returns Authentication sequence configuration
 */
export const buildAuthSequence = (options: SignInOptionsConfig): AuthenticationSequence => {
    const step1Options: AuthenticatorConfig[] = [];
    const { identifiers, credentials, socialLogins } = options;

    // Check what's enabled
    const hasUsername: boolean = identifiers.username;
    const hasEmail: boolean = identifiers.email;
    const hasMobile: boolean = identifiers.mobile;
    const hasPassword: boolean = credentials.password;
    const hasPasskey: boolean = credentials.passkey;
    const hasGoogle: boolean = socialLogins.google;

    // Add basic auth if password is selected with username/email
    // Basic auth handles username/email + password combination
    if (hasPassword && (hasUsername || hasEmail)) {
        step1Options.push({
            authenticator: "BasicAuthenticator",
            idp: "LOCAL"
        });
    }

    // Add email OTP if email is selected without password
    // This is the "magic link" or "email OTP" flow
    if (hasEmail && !hasPassword) {
        step1Options.push({
            authenticator: "email-otp-authenticator",
            idp: "LOCAL"
        });
    }

    // Add SMS OTP if mobile is selected
    if (hasMobile) {
        step1Options.push({
            authenticator: "sms-otp-authenticator",
            idp: "LOCAL"
        });
    }

    // Add Google if selected
    if (hasGoogle) {
        step1Options.push({
            authenticator: "GoogleOIDCAuthenticator",
            idp: "Google"
        });
    }

    // Add passkey/FIDO if selected
    if (hasPasskey) {
        step1Options.push({
            authenticator: "FIDOAuthenticator",
            idp: "LOCAL"
        });
    }

    // If no options configured, default to basic auth
    if (step1Options.length === 0) {
        step1Options.push({
            authenticator: "BasicAuthenticator",
            idp: "LOCAL"
        });
    }

    return {
        steps: [
            {
                id: 1,
                options: step1Options
            }
        ],
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
