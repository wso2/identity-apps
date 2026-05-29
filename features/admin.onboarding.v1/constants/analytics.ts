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

import { OnboardingStep } from "../models/onboarding";

/**
 * Moesif event names.
 * Format: Area-PastTenseAction-ObjectOrResult in PascalCase with hyphens.
 */
export enum OnboardingAnalyticsEvents {
    COMPLETED = "Onboarding-Completed",
    SKIPPED = "Onboarding-Skipped",
    STARTED = "Onboarding-Started",
    STEP_BACK = "Onboarding-Step-Back",
    STEP_COMPLETED = "Onboarding-Step-Completed"
}

/**
 * Step name identifiers for Onboarding-Step-Completed metadata.
 * Each value is sent as the `step_name` field to differentiate step events.
 */
export enum OnboardingStepNames {
    APP_NAME_ENTERED = "app_name_entered",
    APP_TEMPLATE_SELECTED = "app_template_selected",
    DESIGN_LOGIN_CONFIGURED = "design_login_configured",
    REDIRECT_URL_CONFIGURED = "redirect_url_configured",
    SIGNIN_OPTIONS_CONFIGURED = "signin_options_configured",
    WELCOME_OPTION_SELECTED = "welcome_option_selected"
}

/**
 * Step names for analytics metadata.
 */
export const STEP_NAMES: Record<OnboardingStep, string> = {
    [OnboardingStep.WELCOME]: OnboardingStepNames.WELCOME_OPTION_SELECTED,
    [OnboardingStep.NAME_APPLICATION]: OnboardingStepNames.APP_NAME_ENTERED,
    [OnboardingStep.SELECT_APPLICATION_TEMPLATE]: OnboardingStepNames.APP_TEMPLATE_SELECTED,
    [OnboardingStep.CONFIGURE_REDIRECT_URL]: OnboardingStepNames.REDIRECT_URL_CONFIGURED,
    [OnboardingStep.SIGN_IN_OPTIONS]: OnboardingStepNames.SIGNIN_OPTIONS_CONFIGURED,
    [OnboardingStep.DESIGN_LOGIN]: OnboardingStepNames.DESIGN_LOGIN_CONFIGURED,
    [OnboardingStep.SUCCESS]: "success"
};
