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
import { lazy } from "react";
import { AppLayout, AuthLayout, DashboardLayout, DefaultLayout, ErrorLayout } from "../../../layouts";
import { ATTRIBUTES_FEATURE_ROUTES } from "../../attributes";
import { AUTHENTICATION_FEATURE_ROUTES } from "../../authentication";
import { CERTIFICATES_FEATURE_ROUTES } from "../../certificates";
import { EMAIL_TEMPLATES_FEATURE_ROUTES } from "../../email-templates";
import { GROUPS_FEATURE_ROUTES } from "../../groups";
import { OVERVIEW_FEATURE_ROUTES } from "../../overview";
import { PRIVACY_FEATURE_ROUTES } from "../../privacy";
import { ROLES_FEATURE_ROUTES } from "../../roles";
import { SERVER_CONFIGURATIONS_FEATURE_ROUTES } from "../../server-configurations";
import { USER_FEATURE_ROUTES } from "../../users";
import { USERSTORE_FEATURE_ROUTES } from "../../userstores";
import { AppConstants } from "../constants";

/**
 * Dashboard Layout Routes array.
 *
 * @remarks
 * Having a unique id for every route is mandatory.
 * Since there are checks performed inside the side
 * panel component to validate the exact clicked route,
 * selected route etc.
 * @example
 * A route can have children and still be clickable.
 * If so, define a path. If no path is defined, the
 * child routes section will be extended in the UI.
 *  {
 *      children: [ ... ],
 *     ...
 *     path: "/applications"
 *  }
 */
const DASHBOARD_LAYOUT_ROUTES: RouteInterface[] = [
    ...OVERVIEW_FEATURE_ROUTES,
    ...USER_FEATURE_ROUTES,
    ...GROUPS_FEATURE_ROUTES,
    ...ROLES_FEATURE_ROUTES,
    ...ATTRIBUTES_FEATURE_ROUTES,
    ...USERSTORE_FEATURE_ROUTES,
    ...CERTIFICATES_FEATURE_ROUTES,
    ...EMAIL_TEMPLATES_FEATURE_ROUTES,
    ...SERVER_CONFIGURATIONS_FEATURE_ROUTES,
    {
        component: null,
        icon: null,
        id: "404",
        name: "404",
        path: "*",
        protected: true,
        redirectTo: AppConstants.PATHS.get("PAGE_NOT_FOUND"),
        showOnSidePanel: false
    }
];

/**
 * Default page layout routes array.
 */
const DEFAULT_LAYOUT_ROUTES: RouteInterface[] = [
    ...PRIVACY_FEATURE_ROUTES
];

/**
 * Error page layout routes array.
 */
const ERROR_LAYOUT_ROUTES: RouteInterface[] = [
    {
        component: lazy(() => import("../pages/errors/unauthorized")),
        icon: null,
        id: "unauthorized",
        name: "Unauthorized",
        path: AppConstants.PATHS.get("UNAUTHORIZED"),
        protected: true,
        showOnSidePanel: false
    },
    {
        component: lazy(() => import("../pages/errors/404")),
        icon: null,
        id: "pageNotFound",
        name: "404",
        path: AppConstants.PATHS.get("PAGE_NOT_FOUND"),
        protected: true,
        showOnSidePanel: false
    }
];

/**
 * Default page layout routes array.
 */
const AUTH_LAYOUT_ROUTES: RouteInterface[] = [
    ...AUTHENTICATION_FEATURE_ROUTES
];

/**
 * Default page layout routes array.
 */
const APP_ROUTES: RouteInterface[] = [
    {
        component: AuthLayout,
        icon: null,
        id: "appRouteLogin",
        name: "Login",
        path: window[ "AppUtils" ].getConfig().routes.login,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: AuthLayout,
        icon: null,
        id: "appRouteLogout",
        name: "Logout",
        path: window[ "AppUtils" ].getConfig().routes.logout,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: DefaultLayout,
        icon: null,
        id: "appRoutePrivacy",
        name: "Privacy",
        path: AppConstants.PATHS.get("PRIVACY"),
        protected: true,
        showOnSidePanel: false
    },
    {
        component: ErrorLayout,
        exact: true,
        icon: null,
        id: "unauthorized",
        name: "Unauthorized",
        path: AppConstants.PATHS.get("UNAUTHORIZED"),
        protected: true,
        showOnSidePanel: false
    },
    {
        component: ErrorLayout,
        exact: true,
        icon: null,
        id: "appRoute404",
        name: "Error",
        path: AppConstants.PATHS.get("PAGE_NOT_FOUND"),
        protected: true,
        showOnSidePanel: false
    },
    {
        component: DashboardLayout,
        icon: null,
        id: "dashboard",
        name: "Dashboard",
        path: "/",
        protected: true,
        showOnSidePanel: false
    }
];

/**
 * Default page layout routes array.
 */
const BASE_ROUTES: RouteInterface[] = [
    {
        component: AppLayout,
        icon: null,
        id: "app",
        name: "App",
        path: "/",
        protected: false,
        showOnSidePanel: false
    }
];

export const appRoutes = APP_ROUTES;
export const baseRoutes = BASE_ROUTES;
export const authLayoutRoutes = AUTH_LAYOUT_ROUTES;
export const dashboardLayoutRoutes = DASHBOARD_LAYOUT_ROUTES;
export const defaultLayoutRoutes = DEFAULT_LAYOUT_ROUTES;
export const errorLayoutRoutes = ERROR_LAYOUT_ROUTES;
export const routes = [ ...DASHBOARD_LAYOUT_ROUTES ];
