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
 * Get Developer View Routes.
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
export const getDeveloperViewRoutes = (): RouteInterface[] => {

    return [
        ...extensions,
        {
            category: "devPortal:components.sidePanel.categories.application",
            children: [
                {
                    component: lazy(() => import("../../applications/pages/application-template")),
                    exact: true,
                    icon: {
                        icon: SidePanelIcons.childIcon
                    },
                    id: "applicationTemplate",
                    name: "Application Templates",
                    path: AppConstants.getPaths().get("APPLICATION_TEMPLATES"),
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
                    path: AppConstants.getPaths().get("APPLICATION_EDIT"),
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
            order: 1,
            path: AppConstants.getPaths().get("APPLICATIONS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "devPortal:components.sidePanel.categories.identityProviders",
            children: [
                {
                    component: lazy(() => import("../../identity-providers/pages/identity-provider-template")),
                    exact: true,
                    icon: {
                        icon: SidePanelIcons.childIcon
                    },
                    id: "identityProviderTemplate",
                    name: "Identity Provider Templates",
                    path: AppConstants.getPaths().get("IDP_TEMPLATES"),
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
                    path: AppConstants.getPaths().get("IDP_EDIT"),
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
            order: 2,
            path: AppConstants.getPaths().get("IDP"),
            protected: true,
            showOnSidePanel: true
        },
        /*{
            category: "devPortal:components.sidePanel.categories.application",
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
                    path: AppConstants.getPaths().get("REMOTE_REPO_CONFIG_EDIT"),
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
            order: 3,
            path: AppConstants.getPaths().get("REMOTE_REPO_CONFIG"),
            protected: true,
            showOnSidePanel: true
        },*/
        {
            category: "devPortal:components.sidePanel.categories.general",
            children: [
                {
                    component: lazy(() => import("../../oidc-scopes/pages/oidc-scopes-edit")),
                    exact: true,
                    icon: {
                        icon: SidePanelIcons.childIcon
                    },
                    id: "oidcScopesEdit",
                    name: "OIDC Scopes Edit",
                    path: AppConstants.getPaths().get("OIDC_SCOPES_EDIT"),
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
            order: 4,
            path: AppConstants.getPaths().get("OIDC_SCOPES"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("../pages/customize")),
            icon: {
                icon: SidePanelIcons.overview
            },
            id: "customize",
            name: "Customize",
            path: AppConstants.getPaths().get("CUSTOMIZE"),
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
            redirectTo: AppConstants.getPaths().get("PAGE_NOT_FOUND"),
            showOnSidePanel: false
        }
    ]
};

/**
 * Get all the Admin View Routes.
 *
 * @return {RouteInterface[]}
 */
export const getAdminViewRoutes = (): RouteInterface[] => {

    return [
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
                    path: AppConstants.getPaths().get("USER_EDIT"),
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
            order: 1,
            path: AppConstants.getPaths().get("USERS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "adminPortal:components.sidePanel.categories.users",
            children: [
                {
                    component: lazy(() => import("../../groups/pages/group-edit")),
                    exact: true,
                    icon: {
                        icon: SidePanelIcons.childIcon
                    },
                    id: "groupsEdit",
                    name: "adminPortal:components.sidePanel.editGroups",
                    path: AppConstants.getPaths().get("GROUP_EDIT"),
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
            path: AppConstants.getPaths().get("GROUPS"),
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
                    path: AppConstants.getPaths().get("ROLE_EDIT"),
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
            order: 3,
            path: AppConstants.getPaths().get("ROLES"),
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
                    path: AppConstants.getPaths().get("LOCAL_CLAIMS_EDIT"),
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
                    path: AppConstants.getPaths().get("LOCAL_CLAIMS"),
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
                    path: AppConstants.getPaths().get("EXTERNAL_DIALECT_EDIT"),
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
            order: 6,
            path: AppConstants.getPaths().get("CLAIM_DIALECTS"),
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
                    path: AppConstants.getPaths().get("USERSTORES_EDIT"),
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
                    path: AppConstants.getPaths().get("USERSTORE_TEMPLATES"),
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
            order: 4,
            path: AppConstants.getPaths().get("USERSTORES"),
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
            order: 5,
            path: AppConstants.getPaths().get("CERTIFICATES"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "adminPortal:components.sidePanel.categories.configurations",
            children: [
                {
                    component: lazy(() => import("../../email-templates/pages/email-templates-page")),
                    exact: true,
                    icon: {
                        icon: SidePanelIcons.childIcon
                    },
                    id: "emailTemplates",
                    name: "adminPortal:components.sidePanel.emailTemplates",
                    path: AppConstants.getPaths().get("EMAIL_TEMPLATES"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() => import("../../email-templates/pages/email-template-edit-page")),
                    exact: true,
                    icon: {
                        icon: SidePanelIcons.childIcon
                    },
                    id: "emailTemplates",
                    name: "adminPortal:components.sidePanel.addEmailTemplate",
                    path: AppConstants.getPaths().get("EMAIL_TEMPLATE"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() => import("../../email-templates/pages/email-template-edit-page")),
                    exact: true,
                    icon: {
                        icon: SidePanelIcons.childIcon
                    },
                    id: "emailTemplates",
                    name: "adminPortal:components.sidePanel.addEmailTemplateLocale",
                    path: AppConstants.getPaths().get("EMAIL_TEMPLATE_ADD"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("../../email-templates/pages/email-template-types-page")),
            exact: true,
            icon: {
                icon: SidePanelIcons.emailTemplates
            },
            id: "emailTemplates",
            name: "adminPortal:components.sidePanel.emailTemplates",
            order: 7,
            path: AppConstants.getPaths().get("EMAIL_TEMPLATE_TYPES"),
            protected: true,
            showOnSidePanel: true
        },
        {
            component: lazy(() => import("../../server-configurations/pages/governance-connectors")),
            exact: true,
            icon: null,
            id: "governanceConnectors",
            name: "adminPortal:components.sidePanel.governanceConnectors",
            order: 8,
            path: AppConstants.getPaths().get("GOVERNANCE_CONNECTORS"),
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
            redirectTo: AppConstants.getPaths().get("PAGE_NOT_FOUND"),
            showOnSidePanel: false
        }
    ]
};
/**
 * Get default page layout routes.
 *
 * @return {RouteInterface[]}
 */
export const getDefaultLayoutRoutes = (): RouteInterface[] => {

    return [
        {
            component: lazy(() => import("../pages/privacy")),
            icon: null,
            id: "privacy",
            name: "adminPortal:components.sidePanel.privacy",
            path: AppConstants.getPaths().get("PRIVACY"),
            protected: true,
            showOnSidePanel: false
        }
    ];
};

/**
 * Get error page layout routes.
 *
 * @return {RouteInterface[]}
 */
export const getErrorLayoutRoutes = (): RouteInterface[] => {

    return [
        {
            component: lazy(() => import("../pages/errors/unauthorized")),
            icon: null,
            id: "unauthorized",
            name: "Unauthorized",
            path: AppConstants.getPaths().get("UNAUTHORIZED"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("../pages/errors/404")),
            icon: null,
            id: "pageNotFound",
            name: "404",
            path: AppConstants.getPaths().get("PAGE_NOT_FOUND"),
            protected: true,
            showOnSidePanel: false
        }
    ];
};

/**
 * Get auth page layout routes.
 *
 * @return {RouteInterface[]}
 */
export const getAuthLayoutRoutes = (): RouteInterface[] => {

    return [
        {
            component: lazy(() => import("../../authentication/pages/sign-in")),
            icon: null,
            id: "authLayoutLogin",
            name: "Login",
            path: AppConstants.getPaths().get("LOGIN"),
            protected: false,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("../../authentication/pages/sign-out")),
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
 * Get all the app layout routes.
 *
 * @return {RouteInterface[]}
 */
export const getAppLayoutRoutes = (): RouteInterface[] => {

    return [
        {
            component: AuthLayout,
            icon: null,
            id: "appRouteLogin",
            name: "Login",
            path: AppConstants.getPaths().get("LOGIN"),
            protected: false,
            showOnSidePanel: false
        },
        {
            component: AuthLayout,
            icon: null,
            id: "appRouteLogout",
            name: "Logout",
            path: AppConstants.getPaths().get("LOGOUT"),
            protected: false,
            showOnSidePanel: false
        },
        {
            component: DefaultLayout,
            icon: null,
            id: "appRoutePrivacy",
            name: "Privacy",
            path: AppConstants.getPaths().get("PRIVACY"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: ErrorLayout,
            exact: true,
            icon: null,
            id: "unauthorized",
            name: "Unauthorized",
            path: AppConstants.getPaths().get("UNAUTHORIZED"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: ErrorLayout,
            exact: true,
            icon: null,
            id: "appRoute404",
            name: "Error",
            path: AppConstants.getPaths().get("PAGE_NOT_FOUND"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: AdminView,
            icon: null,
            id: "admin",
            name: "Admin",
            path: AppConstants.getAdminViewBasePath(),
            protected: false,
            showOnSidePanel: false
        },
        {
            component: DeveloperView,
            icon: null,
            id: "developer",
            name: "Developer",
            path: AppConstants.getDeveloperViewBasePath(),
            protected: false,
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
