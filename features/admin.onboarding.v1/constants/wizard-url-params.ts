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

import { SignInLoginMethodsConfigInterface } from "../models";

/**
 * URL query parameter keys for the onboarding wizard.
 */
export const WizardUrlParams: Readonly<Record<string, string>> = {
    APP_NAME: "appName",
    BRANDING_COLOR: "brandingColor",
    BRANDING_LOGO: "brandingLogo",
    CHOICE: "choice",
    FRAMEWORK: "framework",
    REDIRECT_URL: "redirectUrl",
    SIGN_IN_METHODS: "signInMethods",
    STEP: "step",
    TEMPLATE_ID: "templateId"
} as const;

/**
 * Whitelist of login method IDs accepted in the `signInMethods` URL parameter.
 * Used for both parsing and serialization.
 */
export const VALID_LOGIN_METHOD_IDS: readonly (keyof SignInLoginMethodsConfigInterface)[] = [
    "password",
    "passkey",
    "magicLink",
    "emailOtp",
    "totp",
    "pushNotification"
];
