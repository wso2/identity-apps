/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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
    UserCircleDotIcon
} from "@oxygen-ui/react-icons";
import { LegacyModeInterface, RouteInterface } from "@wso2is/core/models";
import compact from "lodash-es/compact";
import keyBy from "lodash-es/keyBy";
import merge from "lodash-es/merge";
import values from "lodash-es/values";
import React, { FunctionComponent, lazy } from "react";
import { getSidePanelIcons } from "./ui";
import { commonConfig, identityProviderConfig } from "../../../extensions";
import { FeatureGateConstants } from "../../../extensions/components/feature-gate/constants/feature-gate";
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

export const getAppViewRoutes = (): RouteInterface[] => {

    const legacyMode: LegacyModeInterface = window["AppUtils"]?.getConfig()?.ui?.legacyMode;

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
                        path: AppConstants.getPaths().get("GETTING_STARTED"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        children: [
                            {
                                component: lazy(() => import("../../session-management/pages/session-management")),
                                exact: true,
                                id: "sessionManagement",
                                name: "console:sessionManagement.title",
                                path: AppConstants.getPaths().get("SESSION_MANAGEMENT"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() => import("../../saml2-configuration/pages/saml2-configuration")),
                                exact: true,
                                id: "saml2Configuration",
                                name: "console:saml2Config.title",
                                path: AppConstants.getPaths().get("SAML2_CONFIGURATION"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() => import("../../wsfed-configuration/pages/wsfed-configuration")),
                                exact: true,
                                id: "wsFedConfiguration",
                                name: "console:wsFederationConfig.title",
                                path: AppConstants.getPaths().get("WSFED_CONFIGURATION"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() =>
                                    import(
                                        "../../../features/server-configurations/" +
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
                                        "../../../features/server-configurations/" +
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
                                    import(
                                        "../../../extensions/components/account-login/" +
                                        "pages/username-validation-edit"
                                    )
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
                                    import(
                                        "../../../extensions/components/account-login/" +
                                        "pages/alternative-login-identifier-edit"
                                    )
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
                            }
                        ],
                        component: lazy(() =>
                            import(
                                "../../../features/server-configurations/pages/connector-listing-page"
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
                        order: 2,
                        path: AppConstants.getPaths().get("USERS"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "console:develop.features.sidePanel.categories.application",
                        children: [
                            {
                                component: lazy(() =>
                                    import("../../connections/pages/connection-templates")
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
                                    import("../../connections/pages/connection-edit")
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
                            }
                        ],
                        component: lazy(() => import("../../connections/pages/connections")),
                        exact: true,
                        icon: {
                            icon: <NodesIcon />
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
                        category: "console:develop.features.sidePanel.categories.application",
                        children: [
                            {
                                component: lazy(() =>
                                    import("../../identity-verification-providers/pages/" +
                                    "identity-verification-provider-template")
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "identityVerificationProviderTemplate",
                                name: "Identity Verification Provider Templates",
                                path: AppConstants.getPaths().get("IDVP_TEMPLATES"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() => import(
                                    "../../identity-verification-providers/pages/identity-verification-provider-edit")
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "identityVerificationProvidersEdit",
                                name: "Identity Verification Providers Edit",
                                path: AppConstants.getPaths().get("IDVP_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(
                            () => import("../../identity-verification-providers/pages/identity-verification-providers")
                        ),
                        exact: true,
                        icon: { icon: getSidePanelIcons().identityVerificationProviders },
                        id: "identityVerificationProviders",
                        name: "console:develop.features.sidePanel.categories.identityVerificationProviders",
                        order: 4,
                        path: AppConstants.getPaths().get("IDVP"),
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
                            },
                            {
                                component: lazy(() => import("../../claims/pages/attribute-verification-settings")),
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
                            icon: <BuildingIcon />
                        },
                        id: "organizations",
                        name: "console:manage.features.sidePanel.organizations",
                        order: 12,
                        path: AppConstants.getPaths().get("ORGANIZATIONS"),
                        protected: true,
                        showOnSidePanel: legacyMode?.organizations
                    },
                    {
                        children: [
                            {
                                component: lazy(() => {
                                    // eslint-disable-next-line max-len
                                    return import("../../organization-discovery/pages/assign-organization-discovery-domains-page");
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
                                    return import("../../organization-discovery/pages/edit-organization-discovery-domains-page");
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
                            return import("../../organization-discovery/pages/organization-discovery-domains-page");
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
                        component: lazy(() => import("../../../features/branding/pages/branding")),
                        exact: true,
                        icon: {
                            icon: import("../../../extensions/assets/images/icons/paint-palette-and-brush-outline.svg")
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
                            import("../../../features/email-management/" + "pages/email-customization")
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
                            import("../../../features/email-and-sms/" + "pages/email-and-sms")
                        ),
                        exact: true,
                        icon: { icon: <EnvelopeGearIcon fill="black" className="icon" /> },
                        id: "notificationChannels",
                        name: "Email & SMS",
                        order: 15,
                        path: `${ AppConstants.getDeveloperViewBasePath() }/email-and-sms`,
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:develop.sidePanel.categories.branding",
                        component: lazy(() =>
                            import("../../../features/email-providers" + "/pages/email-providers")
                        ),
                        exact: true,
                        icon: {
                            icon: <EnvelopeGearIcon fill="black" className="icon" />
                        },
                        id: "emailProviders",
                        name: "extensions:develop.sidePanel.emailProvider",
                        order: 15,
                        path: AppConstants.getPaths().get("EMAIL_PROVIDER"),
                        protected: true,
                        showOnSidePanel: false
                    },
                    {
                        category: "extensions:develop.sidePanel.categories.smsProvider",
                        component: lazy(() =>
                            import("../../../features/sms-providers" + "/pages/sms-providers")
                        ),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().sms
                        },
                        id: "smsProviders",
                        name: "SMS",
                        order: 16,
                        path: AppConstants.getPaths().get("SMS_PROVIDER"),
                        protected: true,
                        showOnSidePanel: false
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
                        showOnSidePanel: false
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
                        showOnSidePanel: false
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.AccountManagement",
                        children: [
                            {
                                component: lazy(() =>
                                    import(
                                        "../../../features/server-configurations/" +
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
                                        "../../../features/server-configurations/" +
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
                                        "../../../features/server-configurations/" +
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
                            }
                        ],
                        component: lazy(() =>
                            import(
                                "../../../features/server-configurations/pages/connector-listing-page"
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
                                        "../../../features/server-configurations/pages/connector-edit-page"
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
                                        "../../../features/server-configurations/pages/connector-edit-page"
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
                                "../../../features/server-configurations/pages/connector-listing-page"
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
                                        "../../../features/server-configurations/" +
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
                                        "../../../features/server-configurations/pages/connector-edit-page"
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
                                "../../../features/server-configurations/pages/connector-listing-page"
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
                        component: lazy(() => import("../../org-insights/pages/org-insights")),
                        exact: true,
                        featureGateIds: [ FeatureGateConstants.SAAS_FEATURES_IDENTIFIER ],
                        featureStatus: "BETA",
                        featureStatusLabel: "common:beta",
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
                                "../../../features/server-configurations/pages/connector-edit-page"
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
                                "../../../features/server-configurations/pages/connector-edit-page"
                            )
                        ),
                        exact: true,
                        icon: {
                            icon: <LinearNodesIcon fill="black" className="icon" />
                        },
                        id: "dynamicConnector",
                        name: "Dynamic Connector",
                        order: 24,
                        path: AppConstants.getPaths()
                            .get("GOVERNANCE_CONNECTOR_EDIT"),
                        protected: true,
                        showOnSidePanel: false
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.settings",
                        children: [
                            {
                                component: lazy(() =>
                                    import("../../server/pages/admin-session-advisory-banner-page")
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "admin-session-advisory-banner-edit",
                                name: "Admin Session Advisory Banner",
                                path: AppConstants.getPaths().get("ADMIN_ADVISORY_BANNER_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() =>
                                    import("../../server/pages/remote-logging-page")
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "remote-logging",
                                name: "Remote Logging",
                                path: AppConstants.getPaths().get("REMOTE_LOGGING"),
                                protected: true,
                                showOnSidePanel: false
                            },
                            {
                                component: lazy(() =>
                                    import("../../server/pages/internal-notification-sending-page")
                                ),
                                exact: true,
                                icon: {
                                    icon: getSidePanelIcons().childIcon
                                },
                                id: "internal-notification-sending",
                                name: "Internal Notification Sending",
                                path: AppConstants.getPaths().get("INTERNAL_NOTIFICATION_SENDING"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() =>
                            import(
                                "../../../features/server/pages/server"
                            )
                        ),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().userStore
                        },
                        id: "server",
                        name: "Server",
                        order: 25,
                        path: AppConstants.getPaths().get("SERVER"),
                        protected: true,
                        showOnSidePanel: true
                    },
                    {
                        category: "extensions:manage.sidePanel.categories.userManagement",
                        component: lazy(() => import("../../workflow-approvals/pages/approvals")),
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
                        category: "console:manage.features.sidePanel.categories.legacy",
                        component: lazy(() => import("../../certificates/pages/certificates-keystore")),
                        icon: {
                            icon: getSidePanelIcons().certificate
                        },
                        id: "certificates",
                        name: "console:manage.features.sidePanel.certificates",
                        order: 27,
                        path: AppConstants.getPaths().get("CERTIFICATES"),
                        protected: true,
                        showOnSidePanel: legacyMode?.certificates
                    },
                    {
                        category: "console:manage.features.sidePanel.categories.legacy",
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
                        order: 28,
                        path: AppConstants.getPaths().get("SECRETS"),
                        protected: true,
                        showOnSidePanel: legacyMode?.secretsManagement
                    },
                    {
                        children: [
                            {
                                component: lazy(() => import("../../console-settings/pages/console-roles-edit-page")),
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
                                    return import("../../console-settings/pages/console-administrator-edit-page");
                                }),
                                exact: false,
                                icon: { icon: getSidePanelIcons().childIcon },
                                id: "consoleAdministratorsEdit",
                                name: "Console Administrators Edit",
                                path: AppConstants.getPaths().get("CONSOLE_ADMINISTRATORS_EDIT"),
                                protected: true,
                                showOnSidePanel: false
                            }
                        ],
                        component: lazy(() => import("../../console-settings/pages/console-settings-page")),
                        exact: true,
                        icon: {
                            icon: <GearIcon fill="black" className="icon" />
                        },
                        id: "consoleSettings",
                        name: "Console Settings",
                        order: 29,
                        path: AppConstants.getPaths().get("CONSOLE_SETTINGS"),
                        protected: true,
                        showOnSidePanel: !legacyMode?.applicationListSystemApps
                    },
                    // the following routes are not onboarded to the side panel
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
                    },
                    {
                        component: lazy(() => import("../../server-configurations/pages/multi-attribute-login-edit")),
                        exact: true,
                        icon: null,
                        id: "multiAttributeLogin",
                        name: "console:manage.features.governanceConnectors.connectorCategories.accountManagement." +
                        "connectors.multiattributeLoginHandler.friendlyName",
                        order: 999,
                        path: AppConstants.getPaths().get("MULTI_ATTRIBUTE_LOGIN"),
                        protected: true,
                        showOnSidePanel: false
                    },
                    ...commonConfig.extendedRoutes
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
