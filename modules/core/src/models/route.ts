/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import React from "react";

/**
 * Dynamic interface to handle routes.
 */
export interface RouteInterface extends StaticRouteInterface {
    [ key: string ]: any;
}

/**
 * Interface for the Navbar route categories.
 */
export interface NavCategory {
    id: string;
    order: number;
}

/**
 * Interface for the Navbar routes.
 */
export interface NavRouteInterface extends RouteInterface {
    navCategory?: NavCategory;
    parent?: NavRouteInterface;
    items?: NavRouteInterface[];
    [ key: string ]: any;
}

/**
 * Interface for categorized routes.
 */
export interface CategorizedRouteInterface {
    [ key: string ]: NavRouteInterface[];
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
    featureStatus?: "NEW" | "ALPHA" | "BETA" | "COMING_SOON" | "PREVIEW";
    /**
     * Feature Status Label.
     */
    featureStatusLabel?: string;
    /**
     * Should the side panel item be clickable.
     */
    isFeatureEnabled?: boolean;
    /**
     * Feature gate ids to disable/enable features from routes.
     */
    featureGateIds?: string[];
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
