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

/**
 * Dynamic interface to handle routes.
 */
export interface RouteInterface extends StaticRouteInterface {
    [ key: string ]: any;
}

/**
 * Interface for categorized routes.
 */
export interface CategorizedRouteInterface {
    [ key: string ]: RouteInterface[];
}

/**
 * Static route interface.
 */
export interface StaticRouteInterface {
    /**
     * Main category to put the rout under.
     */
    category?: string;
    /**
     * Component to be displayed.
     */
    component?: React.ReactNode | any;
    /**
     * Child routes.
     */
    children?: ChildRouteInterface[];
    /**
     * Exact match the route.
     */
    exact?: boolean;
    /**
     * Icon to be displayed on the side panel.
     */
    icon?: any;
    /**
     * A key to uniquely identify the route with
     */
    id: string;
    /**
     * Name to be displayed on the side panel.
     */
    name?: string;
    /**
     * Side panel order.
     */
    order?: number;
    /**
     * Router path.
     */
    path?: string;
    /**
     * If the route is protected or not.
     */
    protected?: boolean;
    /**
     * Redirect path.
     */
    redirectTo?: string;
    /**
     * Should the item be displayed on the side panel.
     */
    showOnSidePanel: boolean;
    /**
     * Status of the feature.
     */
    featureStatus?: "NEW" | "ALPHA" | "BETA" | "COMING_SOON";
    /**
     * Feature Status Label.
     */
    featureStatusLabel?: string;
    /**
     * Should the side panel item be clickable.
     */
    isFeatureEnabled?: boolean;
}

/**
 * Interface to handle child routes.
 * TODO: Remover this interface.
 */
export interface ChildRouteInterface extends RouteInterface {
    /**
     * Nesting level.
     */
    level?: number;
}
