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
import { Container, Divider } from "semantic-ui-react";

/**
 * Error layout Prop types.
 */
export interface ErrorLayoutPropsInterface {
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
 * Error layout.
 *
 * @param props - Props injected to the component.
 *
 * @returns the Error Layout component
 */
export const ErrorLayout: FunctionComponent<PropsWithChildren<ErrorLayoutPropsInterface>> = (
    props: PropsWithChildren<ErrorLayoutPropsInterface>
): ReactElement => {

    const {
        children,
        className,
        fluid
    } = props;

    const classes = classNames(
        "layout",
        "error-layout",
        {
            [ "fluid-error-layout" ]: fluid
        },
        className
    );

    return (
        <Container className={ classes }>
            <Divider className="x4" hidden/>
            { children }
            <Divider className="x3" hidden/>
        </Container>
    );
};
