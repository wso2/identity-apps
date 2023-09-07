/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { BoltIcon, EnvelopeCogwheelIcon, HierarchyIcon, UserGroupIcon } from "@oxygen-ui/react-icons";
import { RouteInterface } from "@wso2is/core/models";
import compact from "lodash-es/compact";
import keyBy from "lodash-es/keyBy";
import merge from "lodash-es/merge";
import values from "lodash-es/values";
import React, { FunctionComponent, lazy } from "react";
import { getSidePanelIcons } from "./ui";
import { identityProviderConfig, userstoresConfig } from "../../../extensions";
import { APIResourcesConstants } from "../../../extensions/components/api-resources/constants";
import { FeatureGateConstants } from "../../../extensions/components/feature-gate/constants/feature-gate";
import { RemoteUserStoreConstants } from "../../../extensions/components/user-stores/constants";
import { UsersConstants } from "../../../extensions/components/users/constants";
import { AppLayout, AuthLayout, DefaultLayout, ErrorLayout } from "../../../layouts";
import { AppView, FullScreenView } from "../../../views";
import { ServerConfigurationsConstants } from "../../server-configurations";
import { AppConstants } from "../constants";

/**
 * Get App View Routes.
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
 *  \{
 *      children: [ ... ],
 *     ...
 *     path: "/applications"
 *  \}
 */
