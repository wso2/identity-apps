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

import { AppState } from "@wso2is/admin.core.v1";
import { getErrorLayoutRoutes } from "@wso2is/admin.core.v1/configs";
import { AppConstants } from "@wso2is/admin.core.v1/constants";
import { RouteInterface } from "@wso2is/core/models";
import { ContentLoader, ErrorLayout as ErrorLayoutSkeleton } from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement, Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";

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
export const ErrorLayout: FunctionComponent<PropsWithChildren<ErrorLayoutPropsInterface>> = (
    props: PropsWithChildren<ErrorLayoutPropsInterface>
): ReactElement => {

    const { fluid } = props;

    const isAuthenticated: boolean = useSelector((state: AppState) => state.auth.isAuthenticated);

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
                <Routes>
                    {
                        errorLayoutRoutes.map((route: RouteInterface, index: number) => (
                            route.redirectTo
                                ? <Route path="*" element={ <Navigate to={ route.redirectTo } /> } key={ index } />
                                : route.protected
                                    ? (
                                        <Route
                                            element={
                                                isAuthenticated && route.component
                                                    ? <route.component />
                                                    : <Navigate to={ AppConstants.getAppLogoutPath() } />
                                            }
                                            path={ route.path }
                                            key={ index }
                                        />
                                    )
                                    : (
                                        <Route
                                            path={ route.path }
                                            element={
                                                <route.component />
                                            }
                                            key={ index }
                                        />
                                    )
                        ))
                    }
                </Routes>
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
