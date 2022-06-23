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
import keyBy from "lodash-es/keyBy";
import merge from "lodash-es/merge";
import values from "lodash-es/values";
import { FunctionComponent, lazy } from "react";
import { getSidePanelIcons } from "./ui";
import { EXTENSION_ROUTES, identityProviderConfig } from "../../../extensions";
import { AppLayout, AuthLayout, DefaultLayout, ErrorLayout } from "../../../layouts";
import { AdminView, DeveloperView, FullScreenView } from "../../../views";
import { AppConstants } from "../constants";

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

    const routes: RouteInterface[] = values(
        merge(
            keyBy(
                [
                    {
                        category: "console:develop.features.sidePanel.categories.application",
                        children: [
                            {
                                component: lazy(() => import("../../applications/pages/application-template")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
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
                                    icon: getSidePanelIcons().childIcon
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
                            icon: getSidePanelIcons().applications
                        },
                        id: "applications",
                        name: "common:applications",
                        order: 1,
                        path: AppConstants.getPaths().get("APPLICATIONS"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:develop.features.sidePanel.categories.identityProviders",
                        children: [
                            {
                                component: lazy(() =>
                                    import("../../identity-providers/pages/identity-provider-template")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
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
                                    icon: getSidePanelIcons().childIcon
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
                            icon: identityProviderConfig?.useNewConnectionsView
                                ? getSidePanelIcons().connections
                                : getSidePanelIcons().identityProviders
                        },
                        id: "identityProviders",
                        name: identityProviderConfig?.useNewConnectionsView
                            ? "console:develop.features.sidePanel.authenticationProviders"
                            : "console:develop.features.sidePanel.identityProviders",
                        order: 2,
                        path: AppConstants.getPaths().get("IDP"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:develop.features.secrets.routes.category",
                        children: [
                            {
                                component: lazy(() => import("../../secrets/pages/secret-edit")),
                                exact: false,
                                icon: { icon: getSidePanelIcons().childIcon },
                                id: "secretManagementEdit",
                                name: "console:develop.features.secrets.routes.sidePanelChildrenNames.0",
                                path: AppConstants.getPaths().get("SECRET_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../secrets/pages/secrets")),
                        exact: true,
                        icon: { icon: getSidePanelIcons().secrets },
                        id: "secretsManagement",
                        name: "console:develop.features.secrets.routes.name",
                        order: 3,
                        path: AppConstants.getPaths().get("SECRETS"),
                        protected: true,
                        showOnSidePanel: true
                    }
                ], "id"
            ),
            keyBy(EXTENSION_ROUTES().develop, "id")
        )
    );

    routes.push({
        component: null,
        icon: null,
        id: "404",
        name: "404",
        path: "*",
        protected: true,
        redirectTo: AppConstants.getPaths().get("PAGE_NOT_FOUND"),
        showOnSidePanel: false
    });

    return routes;
};

/**
 * Get all the Admin View Routes.
 *
 * @return {RouteInterface[]}
 */
export const getAdminViewRoutes = (): RouteInterface[] => {

    const routes: RouteInterface[] = values(
        merge(
            keyBy(
                [
                    {
                        category: "console:manage.features.sidePanel.categories.users",
                        children: [
                            {
                                component: lazy(() => import("../../users/pages/user-edit")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "usersEdit",
                                name: "console:manage.features.sidePanel.editUsers",
                                path: AppConstants.getPaths().get("USER_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../users/pages/users")),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().users
                        },
                        id: "users",
                        name: "console:manage.features.sidePanel.users",
                        order: 1,
                        path: AppConstants.getPaths().get("USERS"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:manage.features.sidePanel.categories.users",
                        children: [
                            {
                                component: lazy(() => import("../../groups/pages/group-edit")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "groupsEdit",
                                name: "console:manage.features.sidePanel.editGroups",
                                path: AppConstants.getPaths().get("GROUP_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../groups/pages/groups")),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().groups
                        },
                        id: "groups",
                        name: "console:manage.features.sidePanel.groups",
                        order: 2,
                        path: AppConstants.getPaths().get("GROUPS"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:manage.features.sidePanel.categories.users",
                        children: [
                            {
                                component: lazy(() => import("../../roles/pages/role-edit")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "rolesEdit",
                                name: "console:manage.features.sidePanel.editRoles",
                                path: AppConstants.getPaths().get("ROLE_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../roles/pages/role")),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().roles
                        },
                        id: "roles",
                        name: "console:manage.features.sidePanel.roles",
                        order: 3,
                        path: AppConstants.getPaths().get("ROLES"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:manage.features.sidePanel.categories.users",
                        component: lazy(() => import("../../workflow-approvals/pages/approvals")),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().approvals
                        },
                        id: "approvals",
                        name: "console:manage.features.sidePanel.approvals",
                        order: 4,
                        path: AppConstants.getPaths().get("APPROVALS"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:manage.features.sidePanel.categories.attributes",
                        children: [
                            {
                                component: lazy(() => import("../../claims/pages/local-claims-edit")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "editLocalClaims",
                                name: "console:manage.features.sidePanel.editLocalClaims",
                                path: AppConstants.getPaths().get("LOCAL_CLAIMS_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() => import("../../claims/pages/local-claims")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "localDialect",
                                name: "console:manage.features.sidePanel.localDialect",
                                path: AppConstants.getPaths().get("LOCAL_CLAIMS"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() => import("../../claims/pages/external-dialect-edit")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "editExternalDialect",
                                name: "console:manage.features.sidePanel.editExternalDialect",
                                path: AppConstants.getPaths().get("EXTERNAL_DIALECT_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() => import("../../claims/pages/attribute-mappings")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "attributeMappings",
                                name: "console.manage.features.sidePanel.attributeMappings",
                                path: AppConstants.getPaths().get("ATTRIBUTE_MAPPINGS"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../claims/pages/claim-dialects")),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().claims
                        },
                        id: "attributeDialects",
                        name: "console:manage.features.sidePanel.attributeDialects",
                        order: 6,
                        path: AppConstants.getPaths().get("CLAIM_DIALECTS"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:manage.features.sidePanel.categories.attributes",
                        children: [
                            {
                                component: lazy(() => import("../../oidc-scopes/pages/oidc-scopes-edit")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "oidcScopesEdit",
                                name: "console:develop.features.sidePanel.oidcScopes",
                                path: AppConstants.getPaths().get("OIDC_SCOPES_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../oidc-scopes/pages/oidc-scopes")),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().scopes
                        },
                        id: "oidcScopes",
                        name: "console:develop.features.sidePanel.oidcScopes",
                        order: 7,
                        path: AppConstants.getPaths().get("OIDC_SCOPES"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:manage.features.sidePanel.categories.userstores",
                        children: [
                            {
                                component: lazy(() => import("../../userstores/pages/user-stores-edit")),
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "edit-user-store",
                                name: "console:manage.features.sidePanel.editUserstore",
                                path: AppConstants.getPaths().get("USERSTORES_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() => import("../../userstores/pages/userstores-templates")),
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "userstore-templates",
                                name: "console:manage.features.sidePanel.userstoreTemplates",
                                path: AppConstants.getPaths().get("USERSTORE_TEMPLATES"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../userstores/pages/user-stores")),
                        icon: {
                            icon: getSidePanelIcons().userStore
                        },
                        id: "userStores",
                        name: "console:manage.features.sidePanel.userstores",
                        order: 5,
                        path: AppConstants.getPaths().get("USERSTORES"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:manage.features.sidePanel.categories.certificates",
                        component: lazy(() => import("../../certificates/pages/certificates-keystore")),
                        icon: {
                            icon: getSidePanelIcons().certificate
                        },
                        id: "certificates",
                        name: "console:manage.features.sidePanel.certificates",
                        order: 8,
                        path: AppConstants.getPaths().get("CERTIFICATES"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:manage.features.sidePanel.categories.configurations",
                        children: [
                            {
                                component: lazy(() => import("../../email-templates/pages/email-templates-page")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "emailTemplates",
                                name: "console:manage.features.sidePanel.emailTemplates",
                                path: AppConstants.getPaths().get("EMAIL_TEMPLATES"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() => import("../../email-templates/pages/email-template-edit-page")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "emailTemplates",
                                name: "console:manage.features.sidePanel.addEmailTemplate",
                                path: AppConstants.getPaths().get("EMAIL_TEMPLATE"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() => import("../../email-templates/pages/email-template-edit-page")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "emailTemplates",
                                name: "console:manage.features.sidePanel.addEmailTemplateLocale",
                                path: AppConstants.getPaths().get("EMAIL_TEMPLATE_ADD"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../email-templates/pages/email-template-types-page")),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().emailTemplates
                        },
                        id: "emailTemplates",
                        name: "console:manage.features.sidePanel.emailTemplates",
                        order: 9,
                        path: AppConstants.getPaths().get("EMAIL_TEMPLATE_TYPES"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:manage.features.sidePanel.categories.configurations",
                        component: lazy(() =>
                            import("../../remote-repository-configuration/pages/remote-repository-config")
                        ),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().remoteFetch
                        },
                        id: "remoteFetchConfig",
                        name: "Remote Configurations",
                        order: 10,
                        path: AppConstants.getPaths().get("REMOTE_REPO_CONFIG"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        component: lazy(() => import("../../server-configurations/pages/governance-connectors")),
                        exact: true,
                        icon: null,
                        id: "governanceConnectors",
                        name: "console:manage.features.sidePanel.governanceConnectors",
                        order: 11,
                        path: AppConstants.getPaths().get("GOVERNANCE_CONNECTORS"),
                        protected: true,
                        showOnSidePanel: false
                    },
                    {
                        category: "console:manage.features.sidePanel.categories.organizations",
                        children: [
                            {
                                component: lazy(() => import("../../organizations/pages/organization-edit")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().organization
                                },
                                id: "organization-edit",
                                name: "organizationEdit",
                                path: AppConstants.getPaths().get("ORGANIZATION_UPDATE"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../organizations/pages/organizations")),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().organization
                        },
                        id: "organizations",
                        name: "console:manage.features.sidePanel.organizations",
                        order: 12,
                        path: AppConstants.getPaths().get("ORGANIZATIONS"),
                        protected: true,
                        showOnSidePanel: true
                    }
                ],
                "id"
            ),
            keyBy(EXTENSION_ROUTES().manage, "id")
        )
    );

    routes.push({
        component: null,
        icon: null,
        id: "404",
        name: "404",
        path: "*",
        protected: true,
        redirectTo: AppConstants.getPaths().get("PAGE_NOT_FOUND"),
        showOnSidePanel: false
    });

    return routes;
};

/**
 * Get full screen layout routes.
 *
 * @return {RouteInterface[]}
 */
export const getFullScreenViewRoutes = (): RouteInterface[] => {

    const routes: RouteInterface[] = values(
        merge(
            keyBy(EXTENSION_ROUTES().fullscreen, "id")
        )
    );

    routes.push({
        component: null,
        icon: null,
        id: "404",
        name: "404",
        path: "*",
        protected: true,
        redirectTo: AppConstants.getPaths().get("PAGE_NOT_FOUND"),
        showOnSidePanel: false
    });

    return routes;
};

/**
 * Get default page layout routes.
 *
 * @return {RouteInterface[]}
 */
export const getDefaultLayoutRoutes = (): RouteInterface[] => {

    const routes: RouteInterface[] = values(
        merge(
            keyBy(EXTENSION_ROUTES().default, "id")
        )
    );

    routes.push({
        component: lazy(() => import("../pages/privacy")),
        icon: null,
        id: "privacy",
        name: "console:common.sidePanel.privacy",
        path: AppConstants.getPaths().get("PRIVACY"),
        protected: true,
        showOnSidePanel: false
    });

    return routes;
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
            exact: true,
            icon: null,
            id: "unauthorized",
            name: "Unauthorized",
            path: AppConstants.getPaths().get("UNAUTHORIZED"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("../pages/errors/404")),
            exact: true,
            icon: null,
            id: "pageNotFound",
            name: "404",
            path: AppConstants.getPaths().get("PAGE_NOT_FOUND"),
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
        }
    ];
};

/**
 * Get auth page layout routes.
 *
 * @return {RouteInterface[]}
 */
export const getAuthLayoutRoutes = (): RouteInterface[] => {

    const routes: RouteInterface[] = values(
        merge(
            keyBy(EXTENSION_ROUTES().auth, "id")
        )
    );

    routes.push(
        {
            component: lazy(() => import("../../authentication/pages/sign-out")),
            icon: null,
            id: "authLayoutLogout",
            name: "Logout",
            path: AppConstants.getPaths().get("LOGOUT"),
            protected: false,
            showOnSidePanel: false
        }
    );

    return routes;
};

/**
 * If a layout doesn't use a sub base path i.e `console`, `manage`, then all the routes in that layout
 * has to be registered in the root layout path (`getAppLayoutRoutes`). This function will help inject the
 * proper layout by reusing the defined routes rather than duplicating.
 *
 * @example
 *     Without this, we'll have to manually let the app know to use the `AuthLayout` if someone hits `/login`.
 *     {
 *          component: AuthLayout,
 *          icon: null,
 *          id: "appRouteLogin",
 *          name: "Login",
 *          path: AppConstants.getPaths().get("LOGIN"),
 *          protected: false,
 *          showOnSidePanel: false
 *    },
 *
 * @param {RouteInterface[]} routes - Set of routes in the layout.
 * @param {React.FunctionComponent} layout - Layout to be used.
 *
 * @return {RouteInterface[]}
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

/**
 * Get all the app layout routes.
 *
 * @return {RouteInterface[]}
 */
export const getAppLayoutRoutes = (): RouteInterface[] => {

    return [
        ...getLayoutAssignedToRoutes(getAuthLayoutRoutes(), AuthLayout),
        ...getLayoutAssignedToRoutes(getDefaultLayoutRoutes(), DefaultLayout),
        ...getLayoutAssignedToRoutes(getErrorLayoutRoutes(), ErrorLayout),
        {
            component: FullScreenView,
            icon: null,
            id: "full-screen-view",
            name: "Full Screen View",
            path: AppConstants.getFullScreenViewBasePath(),
            protected: false,
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
