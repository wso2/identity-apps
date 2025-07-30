/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import {
    ArrowRightToBracketPencilIcon,
    BuildingIcon,
    DocumentCheckIcon,
    EnvelopeGearIcon,
    EnvelopeIcon,
    EnvelopeMagnifyingGlassIcon,
    GearIcon,
    LightbulbOnIcon,
    LinearNodesIcon,
    NodesIcon,
    ProgressFlowIcon,
    UserCircleDotIcon,
    UserGroupIcon,
    WebhookIcon
} from "@oxygen-ui/react-icons";
import { getSidePanelIcons } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { commonConfig } from "@wso2is/admin.extensions.v1";
import FeatureFlagConstants from "@wso2is/admin.feature-gate.v1/constants/feature-flag-constants";
import FeatureGateConstants from "@wso2is/admin.feature-gate.v1/constants/feature-gate-constants";
import { ServerConfigurationsConstants } from "@wso2is/admin.server-configurations.v1";
import { LegacyModeInterface, RouteInterface } from "@wso2is/core/models";
import compact from "lodash-es/compact";
import keyBy from "lodash-es/keyBy";
import merge from "lodash-es/merge";
import values from "lodash-es/values";
import React, { FunctionComponent, lazy } from "react";
import AppLayout from "../layouts/app-layout";
import AuthLayout from "../layouts/auth-layout";
import DashboardLayout from "../layouts/dashboard-layout";
import DefaultLayout from "../layouts/default-layout";
import ErrorLayout from "../layouts/error-layout";
import FullScreenLayout from "../layouts/full-screen-layout";

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

