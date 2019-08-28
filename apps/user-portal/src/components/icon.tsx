/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import classNames from "classnames";
import * as React from "react";
import { base64MimeType } from "../helpers";

/**
 * Proptypes for the Icon component.
 */
interface ComponentProps {
    icon: any;
    inline?: boolean;
    className?: string;
    transparent?: boolean;
    relaxed?: boolean | string;
    bordered?: boolean;
    rounded?: boolean;
    defaultIcon?: boolean;
    twoTone?: boolean;
    size?: string;
    style?: object;
    square?: boolean;
}

/**
 * Generic component to render icons.
 *
 * @param {React.PropsWithChildren<any>} props
 * @return {any}
 */
export const ThemeIcon: React.FunctionComponent<ComponentProps> = (props): JSX.Element => {
    const {
        icon, inline, className, transparent, relaxed, bordered, rounded, defaultIcon, twoTone, size, style, square
    } = props;
    const relaxLevel = (relaxed && relaxed === true) ? "" : relaxed;

    const classes = classNames({
        "bordered": bordered,
        "default": defaultIcon,
        "inline": inline,
        "relaxed": relaxed,
        "rounded": rounded,
        [`${size}`]: size,
        "square": square,
        "transparent": transparent,
        "two-tone": twoTone,
        [`${relaxLevel}`]: relaxLevel,
    }, className);

    const constructContent = (): HTMLElement | SVGElement | JSX.Element => {
        if (icon instanceof SVGElement) {
            return icon;
        }

        // Check if the icon is a React component.
        if (icon.ReactComponent && typeof icon.ReactComponent === "function") {
            return <icon.ReactComponent />;
        }

        if (typeof icon !== "string") {
            throw new Error("The provided icon type is not supported.");
        }

        const mimeType = base64MimeType(icon);

        if (!mimeType) {
            throw new Error("The provided icon type is not supported.");
        }

        return <img src={icon} alt="icon" />;
    };

    return (
        <div className={ `icon-wrapper ${classes}` } style={style}>
            { constructContent() }
        </div>
    );
};

/**
 * Default proptypes for the Icon component.
 */
ThemeIcon.defaultProps = {
    bordered: false,
    className: "",
    defaultIcon: true,
    inline: false,
    relaxed: false,
    rounded: false,
    size: "mini",
    square: false,
    style: {},
    transparent: false,
    twoTone: false,
};
