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

import { ApplicationAccessTypes, ApplicationListInterface } from "../../models";
import {
    ApplicationEditTabContentTypes,
    ApplicationTemplateCategories,
    ApplicationTemplateInterface,
    ApplicationTemplateListInterface,
    ApplicationTemplateMetadataInterface,
    CategorizedApplicationTemplatesInterface
} from "../../models/application-templates";
import { DynamicInputFieldTypes, ValidationRuleTypes } from "../../models/dynamic-fields";

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
        description: "Customer relationship management (CRM) platform that enables businesses to manage their sales"
            + ", marketing, and customer service operations efficiently.",
        displayOrder: 7,
        id: "salesforce",
        image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/salesforce.png",
        name: "Salesforce",
        self: "/api/server/v1/extensions/applications/salesforce",
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
                description: "Customer relationship management (CRM) platform that enables businesses "
                    + "to manage their sales, marketing, and customer service operations efficiently.",
                displayOrder: 7,
                id: "salesforce",
                image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/salesforce.png",
                name: "Salesforce",
                self: "/api/server/v1/extensions/applications/salesforce",
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

export const applicationListMockResponse: ApplicationListInterface = {
    applications: [
        {
            access: ApplicationAccessTypes.WRITE,
            advancedConfigurations: {
                additionalSpProperties: [
                    {
                        displayName: "Is B2B Self Service Application",
                        name: "isB2BSelfServiceApp",
                        value: "false"
                    }
                ],
                attestationMetaData: {
                    enableClientAttestation: false
                },
                discoverableByEndUsers: false,
                enableAPIBasedAuthentication: false,
                enableAuthorization: false,
                fragment: false,
                returnAuthenticatedIdpList: false,
                saas: false,
                skipLoginConsent: false,
                skipLogoutConsent: true
            },
            clientId: "kcn1kuV1yiZbaDofF2Xfg4jUpsUa",
            id: "142fbbc0-69b8-4f3d-a647-adecc9f29804",
            issuer: "",
            name: "Sample salesforce SSO app",
            realm: "",
            self: "/api/server/v1/applications/142fbbc0-69b8-4f3d-a647-adecc9f29804",
            templateId: "salesforce"
        },
        {
            access: ApplicationAccessTypes.WRITE,
            advancedConfigurations: {
                additionalSpProperties: [
                    {
                        displayName: "Is B2B Self Service Application",
                        name: "isB2BSelfServiceApp",
                        value: "false"
                    }
                ],
                attestationMetaData: {
                    enableClientAttestation: false
                },
                discoverableByEndUsers: false,
                enableAPIBasedAuthentication: false,
                enableAuthorization: false,
                fragment: false,
                returnAuthenticatedIdpList: false,
                saas: false,
                skipLoginConsent: true,
                skipLogoutConsent: true
            },
            clientId: "Y4LmFp5bwqvylijALgOCYPGvlTMa",
            id: "c3a3d3ce-4166-416a-963a-94e1c1c8de5f",
            issuer: "",
            name: "SPA",
            realm: "",
            self: "/api/server/v1/applications/c3a3d3ce-4166-416a-963a-94e1c1c8de5f",
            templateId: "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7"
        }
    ],
    count: 2,
    links: [],
    startIndex: 1,
    totalResults: 2
};

export const applicationSearchListMockResponse: ApplicationListInterface = {
    applications: [
        {
            access: ApplicationAccessTypes.WRITE,
            advancedConfigurations: {
                additionalSpProperties: [
                    {
                        displayName: "Is B2B Self Service Application",
                        name: "isB2BSelfServiceApp",
                        value: "false"
                    }
                ],
                attestationMetaData: {
                    enableClientAttestation: false
                },
                discoverableByEndUsers: false,
                enableAPIBasedAuthentication: false,
                enableAuthorization: false,
                fragment: false,
                returnAuthenticatedIdpList: false,
                saas: false,
                skipLoginConsent: false,
                skipLogoutConsent: true
            },
            clientId: "kcn1kuV1yiZbaDofF2Xfg4jUpsUa",
            id: "142fbbc0-69b8-4f3d-a647-adecc9f29804",
            issuer: "",
            name: "Salesforce",
            realm: "",
            self: "/api/server/v1/applications/142fbbc0-69b8-4f3d-a647-adecc9f29804",
            templateId: "salesforce"
        }
    ],
    count: 1,
    links: [],
    startIndex: 1,
    totalResults: 1
};

export const TEMPLATE_NAMES: { [key: string]: string } = {
    salesforce: "Salesforce",
    spa: "Single-Page Application"
};

