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

import { AuthenticateUtils } from "@wso2is/core/utils";
import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { GlobalConfig } from "../../configs";
import { ApplicationConstants } from "../../constants";
import { history } from "../../helpers";
import { AppState } from "../../store";

export const ProtectedRoute = ({ component: Component, route, ...rest }) => {

    const isAuth = useSelector((state: any) => state.authenticationInformation.isAuth);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);

    /**
     * Update existing location path in the state to recall upon page refresh or authentication callback.
     * The login path and the login error path have been skipped.
     */
    if ((history.location.pathname !== GlobalConfig.appLoginPath)
        && (history.location.pathname !== ApplicationConstants.LOGIN_ERROR_PAGE_PATH)
        && (history.location.pathname !== ApplicationConstants.PAGE_NOT_FOUND_PATH)) {
        AuthenticateUtils.updateAuthenticationCallbackUrl(history.location.pathname);
    }
    else {
        AuthenticateUtils.updateAuthenticationCallbackUrl(GlobalConfig.appHomePath);
    }

    /**
     * Checks if the users have the required scope and direct them to the relevant
     *
     * @param props
     */
    const resolveComponents = (props) => {
        const scopes = allowedScopes?.split(" ");

        if (!route?.scope) {
            return (<Component { ...props } />);
        }

        if (scopes?.includes(route?.scope)) {
            return <Component { ...props } />;
        } else {
            return <Redirect to={ ApplicationConstants.ACCESS_DENIED_ERROR_PAGE_PATH } />;
        }
    };

    return (
        <Route
            render={ (props) =>
                isAuth
                    ? <>{ resolveComponents(props) }</>
                    : <Redirect to={ GlobalConfig.appLoginPath } />
            }
            { ...rest }
        />
    );
};
