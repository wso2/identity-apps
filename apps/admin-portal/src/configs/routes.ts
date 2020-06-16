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
import { SignIn, SignOut } from "../components";
import { AppConstants } from "../constants";
import { AppLayout, AuthLayout, DashboardLayout, DefaultLayout, ErrorLayout } from "../layouts";
import {
    AddTemplateLocale,
    CertificatesKeystore,
    ClaimDialectsPage,
    EmailTemplateTypes,
    EmailTemplates,
    ExternalDialectEditPage,
    GroupsPage,
    LocalClaimsEditPage,
    LocalClaimsPage,
    OverviewPage,
    PageNotFound,
    PrivacyPage,
    RoleEditPage,
    RolesPage,
    ServerConfigurationsPage,
    UnauthorizedErrorPage,
    UserEditPage,
    UserStores,
    UserStoresEditPage,
    UsersPage,
    UserstoresTemplates
} from "../pages";

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
        component: OverviewPage,
        icon: "overview",
        id: "overview",
        name: "adminPortal:components.sidePanel.overview",
        path: AppConstants.PATHS.get("OVERVIEW"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: UserEditPage,
                exact: true,
                icon: "childIcon",
                id: "usersEdit",
                name: "adminPortal:components.sidePanel.editUsers",
                path: AppConstants.PATHS.get("USER_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: UsersPage,
        exact: true,
        icon: "users",
        id: "users",
        name: "adminPortal:components.sidePanel.users",
        path: AppConstants.PATHS.get("USERS"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: RoleEditPage,
                exact: true,
                icon: "childIcon",
                id: "groupsEdit",
                name: "adminPortal:components.sidePanel.editGroups",
                path: AppConstants.PATHS.get("GROUP_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: GroupsPage,
        exact: true,
        icon: "groups",
        id: "groups",
        name: "adminPortal:components.sidePanel.groups",
        path: AppConstants.PATHS.get("GROUPS"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: RoleEditPage,
                exact: true,
                icon: "childIcon",
                id: "rolesEdit",
                name: "adminPortal:components.sidePanel.editRoles",
                path: AppConstants.PATHS.get("ROLE_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: RolesPage,
        exact: true,
        icon: "roles",
        id: "roles",
        name: "adminPortal:components.sidePanel.roles",
        path: AppConstants.PATHS.get("ROLES"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: LocalClaimsEditPage,
                exact: true,
                icon: "childIcon",
                id: "editLocalClaims",
                level: 2,
                name: "adminPortal:components.sidePanel.editLocalClaims",
                path: AppConstants.PATHS.get("LOCAL_CLAIMS_EDIT"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: LocalClaimsPage,
                exact: true,
                icon: "childIcon",
                id: "localDialect",
                level: 2,
                name: "adminPortal:components.sidePanel.localDialect",
                path: AppConstants.PATHS.get("LOCAL_CLAIMS"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: ExternalDialectEditPage,
                exact: true,
                icon: "childIcon",
                id: "editExternalDialect",
                level: 2,
                name: "adminPortal:components.sidePanel.editExternalDialect",
                path: AppConstants.PATHS.get("EXTERNAL_DIALECT_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: ClaimDialectsPage,
        exact: true,
        icon: "claims",
        id: "attributeDialects",
        level: 2,
        name: "adminPortal:components.sidePanel.attributeDialects",
        path: AppConstants.PATHS.get("CLAIM_DIALECTS"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: UserStoresEditPage,
                icon: "childIcon",
                id: "edit-user-store",
                name: "adminPortal:components.sidePanel.editUserstore",
                path: AppConstants.PATHS.get("USERSTORES_EDIT"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: UserstoresTemplates,
                icon: "childIcon",
                id: "userstore-templates",
                name: "adminPortal:components.sidePanel.userstoreTemplates",
                path: AppConstants.PATHS.get("USERSTORE_TEMPLATES"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: UserStores,
        icon: "userStore",
        id: "userStores",
        name: "adminPortal:components.sidePanel.userstores",
        path: AppConstants.PATHS.get("USERSTORES"),
        protected: true,
        showOnSidePanel: true
    },
    {
        component: CertificatesKeystore,
        icon: "certificate",
        id: "certificates",
        name: "adminPortal:components.sidePanel.certificates",
        path: AppConstants.PATHS.get("CERTIFICATES"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: ServerConfigurationsPage,
                exact: true,
                icon: "childIcon",
                id: "generalConfigurations",
                level: 2,
                name: "adminPortal:components.sidePanel.generalConfigurations",
                path: AppConstants.PATHS.get("SERVER_CONFIGS"),
                protected: true,
                showOnSidePanel: true
            },
            {
                component: EmailTemplateTypes,
                exact: true,
                icon: "childIcon",
                id: "emailTemplates",
                level: 2,
                name: "adminPortal:components.sidePanel.emailTemplates",
                path: AppConstants.PATHS.get("EMAIL_TEMPLATES"),
                protected: true,
                showOnSidePanel: true
            },
            {
                component: EmailTemplates,
                exact: true,
                icon: "childIcon",
                id: "emailTemplates",
                name: "adminPortal:components.sidePanel.emailTemplates",
                path: AppConstants.PATHS.get("EMAIL_TEMPLATE"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: AddTemplateLocale,
                exact: true,
                icon: "childIcon",
                id: "emailTemplates",
                name: "adminPortal:components.sidePanel.addEmailTemplate",
                path: AppConstants.PATHS.get("EMAIL_TEMPLATE_ADD"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: AddTemplateLocale,
                exact: true,
                icon: "childIcon",
                id: "emailTemplates",
                name: "adminPortal:components.sidePanel.addEmailTemplateLocale",
                path: AppConstants.PATHS.get("EMAIL_TEMPLATE_LOCALE_ADD"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        exact: true,
        icon: "serverConfigurations",
        id: "serverConfigurations",
        name: "adminPortal:components.sidePanel.configurations",
        protected: true,
        showOnSidePanel: true
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
        component: PrivacyPage,
        icon: null,
        id: "privacy",
        name: "adminPortal:components.sidePanel.privacy",
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
        component: UnauthorizedErrorPage,
        icon: null,
        id: "unauthorized",
        name: "Unauthorized",
        path: AppConstants.PATHS.get("UNAUTHORIZED"),
        protected: true,
        showOnSidePanel: false
    },
    {
        component: PageNotFound,
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
        component: SignIn,
        icon: null,
        id: "authLayoutLogin",
        name: "Login",
        path: window[ "AppUtils" ].getConfig().routes.login,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: SignOut,
        icon: null,
        id: "authLayoutLogout",
        name: "Logout",
        path: window[ "AppUtils" ].getConfig().routes.logout,
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
