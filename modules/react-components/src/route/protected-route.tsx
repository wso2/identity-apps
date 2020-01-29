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

import React from "react";
import { Redirect, Route } from "react-router-dom";

/**
 * Proptypes for the protected route component.
 */
export interface ProtectedRouteProps {
    component: any;
    currentPath: string;
    isAuthorized: boolean;
    onAuthCallbackUrlUpdate: (url: string) => void;
    loginPath: string;
    loginErrorPath: string;
}

export const ProtectedRoute: React.FunctionComponent<ProtectedRouteProps> = (
    props: ProtectedRouteProps
): JSX.Element => {

    const {
        component: Component,
        currentPath,
        isAuthorized,
        onAuthCallbackUrlUpdate,
        loginPath,
        loginErrorPath,
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
            { ...rest }
        />
    );
};
