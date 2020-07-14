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

import { TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { PropsWithChildren, ReactElement } from "react";
import { SemanticVERTICALALIGNMENTS } from "semantic-ui-react";

/**
 * Proptypes for the Generic Icon component.
 */
export interface GenericIconProps extends TestableComponentInterface {
    /**
     * Background fill color.
     */
    background?: "primary" | "secondary" | "accent1" | "accent2" | "accent3" | "default" | boolean;
    /**
     * Should the icon appear bordered.
     */
    bordered?: boolean;
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Should the icon appear colored.
     */
    colored?: boolean;
    /**
     * Should the icon appear default i.e grey.
     */
    defaultIcon?: boolean;
    /**
     * Icon fill color.
     */
    fill?: "primary" | "secondary" | "accent1" | "accent2" | "accent3" | "default" | "white" | boolean;
    /**
     * Floated direction.
     */
    floated?: string;
    /**
     * Is hover style enabled.
     */
    hoverable?: boolean;
    /**
     * Icon for the component.
     */
    icon: any;
    /**
     * Should the icon appear inline.
     */
    inline?: boolean;
    /**
     * Should the icon appear as a link. i.e On hover it'll be highlighted.
     */
    link?: boolean;
    /**
     * Hover color of the icon.
     */
    linkType?: "primary";
    /**
     * Icon onclick callback.
     * @param {React.MouseEvent<HTMLDivElement>} event - Click event.
     */
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    /**
     * Relaxed padding.
     */
    relaxed?: boolean | "very";
    /**
     * Should the icon appear rounded.
     * @deprecated use `shape` instead.
     */
    rounded?: boolean;
    /**
     * Shape of the icon.
     */
    shape?: "square" | "circular" | "rounded";
    /**
     * Size of the icon.
     */
    size?: GenericIconSizes;
    /**
     * Spacing direction.
     */
    spaced?: "left" | "right";
    /**
     * Custom style object.
     */
    style?: object;
    /**
     * Should the icon be squared.
     * @deprecated use `shape` instead.
     */
    square?: boolean;
    /**
     * Should the icon be transparent.
     */
    transparent?: boolean;
    /**
     * Should the icon be twoTone. i.e. Primary & secondary.
     */
    twoTone?: boolean;
    /**
     * Vertical allignment.
     */
    verticalAlign?: SemanticVERTICALALIGNMENTS;
}

/**
 * Icon sizes.
 */
export type GenericIconSizes =
    "auto"
    | "nano"
    | "default"
    | "micro"
    | "mini"
    | "x50"
    | "x60"
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
 *
 * @return {React.ReactElement}
 */
export const GenericIcon: React.FunctionComponent<PropsWithChildren<GenericIconProps>> = (
    props: GenericIconProps
): ReactElement => {

    const {
        background,
        bordered,
        className,
        colored,
        defaultIcon,
        fill,
        floated,
        hoverable,
        icon: Icon,
        inline,
        link,
        linkType,
        onClick,
        relaxed,
        rounded,
        shape,
        size,
        spaced,
        style,
        square,
        transparent,
        twoTone,
        verticalAlign,
        [ "data-testid" ]: testId
    } = props;

    const relaxLevel = (relaxed && relaxed === true) ? "" : relaxed;

    const classes = classNames({
        [ typeof background === "boolean" ? "background-transparent" : `background-${ background }` ]: background,
        "bordered": bordered,
        "colored": colored,
        "default": defaultIcon,
        [ typeof fill === "boolean" ? "fill-default" : `fill-${ fill }` ]: fill,
        [`floated-${floated}`]: floated,
        hoverable,
        "inline": inline,
        link,
        [ `link-${ linkType }` ]: linkType,
        "relaxed": relaxed,
        "rounded": rounded,
        [ (size === "default") ? "default-size" : size ]: size,
        [ shape ]: shape,
        [`spaced-${spaced}`]: spaced,
        "square": square,
        "transparent": transparent,
        "two-tone": twoTone,
        [`${relaxLevel}`]: relaxLevel,
        [`vertical-aligned-${ verticalAlign }`]: verticalAlign
    }, className);

    /**
     * Constructs the icon.
     * TODO: Add a default icon if the an error occurs rather than returning null.
     *
     * @return {HTMLElement | SVGElement | React.ReactElement}
     */
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
        <div className={ `theme-icon ${classes}` } style={ style } onClick={ onClick } data-testid={ testId }>
            { constructContent() }
        </div>
    );
};

/**
 * Default proptypes for the Generic Icon component.
 */
GenericIcon.defaultProps = {
    background: false,
    bordered: false,
    className: "",
    "data-testid": "generic-icon",
    defaultIcon: false,
    fill: "default",
    floated: null,
    inline: false,
    relaxed: false,
    rounded: false,
    shape: "square",
    size: "auto",
    spaced: null,
    square: false,
    style: {},
    transparent: false,
    twoTone: false
};
