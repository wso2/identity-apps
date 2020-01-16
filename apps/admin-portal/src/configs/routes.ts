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

import {
    HomePage,
    PageNotFound,
    PrivacyPage,
    UnderConstruction,
    UsersPage
} from "../pages";

/**
 * Interface to handle route types.
 */
interface Route {
    component: any;
    children: any;
    icon?: string;
    name: string;
    path: string;
    protected: boolean;
    showOnSidePanel: boolean;
}

/**
 * Routes array.
 */
const ROUTES: Route[] = [
    {
        children: [],
        component: PrivacyPage,
        icon: "security",
        name: "common:privacy",
        path: "/privacy",
        protected: true,
        showOnSidePanel: false,
    },
    {
        children: [],
        component: HomePage,
        icon: "overview",
        name: "Overview",
        path: "/overview",
        protected: true,
        showOnSidePanel: true,
    },
    {
        children: [
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "sso",
                path: "/sso",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Identity federation",
                path: "/identity-federation",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Adaptive authentication",
                path: "/adaptive-authentication",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "SSO with controlled access",
                path: "/sso-controlled-access",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Delegated access control",
                path: "sso-delegated-access",
                protected: ""
            },
            ],
        component: HomePage,
        icon: "security",
        name: "Applications",
        path: "/applications",
        protected: true,
        showOnSidePanel: true,
    },
    {
        children: [
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "User stores",
                path: "/user-stores",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "sso",
                path: "/sso",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Claims",
                path: "/claims",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "OIDC scopes",
                path: "/oidc-scopes",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Identity Providers",
                path: "/identity-providers",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Outbound provisioning",
                path: "/outbound-provisioning",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "JIT provisioning",
                path: "/jit",
                protected: ""
            }
        ],
        component: HomePage,
        icon: "consent",
        name: "Connections",
        path: "/connections",
        protected: true,
        showOnSidePanel: true,
    },
    {
        children: [
            {
                component: UsersPage,
                icon: "arrowRight",
                level: "",
                name: "Users",
                path: "/users",
                protected: true
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Roles",
                path: "/roles",
                protected: true
            }
        ],
        component: UsersPage,
        icon: "personal",
        name: "Users & Roles",
        path: "/users",
        protected: true,
        showOnSidePanel: true,
    },
    {
        children: [
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "PAP",
                path: "/pap",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "PDP",
                path: "/pdp",
                protected: ""
            }
        ],
        component: HomePage,
        icon: "operations",
        name: "Entitlements",
        path: "/entitlements",
        protected: true,
        showOnSidePanel: true,
    },
    {
        children: [
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Resident IDP",
                path: "/resident-idp",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Resident SP",
                path: "/resident-sp",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Workflow engagements",
                path: "/workflow-engagements",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Workflow definitions",
                path: "/workflow-definitions",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Challenge questions",
                path: "/challenge-questions",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Email templates",
                path: "/email-templates",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Keystore",
                path: "/keystore",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Consent purposes",
                path: "/consent-purposes",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Function libraries",
                path: "/function-libraries",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Workflow engine profiles",
                path: "/workflow-profiles",
                protected: ""
            }
        ],
        component: HomePage,
        icon: "session",
        name: "Manage",
        path: "/manage",
        protected: true,
        showOnSidePanel: true,
    },
    {
        children: [
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "System statistics",
                path: "/system-statistics",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "Workflow requests",
                path: "/workflow-requests",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "SOAP tracer",
                path: "/soap-tracer",
                protected: ""
            }
        ],
        component: HomePage,
        icon: "session",
        name: "Monitor",
        path: "/monitor",
        protected: true,
        showOnSidePanel: true,
    },
    {
        children: [
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "User",
                path: "/user-tool",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "SAML",
                path: "/saml",
                protected: ""
            },
            {
                component: UnderConstruction,
                icon: "arrowRight",
                level: "",
                name: "XACML",
                path: "/xacml",
                protected: ""
            }
        ],
        component: HomePage,
        icon: "session",
        name: "Tools",
        path: "/tools",
        protected: true,
        showOnSidePanel: true,
    },
    {
        children: [],
        component: PageNotFound,
        name: "404",
        path: "*",
        protected: true,
        showOnSidePanel: false,
    },
];

export const routes = ROUTES;
