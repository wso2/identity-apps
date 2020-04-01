/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { useSelector } from "react-redux";
import { Redirect, Route, RouteProps } from "react-router-dom";
import * as ApplicationConstants from "../constants/application-constants";
import { history } from "../helpers";
import { updateAuthenticationCallbackUrl } from "../store/actions";
import { ConfigReducerStateInterface } from "../models";
import { AppState } from "../store";

/**
 * Protected route component.
 *
 * @return {JSX.Element}
 */
export const ProtectedRoute = (props: RouteProps): JSX.Element => {

    const {
        component: Component,
        ...rest
    } = props;

    const isAuth = useSelector((state: any) => state.authenticationInformation.isAuth);
    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    /**
     * Update existing location path in the state to recall upon page refresh or authentication callback.
     * The login path and the login error path have been skipped.
     */
    if ((history.location.pathname !== config.deployment.appLoginPath)
        && (history.location.pathname !== ApplicationConstants.LOGIN_ERROR_PAGE_PATH)) {
        updateAuthenticationCallbackUrl(history.location.pathname);
    }

    return (
        <Route
            render={ (renderProps) =>
                isAuth
                    ? Component
                        ? <Component { ...renderProps } />
                        : null
                    : <Redirect to={ config.deployment.appLoginPath } />
            }
            { ...rest }
        />
    );
};
