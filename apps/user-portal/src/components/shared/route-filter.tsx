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

import React from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { ProtectedRoute } from ".";
import config from "../../../app.config.json";
import { Routes } from "../../models";

/**
 * Prop types for the RouteFilter component
 */
interface RouteFilterPropsInterface {
    route: Routes;
    index: number;
}

/**
 *
 * @param props Component to filter routes based on app.config
 */
export const RouteFilter = (props: RouteFilterPropsInterface): JSX.Element => {

    const { route, index } = props;

    /**
     * This removes the `common:` part from teh route names
     * @param name
     */
    const getRouteName = (name: string): string => {
        return name.split(":")[1];
    };

    /**
     *
     * @param routes Checks the config file to see if the route should be enabled
     */
    const checkEnabled = (routes: Routes): boolean => {
        const routeName = getRouteName(routes.name);

        if (typeof config[routeName] === "boolean" && config[routeName]) {
            return true;
        } else if (typeof config[routeName] === "object" && config[routeName].enabled) {
            return true;
        } else if (!routes.showOnSidePanel) {
            return true;
        } else {
            return false;
        }
    };

    return (
        checkEnabled(route)
            ? route.protected
                ? (
                    <ProtectedRoute
                        component={ route.component }
                        path={ route.path }
                        key={ index }
                    />
                )
                : (
                    <Route
                        render={ (routeProps) =>
                            (
                                <route.component { ...routeProps } />
                            )
                        }
                        path={ route.path }
                        key={ index }
                    />
                )
            : null
    );
};
