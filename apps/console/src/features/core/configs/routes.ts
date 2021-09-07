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
import { SidePanelIcons } from "./ui";
import { EXTENSION_ROUTES } from "../../../extensions";
import { AppLayout, AuthLayout, DefaultLayout, ErrorLayout } from "../../../layouts";
import { AdminView, DeveloperView } from "../../../views";
import { AppConstants } from "../constants";

/**
 * Load extension routes if available.
 */
const extensions = EXTENSION_ROUTES();

/**
 * Developer View Routes array.
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
const DEVELOPER_VIEW_ROUTES: RouteInterface[] = [
    {
        component: lazy(() => import("../../developer-overview/pages/overview")),
        icon: {
            icon: SidePanelIcons.overview
        },
        id: "overview",
        name: "devPortal:components.sidePanel.overview",
        order: 1,
        path: AppConstants.PATHS.get("DEVELOPER_OVERVIEW"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: lazy(() => import("../../applications/pages/application-template")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "applicationTemplate",
                name: "Application Templates",
                path: AppConstants.PATHS.get("APPLICATION_TEMPLATES"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: lazy(() => import("../../applications/pages/application-edit")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "applicationsEdit",
                name: "Application Edit",
                path: AppConstants.PATHS.get("APPLICATION_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../../applications/pages/applications")),
        exact: true,
        icon: {
            icon: SidePanelIcons.applications
        },
        id: "applications",
        name: "common:applications",
        order: 2,
        path: AppConstants.PATHS.get("APPLICATIONS"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: lazy(() => import("../../identity-providers/pages/identity-provider-template")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "identityProviderTemplate",
                name: "Identity Provider Templates",
                path: AppConstants.PATHS.get("IDP_TEMPLATES"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: lazy(() => import("../../identity-providers/pages/identity-provider-edit")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "identityProvidersEdit",
                name: "Identity Providers Edit",
                path: AppConstants.PATHS.get("IDP_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../../identity-providers/pages/identity-providers")),
        exact: true,
        icon: {
            icon: SidePanelIcons.identityProviders
        },
        id: "identityProviders",
        name: "common:identityProviders",
        order: 3,
        path: AppConstants.PATHS.get("IDP"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: lazy(() =>
                    import("../../remote-repository-configuration/pages/remote-repository-config-edit")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "remote-repo-edit",
                name: "Remote Repo Config Edit",
                path: AppConstants.PATHS.get("REMOTE_REPO_CONFIG_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../../remote-repository-configuration/pages/remote-repository-config")),
        exact: true,
        icon: {
            icon: SidePanelIcons.remoteFetch
        },
        id: "remote-repo",
        name: "Remote Repo Config",
        order: 4,
        path: AppConstants.PATHS.get("REMOTE_REPO_CONFIG"),
        protected: true,
        showOnSidePanel: true
    },
    {
        children: [
            {
                component: lazy(() => import("../../oidc-scopes/pages/oidc-scopes-edit")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "oidcScopesEdit",
                name: "OIDC Scopes Edit",
                path: AppConstants.PATHS.get("OIDC_SCOPES_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../../oidc-scopes/pages/oidc-scopes")),
        exact: true,
        icon: {
            icon: SidePanelIcons.scopes
        },
        id: "oidcScopes",
        name: "OIDC Scopes",
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
        name: "Customize",
        path: AppConstants.PATHS.get("CUSTOMIZE"),
        protected: true,
        showOnSidePanel: false
    },
    ...extensions
];

/**
 * Admin View Layout Routes array.
 */
