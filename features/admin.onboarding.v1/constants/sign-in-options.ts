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

import {
    LocalAuthenticatorConstants
} from "@wso2is/admin.connections.v1/constants/local-authenticator-constants";
import { SignInOptionDefinitionInterface, SignInOptionsConfigInterface } from "../models";

const AuthNames: typeof LocalAuthenticatorConstants.AUTHENTICATOR_NAMES =
    LocalAuthenticatorConstants.AUTHENTICATOR_NAMES;
const LOCAL_IDP: string = LocalAuthenticatorConstants.LOCAL_IDP_IDENTIFIER;

/**
 * Default sign-in options configuration.
 * Username + Email identifiers with Password as the default login method.
 */
export const DEFAULT_SIGN_IN_OPTIONS: SignInOptionsConfigInterface = {
    identifiers: {
        email: false,
        mobile: false,
        username: true
    },
    loginMethods: {
        emailOtp: false,
        magicLink: false,
        passkey: false,
        password: true,
        pushNotification: false,
        totp: false
    }
};

/**
 * Sign-in option definitions for identifier options.
 * Identifiers determine how users are recognized.
 */
export const IDENTIFIER_OPTIONS: SignInOptionDefinitionInterface[] = [
    {
        authenticatorConfig: {
            authenticator: AuthNames.BASIC_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        },
        canBeFirstFactor: false,
        canBeSecondFactor: false,
        category: "identifier",
        description: "Users sign in with their username",
        id: "username",
        label: "Username",
        requiresIdentifier: false
    },
    {
        authenticatorConfig: {
            authenticator: AuthNames.EMAIL_OTP_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        },
        canBeFirstFactor: true,
        canBeSecondFactor: false,
        category: "identifier",
        description: "Users sign in with their email address",
        id: "email",
        label: "Email",
        requiresIdentifier: false
    },
    {
        authenticatorConfig: {
            authenticator: AuthNames.SMS_OTP_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        },
        canBeFirstFactor: true,
        canBeSecondFactor: false,
        category: "identifier",
        description: "Users sign in with their mobile number",
        id: "mobile",
        label: "Mobile",
        requiresIdentifier: false
    }
];

/**
 * Sign-in option definitions for login methods.
 * In the Identifier First approach, all these methods are presented
 * in Step 2 as alternatives (user can choose any one to authenticate).
 */
export const LOGIN_METHOD_OPTIONS: SignInOptionDefinitionInterface[] = [
    {
        authenticatorConfig: {
            authenticator: AuthNames.BASIC_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        },
        canBeFirstFactor: true,
        canBeSecondFactor: false,
        category: "login-method",
        description: "Traditional password authentication",
        id: "password",
        label: "Password",
        requiresIdentifier: true
    },
    {
        authenticatorConfig: {
            authenticator: AuthNames.FIDO_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        },
        canBeFirstFactor: true,
        canBeSecondFactor: false,
        category: "login-method",
        description: "Passwordless authentication with biometrics or security keys",
        id: "passkey",
        label: "Passkey",
        requiresIdentifier: true
    },
    {
        authenticatorConfig: {
            authenticator: AuthNames.MAGIC_LINK_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        },
        canBeFirstFactor: true,
        canBeSecondFactor: false,
        category: "login-method",
        description: "Passwordless authentication via email link",
        id: "magicLink",
        label: "Magic Link",
        requiresIdentifier: true
    },
    {
        authenticatorConfig: {
            authenticator: AuthNames.EMAIL_OTP_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        },
        canBeFirstFactor: true,
        canBeSecondFactor: true,
        category: "login-method",
        description: "One-time password sent via email",
        id: "emailOtp",
        label: "Email OTP",
        requiresIdentifier: true
    },
    {
        authenticatorConfig: {
            authenticator: AuthNames.TOTP_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        },
        canBeFirstFactor: true,
        canBeSecondFactor: true,
        category: "login-method",
        description: "Time-based one-time password from authenticator app",
        id: "totp",
        label: "TOTP",
        requiresIdentifier: true
    },
    {
        authenticatorConfig: {
            authenticator: AuthNames.PUSH_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        },
        canBeFirstFactor: true,
        canBeSecondFactor: true,
        category: "login-method",
        description: "Push notification to mobile device for approval",
        id: "pushNotification",
        label: "Push Notification",
        requiresIdentifier: true
    }
];

/**
 * All sign-in options combined.
 */
export const ALL_SIGN_IN_OPTIONS: SignInOptionDefinitionInterface[] = [
    ...IDENTIFIER_OPTIONS,
    ...LOGIN_METHOD_OPTIONS
];

/**
 * Validation rules for sign-in options.
 * Simplified for the Identifier First approach.
 */
export const SignInOptionsValidationRules: Record<string, number> = {
    /** Minimum one identifier required */
    MIN_IDENTIFIERS: 1,
    /** Minimum one login method required */
    MIN_LOGIN_METHODS: 1
};
