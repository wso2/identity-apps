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
import React, { PropsWithChildren, ReactElement } from "react";

/**
 * Code component prop types.
 */
export interface CodePropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Extra CSS classes.
     */
    className?: string;
    /**
     * Make the component compact.
     */
    compact?: boolean;
    /**
     * Size of the font.
     */
    fontSize?: "inherit" | "default";
    /**
     * Font color.
     */
    fontColor?: "inherit" | "default";
    /**
     * Should the component render with a background.
     */
    withBackground?: boolean;
}

/**
 * Text with code formatting. Wrapper around `<code>` element.
 *
 * @param props - Props injected to the component.
 *
 * @returns Code React Component
 */
export const Code: React.FunctionComponent<PropsWithChildren<CodePropsInterface>> = (
    props: PropsWithChildren<CodePropsInterface>
): ReactElement => {

    const {
        withBackground,
        children,
        className,
        compact,
        fontColor,
        fontSize,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames("inline-code",
        {
            compact,
            [ `font-size-${ fontSize }` ]: fontSize,
            [ `font-color-${ fontColor }` ]: fontColor,
            "transparent" : !withBackground
        },
        className
    );

    return (
        <code
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            { children }
        </code>
    );
};

/**
 * Default props for the Code component.
 */
Code.defaultProps = {
    "data-componentid": "code",
    "data-testid": "code",
    withBackground: true
};
