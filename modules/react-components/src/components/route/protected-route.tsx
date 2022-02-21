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

import { IdentifiableComponentInterface, TestableComponentInterface } from "@wso2is/core/models";
import React, { FunctionComponent, ReactElement } from "react";
import { Redirect, Route } from "react-router-dom";

/**
 * Proptypes for the protected route component.
 */
export interface ProtectedRouteProps extends IdentifiableComponentInterface, TestableComponentInterface {
    /**
     * Component to render.
     */
    component: any;
    /**
     * Current location.
     */
    currentPath: string;
    /**
     * Is authorized.
     */
    isAuthorized: boolean;
    /**
     * Auth Callback URL update callback.
     * @param {string} url - URL.
     */
    onAuthCallbackUrlUpdate: (url: string) => void;
    /**
     * Login Path.
     */
    loginPath: string;
    /**
     * Login error path.
     */
    loginErrorPath: string;
}

/**
 * Protected route component.
 *
 * @param {ProtectedRouteProps} props - Props injected in to the component.
 *
 * @return {React.ReactElement}
 */
export const ProtectedRoute: FunctionComponent<ProtectedRouteProps> = (
    props: ProtectedRouteProps
): ReactElement => {

    const {
        component: Component,
        currentPath,
        isAuthorized,
        onAuthCallbackUrlUpdate,
        loginPath,
        loginErrorPath,
        [ "data-componentid" ]: componentId,
        [ "data-testid" ]: testId,
        ...rest
    } = props;

    /**
     * Update existing location path in the state to recall upon page refresh or authentication callback.
     * The login path and the login error path have been skipped.
     */
    if (currentPath !== loginPath && currentPath !== loginErrorPath) {
        onAuthCallbackUrlUpdate(currentPath);
    }

    return (
        <Route
            render={ (props) =>
                isAuthorized ?
                    <Component { ...props } /> :
                    <Redirect to={ loginPath } />
            }
            data-testid={ testId }
            { ...rest }
        />
    );
};
