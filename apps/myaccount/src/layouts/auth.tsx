/**
 * Copyright (c) 2022-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RouteInterface } from "@wso2is/core/models";
import { AuthLayout as AuthLayoutSkeleton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, Suspense, useEffect, useState } from "react";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { PreLoader, ProtectedRoute } from "../components";
import { getAuthLayoutRoutes } from "../configs";
import { AppConstants } from "../constants";

/**
 * Auth layout props interface.
 */
interface AuthLayoutPropsInterface {
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Implementation of the Auth layout skeleton.
 * Used to render the authentication related components.
 *
 * @param props - Props injected to the component.
 * @returns Auth Layout component.
 */
export const AuthLayout: FunctionComponent<AuthLayoutPropsInterface> = (
    props: AuthLayoutPropsInterface
): ReactElement => {

    const { fluid } = props;

    const [ authLayoutRoutes, setAuthLayoutRoutes ] = useState<RouteInterface[]>(getAuthLayoutRoutes());

    /**
     * Listen for base name changes and updated the layout routes.
     */
    useEffect(() => {
        setAuthLayoutRoutes(getAuthLayoutRoutes());
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    return (
        <AuthLayoutSkeleton fluid={ fluid }>
            <Suspense fallback={ <PreLoader /> }>
                <Switch>
                    {
                        authLayoutRoutes.map((route: RouteInterface, index: number) => (
                            route.redirectTo
                                ? <Redirect to={ route.redirectTo } key={ index } />
                                : route.protected
                                    ? (
                                        <ProtectedRoute
                                            component={ route.component ? route.component : null }
                                            path={ route.path }
                                            key={ index }
                                            exact={ route.exact }
                                        />
                                    )
                                    : (
                                        <Route
                                            path={ route.path }
                                            render={ (renderProps: RouteComponentProps) =>
                                                route.component
                                                    ? <route.component { ...renderProps } />
                                                    : null
                                            }
                                            key={ index }
                                            exact={ route.exact }
                                        />
                                    )
                        ))
                    }
                </Switch>
            </Suspense>
        </AuthLayoutSkeleton>
    );
};

/**
 * Default props for the auth layout.
 */
AuthLayout.defaultProps = {
    fluid: true
};
