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
import React, { ReactElement } from "react";
import { Header, HeaderProps } from "semantic-ui-react";

/**
 * Heading component prop types.
 */
export interface HeadingPropsInterface extends HeaderProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Determines if the hint is in the disabled state.
     */
    disabled?: boolean;
    /**
     * Determines if the font weight should be bold.
     */
    bold?: boolean | "500";
    /**
     * Adds intentional omission to the header when a width is defined.
     */
    ellipsis?: boolean;
    /**
     * Hide the margins and make the component compact.
     */
    compact?: boolean;
    /**
     * Display inline.
     */
    inline?: boolean;
    /**
     * De-emphasises the heading.
     */
    subHeading?: boolean;
}

/**
 * Heading component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Heading React Component
 */
export const Heading: React.FunctionComponent<HeadingPropsInterface> = (
    props: HeadingPropsInterface
): ReactElement => {

    const {
        bold,
        ellipsis,
        className,
        compact,
        disabled,
        inline,
        subHeading,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "heading",
        {
            [ typeof bold === "boolean" ? "bold" : "bold-" + bold ]: bold,
            compact,
            disabled,
            ellipsis,
            inline,
            [ "subheading" ]: subHeading
        }
        , className
    );

    return (
        <Header
            className={ classes }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        />
    );
};

/**
 * Default props for the transfer component.
 */
Heading.defaultProps = {
    "data-componentid": "heading",
    "data-testid": "heading"
};
