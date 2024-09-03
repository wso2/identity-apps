/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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

import { RouteInterface } from "@wso2is/core/models";

/**
 * Returns true if a given key in the JSON object is set to true
 * @param appConfig - app config
 * @param key - key to be checked in the config
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const checkEnabled = (appConfig: any, key: string): boolean => {
    if (appConfig[key] === undefined) {
        return true;
    } else if (typeof appConfig[key] === "boolean" && appConfig[key]) {
        return true;
    } else if (typeof appConfig[key] === "object" && appConfig[key].enabled) {
        return true;
    } else {
        return false;
    }
};

/**
 * This filters the routes based on the application configuration
 *
 * @param routes - Routes to be filtered.
 * @param appConfig - App config.
 * @returns filtered routes
 */
export const filterRoutes = (routes: RouteInterface[], appConfig: object): RouteInterface[] => {

    return routes.filter((route: RouteInterface) => {
        return checkEnabled(appConfig, route.id);
    });
};
