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

import { useMoesifAnalytics } from "@wso2is/admin.analytics.v1/hooks/use-moesif-analytics";
import { FeatureConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { AppState } from "@wso2is/admin.core.v1/store";
import { ProfileInfoInterface } from "@wso2is/core/models";
import React, { useCallback, useRef } from "react";
import { useSelector } from "react-redux";
import { OnboardingAnalyticsEvents } from "../constants";
import { OnboardingChoice, OnboardingDataInterface, OnboardingStep } from "../models/onboarding";

/**
 * Parameters for the useOnboardingAnalytics hook.
 */
interface UseOnboardingAnalyticsParams {
    currentStep: OnboardingStep;
    isReturningUser: boolean;
    onboardingData: OnboardingDataInterface;
    userAccountType?: string | null;
}

/**
 * Return type for the useOnboardingAnalytics hook.
 */
interface UseOnboardingAnalyticsReturn {
    trackCompleted: () => void;
    trackSkipped: (fromStep: OnboardingStep, fromStepName: string) => void;
    trackStarted: () => void;
    trackStepBack: (fromStep: OnboardingStep, toStep: OnboardingStep) => void;
    trackStepCompleted: (
        stepNumber: OnboardingStep,
        stepName: string,
        extraMetadata?: Record<string, unknown>
    ) => void;
}

/**
 * Total step counts per wizard path (excluding lifecycle events started/completed).
 */
const TOTAL_STEPS_FULL_SETUP: number = 6;
const TOTAL_STEPS_PREVIEW: number = 3;

/**
 * Hook that provides Moesif analytics tracking for the onboarding wizard.
 * Consumes the shared MoesifAnalyticsProvider for SDK access and adds
 * onboarding-specific metadata and event logic.
 *
 * @param params - Hook parameters including current step, data, and returning user flag.
 * @returns Object with tracking functions for each wizard event.
 */
export const useOnboardingAnalytics = (params: UseOnboardingAnalyticsParams): UseOnboardingAnalyticsReturn => {
    const { currentStep, isReturningUser, onboardingData, userAccountType } = params;

    const { track, isEnabled } = useMoesifAnalytics();

    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) => state.profile.profileInfo);
    const featureConfig: FeatureConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features
    );

    const featureDeployedDate: string | undefined = featureConfig?.onboarding?.featureDeployedDate;

    const visitedStepsRef: React.MutableRefObject<Set<number>> = useRef<Set<number>>(new Set<number>());
    const startTimeRef: React.MutableRefObject<number> = useRef<number>(Date.now());

    /**
     * Compute whether the current user is "new" based on SCIM2 meta.created date.
     */
    const getIsNewUser: () => boolean = useCallback((): boolean => {
        const createdDate: string = profileInfo?.meta?.created;

        if (!createdDate || !featureDeployedDate) {
            return false;
        }

        return new Date(createdDate) >= new Date(featureDeployedDate);
    }, [ profileInfo?.meta?.created, featureDeployedDate ]);


    /**
     * Derive the wizard path string from the current onboarding choice.
     */
    const getWizardPath: () => string = useCallback((): string => {
        return onboardingData.choice === OnboardingChoice.SETUP ? "full_setup" : "preview";
    }, [ onboardingData.choice ]);

    /**
     * Build the common metadata object included in every analytics event.
     *
     * @param stepNumber - The current wizard step number.
     * @param stepName - The step name identifier (for step events) or empty string (for lifecycle events).
     * @returns Metadata object for the event.
     */
    const buildCommonMetadata: (
        stepNumber: OnboardingStep,
        stepName: string
    ) => Record<string, unknown> = useCallback(
        (stepNumber: OnboardingStep, stepName: string): Record<string, unknown> => {
            const wizardPath: string = getWizardPath();
            const isRevisit: boolean = visitedStepsRef.current.has(stepNumber);

            visitedStepsRef.current.add(stepNumber);

            return {
                asset_type: "console",
                context: "onboarding",
                domain: window.location.hostname,
                is_new_user: getIsNewUser(),
                is_revisit: isRevisit,
                product: "identity",
                step_name: stepName,
                step_number: stepNumber,
                total_steps: wizardPath === "full_setup" ? TOTAL_STEPS_FULL_SETUP : TOTAL_STEPS_PREVIEW,
                user_type: userAccountType ?? null,
                wizard_path: wizardPath
            };
        },
        [ getIsNewUser, getWizardPath, userAccountType ]
    );

    /**
     * Fire a Moesif track event with common metadata and optional extra properties.
     * Skips tracking for returning users (re-launched wizard from homepage).
     */
    const trackEvent: (
        eventName: string,
        stepNumber: OnboardingStep,
        stepName: string,
        extra?: Record<string, unknown>
    ) => void = useCallback(
        (
            eventName: string,
            stepNumber: OnboardingStep,
            stepName: string,
            extra?: Record<string, unknown>
        ): void => {
            if (!isEnabled || isReturningUser) {
                return;
            }

            const metadata: Record<string, unknown> = {
                ...buildCommonMetadata(stepNumber, stepName),
                ...extra
            };

            track(eventName, metadata);
        },
        [ isEnabled, isReturningUser, buildCommonMetadata, track ]
    );

    // ========================================================================
    // Lifecycle events
    // ========================================================================

    const trackStarted: () => void = useCallback((): void => {
        trackEvent(OnboardingAnalyticsEvents.STARTED, currentStep, "");
    }, [ trackEvent, currentStep ]);

    const trackCompleted: () => void = useCallback((): void => {
        const durationSeconds: number = Math.round((Date.now() - startTimeRef.current) / 1000);

        trackEvent(OnboardingAnalyticsEvents.COMPLETED, currentStep, "", {
            duration_seconds: durationSeconds
        });
    }, [ trackEvent, currentStep ]);

    const trackSkipped: (fromStep: OnboardingStep, fromStepName: string) => void = useCallback(
        (fromStep: OnboardingStep, fromStepName: string): void => {
            trackEvent(OnboardingAnalyticsEvents.SKIPPED, fromStep, fromStepName);
        },
        [ trackEvent ]
    );

    const trackStepBack: (fromStep: OnboardingStep, toStep: OnboardingStep) => void = useCallback(
        (fromStep: OnboardingStep, toStep: OnboardingStep): void => {
            trackEvent(OnboardingAnalyticsEvents.STEP_BACK, fromStep, "", {
                from_step: fromStep,
                to_step: toStep
            });
        },
        [ trackEvent ]
    );

    // ========================================================================
    // Step completion event (single event, differentiated by step_name metadata)
    // ========================================================================

    const trackStepCompleted: (
        stepNumber: OnboardingStep,
        stepName: string,
        extraMetadata?: Record<string, unknown>
    ) => void = useCallback(
        (
            stepNumber: OnboardingStep,
            stepName: string,
            extraMetadata?: Record<string, unknown>
        ): void => {
            trackEvent(OnboardingAnalyticsEvents.STEP_COMPLETED, stepNumber, stepName, extraMetadata);
        },
        [ trackEvent ]
    );

    return {
        trackCompleted,
        trackSkipped,
        trackStarted,
        trackStepBack,
        trackStepCompleted
    };
};
