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

import { Theme, alpha, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import React, { FunctionComponent, ReactElement, memo } from "react";
import { SelectableCardProps } from "../../models";

type CardVariant = "default" | "compact";

interface StyledCardProps {
    isSelected?: boolean;
    variant?: CardVariant;
}

/**
 * Styled card container with variant support.
 * - default: horizontal layout with icon background, left accent border when selected
 * - compact: smaller horizontal layout for grid display
 */
const StyledCard: any = styled(Box, {
    shouldForwardProp: (prop: string) => prop !== "isSelected" && prop !== "variant"
})<StyledCardProps>(({ theme, isSelected, variant = "default" }: StyledCardProps & { theme: Theme }) => ({
    "&:hover": {
        backgroundColor: isSelected
            ? alpha(theme.palette.primary.main, 0.08)
            : alpha(theme.palette.action.hover, 0.04)
    },
    alignItems: "center",
    backgroundColor: isSelected
        ? alpha(theme.palette.primary.main, 0.08)
        : theme.palette.background.paper,
    border: `1px solid ${isSelected ? "transparent" : theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius * 1.5,
    boxShadow: isSelected ? `inset 4px 0 0 0 ${theme.palette.primary.main}` : "none",
    cursor: "pointer",
    display: "flex",
    flexDirection: "row",
    transition: "all 0.2s ease-in-out",
    ...(variant === "compact" ? {
        gap: theme.spacing(1.5),
        minWidth: 120,
        padding: theme.spacing(1.5, 2)
    } : {
        gap: theme.spacing(2),
        padding: theme.spacing(2, 2.5)
    })
}));

interface IconContainerProps {
    variant?: CardVariant;
}

/**
 * Icon container - adjusts size based on variant.
 */
const IconContainer: any = styled(Box, {
    shouldForwardProp: (prop: string) => prop !== "variant"
})<IconContainerProps>(({ theme, variant = "default" }: IconContainerProps & { theme: Theme }) => ({
    "& svg": {
        height: 24,
        width: 24
    },
    alignItems: "center",
    display: "flex",
    flexShrink: 0,
    justifyContent: "center",
    ...(variant === "compact" ? {
        height: 32,
        width: 32
    } : {
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
        height: 48,
        width: 48
    })
}));

/**
 * Text content container.
 */
const ContentContainer: any = styled(Box)({
    display: "flex",
    flexDirection: "column",
    gap: 2
});

interface CardTitleProps {
    cardVariant?: CardVariant;
}

/**
 * Card title - adjusts based on variant.
 */
const CardTitle: any = styled(Typography, {
    shouldForwardProp: (prop: string) => prop !== "cardVariant"
})<CardTitleProps>(({ theme, cardVariant = "default" }: CardTitleProps & { theme: Theme }) => ({
    color: theme.palette.text.primary,
    lineHeight: 1.4,
    ...(cardVariant === "compact" ? {
        fontSize: "0.875rem",
        fontWeight: 500
    } : {
        fontSize: "0.9375rem",
        fontWeight: 600
    })
}));

/**
 * Card description.
 */
const CardDescription: any = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem",
    lineHeight: 1.5
}));

/**
 * Reusable selectable card component for onboarding choices.
 * Supports two variants:
 * - "default": Full card with icon, title, and optional description
 * - "compact": Smaller card with icon and title only (for framework selection grid)
 */
const SelectableCard: FunctionComponent<SelectableCardProps> = memo((
    props: SelectableCardProps
): ReactElement => {
    const {
        description,
        icon,
        isSelected,
        onClick,
        testId,
        title,
        variant = "default",
        ["data-componentid"]: componentId = "selectable-card"
    } = props;

    return (
        <StyledCard
            data-componentid={ componentId }
            data-testid={ testId }
            isSelected={ isSelected }
            onClick={ onClick }
            variant={ variant }
        >
            { icon && (
                <IconContainer variant={ variant }>
                    { icon }
                </IconContainer>
            ) }
            <ContentContainer>
                <CardTitle cardVariant={ variant }>
                    { title }
                </CardTitle>
                { variant === "default" && description && (
                    <CardDescription>
                        { description }
                    </CardDescription>
                ) }
            </ContentContainer>
        </StyledCard>
    );
});

SelectableCard.displayName = "SelectableCard";

export default SelectableCard;
