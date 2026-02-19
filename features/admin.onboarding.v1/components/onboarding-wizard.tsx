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

import Button from "@oxygen-ui/react/Button";
import useGetApplicationTemplate
    from "@wso2is/admin.application-templates.v1/api/use-get-application-template";
import { ApplicationTemplateInterface } from "@wso2is/admin.application-templates.v1/models/templates";
import { ApplicationTemplateIdTypes } from "@wso2is/admin.applications.v1/models/application";
import { AppState } from "@wso2is/admin.core.v1/store";
import useGetExtensionTemplates from "@wso2is/admin.template-core.v1/api/use-get-extension-templates";
import { ExtensionTemplateListInterface, ResourceTypes } from "@wso2is/admin.template-core.v1/models/templates";
import { getUsernameConfiguration } from "@wso2is/admin.users.v1/utils/user-management-utils";
import { useValidationConfigData } from "@wso2is/admin.validation.v1/api";
import { ValidationFormInterface } from "@wso2is/admin.validation.v1/models";
import { resolveUserDisplayName } from "@wso2is/core/helpers";
import { AlertLevels, IdentifiableComponentInterface, ProfileInfoInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { SessionStorageUtils } from "@wso2is/core/utils";
import React, { FunctionComponent, ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    ActionButtons,
    ContentCard,
    Footer,
    PrimaryButton,
    SecondaryButton,
    StepTransitionWrapper
} from "./shared/onboarding-styles";
import ConfigureRedirectUrlStep from "./steps/configure-redirect-url-step";
import DesignLoginStep from "./steps/design-login-step";
import NameApplicationStep from "./steps/name-application-step";
import SelectApplicationTemplateStep from "./steps/select-application-template-step";
import SignInOptionsStep from "./steps/sign-in-options-step";
import SuccessStep from "./steps/success-step";
import WelcomeStep from "./steps/welcome-step";
import { createOnboardingApplication } from "../api/create-onboarding-application";
import { createTryItApplication } from "../api/create-try-it-application";
import { updateMultiAttributeLoginConfig } from "../api/multi-attribute-login";
import { isBrandingCustomized, updateApplicationBranding } from "../api/update-onboarding-branding";
import {
    DEFAULT_BRANDING_CONFIG,
    DEFAULT_SIGN_IN_OPTIONS,
    OnboardingComponentIds,
    RANDOM_NAME_COUNT
} from "../constants";
import { useOnboardingDataInterface, useStepValidation } from "../hooks/use-onboarding-validation";
import { useStepTransition } from "../hooks/use-step-transition";
import {
    CreatedApplicationResultInterface,
    OnboardingChoice,
    OnboardingDataInterface,
    OnboardingStep
} from "../models";
import { generateRandomNames } from "../utils/random-name-generator";

/**
 * Props for the onboarding wizard component.
 */
export interface OnboardingWizardPropsInterface extends IdentifiableComponentInterface {
    initialData?: OnboardingDataInterface;
    onComplete: (data: OnboardingDataInterface) => void;
    onSkip: () => void;
}

/**
 * Get the next step based on current step and data.
 * Implements conditional navigation logic.
 */
const getNextStep = (currentStep: OnboardingStep, data: OnboardingDataInterface): OnboardingStep => {
    const isM2M: boolean = data.templateId === ApplicationTemplateIdTypes.M2M_APPLICATION;
    const isTourFlow: boolean = data.choice === OnboardingChoice.TOUR;

    switch (currentStep) {
        case OnboardingStep.WELCOME:
            // Tour flow skips to sign-in options
            if (isTourFlow) {
                return OnboardingStep.SIGN_IN_OPTIONS;
            }

            return OnboardingStep.NAME_APPLICATION;

        case OnboardingStep.NAME_APPLICATION:
            return OnboardingStep.SELECT_APPLICATION_TEMPLATE;

        case OnboardingStep.SELECT_APPLICATION_TEMPLATE:
            if (isM2M) {
                return OnboardingStep.SUCCESS;
            }

            return OnboardingStep.CONFIGURE_REDIRECT_URL;

        case OnboardingStep.CONFIGURE_REDIRECT_URL:
            return OnboardingStep.SIGN_IN_OPTIONS;

        case OnboardingStep.SIGN_IN_OPTIONS:
            return OnboardingStep.DESIGN_LOGIN;

        case OnboardingStep.DESIGN_LOGIN:
            return OnboardingStep.SUCCESS;

        case OnboardingStep.SUCCESS:
            return OnboardingStep.SUCCESS; // Stay on success

        default:
            return currentStep + 1;
    }
};

/**
 * Get the previous step based on current step and data.
 * Implements conditional navigation logic.
 */
const getPreviousStep = (currentStep: OnboardingStep, data: OnboardingDataInterface): OnboardingStep => {
    const isM2M: boolean = data.templateId === ApplicationTemplateIdTypes.M2M_APPLICATION;
    const isTourFlow: boolean = data.choice === OnboardingChoice.TOUR;

    switch (currentStep) {
        case OnboardingStep.SUCCESS:
            // Only M2M goes back to template selection (it skipped the intermediate steps)
            if (isM2M) {
                return OnboardingStep.SELECT_APPLICATION_TEMPLATE;
            }

            return OnboardingStep.DESIGN_LOGIN;

        case OnboardingStep.DESIGN_LOGIN:
            return OnboardingStep.SIGN_IN_OPTIONS;

        case OnboardingStep.SIGN_IN_OPTIONS:
            // Tour flow goes back to welcome
            if (isTourFlow) {
                return OnboardingStep.WELCOME;
            }

            return OnboardingStep.CONFIGURE_REDIRECT_URL;

        case OnboardingStep.CONFIGURE_REDIRECT_URL:
            return OnboardingStep.SELECT_APPLICATION_TEMPLATE;

        case OnboardingStep.SELECT_APPLICATION_TEMPLATE:
            return OnboardingStep.NAME_APPLICATION;

        case OnboardingStep.NAME_APPLICATION:
            return OnboardingStep.WELCOME;

        case OnboardingStep.WELCOME:
            return OnboardingStep.WELCOME; // Stay on welcome

        default:
            return Math.max(0, currentStep - 1);
    }
};

/**
 * Validate if a step can be safely restored from session storage.
 * Checks if required data exists for the given step.
 *
 * @param step - The step number to validate
 * @param data - Current onboarding data
 * @returns True if the step can be restored, false otherwise
 */
const validateStepRestoration = (step: number, data: OnboardingDataInterface): boolean => {
    switch (step) {
        case OnboardingStep.WELCOME:
        case OnboardingStep.NAME_APPLICATION:
            return true; // These steps don't require prior data
        case OnboardingStep.SELECT_APPLICATION_TEMPLATE:
            return !!data.applicationName;
        case OnboardingStep.CONFIGURE_REDIRECT_URL:
            return !!data.templateId;
        case OnboardingStep.SIGN_IN_OPTIONS:
            return !!data.redirectUrls?.length;
        case OnboardingStep.DESIGN_LOGIN:
            return !!data.signInOptions;
        case OnboardingStep.SUCCESS:
            return !!data.createdApplication;
        default:
            return false;
    }
};

/**
 * Get button text based on current step.
 */
const getNextButtonText = (currentStep: OnboardingStep, data: OnboardingDataInterface): string => {
    const isM2M: boolean = data.templateId === ApplicationTemplateIdTypes.M2M_APPLICATION;

    switch (currentStep) {
        case OnboardingStep.SELECT_APPLICATION_TEMPLATE:

            if (isM2M) {
                return "Create Application";
            }

            return "Next";

        case OnboardingStep.DESIGN_LOGIN:
            return "Finish";

        case OnboardingStep.SUCCESS:
            return "Go to Application";

        default:
            return "Next";
    }
};

/**
 * Onboarding wizard component.
 * Manages step logic, navigation, and renders step content.
 * Layout (header, container) is owned by the parent page.
 */
const OnboardingWizard: FunctionComponent<OnboardingWizardPropsInterface> = (
    props: OnboardingWizardPropsInterface
): ReactElement => {
    const {
        initialData,
        onComplete,
        onSkip,
        ["data-componentid"]: componentId = OnboardingComponentIds.WIZARD
    } = props;

    const dispatch: Dispatch = useDispatch();
    const tenantDomain: string = useSelector((state: AppState) =>
        state?.auth?.tenantDomain || state?.config?.deployment?.tenant || "carbon.super"
    );
    const asgardeoTryItURL: string = useSelector((state: AppState) =>
        state?.config?.deployment?.extensions?.asgardeoTryItURL as string || ""
    );
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const greeting: string = resolveUserDisplayName(profileInfo) || "";

    // Restore wizard step from sessionStorage if available (survives page reloads within the same tab)
    const WIZARD_STEP_STORAGE_KEY: string = "onboarding_wizard_step";

    const [ currentStep, setCurrentStep ] = useState<OnboardingStep>(() => {
        const savedStep: string | null = SessionStorageUtils.getItemFromSessionStorage(WIZARD_STEP_STORAGE_KEY);

        if (savedStep !== null) {
            const parsed: number = parseInt(savedStep, 10);

            if (!isNaN(parsed) && Object.values(OnboardingStep).includes(parsed)) {
                // Don't restore to success step
                if (parsed === OnboardingStep.SUCCESS) {
                    SessionStorageUtils.clearItemFromSessionStorage(WIZARD_STEP_STORAGE_KEY);

                    return OnboardingStep.WELCOME;
                }

                return parsed as OnboardingStep;
            }
        }

        return OnboardingStep.WELCOME;
    });

    const [ direction, setDirection ] = useState<"forward" | "backward">("forward");

    // Manages the visual transition between steps.
    const { visibleStep, phase, isAnimating } = useStepTransition(currentStep);

    // Persist current step to sessionStorage so the wizard can resume after unexpected reloads
    useEffect(() => {
        SessionStorageUtils.setItemToSessionStorage(WIZARD_STEP_STORAGE_KEY, String(currentStep));
    }, [ currentStep ]);

    const [ onboardingData, setOnboardingDataInterface ] = useState<OnboardingDataInterface>({
        brandingConfig: DEFAULT_BRANDING_CONFIG,
        choice: OnboardingChoice.SETUP,
        signInOptions: DEFAULT_SIGN_IN_OPTIONS,
        ...initialData
    });
    const [ isCreatingApp, setIsCreatingApp ] = useState<boolean>(false);

    // Validate restored step on mount - ensure required data exists
    useEffect(() => {
        // Only validate if step was restored from session (not at WELCOME)
        if (currentStep !== OnboardingStep.WELCOME) {
            const canRestoreToStep: boolean = validateStepRestoration(currentStep, onboardingData);

            if (!canRestoreToStep) {
                // Data incomplete - reset to beginning
                SessionStorageUtils.clearItemFromSessionStorage(WIZARD_STEP_STORAGE_KEY);
                setCurrentStep(OnboardingStep.WELCOME);
            }
        }
    }, []);

    // Generate random names once when wizard mounts - persists across step navigation
    const [ randomNames ] = useState<string[]>(() => generateRandomNames(RANDOM_NAME_COUNT));

    const {
        setCreatedApplication,
        updateApplicationName,
        updateBrandingConfig,
        updateChoice,
        updateRedirectUrls,
        updateSignInOptions,
        updateTemplateSelection
    } = useOnboardingDataInterface(onboardingData, setOnboardingDataInterface);

    const isNextDisabled: boolean = useStepValidation(currentStep, onboardingData);

    // Get validation config to determine if alphanumeric username is enabled
    const { data: validationData, isLoading: isValidationDataLoading } = useValidationConfigData();
    const isAlphanumericUsername: boolean = useMemo(() => {
        if (!validationData || isValidationDataLoading) {
            return true;
        }

        const usernameConfig: ValidationFormInterface = getUsernameConfiguration(validationData);

        // Default to true unless explicitly disabled
        return usernameConfig?.enableValidator !== "false";
    }, [ validationData, isValidationDataLoading ]);

    const isM2M: boolean = useMemo(
        () => onboardingData.templateId === ApplicationTemplateIdTypes.M2M_APPLICATION,
        [ onboardingData.templateId ]
    );

    const { data: templateListing } = useGetExtensionTemplates(ResourceTypes.APPLICATIONS);

    const { data: apiTemplate } = useGetApplicationTemplate(
        onboardingData.templateId,
        !!onboardingData.templateId && currentStep > OnboardingStep.SELECT_APPLICATION_TEMPLATE
    );

    // Merge listing data (which includes version) with individual template data.
    const mergedTemplate: ApplicationTemplateInterface = useMemo(() => {
        if (!apiTemplate || !templateListing) {
            return apiTemplate;
        }

        const listingEntry: ExtensionTemplateListInterface = templateListing.find(
            (item: ExtensionTemplateListInterface) => item.id === onboardingData.templateId
        );

        if (!listingEntry) {
            return apiTemplate;
        }

        const { self: _self, customAttributes: _customAttributes, ...rest } = listingEntry;

        return {
            ...rest,
            ...apiTemplate
        };
    }, [ apiTemplate, templateListing, onboardingData.templateId ]);

    const isTourFlow: boolean = onboardingData.choice === OnboardingChoice.TOUR;

    /**
     * Create the application.
     * For the Tour flow, creates/reuses the Try It app.
     * For the Setup flow, creates a new application from the selected template.
     */
    const createApplication: () => Promise<void> = useCallback(async (): Promise<void> => {
        setIsCreatingApp(true);

        try {
            let result: CreatedApplicationResultInterface;

            if (isTourFlow) {
                if (!asgardeoTryItURL || asgardeoTryItURL.trim() === "") {
                    throw new Error(
                        "Try It URL is not configured. Please check your deployment configuration."
                    );
                }
                result = await createTryItApplication(onboardingData, tenantDomain, asgardeoTryItURL);
            } else {
                result = await createOnboardingApplication(onboardingData, mergedTemplate);
            }

            if (onboardingData.signInOptions?.identifiers && !isM2M) {
                try {
                    await updateMultiAttributeLoginConfig(
                        onboardingData.signInOptions.identifiers,
                        isAlphanumericUsername
                    );
                } catch (_multiAttrError) {
                    // Silently handle - app was created successfully, multi-attribute config is secondary
                }
            }

            // Update application branding if customized (logo or color changed from defaults)
            if (onboardingData.brandingConfig && isBrandingCustomized(onboardingData.brandingConfig)) {
                try {
                    await updateApplicationBranding(result.applicationId, onboardingData.brandingConfig);
                } catch (_brandingError) {
                    // Application was created successfully, but branding failed.
                    // Show warning to inform user but don't block the primary flow.
                    dispatch(addAlert({
                        description: "Application created successfully, but custom branding could not be applied.",
                        level: AlertLevels.WARNING,
                        message: "Branding Not Applied"
                    }));
                }
            }

            setCreatedApplication(result);

            const appName: string = onboardingData.applicationName || "your application";
            const alertMessage: string = isTourFlow
                ? "Try It app is ready for preview."
                : `Application "${appName}" has been created successfully.`;

            dispatch(addAlert({
                description: alertMessage,
                level: AlertLevels.SUCCESS,
                message: isTourFlow ? "Preview Ready" : "Application Created"
            }));

            setCurrentStep(OnboardingStep.SUCCESS);
        } catch (error: unknown) {
            const errorMessage: string = (error as any)?.response?.data?.description ||
                                        (error as any)?.message ||
                                        "Failed to create application. Please try again.";

            dispatch(addAlert({
                description: errorMessage,
                level: AlertLevels.ERROR,
                message: "Application Creation Failed"
            }));
        } finally {
            setIsCreatingApp(false);
        }
    }, [
        onboardingData, mergedTemplate, setCreatedApplication, dispatch,
        isAlphanumericUsername, isM2M, isTourFlow, tenantDomain, asgardeoTryItURL
    ]);

    const handleNext: () => Promise<void> = useCallback(async (): Promise<void> => {
        const nextStep: OnboardingStep = getNextStep(currentStep, onboardingData);

        if (currentStep === OnboardingStep.SUCCESS) {
            SessionStorageUtils.clearItemFromSessionStorage(WIZARD_STEP_STORAGE_KEY);
            onComplete(onboardingData);
        } else if (
            // Create app when clicking Finish from Design Login
            currentStep === OnboardingStep.DESIGN_LOGIN ||
            // Or when clicking Create Application from M2M template selection (M2M skips other steps)
            (currentStep === OnboardingStep.SELECT_APPLICATION_TEMPLATE && isM2M)
        ) {
            // Create the application before navigating to success
            setDirection("forward");
            await createApplication();
        } else {
            setDirection("forward");
            setCurrentStep(nextStep);
        }
    }, [ currentStep, onboardingData, isM2M, createApplication, onComplete ]);

    const handleBack: () => void = useCallback((): void => {
        const previousStep: OnboardingStep = getPreviousStep(currentStep, onboardingData);

        setDirection("backward");
        setCurrentStep(previousStep);
    }, [ currentStep, onboardingData ]);

    const handleSkip: () => void = useCallback((): void => {
        SessionStorageUtils.clearItemFromSessionStorage(WIZARD_STEP_STORAGE_KEY);
        onSkip();
    }, [ onSkip ]);

    const isFirstStep: boolean = visibleStep === OnboardingStep.WELCOME;
    const isSuccessStep: boolean = visibleStep === OnboardingStep.SUCCESS;
    const nextButtonText: string = getNextButtonText(visibleStep, onboardingData);

    const transitionOffset: string = direction === "forward" ? "-60px" : "60px";
    const transitionStyles: Record<string, string | number> = phase === "idle"
        ? { opacity: 1, transform: "translateX(0)" }
        : phase === "exiting"
            ? { opacity: 0, transform: `translateX(${transitionOffset})` }
            : { opacity: 0, transform: `translateX(${transitionOffset === "-60px" ? "60px" : "-60px"})` };

    return (
        <ContentCard data-componentid={ componentId }>
            <StepTransitionWrapper sx={ transitionStyles }>
                { visibleStep === OnboardingStep.WELCOME && (
                    <WelcomeStep
                        data-componentid={ `${componentId}-welcome` }
                        greeting={ greeting }
                        onChoiceSelect={ updateChoice }
                        selectedChoice={ onboardingData.choice }
                    />
                ) }

                { visibleStep === OnboardingStep.NAME_APPLICATION && (
                    <NameApplicationStep
                        applicationName={ onboardingData.applicationName || "" }
                        data-componentid={ `${componentId}-name-application` }
                        onApplicationNameChange={ updateApplicationName }
                        randomNames={ randomNames }
                    />
                ) }

                { visibleStep === OnboardingStep.SELECT_APPLICATION_TEMPLATE && (
                    <SelectApplicationTemplateStep
                        data-componentid={ `${componentId}-select-application-template` }
                        onTemplateSelect={ updateTemplateSelection }
                        selectedFramework={ onboardingData.framework }
                        selectedTemplateId={ onboardingData.templateId }
                    />
                ) }

                { visibleStep === OnboardingStep.CONFIGURE_REDIRECT_URL && (
                    <ConfigureRedirectUrlStep
                        data-componentid={ `${componentId}-configure-redirect-url` }
                        framework={ onboardingData.framework }
                        onRedirectUrlsChange={ updateRedirectUrls }
                        redirectUrls={ onboardingData.redirectUrls || [] }
                        templateId={ onboardingData.templateId }
                    />
                ) }

                { visibleStep === OnboardingStep.SIGN_IN_OPTIONS && (
                    <SignInOptionsStep
                        brandingConfig={ onboardingData.brandingConfig }
                        data-componentid={ `${componentId}-sign-in-options` }
                        isAlphanumericUsername={ isAlphanumericUsername }
                        onSignInOptionsChange={ updateSignInOptions }
                        signInOptions={ onboardingData.signInOptions }
                    />
                ) }

                { visibleStep === OnboardingStep.DESIGN_LOGIN && (
                    <DesignLoginStep
                        brandingConfig={ onboardingData.brandingConfig }
                        data-componentid={ `${componentId}-design-login` }
                        isAlphanumericUsername={ isAlphanumericUsername }
                        onBrandingConfigChange={ updateBrandingConfig }
                        signInOptions={ onboardingData.signInOptions }
                    />
                ) }

                { visibleStep === OnboardingStep.SUCCESS && (
                    <SuccessStep
                        brandingConfig={ onboardingData.brandingConfig }
                        createdApplication={ onboardingData.createdApplication }
                        data-componentid={ `${componentId}-success` }
                        framework={ onboardingData.framework }
                        isM2M={ isM2M }
                        isTourFlow={ isTourFlow }
                        redirectUrls={ onboardingData.redirectUrls }
                        signInOptions={ onboardingData.signInOptions }
                        templateId={ onboardingData.templateId }
                    />
                ) }
            </StepTransitionWrapper>

            <Footer>
                { !isSuccessStep && (
                    <Button
                        data-componentid={ `${componentId}-skip-button` }
                        onClick={ handleSkip }
                        variant="text"
                    >
                        Skip and go to Console
                    </Button>
                ) }
                <ActionButtons sx={ isSuccessStep ? { ml: "auto" } : undefined }>
                    { !isFirstStep && !isSuccessStep && (
                        <SecondaryButton
                            data-componentid={ `${componentId}-back-button` }
                            disabled={ isAnimating }
                            onClick={ handleBack }
                            variant="outlined"
                        >
                            Back
                        </SecondaryButton>
                    ) }
                    <PrimaryButton
                        color="primary"
                        data-componentid={ `${componentId}-next-button` }
                        disabled={ isNextDisabled || isCreatingApp || isAnimating }
                        onClick={ handleNext }
                        variant="contained"
                    >
                        { isCreatingApp ? "Creating..." : nextButtonText }
                    </PrimaryButton>
                </ActionButtons>
            </Footer>
        </ContentCard>
    );
};

export default OnboardingWizard;
