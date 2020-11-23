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
import { AppConstants } from "../constants";

/**
 * Get app layout routes.
 *
 * @return {RouteInterface[]}
 */
export const getAppRoutes = (): RouteInterface[] => {

    return [
        {
            component: lazy(() => import("../components/authentication/sign-in")),
            icon: null,
            id: "authLayoutLogin",
            name: "Login",
            path: AppConstants.getPaths().get("LOGIN"),
            protected: false,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("../components/authentication/sign-out")),
            icon: null,
            id: "authLayoutLogout",
            name: "Logout",
            path: AppConstants.getPaths().get("LOGOUT"),
            protected: false,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("../pages/overview")),
            icon: "overview",
            id: "overview",
            name: "common:overview",
            path: AppConstants.getPaths().get("OVERVIEW"),
            protected: true,
            showOnSidePanel: true
        },
        {
            component: lazy(() => import("../pages/applications")),
            icon: "apps",
            id: "applications",
            name: "common:applications",
            path: AppConstants.getPaths().get("APPLICATIONS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            component: lazy(() => import("../pages/personal-info")),
            icon: "personal",
            id: "personalInfo",
            name: "common:personalInfo",
            path: AppConstants.getPaths().get("PERSONAL_INFO"),
            protected: true,
            showOnSidePanel: true
        },
        {
            component: lazy(() => import("../pages/account-security")),
            icon: "security",
            id: "security",
            name: "common:security",
            path: AppConstants.getPaths().get("SECURITY"),
            protected: true,
            showOnSidePanel: true
        },
        {
            component: lazy(() => import("../pages/privacy")),
            icon: "security",
            id: "privacy",
            name: "common:privacy",
            path: AppConstants.getPaths().get("PRIVACY"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("../pages/errors/access-denied-error")),
            id: "accessDeniedError",
            name: "Access denied error",
            path: AppConstants.getPaths().get("ACCESS_DENIED_ERROR"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("../pages/errors/login-error")),
            id: "loginError",
            name: "Login error",
            path: AppConstants.getPaths().get("LOGIN_ERROR"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("../pages/errors/storage-disabled")),
            icon: null,
            id: "storingDataDisabled",
            name: "storingDataDisabled",
            path: AppConstants.getPaths().get("STORING_DATA_DISABLED"),
            protected: false,
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
};

/**
 * Get base layout routes.
 *
 * @return {RouteInterface[]}
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
