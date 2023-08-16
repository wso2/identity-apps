/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import classNames from "classnames";
import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactElement,
    ReactNode
} from "react";
import { BaseLayout, BaseLayoutInterface } from "./base";

/**
 * Dashboard layout Prop types.
 */
export interface DashboardLayoutPropsInterface extends BaseLayoutInterface {
    /**
     * App footer component.
     */
    footer?: ReactNode;
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
    /**
     * App header component.
     */
    header?: ReactNode;
    /**
     * App side navigation component.
     */
    sidePanel?: ReactElement;
}

/**
 * Dashboard layout.
 *
 * @param props - Props injected to the component.
 * @returns Dashboard Layout component.
 */
export const DashboardLayout: FunctionComponent<PropsWithChildren<DashboardLayoutPropsInterface>> = (
    props: PropsWithChildren<DashboardLayoutPropsInterface>
): ReactElement => {

    const {
        alert,
        children,
        className,
        footer,
        fluid,
        header,
        sidePanel,
        topLoadingBar
    } = props;

    const classes = classNames(
        "layout",
        "dashboard-layout",
        {
            [ "fluid-dashboard-layout" ]: fluid
        },
        className
    );

    return (
        <BaseLayout
            alert={ alert }
            topLoadingBar={ topLoadingBar }
        >
            <div className={ classes }>
                { header }
                { React.cloneElement(sidePanel, { children: children }) }
                { footer }
            </div>
        </BaseLayout>
    );
};

/**
 * Default props for the dashboard layout.
 */
DashboardLayout.defaultProps = {
    fluid: true
};
