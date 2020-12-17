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

    const developRoutes: RouteInterface[]  =  [ ...ExtensionsManager.getConfig().routes.develop ];
    const fullscreenRoutes: RouteInterface[]  = [ ...ExtensionsManager.getConfig().routes.fullscreen ];

    developRoutes.forEach(route => {
        const routePath = route.components;
        route.component = lazy(() => import(`${routePath}`));
    });

    fullscreenRoutes.forEach(route => {
        const routePath = route.components;
        route.component = lazy(() => import(`${routePath}`));
    });

    return {
        develop: developRoutes,
        fullscreen: fullscreenRoutes
    };
};
