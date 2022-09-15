/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
import { FunctionComponent, lazy } from "react";
import { AppConstants } from "../constants";
import { AppLayout, AuthLayout, DashboardLayout, DefaultLayout, ErrorLayout } from "../layouts";

/**
 * Get default page layout routes.
 *
 * @returns Default Layout routes.
 */
export const getDefaultLayoutRoutes = (): RouteInterface[] => {

    return [
        {
            component: lazy(() => import("../pages/privacy")),
            exact: true,
            icon: null,
            id: "privacy",
            name: "common:privacy",
            path: AppConstants.getPaths().get("PRIVACY"),
            protected: true,
            showOnSidePanel: false
        }
    ];
};

/**
 * Get error page layout routes.
 *
 * @returns Error Layout routes.
 */
export const getErrorLayoutRoutes = (): RouteInterface[] => {

    return [
        {
            component: lazy(() => import("../pages/errors/access-denied-error")),
            exact: true,
            id: "accessDeniedError",
            name: "Access denied error",
            path: AppConstants.getPaths().get("ACCESS_DENIED_ERROR"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("../pages/errors/login-error")),
            exact: true,
            id: "loginError",
            name: "Login error",
            path: AppConstants.getPaths().get("LOGIN_ERROR"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("../pages/errors/storage-disabled")),
            exact: true,
            icon: null,
            id: "storingDataDisabled",
            name: "storingDataDisabled",
            path: AppConstants.getPaths().get("STORING_DATA_DISABLED"),
            protected: false,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("../pages/errors/404")),
            exact: true,
            id: "appRoute404",
            name: "Page Not Found",
            path: AppConstants.getPaths().get("PAGE_NOT_FOUND"),
            protected: true,
            showOnSidePanel: false
        }
    ];
};

/**
 * Get auth page layout routes.
 *
 * @returns Auth Layout routes.
 */
export const getAuthLayoutRoutes = (): RouteInterface[] => {

    return [
        {
            component: lazy(() => import("../components/authentication/sign-out")),
            exact: true,
            icon: null,
            id: "authLayoutLogout",
            name: "Logout",
            path: AppConstants.getPaths().get("LOGOUT"),
            protected: false,
            showOnSidePanel: false
        }
    ];
};

/**
 * Get the dashboard layout routes.
 *
 * @returns Dashboard Layout routes.
 */
export const getDashboardLayoutRoutes = (): RouteInterface[] => {

    return [
        {
            component: lazy(() => import("../pages/overview")),
            exact: true,
            icon: "overview",
            id: "overview",
            name: "common:overview",
            path: AppConstants.getPaths().get("OVERVIEW"),
            protected: true,
            showOnSidePanel: true
        },
        {
            component: lazy(() => import("../pages/applications")),
            exact: true,
            icon: "apps",
            id: "applications",
            name: "common:applications",
            path: AppConstants.getPaths().get("APPLICATIONS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            component: lazy(() => import("../pages/personal-info")),
            exact: true,
            icon: "personal",
            id: "personalInfo",
            name: "common:personalInfo",
            path: AppConstants.getPaths().get("PERSONAL_INFO"),
            protected: true,
            showOnSidePanel: true
        },
        {
            component: lazy(() => import("../pages/account-security")),
            exact: true,
            icon: "security",
            id: "security",
            name: "common:security",
            path: AppConstants.getPaths().get("SECURITY"),
            protected: true,
            showOnSidePanel: true
        },
        {
            component: null,
            exact: true,
            id: "index",
            name: "Index",
            path: "/",
            protected: true,
            redirectTo: AppConstants.getPaths().get("OVERVIEW"),
            showOnSidePanel: false
        }
    ];
};

/**
 * Get all the app layout routes.
 *
 * @returns App Layout routes.
 */
export const getAppLayoutRoutes = (): RouteInterface[] => {

    return [
        ...getLayoutAssignedToRoutes(getAuthLayoutRoutes(), AuthLayout),
        ...getLayoutAssignedToRoutes(getDefaultLayoutRoutes(), DefaultLayout),
        ...getLayoutAssignedToRoutes(getErrorLayoutRoutes(), ErrorLayout),
        {
            component: DashboardLayout,
            icon: null,
            id: "dashboardLayout",
            name: "Dashboard Layout",
            path: "/",
            protected: false,
            showOnSidePanel: false
        },
        {
            component: null,
            id: "404",
            name: "404",
            path: "*",
            protected: true,
            redirectTo: AppConstants.getPaths().get("PAGE_NOT_FOUND"),
            showOnSidePanel: false
        }
    ];
};

/**
 * Get base layout routes.
 *
 * @returns Base routes.
 */
export const getBaseRoutes = (): RouteInterface[] => {

    return [
        {
            component: AppLayout,
            icon: null,
            id: "app",
            name: "App",
            path: AppConstants.getPaths().get("ROOT"),
            protected: false,
            showOnSidePanel: false
        }
    ];
};

/**
 * If a layout doesn't use a sub base path i.e `console`, `manage`, then all the routes in that layout
 * has to be registered in the root layout path (`getAppLayoutRoutes`). This function will help inject the
 * proper layout by reusing the defined routes rather than duplicating.
 *
 * @example
 *     Without this, we'll have to manually let the app know to use the `AuthLayout` if someone hits `/login`.
 *     `{`
 *          component: AuthLayout,
 *          icon: null,
 *          id: "appRouteLogin",
 *          name: "Login",
 *          path: AppConstants.getPaths().get("LOGIN"),
 *          protected: false,
 *          showOnSidePanel: false
 *    `}`,
 *
 * @param routes - Set of routes in the layout.
 * @param layout - Layout to be used.
 *
 * @returns Route config with the layout assigned.
 */
const getLayoutAssignedToRoutes = (routes: RouteInterface[], layout: FunctionComponent) => {

    let modifiedRoutes: RouteInterface[] = [ ...routes ];

    modifiedRoutes = modifiedRoutes.map((route: RouteInterface) => {
        return {
            ...route,
            component: layout
        };
    });

    return modifiedRoutes;
};
