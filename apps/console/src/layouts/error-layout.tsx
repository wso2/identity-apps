/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { ProtectedRoute } from "@wso2is/admin.core.v1/components";
import { AppConstants } from "@wso2is/admin.core.v1/constants";
import { RouteInterface } from "@wso2is/core/models";
import { ContentLoader, ErrorLayout as ErrorLayoutSkeleton } from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement, Suspense, useEffect, useState } from "react";
import { StaticContext } from "react-router";
import { Redirect, Route, RouteComponentProps, Switch } from "react-router-dom";
import { getErrorLayoutRoutes } from "../configs/routes";

/**
 * Error layout Prop types.
 */
export interface ErrorLayoutPropsInterface {
    /**
     * Is layout fluid.
     */
    fluid?: boolean;
}

/**
 * Implementation of the error layout skeleton.
 * Used to render error pages.
 *
 * @param PropsWithChildren - Props injected to the component.
 *
 * @returns a React.ReactElement.
 */
const ErrorLayout: FunctionComponent<PropsWithChildren<ErrorLayoutPropsInterface>> = (
    props: PropsWithChildren<ErrorLayoutPropsInterface>
): ReactElement => {

    const { fluid } = props;

    const [ errorLayoutRoutes, setErrorLayoutRoutes ] = useState<RouteInterface[]>(getErrorLayoutRoutes());

    /**
     * Listen for base name changes and updates the layout routes.
     */
    useEffect(() => {
        setErrorLayoutRoutes(getErrorLayoutRoutes());
    }, [ AppConstants.getTenantQualifiedAppBasename() ]);

    return (
        <ErrorLayoutSkeleton fluid={ fluid }>
            <Suspense fallback={ <ContentLoader dimmer/> }>
                <Switch>
                    {
                        errorLayoutRoutes.map((route: RouteInterface, index: number) => (
                            route.redirectTo
                                ? <Redirect key={ index } to={ route.redirectTo } />
                                : route.protected
                                    ? (
                                        <ProtectedRoute
                                            component={ route.component }
                                            path={ route.path }
                                            key={ index }
                                        />
                                    )
                                    : (
                                        <Route
                                            path={ route.path }
                                            render={ (renderProps: RouteComponentProps<{
                                                [x: string]: string;
                                            }, StaticContext, unknown>) =>
                                                (<route.component { ...renderProps } />)
                                            }
                                            key={ index }
                                        />
                                    )
                        ))
                    }
                </Switch>
            </Suspense>
        </ErrorLayoutSkeleton>
    );
};

/**
 * Default props for the error layout.
 */
ErrorLayout.defaultProps = {
    fluid: true
};

export default ErrorLayout;
