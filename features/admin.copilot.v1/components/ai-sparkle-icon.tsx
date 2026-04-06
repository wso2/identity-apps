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

import { Theme, styled } from "@mui/material/styles";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { ReactElement } from "react";
import { ReactComponent as AIIcon } from
    "../../../modules/theme/src/themes/wso2is/assets/images/icons/solid-icons/ai-icon.svg";

const StyledAIIcon: typeof AIIcon = styled(AIIcon)(({ theme }: { theme: Theme }) => ({
    ".copilot-header-left &, .copilot-avatar-container &": {
        fill: `var(--oxygen-palette-gradients-primary-stop2, ${theme.palette.primary.main})`
    },
    ".copilot-toggle-button &": {
        fill: "currentcolor"
    },
    display: "inline-block",
    fill: `var(--oxygen-palette-gradients-primary-stop2, ${theme.palette.primary.main})`,
    marginLeft: "1px",
    transform: "scale(-1, 1)",
    transition: "fill 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    verticalAlign: "middle"
})) as typeof AIIcon;

/**
 * Props interface for the AI Sparkle Icon component.
 */
export interface AISparkleIconProps extends IdentifiableComponentInterface {
    /**
     * Width of the icon.
     */
    width?: number;
    /**
     * Height of the icon.
     */
    height?: number;
    /**
     * Additional CSS classes.
     */
    className?: string;
}

/**
 * AI Sparkle Icon component.
 *
 * @param props - Props injected to the component.
 * @returns AI Sparkle Icon component.
 */
const AISparkleIcon: React.FunctionComponent<AISparkleIconProps> = (
    props: AISparkleIconProps
): ReactElement => {
    const {
        width = 20,
        height = 20,
        className,
        ["data-componentid"]: componentId = "ai-sparkle-icon"
    } = props;

    return (
        <StyledAIIcon
            className={ classNames("ai-sparkle-icon", className) }
            data-componentid={ componentId }
            height={ height }
            width={ width }
        />
    );
};

export default AISparkleIcon;
