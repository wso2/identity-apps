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
import React, { FunctionComponent, ReactElement } from "react";
import { ButtonProps, Loader, LoaderProps, Button as SemanticButton } from "semantic-ui-react";

/**
 * Link button component Prop types.
 */
export interface LinkButtonPropsInterface extends ButtonProps, IdentifiableComponentInterface,
    TestableComponentInterface {

    /**
     * Compact mode with no padding.
     */
    compact?: boolean;
    /**
     * Hover type.
     */
    hoverType?: "underline";
    /**
     * To represent info state.
     */
    info?: boolean;
    /**
     * Loader position.
     */
    loaderPosition?: "left" | "right";
    /**
     * Loader size.
     */
    loaderSize?: LoaderProps["size"];
    /**
     * To represent warning state.
     */
    warning?: boolean;
}

/**
 * Link button component.
 *
 * @param props - Props injected to the component.
 *
 * @returns a React component
 */
export const LinkButton: FunctionComponent<LinkButtonPropsInterface> = (
    props: LinkButtonPropsInterface
): ReactElement => {

    const {
        children,
        className,
        compact,
        hoverType,
        info,
        loading,
        loaderPosition,
        loaderSize,
        warning,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(
        "link-button",
        {
            compact,
            [ `hover-${ hoverType }` ]: hoverType,
            info,
            [ `loader-${ loaderPosition }` ]: loading && loaderPosition,
            warning
        },
        className
    );

    return (
        <SemanticButton
            className={ classes }
            loading={ loading && !loaderPosition }
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        >
            {
                loading && loaderPosition === "left" && (
                    <Loader
                        active
                        inline
                        size={ loaderSize }
                        data-componentid={ `${ componentId }-loader` }
                        data-testid={ `${ testId }-loader` }
                    />
                )
            }
            { children }
            {
                loading && loaderPosition === "right" && (
                    <Loader
                        active
                        inline
                        size={ loaderSize }
                        data-componentid={ `${ componentId }-loader` }
                        data-testid={ `${ testId }-loader` }
                    />
                )
            }
        </SemanticButton>
    );
};

/**
 * Prop types for the link button component.
 */
LinkButton.defaultProps = {
    basic: true,
    "data-componentid": "link-button",
    "data-testid": "link-button",
    loaderSize: "mini",
    primary: true
};
