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

import { alpha, styled, Theme } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";

/**
 * Shared styled components for the device policy create/edit wizards.
 */

export const StyledPlatformTabBar: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    borderBottom: `1px solid ${theme.palette.divider}`,
    display: "flex",
    gap: 4,
    margin: `0 -36px ${theme.spacing(3)}`,
    overflowX: "auto",
    padding: "0 36px"
}));

export const StyledPlatformTab = styled("button", {
    shouldForwardProp: (prop: string): boolean => prop !== "isActive"
})<{ isActive?: boolean }>(
    ({ theme, isActive }: { theme: Theme; isActive?: boolean }) => ({
        alignItems: "center",
        background: "transparent",
        border: "none",
        borderBottom: `2.5px solid ${isActive ? theme.palette.primary.main : "transparent"}`,
        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
        cursor: "pointer",
        display: "inline-flex",
        fontFamily: "inherit",
        fontSize: 14,
        fontWeight: 600,
        gap: 8,
        marginBottom: -1,
        padding: "14px 16px",
        transition: "color 140ms ease, border-color 140ms ease",
        whiteSpace: "nowrap",
        "&:hover": {
            color: isActive ? theme.palette.primary.main : theme.palette.text.primary
        }
    })
);

export const StyledTabBadge = styled(Box, {
    shouldForwardProp: (prop: string): boolean => prop !== "isActive"
})<{ isActive?: boolean }>(
    ({ theme, isActive }: { theme: Theme; isActive?: boolean }) => ({
        background: isActive ? alpha(theme.palette.primary.light, 0.2) : theme.palette.action.hover,
        borderRadius: 999,
        color: isActive ? theme.palette.primary.main : theme.palette.text.secondary,
        fontSize: 11,
        fontWeight: 700,
        lineHeight: "1",
        padding: "2px 7px"
    })
);

export const StyledRuleSummaryCode: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    background: theme.palette.action.hover,
    borderRadius: theme.shape.borderRadius,
    fontFamily: "ui-monospace, \"SFMono-Regular\", Menlo, monospace",
    fontSize: 13,
    lineHeight: 1.8,
    padding: theme.spacing(1.5, 1.75)
}));

export const StyledReviewPlatformCard: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    background: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(2),
    padding: theme.spacing(2, 2.25)
}));
