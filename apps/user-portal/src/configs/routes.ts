/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import appConfig from "../../app.config.json";
import * as ApplicationConstants from "../constants/application-constants";
import * as TokenConstants from "../constants/token-constants";
import {
    AccountSecurityPage,
    ApplicationsPage,
    LoginErrorPage,
    OperationsPage,
    OverviewPage,
    PageNotFound,
    PersonalInfoPage,
    PrivacyPage
} from "../pages";
import { checkEnabled, getRouteName } from "../utils/filter-utils";

/**
 * Interface to handle route types.
 */
export interface Route {
    component: any;
    icon?: string;
    name: string;
    path: string;
    protected: boolean;
    scope?: string;
    showOnSidePanel: boolean;
}

/**
 * Routes array.
 */
const ROUTES: Route[] = [
    {
        component: OverviewPage,
        icon: "overview",
        name: "common:overview",
        path: "/overview",
        protected: true,
        showOnSidePanel: true,
    },
    {
        component: ApplicationsPage,
        icon: "apps",
        name: "common:applications",
        path: ApplicationConstants.APPLICATIONS_PAGE_PATH,
        protected: true,
        showOnSidePanel: true,
    },
    {
        component: PersonalInfoPage,
        icon: "personal",
        name: "common:personalInfo",
        path: "/personal-info",
        protected: true,
        showOnSidePanel: true,
    },
    {
        component: AccountSecurityPage,
        icon: "security",
        name: "common:security",
        path: "/security",
        protected: true,
        showOnSidePanel: true,
    },
    {
        component: OperationsPage,
        icon: "operations",
        name: "common:operations",
        path: "/operations",
        protected: true,
        scope: TokenConstants.HUMAN_TASK_SCOPE,
        showOnSidePanel: true,
    },
    {
        component: PrivacyPage,
        icon: "security",
        name: "common:privacy",
        path: "/privacy",
        protected: true,
        showOnSidePanel: false,
    },
    {
        component: LoginErrorPage,
        name: "Login error",
        path: ApplicationConstants.LOGIN_ERROR_PAGE_PATH,
        protected: true,
        showOnSidePanel: false,
    },
    {
        component: PageNotFound,
        name: "404",
        path: "*",
        protected: true,
        showOnSidePanel: false,
    },
];

const filteredRoutes: Route[] = ROUTES.filter((route: Route) => {
    const routeName = getRouteName(route.name);
    return checkEnabled(appConfig, routeName);
});

export const routes = filteredRoutes;
