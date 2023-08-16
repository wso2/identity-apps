/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { CSSProperties, FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { HeaderProps, Segment, SegmentProps } from "semantic-ui-react";
import { SemanticCOLORS } from "semantic-ui-react/dist/commonjs/generic";
import { GenericIcon, GenericIconProps, GenericIconSizes } from "../icon";
import { Media } from "../media";
import { Heading } from "../typography";

/**
 * Prop-types for the jumbotron component.
 */
export interface JumbotronPropsInterface extends Omit<SegmentProps, "color">, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Background color.
     */
    background?: "primary" | "secondary" | "accent1" | "accent2" | "accent3" | "white" | "default" | SemanticCOLORS;
    /**
     * Border radius.
     */
    borderRadius?: "default" | number;
    /**
     * Enable borders.
     */
    bordered?: "bottom" | "top" | boolean;
    /**
     * Should the content be inline.
     */
    contentInline?: boolean;
    /**
     * Jumbotron heading.
     */
    heading?: ReactNode;
    /**
     * Element to render heading.
     */
    headingAs?: HeaderProps["as"];
    /**
     * Custom style object.
     */
    style?: CSSProperties | undefined;
    /**
     * Jumbotron sub heading.
     */
    subHeading?: ReactNode;
    /**
     * Element to render sub heading.
     */
    subHeadingAs?: HeaderProps["as"];
    /**
     * Enable matching padding same as the page layout.
     */
    matchedPadding?: boolean;
    /**
     * Icon to represent the stats.
     */
    icon?: GenericIconProps["icon"];
    /**
     * Icon options.
     */
    iconOptions?: Omit<GenericIconProps, "icon" | "size">;
    /**
     * Size of the icon.
     */
    iconSize?: GenericIconSizes;
    /**
     * Additional content to appear before the heading.
     */
    topContent?: ReactNode;
}

/**
 * Jumbotron: Component to showcase key marketing messages.
 *
 * @param props - Props injected to the components.
 *
 * @returns Jumbotron component.
 */
export const Jumbotron: FunctionComponent<PropsWithChildren<JumbotronPropsInterface>> = (
    props: PropsWithChildren<JumbotronPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        contentInline,
        background,
        borderRadius,
        bordered,
        heading,
        headingAs,
        icon,
        iconOptions,
        iconSize,
        matchedPadding,
        style,
        subHeading,
        subHeadingAs,
        topContent,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "jumbotron",
        {
            [ `background-${ background }` ]: background,
            [ typeof bordered === "boolean" ? "bordered-default" : `bordered-${ bordered }` ]: bordered,
            [ typeof borderRadius === "string" ? `border-radius-${ borderRadius }` : "" ]: borderRadius,
            [ "matched-padding" ]: matchedPadding
        },
        className
    );

    const contentWrapperClasses = classNames(
        "jumbotron-content-wrapper",
        {
            [ "inline" ]: contentInline
        }
    );

    /**
     * Resolves the custom styles.
     *
     * @returns Styles object.
     */
    const getStyle = (): CSSProperties => {

        let modifiedStyle: CSSProperties = style;

        if (typeof borderRadius === "number") {
            modifiedStyle = {
                ...modifiedStyle,
                borderRadius: `${ borderRadius }px`
            };
        }

        return modifiedStyle;
    };

    /**
     * Resolves additional properties.
     *
     * @returns Additional props.
     */
    const resolveAdditionalProps = (): Record<string, unknown> => {

        let additionalProps: Record<string, unknown> = {};

        if (background && !(background === "white" || background === "default")) {
            additionalProps = {
                ...additionalProps,
                inverted: true
            };
        }

        return additionalProps;
    };

    return (
        <Segment className={ classes } style={ getStyle() } { ...resolveAdditionalProps() } { ...rest }>
            { topContent }
            { (heading || subHeading || children) && (
                <div className={ contentWrapperClasses }>
                    { heading && (
                        typeof heading === "string"
                            ? (
                                <Heading
                                    className="jumbotron-heading inline ellipsis"
                                    as={ headingAs }
                                    data-componentid={ `${ componentId }-heading` }
                                    data-testid={ `${ testId }-heading` }
                                    compact
                                >
                                    { heading }
                                </Heading>
                            )
                            : heading
                    ) }
                    { subHeading && (
                        typeof subHeading === "string"
                            ? (
                                <Heading
                                    className="jumbotron-sub-heading"
                                    data-componentid={ `${ componentId }-sub-heading` }
                                    data-testid={ `${ testId }-sub-heading` }
                                    as={ subHeadingAs }
                                    subHeading
                                    ellipsis
                                >
                                    { subHeading }
                                </Heading>
                            )
                            : subHeading
                    ) }
                    { children }
                </div>
            ) }
            { icon && (
                <Media greaterThanOrEqual="computer">
                    <GenericIcon
                        icon={ icon }
                        size={ iconSize }
                        floated="right"
                        transparent
                        { ...iconOptions }
                    />
                </Media>
            ) }
        </Segment>
    );
};

/**
 * Default props for the stat count card.
 */
Jumbotron.defaultProps = {
    background: "default",
    basic: true,
    borderRadius: "default",
    bordered: "bottom",
    clearing: true,
    contentInline: false,
    "data-componentid": "jumbotron",
    "data-testid": "jumbotron",
    headingAs: "h1",
    iconSize: "auto",
    matchedPadding: true,
    subHeadingAs: "h5",
    textAlign: "left"
};
