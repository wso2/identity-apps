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

import { ErrorLayout as ErrorLayoutSkeleton } from "@wso2is/react-components";
import React, { FunctionComponent, PropsWithChildren, ReactElement } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ProtectedRoute } from "../components";
import { errorLayoutRoutes } from "../configs";

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
 * @param {React.PropsWithChildren<ErrorLayoutPropsInterface>} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const ErrorLayout: FunctionComponent<PropsWithChildren<ErrorLayoutPropsInterface>> = (
    props: PropsWithChildren<ErrorLayoutPropsInterface>
): ReactElement => {

    const { fluid } = props;

    return (
        <ErrorLayoutSkeleton fluid={ fluid }>
            <Switch>
                {
                    errorLayoutRoutes.map((route, index) => (
                        route.redirectTo
                            ? <Redirect to={ route.redirectTo } />
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
                                        render={ (renderProps) =>
                                            (<route.component { ...renderProps } />)
                                        }
                                        key={ index }
                                    />
                                )
                    ))
                }
            </Switch>
        </ErrorLayoutSkeleton>
    );
};

/**
 * Default props for the error layout.
 */
ErrorLayout.defaultProps = {
    fluid: true
};
