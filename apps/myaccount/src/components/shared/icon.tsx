/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import classNames from "classnames";
import React, { ReactElement, ReactNode } from "react";

/**
 * Prop-types for the Icon component.
 */
interface ThemeIconProps {
    bordered?: boolean;
    className?: string;
    colored?: boolean;
    defaultIcon?: boolean;
    floated?: string;
    icon: any;
    inline?: boolean;
    relaxed?: boolean | "very";
    rounded?: boolean;
    size?: ThemeIconSizes;
    spaced?: "left" | "right";
    style?: Record<string, unknown>;
    square?: boolean;
    transparent?: boolean;
    twoTone?: boolean;
}

export type ThemeIconSizes =
    "auto"
    | "nano"
    | "micro"
    | "mini"
    | "tiny"
    | "small"
    | "medium"
    | "large"
    | "big"
    | "huge"
    | "massive";

/**
 * Generic component to render icons.
 *
 * @param props - Props injected to the component.
 * @returns Icon component.
 */
export const ThemeIcon: React.FunctionComponent<ThemeIconProps> = (props): JSX.Element => {
    const {
        bordered,
        className,
        colored,
        defaultIcon,
        floated,
        icon: Icon,
        inline,
        relaxed,
        rounded,
        size,
        spaced,
        style,
        square,
        transparent,
        twoTone
    } = props;
    const relaxLevel = (relaxed && relaxed === true) ? "" : relaxed;

    const classes = classNames({
        "bordered": bordered,
        "colored": colored,
        "default": defaultIcon,
        [`floated-${floated}`]: floated,
        "inline": inline,
        "relaxed": relaxed,
        "rounded": rounded,
        [`${size}`]: size,
        [`spaced-${spaced}`]: spaced,
        "square": square,
        "transparent": transparent,
        "two-tone": twoTone,
        [`${relaxLevel}`]: relaxLevel
    }, className);

    const constructContent = (): HTMLElement | SVGElement | ReactElement | JSX.Element => {
        if (!Icon) {
            return null;
        }

        try {
            // Check if the icon is an SVG element
            if (Icon instanceof SVGElement) {
                return Icon;
            }

            // Check if the icon is a module and has `ReactComponent` property.
            // Important when used with SVG's imported with `@svgr/webpack`.
            if (Object.prototype.hasOwnProperty.call(Icon,"ReactComponent")
                && typeof Icon.ReactComponent === "function") {

                return <Icon.ReactComponent/>;
            }

            // Check is icon is a component.
            if (typeof Icon === "function") {
                return <Icon />;
            }

            // Check is icon is a component.
            if (typeof Icon === "object") {
                return Icon;
            }

            // Check if icon passed in is a string. Can be a URL or a base64 encoded.
            if (typeof Icon === "string") {
                return <img src={ Icon } className="icon" alt="icon"/>;
            }
        } catch (e) {
            return null;
        }
    };

    return (
        <div className={ `theme-icon ${classes}` } style={ style }>
            { constructContent() as ReactNode }
        </div>
    );
};

/**
 * Default proptypes for the Icon component.
 */
ThemeIcon.defaultProps = {
    bordered: false,
    className: "",
    defaultIcon: false,
    floated: null,
    inline: false,
    relaxed: false,
    rounded: false,
    size: "auto",
    spaced: null,
    square: false,
    style: {},
    transparent: false,
    twoTone: false
};
