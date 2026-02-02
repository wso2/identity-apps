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

import { SignInOptionsConfig, SignInOptionDefinition } from "../models";

/**
 * Default sign-in options configuration.
 */
export const DEFAULT_SIGN_IN_OPTIONS: SignInOptionsConfig = {
    credentials: {
        passkey: false,
        password: true
    },
    identifiers: {
        email: true,
        mobile: false,
        username: true
    },
    socialLogins: {
        google: false
    }
};

/**
 * Sign-in option definitions for identifier options.
 */
export const IDENTIFIER_OPTIONS: SignInOptionDefinition[] = [
    {
        authenticatorConfig: {
            authenticator: "basic",
            idp: "LOCAL"
        },
        category: "identifier",
        description: "Users sign in with their username",
        id: "username",
        label: "Username",
        requiresCredential: true
    },
    {
        authenticatorConfig: {
            authenticator: "email-otp-authenticator",
            idp: "LOCAL"
        },
        category: "identifier",
        description: "Users sign in with their email address",
        id: "email",
        label: "Email",
        requiresCredential: false
    },
    {
        authenticatorConfig: {
            authenticator: "sms-otp-authenticator",
            idp: "LOCAL"
        },
        category: "identifier",
        description: "Users sign in with their mobile number",
        id: "mobile",
        label: "Mobile",
        requiresCredential: false
    }
];

/**
 * Sign-in option definitions for credential options.
 */
export const CREDENTIAL_OPTIONS: SignInOptionDefinition[] = [
    {
        authenticatorConfig: {
            authenticator: "basic",
            idp: "LOCAL"
        },
        category: "credential",
        description: "Traditional password authentication",
        id: "password",
        isCredential: true,
        label: "Password"
    },
    {
        authenticatorConfig: {
            authenticator: "FIDOAuthenticator",
            idp: "LOCAL"
        },
        category: "credential",
        description: "Passwordless authentication with biometrics or security keys",
        id: "passkey",
        isCredential: true,
        label: "Passkey"
    }
];

/**
 * Sign-in option definitions for social login options.
 */
export const SOCIAL_LOGIN_OPTIONS: SignInOptionDefinition[] = [
    {
        authenticatorConfig: {
            authenticator: "GoogleOIDCAuthenticator",
            idp: "Google"
        },
        category: "social",
        description: "Allow users to sign in with their Google account",
        id: "google",
        label: "Google"
    }
];

/**
 * All sign-in options combined.
 */
export const ALL_SIGN_IN_OPTIONS: SignInOptionDefinition[] = [
    ...IDENTIFIER_OPTIONS,
    ...CREDENTIAL_OPTIONS,
    ...SOCIAL_LOGIN_OPTIONS
];

/**
 * Validation rules for sign-in options.
 */
export const SignInOptionsValidationRules = {
    /** Email alone is valid (implies email OTP) */
    EMAIL_STANDALONE_VALID: true,
    /** Minimum one sign-in method required */
    MIN_OPTIONS: 1,
    /** Mobile alone is valid (implies SMS OTP) */
    MOBILE_STANDALONE_VALID: true,
    /** Username alone requires credential */
    USERNAME_REQUIRES_CREDENTIAL: true
} as const;
