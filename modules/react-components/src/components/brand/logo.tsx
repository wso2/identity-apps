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
import React, { CSSProperties, FunctionComponent, ReactElement } from "react";
import { GenericIcon, GenericIconProps, GenericIconSizes } from "../icon";

/**
 * Logo component Prop types.
 */
export interface LogoPropsInterface
    extends Partial<GenericIconProps>,
        IdentifiableComponentInterface,
        TestableComponentInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Logo image.
     */
    image: any;
    /**
     * Logo image size.
     */
    size?: GenericIconSizes;
    /**
     * Custom styles object.
     */
    style?: CSSProperties | undefined;
}

/**
 * Logo component.
 *
 * @param props - Props injected to the component.
 *
 * @returns Logo React Component
 */
export const Logo: FunctionComponent<LogoPropsInterface> = (
    props: LogoPropsInterface
): ReactElement => {

    const {
        className,
        image,
        size,
        style,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    const classes = classNames(className, "product-logo");

    return (
        <GenericIcon
            icon={ image }
            className={ classNames(classes, "product-logo") }
            size={ size }
            style={ style }
            data-componentid={ componentId }
            data-testid={ testId }
            transparent
            { ...rest }
        />
    );
};

/**
 * Default props for the logo component.
 */
Logo.defaultProps = {
    "data-componentid": "logo",
    "data-testid": "logo",
    size: "auto"
};
