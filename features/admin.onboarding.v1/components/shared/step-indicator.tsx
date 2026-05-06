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

import StepConnector from "@mui/material/StepConnector";
import { Theme, alpha, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Step from "@oxygen-ui/react/Step";
import StepLabel from "@oxygen-ui/react/StepLabel";
import Stepper from "@oxygen-ui/react/Stepper";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, memo } from "react";

/**
 * Step configuration interface.
 */
export interface StepConfigInterface {
    /**
     * Short description of what happens in this step.
     */
    description?: string;
    /**
     * Unique key for the step.
     */
    key: string;
    /**
     * Display label for the step.
     */
    label: string;
}

/**
 * Props interface for StepIndicator component.
 */
interface StepIndicatorPropsInterface extends IdentifiableComponentInterface {
    /**
     * Array of step configurations.
     */
    steps: StepConfigInterface[];
    /**
     * Visual variant. "dark" renders white text for use on gradient backgrounds.
     */
    variant?: "default" | "dark";
}

// ============================================================================
// Styled Components — Default variant
// ============================================================================

const StepIndicatorContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    borderRadius: theme.shape.borderRadius * 2,
    minWidth: 260,
    padding: theme.spacing(5, 6)
}));

const StepIndicatorHeader: typeof Typography = styled(Typography)(
    ({ theme }: { theme: Theme }) => ({
        color: theme.palette.primary.main,
        fontSize: "1.4rem",
        fontWeight: 600,
        marginBottom: theme.spacing(3)
    })
);

const NumberedDot: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.primary.main,
    borderRadius: "50%",
    color: "#fff",
    display: "flex",
    fontSize: "0.75rem",
    fontWeight: 700,
    height: 28,
    justifyContent: "center",
    width: 28
}));

const CustomConnector: typeof StepConnector = styled(StepConnector)(
    ({ theme }: { theme: Theme }) => ({
        "& .MuiStepConnector-line": {
            borderColor: theme.palette.grey[300],
            borderLeftWidth: 2,
            minHeight: 56
        },
        "&.MuiStepConnector-root": {
            marginLeft: 13
        }
    })
);

// ============================================================================
// Styled Components — Dark variant (for gradient backgrounds)
// ============================================================================

const DarkNumberedDot: typeof Box = styled(Box)(() => ({
    alignItems: "center",
    backgroundColor: alpha("#fff", 0.25),
    borderRadius: "50%",
    color: "#fff",
    display: "flex",
    fontSize: "0.75rem",
    fontWeight: 700,
    height: 28,
    justifyContent: "center",
    width: 28
}));

const DarkConnector: typeof StepConnector = styled(StepConnector)(() => ({
    "& .MuiStepConnector-line": {
        borderColor: alpha("#fff", 0.3),
        borderLeftWidth: 2,
        minHeight: 56
    },
    "&.MuiStepConnector-root": {
        marginLeft: 13
    }
}));

// ============================================================================
// Shared
// ============================================================================

const StyledStepper: typeof Stepper = styled(Stepper)(() => ({
    "& .MuiStep-root": {
        paddingBottom: 0,
        paddingTop: 0
    },
    "& .MuiStepLabel-iconContainer": {
        paddingRight: 16
    },
    "& .MuiStepLabel-root": {
        padding: 0
    },
    padding: 0
}));

// ============================================================================
// Component
// ============================================================================

/**
 * Step indicator component showing numbered steps.
 * Supports "default" and "dark" variants.
 */
const StepIndicator: FunctionComponent<StepIndicatorPropsInterface> = memo((
    props: StepIndicatorPropsInterface
): ReactElement => {
    const {
        steps,
        variant = "default",
        ["data-componentid"]: componentId = "step-indicator"
    } = props;

    const isDark: boolean = variant === "dark";

    return (
        <StepIndicatorContainer data-componentid={ componentId }>
            <StepIndicatorHeader
                sx={ isDark ? { color: "#fff" } : undefined }
            >
                What you&apos;ll do
            </StepIndicatorHeader>
            <StyledStepper
                activeStep={ -1 }
                connector={ isDark ? <DarkConnector /> : <CustomConnector /> }
                orientation="vertical"
            >
                { steps.map((step: StepConfigInterface, index: number) => (
                    <Step
                        active={ false }
                        key={ step.key }
                    >
                        <StepLabel
                            StepIconComponent={
                                () => isDark
                                    ? <DarkNumberedDot>{ index + 1 }</DarkNumberedDot>
                                    : <NumberedDot>{ index + 1 }</NumberedDot>
                            }
                            data-componentid={ `${componentId}-step-${step.key}` }
                        >
                            <Box>
                                <Typography
                                    sx={ {
                                        color: isDark ? "#fff" : "text.primary",
                                        fontSize: "0.9rem",
                                        fontWeight: 500,
                                        lineHeight: 1.4
                                    } }
                                >
                                    { step.label }
                                </Typography>
                                { step.description && (
                                    <Typography
                                        sx={ {
                                            color: isDark
                                                ? alpha("#fff", 0.7)
                                                : "text.secondary",
                                            fontSize: "0.78rem",
                                            lineHeight: 1.4,
                                            mt: 0.3
                                        } }
                                    >
                                        { step.description }
                                    </Typography>
                                ) }
                            </Box>
                        </StepLabel>
                    </Step>
                )) }
            </StyledStepper>
        </StepIndicatorContainer>
    );
});

StepIndicator.displayName = "StepIndicator";

export default StepIndicator;
