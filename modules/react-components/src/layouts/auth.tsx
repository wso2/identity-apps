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
 * @param {React.PropsWithChildren<AuthLayoutPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
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
