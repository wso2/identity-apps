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

import { getSidePanelIcons } from "@wso2is/admin.core.v1/configs/ui";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
import { RemoteUserStoreConstants } from "@wso2is/admin.remote-userstores.v1/constants/remote-user-stores-constants";
import { RouteInterface } from "@wso2is/core/models";
import { lazy } from "react";
import { CommonConfig } from "./models";
import { userstoresConfig } from "./userstores";
import FeatureFlagConstants from "../../admin.feature-gate.v1/constants/feature-flag-constants";

export const commonConfig: CommonConfig = {
    advancedSearchWithBasicFilters: {
        enableQuerySearch: false
    },
    blockLoopBackCalls: false,
    checkCustomLayoutExistanceBeforeEnabling: false,
    enableDefaultBrandingPreviewSection: true,
    enableDefaultPreLoader: true,
    enableOrganizationAssociations: false,
    extendedRoutes: () => {
        const routes: RouteInterface[] = [
            {
                category: "extensions:manage.sidePanel.categories.userManagement",
                children: [
                    {
                        component: lazy(() => import("@wso2is/admin.userstores.v1/pages/user-stores-edit")),
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
                            import("@wso2is/admin.userstores.v1/pages/userstores-templates")
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
                    },
                    {
                        component: lazy(() =>
                            import("@wso2is/admin.remote-userstores.v1/pages/remote-user-store-create-page")
                        ),
                        icon: {
                            icon: getSidePanelIcons().childIcon
                        },
                        id: "remote-user-store-create",
                        path: RemoteUserStoreConstants.getPaths().get("REMOTE_USER_STORE_CREATE"),
                        protected: true,
                        showOnSidePanel: false
                    },
                    {
                        component: lazy(() =>
                            import("@wso2is/admin.remote-userstores.v1/pages/remote-user-store-edit-page")
                        ),
                        exact: true,
                        icon: {
                            icon: getSidePanelIcons().childIcon
                        },
                        id: "remote-edit-user-store",
                        path: AppConstants.getPaths()
                            .get("USERSTORES_EDIT")
                            .replace("edit-user-store", userstoresConfig.userstoreEdit.remoteUserStoreEditPath),
                        protected: true,
                        showOnSidePanel: false
                    }
                ],
                component: lazy(() => import("@wso2is/admin.userstores.v1/pages/user-stores")),
                exact: true,
                featureFlagKey: FeatureFlagConstants.FEATURE_FLAG_KEY_MAP.USER_STORES,
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
                component: lazy(() => import("@wso2is/admin.provisioning.v1/pages/outbound-provisioning-settings")),
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
            }
        ];

        return routes;
    },
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
