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

import { AppLayout, AuthLayout, DashboardLayout, DefaultPageLayout, ErrorPageLayout } from "../layouts";
import {
    ApplicationEditPage,
    ApplicationsPage,
    ApplicationTemplateSelectPage,
    ClaimDialectsPage,
    CustomizePage,
    GroupsPage,
    HomePage,
    IdentityProviderEditPage,
    IdentityProvidersPage,
    IdentityProviderTemplateSelectPage,
    LocalClaimsEditPage,
    LocalClaimsPage,
    PageNotFound,
    PrivacyPage,
    RoleEditPage,
    RolesPage,
    ServerConfigurationsPage,
    UserEditPage,
    UsersPage,
    UserStores,
    UserStoresEditPage,
    EmailTemplates
} from "../pages";
import {
    CLAIM_DIALECTS_PATH,
    EDIT_EXTERNAL_DIALECT,
    EDIT_LOCAL_CLAIMS_PATH,
    LOCAL_CLAIMS_PATH,
    USER_STORES_PATH
} from "../constants";
import { SignIn, SignOut } from "../components/authentication";

import { ExternalDialectEditPage } from "./../pages/external-dialect-edit";
import { RouteInterface } from "@wso2is/core/models";

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
        component: HomePage,
        icon: "overview",
        id: "overview",
        name: "Overview",
        path: "/overview",
        protected: true,
        showOnSidePanel: false
    },
    {
        children: [
            {
                component: ApplicationTemplateSelectPage,
                exact: true,
                icon: null,
                id: "applicationTemplate",
                name: "Application Templates",
                path: "/applications/templates",
                protected: true,
                showOnSidePanel: false
            },
            {
                component: ApplicationEditPage,
                exact: true,
                icon: "applications",
                id: "applicationsEdit",
                name: "Application-Edit",
                path: "/applications/:id",
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: ApplicationsPage,
        exact: true,
        icon: "applications",
        id: "applications",
        name: "Applications",
        path: "/applications",
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: IdentityProviderTemplateSelectPage,
                exact: true,
                icon: null,
                id: "identityProviderTemplate",
                name: "Identity-Provider-Template",
                path: "/identity-providers/templates",
                protected: true,
                showOnSidePanel: false
            },
            {
                component: IdentityProviderEditPage,
                exact: true,
                icon: "applications",
                id: "identityProvidersEdit",
                name: "Identity-Providers-Edit",
                path: "/identity-providers/:id",
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: IdentityProvidersPage,
        exact: true,
        icon: "connections",
        id: "identityProviders",
        name: "Identity Providers",
        path: "/identity-providers",
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: UsersPage,
                exact: true,
                icon: "childIcon",
                id: "users",
                level: 2,
                name: "Users",
                path: "/users",
                protected: true,
                showOnSidePanel: true
            },
            {
                component: GroupsPage,
                exact: true,
                icon: "childIcon",
                id: "userGroups",
                level: 2,
                name: "Groups",
                path: "/groups",
                protected: true,
                showOnSidePanel: true
            },
            {
                component: RolesPage,
                exact: true,
                icon: "childIcon",
                id: "roles",
                level: 2,
                name: "Roles",
                path: "/roles",
                protected: true,
                showOnSidePanel: true
            },
            {
                component: RoleEditPage,
                exact: true,
                icon: "usersAndRoles",
                id: "rolesEdit",
                name: "Role-Edit",
                path: "/roles/:id",
                protected: true,
                showOnSidePanel: false
            },
            {
                component: UserEditPage,
                exact: true,
                icon: "usersAndRoles",
                id: "usersEdit",
                name: "User-Edit",
                path: "/users/:id",
                protected: true,
                showOnSidePanel: false
            }
        ],
        exact: true,
        icon: "usersAndRoles",
        id: "usersAndRoles",
        name: "Users & Roles",
        protected: true,
        showOnSidePanel: true
    },
    {
        component: LocalClaimsPage,
        exact: true,
        icon: "childIcon",
        id: "localDialect",
        level: 2,
        name: "Local Dialect",
        path: LOCAL_CLAIMS_PATH,
        protected: true,
        showOnSidePanel: false
    },
    {
        component: ExternalDialectEditPage,
        exact: true,
        icon: "childIcon",
        id: "editExternalDialect",
        level: 2,
        name: "Edit External Dialect",
        path: `${EDIT_EXTERNAL_DIALECT}/:id`,
        protected: true,
        showOnSidePanel: false
    },
    {
        component: ClaimDialectsPage,
        exact: true,
        icon: "claims",
        id: "claimDialects",
        level: 2,
        name: "Claim Dialects",
        path: CLAIM_DIALECTS_PATH,
        protected: true,
        showOnSidePanel: true
    },
    {
        component: LocalClaimsEditPage,
        exact: true,
        icon: "childIcon",
        id: "editLocalClaims",
        level: 2,
        name: "Edit Local Claims",
        path: `${EDIT_LOCAL_CLAIMS_PATH}/:id`,
        protected: true,
        showOnSidePanel: false
    },
    {
        component: UserStores,
        icon: "userStore",
        id: "userStores",
        name: "Userstores",
        path: USER_STORES_PATH,
        protected: true,
        showOnSidePanel: true
    },
    {
        component: UserStoresEditPage,
        icon: "userStore",
        id: "edit-user-store",
        name: "Edit Userstore",
        path: "/edit-user-store/:id",
        protected: true,
        showOnSidePanel: false
    },
    {
        children: [
            {
                component: ServerConfigurationsPage,
                exact: true,
                icon: "childIcon",
                id: "serverConfigurations",
                level: 2,
                name: "Server Configurations",
                path: "/server-configurations",
                protected: true,
                showOnSidePanel: true
            },{
                component: EmailTemplates,
                exact: true,
                icon: "serverConfigurations",
                id: "serverConfigurations",
                level: 2,
                name: "Email Templates",
                path: "/email-templates",
                protected: true,
                showOnSidePanel: true
            }
        ],
        exact: true,
        icon: "serverConfigurations",
        id: "serverConfigurations",
        name: "Settings",
        protected: true,
        showOnSidePanel: true
    },
    {
        component: CustomizePage,
        icon: "overview",
        id: "customize",
        name: "Customize",
        path: "/customize",
        protected: true,
        showOnSidePanel: false
    },
    {
        component: PrivacyPage,
        icon: null,
        id: "privacy",
        name: "common:privacy",
        path: "/privacy",
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
        redirectTo: "/404",
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
        id: "defaultPrivacy",
        name: "Privacy",
        path: "/privacy",
        protected: true,
        showOnSidePanel: false
    }
];

/**
 * Error page layout routes array.
 */
const ERROR_LAYOUT_ROUTES: RouteInterface[] = [
    {
        component: PageNotFound,
        icon: null,
        id: "error404",
        name: "404",
        path: "/404",
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
        path: APP_LOGIN_PATH,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: SignOut,
        icon: null,
        id: "authLayoutLogout",
        name: "Logout",
        path: APP_LOGOUT_PATH,
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
        path: APP_LOGIN_PATH,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: AuthLayout,
        icon: null,
        id: "appRouteLogout",
        name: "Logout",
        path: APP_LOGOUT_PATH,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: DefaultPageLayout,
        icon: null,
        id: "appRoutePrivacy",
        name: "Privacy",
        path: "/privacy",
        protected: true,
        showOnSidePanel: false
    },
    {
        component: ErrorPageLayout,
        exact: true,
        icon: null,
        id: "appRoute404",
        name: "Error",
        path: "/404",
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
