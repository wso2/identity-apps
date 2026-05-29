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
import TextField from "@oxygen-ui/react/TextField";
import Typography from "@oxygen-ui/react/Typography";

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
    maxHeight: "calc(100vh - 120px)",
    maxWidth: 1400,
    minHeight: "calc(100vh - 120px)",
    overflow: "hidden",
    padding: theme.spacing(6, 8),
    paddingBottom: theme.spacing(4),
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
 * Narrow config panel for builder steps (sign-in options, design, success).
 * Fixed width to give maximum space to the preview area.
 */
export const ConfigPanel: typeof Box = styled(LeftColumn)(() => ({
    flex: "0 0 500px",
    minWidth: 500
}));

/**
 * Wide preview panel for builder steps.
 * Centers content and takes all remaining space.
 */
export const PreviewPanel: typeof Box = styled(RightColumn)(({ theme }: { theme: Theme }) => ({
    justifyContent: "center",
    overflow: "hidden",
    padding: theme.spacing(4)
}));

/**
 * Section label
 */
export const SectionLabel: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "1rem",
    fontWeight: 500
}));

/**
 * Footer with navigation buttons.
 */
export const Footer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    borderTop: `1px solid ${theme.palette.divider}`,
    display: "flex",
    justifyContent: "space-between",
    marginLeft: theme.spacing(-8),
    marginRight: theme.spacing(-8),
    marginTop: "auto",
    paddingLeft: theme.spacing(8),
    paddingRight: theme.spacing(8),
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
 * Cards container for horizontal layout.
 */
export const CardsRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2)
}));

/**
 * Wrapper that applies slide and fade CSS transitions during step navigation.
 */
export const StepTransitionWrapper: typeof Box = styled(Box)(() => ({
    display: "flex",
    flex: 1,
    flexDirection: "column",
    minHeight: 0,
    transition: "transform 250ms ease-in-out, opacity 250ms ease-in-out"
}));

/**
 * Styled TextField with extra spacing between the label and the input.
 */
export const StyledTextField: typeof TextField = styled(TextField)(({ theme }: { theme: Theme }) => ({
    "& .MuiInputLabel-root": {
        marginBottom: theme.spacing(1),
        position: "relative",
        transform: "none"
    },
    "& .MuiOutlinedInput-notchedOutline": {
        top: 0
    },
    "& .MuiOutlinedInput-notchedOutline legend": {
        display: "none"
    },
    "& .MuiOutlinedInput-root": {
        marginTop: theme.spacing(0.5)
    }
}));

/**
 * Gradient text span that uses the primary gradient colors.
 */
export const GradientText: typeof Box = styled("span")({
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background: "linear-gradient(77.74deg, #EB4F63 11.16%, #FA7B3F 99.55%)",
    backgroundClip: "text"
}) as typeof Box;
