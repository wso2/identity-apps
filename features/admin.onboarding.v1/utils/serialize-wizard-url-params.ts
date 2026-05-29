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

import {
    DEFAULT_BRANDING_CONFIG,
    DEFAULT_SIGN_IN_OPTIONS,
    VALID_LOGIN_METHOD_IDS,
    WizardUrlParams
} from "../constants";
import {
    OnboardingChoice,
    OnboardingDataInterface,
    OnboardingStep
} from "../models/onboarding";
import { SignInLoginMethodsConfigInterface } from "../models/sign-in-options";

/**
 * Serialize wizard state to URL search parameters.
 * Only includes non-default/non-empty values to keep the URL clean.
 *
 * @param step - Current wizard step
 * @param data - Current onboarding data
 * @returns URLSearchParams object with serialized state
 */
export const serializeWizardUrlParams: (
    step: OnboardingStep,
    data: OnboardingDataInterface
) => URLSearchParams = (
    step: OnboardingStep,
    data: OnboardingDataInterface
): URLSearchParams => {
    const params: URLSearchParams = new URLSearchParams();

    // SUCCESS step should not be bookmarkable — clear all params
    if (step === OnboardingStep.SUCCESS) {
        return params;
    }

    if (step !== OnboardingStep.WELCOME) {
        params.set(WizardUrlParams.STEP, String(step));
    }

    if (data.choice && data.choice !== OnboardingChoice.SETUP) {
        params.set(WizardUrlParams.CHOICE, data.choice);
    }

    if (data.applicationName) {
        params.set(WizardUrlParams.APP_NAME, data.applicationName);
    }

    if (data.templateId) {
        params.set(WizardUrlParams.TEMPLATE_ID, data.templateId);
    }

    if (data.framework) {
        params.set(WizardUrlParams.FRAMEWORK, data.framework);
    }

    // Only persist the first redirect URL
    if (data.redirectUrls?.length && data.redirectUrls[0]) {
        params.set(WizardUrlParams.REDIRECT_URL, data.redirectUrls[0]);
    }

    // Only serialize if methods differ from the default (password-only)
    if (data.signInOptions?.loginMethods) {
        const methods: SignInLoginMethodsConfigInterface = data.signInOptions.loginMethods;
        const defaultMethods: SignInLoginMethodsConfigInterface = DEFAULT_SIGN_IN_OPTIONS.loginMethods;

        const hasChanged: boolean = VALID_LOGIN_METHOD_IDS.some(
            (id: keyof SignInLoginMethodsConfigInterface) => methods[id] !== defaultMethods[id]
        );

        if (hasChanged) {
            const enabledMethods: string[] = VALID_LOGIN_METHOD_IDS.filter(
                (id: keyof SignInLoginMethodsConfigInterface) => methods[id]
            );

            if (enabledMethods.length > 0) {
                params.set(WizardUrlParams.SIGN_IN_METHODS, enabledMethods.join(","));
            }
        }
    }

    if (data.brandingConfig?.primaryColor &&
        data.brandingConfig.primaryColor !== DEFAULT_BRANDING_CONFIG.primaryColor) {
        params.set(
            WizardUrlParams.BRANDING_COLOR,
            data.brandingConfig.primaryColor.replace(/^#/, "")
        );
    }

    if (data.brandingConfig?.logoUrl) {
        params.set(WizardUrlParams.BRANDING_LOGO, data.brandingConfig.logoUrl);
    }

    return params;
};
