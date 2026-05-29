/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { FunctionComponent, SVGProps } from "react";

/**
 * Sign-in identifier options configuration.
 * Identifiers determine how users are recognized (username, email, or mobile).
 */
export interface SignInIdentifiersConfigInterface {
    username: boolean;
    email: boolean;
    mobile: boolean;
}

/**
 * Login methods configuration.
 * All authentication methods presented to users in Step 2 of the Identifier First flow.
 * Users can select any combination - these are presented as alternatives (OR logic).
 */
export interface SignInLoginMethodsConfigInterface {
    password: boolean;
    passkey: boolean;
    magicLink: boolean;
    emailOtp: boolean;
    totp: boolean;
    pushNotification: boolean;
}

/**
 * Complete sign-in options configuration.
 */
export interface SignInOptionsConfigInterface {
    identifiers: SignInIdentifiersConfigInterface;
    loginMethods: SignInLoginMethodsConfigInterface;
}

/**
 * Sign-in option definition for UI rendering.
 */
export interface SignInOptionDefinitionInterface {
    id: string;
    label: string;
    description?: string;
    category: "identifier" | "login-method";
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
    authenticatorConfig: {
        idp: string;
        authenticator: string;
    };
    requiresIdentifier?: boolean;
    canBeFirstFactor?: boolean;
    canBeSecondFactor?: boolean;
}

/**
 * Validation result for sign-in options.
 */
export interface SignInOptionsValidationInterface {
    isValid: boolean;
    errors: string[];
}
