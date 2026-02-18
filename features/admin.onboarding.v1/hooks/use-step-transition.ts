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

import { useEffect, useRef, useState } from "react";
import { OnboardingStep } from "../models";

/**
 * Duration of each transition phase (exit and enter) in milliseconds.
 */
const ANIMATION_DURATION_MS: number = 250;

/**
 * Transition phase for the step animation lifecycle.
 */
export type TransitionPhase = "idle" | "exiting" | "entering";

/**
 * Return type for the useStepTransition hook.
 */
interface UseStepTransitionReturn {
    /**
     * Whether a transition is currently in progress.
     */
    isAnimating: boolean;
    /**
     * The current phase of the transition animation.
     */
    phase: TransitionPhase;
    /**
     * The step that should currently be rendered.
     * Lags behind the target step during exit animation.
     */
    visibleStep: OnboardingStep;
}

/**
 * Hook that observes step changes and manages CSS transition phases.
 *
 * @param targetStep - The step the wizard wants to navigate to.
 * @returns Transition state for rendering and animating steps.
 */
export const useStepTransition = (targetStep: OnboardingStep): UseStepTransitionReturn => {
    const [ visibleStep, setVisibleStep ] = useState<OnboardingStep>(targetStep);
    const [ phase, setPhase ] = useState<TransitionPhase>("idle");
    const exitTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null> =
        useRef<ReturnType<typeof setTimeout> | null>(null);
    const enterTimerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null> =
        useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect((): (() => void) | void => {
        if (targetStep === visibleStep) {
            return;
        }

        // Phase 1: Exit animation on the currently visible step.
        setPhase("exiting");

        exitTimerRef.current = setTimeout((): void => {
            // Phase 2: Swap to new step and start enter animation.
            setVisibleStep(targetStep);
            setPhase("entering");

            enterTimerRef.current = setTimeout((): void => {
                // Phase 3: Animation complete.
                setPhase("idle");
            }, ANIMATION_DURATION_MS);
        }, ANIMATION_DURATION_MS);

        return (): void => {
            if (exitTimerRef.current) {
                clearTimeout(exitTimerRef.current);
            }
            if (enterTimerRef.current) {
                clearTimeout(enterTimerRef.current);
            }
        };
    }, [ targetStep ]);

    const isAnimating: boolean = phase !== "idle";

    return {
        isAnimating,
        phase,
        visibleStep
    };
};
