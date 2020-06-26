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
import { AppLayout } from "@wso2is/react-components";
import { lazy } from "react";
import { ApplicationConstants } from "../constants";
import * as TokenConstants from "../constants/token-constants";

/**
 * Interface to handle route types.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Route {
    component: any;
    icon?: string;
    id: string;
    name: string;
    path: string;
    protected: boolean;
    scope?: string;
    showOnSidePanel: boolean;
}

/**
 * Routes array.
 */
const ROUTES: Route[] = [
    {
        component: lazy(() => import("../pages/overview")),
        icon: "overview",
        id: "overview",
        name: "common:overview",
        path: "/overview",
        protected: true,
        showOnSidePanel: true
    },
    {
        component: lazy(() => import("../pages/applications")),
        icon: "apps",
        id: "applications",
        name: "common:applications",
        path: ApplicationConstants.APPLICATIONS_PAGE_PATH,
        protected: true,
        showOnSidePanel: true
    },
    {
        component: lazy(() => import("../pages/personal-info")),
        icon: "personal",
        id: "personalInfo",
        name: "common:personalInfo",
        path: "/personal-info",
        protected: true,
        showOnSidePanel: true
    },
    {
        component: lazy(() => import("../pages/account-security")),
        icon: "security",
        id: "security",
        name: "common:security",
        path: "/security",
        protected: true,
        showOnSidePanel: true
    },
    {
        component: lazy(() => import("../pages/operations")),
        icon: "operations",
        id: "operations",
        name: "common:operations",
        path: "/operations",
        protected: true,
        scope: TokenConstants.HUMAN_TASK_SCOPE,
        showOnSidePanel: true
    },
    {
        component: lazy(() => import("../pages/privacy")),
        icon: "security",
        id: "privacy",
        name: "common:privacy",
        path: "/privacy",
        protected: true,
        showOnSidePanel: false
    },
    {
        component: lazy(() => import("../pages/errors/login-error")),
        id: "loginError",
        name: "Login error",
        path: ApplicationConstants.LOGIN_ERROR_PAGE_PATH,
        protected: true,
        showOnSidePanel: false
    },
    {
        component: lazy(() => import("../pages/errors/404")),
        id: "404",
        name: "404",
        path: "*",
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

export const routes = ROUTES;
export const baseRoutes = BASE_ROUTES;
