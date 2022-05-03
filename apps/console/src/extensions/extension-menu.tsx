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

import { RouteInterface } from "@wso2is/core/models";
import  { lazy } from "react";
import { ExtensionsManager } from "./extensions-manager";
import { ExtensionRoutesInterface } from "./models";

/**
 * This will dynamically add extension routes to the application.
 *
 * @return {ExtensionRoutesInterface}
 */
export const EXTENSION_ROUTES = (): ExtensionRoutesInterface  => {

    const defaultRoutes: RouteInterface[]  =  [ ...ExtensionsManager.getConfig().routes.default ];
    const developRoutes: RouteInterface[]  =  [ ...ExtensionsManager.getConfig().routes.develop ];
    const manageRoutes: RouteInterface[]  =  [ ...ExtensionsManager.getConfig().routes.manage ];
    const fullscreenRoutes: RouteInterface[]  = [ ...ExtensionsManager.getConfig().routes.fullscreen ];
    const authRoutes: RouteInterface[]  = [ ...ExtensionsManager.getConfig().routes.auth ];

    return {
        auth: loadRouteComponents(authRoutes),
        default: loadRouteComponents(defaultRoutes),
        develop: loadRouteComponents(developRoutes),
        fullscreen: loadRouteComponents(fullscreenRoutes),
        manage: loadRouteComponents(manageRoutes)
    };
};

/**
 * Lazy load the components relevant to the routes specified.
 *
 * @param routes
 *
 * @return {RouteInterface[]}
 */
const loadRouteComponents = (routes: RouteInterface[]): RouteInterface[] => {

    routes.map(route => {

        // If a component is not defined. Don't load. Useful in overriding scenarios.
        if (!route.component) {
            return;
        }

        // When lazy loading the component the import will return an object if we directly
        // pass the component path. Therefore we have overcome this issue by assigning it to a
        // const.
        const routePath = route.component;
        route.component = lazy(() => import(`${ routePath }`));

        if (route.children && route.children.length > 0) {
            route.children = loadRouteComponents(route.children);
        }

    });

    return routes;
};
