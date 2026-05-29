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

import { ApplicationTemplateIdTypes } from "@wso2is/admin.applications.v1/models/application";
import { useMemo } from "react";
import { OnboardingChoice, OnboardingDataInterface, OnboardingStep } from "../models/onboarding";

/**
 * Status of a step in the progress stepper.
 */
type ProgressStepStatus = "completed" | "current" | "upcoming";

/**
 * A single step in the progress stepper.
 */
export interface ProgressStepInterface {
    key: OnboardingStep;
    label: string;
    status: ProgressStepStatus;
}

/**
 * Return type for the useStepProgress hook.
 */
interface UseStepProgressReturnInterface {
    currentStepIndex: number;
    isVisible: boolean;
    steps: ProgressStepInterface[];
    totalSteps: number;
}

/**
 * Step definition used internally to map enum values to labels.
 */
interface StepDefinitionInterface {
    key: OnboardingStep;
    label: string;
}

/**
 * Steps for the full Setup flow (non-M2M).
 */
const SETUP_STEPS: StepDefinitionInterface[] = [
    { key: OnboardingStep.NAME_APPLICATION, label: "Name App" },
    { key: OnboardingStep.SELECT_APPLICATION_TEMPLATE, label: "App Type" },
    { key: OnboardingStep.CONFIGURE_REDIRECT_URL, label: "Redirect URL" },
    { key: OnboardingStep.SIGN_IN_OPTIONS, label: "Sign-In" },
    { key: OnboardingStep.DESIGN_LOGIN, label: "Design" }
];

/**
 * Steps for the Tour flow.
 */
const TOUR_STEPS: StepDefinitionInterface[] = [
    { key: OnboardingStep.SIGN_IN_OPTIONS, label: "Sign-In" },
    { key: OnboardingStep.DESIGN_LOGIN, label: "Design" }
];

/**
 * Steps for the M2M flow (Setup + M2M template selected).
 */
const M2M_STEPS: StepDefinitionInterface[] = [
    { key: OnboardingStep.NAME_APPLICATION, label: "Name App" },
    { key: OnboardingStep.SELECT_APPLICATION_TEMPLATE, label: "App Type" }
];

/**
 * Hook that computes progress stepper state based on the current wizard step and data.
 * Dynamically adapts to the three possible wizard flows (Setup, Tour, M2M).
 *
 * @param currentStep - The currently visible wizard step
 * @param onboardingData - The current onboarding data (determines flow path)
 * @returns Progress stepper state including steps, current index, and visibility
 */
export const useStepProgress = (
    currentStep: OnboardingStep,
    onboardingData: OnboardingDataInterface
): UseStepProgressReturnInterface => {
    const isVisible: boolean = useMemo(
        () => currentStep !== OnboardingStep.WELCOME && currentStep !== OnboardingStep.SUCCESS,
        [ currentStep ]
    );

    const activeStepDefinitions: StepDefinitionInterface[] = useMemo(() => {
        if (onboardingData.choice === OnboardingChoice.TOUR) {
            return TOUR_STEPS;
        }

        // M2M flow: only show 2 steps once M2M template is actually selected
        if (onboardingData.templateId === ApplicationTemplateIdTypes.M2M_APPLICATION) {
            return M2M_STEPS;
        }

        return SETUP_STEPS;
    }, [ onboardingData.choice, onboardingData.templateId ]);

    const currentStepIndex: number = useMemo(() => {
        const index: number = activeStepDefinitions.findIndex(
            (step: StepDefinitionInterface) => step.key === currentStep
        );

        return Math.max(0, index);
    }, [ activeStepDefinitions, currentStep ]);

    const steps: ProgressStepInterface[] = useMemo(
        () => activeStepDefinitions.map(
            (step: StepDefinitionInterface, index: number): ProgressStepInterface => {
                let status: ProgressStepStatus;

                if (index < currentStepIndex) {
                    status = "completed";
                } else if (index === currentStepIndex) {
                    status = "current";
                } else {
                    status = "upcoming";
                }

                return {
                    key: step.key,
                    label: step.label,
                    status
                };
            }
        ),
        [ activeStepDefinitions, currentStepIndex ]
    );

    return {
        currentStepIndex,
        isVisible,
        steps,
        totalSteps: activeStepDefinitions.length
    };
};