export const applicationTemplateMockResponse: ApplicationTemplateInterface = {
    category: ApplicationTemplateCategories.SSO_INTEGRATION,
    description: "Salesforce is a customer relationship management (CRM) platform that enables "
        + "businesses to manage their sales, marketing, and customer service operations efficiently.",
    displayOrder: 6,
    id: "salesforce",
    image: "{{CONSOLE_BASE_URL}}/resources/applications/assets/images/illustrations/salesforce.svg",
    name: "Salesforce",
    payload: {
        advancedConfigurations: {
            discoverableByEndUsers: false,
            skipLogoutConsent: true
        },
        authenticationSequence: {
            steps: [
                {
                    id: 1,
                    options: [
                        {
                            authenticator: "basic",
                            idp: "LOCAL"
                        }
                    ]
                }
            ],
            type: "DEFAULT"
        },
        claimConfiguration: {
            dialect: "LOCAL",
            requestedClaims: [
                {
                    claim: {
                        uri: "http://wso2.org/claims/username"
                    },
                    mandatory: false
                }
            ]
        },
        inboundProtocolConfiguration: {
            oidc: {
                accessToken: {
                    applicationAccessTokenExpiryInSeconds: 3600,
                    bindingType: "sso-session",
                    revokeTokensWhenIDPSessionTerminated: true,
                    type: "Default",
                    userAccessTokenExpiryInSeconds: 3600,
                    validateTokenBinding: false
                },
                allowedOrigins: [
                    "https://example.com"
                ],
                callbackURLs: [
                    "https://example.com/login"
                ],
                grantTypes: [
                    "authorization_code",
                    "refresh_token"
                ],
                pkce: {
                    mandatory: true,
                    supportPlainTransformAlgorithm: false
                },
                publicClient: true,
                refreshToken: {
                    expiryInSeconds: 86400,
                    renewRefreshToken: true
                }
            }
        },
        name: "Salesforce",
        templateId: "salesforce"
    },
    tags: [
        "SAML",
        "SSO"
    ],
    type: "applications"
};

export const applicationTemplateMetadataMockResponse: ApplicationTemplateMetadataInterface = {
    create: {
        form: {
            fields: [
                {
                    "aria-label": "Application Name",
                    dataComponentId: "salesforce-create-wizard-application-name",
                    id: "application-name",
                    label: "Name",
                    name: "name",
                    placeholder: "My App",
                    required: true,
                    type: DynamicInputFieldTypes.TEXT,
                    validations: [
                        {
                            type: ValidationRuleTypes.APPLICATION_NAME
                        }
                    ]
                }
            ],
            submitDefinedFieldsOnly: true
        },
        guide: [
            "#### Name\nA unique name to identify your application.\n\nFor example, "
            + "My App\n\n---\n\n#### Authorized Redirect URLs\nThe URL to which the "
            + "authorization code is sent upon authentication and where the user is "
            + "redirected upon logout.\n\nFor example, [https://myapp.io/login](https"
            + "://myapp.io/login)\n\n---\n\n#### Allow sharing with sub-organizations"
            + "\n\nIf enabled, it will share this application with all or any selected "
            + "sub-organizations that belong to your root organization."
        ],
        isApplicationSharable: true
    },
    edit: {
        defaultActiveTabId: "salesforce-settings",
        tabs: [
            {
                contentType: ApplicationEditTabContentTypes.GUIDE,
                displayName: "Quick Start",
                guide: "# Dillinger\n## _The Last Markdown Editor",
                id: "quick-start"
            },
            {
                id: "general"
            },
            {
                displayName: "Application Roles",
                id: "application-roles"
            },
            {
                displayName: "Attributes",
                id: "user-attributes"
            },
            {
                contentType: ApplicationEditTabContentTypes.FORM,
                displayName: "Salesforce Settings",
                form: {
                    fields: [
                        {
                            "aria-label": "Application Name",
                            dataComponentId: "dynamic-application-edit-form-application-name",
                            id: "application-name",
                            label: "Name",
                            name: "name",
                            placeholder: "My App",
                            required: true,
                            type: DynamicInputFieldTypes.TEXT,
                            validations: [
                                {
                                    type: ValidationRuleTypes.APPLICATION_NAME
                                }
                            ]
                        },
                        {
                            "aria-label": "application-description",
                            dataComponentId: "dynamic-application-edit-form-application-description",
                            id: "application-description",
                            label: "Description",
                            name: "description",
                            placeholder: "My App Description",
                            required: false,
                            type: DynamicInputFieldTypes.TEXTAREA
                        }
                    ],
                    submitDefinedFieldsOnly: true
                },
                id: "salesforce-settings"
            }
        ]
    }
};
