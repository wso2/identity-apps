/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
