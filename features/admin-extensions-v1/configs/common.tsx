/**
 * Copyright (c) 2021-2024, WSO2 LLC. (https://www.wso2.com).
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

import { UserGroupIcon } from "@oxygen-ui/react-icons";
import { LegacyModeInterface, RouteInterface } from "@wso2is/core/models";
import React, { lazy } from "react";
import { CommonConfig } from "./models";
import { getSidePanelIcons } from "../../admin-core-v1/configs/ui";
import { AppConstants } from "../../admin-core-v1/constants";

const legacyMode: LegacyModeInterface = window["AppUtils"]?.getConfig()?.ui?.legacyMode;

const resolvedRoleRoute: RouteInterface = legacyMode?.rolesV1
    ? {
        category: "extensions:manage.sidePanel.categories.userManagement",
        children: [
            {
                component: lazy(() => import("../../admin-roles-v1/pages/role-edit")),
                exact: true,
                icon: {
                    icon: getSidePanelIcons().childIcon
                },
                id: "rolesV1Edit",
                name: "console:manage.features.sidePanel.editRoles",
                path: AppConstants.getPaths().get("ROLE_EDIT"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../../admin-roles-v1/pages/role")),
        exact: true,
        icon: {
            icon: getSidePanelIcons().applicationRoles
        },
        id: "userV1Roles",
        name: "console:manage.features.sidePanel.roles",
        order: 7,
        path: AppConstants.getPaths().get("ROLES"),
        protected: true,
        showOnSidePanel: legacyMode?.rolesV1
    } : {
        category: "extensions:manage.sidePanel.categories.userManagement",
        children: [
            {
                component: lazy(() => import("../../admin-roles-v2/pages/role-edit")),
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
                component: lazy(() => import("../../admin-roles-v2/pages/create-role-wizard")),
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
        component: lazy(() => import("../../admin-roles-v2/pages/role")),
        exact: true,
        icon: {
            icon: getSidePanelIcons().applicationRoles
        },
        id: "userRoles",
        name: "console:manage.features.sidePanel.roles",
        order: 7,
        path: AppConstants.getPaths().get("ROLES"),
        protected: true,
        showOnSidePanel: !legacyMode?.rolesV1
    };

export const commonConfig: CommonConfig = {
    advancedSearchWithBasicFilters: {
        enableQuerySearch: false
    },
    blockLoopBackCalls: false,
    checkCustomLayoutExistanceBeforeEnabling: false,
    enableDefaultBrandingPreviewSection: true,
    enableDefaultPreLoader: true,
    enableOrganizationAssociations: false,
    extendedRoutes: () => [
        {
            category: "console:develop.features.sidePanel.categories.applicatin",
            children: [
                {
                    component: lazy(() =>
                        import("../../admin-api-resources-v1/pages/api-resource-edit")
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
                        import("../../admin-api-resources-v1/pages/api-resources-internal-list")
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
                import("../../admin-api-resources-v1/pages/api-resources")
            ),
            exact: true,
            icon: {
                icon: import("../assets/images/icons/api-resources-icon.svg")
            },
            id: "apiResources",
            name: "extensions:develop.sidePanel.apiResources",
            order: 2,
            path: AppConstants.getPaths().get("API_RESOURCES"),
            protected: true,
            showOnSidePanel: legacyMode?.apiResources
        },
        {
            category: "extensions:manage.sidePanel.categories.userManagement",
            children: [
                {
                    component: lazy(() =>
                        import("../components/administrators/pages/administrator-edit")
                    ),
                    exact: true,
                    icon: {
                        icon: import("../assets/images/icons/admin-icon.svg")
                    },
                    id: "collaborator-user-edit",
                    name: "Collaborator Users Edit",
                    path: AppConstants.getPaths().get("ADMINISTRATOR_EDIT"),
                    protected: true,
                    showOnSidePanel: false
                },
                {
                    component: lazy(() =>
                        import("../components/administrators/pages/administrator-settings")
                    ),
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
            component: lazy(() => import("../components/administrators/pages/administrators")),
            exact: true,
            icon: {
                icon: import("../assets/images/icons/admin-icon.svg")
            },
            id: "administrators",
            name: "Administrators",
            order: 5,
            path: AppConstants.getPaths().get("ADMINISTRATORS"),
            protected: true,
            showOnSidePanel: true
        },
        {
            category: "extensions:manage.sidePanel.categories.userManagement",
            children: [
                {
                    component: lazy(() =>
                        import("../../admin-groups-v1/pages/group-edit")
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
            component: lazy(() => import("../../admin-groups-v1/pages/groups")),
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
                    component: lazy(() => import("../../admin-users-v1tores/pages/user-stores-edit")),
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
                        import("../../admin-users-v1tores/pages/userstores-templates")
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
            component: lazy(() => import("../../admin-users-v1tores/pages/user-stores")),
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
        },
        {
            category: "extensions:manage.sidePanel.categories.userManagement",
            component: lazy(() => import("../../admin-provisioning-v1/pages/outbound-provisioning-settings")),
            exact: true,
            icon: {
                icon: getSidePanelIcons().childIcon
            },
            id: "residentOutboundProvisioning",
            name: "console:develop.features.applications.resident.provisioning.outbound.heading",
            order: 6,
            path: AppConstants.getPaths().get("OUTBOUND_PROVISIONING_SETTINGS"),
            protected: true,
            showOnSidePanel: false
        },
        resolvedRoleRoute
    ],
    footer: {
        customClassName: "console-footer"
    },
    header: {
        headerQuickstartMenuItem: "QUICKSTART",
        renderAppSwitcherAsDropdown: false
    },
    leftNavigation: {
        isLeftNavigationCategorized: {
            develop: false,
            manage: true
        }
    },
    primaryUserstoreOnly: true,
    userEditSection: {
        isGuestUser: true,
        showEmail: true
    }
};
