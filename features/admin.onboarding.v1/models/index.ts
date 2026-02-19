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

import { FunctionComponent, SVGProps } from "react";

// ============================================================================
// Enums
// ============================================================================

/**
 * Enum for onboarding wizard steps.
 */
export enum OnboardingStep {
    WELCOME = 0,
    NAME_APPLICATION = 1,
    SELECT_APPLICATION_TEMPLATE = 2,
    CONFIGURE_REDIRECT_URL = 3,
    SIGN_IN_OPTIONS = 4,
    DESIGN_LOGIN = 5,
    SUCCESS = 6
}

/**
 * Enum for initial onboarding choice.
 */
export enum OnboardingChoice {
    SETUP = "setup",
    TOUR = "tour"
}

/**
 * Enum for high-level application types.
 */
export enum ApplicationType {
    BROWSER = "browser",
    MOBILE = "mobile",
    MACHINE = "machine"
}

// ============================================================================
// Data Interfaces
// ============================================================================

/**
 * Data collected during onboarding flow.
 */
export interface OnboardingDataInterface {
    choice?: OnboardingChoice;
    applicationName?: string;
    isRandomName?: boolean;
    applicationType?: ApplicationType;
    templateId?: string;
    framework?: string;
    redirectUrls?: string[];
    allowedOrigins?: string[];
    signInOptions?: SignInOptionsConfigInterface;
    brandingConfig?: OnboardingBrandingConfigInterface;
    createdApplication?: CreatedApplicationResultInterface;
}

/**
 * Framework/technology option for template selection.
 */
export interface FrameworkOptionInterface {
    id: string;
    displayName: string;
    logo?: FunctionComponent<SVGProps<SVGSVGElement>> | string;
    templateId?: string;
}

/**
 * Application type option for template selection.
 */
export interface ApplicationTypeOptionInterface {
    id: string;
    displayName: string;
    description: string;
    templateId: string;
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
}

// ============================================================================
// Sign-In Options Interfaces
// ============================================================================

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

// ============================================================================
// Branding Interfaces
// ============================================================================

/**
 * Branding configuration for onboarding.
 */
export interface OnboardingBrandingConfigInterface {
    primaryColor: string;
    logoUrl?: string;
    logoAltText?: string;
}

// ============================================================================
// Application Result Interfaces
// ============================================================================

/**
 * Test user credentials for testing the application.
 */
export interface TestUserCredentialsInterface {
    username: string;
    password: string;
    email?: string;
}

/**
 * Result after application creation.
 */
export interface CreatedApplicationResultInterface {
    applicationId: string;
    clientId: string;
    clientSecret?: string;
    name: string;
    testUserCredentials?: TestUserCredentialsInterface;
    tryItUrl?: string;
}

// ============================================================================
// Validation Interfaces
// ============================================================================

/**
 * Validation result for sign-in options.
 */
export interface SignInOptionsValidationInterface {
    isValid: boolean;
    errors: string[];
}
