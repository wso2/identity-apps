/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Container } from "semantic-ui-react";

/**
 * Auth layout Prop types.
 */
export interface AuthLayoutPropsInterface {
    /**
     * Extra CSS classes.
     */
    className?: string;
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Auth layout.
 * Used to render the authentication related components.
 *
 * @param props - Props injected to the component.
 *
 * @returns the Auth layout component
 */
export const AuthLayout: FunctionComponent<PropsWithChildren<AuthLayoutPropsInterface>> = (
    props: PropsWithChildren<AuthLayoutPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        fluid
    } = props;

    const classes = classNames(
        "layout",
        "auth-layout",
        {
            [ "fluid-auth-layout" ]: fluid
        },
        className
    );

    return (
        <Container className={ classes } fluid={ fluid }>
            { children }
        </Container>
    );
};

/**
 * Default props for the auth layout.
 */
AuthLayout.defaultProps = {
    fluid: true
};
