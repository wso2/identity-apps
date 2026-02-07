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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { FunctionComponent, ReactNode, SVGProps } from "react";

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
export interface OnboardingData {
    choice?: OnboardingChoice;
    applicationName?: string;
    isRandomName?: boolean;
    applicationType?: ApplicationType;
    templateId?: string;
    framework?: string;
    /** Redirect URLs for the application */
    redirectUrls?: string[];
    /** Allowed origins for CORS */
    allowedOrigins?: string[];
    /** Sign-in options configuration */
    signInOptions?: SignInOptionsConfig;
    /** Branding configuration */
    brandingConfig?: OnboardingBrandingConfig;
    /** Created application result */
    createdApplication?: CreatedApplicationResult;
}

/**
 * Framework/technology option for template selection.
 */
export interface FrameworkOption {
    id: string;
    displayName: string;
    logo?: FunctionComponent<SVGProps<SVGSVGElement>>;
    templateId?: string;
}

/**
 * Application type option for template selection.
 */
export interface ApplicationTypeOption {
    id: string;
    displayName: string;
    description: string;
    templateId: string;
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
}

/**
 * Choice option configuration for welcome step.
 */
export interface ChoiceOption {
    choice: OnboardingChoice;
    icon: string;
    titleKey: string;
    descriptionKey: string;
}

// ============================================================================
// Component Props Interfaces
// ============================================================================

/**
 * Base props for step components.
 */
export interface BaseStepProps extends IdentifiableComponentInterface {
    className?: string;
}

/**
 * Props for the onboarding wizard component.
 */
export interface OnboardingWizardProps {
    initialData?: OnboardingData;
    onComplete: (data: OnboardingData) => void;
    onSkip: () => void;
}

/**
 * Props for selectable card component.
 */
export interface SelectableCardProps extends IdentifiableComponentInterface {
    isSelected: boolean;
    onClick: () => void;
    icon: ReactNode;
    title: string;
    description?: string;
    testId?: string;
    variant?: "default" | "compact";
}

// ============================================================================
// Sign-In Options Interfaces
// ============================================================================

/**
 * Sign-in identifier options configuration.
 * Identifiers determine how users are recognized (username, email, or mobile).
 */
export interface SignInIdentifiersConfig {
    username: boolean;
    email: boolean;
    mobile: boolean;
}

/**
 * Login methods configuration.
 * All authentication methods presented to users in Step 2 of the Identifier First flow.
 * Users can select any combination - these are presented as alternatives (OR logic).
 */
export interface SignInLoginMethodsConfig {
    password: boolean;
    passkey: boolean;
    magicLink: boolean;
    emailOtp: boolean;
    totp: boolean;
    pushNotification: boolean;
}

/**
 * Complete sign-in options configuration.
 * Uses the Identifier First approach:
 * - Step 1: IdentifierExecutor collects identifier (based on identifiers config)
 * - Step 2: All enabled login methods as alternatives
 *
 * Note: Social logins are intentionally excluded from onboarding.
 * Users can add social logins from the Console later.
 */
export interface SignInOptionsConfig {
    identifiers: SignInIdentifiersConfig;
    loginMethods: SignInLoginMethodsConfig;
}

/**
 * Sign-in option definition for UI rendering.
 */
export interface SignInOptionDefinition {
    id: string;
    label: string;
    description?: string;
    category: "identifier" | "login-method";
    icon?: FunctionComponent<SVGProps<SVGSVGElement>>;
    authenticatorConfig: {
        idp: string;
        authenticator: string;
    };
    /** Whether this option requires an identifier to be selected */
    requiresIdentifier?: boolean;
    /** Whether this option can be used as a first factor */
    canBeFirstFactor?: boolean;
    /** Whether this option can be used as a second factor (MFA) */
    canBeSecondFactor?: boolean;
}

// ============================================================================
// Branding Interfaces
// ============================================================================

/**
 * Branding configuration for onboarding.
 */
export interface OnboardingBrandingConfig {
    primaryColor: string;
    logoUrl?: string;
    logoAltText?: string;
    logoSuggestions?: string[];
}

// ============================================================================
// Application Result Interfaces
// ============================================================================

/**
 * Result after application creation.
 */
export interface CreatedApplicationResult {
    applicationId: string;
    clientId: string;
    clientSecret?: string;
    name: string;
}

// ============================================================================
// Validation Interfaces
// ============================================================================

/**
 * Validation result for sign-in options.
 */
export interface SignInOptionsValidation {
    isValid: boolean;
    errors: string[];
}

/**
 * Redirect URL validation result.
 */
export interface RedirectUrlValidation {
    isValid: boolean;
    error?: string;
}
