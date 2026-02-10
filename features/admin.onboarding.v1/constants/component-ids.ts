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

/**
 * Component IDs for data-componentid attributes.
 */
export const OnboardingComponentIds = {
    COLOR_PICKER: "color-picker",
    CONFIGURE_REDIRECT_URL_STEP: "configure-redirect-url-step",
    DESIGN_LOGIN_STEP: "design-login-step",
    LOGIN_BOX_PREVIEW: "login-box-preview",
    LOGO_SELECTOR: "logo-selector",
    NAME_APP_STEP: "name-application-step",
    PAGE: "onboarding-page",
    SELECT_APPLICATION_TEMPLATE_STEP: "select-application-template-step",
    SIGN_IN_OPTIONS_STEP: "sign-in-options-step",
    SIGN_IN_OPTION_TOGGLE: "sign-in-option-toggle",
    SUCCESS_STEP: "success-step",
    WELCOME_STEP: "welcome-step",
    WIZARD: "onboarding-wizard"
} as const;

/**
 * Default user name when not available.
 */
export const DEFAULT_USER_NAME = "User";

/**
 * Number of random name suggestions to generate for application naming.
 */
export const RANDOM_NAME_COUNT = 7;
