/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import {
    ApplicationTemplateCategories,
    ApplicationTemplateListInterface,
    CategorizedApplicationTemplatesInterface
} from "../../models/application-templates";

export const applicationTemplatesListMockResponse: ApplicationTemplateListInterface[] = [
    {
        category: ApplicationTemplateCategories.DEFAULT,
        customAttributes: [
            {
                key: "supportedTechnologies",
                value: [
                    {
                        displayName: "React",
                        logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/react-logo.svg"
                    },
                    {
                        displayName: "Angular",
                        logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/angular-logo.svg"
                    },
                    {
                        displayName: "Vue",
                        logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/vue-logo.svg"
                    },
                    {
                        displayName: "Javascript",
                        logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/"
                            + "javascript-logo.svg"
                    }
                ]
            }
        ],
        description: "A web application that runs application logic in the browser.",
        displayOrder: 0,
        id: "single-page-application",
        image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/spa-template.svg",
        name: "Single-Page Application",
        self: "/api/server/v1/extensions/applications/single-page-application",
        tags: [
            "Default",
            "OIDC"
        ],
        type: "applications"
    },
    {
        category: ApplicationTemplateCategories.DEFAULT,
        customAttributes: [
            {
                key: "supportedTechnologies",
                value: [
                    {
                        displayName: "Java EE",
                        logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/java-logo.svg"
                    },
                    {
                        displayName: ".NET",
                        logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/dotnet-logo.svg"
                    },
                    {
                        displayName: "Node.js",
                        logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/nodejs-logo.svg"
                    },
                    {
                        displayName: "PHP",
                        logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/php-logo.svg"
                    }
                ]
            }
        ],
        description: "A web application that runs application logic on the server.",
        displayOrder: 1,
        id: "traditional-web-application",
        image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/traditional-template.svg",
        name: "Traditional Web Application",
        self: "/api/server/v1/extensions/applications/traditional-web-application",
        tags: [
            "Default",
            "OIDC",
            "SAML"
        ],
        type: "applications"
    },
    {
        category: ApplicationTemplateCategories.DEFAULT,
        customAttributes: [
            {
                key: "supportedTechnologies",
                value: [
                    {
                        displayName: "OIDC",
                        logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/"
                            + "openid-connect.png"
                    },
                    {
                        displayName: "SAML",
                        logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/saml.png"
                    },
                    {
                        displayName: "WS-Federation",
                        logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/ws-fed.png"
                    }
                ]
            }
        ],
        description: "Applications built using standard protocols.",
        displayOrder: 3,
        id: "custom-application",
        image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/standard-based-template.svg",
        name: "Standard-Based Application",
        self: "/api/server/v1/extensions/applications/custom-application",
        tags: [
            "Default",
            "OIDC",
            "SAML",
            "WS-Federation"
        ],
        type: "applications"
    },
    {
        category: ApplicationTemplateCategories.SSO_INTEGRATION,
        customAttributes: [
            {
                key: "comingSoon",
                value: "false"
            }
        ],
        description: "A suite of cloud-based tools like Gmail, Google Drive, and Docs, offering"
            + " one platform for email, storage, document editing, and communication.",
        displayOrder: 6,
        id: "google-workspace",
        image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/google-workspace.png",
        name: "Google Workspace",
        self: "/api/server/v1/extensions/applications/google-workspace",
        tags: [
            "SAML",
            "SSO"
        ],
        type: "applications"
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
                category: ApplicationTemplateCategories.DEFAULT,
                customAttributes: [
                    {
                        key: "supportedTechnologies",
                        value: [
                            {
                                displayName: "React",
                                logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/"
                                    + "technologies/react-logo.svg"
                            },
                            {
                                displayName: "Angular",
                                logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/"
                                    + "technologies/angular-logo.svg"
                            },
                            {
                                displayName: "Vue",
                                logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/"
                                    + "technologies/vue-logo.svg"
                            },
                            {
                                displayName: "Javascript",
                                logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/"
                                    + "javascript-logo.svg"
                            }
                        ]
                    }
                ],
                description: "A web application that runs application logic in the browser.",
                displayOrder: 0,
                id: "single-page-application",
                image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/spa-template.svg",
                name: "Single-Page Application",
                self: "/api/server/v1/extensions/applications/single-page-application",
                tags: [
                    "Default",
                    "OIDC"
                ],
                type: "applications"
            },
            {
                category: ApplicationTemplateCategories.DEFAULT,
                customAttributes: [
                    {
                        key: "supportedTechnologies",
                        value: [
                            {
                                displayName: "Java EE",
                                logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/"
                                    + "technologies/java-logo.svg"
                            },
                            {
                                displayName: ".NET",
                                logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/"
                                    + "technologies/dotnet-logo.svg"
                            },
                            {
                                displayName: "Node.js",
                                logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/"
                                    + "technologies/nodejs-logo.svg"
                            },
                            {
                                displayName: "PHP",
                                logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/"
                                    + "technologies/php-logo.svg"
                            }
                        ]
                    }
                ],
                description: "A web application that runs application logic on the server.",
                displayOrder: 1,
                id: "traditional-web-application",
                image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/"
                    + "illustrations/traditional-template.svg",
                name: "Traditional Web Application",
                self: "/api/server/v1/extensions/applications/traditional-web-application",
                tags: [
                    "Default",
                    "OIDC",
                    "SAML"
                ],
                type: "applications"
            },
            {
                category: ApplicationTemplateCategories.DEFAULT,
                customAttributes: [
                    {
                        key: "supportedTechnologies",
                        value: [
                            {
                                displayName: "OIDC",
                                logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/"
                                    + "openid-connect.png"
                            },
                            {
                                displayName: "SAML",
                                logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/technologies/saml.png"
                            },
                            {
                                displayName: "WS-Federation",
                                logo: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/"
                                    + "technologies/ws-fed.png"
                            }
                        ]
                    }
                ],
                description: "Applications built using standard protocols.",
                displayOrder: 3,
                id: "custom-application",
                image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/"
                    + "illustrations/standard-based-template.svg",
                name: "Standard-Based Application",
                self: "/api/server/v1/extensions/applications/custom-application",
                tags: [
                    "Default",
                    "OIDC",
                    "SAML",
                    "WS-Federation"
                ],
                type: "applications"
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
                category: ApplicationTemplateCategories.SSO_INTEGRATION,
                customAttributes: [
                    {
                        key: "comingSoon",
                        value: "false"
                    }
                ],
                description: "A suite of cloud-based tools like Gmail, Google Drive, and Docs, offering"
                    + " one platform for email, storage, document editing, and communication.",
                displayOrder: 6,
                id: "google-workspace",
                image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/google-workspace.png",
                name: "Google Workspace",
                self: "/api/server/v1/extensions/applications/google-workspace",
                tags: [
                    "SAML",
                    "SSO"
                ],
                type: "applications"
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
];
