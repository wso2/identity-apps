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
import { lazy } from "react";
import { SidePanelIcons } from "./ui";
import { RoutingConstants } from "../constants";

/**
 * Email Templates Management feature Routes array.
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
export const EMAIL_TEMPLATES_FEATURE_ROUTES: RouteInterface[] = [
    {
        category: "adminPortal:components.sidePanel.categories.configurations",
        children: [
            {
                component: lazy(() => import("../pages/email-templates")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "emailTemplates",
                name: "adminPortal:components.sidePanel.emailTemplates",
                path: RoutingConstants.PATHS.get("EMAIL_TEMPLATE"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: lazy(() => import("../pages/email-locale-add")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "emailTemplates",
                name: "adminPortal:components.sidePanel.addEmailTemplate",
                path: RoutingConstants.PATHS.get("EMAIL_TEMPLATE_ADD"),
                protected: true,
                showOnSidePanel: false
            },
            {
                component: lazy(() => import("../pages/email-locale-add")),
                exact: true,
                icon: {
                    icon: SidePanelIcons.childIcon
                },
                id: "emailTemplates",
                name: "adminPortal:components.sidePanel.addEmailTemplateLocale",
                path: RoutingConstants.PATHS.get("EMAIL_TEMPLATE_LOCALE_ADD"),
                protected: true,
                showOnSidePanel: false
            }
        ],
        component: lazy(() => import("../pages/email-template-types")),
        exact: true,
        icon: {
            icon: SidePanelIcons.emailTemplates
        },
        id: "emailTemplates",
        name: "adminPortal:components.sidePanel.emailTemplates",
        order: 6,
        path: RoutingConstants.PATHS.get("EMAIL_TEMPLATES"),
        protected: true,
        showOnSidePanel: true
    }
];
