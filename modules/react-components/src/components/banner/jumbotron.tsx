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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import classNames from "classnames";
import React, { CSSProperties, FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { HeaderProps, Responsive, Segment, SegmentProps } from "semantic-ui-react";
import { SemanticCOLORS } from "semantic-ui-react/dist/commonjs/generic";
import { GenericIcon, GenericIconProps, GenericIconSizes } from "../icon";
import { Heading } from "../typography";

/**
 * Proptypes for the jumbotron component.
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
 * Component to showcase key marketing messages.
 *
 * @param {JumbotronPropsInterface} props - Props injected to the components.
 *
 * @return {React.ReactElement}
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
     * @return {object} Styles object.
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
     * @return {Record<string, unknown>} Additional props.
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
                <Responsive
                    as={ GenericIcon }
                    icon={ icon }
                    size={ iconSize }
                    floated="right"
                    transparent
                    minWidth={ Responsive.onlyComputer.minWidth }
                    { ...iconOptions }
                />
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
