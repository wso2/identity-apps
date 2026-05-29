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

import { Theme, alpha, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Typography from "@oxygen-ui/react/Typography";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement, ReactNode, memo, useCallback } from "react";

/**
 * Props for selectable card component.
 */
interface SelectableCardPropsInterface extends IdentifiableComponentInterface {
    isSelected: boolean;
    onClick: () => void;
    icon: ReactNode;
    title: string;
    description?: string;
    variant?: "default" | "compact" | "large";
}

type CardVariant = "default" | "compact" | "large";

interface StyledCardProps {
    isSelected?: boolean;
    variant?: CardVariant;
}

/**
 * Styled card container.
 * - default: vertical layout with prominent icon, hover elevation, selection checkmark
 * - compact: smaller horizontal layout for grid display
 */
const StyledCard: any = styled(Box, {
    shouldForwardProp: (prop: string) => prop !== "isSelected" && prop !== "variant"
})<StyledCardProps>(({ theme, isSelected, variant = "default" }: StyledCardProps & { theme: Theme }) => {
    const isCompact: boolean = variant === "compact";

    return {
        "&:focus-visible": {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2
        },
        "&:hover": {
            ...(!isSelected && {
                boxShadow: theme.shadows[3],
                transform: "translateY(-1px)"
            })
        },
        alignItems: isCompact ? "center" : "flex-start",
        backgroundColor: isSelected
            ? alpha(theme.palette.primary.main, 0.06)
            : theme.palette.background.paper,
        border: isSelected
            ? `1.5px solid ${theme.palette.primary.main}`
            : `1.5px solid ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius * 2,
        cursor: "pointer",
        display: "flex",
        flexDirection: isCompact ? "row" : "row",
        gap: isCompact ? theme.spacing(1.5) : theme.spacing(2.5),
        padding: isCompact
            ? theme.spacing(2, 2.5)
            : theme.spacing(2.5, 3),
        position: "relative",
        transition: "all 0.2s ease-in-out"
    };
});

interface IconContainerProps {
    variant?: CardVariant;
}

/**
 * Icon container with primary-tinted background.
 */
const IconContainer: any = styled(Box, {
    shouldForwardProp: (prop: string) => prop !== "variant"
})<IconContainerProps>(({ variant = "default" }: IconContainerProps & { theme: Theme }) => {
    const isLarge: boolean = variant === "large";

    return {
        "& img, & svg": {
            height: isLarge ? 44 : 32,
            width: isLarge ? 44 : 32
        },
        alignItems: "center",
        display: "flex",
        flexShrink: 0,
        height: isLarge ? 44 : 40,
        justifyContent: "center",
        width: isLarge ? 44 : 40
    };
});

/**
 * Text content container.
 */
const ContentContainer: any = styled(Box)({
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: 4
});

interface CardTitleProps {
    cardVariant?: CardVariant;
}

/**
 * Card title.
 */
const CardTitle: any = styled(Typography, {
    shouldForwardProp: (prop: string) => prop !== "cardVariant"
})<CardTitleProps>(({ theme }: CardTitleProps & { theme: Theme }) => ({
    color: theme.palette.text.primary,
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.4
}));

/**
 * Card description.
 */
const CardDescription: any = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.9375rem",
    lineHeight: 1.5
}));

/**
 * Reusable selectable card component for onboarding choices.
 * Supports two variants:
 * - "default": Card with icon, title, description, and selection checkmark
 * - "compact": Smaller card with icon and title only (for framework selection grid)
 */
const SelectableCard: FunctionComponent<SelectableCardPropsInterface> = memo((
    props: SelectableCardPropsInterface
): ReactElement => {
    const {
        description,
        icon,
        isSelected,
        onClick,
        title,
        variant = "default",
        ["data-componentid"]: componentId = "selectable-card"
    } = props;

    const handleKeyDown: (event: React.KeyboardEvent) => void = useCallback(
        (event: React.KeyboardEvent): void => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
            }
        },
        [ onClick ]
    );

    return (
        <StyledCard
            aria-label={ title }
            aria-pressed={ isSelected }
            data-componentid={ componentId }
            isSelected={ isSelected }
            onClick={ onClick }
            onKeyDown={ handleKeyDown }
            role="button"
            tabIndex={ 0 }
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
                { variant !== "compact" && description && (
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
