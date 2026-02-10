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
import Collapse from "@oxygen-ui/react/Collapse";
import Typography from "@oxygen-ui/react/Typography";
import { ChevronDownIcon } from "@oxygen-ui/react-icons";
import React, { FunctionComponent, ReactElement, ReactNode, useState } from "react";
import { ReactComponent as Lightbulb } from "../../assets/icons/lightbulb.svg";

/**
 * Props interface for Hint component.
 */
interface HintPropsInterface {
    /**
     * Hint message text. Optional when using children for custom content.
     */
    message?: string;
    /**
     * Optional content to render. Can be used instead of or in addition to message.
     * Use this for chips, buttons, lists, or any custom hint content.
     */
    children?: ReactNode;
    /**
     * When true, children are hidden by default and can be expanded by clicking the message.
     * @default false
     */
    collapsible?: boolean;
    /**
     * Whether the collapsible section is expanded by default.
     * Only applies when collapsible is true.
     * @default false
     */
    defaultExpanded?: boolean;
}

/**
 * Container for hint with icon and content.
 */
const HintContainer: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(1)
}));

/**
 * Row containing icon and message - static version.
 */
const HintRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
    gap: theme.spacing(1)
}));

/**
 * Row containing icon and message - clickable version for collapsible mode.
 */
const ClickableHintRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    "&:hover .hint-message": {
        textDecoration: "underline"
    },
    alignItems: "center",
    cursor: "pointer",
    display: "inline-flex",
    gap: theme.spacing(1)
}));

/**
 * Hint message text styling.
 */
const HintMessage: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.text.secondary,
    fontSize: "0.8125rem",
    lineHeight: 1.5
}));

/**
 * Clickable hint message - uses primary color.
 */
const ClickableHintMessage: typeof Typography = styled(Typography)(({ theme }: { theme: Theme }) => ({
    color: theme.palette.primary.main,
    fontSize: "0.8125rem",
    lineHeight: 1.5
}));

/**
 * Container for optional child content (chips, buttons, etc).
 */
export const HintContent: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(1),
    marginLeft: theme.spacing(3.25)
}));

/**
 * Hint component displaying an informational message with a lightbulb icon.
 * Supports composition pattern - pass any content as children.
 * Can be used with just message, just children, or both.
 *
 * When `collapsible` is true, the children are hidden by default and
 * can be expanded by clicking the message (shows as a link with chevron).
 */
const Hint: FunctionComponent<HintPropsInterface> = ({
    children,
    message,
    collapsible = false,
    defaultExpanded = false
}: HintPropsInterface): ReactElement => {
    const [ expanded, setExpanded ] = useState<boolean>(defaultExpanded);

    const handleToggle = (): void => {
        setExpanded(!expanded);
    };

    const handleKeyDown = (event: React.KeyboardEvent): void => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setExpanded(!expanded);
        }
    };

    // Collapsible mode - clickable header with expandable children
    if (collapsible) {
        return (
            <HintContainer>
                <ClickableHintRow
                    onClick={ handleToggle }
                    onKeyDown={ handleKeyDown }
                    role="button"
                    tabIndex={ 0 }
                    aria-expanded={ expanded }
                >
                    <Lightbulb fill="#FBBB00" height={ 18 } width={ 18 } />
                    { message && (
                        <ClickableHintMessage className="hint-message" variant="body2">
                            { message }
                        </ClickableHintMessage>
                    ) }
                    <Box
                        component="span"
                        sx={ {
                            alignItems: "center",
                            display: "inline-flex",
                            transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s ease-in-out"
                        } }
                    >
                        <ChevronDownIcon size={ 14 } fill="#ff7300" />
                    </Box>
                </ClickableHintRow>
                <Collapse in={ expanded }>
                    { children && <HintContent>{ children }</HintContent> }
                </Collapse>
            </HintContainer>
        );
    }

    // Static mode - always visible
    return (
        <HintContainer>
            <HintRow>
                <Lightbulb fill="#FBBB00" height={ 18 } width={ 18 } />
                { message && <HintMessage variant="body2">{ message }</HintMessage> }
            </HintRow>
            { children && <HintContent>{ children }</HintContent> }
        </HintContainer>
    );
};

export default Hint;