const ADMIN_VIEW_ROUTES: RouteInterface[] = [
    {
        category: "adminPortal:components.sidePanel.categories.general",
        component: lazy(() => import("../../admin-overview/pages/overview")),
        icon: {
            icon: SidePanelIcons.overview
        },
        id: "overview",
        name: "adminPortal:components.sidePanel.overview",
        order: 1,
        path: AppConstants.PATHS.get("ADMIN_OVERVIEW"),
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "adminPortal:components.sidePanel.categories.users",
        children: [
            {
                component: lazy(() => import("../../users/pages/user-edit")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "usersEdit",
                name: "adminPortal:components.sidePanel.editUsers",
                path: AppConstants.PATHS.get("USER_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../../users/pages/users")),
        exact: true,
        icon: {
            icon: SidePanelIcons.users
        },
        id: "users",
        name: "adminPortal:components.sidePanel.users",
        order: 2,
        path: AppConstants.PATHS.get("USERS"),
        protected: true,
        showOnSidePanel: true
    },{
        category: "adminPortal:components.sidePanel.categories.users",
        children: [
            {
                component: lazy(() => import("../../organisation/pages/organisation-edit")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "organisationEdit",
                name: "EditOrganisation",
                path: AppConstants.PATHS.get("ORGANISATION_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../../organisation/pages/organisation")),
        icon: {
            icon: SidePanelIcons.organisation
        },
        id: "organisation",
        name: "Organisations",
        order: 3,
        path: AppConstants.PATHS.get("ORGANISATIONS"),
        protected: true,
        showOnSidePanel: true
    },{
        category: "adminPortal:components.sidePanel.categories.users",
        children: [
            {
                component: lazy(() => import("../../roles/pages/role-edit")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "groupsEdit",
                name: "adminPortal:components.sidePanel.editGroups",
                path: AppConstants.PATHS.get("GROUP_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../../groups/pages/groups")),
        exact: true,
        icon: {
            icon: SidePanelIcons.groups
        },
        id: "groups",
        name: "adminPortal:components.sidePanel.groups",
        order: 2,
        path: AppConstants.PATHS.get("GROUPS"),
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "adminPortal:components.sidePanel.categories.users",
        children: [
            {
                component: lazy(() => import("../../roles/pages/role-edit")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "rolesEdit",
                name: "adminPortal:components.sidePanel.editRoles",
                path: AppConstants.PATHS.get("ROLE_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../../roles/pages/role")),
        exact: true,
        icon: {
            icon: SidePanelIcons.roles
        },
        id: "roles",
        name: "adminPortal:components.sidePanel.roles",
        order: 2,
        path: AppConstants.PATHS.get("ROLES"),
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "adminPortal:components.sidePanel.categories.attributes",
        children: [
            {
                component: lazy(() => import("../../claims/pages/local-claims-edit")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "editLocalClaims",
                name: "adminPortal:components.sidePanel.editLocalClaims",
                path: AppConstants.PATHS.get("LOCAL_CLAIMS_EDIT"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: lazy(() => import("../../claims/pages/local-claims")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "localDialect",
                name: "adminPortal:components.sidePanel.localDialect",
                path: AppConstants.PATHS.get("LOCAL_CLAIMS"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: lazy(() => import("../../claims/pages/external-dialect-edit")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "editExternalDialect",
                name: "adminPortal:components.sidePanel.editExternalDialect",
                path: AppConstants.PATHS.get("EXTERNAL_DIALECT_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../../claims/pages/claim-dialects")),
        exact: true,
        icon: {
            icon: SidePanelIcons.claims
        },
        id: "attributeDialects",
        name: "adminPortal:components.sidePanel.attributeDialects",
        order: 5,
        path: AppConstants.PATHS.get("CLAIM_DIALECTS"),
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "adminPortal:components.sidePanel.categories.userstores",
        children: [
            {
                component: lazy(() => import("../../userstores/pages/user-stores-edit")),
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "edit-user-store",
                name: "adminPortal:components.sidePanel.editUserstore",
                path: AppConstants.PATHS.get("USERSTORES_EDIT"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: lazy(() => import("../../userstores/pages/userstores-templates")),
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "userstore-templates",
                name: "adminPortal:components.sidePanel.userstoreTemplates",
                path: AppConstants.PATHS.get("USERSTORE_TEMPLATES"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../../userstores/pages/user-stores")),
        icon: {
            icon: SidePanelIcons.userStore
        },
        id: "userStores",
        name: "adminPortal:components.sidePanel.userstores",
        order: 3,
        path: AppConstants.PATHS.get("USERSTORES"),
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "adminPortal:components.sidePanel.categories.certificates",
        component: lazy(() => import("../../certificates/pages/certificates-keystore")),
        icon: {
            icon: SidePanelIcons.certificate
        },
        id: "certificates",
        name: "adminPortal:components.sidePanel.certificates",
        order: 4,
        path: AppConstants.PATHS.get("CERTIFICATES"),
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "adminPortal:components.sidePanel.categories.configurations",
        children: [
            {
                component: lazy(() => import("../../email-templates/pages/email-templates")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "emailTemplates",
                name: "adminPortal:components.sidePanel.emailTemplates",
                path: AppConstants.PATHS.get("EMAIL_TEMPLATE"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: lazy(() => import("../../email-templates/pages/email-locale-add")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "emailTemplates",
                name: "adminPortal:components.sidePanel.addEmailTemplate",
                path: AppConstants.PATHS.get("EMAIL_TEMPLATE_ADD"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: lazy(() => import("../../email-templates/pages/email-locale-add")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "emailTemplates",
                name: "adminPortal:components.sidePanel.addEmailTemplateLocale",
                path: AppConstants.PATHS.get("EMAIL_TEMPLATE_LOCALE_ADD"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../../email-templates/pages/email-template-types")),
        exact: true,
        icon: {
            icon: SidePanelIcons.emailTemplates
        },
        id: "emailTemplates",
        name: "adminPortal:components.sidePanel.emailTemplates",
        order: 6,
        path: AppConstants.PATHS.get("EMAIL_TEMPLATES"),
        protected: true,
        showOnSidePanel: true
    },
    {
        component: lazy(() => import("../../server-configurations/pages/governance-connectors")),
        exact: true,
        icon: null,
        id: "governanceConnectors",
        name: "adminPortal:components.sidePanel.governanceConnectors",
        order: 6,
        path: AppConstants.PATHS.get("GOVERNANCE_CONNECTORS"),
        protected: true,
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
        component: lazy(() => import("../../authentication/pages/sign-in")),
        icon: null,
        id: "authLayoutLogin",
        name: "Login",
        path: window[ "AppUtils" ].getConfig().routes.login,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: lazy(() => import("../../authentication/pages/sign-out")),
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
        component: AdminView,
        icon: null,
        id: "admin",
        name: "Admin",
        path: AppConstants.ADMIN_VIEW_BASE_PATH,
        protected: false,
        showOnSidePanel: false
    },
    {
        component: DeveloperView,
        icon: null,
        id: "developer",
        name: "Developer",
        path: AppConstants.DEVELOPER_VIEW_BASE_PATH,
        protected: false,
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
export const defaultLayoutRoutes = DEFAULT_LAYOUT_ROUTES;
export const errorLayoutRoutes = ERROR_LAYOUT_ROUTES;
export const developerViewRoutes = DEVELOPER_VIEW_ROUTES;
export const adminViewRoutes = ADMIN_VIEW_ROUTES;
