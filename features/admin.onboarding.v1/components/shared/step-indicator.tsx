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

import { alpha, styled } from "@mui/material/styles";
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
const StepIndicatorContainer = styled(Box)(({ theme }) => ({
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    borderRadius: theme.shape.borderRadius * 2,
    padding: theme.spacing(6),
    minWidth: 250
}));

/**
 * Header text
 */
const StepIndicatorHeader = styled(Typography)(({ theme }) => ({
    fontSize: "0.875rem",
    fontWeight: 500,
    color: theme.palette.text.primary,
    marginBottom: theme.spacing(3)
}));    

/**
 * Steps list container - uses CSS grid for alignment
 */
const StepsList = styled(Box)(({ theme }) => ({
    display: "grid",
    gridTemplateColumns: "12px 1fr",
    gap: theme.spacing(0, 2),
    alignItems: "start"
}));

/**
 * Orange dot indicator
 */
const StepDot = styled(Box)(({ theme }) => ({
    width: 12,
    height: 12,
    borderRadius: "50%",
    backgroundColor: theme.palette.primary.main,
    flexShrink: 0,
    marginTop: 2,
    margin: "8px 0 8px 0"
}));

/**
 * Dashed connector line between dots - centered in the grid column
 */
const DashedConnector = styled(Box)(({ theme }) => ({
    height: 24,
    borderLeft: `1px solid ${theme.palette.grey[300]}`,
    justifySelf: "center"
}));

/**
 * Step label text
 */
const StepLabel = styled(Typography)(({ theme }) => ({
    fontSize: "0.875rem",
    fontWeight: 500,
    color: theme.palette.text.primary,
    lineHeight: 1.4
}));

/**
 * Empty spacer for grid alignment when connector is shown
 */
const EmptySpacer = styled(Box)({});

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
                        { /* Dot */ }
                        <StepDot />
                        { /* Label */ }
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
