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

import { ConsumerUsersConstants } from "./components/consumer-users/consumer-users-constants";
import { ExtensionsConfigInterface } from "./models";
import { AppConstants } from "../features/core/constants";

export const ExtensionsConfig = (): ExtensionsConfigInterface => ({
    componentExtensions: [ {
        component: "application",
        panes: [ {
            path: "./components/component-extensions/application/quick-start-tab",
            title: "console:develop.componentExtensions.component.application.quickStart.title"
        } ],
        subComponent: "edit",
        type: "tab"
    } ],
    routes: {
        develop: [
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
                component: "./components/getting-started/getting-started",
                exact: true,
                icon: {
                    icon: import("./assets/images/icons/shuttle-icon.svg")
                },
                id: "getting-started",
                name: "Getting Started",
                order: 1,
                path: `${ AppConstants.getDeveloperViewBasePath() }/getting-started`,
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
                category: "console:manage.features.sidePanel.categories.users",
                children: [
                    {
                        component: "./components/consumer-users/pages/consumer-user-edit",
                        exact: true,
                        icon: {
                            icon: import("./assets/images/icons/user-icon.svg")
                        },
                        id: "consumer-user-edit",
                        name: "Consumer users edit",
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
                name: "Consumer Users",
                order: 5,
                path: ConsumerUsersConstants.getPaths().get("CONSUMER_USERS_PATH"),
                protected: true,
                showOnSidePanel: true
            }
        ]
    },
    sections: {
        components: {
            "feedback-button": "./components/feedback/feedback.tsx"
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
                    id: "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7"
                },
                {
                    enabled: false,
                    id: "df929521-6768-44f5-8586-624126ec3f8b"
                },
                {
                    enabled: false,
                    id: "44a2d9d9-bc0c-4b54-85df-1cf08f4002ec"
                }
            ]
        }
    }
});
