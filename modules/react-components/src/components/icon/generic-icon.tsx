/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface, SVGRLoadedInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, {
    CSSProperties,
    PropsWithChildren,
    ReactElement,
    ReactNode,
    isValidElement,
    useEffect,
    useState
} from "react";
import { SemanticVERTICALALIGNMENTS } from "semantic-ui-react";

/**
 * Prop-types for the Generic Icon component.
 */
export interface GenericIconProps extends TestableComponentInterface, IdentifiableComponentInterface {
    /**
     * Render as.
     */
    as?: "data-url" | "svg";
    /**
     * Background fill color.
     */
    background?: "primary" | "secondary" | "accent1" | "accent2" | "accent3" | "grey" | "default" | boolean;
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
     * Inactive status of this icon element.
     * The default value is always false. Refer {@link GenericIcon.defaultProps}
     */
    disabled?: boolean;
    /**
     * Icon fill color.
     */
    fill?: "primary" | "secondary" | "accent1" | "accent2" | "accent3" | "default" | "white" | boolean;
    /**
     * Floated direction.
     */
    floated?: string | boolean;
    /**
     * Is hover style enabled.
     */
    hoverable?: boolean;
    /**
     * Hover type.
     */
    hoverType?: "rounded" | "square" | "circular";
    /**
     * Icon for the component.
     */
    icon: any;
    /**
     * Should the icon appear inline.
     */
    inline?: boolean;
    /**
     * Should show inverted styles.
     */
    inverted?: boolean;
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
     * @param event - Click event.
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
    style?: CSSProperties | undefined;
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
     * Vertical alignment.
     */
    verticalAlign?: SemanticVERTICALALIGNMENTS;
    /**
     * Width of the icon.
     */
    width?: "auto" | number;
    /**
     * ID used to recognize components in guided tour wizards.
     */
    "data-tourid"?: string;
}

/**
 * Icon sizes.
 */
export type GenericIconSizes =
    "auto"
    | "nano"
    | "default"
    | "micro"
    | "x22"
    | "x30"
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
 * @param props - Props injected to the component.
 * @returns Generic Icon component.
 */
export const GenericIcon: React.FunctionComponent<PropsWithChildren<GenericIconProps>> = (
    props: GenericIconProps
): ReactElement => {

    const {
        as,
        background,
        bordered,
        className,
        colored,
        defaultIcon,
        disabled,
        fill,
        floated,
        hoverable,
        hoverType,
        icon: Icon,
        inline,
        inverted,
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
        width,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        [ "data-tourid" ]: tourId
    } = props;

    const [ renderedIcon, setRenderedIcon ] = useState<HTMLElement | SVGElement | ReactNode>(null);

    const relaxLevel = (relaxed && relaxed === true) ? "" : relaxed;

    const classes = classNames({
        [ typeof background === "boolean" ? "background-transparent" : `background-${ background }` ]: background,
        "bordered": bordered,
        "colored": colored,
        "default": defaultIcon,
        "disabled": disabled || Icon === null,
        [ typeof fill === "boolean" ? "fill-default" : `fill-${ fill }` ]: fill,
        [`floated-${floated}`]: floated,
        hoverable,
        [ `hover-${ hoverType }` ]: hoverType,
        "inline": inline,
        inverted,
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
        [`vertical-aligned-${ verticalAlign }`]: verticalAlign,
        [ `width-${ width }`]: width
    }, className);

    /**
     * Construct the content as soon as the Icon prop is available.
     */
    useEffect(() => {
        constructContent();
    }, [ Icon ]);

    /**
     * A default icon if the `icon.Icon` null
     * or empty. For usage @see {@link constructContent}
     */
    const defaultIconPlaceholder = () => {
        return <React.Fragment>{ "" }</React.Fragment>;
    };

    /**
     * The icon click action handler. It first checks whether the icon
     * is disabled or not. And if disabled is `true` it will never
     * fire the provided `onClick` handler.
     *
     * @param event - Click event.
     */
    const onIconClickHandler = (event: React.MouseEvent<HTMLDivElement>): void => {
        if (disabled || !onClick) {
            return;
        }

        onClick(event);
    };

    /**
     * Constructs the icon. This function is a impure function which depends
     * on `Icon` value above. The `Icon` can be one of type from below list: -
     *
     * 1. `SVGElement`
     * 2. ReactComponent
     * 3. `React.FunctionComponent`
     * 4. `React.Component`
     * 5. `string` URL or BASE-64 encoded.
     */
    const constructContent = (): void => {

        // If there's no icon passed to this via the parent
        // then it will return a default icon.
        if (!Icon) {
            setRenderedIcon(defaultIconPlaceholder());

            return;
        }

        const setIcon = (icon: SVGRLoadedInterface): void => {

            if (icon.ReactComponent) {
                setRenderedIcon(<icon.ReactComponent />);

                return;
            } else if (icon.default) {
                setRenderedIcon(renderDefaultIcon(icon.default));

                return;
            }

            setRenderedIcon(defaultIconPlaceholder());
        };

        try {
            if (Icon instanceof Promise) {
                Icon
                    .then((response: SVGRLoadedInterface) => {
                        if (!as) {
                            setIcon(response);

                            return;
                        }

                        if (as === "svg") {
                            setIcon(response);

                            return;
                        } else if (as === "data-url" && response.default) {
                            setRenderedIcon(renderDefaultIcon(response.default));

                            return;
                        }

                        setRenderedIcon(defaultIconPlaceholder());
                    })
                    .catch(() => {
                        setRenderedIcon(defaultIconPlaceholder());
                    });

                return;
            }

            // Check if the icon is an SVG element
            if (Icon instanceof SVGElement) {
                setRenderedIcon(Icon);

                return;
            }

            // Check if the icon is a module and has `ReactComponent` property.
            // Important when used with SVG's imported with `@svgr/webpack`.
            if (Object.prototype.hasOwnProperty.call(Icon,"ReactComponent")
                && typeof Icon.ReactComponent === "function") {

                setRenderedIcon(<Icon.ReactComponent/>);

                return;
            }

            // Check is icon is a component.
            if (typeof Icon === "function") {
                setRenderedIcon(<Icon />);

                return;
            }

            if (isValidElement(Icon)) {
                setRenderedIcon(Icon);

                return;
            }

            // Check is icon is a component.
            if (typeof Icon === "object") {
                setRenderedIcon(<Icon />);

                return;
            }

            // Check if icon passed in is a string. Can be a URL or a base64 encoded.
            if (typeof Icon === "string") {
                setRenderedIcon(renderDefaultIcon(Icon));

                return;
            }
        } catch (e) {
            return setRenderedIcon(defaultIconPlaceholder());
        }
    };

    /**
     * Renders the default icon element.
     *
     * @param icon - Data URL.
     * @returns Default icon.
     */
    const renderDefaultIcon = (icon: string): ReactElement => (
        <img src={ icon } className="icon" alt="icon"/>
    );

    return (
        <div
            className={ `theme-icon ${ classes }` }
            style={ style }
            onClick={ onIconClickHandler }
            data-testid={ testId }
            data-componentid={ componentId }
            data-tourid={ tourId }
        >
            { renderedIcon as ReactNode }
        </div>
    );
};

/**
 * Default proptypes for the Generic Icon component.
 */
GenericIcon.defaultProps = {
    as: "svg",
    background: false,
    bordered: false,
    className: "",
    "data-componentid": "generic-icon",
    "data-testid": "generic-icon",
    "data-tourid": null,
    defaultIcon: false,
    disabled: false,
    floated: null,
    hoverType: "rounded",
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
