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
import { SignInOptionsConfigInterface } from "../models";

const AuthNames: typeof LocalAuthenticatorConstants.AUTHENTICATOR_NAMES =
    LocalAuthenticatorConstants.AUTHENTICATOR_NAMES;
const LOCAL_IDP: string = LocalAuthenticatorConstants.LOCAL_IDP_IDENTIFIER;

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
 * Builds an auth sequence from sign-in options.
 *
 * With password: Step 1 = BasicAuthenticator, Step 2 = other methods (optional).
 * Without password: Step 1 = IdentifierExecutor, Step 2 = selected methods as alternatives.
 */
export const buildAuthSequence = (options: SignInOptionsConfigInterface): AuthenticationSequenceInterface => {
    const { loginMethods } = options;

    const step2Options: AuthenticatorConfigInterface[] = [];

    if (loginMethods.passkey) {
        step2Options.push({
            authenticator: AuthNames.FIDO_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        });
    }

    if (loginMethods.magicLink) {
        step2Options.push({
            authenticator: AuthNames.MAGIC_LINK_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        });
    }

    if (loginMethods.emailOtp) {
        step2Options.push({
            authenticator: AuthNames.EMAIL_OTP_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        });
    }

    if (loginMethods.totp) {
        step2Options.push({
            authenticator: AuthNames.TOTP_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        });
    }

    if (loginMethods.pushNotification) {
        step2Options.push({
            authenticator: AuthNames.PUSH_AUTHENTICATOR_NAME,
            idp: LOCAL_IDP
        });
    }

    const step1Authenticator: string = loginMethods.password
        ? AuthNames.BASIC_AUTHENTICATOR_NAME
        : AuthNames.IDENTIFIER_FIRST_AUTHENTICATOR_NAME;

    const steps: AuthenticationStepInterface[] = [
        {
            id: 1,
            options: [
                {
                    authenticator: step1Authenticator,
                    idp: LOCAL_IDP
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
 * Returns a default auth sequence with BasicAuthenticator only.
 */
export const getDefaultAuthSequence = (): AuthenticationSequenceInterface => {
    return {
        attributeStepId: 1,
        steps: [
            {
                id: 1,
                options: [
                    {
                        authenticator: AuthNames.BASIC_AUTHENTICATOR_NAME,
                        idp: LOCAL_IDP
                    }
                ]
            }
        ],
        subjectStepId: 1,
        type: "DEFAULT"
    };
};

/**
 * Returns true if the sequence is a single-step BasicAuthenticator (default) config.
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

    return option.idp === LOCAL_IDP && option.authenticator === AuthNames.BASIC_AUTHENTICATOR_NAME;
};

/**
 * Checks whether Step 2 has multiple alternatives (OR logic, not sequential MFA).
 */
export const hasMultipleLoginMethods = (sequence: AuthenticationSequenceInterface): boolean => {
    if (sequence.steps.length < 2) {
        return false;
    }

    const step2: AuthenticationStepInterface | undefined = sequence.steps[1];

    return step2 ? step2.options.length > 1 : false;
};