export const getAppViewRoutes = (useExtendedRoutes: boolean = false): RouteInterface[] => {

    const routes: RouteInterface[] = values(
        merge(
            keyBy(
                compact([
                    {
                        component: lazy(() => import("../../../extensions/components/getting-started/getting-started")),
                        exact: false,
                        icon: {
                            icon: getSidePanelIcons().home
                        },
                        id: "gettingStarted",
                        name: "Home",
                        order: 0,
                        path: `${ AppConstants.getMainViewBasePath() }/getting-started`,
                        protected: true,
                        showOnSidePanel: true
                    },
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
                        category: "console:develop.features.sidePanel.categories.application",
                        children: [
                            {
                                component: lazy(() =>
                                    import("../../../extensions/components/" + "api-resources/pages/api-resource-edit")
                                ),
                                exact: true,
                                id: "apiResources-edit",
                                name: "extensions:develop.sidePanel.apiResources",
                                path: APIResourcesConstants.getPaths().get("API_RESOURCE_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() =>
                            import("../../../extensions/components/" + "api-resources/pages/api-resources")
                        ),
                        exact: true,
                        icon: {
                            icon: import("../../../extensions/assets/images/icons/api-resources-icon.svg")
                        },
                        id: "apiResources",
                        name: "extensions:develop.sidePanel.apiResources",
                        order: 2,
                        path: APIResourcesConstants.getPaths().get("API_RESOURCES"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:develop.features.sidePanel.categories.application",
                        children: [
                            {
                                component: lazy(() =>
                                    import("../../identity-providers/pages/identity-provider-template")
                                ),
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
                        order: 3,
                        path: AppConstants.getPaths().get("IDP"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.userManagement",
                        children: [
                            {
                                component: lazy(() =>
                                    import("../../../extensions/components/" + "users/pages/guest-user-edit")
                                ),
                                exact: true,
                                icon: {
                                    icon: import("../../../extensions/assets/images/icons/admin-icon.svg")
                                },
                                id: "collaborator-user-edit",
                                name: "Collaborator Users Edit",
                                path: UsersConstants.getPaths().get("COLLABORATOR_USER_EDIT_PATH"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() =>
                                    import("../../../extensions/components/users" + "/pages/administrator-settings")
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "administrator-settings-edit",
                                name: "administrator-settings-edit",
                                path: UsersConstants.getPaths().get("COLLABORATOR_SETTINGS_EDIT_PATH"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../../extensions/components/users/pages/administrators")),
                        exact: true,
                        icon: {
                            icon: import("../../../extensions/assets/images/icons/admin-icon.svg")
                        },
                        id: "administrators",
                        name: "Administrators",
                        order: 5,
                        path: UsersConstants.getPaths().get("COLLABORATOR_USERS_PATH"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.userManagement",
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
                            icon: getSidePanelIcons().applicationRoles
                        },
                        id: "roles",
                        name: "console:manage.features.sidePanel.roles",
                        order: 7,
                        path: AppConstants.getPaths().get("ROLES"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.userManagement",
                        children: [
                            {
                                component: lazy(() => import("../../application-roles/pages/application-role-edit")),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "applicationRolesEdit",
                                name: "Edit Role",
                                path: AppConstants.getPaths().get("APPLICATION_ROLES_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../application-roles/pages/application-roles")),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().roles
                        },
                        id: "applicationRoles",
                        name: "Roles",
                        order: 8,
                        path: AppConstants.getPaths().get("APPLICATION_ROLES"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.attributeManagement",
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
                        order: 10,
                        path: AppConstants.getPaths().get("CLAIM_DIALECTS"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.attributeManagement",
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
                        order: 11,
                        path: AppConstants.getPaths().get("OIDC_SCOPES"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:manage.features.sidePanel.categories.organizations",
                        children: [
                            {
                                component: lazy(() =>
                                    import("../../../features/organizations/pages/organization-edit")
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().organization
                                },
                                id: "organization-edit",
                                name: "organization Edit",
                                path: AppConstants.getPaths().get("ORGANIZATION_UPDATE"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../../features/organizations/pages/organizations")),
                        exact: true,
                        icon: {
                            icon: <HierarchyIcon fill="black" />
                        },
                        id: "organizations",
                        name: "console:manage.features.sidePanel.organizations",
                        order: 12,
                        path: AppConstants.getPaths().get("ORGANIZATIONS"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:develop.sidePanel.categories.branding",
                        component: lazy(() => import("../../../extensions/components/branding/pages/branding")),
                        exact: true,
                        icon: {
                            icon: import("../../../extensions/assets/images/icons/paint-palette-and-brush-outline.svg")
                        },
                        id: "branding",
                        name: "extensions:develop.sidePanel.branding",
                        order: 13,
                        path: `${ AppConstants.getDeveloperViewBasePath() }/branding`,
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:develop.sidePanel.categories.branding",
                        component: lazy(() =>
                            import("../../../extensions/components/email-management/" + "pages/email-customization")
                        ),
                        exact: true,
                        icon: { icon: getSidePanelIcons().emailTemplates },
                        id: "communication-management",
                        name: "extensions:develop.sidePanel.emailTemplates",
                        order: 14,
                        path: `${ AppConstants.getDeveloperViewBasePath() }/email-management`,
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:develop.sidePanel.categories.branding",
                        component: lazy(() =>
                            import("../../../extensions/components/email-providers" + "/pages/email-providers")
                        ),
                        exact: true,
                        icon: {
                            icon: <EnvelopeCogwheelIcon fill="black" className="icon" />
                        },
                        id: "emailProviders",
                        name: "extensions:develop.sidePanel.emailProvider",
                        order: 15,
                        path: AppConstants.getPaths().get("EMAIL_PROVIDER"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.AccountManagement",
                        children: [
                            {
                                component: lazy(() =>
                                    import("../../../extensions/components/" + "my-account/pages/my-account-edit")
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "my-account-settings",
                                name: "My Account Settings",
                                path: AppConstants.getPaths().get("MY_ACCOUNT_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../../extensions/components/my-account/pages/my-account")),
                        exact: true,
                        icon: {
                            icon: import("../../../extensions/assets/images/icons/self-service-portal-icon.svg")
                        },
                        id: "myAccount",
                        name: "Self-Service Portal",
                        order: 16,
                        path: AppConstants.getPaths().get("MY_ACCOUNT"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.AccountManagement",
                        children: [
                            {
                                component: lazy(() =>
                                    import("../../../extensions/components/" + "my-account/pages/my-account-edit")
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "my-account-settings",
                                name: "My Account Settings",
                                path: AppConstants.getPaths().get("MY_ACCOUNT_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../../extensions/components/my-account/pages/my-account")),
                        exact: true,
                        icon: {
                            icon: import("../../../extensions/assets/images/icons/self-service-portal-icon.svg")
                        },
                        id: "myAccount",
                        name: "Self-Service Portal",
                        order: 17,
                        path: AppConstants.getPaths().get("MY_ACCOUNT"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.AccountManagement",
                        children: [
                            {
                                component: lazy(() =>
                                    import(
                                        "../../../extensions/components/governance-connectors/" +
                                        "pages/connector-edit-page"
                                    )
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "self-registration-connector",
                                name: "Self Registration Connector",
                                path: AppConstants.getPaths()
                                    .get("GOVERNANCE_CONNECTOR_EDIT")
                                    .replace(":categoryId", ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID)
                                    .replace(":connectorId", ServerConfigurationsConstants.SELF_SIGN_UP_CONNECTOR_ID),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() =>
                            import(
                                "../../../extensions/components/governance-connectors/" + "pages/connector-listing-page"
                            )
                        ),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().connectors[
                                ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID
                            ]
                        },
                        id: "userOnboarding",
                        name: "Self Registration",
                        order: 18,
                        path: AppConstants.getPaths()
                            .get("GOVERNANCE_CONNECTOR")
                            .replace(":id", ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.AccountManagement",
                        children: [
                            {
                                component: lazy(() =>
                                    import(
                                        "../../../extensions/components/account-login/" +
                                        "pages/username-validation-edit"
                                    )
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "account-login",
                                name: "Account Login",
                                path: AppConstants.getPaths().get("USERNAME_VALIDATION_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() =>
                            import("../../../extensions/components/" + "account-login/pages/account-login")
                        ),
                        exact: true,
                        icon: {
                            icon: import("../../../extensions/assets/images/icons/account-login-icon.svg")
                        },
                        id: "accountLogin",
                        name: "Account Login",
                        order: 19,
                        path: AppConstants.getPaths().get("ACCOUNT_LOGIN"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.AccountManagement",
                        children: [
                            {
                                component: lazy(() =>
                                    import(
                                        "../../../extensions/components/governance-connectors/" +
                                        "pages/connector-edit-page"
                                    )
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "password-recovery",
                                name: "Password Recovery",
                                path: AppConstants.getPaths()
                                    .get("GOVERNANCE_CONNECTOR_EDIT")
                                    .replace(
                                        ":categoryId",
                                        ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID
                                    )
                                    .replace(
                                        ":connectorId",
                                        ServerConfigurationsConstants.ACCOUNT_RECOVERY_CONNECTOR_ID
                                    ),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() =>
                            import(
                                "../../../extensions/components/governance-connectors/" + "pages/connector-listing-page"
                            )
                        ),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().connectors[
                                ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID
                            ]
                        },
                        id: "accountRecovery",
                        name: "Account Recovery",
                        order: 20,
                        path: AppConstants.getPaths()
                            .get("GOVERNANCE_CONNECTOR")
                            .replace(":id", ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CONNECTOR_CATEGORY_ID),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.AccountManagement",
                        children: [
                            {
                                component: lazy(() =>
                                    import(
                                        "../../../extensions/components/governance-connectors/" +
                                        "pages/connector-edit-page"
                                    )
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "login-attempt-security",
                                name: "Login Attempts Security",
                                path: AppConstants.getPaths()
                                    .get("GOVERNANCE_CONNECTOR_EDIT")
                                    .replace(
                                        ":categoryId",
                                        ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID
                                    )
                                    .replace(
                                        ":connectorId",
                                        ServerConfigurationsConstants.ACCOUNT_LOCKING_CONNECTOR_ID
                                    ),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() =>
                                    import(
                                        "../../../extensions/components/governance-connectors/" +
                                        "pages/connector-edit-page"
                                    )
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "bot-detection",
                                name: "Bot Detection",
                                path: AppConstants.getPaths()
                                    .get("GOVERNANCE_CONNECTOR_EDIT")
                                    .replace(
                                        ":categoryId",
                                        ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID
                                    )
                                    .replace(
                                        ":connectorId",
                                        ServerConfigurationsConstants.CAPTCHA_FOR_SSO_LOGIN_CONNECTOR_ID
                                    ),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() =>
                                    import("../../../features/validation/pages/validation-config-edit")
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().organization
                                },
                                id: "validation-config-edit",
                                name: "Validation Configuration Edit",
                                path: AppConstants.getPaths().get("VALIDATION_CONFIG_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() =>
                                    import("../../../features/private-key-jwt/pages/private-key-jwt-config-edit")
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().jwtKey
                                },
                                id: "private-key-jwt-config-edit",
                                name: "Private Key JWT Client Authentication for OIDC Configuration Edit",
                                path: AppConstants.getPaths().get("PRIVATE_KEY_JWT_CONFIG_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() =>
                            import(
                                "../../../extensions/components/" + "governance-connectors/pages/connector-listing-page"
                            )
                        ),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().connectors[
                                ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID
                            ]
                        },
                        id: "accountSecurity",
                        name: "Account Security",
                        order: 21,
                        path: AppConstants.getPaths()
                            .get("GOVERNANCE_CONNECTOR")
                            .replace(":id", ServerConfigurationsConstants.LOGIN_ATTEMPT_SECURITY_CONNECTOR_CATEGORY_ID),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:develop.sidePanel.categories.monitor",
                        component: lazy(() => import("../../../extensions/components/logs/pages/logs")),
                        exact: true,
                        featureGateIds: [ FeatureGateConstants.SAAS_FEATURES_IDENTIFIER ],
                        icon: {
                            icon: import("../../../extensions/assets/images/icons/event-publishing.svg")
                        },
                        id: "logs",
                        name: "extensions:develop.sidePanel.monitor",
                        order: 22,
                        path: `${ AppConstants.getDeveloperViewBasePath() }/logs`,
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:develop.sidePanel.categories.monitor",
                        component: lazy(() => import("../../../extensions/components/events/pages/event-edit")),
                        exact: true,
                        featureGateIds: [ FeatureGateConstants.SAAS_FEATURES_IDENTIFIER ],
                        icon: {
                            icon: <BoltIcon fill="black" className="icon" />
                        },
                        id: "eventPublishing",
                        name: "extensions:develop.sidePanel.eventPublishing",
                        order: 23,
                        path: AppConstants.getPaths().get("EVENT_EDIT"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:develop.sidePanel.categories.monitor",
                        component: lazy(() => import("../../org-insights/pages/org-insights")),
                        exact: true,
                        featureGateIds: [ FeatureGateConstants.SAAS_FEATURES_IDENTIFIER ],
                        featureStatus: "BETA",
                        featureStatusLabel: "common:beta",
                        icon: {
                            icon: getSidePanelIcons().insights
                        },
                        id: "insights",
                        name: "Insights",
                        order: 23,
                        path: AppConstants.getPaths().get("INSIGHTS"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    // the following routes are not onboarded to the side panel
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
                        order: 999,
                        path: AppConstants.getPaths().get("SECRETS"),
                        protected: true,
                        showOnSidePanel: false
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
                        order: 999,
                        path: AppConstants.getPaths().get("APPROVALS"),
                        protected: true,
                        showOnSidePanel: false
                    },
                    {
                        category: "console:manage.features.sidePanel.categories.certificates",
                        component: lazy(() => import("../../certificates/pages/certificates-keystore")),
                        icon: {
                            icon: getSidePanelIcons().certificate
                        },
                        id: "certificates",
                        name: "console:manage.features.sidePanel.certificates",
                        order: 999,
                        path: AppConstants.getPaths().get("CERTIFICATES"),
                        protected: true,
                        showOnSidePanel: false
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
                        name: "console:manage.features.sidePanel.remoteFetchConfig",
                        order: 999,
                        path: AppConstants.getPaths().get("REMOTE_REPO_CONFIG"),
                        protected: true,
                        showOnSidePanel: false
                    },
                    {
                        component: lazy(() => import("../../server-configurations/pages/governance-connectors")),
                        exact: true,
                        icon: null,
                        id: "governanceConnectors",
                        name: "console:manage.features.sidePanel.governanceConnectors",
                        order: 999,
                        path: AppConstants.getPaths().get("GOVERNANCE_CONNECTORS"),
                        protected: true,
                        showOnSidePanel: false
                    }
                ]),
                "id"
            )
        )
    );

    if (useExtendedRoutes) {
        routes.push(
            {
                category: "extensions:manage.sidePanel.categories.userManagement",
                children: [
                    {
                        component: lazy(() =>
                            import("../../../extensions/components/" + "users/pages/consumer-user-edit")
                        ),
                        exact: true,
                        icon: {
                            icon: import("../../../extensions/assets/images/icons/user-icon.svg")
                        },
                        id: "customer-user-edit",
                        name: "Customer Users Edit",
                        path: UsersConstants.getPaths().get("CUSTOMER_USER_EDIT_PATH"),
                        protected: true,
                        showOnSidePanel: false
                    }
                ],
                component: lazy(() => import("../../../extensions/" + "components/users/pages/users")),
                exact: true,
                icon: {
                    icon: import("../../../extensions/assets/images/icons/user-icon.svg")
                },
                id: "users",
                name: "Users",
                order: 4,
                path: UsersConstants.getPaths().get("USERS_PATH"),
                protected: true,
                showOnSidePanel: true
            },
            {
                category: "extensions:manage.sidePanel.categories.userManagement",
                children: [
                    {
                        component: lazy(() =>
                            import("../../../extensions/components/" + "groups/pages/groups-edit")
                        ),
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
                component: lazy(() => import("../../../extensions/components/groups/pages/groups")),
                exact: true,
                icon: {
                    icon: <UserGroupIcon className="icon" fill="black" />
                },
                id: "groups",
                name: "Groups",
                order: 6,
                path: AppConstants.getPaths().get("GROUPS"),
                protected: true,
                showOnSidePanel: true
            },
            {
                category: "extensions:manage.sidePanel.categories.userManagement",
                children: [
                    {
                        component: lazy(() => import("../../../features/userstores/pages/user-stores-edit")),
                        exact: true,
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
                        component: lazy(() =>
                            import(
                                "../../../extensions/components/user-stores/" +
                                "pages/remote-user-store-edit-page"
                            )
                        ),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().childIcon
                        },
                        id: "remote-edit-user-store",
                        name: "console:manage.features.sidePanel.editUserstore",
                        path: AppConstants.getPaths()
                            .get("USERSTORES_EDIT")
                            .replace("edit-user-store", userstoresConfig.userstoreEdit.remoteUserStoreEditPath),
                        protected: true,
                        showOnSidePanel: false
                    },
                    {
                        component: lazy(() =>
                            import(
                                "../../../extensions/components/user-stores/pages/" +
                                "remote-customer-user-store-create"
                            )
                        ),
                        icon: {
                            icon: getSidePanelIcons().childIcon
                        },
                        id: "remote-user-store-create",
                        name: "userstore create",
                        path: RemoteUserStoreConstants.getPaths().get("REMOTE_USER_STORE_CREATE"),
                        protected: true,
                        showOnSidePanel: false
                    }
                ],
                component: lazy(() => import("../../../extensions/components/user-stores/pages/user-stores")),
                exact: true,
                icon: {
                    icon: getSidePanelIcons().userStore
                },
                id: "userStores",
                name: "User Stores",
                order: 9,
                path: AppConstants.getPaths().get("USERSTORES"),
                protected: true,
                showOnSidePanel: true
            }
        );
    } else {
        routes.push(
            {
                category: "extensions:manage.sidePanel.categories.userManagement",
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
                order: 4,
                path: AppConstants.getPaths().get("USERS"),
                protected: true,
                showOnSidePanel: true
            },
            {
                category: "extensions:manage.sidePanel.categories.userManagement",
                children: [
                    {
                        component: lazy(() =>
                            import("../../../extensions/components/" + "groups/pages/groups-edit")
                        ),
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
                component: lazy(() => import("../../../extensions/components/groups/pages/groups")),
                exact: true,
                icon: {
                    icon: <UserGroupIcon className="icon" fill="black" />
                },
                id: "groups",
                name: "Groups",
                order: 6,
                path: AppConstants.getPaths().get("GROUPS"),
                protected: true,
                showOnSidePanel: true
            },
            {
                category: "extensions:manage.sidePanel.categories.userManagement",
                children: [
                    {
                        component: lazy(() => import("../../userstores/pages/user-stores-edit")),
                        exact: true,
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
                        component: lazy(() =>
                            import("../../userstores/pages/userstores-templates")
                        ),
                        exact: true,
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
                exact: true,
                icon: {
                    icon: getSidePanelIcons().userStore
                },
                id: "userStores",
                name: "console:manage.features.sidePanel.userstores",
                order: 9,
                path: AppConstants.getPaths().get("USERSTORES"),
                protected: true,
                showOnSidePanel: true
            }
        );
    }    

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
 * @returns
 */
export const getFullScreenViewRoutes = (): RouteInterface[] => {
    const routes: RouteInterface[] = [
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

    return routes;
};

/**
 * Get default page layout routes.
 *
 * @returns
 */
export const getDefaultLayoutRoutes = (): RouteInterface[] => {
    const routes: RouteInterface[] = [];

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
 * @returns
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
 * @returns
 */
export const getAuthLayoutRoutes = (): RouteInterface[] => {
    const routes: RouteInterface[] = [
        {
            component: lazy(() => import("../../../extensions/components/tenants/pages/create-tenant")),
            exact: true,
            icon: null,
            id: "createTenant",
            name: "createTenant",
            path: AppConstants.getPaths().get("CREATE_TENANT"),
            protected: true,
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

    return routes;
};

/**
 * If a layout doesn't use a sub base path i.e `console`, `manage`, then all the routes in that layout
 * has to be registered in the root layout path (`getAppLayoutRoutes`). This function will help inject the
 * proper layout by reusing the defined routes rather than duplicating.
 *
 * @example
 *     Without this, we'll have to manually let the app know to use the `AuthLayout` if someone hits `/login`.
 *
 *    @example \{
 *          component: AuthLayout,
 *          icon: null,
 *          id: "appRouteLogin",
 *          name: "Login",
 *          path: AppConstants.getPaths().get("LOGIN"),
 *          protected: false,
 *          showOnSidePanel: false
 *    \},
 *
 * @param routes - Set of routes in the layout.
 * @param layout - Layout to be used.
 *
 * @returns
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
 * @returns
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
            component: AppView,
            icon: null,
            id: "app",
            name: "App",
            path: AppConstants.getPaths().get("ROOT"),
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
 * @returns
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
