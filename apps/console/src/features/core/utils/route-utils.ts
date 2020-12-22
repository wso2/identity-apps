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

import { RouteInterface } from "@wso2is/core/models";
import { chain } from "lodash";
import sortBy from "lodash/sortBy";
import { AppConstants } from "../constants";
import { history } from "../helpers";

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
    private constructor() { }

    /*
     * Gracefully handles application routing to avoid less privileged users from
     * receiving unauthorized pages.
     *
     * @param {RouteInterface[]} routes - Set of app routes.
     * @param {string} view - Current view ex: Admin or Develop. 
     * @param {string} pathname - Current path from location.
     * @param {boolean} navigateToUnAuthorized - Should navigate to un-authorized page.
     */
    public static gracefullyHandleRouting(routes: RouteInterface[],
                                          view: string,
                                          pathname: string,
                                          navigateToUnAuthorized: boolean = true): void {

        if (RouteUtils.isOnlyPageNotFoundPresent(routes)) {
            if (RouteUtils.isHomePath(view)) {
                if (view === AppConstants.getDeveloperViewBasePath()) {
                    history.push(AppConstants.getAdminViewHomePath());

                    return;
                }

                if (view === AppConstants.getAdminViewBasePath()) {
                    history.push(AppConstants.getDeveloperViewHomePath());

                    return;
                }
            }

            if (navigateToUnAuthorized) {
                history.push({
                    pathname: AppConstants.getPaths().get("UNAUTHORIZED"),
                    search: "?error=" + AppConstants.LOGIN_ERRORS.get("ACCESS_DENIED")
                });
                
                return;
            }
        }

        if (RouteUtils.isRouteAvailable(view, pathname, routes)) {
            return;
        }

        history.push(sortBy(routes, "order")[0].path);
    }

    /**
     * Checks whether a given pathname is available in the route's
     * children router paths.
     *
     * @param {string} view - Top level route path
     * @param {string} pathname - Cached route path
     * @param {RouteInterface[]} routes - Available routes.
     * @private
     */
    private static isRouteAvailable(view: string, pathname: string, routes: RouteInterface[]): boolean {

        /**
         * If one of the passed arguments are not truthy, then function
         * cannot do the operation and check the available routes. In this
         * case we return false saying there's no matching routes.
         */
        if (!view || !pathname || !routes || !routes.length) {
            return false;
        }

        const EMPTY_STRING: string = "";

        /**
         * In this chain what we do is, go through all the available
         * routes and filter out the top level views and map out all
         * the nested children's path.
         *
         * Explanation: -
         * A top level view can be `/console/develop` and we have
         * nested routes such as [`/console/develop/identity-providers`,
         * `/console/develop/applications`] and each of those route
         * paths will have their own children routes.
         *
         * Note on default values: -
         * Since we use lodash here we need to make sure default values
         * are initialized during the chain when the values are null.
         */
        const allChildPaths: string[] = chain(routes ?? [])
            .filter(({ path = EMPTY_STRING }) => path?.match(view))
            .map(({ children = [] as RouteInterface[] }) => children)
            .flatten()
            .map(({ path = EMPTY_STRING }) => path)
            .value();

        /**
         * If there's no child paths have been found in all the available
         * routes then return false and navigate to another.
         */
        if (!allChildPaths && !allChildPaths.length) {
            return false;
        }

        /**
         * In this function what we do is escape all the special characters
         * of the URI and replace the path_parameters to match a dynamic string.
         *
         * Regex explanation: -
         * {@code [\w~\-\\.!*'(),]+} is a set expression that allows the following
         * characters { a-z A-Z 0-9 _ ~ - \ . ! * () , <space> } one or more times.
         * The expression assumes the path_parameter has at-lease one character and
         * contains only the characters specified above.
         *
         * Refer RFC-3986 {@link https://tools.ietf.org/html/rfc3986#section-2.3}
         *
         * @param {string} path - A valid URL
         */
        const pathToARegex = (path: string): string => {
            if (!path || !path.trim().length) return EMPTY_STRING;
            return path.split("/").map((fragment: string) => {
                if (fragment && fragment.startsWith(":")) {
                    return /[\w~\-\\.!*'(), ]+/.source;
                }
                return fragment ?? EMPTY_STRING;
            }).join("/");
        };

        /**
         * To keep track of the qualified paths that matches exactly the {@code pathname}
         */
        const qualifiedPaths: string[] = [];

        /**
         * Validate each of the child paths against the {@code pathname}.
         */
        for (const childPath of allChildPaths) {
            if (childPath) {
                const expression = RegExp(`^${pathToARegex(childPath)}$`);
                const match = expression.exec(pathname);
                if (match && match.length > 0) {
                    qualifiedPaths.push(...match);
                }
            }
        }

        /**
         * If there's one or more qualified paths, then we can safely assume
         * the requested URL is present in the application.
         */
        return qualifiedPaths.length > 0;

    }

    /**
     * Checks if the passed in path is the home path defined in deployment.config.json.
     *
     * @param {string} path - Path to check.
     * @return {boolean} Is home path or not.
     */
    public static isHomePath(path: string): boolean {

        if (path === AppConstants.getAppHomePath()) {
            return true;
        }

        return path?.split("/")[0] === AppConstants.getAppHomePath()?.split("/")[0];
    }

    /**
     * Checks if only the `404` is available.
     *
     * @param {RouteInterface[]} routes - Set of routes.
     * @return {boolean} Is only `404` available.
     */
    public static isOnlyPageNotFoundPresent(routes: RouteInterface[]): boolean {
        if (routes && Array.isArray(routes) && routes.length === 1) {
            if (routes[ 0 ].redirectTo === AppConstants.getPaths().get("PAGE_NOT_FOUND")) {
                return true;
            }
        }

        return false;
    }

    /**
     * Checks if the view is presentable.
     *
     * @param {RouteInterface[]} routes - Set of routes.
     * @param {string[]} pathsToSkip - Set of paths to skip.
     * @return {boolean}
     */
    public static isViewPresentable(routes: RouteInterface[], pathsToSkip?: string[]) {

        const presentableRoutes: RouteInterface[] = RouteUtils.filterPresentableRoutes(routes, pathsToSkip);

        return !(((presentableRoutes && Array.isArray(presentableRoutes)) && presentableRoutes.length === 0)
            || RouteUtils.isOnlyPageNotFoundPresent(presentableRoutes)
        );
    }

    /**
     * Filters the list of presentable routes.
     *
     * @param {RouteInterface[]} routes - Set of routes.
     * @param {string[]} pathsToSkip - Set of paths to skip.
     * @return {RouteInterface[]}
     */
    public static filterPresentableRoutes(routes: RouteInterface[], pathsToSkip?: string[]) {

        return routes.filter((route: RouteInterface) => {
            if (!route.showOnSidePanel) {
                return false;
            }

            if (pathsToSkip && Array.isArray(pathsToSkip)) {
                return pathsToSkip.some((path: string) => route.path === path);
            }
        });
    }
}
