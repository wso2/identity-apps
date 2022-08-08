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
 *
 */

import isEmpty from "lodash-es/isEmpty";
import { matchPath } from "react-router-dom";
import { AppConstants } from "../constants";
import { hasRequiredScopes } from "../helpers";
import { ChildRouteInterface, FeatureAccessConfigInterface, RouteInterface } from "../models";

/**
 * Utility class for application routes related operations.
 */
export class RouteUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Filters the set of enabled routes based on the app config.
     *
     * @param {RouteInterface[]} routes - Routes to evaluate.
     * @param {T} featureConfig - Feature config.
     * @param {string} allowedScopes - Set of allowed scopes.
     * @param {boolean} checkForUIResourceScopes - Sets if UI Resource Scopes should be considered for filtering.
     * @param {string[]} hiddenRoutes - Routes to be hidden.
     * @param {string[]} allowedRoutes - Routes to be shown.
     * @param {(route: RouteInterface) => void} - Custom logic to perform on route object.
     *
     * @return {RouteInterface[]} Filtered routes.
     */
    public static filterEnabledRoutes<T>(routes: RouteInterface[],
        featureConfig: T,
        allowedScopes: string,
        checkForUIResourceScopes?: boolean,
        hiddenRoutes?: string[],
        allowedRoutes?: string[],
        customLogic?: (route: RouteInterface) => void): [ RouteInterface[], RouteInterface[] ] {

        const filteredRoutes: RouteInterface[] = [];
        const sanitizedRoutes: RouteInterface[] = [];

        // Filters features based on scope requirements.
        const filter = (routeArr: RouteInterface[] | ChildRouteInterface[], allowedScopes: string) => {
            routeArr.forEach((route: RouteInterface | ChildRouteInterface) => {
                let feature: FeatureAccessConfigInterface = null;

                for (const [ key, value ] of Object.entries(featureConfig)) {
                    if (key === route.id) {
                        feature = value;

                        break;
                    }
                }

                const handleRouteEnabled = () => {
                    if (route.children) {
                        filter(route.children, allowedScopes);
                    }

                    if (!hiddenRoutes?.includes(route.id) &&
                        (!allowedRoutes || allowedRoutes.includes(route.id))) {
                        filteredRoutes.push(route);

                        if (route.showOnSidePanel) {
                            const sanitizedRoute = { ...route };

                            sanitizedRoute.children = [];
                            sanitizedRoutes.push(sanitizedRoute);
                        }
                    }
                };

                customLogic && customLogic(route);

                if (!feature) {
                    handleRouteEnabled();
                }

                if (!feature?.enabled) {
                    return;
                }

                if (
                    checkForUIResourceScopes &&
                    !(
                        hasRequiredScopes(feature, [ AppConstants.FULL_UI_SCOPE ], allowedScopes) ||
                        hasRequiredScopes(feature, feature?.scopes?.feature, allowedScopes)
                    )
                ) {
                    return;
                }

                // Ideally, the read scope should be available if the UI resource scope is available.
                if (hasRequiredScopes(feature, feature?.scopes?.read, allowedScopes)) {
                    handleRouteEnabled();
                }

                return;
            });
        };

        filter(routes, allowedScopes);

        return [ filteredRoutes, sanitizedRoutes ];
    }

    /**
     * Sanitize the routes for UI. Removes unnecessary routes which are not supposed to be
     * displayed on the UI navigation panels.
     *
     * @param {RouteInterface[]} routes - Routes to evaluate.
     * @param {string[]} hiddenRoutes - Set of hidden routes.
     * @return {RouteInterface[]} Filtered routes.
     */
    public static sanitizeForUI<T>(routes: RouteInterface[], hiddenRoutes: string[] = []): RouteInterface[] {

        // Remove any redundant routes.
        const sanitize = (routeArr: RouteInterface[] | ChildRouteInterface[]) => {
            return routeArr.filter((route: RouteInterface | ChildRouteInterface) => {
                if (isEmpty(route.children) && !route.path) {
                    return false;
                }

                if (!isEmpty(route.children) && !route.path) {
                    const isFurtherNested = route.children.some((item) => item.children);

                    if (isFurtherNested) {
                        route.children = sanitize(route.children);
                    } else {
                        return route.children.some((item) => item.showOnSidePanel && !hiddenRoutes.includes(item.id));
                    }
                }

                if (route.children) {
                    route.children = sanitize(route.children);
                }

                return route.showOnSidePanel && !hiddenRoutes.includes(route.id);
            });
        };

        return sanitize(routes);
    }

    /**
     * Checks if the URL path is similar to the path of the route that's passed in.
     *
     * @param {string} pathname - Current pathname in location.
     * @param {RouteInterface | ChildRouteInterface} route - Route to be evaluated.
     * @return {boolean} If the route is active or not.
     */
    public static isActiveRoute(pathname: string, route: RouteInterface | ChildRouteInterface): boolean {

        const match = (routePath: string): boolean => {
            return matchPath(pathname, routePath)?.isExact;
        };

        const checkChildren = (childRoutes): boolean => {
            if (!childRoutes) {
                return false;
            }

            for (const child of childRoutes) {
                const isMatching = match(child.path);

                if (isMatching) {
                    return true;
                }
            }
        };

        return match(route?.path) || checkChildren(route?.children);
    }

    /**
     * Gets the active route on initial app loading time.
     *
     * @param {string} pathname - Current pathname in location.
     * @param {RouteInterface[]} routes - Evaluating routes.
     * @return {RouteInterface | ChildRouteInterface} Initially active route.
     */
    public static getInitialActiveRoute(pathname: string,
        routes: RouteInterface[]): RouteInterface | ChildRouteInterface {

        let activeRoute: RouteInterface | ChildRouteInterface = null;

        for (const route of routes) {
            // Terminate the evaluation if the route is
            // not supposed to be displayed on the side panel.
            if (!route.showOnSidePanel) {
                continue;
            }

            activeRoute = route;

            if (this.isActiveRoute(pathname, route)) {
                break;
            }
            activeRoute = null;
        }


        return activeRoute;
    }
}
