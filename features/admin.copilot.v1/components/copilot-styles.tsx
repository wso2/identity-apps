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
import Button from "@oxygen-ui/react/Button";
import TextField from "@oxygen-ui/react/TextField";

/**
 * Shared styled text input used by both CopilotChat and CopilotWelcome.
 */
export const StyledCopilotInput: typeof TextField = styled(TextField)(({ theme }: { theme: Theme }) => ({
    "& .MuiOutlinedInput-root": {
        "& .MuiInputBase-input": {
            "&::placeholder": {
                color: theme.palette.text.disabled,
                opacity: 1
            },
            padding: `${theme.spacing(1)} 56px ${theme.spacing(1)} ${theme.spacing(2)}`
        },
        "& .MuiOutlinedInput-notchedOutline": {
            border: "none"
        },
        "&.Mui-focused": {
            backgroundColor: theme.palette.background.paper
        },
        backgroundColor: theme.palette.grey[100],
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 24
    }
}));

/**
 * Shared styled container for follow-up suggestion chips, used by both CopilotChat and CopilotWelcome.
 */
export const StyledFollowUpSuggestionsList: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    "@keyframes popIn": {
        "0%": { opacity: 0, transform: "translateY(10px) scale(0.95)" },
        "100%": { opacity: 1, transform: "translateY(0) scale(1)" }
    },
    animation: "popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1.5),
    marginTop: theme.spacing(1.5),
    opacity: 0
}));

/**
 * Styled button used in CopilotChat for the "Load earlier messages" control.
 */
export const StyledLoadMoreButton: typeof Button = styled(Button)(({ theme }: { theme: Theme }) => ({
    "& .MuiButton-startIcon": {
        marginRight: theme.spacing(0.5)
    },
    "&:hover": {
        backgroundColor: theme.palette.action.hover
    },
    borderRadius: 16,
    color: theme.palette.text.secondary,
    fontSize: 12,
    padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
    textTransform: "none"
}));

/**
 * Styled pill-shaped suggestion button. Uses variant="text" which already covers
 * fontSize, fontWeight, height, lineHeight, and textTransform defaults.
 */
export const StyledSuggestionButton: typeof Button = styled(Button)(({ theme }: { theme: Theme }) => ({
    "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.12)
    },
    backgroundColor: alpha(theme.palette.primary.main, 0.06),
    borderRadius: 24,
    color: theme.palette.text.primary,
    justifyContent: "flex-start",
    maxWidth: 568,
    minWidth: "auto",
    padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    textAlign: "left",
    whiteSpace: "normal"
}));
