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

import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, memo } from "react";
import { ProgressStepInterface } from "../../hooks/use-step-progress";

/**
 * Props interface for ProgressStepper component.
 */
interface ProgressStepperPropsInterface extends IdentifiableComponentInterface {
    currentStepIndex: number;
    steps: ProgressStepInterface[];
    totalSteps: number;
}

// ============================================================================
// Styled Components
// ============================================================================

/**
 * Wrapper that pulls the progress bar flush to the top of ContentCard.
 */
const ProgressBarWrapper: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    "@keyframes fadeIn": {
        from: { opacity: 0 },
        to: { opacity: 1 }
    },
    animation: "fadeIn 500ms ease forwards",
    marginBottom: theme.spacing(3),
    marginLeft: theme.spacing(-8),
    marginRight: theme.spacing(-8),
    marginTop: theme.spacing(-6)
}));

/**
 * Grey track that spans the full card width.
 */
const ProgressTrack: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.grey[200],
    height: 3,
    width: "100%"
}));

/**
 * Filled portion of the progress bar. Width is set dynamically via inline style.
 */
const ProgressFill: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.primary.main,
    borderRadius: "0 2px 2px 0",
    height: "100%",
    transition: "width 400ms ease"
}));

/**
 * Step label that sits below the progress bar.
 */
const StepText: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.disabled,
    fontSize: "0.75rem",
    fontWeight: 500,
    paddingRight: theme.spacing(8),
    paddingTop: theme.spacing(1.5),
    textAlign: "right"
}));

// ============================================================================
// Component
// ============================================================================

/**
 * Thin progress bar that sits flush at the top edge of the ContentCard.
 */
const ProgressStepper: FunctionComponent<ProgressStepperPropsInterface> = memo((
    props: ProgressStepperPropsInterface
): ReactElement => {
    const {
        currentStepIndex,
        steps,
        totalSteps,
        ["data-componentid"]: componentId = "onboarding-progress-stepper"
    } = props;

    // Current step is (index + 1) since index is 0-based.
    // Progress fills proportionally: completed steps + half of current step
    // to avoid the bar looking "done" before the user finishes the last step.
    const progressPercent: number = ((currentStepIndex + 0.5) / totalSteps) * 100;
    const currentStepLabel: string = steps[currentStepIndex]?.label ?? "";

    return (
        <ProgressBarWrapper data-componentid={ componentId }>
            <ProgressTrack
                aria-label="Wizard progress"
                aria-valuemax={ totalSteps }
                aria-valuemin={ 0 }
                aria-valuenow={ currentStepIndex + 1 }
                role="progressbar"
            >
                <ProgressFill style={ { width: `${progressPercent}%` } } />
            </ProgressTrack>
            <StepText>
                Step { currentStepIndex + 1 } of { totalSteps }
                { currentStepLabel ? ` \u2014 ${currentStepLabel}` : "" }
            </StepText>
        </ProgressBarWrapper>
    );
});

ProgressStepper.displayName = "ProgressStepper";

export default ProgressStepper;
