/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { RouteInterface } from "@wso2is/core/models";
import { AuthLayout as AuthLayoutSkeleton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, Suspense, useEffect, useState } from "react";
import { StaticContext } from "react-router";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { PreLoader } from "../features/core";
import { ProtectedRoute } from "../features/core/components";
import { getAuthLayoutRoutes } from "../features/core/configs";
import { AppConstants } from "../features/core/constants";

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
 * @param AuthLayoutPropsInterface - Props injected to the component.
 *
 * @returns a React.ReactElement.
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
                                ? <Redirect key={ index } to={ route.redirectTo } />
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
                                            render={ (renderProps: RouteComponentProps<{
                                                [x: string]: string;
                                            }, StaticContext, unknown>) =>
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
