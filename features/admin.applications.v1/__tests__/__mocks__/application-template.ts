/**
* Copyright (c) 2024, WSO2 Inc. (http://www.wso2.com) All Rights Reserved.
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

import { ApplicationTemplateCategories, ApplicationTemplateListInterface, CategorizedApplicationTemplatesInterface } from "../../models/application-templates";

export const applicationTemplatesListMockResponse: ApplicationTemplateListInterface[] = [
    {
        id: "single-page-application",
        name: "Single-Page Application",
        description: "A web application that runs application logic in the browser.",
        image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/spa-template.svg",
        displayOrder: 0,
        tags: [
            "Default",
            "OIDC"
        ],
        customAttributes: [
            {
                "value": "[{\"displayName\":\"React\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/react-logo.svg\"},{\"displayName\":\"Angular\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/angular-logo.svg\"},{\"displayName\":\"Vue\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/vue-logo.svg\"},{\"displayName\":\"Javascript\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/javascript-logo.svg\"}]",
                "key": "supportedTechnologies"
            }
        ],
        category: ApplicationTemplateCategories.DEFAULT,
        type: "applications",
        self: "/api/server/v1/extensions/applications/single-page-application"
    },
    {
        id: "traditional-web-application",
        name: "Traditional Web Application",
        description: "A web application that runs application logic on the server.",
        image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/traditional-template.svg",
        displayOrder: 1,
        tags: [
            "Default",
            "OIDC",
            "SAML"
        ],
        customAttributes: [
            {
                "value": "[{\"displayName\":\"Java EE\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/java-logo.svg\"},{\"displayName\":\".NET\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/dotnet-logo.svg\"},{\"displayName\":\"Node.js\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/nodejs-logo.svg\"},{\"displayName\":\"PHP\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/php-logo.svg\"}]",
                "key": "supportedTechnologies"
            }
        ],
        category: ApplicationTemplateCategories.DEFAULT,
        type: "applications",
        self: "/api/server/v1/extensions/applications/traditional-web-application"
    },
    {
        id: "custom-application",
        name: "Standard-Based Application",
        description: "Applications built using standard protocols.",
        image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/standard-based-template.svg",
        displayOrder: 3,
        tags: [
            "Default",
            "OIDC",
            "SAML",
            "WS-Federation"
        ],
        customAttributes: [
            {
                "value": "[{\"displayName\":\"OIDC\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/openid-connect.png\"},{\"displayName\":\"SAML\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/saml.png\"},{\"displayName\":\"WS-Federation\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/ws-fed.png\"}]",
                "key": "supportedTechnologies"
            }
        ],
        category: ApplicationTemplateCategories.DEFAULT,
        type: "applications",
        self: "/api/server/v1/extensions/applications/custom-application"
    },
    {
        id: "google-workspace",
        name: "Google Workspace",
        description: "A suite of cloud-based tools like Gmail, Google Drive, and Docs, offering one platform for email, storage, document editing, and communication.",
        image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/google-workspace.png",
        displayOrder: 6,
        tags: [
            "SAML",
            "SSO"
        ],
        customAttributes: [
            {
                "value": "false",
                "key": "comingSoon"
            }
        ],
        category: ApplicationTemplateCategories.SSO_INTEGRATION,
        type: "applications",
        self: "/api/server/v1/extensions/applications/google-workspace"
    }
];

export const categorizedApplicationTemplatesListMockResponse: CategorizedApplicationTemplatesInterface[] = [
    {
        description: "applications:templates.categories.default.description",
        displayName: "applications:templates.categories.default.displayName",
        displayOrder: 0,
        id: ApplicationTemplateCategories.DEFAULT,
        templates: [
            {
                id: "single-page-application",
                name: "Single-Page Application",
                description: "A web application that runs application logic in the browser.",
                image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/spa-template.svg",
                displayOrder: 0,
                tags: [
                    "Default",
                    "OIDC"
                ],
                customAttributes: [
                    {
                        "value": "[{\"displayName\":\"React\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/react-logo.svg\"},{\"displayName\":\"Angular\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/angular-logo.svg\"},{\"displayName\":\"Vue\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/vue-logo.svg\"},{\"displayName\":\"Javascript\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/javascript-logo.svg\"}]",
                        "key": "supportedTechnologies"
                    }
                ],
                category: ApplicationTemplateCategories.DEFAULT,
                type: "applications",
                self: "/api/server/v1/extensions/applications/single-page-application"
            },
            {
                id: "traditional-web-application",
                name: "Traditional Web Application",
                description: "A web application that runs application logic on the server.",
                image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/traditional-template.svg",
                displayOrder: 1,
                tags: [
                    "Default",
                    "OIDC",
                    "SAML"
                ],
                customAttributes: [
                    {
                        "value": "[{\"displayName\":\"Java EE\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/java-logo.svg\"},{\"displayName\":\".NET\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/dotnet-logo.svg\"},{\"displayName\":\"Node.js\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/nodejs-logo.svg\"},{\"displayName\":\"PHP\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/php-logo.svg\"}]",
                        "key": "supportedTechnologies"
                    }
                ],
                category: ApplicationTemplateCategories.DEFAULT,
                type: "applications",
                self: "/api/server/v1/extensions/applications/traditional-web-application"
            },
            {
                id: "custom-application",
                name: "Standard-Based Application",
                description: "Applications built using standard protocols.",
                image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/standard-based-template.svg",
                displayOrder: 3,
                tags: [
                    "Default",
                    "OIDC",
                    "SAML",
                    "WS-Federation"
                ],
                customAttributes: [
                    {
                        "value": "[{\"displayName\":\"OIDC\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/openid-connect.png\"},{\"displayName\":\"SAML\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/saml.png\"},{\"displayName\":\"WS-Federation\",\"logo\":\"{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/ws-fed.png\"}]",
                        "key": "supportedTechnologies"
                    }
                ],
                category: ApplicationTemplateCategories.DEFAULT,
                type: "applications",
                self: "/api/server/v1/extensions/applications/custom-application"
            }
        ]
    },
    {
        description: "applications:templates.categories.ssoIntegration.description",
        displayName: "applications:templates.categories.ssoIntegration.displayName",
        displayOrder: 1,
        id: ApplicationTemplateCategories.SSO_INTEGRATION,
        templates: [
            {
                id: "google-workspace",
                name: "Google Workspace",
                description: "A suite of cloud-based tools like Gmail, Google Drive, and Docs, offering one platform for email, storage, document editing, and communication.",
                image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/google-workspace.png",
                displayOrder: 6,
                tags: [
                    "SAML",
                    "SSO"
                ],
                customAttributes: [
                    {
                        "value": "false",
                        "key": "comingSoon"
                    }
                ],
                category: ApplicationTemplateCategories.SSO_INTEGRATION,
                type: "applications",
                self: "/api/server/v1/extensions/applications/google-workspace"
            }
        ]
    },
    {
        description: "applications:templates.categories.other.description",
        displayName: "applications:templates.categories.other.displayName",
        displayOrder: Infinity,
        id: "OTHER",
        templates: []
    }
]
