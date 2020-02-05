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
import { SignIn, SignOut } from "../components/authentication";
import { AppLayout, AuthLayout, DashboardLayout, DefaultPageLayout } from "../layouts";
import {
    ApplicationsPage,
    HomePage,
    PrivacyPage,
    UsersPage,
    UserRoles,
    UserPermission
} from "../pages";
import { Children } from "react";

/**
 * Dashboard Layout Routes array.
 */
const DASHBOARD_LAYOUT_ROUTES: RouteInterface[] = [
    {
        component: HomePage,
        icon: "overview",
        name: "Overview",
        path: "/overview",
        protected: true,
        showOnSidePanel: true,
    },
    {
        component: ApplicationsPage,
        icon: "applications",
        name: "Applications",
        path: "/applications",
        protected: true,
        showOnSidePanel: true,
    },
    {
        component: UsersPage,
        icon: "usersAndRoles",
        name: "Users & Roles",
        protected: true,
        showOnSidePanel: true,
        children: [{
            component: UsersPage,
            icon: "usersAndRoles",
            name: "Users",
            path: "/users",
            showOnSidePanel: true,
            level: 1
        },{
            component: UserRoles,
            icon: "usersAndRoles",
            name: "User Roles",
            path: "/roles",
            exact: true,
            showOnSidePanel: true,
            level: 2
        },{
            component: UserPermission,
            icon: "applications",
            name: "User Pemission",
            path: "/roles/:id/permission",
            exact: true,
            protected: true,
            showOnSidePanel: false,
            level: 3
        }],
    },
    {
        component: PrivacyPage,
        icon: null,
        name: "common:privacy",
        path: "/privacy",
        protected: true,
        showOnSidePanel: false,
    }
];

/**
 * Default page layout routes array.
 */
const DEFAULT_LAYOUT_ROUTES: RouteInterface[] = [
    {
        component: PrivacyPage,
        icon: null,
        name: "Privacy",
        path: "/privacy",
        protected: true,
        showOnSidePanel: false,
    }
];

/**
 * Default page layout routes array.
 */
const AUTH_LAYOUT_ROUTES: RouteInterface[] = [
    {
        component: SignIn,
        icon: null,
        name: "Login",
        path: APP_LOGIN_PATH,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: SignOut,
        icon: null,
        name: "Logout",
        path: "/logout",
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
        name: "Login",
        path: APP_LOGIN_PATH,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: AuthLayout,
        icon: null,
        name: "Logout",
        path: "/logout",
        protected: false,
        showOnSidePanel: false
    },
    {
        component: DefaultPageLayout,
        icon: null,
        name: "Privacy",
        path: "/privacy",
        protected: true,
        showOnSidePanel: false,
    },
    {
        component: DashboardLayout,
        icon: null,
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
export const routes = [ ...DASHBOARD_LAYOUT_ROUTES, ...DEFAULT_LAYOUT_ROUTES ];
