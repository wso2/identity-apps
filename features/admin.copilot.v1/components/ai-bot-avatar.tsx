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

import { styled } from "@mui/material/styles";
import Box from "@oxygen-ui/react/Box";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import React, { ReactElement } from "react";
import AiBotIllustration from "../assets/ai-bot.svg";

const StyledAiBotAvatarRoot: typeof Box = styled(Box)(() => ({
    "&.circular": {
        "& img": {
            display: "block",
            height: "auto",
            objectFit: "contain",
            width: "60%"
        },
        borderRadius: "50%"
    },
    "&.standard": {
        "& img": {
            display: "block",
            height: "100%",
            objectFit: "contain",
            width: "100%"
        }
    },
    alignItems: "center",
    display: "flex",
    justifyContent: "center"
}));

/**
 * Props interface for the AiBotAvatar component.
 */
export interface AiBotAvatarProps extends IdentifiableComponentInterface {
    /**
     * Size of the avatar.
     */
    size?: number;
    /**
     * Whether to show in a circular container.
     */
    circular?: boolean;
    /**
     * Background color for circular container.
     */
    backgroundColor?: string;
    /**
     * Additional CSS classes.
     */
    className?: string;
}

/**
 * AI Bot Avatar Component using the official AI bot illustration.
 * Can be used as an icon or larger avatar throughout the copilot interface.
 *
 * @param props - Props injected to the component.
 * @returns AI Bot Avatar component.
 */
const AiBotAvatar: React.FunctionComponent<AiBotAvatarProps> = (
    props: AiBotAvatarProps
): ReactElement => {
    const {
        size = 120,
        circular = false,
        backgroundColor = "transparent",
        className,
        ["data-componentid"]: componentId = "ai-bot-avatar"
    } = props;

    if (circular) {
        return (
            <StyledAiBotAvatarRoot
                className={ `ai-bot-avatar circular ${className || ""}` }
                data-componentid={ componentId }
                style={ {
                    background: backgroundColor,
                    height: size,
                    padding: `${size * 0.2}px`,
                    width: size
                } }
            >
                <img
                    alt="AI Bot"
                    src={ AiBotIllustration }
                    style={ { width: `${size * 0.6}px` } }
                />
            </StyledAiBotAvatarRoot>
        );
    }

    return (
        <StyledAiBotAvatarRoot
            className={ `ai-bot-avatar standard ${className || ""}` }
            data-componentid={ componentId }
            style={ { height: size, width: size } }
        >
            <img alt="AI Bot" src={ AiBotIllustration } />
        </StyledAiBotAvatarRoot>
    );
};

export default AiBotAvatar;
