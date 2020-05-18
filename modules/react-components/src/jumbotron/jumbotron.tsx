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
import React, { FunctionComponent, ReactElement, ReactNode } from "react";
import { Divider, HeaderProps } from "semantic-ui-react";
import { GenericIcon, GenericIconProps, GenericIconSizes } from "../icon";
import { Heading } from "../typography";

/**
 * Proptypes for the jumbotron component.
 */
export interface JumbotronPropsInterface extends TestableComponentInterface {
    /**
     * Additional classes.
     */
    className?: string;
    /**
     * Extra content.
     */
    content?: ReactNode;
    /**
     * Enable borders.
     */
    bordered?: "bottom" | "top" | boolean;
    /**
     * Clearing for floating elements.
     */
    clearing?: boolean;
    /**
     * Jumbotron heading.
     */
    heading?: string;
    /**
     * Element to render heading.
     */
    headingAs?: HeaderProps["as"];
    /**
     * Jumbotron sub heading.
     */
    subHeading?: string;
    /**
     * Element to render sub heading.
     */
    subHeadingAs?: HeaderProps["as"];
    /**
     * Enable content padding.
     */
    padded?: boolean;
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
     * Text align direction.
     */
    textAlign?: "center" | "left" | "right";
}

/**
 * Component to showcase key marketing messages.
 *
 * @param {JumbotronPropsInterface} props - Props injected to the components.
 *
 * @return {React.ReactElement}
 */
export const Jumbotron: FunctionComponent<JumbotronPropsInterface> = (
    props: JumbotronPropsInterface
): ReactElement => {

    const {
        className,
        content,
        bordered,
        clearing,
        heading,
        headingAs,
        icon,
        iconOptions,
        iconSize,
        subHeading,
        subHeadingAs,
        padded,
        textAlign,
        [ "data-testid" ]: testId
    } = props;

    const classes = classNames(
        "ui-jumbotron",
        {
            [ typeof bordered === "boolean" ? "bordered-default" : `bordered-${ bordered }` ]: bordered,
            clearing,
            padded,
            [ `text-${ textAlign }` ]: textAlign
        },
        className
    );

    return (
        <div className={ classes }>
            { (heading || subHeading) && (
                <div className="jumbotron-content-wrapper inline">
                    { heading && (
                        <Heading
                            className="jumbotron-heading inline ellipsis"
                            as={ headingAs }
                            data-testid={ `${ testId }-heading` }
                            compact
                        >
                            { heading }
                        </Heading>
                    ) }
                    { subHeading && (
                        <Heading
                            className="jumbotron-sub-heading"
                            data-testid={ `${ testId }-sub-heading` }
                            as={ subHeadingAs }
                            subHeading
                            ellipsis
                        >
                            { subHeading }
                        </Heading>
                    ) }
                </div>
            ) }
            { content && (
                <>
                    <Divider />
                    { content }
                </>
            ) }
            { icon && (
                <GenericIcon
                    icon={ icon }
                    size={ iconSize }
                    floated="right"
                    transparent
                    { ...iconOptions }
                />
            ) }
        </div>
    );
};

/**
 * Default props for the stat count card.
 */
Jumbotron.defaultProps = {
    bordered: "bottom",
    clearing: true,
    "data-testid": "jumbotron",
    headingAs: "h1",
    iconSize: "auto",
    padded: true,
    subHeadingAs: "h5",
    textAlign: "left"
};
