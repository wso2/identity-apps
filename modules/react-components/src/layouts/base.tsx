/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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
 * @param {React.PropsWithChildren<BaseLayoutInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
