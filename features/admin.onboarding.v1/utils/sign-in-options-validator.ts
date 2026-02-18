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

import { SignInOptionsConfigInterface, SignInOptionsValidationInterface } from "../models";

/**
 * Validate sign-in options configuration.
 * Simplified validation for the Identifier First approach.
 *
 * When alphanumeric username is disabled, email IS the username (email-as-username mode).
 * In this case, no explicit identifier selection is required.
 *
 * @param options - Sign-in options configuration
 * @param isAlphanumericUsername - Whether alphanumeric username is enabled
 * @returns Validation result with errors array
 */
export const validateSignInOptions: (
    options: SignInOptionsConfigInterface,
    isAlphanumericUsername: boolean
) => SignInOptionsValidationInterface = (
    options: SignInOptionsConfigInterface,
    isAlphanumericUsername: boolean
): SignInOptionsValidationInterface => {
    const errors: string[] = [];
    const { identifiers, loginMethods } = options;
    const hasIdentifier: boolean = !isAlphanumericUsername ||
        identifiers.username || identifiers.email || identifiers.mobile;

    if (!hasIdentifier) {
        errors.push("Select at least one identifier (Username, Email, or Mobile)");
    }

    // Must have at least one login method
    const hasLoginMethod: boolean = loginMethods.password || loginMethods.passkey ||
        loginMethods.magicLink || loginMethods.emailOtp || loginMethods.totp ||
        loginMethods.pushNotification;

    if (!hasLoginMethod) {
        errors.push("Select at least one login method");
    }

    return {
        errors,
        isValid: errors.length === 0
    };
};

/**
 * Simple validation for use in hooks (boolean only).
 * Wrapper around the full validator.
 *
 * @param options - Sign-in options configuration
 * @param isAlphanumericUsername - Whether alphanumeric username is enabled
 * @returns True if valid, false otherwise
 */
export const isValidSignInOptions: (
    options: SignInOptionsConfigInterface | undefined,
    isAlphanumericUsername: boolean
) => boolean = (
    options: SignInOptionsConfigInterface | undefined,
    isAlphanumericUsername: boolean
): boolean => {
    if (!options) return false;

    return validateSignInOptions(options, isAlphanumericUsername).isValid;
};