export const getAppViewRoutes = (): RouteInterface[] => {
    const legacyMode: LegacyModeInterface = window["AppUtils"]?.getConfig()?.ui?.legacyMode;

    const isPushProviderFeatureEnabled: boolean =
        window["AppUtils"]?.getConfig()?.ui?.features?.pushProviders?.enabled;
    const isMcpServersFeatureEnabled: boolean =
        window["AppUtils"]?.getConfig()?.ui?.features?.mcpServers?.enabled;

    const defaultRoutes: RouteInterface[] = [
        {
            category: "extensions:manage.sidePanel.categories.userManagement",
            children: [
                {
                    component: lazy(() => import("@wso2is/admin.administrators.v1/pages/administrator-edit")),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "collaborator-user-edit",
                    name: "Collaborator Users Edit",
                    path: AppConstants.getPaths().get("ADMINISTRATOR_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() => import("@wso2is/admin.administrators.v1/pages/administrator-settings")),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "administrator-settings-edit",
                    name: "administrator-settings-edit",
                    path: AppConstants.getPaths().get("ADMINISTRATOR_SETTINGS"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("@wso2is/admin.administrators.v1/pages/administrators")),
            exact: true,
            icon: {
                icon: getSidePanelIcons().administrators
            },
            id: "administrators",
            name: "Administrators",
            order: 5,
            path: AppConstants.getPaths().get("ADMINISTRATORS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "console:common.sidePanel.policyAdministration",
            children: [
                {
                    component: lazy(() => import("@wso2is/admin.policy-administration.v1/pages/edit-policy")),
                    exact: true,
                    id: "editPolicy",
                    name: "Edit Policy",
                    path: AppConstants.getPaths().get("EDIT_POLICY"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("@wso2is/admin.policy-administration.v1/pages/policy-administration")),
            exact: true,
            icon: {
                icon: getSidePanelIcons().policyAdministration
            },
            id: "policyAdministration",
            name: "policyAdministration:title",
            order: 30,
            path: AppConstants.getPaths().get("POLICY_ADMINISTRATION"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "console:develop.features.sidePanel.categories.application",
            children: [
                {
                    component: lazy(() =>
                        import("@wso2is/admin.api-resources.v2/pages/api-resource-edit")
                    ),
                    exact: true,
                    id: "apiResources-edit",
                    name: "extensions:develop.sidePanel.apiResources",
                    path: AppConstants.getPaths().get("API_RESOURCE_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import("@wso2is/admin.api-resources.v2/pages/api-resources-internal-list")
                    ),
                    exact: true,
                    id: "apiResources-list",
                    name: "extensions:develop.sidePanel.apiResources",
                    path: AppConstants.getPaths().get("API_RESOURCES_CATEGORY"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() =>
                import("@wso2is/admin.api-resources.v2/pages/api-resources")
            ),
            exact: true,
            icon: {
                icon: getSidePanelIcons().apiResources
            },
            id: "apiResources",
            name: "extensions:develop.sidePanel.apiResources",
            order: 2,
            path: AppConstants.getPaths().get("API_RESOURCES"),
            protected: true,
            showOnSidePanel: true
        },
        {
            component: lazy(() =>
                import("@wso2is/admin.home.v1/pages/home-page")),
            exact: false,
            icon: {
                icon: getSidePanelIcons().home
            },
            id: "gettingStarted",
            name: "Home",
            order: 0,
            path: AppConstants.getPaths().get("GETTING_STARTED"),
            protected: true,
            showOnSidePanel: true
        },
        {
            children: [
                {
                    component: lazy(() => import(
                        "@wso2is/admin.password-recovery-flow-builder.v1/pages/password-recovery-flow-builder-page")),
                    exact: true,
                    id: "passwordRecoveryFlowBuilder",
                    name: "Password Recovery Flow Builder",
                    path: AppConstants.getPaths().get("PASSWORD_RECOVERY_FLOW_BUILDER"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() => import(
                        "@wso2is/admin.ask-password-flow-builder.v1/pages/ask-password-flow-builder-page")),
                    exact: true,
                    id: "askPasswordFlowBuilder",
                    name: "Ask Password Flow Builder",
                    path: AppConstants.getPaths().get("INVITE_USER_PASSWORD_SETUP_FLOW_BUILDER"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("@wso2is/admin.flows.v1/pages/flows")),
            exact: false,
            featureFlagKey: FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.FLOWS,
            icon: {
                icon: <LinearNodesIcon />
            },
            id: "flows",
            name: "Flows",
            order: 0,
            path: AppConstants.getPaths().get("FLOWS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            children: [
                {
                    component: lazy(() =>
                        import("@wso2is/admin.session-management.v1/pages/session-management")),
                    exact: true,
                    id: "sessionManagement",
                    name: "sessionManagement:title",
                    path: AppConstants.getPaths().get("SESSION_MANAGEMENT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import("@wso2is/admin.saml2-configuration.v1/pages/saml2-configuration")),
                    exact: true,
                    id: "saml2Configuration",
                    name: "saml2Config:title",
                    path: AppConstants.getPaths().get("SAML2_CONFIGURATION"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import("@wso2is/admin.wsfed-configuration.v1/pages/wsfed-configuration")),
                    exact: true,
                    id: "wsFedConfiguration",
                    name: "wsFederationConfig:title",
                    path: AppConstants.getPaths().get("WSFED_CONFIGURATION"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() => import("@wso2is/admin.impersonation.v1/pages/impersonation-configuration")),
                    exact: true,
                    id: "impersonationConfiguration",
                    name: "console:impersonationConfig.title",
                    path: AppConstants.getPaths().get("IMPERSONATION"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import(
                            "@wso2is/admin.server-configurations.v1/" +
                            "pages/connector-edit-page"
                        )
                    ),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "multi-attribute-login",
                    name: "Multi Attribute Login",
                    path: AppConstants.getPaths()
                        .get("GOVERNANCE_CONNECTOR_EDIT")
                        .replace(":categoryId",
                            ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID)
                        .replace(":connectorId",
                            ServerConfigurationsConstants.MULTI_ATTRIBUTE_LOGIN_CONNECTOR_ID),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import(
                            "@wso2is/admin.server-configurations.v1/" +
                            "pages/connector-edit-page"
                        )
                    ),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "admin-forced-password-reset",
                    name: "Admin Forced Password Reset",
                    path: AppConstants.getPaths()
                        .get("GOVERNANCE_CONNECTOR_EDIT")
                        .replace(":categoryId",
                            ServerConfigurationsConstants.ACCOUNT_MANAGEMENT_CATEGORY_ID)
                        .replace(":connectorId",
                            ServerConfigurationsConstants.ADMIN_FORCED_PASSWORD_RESET),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import("@wso2is/admin.username-validation.v1/pages/username-validation-page")
                    ),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "username-validation",
                    name: "Username Validation",
                    path: AppConstants.getPaths().get("USERNAME_VALIDATION_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import("@wso2is/admin.alternative-login-identifier.v1/pages/alternative-login-identifier-page")
                    ),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "alternative-login-identifier",
                    name: "Alternative Login Identifier",
                    path: AppConstants.getPaths().get("ALTERNATIVE_LOGIN_IDENTIFIER_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import("@wso2is/admin.server-configurations.v1/pages/internal-notification-sending-page")
                    ),
                    exact: true,
                    id: "internalNotificationSending",
                    path: AppConstants.getPaths().get("INTERNAL_NOTIFICATION_SENDING"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import("@wso2is/admin.server-configurations.v1/pages/account-disable-page")
                    ),
                    exact: true,
                    id: "accountDisable",
                    path: AppConstants.getPaths().get("ACCOUNT_DISABLE"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() =>
                import(
                    "@wso2is/admin.server-configurations.v1/pages/connector-listing-page"
                )
            ),
            exact: false,
            icon: {
                icon: <ArrowRightToBracketPencilIcon />
            },
            id: "loginAndRegistration",
            name: "console:common.sidePanel.loginAndRegistration.label",
            order: 0,
            path: AppConstants.getPaths().get("LOGIN_AND_REGISTRATION"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "console:develop.features.sidePanel.categories.application",
            children: [
                {
                    component: lazy(() => import("@wso2is/admin.application-templates.v1/pages/application-template")),
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
                    component: lazy(() => import("@wso2is/admin.applications.v1/pages/application-edit")),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "applicationsEdit",
                    name: "Application Edit",
                    path: AppConstants.getPaths().get("APPLICATION_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() => import("@wso2is/admin.applications.v1/pages/applications-settings")),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "applicationsSettings",
                    name: "Applications Settings",
                    path: AppConstants.getPaths().get("APPLICATIONS_SETTINGS"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("@wso2is/admin.applications.v1/pages/applications")),
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
            category: "console:develop.features.sidePanel.categories.userManagement",
            children: [
                {
                    component: lazy(() =>
                        import("@wso2is/admin.agents.v1/pages/edit-agent")),
                    exact: true,
                    id: "editAgent",
                    name: "Edit Agent",
                    path: AppConstants.getPaths().get("AGENT_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("@wso2is/admin.agents.v1/pages/agents")),
            exact: true,
            featureFlagKey: FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.AGENTS,
            icon: {
                icon: getSidePanelIcons().agents
            },
            id: "agents",
            name: "Agents",
            order: 1,
            path: AppConstants.getPaths().get("AGENTS"),
            protected: true,
            showOnSidePanel: true
        },

        {
            category: "extensions:manage.sidePanel.categories.userManagement",
            children: [
                {
                    component: lazy(() => import("@wso2is/admin.users.v1/pages/user-edit")),
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
            component: lazy(() => import("@wso2is/admin.users.v1/pages/users")),
            exact: true,
            icon: {
                icon: getSidePanelIcons().users
            },
            id: "users",
            name: "console:manage.features.sidePanel.users",
            order: 2,
            path: AppConstants.getPaths().get("USERS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "extensions:manage.sidePanel.categories.userManagement",
            children: [
                {
                    component: lazy(() =>
                        import("@wso2is/admin.groups.v1/pages/group-edit")
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
            component: lazy(() => import("@wso2is/admin.groups.v1/pages/groups")),
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
            category: "console:develop.features.sidePanel.categories.application",
            children: [
                {
                    component: lazy(() =>
                        import("@wso2is/admin.connections.v1/pages/connection-templates")
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
                    component: lazy(() =>
                        import("@wso2is/admin.connections.v1/pages/connection-edit")
                    ),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "identityProvidersEdit",
                    name: "Identity Providers Edit",
                    path: AppConstants.getPaths().get("IDP_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import("@wso2is/admin.connections.v1/pages/authenticator-edit")
                    ),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "authenticatorEdit",
                    name: "Local Authenticators Edit",
                    path: AppConstants.getPaths().get("AUTH_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("@wso2is/admin.connections.v1/pages/connections")),
            exact: true,
            icon: {
                icon: <NodesIcon />
            },
            id: "identityProviders",
            name: "console:develop.features.sidePanel.authenticationProviders",
            order: 3,
            path: AppConstants.getPaths().get("IDP"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "console:develop.features.sidePanel.categories.application",
            component: lazy(() => import(
                "@wso2is/admin.identity-verification-providers.v1/pages/identity-verification-provider-edit-page")
            ),
            exact: true,
            icon: { icon: getSidePanelIcons().identityVerificationProviders },
            id: "identityVerificationProviders",
            name: "Identity Verification Providers Edit",
            order: 4,
            path: AppConstants.getPaths().get("IDVP_EDIT"),
            protected: true,
            showOnSidePanel: false
        },
        {
            category: "extensions:manage.sidePanel.categories.attributeManagement",
            children: [
                {
                    component: lazy(() => import("@wso2is/admin.claims.v1/pages/local-claims-edit")),
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
                    component: lazy(() => import("@wso2is/admin.claims.v1/pages/local-claims")),
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
                    component: lazy(() => import("@wso2is/admin.claims.v1/pages/external-dialect-edit")),
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
                    component: lazy(() => import("@wso2is/admin.claims.v1/pages/attribute-mappings")),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "attributeMappings",
                    name: "console.manage.features.sidePanel.attributeMappings",
                    path: AppConstants.getPaths().get("ATTRIBUTE_MAPPINGS"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() => import("@wso2is/admin.claims.v1/pages/" +
                        "attribute-verification-settings")),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "attributeVerificationSettings",
                    name: "console.manage.features.sidePanel.attributeVerificationSettings",
                    path: AppConstants.getPaths().get("CLAIM_VERIFICATION_SETTINGS"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("@wso2is/admin.claims.v1/pages/claim-dialects")),
            exact: true,
            featureFlagKey: FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.ATTRIBUTE_DIALECTS,
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
                    component: lazy(() => import("@wso2is/admin.oidc-scopes.v1/pages/oidc-scopes-edit")),
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
            component: lazy(() => import("@wso2is/admin.oidc-scopes.v1/pages/oidc-scopes")),
            exact: true,
            icon: {
                icon: <UserCircleDotIcon fill="black" className="icon" />
            },
            id: "oidcScopes",
            name: "console:develop.features.sidePanel.oidcScopes",
            order: 11,
            path: AppConstants.getPaths().get("OIDC_SCOPES"),
            protected: true,
            showOnSidePanel: false
        },
        {
            children: [
                {
                    component: lazy(() =>
                        import("@wso2is/admin.organizations.v1/pages/organization-edit")
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
            component: lazy(() => import("@wso2is/admin.organizations.v1/pages/organizations")),
            exact: true,
            icon: {
                icon: <BuildingIcon />
            },
            id: "organizations",
            name: "console:manage.features.sidePanel.organizations",
            order: 12,
            path: AppConstants.getPaths().get("ORGANIZATIONS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            children: [
                {
                    component: lazy(() => {
                        // eslint-disable-next-line max-len
                        return import("@wso2is/admin.organization-discovery.v1/pages/assign-organization-discovery-domains-page");
                    }),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().organization
                    },
                    id: "email-domain-assign",
                    name: "Email Domain Assign",
                    path: AppConstants.getPaths().get("ASSIGN_ORGANIZATION_DISCOVERY_DOMAINS"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() => {
                        // eslint-disable-next-line max-len
                        return import("@wso2is/admin.organization-discovery.v1/pages/edit-organization-discovery-domains-page");
                    }),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().organization
                    },
                    id: "email-domain-edit",
                    name: "Email Domain Edit",
                    path: AppConstants.getPaths().get("UPDATE_ORGANIZATION_DISCOVERY_DOMAINS"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => {
                return import("@wso2is/admin.organization-discovery.v1/pages/" +
                    "organization-discovery-domains-page");
            }),
            exact: true,
            icon: {
                icon: <EnvelopeMagnifyingGlassIcon />
            },
            id: "organizationDiscovery",
            name: "console:manage.features.sidePanel.emailDomainDiscovery",
            order: 12,
            path: AppConstants.getPaths().get("ORGANIZATION_DISCOVERY_DOMAINS"),
            protected: true,
            showOnSidePanel: false
        },
        {
            category: "extensions:develop.sidePanel.categories.branding",
            component: lazy(() => import("@wso2is/admin.branding.v1/pages/branding")),
            exact: true,
            icon: {
                icon: import("@wso2is/admin.extensions.v1/assets/images/icons/" +
                    "paint-palette-and-brush-outline.svg")
            },
            id: "branding",
            name: "extensions:develop.sidePanel.stylesAndText",
            order: 13,
            path: `${ AppConstants.getDeveloperViewBasePath() }/branding`,
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "extensions:develop.sidePanel.categories.branding",
            component: lazy(() =>
                import("@wso2is/admin.email-management.v1/" + "pages/email-customization")
            ),
            exact: true,
            icon: { icon: <EnvelopeIcon fill="black" className="icon" /> },
            id: "emailTemplates",
            name: "Email Templates",
            order: 14,
            path: `${ AppConstants.getDeveloperViewBasePath() }/email-management`,
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "extensions:develop.sidePanel.categories.branding",
            component: lazy(() =>
                import("@wso2is/admin.sms-templates.v1/pages/sms-customization")
            ),
            exact: true,
            featureFlagKey: FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.SMS_TEMPLATES,
            icon: {
                icon: getSidePanelIcons().sms
            },
            id: "smsTemplates",
            name: "smsTemplates:page.header",
            order: 15,
            path: AppConstants.getPaths().get("SMS_MANAGEMENT"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "extensions:develop.sidePanel.categories.branding",
            component: lazy(() =>
                import("@wso2is/admin.email-and-sms.v1/" + "pages/email-and-sms")
            ),
            exact: true,
            icon: { icon: <EnvelopeGearIcon fill="black" className="icon" /> },
            id: "notificationChannels",
            name:  isPushProviderFeatureEnabled ? "Notification Channels" : "Email & SMS",
            order: 16,
            path: isPushProviderFeatureEnabled
                ? AppConstants.getPaths().get("NOTIFICATION_CHANNELS")
                : AppConstants.getPaths().get("EMAIL_AND_SMS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "extensions:develop.sidePanel.categories.branding",
            component: lazy(() =>
                import("@wso2is/admin.email-providers.v1" + "/pages/email-providers")
            ),
            exact: true,
            icon: {
                icon: <EnvelopeGearIcon fill="black" className="icon" />
            },
            id: "emailProviders",
            name: "extensions:develop.sidePanel.emailProvider",
            order: 16,
            path: AppConstants.getPaths().get("EMAIL_PROVIDER"),
            protected: true,
            showOnSidePanel: false
        },
        {
            category: "extensions:develop.sidePanel.categories.smsProvider",
            component: lazy(() =>
                import("@wso2is/admin.sms-providers.v1" + "/pages/sms-providers")
            ),
            exact: true,
            icon: {
                icon: getSidePanelIcons().sms
            },
            id: "smsProviders",
            name: "SMS",
            order: 17,
            path: AppConstants.getPaths().get("SMS_PROVIDER"),
            protected: true,
            showOnSidePanel: false
        },
        {
            category: "extensions:develop.sidePanel.categories.pushProvider",
            component: lazy(() =>
                import("@wso2is/admin.push-providers.v1/pages/push-providers")
            ),
            exact: true,
            icon: {
                icon: getSidePanelIcons().push
            },
            id: "pushProviders",
            name: "Push Notification Provider",
            order: 18,
            path: AppConstants.getPaths().get("PUSH_PROVIDER"),
            protected: true,
            showOnSidePanel: false
        },
        {
            category: "extensions:manage.sidePanel.categories.AccountManagement",
            children: [
                {
                    component: lazy(() =>
                        import(
                            "@wso2is/admin.server-configurations.v1/" +
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
                },
                {
                    component: lazy(() =>
                        import(
                            "@wso2is/admin.server-configurations.v1/" +
                            "pages/connector-edit-page"
                        )
                    ),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "organization-self-service",
                    name: "Organization Self Service",
                    path: AppConstants.getPaths()
                        .get("GOVERNANCE_CONNECTOR_EDIT")
                        .replace(":categoryId", ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID)
                        .replace(":connectorId",
                            ServerConfigurationsConstants.ORGANIZATION_SELF_SERVICE_CONNECTOR_ID),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import(
                            "@wso2is/admin.server-configurations.v1/" +
                            "pages/connector-edit-page"
                        )
                    ),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "user-email-verification",
                    name: "Invite User to Set Password",
                    path: AppConstants.getPaths()
                        .get("GOVERNANCE_CONNECTOR_EDIT")
                        .replace(":categoryId", ServerConfigurationsConstants.USER_ONBOARDING_CONNECTOR_ID)
                        .replace(":connectorId",
                            ServerConfigurationsConstants.ASK_PASSWORD_CONNECTOR_ID),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import(
                            // eslint-disable-next-line max-len
                            "@wso2is/admin.server-configurations.v1/pages/registration-flow-builder/registration-flow-builder-page"
                        )
                    ),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "registrationFlowBuilder",
                    path: AppConstants.getPaths().get("REGISTRATION_FLOW_BUILDER"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() =>
                import(
                    "@wso2is/admin.server-configurations.v1/pages/connector-listing-page"
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
            showOnSidePanel: false
        },
        {
            category: "extensions:manage.sidePanel.categories.AccountManagement",
            children: [
                {
                    component: lazy(() =>
                        import(
                            "@wso2is/admin.server-configurations.v1/pages/connector-edit-page"
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
                },
                {
                    component: lazy(() =>
                        import(
                            "@wso2is/admin.server-configurations.v1/pages/connector-edit-page"
                        )
                    ),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "username-recovery",
                    name: "Username Recovery",
                    path: AppConstants.getPaths()
                        .get("USERNAME_RECOVERY_CONNECTOR_EDIT")
                        .replace(
                            ":type",
                            "username"
                        )
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
                    "@wso2is/admin.server-configurations.v1/pages/connector-listing-page"
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
            showOnSidePanel: false
        },
        {
            category: "extensions:manage.sidePanel.categories.AccountManagement",
            children: [
                {
                    component: lazy(() =>
                        import(
                            "@wso2is/admin.server-configurations.v1/" +
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
                            "@wso2is/admin.server-configurations.v1/pages/connector-edit-page"
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
                        import("@wso2is/admin.validation.v1/pages/validation-config-edit")
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
                }
            ],
            component: lazy(() =>
                import(
                    "@wso2is/admin.server-configurations.v1/pages/connector-listing-page"
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
            showOnSidePanel: false
        },
        {
            category: "extensions:develop.sidePanel.categories.monitor",
            children: [
                {
                    children: [
                        {
                            component: lazy(() =>
                                import("@wso2is/admin.logs.v1/pages/logs-settings-configuration-page")),
                            exact: true,
                            icon: {
                                icon: getSidePanelIcons().childIcon
                            },
                            id: "auditLogsSettings",
                            name: "Audit Logs Settings",
                            path: AppConstants.getPaths().get("LOG_SETTINGS_AUDIT"),
                            protected: true,
                            showOnSidePanel: false
                        },
                        {
                            component: lazy(() =>
                                import("@wso2is/admin.logs.v1/pages/logs-settings-configuration-page")),
                            exact: true,
                            icon: {
                                icon: getSidePanelIcons().childIcon
                            },
                            id: "diagnosticLogsSettings",
                            name: "Diagnostic Logs Settings",
                            path: AppConstants.getPaths().get("LOG_SETTINGS_DIAGNOSTICS"),
                            protected: true,
                            showOnSidePanel: false
                        }
                    ],
                    component: lazy(() => import("@wso2is/admin.logs.v1/pages/logs-settings-page")),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "logSettings",
                    name: "Log Settings",
                    path: AppConstants.getPaths().get("LOG_SETTINGS"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("@wso2is/admin.logs.v1/pages/logs-page")),
            exact: true,
            featureGateIds: [ FeatureGateConstants.SAAS_FEATURES_IDENTIFIER ],
            icon: {
                icon: import("@wso2is/admin.extensions.v1/assets/images/icons/event-publishing.svg")
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
            component: lazy(() => import("@wso2is/admin.org-insights.v1/pages/org-insights")),
            exact: true,
            featureFlagKey: FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.INSIGHTS,
            featureGateIds: [ FeatureGateConstants.SAAS_FEATURES_IDENTIFIER ],
            icon: {
                icon: <LightbulbOnIcon fill="black" className="icon" />
            },
            id: "insights",
            name: "Insights",
            order: 23,
            path: AppConstants.getPaths().get("INSIGHTS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "extensions:manage.sidePanel.categories.monitor",
            component: lazy(() =>
                import(
                    "@wso2is/admin.server-configurations.v1/pages/connector-edit-page"
                )
            ),
            exact: true,
            icon: {
                icon: <LinearNodesIcon fill="black" className="icon" />
            },
            id: "analytics",
            name: "Analytics",
            order: 24,
            path: AppConstants.getPaths().get("ANALYTICS")
                .replace(
                    ":categoryId",
                    ServerConfigurationsConstants.OTHER_SETTINGS_CONNECTOR_CATEGORY_ID
                )
                .replace(
                    ":connectorId",
                    ServerConfigurationsConstants.ANALYTICS_ENGINE_CONNECTOR_ID
                ),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: lazy(() =>
                import(
                    "@wso2is/admin.server-configurations.v1/pages/connector-edit-page"
                )
            ),
            exact: true,
            icon: {
                icon: <LinearNodesIcon fill="black" className="icon" />
            },
            id: "dynamicConnector",
            name: "Dynamic Connector",
            order: 998,
            path: AppConstants.getPaths()
                .get("GOVERNANCE_CONNECTOR_EDIT"),
            protected: true,
            showOnSidePanel: false
        },
        {
            category: "extensions:manage.sidePanel.categories.userManagement",
            component: lazy(() => import("@wso2is/admin.workflow-approvals.v1/pages/approvals")),
            exact: true,
            icon: {
                icon: <DocumentCheckIcon fill="black" className="icon" />
            },
            id: "approvals",
            name: "console:manage.features.sidePanel.approvals",
            order: 26,
            path: AppConstants.getPaths().get("APPROVALS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "extensions:manage.sidePanel.categories.approvalWorkflows",
            children: [
                {
                    component: lazy(() =>
                        import("@wso2is/admin.approval-workflows.v1/pages/approval-workflow-edit-page")
                    ),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "approvalWorkflowEdit",
                    name: "console:manage.features.sidePanel.editApprovalWorkflow",
                    path: AppConstants.getPaths().get("APPROVAL_WORKFLOW_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import(
                            "@wso2is/admin.approval-workflows.v1/pages/" +
                            "approval-workflow-create-page"
                        )
                    ),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "approvalWorkflowCreate",
                    name: "console:manage.features.sidePanel.createApprovalWorkflows",
                    path: AppConstants.getPaths().get("APPROVAL_WORKFLOW_CREATE"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("@wso2is/admin.approval-workflows.v1/pages/approval-workflows")),
            exact: true,
            icon: {
                icon: <DocumentCheckIcon fill="black" className="icon" />
            },
            id: "workflows",
            name: "console:manage.features.sidePanel.approvalWorkflows",
            order: 8,
            path: AppConstants.getPaths().get("APPROVAL_WORKFLOWS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "console:manage.features.sidePanel.categories.legacy",
            component: lazy(() => import("@wso2is/admin.certificates.v1/pages/certificates-keystore")),
            icon: {
                icon: getSidePanelIcons().certificate
            },
            id: "certificates",
            name: "console:manage.features.sidePanel.certificates",
            order: 27,
            path: AppConstants.getPaths().get("CERTIFICATES"),
            protected: true,
            showOnSidePanel: false
        },
        {
            category: "console:manage.features.sidePanel.categories.legacy",
            children: [
                {
                    component: lazy(() => import("@wso2is/admin.secrets.v1/pages/secret-edit")),
                    exact: false,
                    icon: { icon: getSidePanelIcons().childIcon },
                    id: "secretManagementEdit",
                    name: "secrets:routes.sidePanelChildrenNames.0",
                    path: AppConstants.getPaths().get("SECRET_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("@wso2is/admin.secrets.v1/pages/secrets")),
            exact: true,
            icon: { icon: getSidePanelIcons().secrets },
            id: "secretsManagement",
            name: "secrets:routes.name",
            order: 28,
            path: AppConstants.getPaths().get("SECRETS"),
            protected: true,
            showOnSidePanel: false
        },
        {
            children: [
                {
                    component: lazy(() => import("@wso2is/admin.console-settings.v1/pages/" +
                        "console-roles-edit-page")),
                    exact: false,
                    icon: { icon: getSidePanelIcons().childIcon },
                    id: "consoleRolesEdit",
                    name: "Console Roles Edit",
                    path: AppConstants.getPaths().get("CONSOLE_ROLES_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() => {
                        return import("@wso2is/admin.console-settings.v1/pages/" +
                            "console-administrator-edit-page");
                    }),
                    exact: false,
                    icon: { icon: getSidePanelIcons().childIcon },
                    id: "consoleAdministratorsEdit",
                    name: "Console Administrators Edit",
                    path: AppConstants.getPaths().get("CONSOLE_ADMINISTRATORS_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() => import("@wso2is/admin.administrators.v1/pages/administrator-settings")),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "administrator-settings-edit",
                    name: "administrator-settings-edit",
                    path: AppConstants.getPaths().get("ADMINISTRATOR_SETTINGS"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("@wso2is/admin.console-settings.v1/pages/console-settings-page")),
            exact: true,
            icon: {
                icon: <GearIcon fill="black" className="icon" />
            },
            id: "consoleSettings",
            name: "Console Settings",
            order: 29,
            path: AppConstants.getPaths().get("CONSOLE_SETTINGS"),
            protected: true,
            // hide console settings from the side panel until it is onboarded.
            showOnSidePanel: !legacyMode?.applicationListSystemApps
        },
        {
            category: "extensions:manage.sidePanel.categories.userManagement",
            children: [
                {
                    component: lazy(() => import("@wso2is/admin.roles.v2/pages/role-edit")),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "rolesEdit",
                    name: "console:manage.features.sidePanel.editRoles",
                    path: AppConstants.getPaths().get("ROLE_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() => import("@wso2is/admin.roles.v2/pages/create-role-wizard")),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "rolesCreate",
                    name: "console:manage.features.sidePanel.createRole",
                    path: AppConstants.getPaths().get("ROLE_CREATE"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("@wso2is/admin.roles.v2/pages/role")),
            exact: true,
            featureFlagKey: FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.USER_ROLES,
            icon: {
                icon: getSidePanelIcons().applicationRoles
            },
            id: "userRoles",
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
                    component: lazy(() =>
                        import("@wso2is/admin.groups.v1/pages/group-edit")
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
            component: lazy(() => import("@wso2is/admin.groups.v1/pages/groups")),
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
            category: "extensions:manage.sidePanel.categories.extensions",
            children: [
                {
                    component: lazy(() =>
                        import("@wso2is/admin.actions.v1/pages/action-configuration-page")
                    ),
                    exact: true,
                    id: "pre-issue-access-token",
                    name: "Pre Issue Access Token",
                    path: AppConstants.getPaths().get("PRE_ISSUE_ACCESS_TOKEN_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import("@wso2is/admin.actions.v1/pages/action-configuration-page")
                    ),
                    exact: true,
                    id: "pre-update-password",
                    name: "Pre Update Password",
                    path: AppConstants.getPaths().get("PRE_UPDATE_PASSWORD_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import("@wso2is/admin.actions.v1/pages/action-configuration-page")
                    ),
                    exact: true,
                    id: "pre-update-profile",
                    name: "Pre Update Profile",
                    path: AppConstants.getPaths().get("PRE_UPDATE_PROFILE_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() =>
                import("@wso2is/admin.actions.v1/pages/actions")
            ),
            exact: true,
            featureFlagKey: FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.ACTIONS,
            icon: {
                icon: <ProgressFlowIcon className="icon" fill="black" />
            },
            id: "actions",
            name: "pages:actions.title",
            order: 30,
            path: AppConstants.getPaths().get("ACTIONS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "extensions:manage.sidePanel.categories.extensions",
            children: [
                {
                    component: lazy(() =>
                        import("@wso2is/admin.webhooks.v1/pages/webhook-edit-page")
                    ),
                    exact: true,
                    icon: {
                        icon: getSidePanelIcons().childIcon
                    },
                    id: "webhookEdit",
                    name: "Webhook Edit",
                    path: AppConstants.getPaths().get("WEBHOOK_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() =>
                import("@wso2is/admin.webhooks.v1/pages/webhook-list-page")
            ),
            exact: true,
            featureFlagKey: FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.WEBHOOKS,
            icon: {
                icon: <WebhookIcon className="icon" fill="black" />
            },
            id: "webhooks",
            name: "webhooks:sidePanel.name",
            order: 31,
            path: AppConstants.getPaths().get("WEBHOOKS"),
            protected: true,
            showOnSidePanel: true
        },
        // the following routes are not onboarded to the side panel
        {
            category: "console:manage.features.sidePanel.categories.configurations",
            component: lazy(() =>
                import("@wso2is/admin.remote-repository-configuration.v1/pages/remote-repository-config")
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
            component: lazy(() => import("@wso2is/admin.server-configurations.v1/pages/" +
                "governance-connectors")),
            exact: true,
            icon: null,
            id: "governanceConnectors",
            name: "console:manage.features.sidePanel.governanceConnectors",
            order: 999,
            path: AppConstants.getPaths().get("GOVERNANCE_CONNECTORS"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("@wso2is/admin.server-configurations.v1/pages/" +
                "multi-attribute-login-edit")),
            exact: true,
            icon: null,
            id: "multiAttributeLogin",
            name: "governanceConnectors:connectorCategories.accountManagement." +
            "connectors.multiattributeLoginHandler.friendlyName",
            order: 999,
            path: AppConstants.getPaths().get("MULTI_ATTRIBUTE_LOGIN"),
            protected: true,
            showOnSidePanel: false
        }
    ];

    if (isMcpServersFeatureEnabled) {
        defaultRoutes.push(
            {
                category: "console:develop.features.sidePanel.categories.application",
                children: [
                    {
                        component: lazy(() =>
                            import("@wso2is/admin.api-resources.v2/pages/api-resource-edit")
                        ),
                        exact: true,
                        id: "mcpServers-edit",
                        name: "extensions:develop.sidePanel.mcpServers",
                        path: AppConstants.getPaths().get("MCP_SERVER_EDIT"),
                        protected: true,
                        showOnSidePanel: false
                    }
                ],
                component: lazy(() =>
                    import("@wso2is/admin.api-resources.v2/pages/api-resources")
                ),
                exact: true,
                featureFlagKey: FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.MCP_SERVERS,
                icon: {
                    icon: getSidePanelIcons().mcpServers
                },
                id: "mcpServers",
                name: "extensions:develop.sidePanel.mcpServers",
                order: 2,
                path: AppConstants.getPaths().get("MCP_SERVERS"),
                protected: true,
                showOnSidePanel: true
            }
        );
    }


    const routes: RouteInterface[] = values(
        merge(
            keyBy(
                compact([
                    ...defaultRoutes,
                    ...commonConfig.extendedRoutes()
                ]),
                "id"
            )
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
    return [
        {
            children: [
                {
                    component: lazy(() => import("@wso2is/admin.tenants.v1/pages/system-settings-page")),
                    exact: true,
                    icon: null,
                    id: "systemSettings",
                    order: 2,
                    path: AppConstants.getPaths().get("SYSTEM_SETTINGS"),
                    protected: true,
                    showOnSidePanel: true
                },
                {
                    component: lazy(() => import("@wso2is/admin.tenants.v1/pages/edit-tenant-page")),
                    exact: true,
                    icon: null,
                    id: "editRootOrganization",
                    order: 1,
                    path: AppConstants.getPaths().get("EDIT_TENANT"),
                    protected: true,
                    showOnSidePanel: false
                }
            ],
            component: lazy(() => import("@wso2is/admin.tenants.v1/pages/tenants-page")),
            exact: true,
            icon: {
                icon: getSidePanelIcons().administrators
            },
            id: "tenants",
            name: "console:common.sidePanel.tenants",
            order: 1,
            path: AppConstants.getPaths().get("TENANTS"),
            protected: true,
            showOnSidePanel: false
        }
    ];
};

/**
 * Get error page layout routes.
 *
 * @returns
 */
export const getErrorLayoutRoutes = (): RouteInterface[] => {
    return [
        {
            component: lazy(() => import("@wso2is/admin.core.v1/pages/errors/unauthorized")),
            exact: true,
            icon: null,
            id: "unauthorized",
            name: "Unauthorized",
            path: AppConstants.getPaths().get("UNAUTHORIZED"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("@wso2is/admin.core.v1/pages/errors/404")),
            exact: true,
            icon: null,
            id: "pageNotFound",
            name: "404",
            path: AppConstants.getPaths().get("PAGE_NOT_FOUND"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("@wso2is/admin.core.v1/pages/errors/storage-disabled")),
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
            component: lazy(() => import("@wso2is/admin.tenants.v1/pages/create-tenant-page")),
            exact: true,
            icon: null,
            id: "createTenant",
            name: "createTenant",
            path: AppConstants.getPaths().get("CREATE_TENANT"),
            protected: true,
            showOnSidePanel: false
        },
        {
            component: lazy(() => import("@wso2is/admin.authentication.v1/pages/sign-out")),
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
const getLayoutAssignedToRoutes = (routes: RouteInterface[], layout: FunctionComponent): RouteInterface[] => {
    return routes.map((route: RouteInterface) => {
        const modifiedRoute: RouteInterface = {
            ...route,
            component: layout
        };

        if (route.children) {
            modifiedRoute.children = getLayoutAssignedToRoutes(route.children, layout);
        }

        return modifiedRoute;
    });
};

/**
 * Get all the app layout routes.
 *
 * @returns
 */
export const getAppLayoutRoutes = (): RouteInterface[] => {
    return [
        ...getLayoutAssignedToRoutes(getAuthLayoutRoutes(), AuthLayout),
        ...getLayoutAssignedToRoutes(getErrorLayoutRoutes(), ErrorLayout),
        {
            component: FullScreenLayout,
            icon: null,
            id: "full-screen-view",
            name: "Full Screen View",
            path: AppConstants.getFullScreenViewBasePath(),
            protected: false,
            showOnSidePanel: false
        },
        {
            component: DefaultLayout,
            icon: null,
            id: "default",
            name: "Default",
            path: AppConstants.getDefaultLayoutBasePath(),
            protected: false,
            showOnSidePanel: false
        },
        {
            component: DashboardLayout,
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
