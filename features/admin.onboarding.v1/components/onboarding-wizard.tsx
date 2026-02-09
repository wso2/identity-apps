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
import { getUsernameConfiguration } from "@wso2is/admin.users.v1/utils/user-management-utils";
import { useValidationConfigData } from "@wso2is/admin.validation.v1/api";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement, useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    ActionButtons,
    ContentCard,
    Footer,
    PrimaryButton,
    SecondaryButton
} from "./shared/onboarding-styles";
import ConfigureRedirectUrlStep from "./steps/configure-redirect-url-step";
import DesignLoginStep from "./steps/design-login-step";
import NameApplicationStep from "./steps/name-application-step";
import SelectApplicationTemplateStep from "./steps/select-application-template-step";
import SignInOptionsStep from "./steps/sign-in-options-step";
import SuccessStep from "./steps/success-step";
import WelcomeStep from "./steps/welcome-step";
import { createOnboardingApplication } from "../api/create-onboarding-application";
import { updateMultiAttributeLoginConfig } from "../api/multi-attribute-login";
import { isBrandingCustomized, updateApplicationBranding } from "../api/update-onboarding-branding";
import {
    DEFAULT_BRANDING_CONFIG,
    DEFAULT_SIGN_IN_OPTIONS,
    OnboardingComponentIds,
    RANDOM_NAME_COUNT
} from "../constants";
import { useOnboardingData, useStepValidation } from "../hooks/use-onboarding-validation";
import { generateRandomNames } from "../utils/random-name-generator";
import {
    CreatedApplicationResult,
    OnboardingChoice,
    OnboardingData,
    OnboardingStep,
    OnboardingWizardProps
} from "../models";

/**
 * Get the next step based on current step and data.
 * Implements conditional navigation logic.
 */
