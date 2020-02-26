/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import React, { PropsWithChildren } from "react";

/**
 * Proptypes for the Generic Icon component.
 */
export interface GenericIconProps {
    bordered?: boolean;
    className?: string;
    colored?: boolean;
    defaultIcon?: boolean;
    floated?: string;
    icon: any;
    inline?: boolean;
    relaxed?: boolean | "very";
    rounded?: boolean;
    size?: GenericIconSizes;
    spaced?: "left" | "right";
    style?: object;
    square?: boolean;
    transparent?: boolean;
    twoTone?: boolean;
}

export type GenericIconSizes =
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
 * @param {GenericIconProps} props - Props injected to the component.
 * @return {JSX.Element}
 */
export const GenericIcon: React.FunctionComponent<PropsWithChildren<GenericIconProps>> = (
    props: GenericIconProps
): JSX.Element => {

    const {
        bordered,
        className,
        colored,
        defaultIcon,
        floated,
        icon,
        inline,
        relaxed,
        rounded,
        size,
        spaced,
        style,
        square,
        transparent,
        twoTone,
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
        [`${relaxLevel}`]: relaxLevel,
    }, className);

    /**
     * Constructs the icon.
     * TODO: Add a default icon if the an error occurs rather than returning null.
     *
     * @return {HTMLElement | SVGElement | JSX.Element}
     */
    const constructContent = (): HTMLElement | SVGElement | JSX.Element => {
        if (!icon) {
            return null;
        }

        try {
            // Check if the icon is an SVG element
            if (icon instanceof SVGElement) {
                return icon;
            }

            // Check if the icon is a module and has `ReactComponent` property.
            // Important when used with SVG's imported with `@svgr/webpack`.
            if (icon.hasOwnProperty("ReactComponent") && typeof icon.ReactComponent === "function") {
                return <icon.ReactComponent/>;
            }

            // Check is icon is a component.
            if (typeof icon === "function") {
                return icon;
            }

            // Check is icon is a component.
            if (typeof icon === "object") {
                return icon;
            }

            // Check if icon passed in is a string. Can be a URL or a base64 encoded.
            if (typeof icon === "string") {
                return <img src={ icon } className="icon" alt="icon"/>;
            }
        } catch (e) {
            return null;
        }
    };

    return (
        <div className={ `theme-icon ${classes}` } style={ style }>
            { constructContent() }
        </div>
    );
};

/**
 * Default proptypes for the Generic Icon component.
 */
GenericIcon.defaultProps = {
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
    twoTone: false,
};
