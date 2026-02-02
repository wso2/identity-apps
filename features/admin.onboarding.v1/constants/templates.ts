/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { ReactComponent as AngularLogo } from "../assets/icons/angular.svg";
import { ReactComponent as ExpressLogo } from "../assets/icons/express.svg";
import { ReactComponent as NextjsLogo } from "../assets/icons/nextjs.svg";
import { ReactComponent as ReactLogo } from "../assets/icons/react.svg";
import { ApplicationType, ApplicationTypeOption, FrameworkOption } from "../models";

/**
 * High-level application type configurations (browser, mobile, machine).
 */
export const APPLICATION_TYPES: readonly {
    iconKey: string;
    titleKey: string;
    type: ApplicationType;
}[] = [
    {
        iconKey: "browser",
        titleKey: "onboarding:selectType.types.browser",
        type: ApplicationType.BROWSER
    },
    {
        iconKey: "mobile",
        titleKey: "onboarding:selectType.types.mobile",
        type: ApplicationType.MOBILE
    },
    {
        iconKey: "machine",
        titleKey: "onboarding:selectType.types.machine",
        type: ApplicationType.MACHINE
    }
] as const;

/**
 * Framework options with logos for template selection.
 * Template IDs must match the extensions API templates.
 * - React: "react-application" (uses SPA base template)
 * - Angular: "angular-application" (uses SPA base template)
 * - Next.js: "nextjs-application" (uses OIDC web base template)
 * - Express: "oidc-web-application" (traditional web app)
 */
export const FRAMEWORK_OPTIONS: readonly FrameworkOption[] = [
    {
        displayName: "React",
        id: "react",
        logo: ReactLogo,
        templateId: "react-application"
    },
    {
        displayName: "Angular",
        id: "angular",
        logo: AngularLogo,
        templateId: "angular-application"
    },
    {
        displayName: "Express",
        id: "express",
        logo: ExpressLogo,
        templateId: "oidc-web-application"
    },
    {
        displayName: "Next.js",
        id: "next",
        logo: NextjsLogo,
        templateId: "nextjs-application"
    }
];

/**
 * Application type options for template selection.
 */
export const APPLICATION_TYPE_OPTIONS: readonly ApplicationTypeOption[] = [
    {
        description: "For AI agents and tools accessing APIs without user sign-in.",
        displayName: "AI / MCP Client",
        id: "mcp-client",
        templateId: "mcp-client-application"
    },
    {
        description: "Native or hybrid mobile apps.",
        displayName: "Mobile app",
        id: "mobile-app",
        templateId: "mobile-application"
    },
    {
        description: "Apps with both server and client side code.",
        displayName: "Server-side web app",
        id: "server-side-web-app",
        templateId: "oidc-web-application"
    },
    {
        description: "Server to server APIs and backend services.",
        displayName: "M2M app",
        id: "m2m-app",
        templateId: "m2m-application"
    },
    {
        description: "Browser based SPAs.",
        displayName: "Single page app",
        id: "single-page-app",
        templateId: "single-page-application"
    }
];