const getNextStep = (currentStep: OnboardingStep, data: OnboardingData): OnboardingStep => {
    const isM2M: boolean = data.templateId === "m2m-application";
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
            // Only M2M apps skip to success (no redirect URL or sign-in options needed)
            // MCP apps need redirect URLs because they support authorization_code grant
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
const getPreviousStep = (currentStep: OnboardingStep, data: OnboardingData): OnboardingStep => {
    const isM2M: boolean = data.templateId === "m2m-application";
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
 * Get button text based on current step.
 * Shows "Create Application" for M2M apps (they skip to success from template selection).
 */
const getNextButtonText = (currentStep: OnboardingStep, data: OnboardingData): string => {
    const isM2M: boolean = data.templateId === "m2m-application";

    switch (currentStep) {
        case OnboardingStep.SELECT_APPLICATION_TEMPLATE:
            // Only M2M apps are created directly from this step (they skip other steps)
            if (isM2M) {
                return "Create Application";
            }

            return "Next";

        case OnboardingStep.DESIGN_LOGIN:
            return "Finish";

        case OnboardingStep.SUCCESS:
            return "Go to Console";

        default:
            return "Next";
    }
};

/**
 * Onboarding wizard component.
 * Manages step logic, navigation, and renders step content.
 * Layout (header, container) is owned by the parent page.
 */
const OnboardingWizard: FunctionComponent<OnboardingWizardProps & IdentifiableComponentInterface> = (
    props: OnboardingWizardProps & IdentifiableComponentInterface
): ReactElement => {
    const {
        initialData,
        onComplete,
        onSkip,
        ["data-componentid"]: componentId = OnboardingComponentIds.WIZARD
    } = props;

    const dispatch: Dispatch = useDispatch();
    const tenantDomain: string = useSelector((state: any) =>
        state?.auth?.tenantDomain || state?.config?.deployment?.tenant || "carbon.super"
    );

    const [ currentStep, setCurrentStep ] = useState<OnboardingStep>(OnboardingStep.WELCOME);
    const [ onboardingData, setOnboardingData ] = useState<OnboardingData>({
        brandingConfig: DEFAULT_BRANDING_CONFIG,
        choice: OnboardingChoice.SETUP,
        signInOptions: DEFAULT_SIGN_IN_OPTIONS,
        ...initialData
    });
    const [ isCreatingApp, setIsCreatingApp ] = useState<boolean>(false);

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
    } = useOnboardingData(onboardingData, setOnboardingData);

    const isNextDisabled: boolean = useStepValidation(currentStep, onboardingData);

    // Get validation config to determine if alphanumeric username is enabled
    // (alphanumeric = Identity Server, email-as-username = Asgardeo)
    const { data: validationData } = useValidationConfigData();
    const isAlphanumericUsername: boolean = useMemo(
        () => getUsernameConfiguration(validationData)?.enableValidator === "true",
        [ validationData ]
    );

    const isM2M: boolean = useMemo(
        () => onboardingData.templateId === "m2m-application",
        [ onboardingData.templateId ]
    );

    /**
     * Create the application.
     */
    const createApplication = useCallback(async (): Promise<void> => {
        setIsCreatingApp(true);

        try {
            // Create the application
            const result: CreatedApplicationResult = await createOnboardingApplication(onboardingData);


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
                    // Silently handle - app was created successfully, branding is secondary
                }
            }

            setCreatedApplication(result);

            dispatch(addAlert({
                description: `Application "${onboardingData.applicationName}" has been created successfully.`,
                level: AlertLevels.SUCCESS,
                message: "Application Created"
            }));

            // Navigate to success step
            setCurrentStep(OnboardingStep.SUCCESS);
        } catch (error: any) {
            // Show error message
            const errorMessage: string = error?.response?.data?.description ||
                                        error?.message ||
                                        "Failed to create application. Please try again.";

            dispatch(addAlert({
                description: errorMessage,
                level: AlertLevels.ERROR,
                message: "Application Creation Failed"
            }));
        } finally {
            setIsCreatingApp(false);
        }
    }, [ onboardingData, setCreatedApplication, dispatch, isAlphanumericUsername, isM2M ]);

    const handleNext = useCallback(async (): Promise<void> => {
        const nextStep: OnboardingStep = getNextStep(currentStep, onboardingData);

        if (currentStep === OnboardingStep.SUCCESS) {
            onComplete(onboardingData);
        } else if (
            // Create app when clicking Finish from Design Login
            currentStep === OnboardingStep.DESIGN_LOGIN ||
            // Or when clicking Create Application from M2M template selection (M2M skips other steps)
            (currentStep === OnboardingStep.SELECT_APPLICATION_TEMPLATE && isM2M)
        ) {
            // Create the application before navigating to success
            await createApplication();
        } else {
            setCurrentStep(nextStep);
        }
    }, [ currentStep, onboardingData, isM2M, createApplication, onComplete ]);

    const handleBack = useCallback((): void => {
        const previousStep: OnboardingStep = getPreviousStep(currentStep, onboardingData);

        setCurrentStep(previousStep);
    }, [ currentStep, onboardingData ]);

    const handleSkip = useCallback((): void => {
        onSkip();
    }, [ onSkip ]);

    const isFirstStep: boolean = currentStep === OnboardingStep.WELCOME;
    const isSuccessStep: boolean = currentStep === OnboardingStep.SUCCESS;
    const nextButtonText: string = getNextButtonText(currentStep, onboardingData);

    return (
        <ContentCard data-componentid={ componentId }>
            { currentStep === OnboardingStep.WELCOME && (
                <WelcomeStep
                    data-componentid={ `${componentId}-welcome` }
                    onChoiceSelect={ updateChoice }
                    selectedChoice={ onboardingData.choice }
                />
            ) }

            { currentStep === OnboardingStep.NAME_APPLICATION && (
                <NameApplicationStep
                    applicationName={ onboardingData.applicationName || "" }
                    data-componentid={ `${componentId}-name-application` }
                    onApplicationNameChange={ updateApplicationName }
                    randomNames={ randomNames }
                />
            ) }

            { currentStep === OnboardingStep.SELECT_APPLICATION_TEMPLATE && (
                <SelectApplicationTemplateStep
                    data-componentid={ `${componentId}-select-application-template` }
                    onTemplateSelect={ updateTemplateSelection }
                    selectedFramework={ onboardingData.framework }
                    selectedTemplateId={ onboardingData.templateId }
                />
            ) }

            { currentStep === OnboardingStep.CONFIGURE_REDIRECT_URL && (
                <ConfigureRedirectUrlStep
                    data-componentid={ `${componentId}-configure-redirect-url` }
                    framework={ onboardingData.framework }
                    onRedirectUrlsChange={ updateRedirectUrls }
                    redirectUrls={ onboardingData.redirectUrls || [] }
                    templateId={ onboardingData.templateId }
                />
            ) }

            { currentStep === OnboardingStep.SIGN_IN_OPTIONS && (
                <SignInOptionsStep
                    brandingConfig={ onboardingData.brandingConfig }
                    data-componentid={ `${componentId}-sign-in-options` }
                    isAlphanumericUsername={ isAlphanumericUsername }
                    onSignInOptionsChange={ updateSignInOptions }
                    signInOptions={ onboardingData.signInOptions }
                />
            ) }

            { currentStep === OnboardingStep.DESIGN_LOGIN && (
                <DesignLoginStep
                    brandingConfig={ onboardingData.brandingConfig }
                    data-componentid={ `${componentId}-design-login` }
                    isAlphanumericUsername={ isAlphanumericUsername }
                    onBrandingConfigChange={ updateBrandingConfig }
                    signInOptions={ onboardingData.signInOptions }
                />
            ) }

            { currentStep === OnboardingStep.SUCCESS && (
                <SuccessStep
                    brandingConfig={ onboardingData.brandingConfig }
                    createdApplication={ onboardingData.createdApplication }
                    data-componentid={ `${componentId}-success` }
                    framework={ onboardingData.framework }
                    isM2M={ isM2M }
                    redirectUrls={ onboardingData.redirectUrls }
                    signInOptions={ onboardingData.signInOptions }
                    templateId={ onboardingData.templateId }
                />
            ) }

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
                            onClick={ handleBack }
                            variant="outlined"
                        >
                            Back
                        </SecondaryButton>
                    ) }
                    <PrimaryButton
                        color="primary"
                        data-componentid={ `${componentId}-next-button` }
                        disabled={ isNextDisabled || isCreatingApp }
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
