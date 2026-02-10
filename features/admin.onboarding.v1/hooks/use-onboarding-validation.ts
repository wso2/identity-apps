/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { useCallback, useMemo } from "react";
import { AppNameConstraints, RedirectUrlConstraints } from "../constants";
import {
    CreatedApplicationResultInterface,
    OnboardingBrandingConfigInterface,
    OnboardingDataInterface,
    OnboardingStep,
    SignInOptionsConfigInterface
} from "../models";
import { extractOrigins } from "../utils/url-utils";

/**
 * Validates an application name against the constraints.
 * Uses the same validation pattern as the Console application creation flow.
 *
 * @param name - The application name to validate.
 * @returns True if the name is valid, false otherwise.
 */
const isValidAppName = (name: string): boolean => {
    if (!name) return false;

    const trimmedName: string = name.trim();

    if (trimmedName.length < AppNameConstraints.MIN_LENGTH) return false;
    if (trimmedName.length > AppNameConstraints.MAX_LENGTH) return false;

    return AppNameConstraints.PATTERN.test(trimmedName);
};

/**
 * Custom hook for application name validation.
 * Uses the same validation pattern as the Console application creation flow.
 */
export const useNameValidation = () => {
    const validateName = useCallback((name: string): boolean => {
        return isValidAppName(name);
    }, []);

    const getValidationError = useCallback((name: string): string | null => {
        if (!name) return null;

        const trimmedName: string = name.trim();

        if (trimmedName.length < AppNameConstraints.MIN_LENGTH) {
            return `Application name must be at least ${AppNameConstraints.MIN_LENGTH} characters`;
        }

        if (trimmedName.length > AppNameConstraints.MAX_LENGTH) {
            return `Application name must not exceed ${AppNameConstraints.MAX_LENGTH} characters`;
        }

        if (!AppNameConstraints.PATTERN.test(trimmedName)) {
            return "Application name can only contain alphanumeric characters, dots, " +
                "underscores, hyphens, and single spaces between words";
        }

        return null;
    }, []);

    return { getValidationError, validateName };
};

/**
 * Validate a URL string.
 */
const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return false;

    return RedirectUrlConstraints.PATTERN.test(url);
};

/**
 * Validate sign-in options configuration.
 * Simplified validation for the Identifier First approach:
 * - Must have at least one identifier
 * - Must have at least one login method
 */
const isValidSignInOptions = (options?: SignInOptionsConfigInterface): boolean => {
    if (!options) return false;

    const { identifiers, loginMethods } = options;

    // Must have at least one identifier
    const hasIdentifier: boolean = identifiers.username || identifiers.email || identifiers.mobile;

    if (!hasIdentifier) return false;

    // Must have at least one login method
    const hasLoginMethod: boolean = loginMethods.password || loginMethods.passkey ||
        loginMethods.magicLink || loginMethods.emailOtp || loginMethods.totp ||
        loginMethods.pushNotification;

    if (!hasLoginMethod) return false;

    return true;
};

/**
 * Custom hook for onboarding step validation.
 */
export const useStepValidation = (currentStep: OnboardingStep, data: OnboardingDataInterface) => {
    return useMemo(() => {
        switch (currentStep) {
            case OnboardingStep.WELCOME:
                return !data.choice;
            case OnboardingStep.NAME_APPLICATION:
                return !data.applicationName || !isValidAppName(data.applicationName);
            case OnboardingStep.SELECT_APPLICATION_TEMPLATE:
                return !data.templateId;
            case OnboardingStep.CONFIGURE_REDIRECT_URL:
                return !data.redirectUrls?.length ||
                       !data.redirectUrls.every((url: string) => isValidUrl(url));
            case OnboardingStep.SIGN_IN_OPTIONS:
                return !isValidSignInOptions(data.signInOptions);
            case OnboardingStep.DESIGN_LOGIN:
                // Design step is always valid (has defaults)
                return false;
            case OnboardingStep.SUCCESS:
                return false;
            default:
                return false;
        }
    }, [ currentStep, data ]);
};

/**
 * Custom hook for managing onboarding data updates.
 */
export const useOnboardingDataInterface = (
    initialData: OnboardingDataInterface,
    setData: (data: OnboardingDataInterface) => void
) => {
    const updateChoice = useCallback((choice: OnboardingDataInterface["choice"]) => {
        setData({ ...initialData, choice });
    }, [ initialData, setData ]);

    const updateApplicationName = useCallback((applicationName: string) => {
        setData({ ...initialData, applicationName });
    }, [ initialData, setData ]);

    const updateIsRandomName = useCallback((isRandomName: boolean) => {
        setData({ ...initialData, isRandomName });
    }, [ initialData, setData ]);

    const updateApplicationType = useCallback((applicationType: OnboardingDataInterface["applicationType"]) => {
        setData({ ...initialData, applicationType });
    }, [ initialData, setData ]);

    const updateTemplateSelection = useCallback((templateId: string, framework?: string) => {
        setData({ ...initialData, framework, templateId });
    }, [ initialData, setData ]);

    const updateRedirectUrls = useCallback((urls: string[]) => {
        setData({
            ...initialData,
            allowedOrigins: extractOrigins(urls),
            redirectUrls: urls
        });
    }, [ initialData, setData ]);

    const updateSignInOptions = useCallback((options: SignInOptionsConfigInterface) => {
        setData({ ...initialData, signInOptions: options });
    }, [ initialData, setData ]);

    const updateBrandingConfig = useCallback((config: OnboardingBrandingConfigInterface) => {
        setData({ ...initialData, brandingConfig: config });
    }, [ initialData, setData ]);

    const setCreatedApplication = useCallback((result: CreatedApplicationResultInterface) => {
        setData({ ...initialData, createdApplication: result });
    }, [ initialData, setData ]);

    return {
        setCreatedApplication,
        updateApplicationName,
        updateApplicationType,
        updateBrandingConfig,
        updateChoice,
        updateIsRandomName,
        updateRedirectUrls,
        updateSignInOptions,
        updateTemplateSelection
    };
};
