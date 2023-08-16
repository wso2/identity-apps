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
import React, { CSSProperties, PropsWithChildren, ReactElement } from "react";

/**
 * Text component prop types.
 */
export interface TextPropsInterface extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Display style.
     */
    display?: "block" | "inline" | "inline-block" | "flex" | "inline-flex" | string;
    /**
     * Hide the margins and make the component compact.
     */
    compact?: boolean;
    /**
     * Display inline.
     */
    inline?: boolean;
    /**
     * Should the text have lighter color.
     */
    muted?: boolean;
    /**
     * Font size.
     */
    size?: number | string;
    /**
     * Add a spacer.
     */
    spaced?: "top" | "bottom" | "right" | "left";
    /**
     * Custom styles object.
     */
    styles?: CSSProperties | undefined;
    /**
     * De-emphasises the heading.
     */
    subHeading?: boolean;
    /**
     * Truncate the text and adds ellipsis on overflow.
     */
    truncate?: boolean;
    /**
     * Determines if the font weight should be bold.
     */
    weight?:
        | "100"
        | "200"
        | "300"
        | "400"
        | "500"
        | "600"
        | "700"
        | "800"
        | "900"
        | "bold"
        | "normal"
        | "lighter"
        | string;
    /**
     * Width of the container.
     */
    width?: string | number;
}

/**
 * Text component.
 *
 * @param props - Props injected to the component.
 * @returns Text typography component.
 */
export const Text: React.FunctionComponent<PropsWithChildren<TextPropsInterface>> = (
    props: PropsWithChildren<TextPropsInterface>
): ReactElement => {

    const {
        className,
        children,
        compact,
        display,
        inline,
        muted,
        size,
        spaced,
        styles,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        truncate,
        weight,
        width,
        ...rest
    } = props;

    const classes = classNames(
        "text-typography",
        {
            compact,
            "ellipsis": truncate,
            [ `spaced-${ spaced }` ]: spaced,
            inline,
            muted
        }
        , className
    );

    const resolveInlineStyles = (overrides?: CSSProperties | undefined): CSSProperties | undefined => {
        let modified = {};

        if (weight) {
            modified = {
                ...modified,
                fontWeight: weight
            };
        }

        if (display) {
            modified = {
                ...modified,
                display
            };
        }

        if (width) {
            modified = {
                ...modified,
                width: width
            };
        }

        if (size) {
            modified = {
                ...modified,
                fontSize: typeof size === "number" ? `${ size }px` : size
            };
        }

        return {
            ...modified,
            ...overrides
        };
    };

    return (
        <div
            style={ resolveInlineStyles(styles) }
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            { children }
        </div>
    );
};

/**
 * Default props for the text component.
 */
Text.defaultProps = {
    compact: false,
    "data-componentid": "text",
    "data-testid": "text"
};
