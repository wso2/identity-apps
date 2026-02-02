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
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { ReactComponent as Lightbulb } from "../../assets/icons/lightbulb.svg";

/**
 * Props interface for Hint component.
 */
interface HintProps {
    /**
     * Hint message text.
     */
    message: string;
    /**
     * Optional content to render below the hint message.
     * Use this for chips, buttons, or any interactive elements.
     */
    children?: ReactNode;
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
 * Row containing icon and message.
 */
const HintRow: typeof Box = styled(Box)(({ theme }: { theme: Theme }) => ({
    alignItems: "center",
    display: "flex",
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
 */
const Hint: FunctionComponent<HintProps> = ({
    children,
    message
}: HintProps): ReactElement => (
    <HintContainer>
        <HintRow>
            <Lightbulb fill="#FBBB00" height={ 18 } width={ 18 } />
            <HintMessage variant="body2">{ message }</HintMessage>
        </HintRow>
        { children && <HintContent>{ children }</HintContent> }
    </HintContainer>
);

export default Hint;
