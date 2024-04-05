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
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Filters the set of enabled routes based on the app config.
     *
     * @param routes - Routes to evaluate.
     * @param featureConfig - Feature config.
     * @param allowedScopes - Set of allowed scopes.
     * @param checkForUIResourceScopes - Sets if UI Resource Scopes should be considered for filtering.
     * @param hiddenRoutes - Routes to be hidden.
     * @param allowedRoutes - Routes to be shown.
     * @param customLogic - Custom logic to perform on route object.
     *
     * @returns Filtered routes.
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
        // `allow` enables child routes of allowed routes to be added to the `filteredRoutes` array.
        const filter = (routeArr: RouteInterface[] | ChildRouteInterface[], allowedScopes: string, allow?: boolean) => {
            routeArr.forEach((route: RouteInterface | ChildRouteInterface) => {
                let feature: FeatureAccessConfigInterface = null;

                for (const [ key, value ] of Object.entries(featureConfig)) {
                    if (key === route.id) {
                        feature = value;

                        break;
                    }
                }

                const handleRouteEnabled = () => {
                    const isRouteAllowed: boolean = (!allowedRoutes || allowedRoutes.includes(route.id));

                    if (route.children) {
                        filter(route.children, allowedScopes, isRouteAllowed);
                    }

                    if (!hiddenRoutes?.includes(route.id) && (isRouteAllowed || allow)) {
                        filteredRoutes.push(route);

                        if (route.showOnSidePanel) {
                            const sanitizedRoute: RouteInterface | ChildRouteInterface = { ...route };

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
     * @param routes - Routes to evaluate.
     * @param hiddenRoutes - Set of hidden routes.
     * @returns filtered routes.
     */
    public static sanitizeForUI(routes: RouteInterface[], hiddenRoutes: string[] = []): RouteInterface[] {

        // Remove any redundant routes.
        const sanitize = (routeArr: RouteInterface[] | ChildRouteInterface[]) => {
            return routeArr.filter((route: RouteInterface | ChildRouteInterface) => {
                if (isEmpty(route.children) && !route.path) {
                    return false;
                }

                if (!isEmpty(route.children) && !route.path) {
                    const isFurtherNested: boolean = route.children.some((item: ChildRouteInterface) => item.children);

                    if (isFurtherNested) {
                        route.children = sanitize(route.children);
                    } else {
                        return route.children.some(
                            (item: ChildRouteInterface) => item.showOnSidePanel && !hiddenRoutes.includes(item.id)
                        );
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
     * @param pathname - Current pathname in location.
     * @param route - Route to be evaluated.
     * @returns If the route is active or not.
     */
    public static isActiveRoute(pathname: string, route: RouteInterface | ChildRouteInterface): boolean {

        const match = (routePath: string): boolean => {
            return matchPath(pathname, routePath).isExact;
        };

        const checkChildren = (childRoutes: ChildRouteInterface[]): boolean => {
            if (!childRoutes) {
                return false;
            }

            for (const child of childRoutes) {
                const isMatching: boolean = match(child.path);

                if (isMatching) {
                    return true;
                }
            }

            return false;
        };

        return match(route?.path) || checkChildren(route?.children);
    }

    /**
     * Gets the active route on initial app loading time.
     *
     * @param pathname - Current pathname in location.
     * @param routes - Evaluating routes.
     * @returns initially active route.
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
