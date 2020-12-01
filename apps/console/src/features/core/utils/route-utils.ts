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

        const isRouteAvailable: RouteInterface = routes.find((route: RouteInterface) => route.path === pathname);

        if (isRouteAvailable) {
            return;
        }

        history.push(sortBy(routes, "order")[0].path);
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
