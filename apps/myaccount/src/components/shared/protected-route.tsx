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

import { AppConstants as AppConstantsCore } from "@wso2is/core/constants";
import { RouteInterface } from "@wso2is/core/models";
import { AuthenticateUtils } from "@wso2is/core/utils";
import React, { FunctionComponent, ReactElement } from "react";
import { useSelector } from "react-redux";
import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import { AppConstants } from "../../constants";
import { AppState } from "../../store";

/**
 * Protected route props interface.
 */
interface ProtectedRoutePropsInterface extends RouteProps {
    /**
     * Route object.
     */
    route?: RouteInterface;
}

/**
 * Protected route component.
 *
 * @param {RouteProps} props - Props injected to the component.
 * @return {React.ReactElement}
 */
export const ProtectedRoute: FunctionComponent<ProtectedRoutePropsInterface> = (
    props: ProtectedRoutePropsInterface
): ReactElement => {

    const {
        component: Component,
        route,
        ...rest
    } = props;

    const isAuthenticated: boolean = useSelector((state: any) => state.authenticationInformation.isAuth);
    const allowedScopes: string = useSelector((state: AppState) => state?.authenticationInformation?.scope);

    /**
     * Update existing location path in the state to recall upon page refresh or authentication callback.
     * The login path and the login error path have been skipped.
     */
    if ((window.location.pathname !== AppConstants.getAppLoginPath())
        && (window.location.pathname !== AppConstants.getPaths().get("UNAUTHORIZED"))
        && (window.location.pathname !== AppConstants.getPaths().get("PAGE_NOT_FOUND")
        && (window.location.pathname !== AppConstants.getPaths().get("STORING_DATA_DISABLED")))) {
        AuthenticateUtils.updateAuthenticationCallbackUrl(AppConstantsCore.MY_ACCOUNT_APP,
            window.location.pathname);
    } else {
        AuthenticateUtils.updateAuthenticationCallbackUrl(
            AppConstantsCore.MY_ACCOUNT_APP, 
            AppConstants.getAppHomePath()
        );
    }

    /**
     * Checks if the users have the required scope and direct them to the relevant
     *
     * @param {RouteComponentProps<any>} props - Route props.
     * @return {React.ReactElement}
     */
    const resolveComponents = (props: RouteComponentProps<any>): ReactElement => {
        const scopes = allowedScopes?.split(" ");

        if (!route?.scope) {
            return (<Component { ...props } />);
        }

        if (scopes?.includes(route?.scope)) {
            return <Component { ...props } />;
        } else {
            return <Redirect to={ AppConstants.getPaths().get("ACCESS_DENIED_ERROR") } />;
        }
    };

    return (
        <Route
            render={ (renderProps: RouteComponentProps<any>) =>
                isAuthenticated
                    ? resolveComponents(renderProps)
                    : <Redirect to={ AppConstants.getAppLoginPath() } />
            }
            { ...rest }
        />
    );
};
