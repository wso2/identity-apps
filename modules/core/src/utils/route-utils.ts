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

    private static readonly DEFAULT_READ_PERMISSION_KEY: string = "permissions.read";

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
     * @param {RouteInterface[] | ChildRouteInterface[]} routes - Routes to evaluate.
     * @param {T} appConfig - App configuration.
     * @param {string} readPermissionKey - Optional permission key.
     * @return {RouteInterface[] | ChildRouteInterface[]} Filtered routes.
     */
    public static filterEnabledRoutes<T>(
        routes: RouteInterface[] | ChildRouteInterface[],
        appConfig: T,
        readPermissionKey = this.DEFAULT_READ_PERMISSION_KEY
    ): RouteInterface[] | ChildRouteInterface[] {
        return routes.filter((route: ChildRouteInterface) => {
            if (route.children) {
                route.children = this.filterEnabledRoutes(route.children, appConfig);
            }

            return _.get(appConfig, `${ route.id }.${ readPermissionKey }`, true);
        });
    }
}
