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

import { Theme, styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import Button from "@oxygen-ui/react/Button";
import Typography from "@oxygen-ui/react/Typography";

/**
 * Vertical divider in header.
 */
export const HeaderDivider: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.divider,
    height: 20,
    width: 1
}));

/**
 * Content area that centers the main card.
 */
export const ContentArea: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    flex: 1,
    justifyContent: "center",
    overflow: "auto",
    padding: theme.spacing(3)
}));

/**
 * Main content card with shadow.
 */
export const ContentCard: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[1],
    display: "flex",
    flex: 1,
    flexDirection: "column",
    maxHeight: "calc(100vh - 100px)",
    minHeight: "85vh",
    maxWidth: 1400,
    padding: theme.spacing(6, 8),
    width: "100%"
}));

/**
 * Two column layout for steps with content and preview/indicator.
 */
export const TwoColumnLayout: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flex: 1,
    gap: theme.spacing(8),
    minHeight: 450
}));

/**
 * Left column for main content.
 * Has overflow hidden to allow child components to scroll independently.
 */
export const LeftColumn: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: theme.spacing(3),
    minHeight: 0,
    overflow: "hidden"
}));

/**
 * Right column for step indicator or illustration.
 */
export const RightColumn: typeof Box = styled(Box)(() => ({
    alignItems: "center",
    display: "flex",
    flex: 1,
    justifyContent: "center"
}));

/**
 * Section label
 */
export const SectionLabel = styled(Typography)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.97rem",
    fontWeight: 500,
    marginBottom: theme.spacing(2)
}));


/**
 * Footer with navigation buttons.
 */
export const Footer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    borderTop: `1px solid ${theme.palette.divider}`,
    display: "flex",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingTop: theme.spacing(3)
}));

/**
 * Primary action button with rounded corners.
 */
export const PrimaryButton: typeof Button = styled(Button)(({ theme }: { theme: Theme }) => ({
    "&:disabled": {
        backgroundColor: theme.palette.action.disabledBackground,
        color: theme.palette.action.disabled
    },
    borderRadius: theme.spacing(2.5),
    minWidth: 100,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    textTransform: "none"
}));

/**
 * Secondary/Back button with outlined style.
 */
export const SecondaryButton: typeof Button = styled(Button)(({ theme }: { theme: Theme }) => ({
    borderColor: theme.palette.divider,
    borderRadius: theme.spacing(2.5),
    color: theme.palette.text.primary,
    minWidth: 100,
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    textTransform: "none"
}));

/**
 * Container for right-aligned action buttons.
 */
export const ActionButtons: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    gap: theme.spacing(2)
}));

/**
 * Selectable option card.
 */
export const SelectableOptionCard = styled(Box, {
    shouldForwardProp: (prop: string) => prop !== "isSelected"
})<{ isSelected?: boolean }>(({ theme, isSelected }: { isSelected?: boolean; theme: Theme }) => ({
    "&:hover": {
        borderColor: theme.palette.primary.main,
        boxShadow: theme.shadows[2]
    },
    backgroundColor: isSelected
        ? theme.palette.primary.light + "10"
        : theme.palette.background.paper,
    border: `2px solid ${isSelected ? theme.palette.primary.main : theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    cursor: "pointer",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    gap: theme.spacing(1.5),
    maxWidth: 300,
    minWidth: 200,
    padding: theme.spacing(2.5),
    transition: "all 0.15s ease-in-out"
}));

/**
 * Icon container with background.
 */
export const IconWrapper: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    backgroundColor: theme.palette.grey[100],
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    height: 40,
    justifyContent: "center",
    width: 40
}));


/**
 * Individual step item in indicator.
 */
export const StepIndicatorItem = styled(Box, {
    shouldForwardProp: (prop: string) => prop !== "isActive" && prop !== "isCompleted"
})<{ isActive?: boolean; isCompleted?: boolean }>(
    ({ isActive, isCompleted, theme }: { isActive?: boolean; isCompleted?: boolean; theme: Theme }) => ({
        alignItems: "center",
        display: "flex",
        gap: theme.spacing(1.5),
        opacity: isActive || isCompleted ? 1 : 0.5,
        padding: theme.spacing(1, 0)
    })
);

/**
 * Step dot indicator.
 */
export const StepDot = styled(Box, {
    shouldForwardProp: (prop: string) => prop !== "isActive" && prop !== "isCompleted"
})<{ isActive?: boolean; isCompleted?: boolean }>(
    ({ isActive, isCompleted, theme }: { isActive?: boolean; isCompleted?: boolean; theme: Theme }) => ({
        backgroundColor: isActive || isCompleted
            ? theme.palette.primary.main
            : theme.palette.grey[300],
        borderRadius: "50%",
        flexShrink: 0,
        height: 8,
        width: 8
    })
);

/**
 * Cards container for horizontal layout.
 */
export const CardsRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2)
}));
