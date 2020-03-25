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

import _ from "lodash";
import { ChildRouteInterface, RouteInterface } from "../models";

/**
 * Utility class for application routes related operations.
 */
export class RouteUtils {

    private static readonly DEFAULT_FEATURE_ENABLED_CHECKER_KEY: string = "enabled";
    private static readonly DEFAULT_FEATURE_READ_PERMISSION_CHECKER_KEY: string = "permissions.read";

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
     * @example
     * Ex. const appConfig = {
     *     "applications: {
     *         "enabled: true,
     *         "permissions: {
     *             "read": true
     *         }
     *     }
     * }
     * Both `applications.enabled` and `applications.permissions.read` will have to be true for the route to be enabled.
     * @param {RouteInterface[] | ChildRouteInterface[]} routes - Routes to evaluate.
     * @param {T} appConfig - App configuration.
     * @param {string} enabledCheckerKey - Feature enabled checker key.
     * @param {string} readPermissionCheckerKey - Feature read permission checker key.
     * @return {RouteInterface[] | ChildRouteInterface[]} Filtered routes.
     */
    public static filterEnabledRoutes<T>(
        routes: RouteInterface[] | ChildRouteInterface[],
        appConfig: T,
        enabledCheckerKey: string = this.DEFAULT_FEATURE_ENABLED_CHECKER_KEY,
        readPermissionCheckerKey: string = this.DEFAULT_FEATURE_READ_PERMISSION_CHECKER_KEY
    ): RouteInterface[] | ChildRouteInterface[] {
        return routes.filter((route: ChildRouteInterface) => {
            if (route.children) {
                route.children = this.filterEnabledRoutes(route.children, appConfig);
            }

            const isEnabled = _.get(appConfig, `${ route.id }.${ enabledCheckerKey }`, true);
            const isReadAllowed = _.get(appConfig, `${ route.id }.${ readPermissionCheckerKey }`, true);

            return !!(isEnabled && isReadAllowed);
        });
    }
}
