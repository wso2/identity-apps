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
import { OnboardingBrandingConfigInterface } from "../models/branding";
import {
    OnboardingChoice,
    OnboardingDataInterface,
    OnboardingStep,
    ParsedWizardUrlParamsInterface
} from "../models/onboarding";
import { SignInLoginMethodsConfigInterface } from "../models/sign-in-options";

/**
 * Parse wizard URL parameters from a search string.
 * Returns only fields explicitly present in the URL — absent fields are omitted
 * so that the wizard's own defaults apply via spread initialization.
 *
 * @param search - URL search string (e.g., "?step=2&appName=MyApp")
 * @returns Parsed step and partial onboarding data
 */
export const parseWizardUrlParams: (search: string) => ParsedWizardUrlParamsInterface = (
    search: string
): ParsedWizardUrlParamsInterface => {
    const params: URLSearchParams = new URLSearchParams(search);
    const data: OnboardingDataInterface = {};
    let step: OnboardingStep | undefined;

    const stepParam: string | null = params.get(WizardUrlParams.STEP);

    if (stepParam !== null) {
        const parsed: number = parseInt(stepParam, 10);

        if (!isNaN(parsed) && parsed >= OnboardingStep.WELCOME && parsed <= OnboardingStep.DESIGN_LOGIN) {
            step = parsed as OnboardingStep;
        }
    }

    const choiceParam: string | null = params.get(WizardUrlParams.CHOICE);

    if (choiceParam && Object.values(OnboardingChoice).includes(choiceParam as OnboardingChoice)) {
        data.choice = choiceParam as OnboardingChoice;
    }

    const appNameParam: string | null = params.get(WizardUrlParams.APP_NAME);

    if (appNameParam) {
        data.applicationName = appNameParam;
    }

    const templateIdParam: string | null = params.get(WizardUrlParams.TEMPLATE_ID);

    if (templateIdParam) {
        data.templateId = templateIdParam;
    }

    const frameworkParam: string | null = params.get(WizardUrlParams.FRAMEWORK);

    if (frameworkParam) {
        data.framework = frameworkParam;
    }

    const redirectUrlParam: string | null = params.get(WizardUrlParams.REDIRECT_URL);

    if (redirectUrlParam) {
        data.redirectUrls = [ redirectUrlParam ];
    }

    // Comma-separated list of enabled method IDs (e.g., "password,passkey,totp")
    const signInMethodsParam: string | null = params.get(WizardUrlParams.SIGN_IN_METHODS);

    if (signInMethodsParam) {
        const enabledMethods: string[] = signInMethodsParam.split(",").map(
            (method: string) => method.trim()
        );

        const validEnabledMethods: (keyof SignInLoginMethodsConfigInterface)[] = enabledMethods.filter(
            (id: string): id is keyof SignInLoginMethodsConfigInterface =>
                VALID_LOGIN_METHOD_IDS.includes(id as keyof SignInLoginMethodsConfigInterface)
        );

        // Only override defaults if at least one valid method ID was found
        if (validEnabledMethods.length > 0) {
            const loginMethods: SignInLoginMethodsConfigInterface = {
                emailOtp: false,
                magicLink: false,
                passkey: false,
                password: false,
                pushNotification: false,
                totp: false
            };

            for (const methodId of validEnabledMethods) {
                loginMethods[methodId] = true;
            }

            data.signInOptions = {
                identifiers: DEFAULT_SIGN_IN_OPTIONS.identifiers,
                loginMethods
            };
        }
    }

    const brandingColorParam: string | null = params.get(WizardUrlParams.BRANDING_COLOR);
    const brandingLogoParam: string | null = params.get(WizardUrlParams.BRANDING_LOGO);

    if (brandingColorParam || brandingLogoParam) {
        const brandingConfig: OnboardingBrandingConfigInterface = {
            ...DEFAULT_BRANDING_CONFIG
        };

        if (brandingColorParam) {
            brandingConfig.primaryColor = brandingColorParam.startsWith("#")
                ? brandingColorParam
                : `#${brandingColorParam}`;
        }

        if (brandingLogoParam) {
            brandingConfig.logoUrl = brandingLogoParam;
        }

        data.brandingConfig = brandingConfig;
    }

    return { data, step };
};
