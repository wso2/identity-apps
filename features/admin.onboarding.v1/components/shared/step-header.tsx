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

import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";

/**
 * Props interface for StepHeader component.
 */
export interface StepHeaderPropsInterface extends IdentifiableComponentInterface {
    /**
     * Optional subtitle/description text.
     */
    subtitle?: string;
    /**
     * Main heading text.
     */
    title: string;
}

/**
 * Container for the step header.
 */
const StepHeaderContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2)
}));

/**
 * Main title styling.
 */
const Title: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.primary,
    fontWeight: 600,
    lineHeight: 1.3
}));

/**
 * Subtitle styling.
 */
const Subtitle: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "15px"
}));

/**
 * Header component for onboarding wizard steps.
 * Displays a title and optional subtitle.
 */
const StepHeader: FunctionComponent<StepHeaderPropsInterface> = (props: StepHeaderPropsInterface): ReactElement => {
    const {
        subtitle,
        title,
        ["data-componentid"]: componentId = "step-header"
    } = props;

    return (
        <StepHeaderContainer data-componentid={ componentId }>
            <Title variant="h2">
                { title }
            </Title>
            { subtitle && (
                <Subtitle variant="body1">
                    { subtitle }
                </Subtitle>
            ) }
        </StepHeaderContainer>
    );
};

StepHeader.displayName = "StepHeader";

export default StepHeader;
