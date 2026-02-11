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

import { Theme, alpha, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, memo } from "react";

/**
 * Step configuration interface.
 */
export interface StepConfigInterface {
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
export interface StepIndicatorPropsInterface extends IdentifiableComponentInterface {
    /**
     * Array of step configurations.
     */
    steps: StepConfigInterface[];
}

/**
 * Container for the step indicator
 */
const StepIndicatorContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderRadius: theme.shape.borderRadius * 2,
    minWidth: 250,
    padding: theme.spacing(6)
}));

/**
 * Header text
 */
const StepIndicatorHeader: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.primary,
    fontSize: "0.875rem",
    fontWeight: 500,
    marginBottom: theme.spacing(3)
}));

/**
 * Steps list container - uses CSS grid for alignment
 */
const StepsList: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "start",
    display: "grid",
    gap: theme.spacing(0, 2),
    gridTemplateColumns: "12px 1fr"
}));

/**
 * Orange dot indicator
 */
const StepDot: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.primary.main,
    borderRadius: "50%",
    flexShrink: 0,
    height: 12,
    margin: "8px 0 8px 0",
    marginTop: 2,
    width: 12
}));

/**
 * Dashed connector line between dots - centered in the grid column
 */
const DashedConnector: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    borderLeft: `1px solid ${theme.palette.grey[300]}`,
    height: 24,
    justifySelf: "center"
}));

/**
 * Step label text
 */
const StepLabel: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.primary,
    fontSize: "0.875rem",
    fontWeight: 500,
    lineHeight: 1.4
}));

/**
 * Empty spacer for grid alignment when connector is shown
 */
const EmptySpacer: typeof Box = styled(Box)({});

/**
 * Step indicator component showing progress through steps.
 * Displays on the right side of the welcome card.
 */
const StepIndicator: FunctionComponent<StepIndicatorPropsInterface> = memo((
    props: StepIndicatorPropsInterface
): ReactElement => {
    const {
        steps,
        ["data-componentid"]: componentId = "step-indicator"
    } = props;

    return (
        <StepIndicatorContainer data-componentid={ componentId }>
            <StepIndicatorHeader>
                What you&apos;ll do
            </StepIndicatorHeader>
            <StepsList>
                { steps.map((step: StepConfigInterface, index: number) => (
                    <React.Fragment key={ step.key }>
                        <StepDot />
                        <StepLabel data-componentid={ `${componentId}-step-${step.key}` }>
                            { step.label }
                        </StepLabel>
                        { /* Connector (except after last item) */ }
                        { index < steps.length - 1 && (
                            <>
                                <DashedConnector />
                                <EmptySpacer />
                            </>
                        ) }
                    </React.Fragment>
                )) }
            </StepsList>
        </StepIndicatorContainer>
    );
});

StepIndicator.displayName = "StepIndicator";

export default StepIndicator;
