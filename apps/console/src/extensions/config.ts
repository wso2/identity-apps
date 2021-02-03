/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

import ApplicationEditPage from "./components/component-extensions/application/application-edit";
import { ConsumerUsersConstants } from "./components/consumer-users/consumer-users-constants";
import { ExtensionsConfigInterface } from "./models";
import { AppConstants, getSidePanelIcons } from "../features/core";

export const ExtensionsConfig = (): ExtensionsConfigInterface => ({
    componentExtensions: [
        {
            component: "application",
            panes: [
                {
                    path: "./components/component-extensions/application/quick-start-tab",
                    show: true,
                    title: "console:develop.componentExtensions.component.application.quickStart.title"
                }
            ],
            subComponent: "edit",
            type: "tab"
        }
    ],
    routes: {
        develop: [
            {
                category: "console:develop.features.sidePanel.categories.application",
                children: [
                    {
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
                        component: ApplicationEditPage,
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
                component: "./components/application-logs/app-log-listing",
                exact: true,
                icon: {
                    icon: import("./assets/images/icons/paper-icon.svg")
                },
                id: "AppLog",
                name: "Application Logs",
                path: `${ AppConstants.getDeveloperViewBasePath() }/application-logs`,
                protected: true,
                showOnSidePanel: false
            },
            {
                category: "console:develop.features.sidePanel.categories.gettingStarted",
                component: "./components/developer-getting-started/getting-started",
                exact: true,
                icon: {
                    icon: import("./assets/images/icons/shuttle-icon.svg")
                },
                id: "developer-getting-started",
                name: "Getting Started",
                order: 0,
                path: `${ AppConstants.getDeveloperViewBasePath() }/getting-started`,
                protected: true,
                showOnSidePanel: true
            },
            {
                category: "console:develop.features.sidePanel.categories.application",
                children: [
                    {
                        component: "./authentication-providers/pages/identity-provider-template",
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
                        component: "./authentication-providers/pages/identity-provider-edit",
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
                component: "./authentication-providers/pages/identity-providers",
                exact: true,
                icon: {
                    icon: getSidePanelIcons().identityProviders
                },
                id: "identityProviders",
                name: "common:identityProviders",
                order: 2,
                path: AppConstants.getPaths().get("IDP"),
                protected: true,
                showOnSidePanel: true
            }
        ],
        fullscreen: [
            {
                component: "./components/tour/tour",
                exact: true,
                icon: null,
                id: "welcome-tour",
                name: "Welcome Tour",
                path: `${ AppConstants.getFullScreenViewBasePath() }/welcome`,
                protected: true,
                showOnSidePanel: false
            }
        ],
        manage: [
            {
                id: "users",
                showOnSidePanel: false
            },
            {
                id: "emailTemplates",
                showOnSidePanel: false
            },
            {
                id: "remoteFetchConfig",
                showOnSidePanel: false
            },
            {
                id: "approvals",
                showOnSidePanel: false
            },
            {
                id: "userStores",
                showOnSidePanel: false
            },
            {
                category: "console:manage.features.sidePanel.categories.configurations",
                id: "certificates",
                order: 9,
                showOnSidePanel: true
            },
            {
                category: "console:develop.features.sidePanel.categories.gettingStarted",
                component: "./components/manage-getting-started/getting-started",
                exact: true,
                icon: {
                    icon: import("./assets/images/icons/shuttle-icon.svg")
                },
                id: "manage-getting-started",
                name: "Getting Started",
                order: 0,
                path: `${ AppConstants.getAdminViewBasePath() }/getting-started`,
                protected: true,
                showOnSidePanel: true
            },
            {
                category: "console:manage.features.sidePanel.categories.users",
                children: [
                    {
                        component: "./components/consumer-users/pages/consumer-user-edit",
                        exact: true,
                        icon: {
                            icon: import("./assets/images/icons/user-icon.svg")
                        },
                        id: "consumer-user-edit",
                        name: "Users Edit",
                        path: ConsumerUsersConstants.getPaths().get("CONSUMER_USERS_EDIT_PATH"),
                        protected: true,
                        showOnSidePanel: false
                    }
                ],
                component: "./components/consumer-users/pages/consumer-users",
                exact: true,
                icon: {
                    icon: import("./assets/images/icons/user-icon.svg")
                },
                id: "consumer-users",
                name: "Business Users",
                order: 1,
                path: ConsumerUsersConstants.getPaths().get("CONSUMER_USERS_PATH"),
                protected: true,
                showOnSidePanel: true
            },
            {
                category: "console:manage.features.sidePanel.categories.users",
                children: [
                    {
                        component: "./components/groups/pages/groups-edit",
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
                component: "./components/groups/pages/groups",
                exact: true,
                icon: {
                    icon: getSidePanelIcons().groups
                },
                id: "groups",
                name: "User Groups",
                order: 2,
                path: AppConstants.getPaths().get("GROUPS"),
                protected: true,
                showOnSidePanel: true
            },
            {
                category: "console:manage.features.sidePanel.categories.users",
                children: [
                    {
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
                exact: true,
                icon: {
                    icon: getSidePanelIcons().roles
                },
                id: "roles",
                name: "Operational Roles",
                order: 4,
                path: AppConstants.getPaths().get("ROLES"),
                protected: true,
                showOnSidePanel: true
            }
        ]
    },
    sections: {
        components: {
            // TODO: Temporarily disable feedback button.
            // "feedback-button": "./components/feedback/feedback.tsx"
        }
    },
    templateExtensions: {
        applications: {
            categories: [],
            groups: [],
            templates: [
                {
                    content: {
                        quickStart: "./application-templates/templates/single-page-application/quick-start.tsx"
                    },
                    enabled: true,
                    id: "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7",
                    resource: "./application-templates/templates/single-page-application/single-page-application.json"
                },
                {
                    content: {
                        quickStart: "./application-templates/templates/oidc-web-application/quick-start.tsx"
                    },
                    enabled: true,
                    id: "b9c5e11e-fc78-484b-9bec-015d247561b8"
                },
                {
                    content: {
                        quickStart: "./application-templates/templates/saml-web-application/quick-start.tsx"
                    },
                    enabled: false,
                    id: "776a73da-fd8e-490b-84ff-93009f8ede85"
                },
                {
                    enabled: false,
                    id: "df929521-6768-44f5-8586-624126ec3f8b"
                },
                {
                    enabled: false,
                    id: "44a2d9d9-bc0c-4b54-85df-1cf08f4002ec"
                },
                {
                    enabled: false,
                    id: "custom-application"
                }
            ]
        },
        identityProviders: {
            categories: [],
            templates: [
                {
                    content: {
                        quickStart: "./identity-provider-templates/templates/google/quick-start.tsx"
                    },
                    enabled: true,
                    id: "8ea23303-49c0-4253-b81f-82c0fe6fb4a0"
                }
            ]
        }
    }
});
