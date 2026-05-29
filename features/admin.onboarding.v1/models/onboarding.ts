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

import { CreatedApplicationResultInterface } from "./application";
import { OnboardingBrandingConfigInterface } from "./branding";
import { SignInOptionsConfigInterface } from "./sign-in-options";

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
 * Data collected during onboarding flow.
 */
export interface OnboardingDataInterface {
    choice?: OnboardingChoice;
    applicationName?: string;
    isRandomName?: boolean;
    applicationType?: string;
    templateId?: string;
    framework?: string;
    redirectUrls?: string[];
    allowedOrigins?: string[];
    signInOptions?: SignInOptionsConfigInterface;
    brandingConfig?: OnboardingBrandingConfigInterface;
    selfRegistrationEnabled?: boolean;
    createdApplication?: CreatedApplicationResultInterface;
}

/**
 * Parsed URL parameters for restoring wizard state.
 */
export interface ParsedWizardUrlParamsInterface {
    step: OnboardingStep | undefined;
    data: OnboardingDataInterface;
}
