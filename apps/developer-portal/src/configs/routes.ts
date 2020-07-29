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
import { SidePanelIcons } from "./ui";
import { AppConstants } from "../constants";
import { EXTENSION_ROUTES } from "../extensions";
import { AppLayout, AuthLayout, DashboardLayout, DefaultLayout, ErrorLayout } from "../layouts";

/**
 * Load extension routes if available.
 */
const extensions = EXTENSION_ROUTES();

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
        children: [
            {
                component: lazy(() => import("../pages/applications/application-template")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "applicationTemplate",
                name: "devPortal:components.sidePanel.applicationTemplates",
                path: AppConstants.PATHS.get("APPLICATION_TEMPLATES"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: lazy(() => import("../pages/applications/application-edit")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "applicationsEdit",
                name: "devPortal:components.sidePanel.applicationEdit",
                path: AppConstants.PATHS.get("APPLICATION_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../pages/applications/applications")),
        exact: true,
        icon: {
            icon: SidePanelIcons.applications
        },
        id: "applications",
        name: "devPortal:components.sidePanel.applications",
        order: 2,
        path: AppConstants.PATHS.get("APPLICATIONS"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: lazy(() => import("../pages/identity-providers/identity-provider-template")),
                exact: true,
                 icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "identityProviderTemplate",
                name: "devPortal:components.sidePanel.identityProviderTemplates",
                path: AppConstants.PATHS.get("IDP_TEMPLATES"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: lazy(() => import("../pages/identity-providers/identity-provider-edit")),
                exact: true,
                 icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "identityProvidersEdit",
                name: "devPortal:components.sidePanel.identityProviderEdit",
                path: AppConstants.PATHS.get("IDP_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../pages/identity-providers/identity-providers")),
        exact: true,
        icon: {
            icon: SidePanelIcons.identityProviders
        },
        id: "identityProviders",
        name: "devPortal:components.sidePanel.identityProviders",
        order: 3,
        path: AppConstants.PATHS.get("IDP"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: lazy(() => import("../pages/remote-repository-configuration/remote-repository-config-edit")),
                exact: true,
                 icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "remote-repo-edit",
                name: "devPortal:components.sidePanel.remoteRepoEdit",
                path: AppConstants.PATHS.get("REMOTE_REPO_CONFIG_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../pages/remote-repository-configuration/remote-repository-config")),
        exact: true,
        icon: {
            icon: SidePanelIcons.remoteFetch
        },
        id: "remote-repo",
        name: "devPortal:components.sidePanel.remoteRepo",
        order: 4,
        path: AppConstants.PATHS.get("REMOTE_REPO_CONFIG"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: lazy(() => import("../pages/oidc-scopes/oidc-scopes-edit")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "oidcScopesEdit",
                name: "devPortal:components.sidePanel.oidcScopesEdit",
                path: AppConstants.PATHS.get("OIDC_SCOPES_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../pages/oidc-scopes/oidc-scopes")),
        exact: true,
        icon: {
            icon: SidePanelIcons.scopes
        },
        id: "oidcScopes",
        name: "devPortal:components.sidePanel.oidcScopes",
        order: 5,
        path: AppConstants.PATHS.get("OIDC_SCOPES"),
        protected: true,
        showOnSidePanel: true
    },
    {
        component: lazy(() => import("../pages/customize")),
        icon: {
            icon: SidePanelIcons.overview
        },
        id: "customize",
        name: "devPortal:components.sidePanel.customize",
        path: AppConstants.PATHS.get("CUSTOMIZE"),
        protected: true,
        showOnSidePanel: false
    },
    {
        component: lazy(() => import("../pages/privacy")),
        icon: null,
        id: "privacy",
        name: "devPortal:components.sidePanel.privacy",
        path: AppConstants.PATHS.get("PRIVACY"),
        protected: true,
        showOnSidePanel: false
    },
    ...extensions,
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
        component: lazy(() => import("../pages/overview")),
        icon: {
            icon: SidePanelIcons.overview
        },
        id: "overview",
        name: "devPortal:components.sidePanel.overview",
        order: 1,
        path: AppConstants.PATHS.get("OVERVIEW"),
        protected: true,
        showOnSidePanel: true
    },
    {
        component: lazy(() => import("../pages/privacy")),
        icon: null,
        id: "privacy",
        name: "devPortal:components.sidePanel.privacy",
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
        id: "appRouteOverview",
        name: "common:overview",
        path: AppConstants.PATHS.get("OVERVIEW"),
        protected: true,
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
export const routes = [ ...DEFAULT_LAYOUT_ROUTES, ...DASHBOARD_LAYOUT_ROUTES ];
