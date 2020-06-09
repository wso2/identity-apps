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

import { AppLayout as AppLayoutSkeleton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ProtectedRoute } from "../components";
import { appRoutes } from "../configs";

/**
 * Implementation of the Main app layout skeleton.
 * Used to render all the layouts that's being used inside the app.
 *
 * @return {React.Element}
 */
export const AppLayout: FunctionComponent<{}> = (): ReactElement => {

    return (
        <AppLayoutSkeleton>
            <Switch>
                {
                    appRoutes.map((route, index) => (
                        route.redirectTo
                            ? <Redirect to={ route.redirectTo } />
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
                                        render={ (renderProps) =>
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
        </AppLayoutSkeleton>
    );
};
