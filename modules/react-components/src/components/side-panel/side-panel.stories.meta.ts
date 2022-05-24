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
 *
 */

import { RouteInterface } from "@wso2is/core/models";
import { ReactComponent as AppIcon } from "../../../storybook-helpers/assets/images/icons/app-icon.svg";
import { ReactComponent as ArrowRight } from "../../../storybook-helpers/assets/images/icons/arrow-right-icon.svg";
import { ReactComponent as ControlsIcon } from "../../../storybook-helpers/assets/images/icons/controls-icon.svg";
import { ReactComponent as DashboardIcon } from "../../../storybook-helpers/assets/images/icons/dashboard-icon.svg";
import { ReactComponent as LockIcon } from "../../../storybook-helpers/assets/images/icons/lock-icon.svg";
import { ReactComponent as ToolsIcon } from "../../../storybook-helpers/assets/images/icons/tools-icon.svg";
import { ReactComponent as UserIcon } from "../../../storybook-helpers/assets/images/icons/user-icon.svg";
import { StoryCategories } from "../../storybook-helpers/hierarchy";
import { StoryMetaInterface } from "../../storybook-helpers/models";

export const meta: StoryMetaInterface = {
    components: [ "SidePanel" ],
    description: "Component to side panel navigation.",
    stories: [
        {
            description: "Default side panel view without any child items.",
            title: "Default"
        },
        {
            description: "Side panel view with child items.",
            title: "With child items"
        },
        {
            description: "Side panel view with categories.",
            title: "Categorized"
        }
    ],
    title: `${ StoryCategories.COMPONENTS }/Side Panel`
};

export const ROUTES: RouteInterface[] = [
    {
        category: "Overview",
        component: null,
        icon: "overview",
        id: "overview",
        name: "Overview",
        path: "/overview",
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "Overview",
        component: null,
        featureStatus: "ALPHA",
        icon: "apps",
        id: "applications",
        name: "Applications",
        path: "/applications",
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "Overview",
        component: null,
        icon: "personal",
        id: "personalInfo",
        name: "Personal Info",
        path: "/personal-info",
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "Security",
        component: null,
        featureStatus: "NEW",
        icon: "security",
        id: "security",
        name: "Security",
        path: "/security",
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "Workflows",
        component: null,
        icon: "operations",
        id: "operations",
        name: "Operations",
        path: "/operations",
        protected: true,
        showOnSidePanel: true
    }
];

export const ROUTES_WITH_CHILDREN: RouteInterface[] = [
    {
        category: "General",
        component: null,
        icon: "overview",
        id: "overview",
        name: "Overview",
        path: "/overview",
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "General",
        children: [
            {
                component: null,
                icon: "childIcon",
                id: "applicationView",
                name: "View Applications",
                path: "/applications/view",
                protected: true,
                showOnSidePanel: true
            },
            {
                component: null,
                icon: "childIcon",
                id: "applicationAdd",
                name: "Add Applications",
                path: "/applications/add",
                protected: true,
                showOnSidePanel: true
            }
        ],
        component: null,
        featureStatus: "ALPHA",
        icon: "apps",
        id: "applications",
        name: "Applications",
        path: "/applications",
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "General",
        children: [
            {
                component: null,
                icon: "childIcon",
                id: "basicInfo",
                name: "Basic Info",
                path: "/personal-info/basic",
                protected: true,
                showOnSidePanel: true
            },
            {
                component: null,
                featureStatus: "BETA",
                icon: "childIcon",
                id: "preferences",
                name: "Preferences",
                path: "/personal-info/preferences",
                protected: true,
                showOnSidePanel: true
            },
            {
                component: null,
                icon: "childIcon",
                id: "advanceSettings",
                name: "Advance Settings",
                path: "/personal-info/advance-settings",
                protected: true,
                showOnSidePanel: true
            }
        ],
        component: null,
        icon: "personal",
        id: "personalInfo",
        name: "Personal Info",
        path: "/personal-info",
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "Security",
        component: null,
        featureStatus: "NEW",
        icon: "security",
        id: "security",
        name: "Security",
        path: "/security",
        protected: true,
        showOnSidePanel: true
    },
    {
        category: "Workflows",
        component: null,
        icon: "operations",
        id: "operations",
        name: "Operations",
        path: "/operations",
        protected: true,
        showOnSidePanel: true
    }
];

export const SidePanelIcons = {
    account: ControlsIcon,
    apps: AppIcon,
    childIcon: ArrowRight,
    operations: ToolsIcon,
    overview: DashboardIcon,
    personal: UserIcon,
    security: LockIcon
};
