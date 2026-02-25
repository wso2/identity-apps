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

import { DEFAULT_BRANDING_CONFIG, DEFAULT_SIGN_IN_OPTIONS } from "../constants";
import {
    OnboardingBrandingConfigInterface,
    OnboardingChoice,
    OnboardingDataInterface,
    OnboardingStep,
    SignInLoginMethodsConfigInterface
} from "../models";

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

const VALID_LOGIN_METHOD_IDS: readonly (keyof SignInLoginMethodsConfigInterface)[] = [
    "password",
    "passkey",
    "magicLink",
    "emailOtp",
    "totp",
    "pushNotification"
];

export interface ParsedWizardUrlParamsInterface {
    step: OnboardingStep | undefined;
    data: OnboardingDataInterface;
}

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

        const loginMethods: SignInLoginMethodsConfigInterface = {
            emailOtp: false,
            magicLink: false,
            passkey: false,
            password: false,
            pushNotification: false,
            totp: false
        };

        for (const methodId of enabledMethods) {
            if (VALID_LOGIN_METHOD_IDS.includes(methodId as keyof SignInLoginMethodsConfigInterface)) {
                loginMethods[methodId as keyof SignInLoginMethodsConfigInterface] = true;
            }
        }

        data.signInOptions = {
            identifiers: DEFAULT_SIGN_IN_OPTIONS.identifiers,
            loginMethods
        };
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
