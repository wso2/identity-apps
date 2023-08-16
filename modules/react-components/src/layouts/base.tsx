/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import classNames from "classnames";
import React, { FunctionComponent, PropsWithChildren, ReactElement, ReactNode } from "react";
import { Container } from "semantic-ui-react";

/**
 * Prop types interface for the base layout.
 */
export interface BaseLayoutInterface {
    /**
     * Additional CSS classes.
     */
    className?: string;
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
    /**
     * Top loading bar.
     */
    topLoadingBar?: ReactNode;
    /**
     * Alerting component.
     */
    alert?: ReactNode;
}

/**
 * Base layout.
 * This layout contains the alert & top loader and can be used by any other
 * layout to inherit them.
 *
 * @param props - Props injected to the component.
 *
 * @returns the Base Layout component
 */
export const BaseLayout: FunctionComponent<PropsWithChildren<BaseLayoutInterface>> = (
    props: PropsWithChildren<BaseLayoutInterface>
): ReactElement => {

    const {
        alert,
        children,
        className,
        fluid,
        topLoadingBar
    } = props;

    const classes = classNames(
        "layout",
        "base-layout",
        className
    );

    return (
        <Container className={ classes } fluid={ fluid }>
            { topLoadingBar }
            { children }
            { alert }
        </Container>
    );
};

/**
 * Default props for the base layout.
 */
BaseLayout.defaultProps = {
    fluid: true
};
