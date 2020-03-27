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
import { StoryCategories } from "../../hierarchy";
import { StoryMetaInterface } from "../../models";

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
        }
    ],
    title: `${ StoryCategories.COMPONENTS }/Side Panel`
};

export const ROUTES: RouteInterface[] = [
    {
        component: null,
        icon: "overview",
        id: "overview",
        name: "Overview",
        path: "/overview",
        protected: true,
        showOnSidePanel: true
    },
    {
        component: null,
        icon: "apps",
        id: "applications",
        name: "Applications",
        path: "/applications",
        protected: true,
        showOnSidePanel: true
    },
    {
        component: null,
        icon: "personal",
        id: "personalInfo",
        name: "Personal Info",
        path: "/personal-info",
        protected: true,
        showOnSidePanel: true
    },
    {
        component: null,
        icon: "security",
        id: "security",
        name: "Security",
        path: "/security",
        protected: true,
        showOnSidePanel: true
    },
    {
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
        component: null,
        icon: "overview",
        id: "overview",
        name: "Overview",
        path: "/overview",
        protected: true,
        showOnSidePanel: true
    },
    {
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
        icon: "apps",
        id: "applications",
        name: "Applications",
        path: "/applications",
        protected: true,
        showOnSidePanel: true
    },
    {
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
        component: null,
        icon: "security",
        id: "security",
        name: "Security",
        path: "/security",
        protected: true,
        showOnSidePanel: true
    },
    {
        component: null,
        icon: "operations",
        id: "operations",
        name: "Operations",
        path: "/operations",
        protected: true,
        showOnSidePanel: true
    }
];
