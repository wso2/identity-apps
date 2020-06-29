/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { AppConstants } from "../constants";
import { AppLayout, AuthLayout, DashboardLayout, DefaultLayout, ErrorLayout } from "../layouts";

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
    {
        component: lazy(() => import("../pages/overview")),
        icon: "overview",
        id: "overview",
        name: "common:overview",
        path: AppConstants.PATHS.get("OVERVIEW"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: lazy(() => import("../pages/applications/application-template")),
                exact: true,
                icon: null,
                id: "applicationTemplate",
                name: "Application Templates",
                path: AppConstants.PATHS.get("APPLICATION_TEMPLATES"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: lazy(() => import("../pages/applications/application-edit")),
                exact: true,
                icon: "applications",
                id: "applicationsEdit",
                name: "Application Edit",
                path: AppConstants.PATHS.get("APPLICATION_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../pages/applications/applications")),
        exact: true,
        icon: "applications",
        id: "applications",
        name: "common:applications",
        path: AppConstants.PATHS.get("APPLICATIONS"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: lazy(() => import("../pages/identity-providers/identity-provider-template")),
                exact: true,
                icon: null,
                id: "identityProviderTemplate",
                name: "Identity Provider Templates",
                path: AppConstants.PATHS.get("IDP_TEMPLATES"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: lazy(() => import("../pages/identity-providers/identity-provider-edit")),
                exact: true,
                icon: "applications",
                id: "identityProvidersEdit",
                name: "Identity Providers Edit",
                path: AppConstants.PATHS.get("IDP_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../pages/identity-providers/identity-providers")),
        exact: true,
        icon: "identityProviders",
        id: "identityProviders",
        name: "common:identityProviders",
        path: AppConstants.PATHS.get("IDP"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: lazy(() => import("../pages/remote-repository-configuration/remote-repository-config-edit")),
                exact: true,
                icon: "overview",
                id: "remote-repo-edit",
                name: "Remote Repo Config Edit",
                path: AppConstants.PATHS.get("REMOTE_REPO_CONFIG_EDIT"),
                protected: true,
                showOnSidePanel: false
            },
        ],
        component: lazy(() => import("../pages/remote-repository-configuration/remote-repository-config")),
        exact: true,
        icon: "overview",
        id: "remote-repo",
        name: "Remote Repo Config",
        path: AppConstants.PATHS.get("REMOTE_REPO_CONFIG"),
        protected: true,
        showOnSidePanel: true
    },
    {
        component: lazy(() => import("../pages/customize")),
        icon: "overview",
        id: "customize",
        name: "Customize",
        path: AppConstants.PATHS.get("CUSTOMIZE"),
        protected: true,
        showOnSidePanel: false
    },
    {
        component: lazy(() => import("../pages/privacy")),
        icon: null,
        id: "privacy",
        name: "common:privacy",
        path: AppConstants.PATHS.get("PRIVACY"),
        protected: true,
        showOnSidePanel: false
    },
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
    {
        component: lazy(() => import("../pages/privacy")),
        icon: null,
        id: "privacy",
        name: "Privacy",
        path: AppConstants.PATHS.get("PRIVACY"),
        protected: true,
        showOnSidePanel: false
    }
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
    {
        component: lazy(() => import("../pages/authentication/sign-in")),
        icon: null,
        id: "authLayoutLogin",
        name: "Login",
        path: window["AppUtils"].getConfig().routes.login,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: lazy(() => import("../pages/authentication/sign-out")),
        icon: null,
        id: "authLayoutLogout",
        name: "Logout",
        path: window["AppUtils"].getConfig().routes.logout,
        protected: false,
        showOnSidePanel: false
    }
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
        path: window["AppUtils"].getConfig().routes.login,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: AuthLayout,
        icon: null,
        id: "appRouteLogout",
        name: "Logout",
        path: window["AppUtils"].getConfig().routes.logout,
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
export const routes = [...DASHBOARD_LAYOUT_ROUTES];
