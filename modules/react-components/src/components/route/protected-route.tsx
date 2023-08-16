/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
     * @param url - URL.
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
 * @param props - Props injected in to the component.
 *
 * @returns protect route component
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
            data-componentid={ componentId }
            data-testid={ testId }
            { ...rest }
        />
    );
};
