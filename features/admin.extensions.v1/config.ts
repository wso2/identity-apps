/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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

import { ExtensionsConfigInterface } from "./models";

export const ExtensionsConfig = (): ExtensionsConfigInterface => ({
    sections: {
        components: {
            // TODO: Temporarily disable feedback button.
            // "feedback-button": "./components/feedback/feedback.tsx"
            // TODO: Temporarily use help center in the place of feedback.
            "feedback-button": "./components/help-center/helpCenter.tsx",
            "tenant-dropdown": "./components/tenants/components/dropdown/tenant-dropdown.tsx"
        }
    },
    templateExtensions: {
        applications: {
            categories: [],
            groups: [
                {
                    enabled: true,
                    id: "web-application",
                    resource: "./application-templates/groups/web-application-template-group.json"
                }
            ],
            templates: [
                {
                    content: {
                        quickStart: "./application-templates/templates/single-page-application/quick-start.tsx"
                    },
                    enabled: true,
                    id: "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7",
                    resource: "./application-templates/templates/single-page-application/single-page-application.json"
                },
                {
                    content: {
                        quickStart: "./application-templates/templates/oidc-web-application/quick-start.tsx"
                    },
                    enabled: true,
                    id: "b9c5e11e-fc78-484b-9bec-015d247561b8",
                    resource: "./application-templates/templates/oidc-web-application/oidc-web-application.json"
                },
                {
                    content: {
                        quickStart: "./application-templates/templates/saml-web-application/quick-start.tsx"
                    },
                    enabled: true,
                    id: "776a73da-fd8e-490b-84ff-93009f8ede85",
                    resource: "./application-templates/templates/saml-web-application/saml-web-application.json"
                },
                {
                    enabled: false,
                    id: "df929521-6768-44f5-8586-624126ec3f8b"
                },
                {
                    content: {
                        quickStart: "./application-templates/templates/oidc-web-application/quick-start.tsx"
                    },
                    enabled: true,
                    id: "custom-application"
                },
                {
                    content: {
                        quickStart: "./application-templates/templates/mobile-application/quick-start.tsx"
                    },
                    enabled: true,
                    id: "mobile-application",
                    resource: "./application-templates/templates/mobile-application/mobile-application.json"
                },
                {
                    content: {
                        quickStart: "./application-templates/templates/m2m-application/quick-start.tsx"
                    },
                    enabled: true,
                    id: "m2m-application",
                    resource: "./application-templates/templates/m2m-application/m2m-application.json"
                },
                {
                    enabled: true,
                    id: "choreo-apim-application-oidc",
                    resource: "./application-templates/templates/choreo-apim-application-oidc/" +
                        "choreo-apim-application-oidc.json"
                }
            ]
        },
        identityProviders: {
            categories: [],
            templates: [
                {
                    content: {
                        quickStart: "./identity-provider-templates/templates/google/quick-start.tsx"
                    },
                    enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.google?.enabled ?? true,
                    id: "google-idp",
                    resource: "./identity-provider-templates/templates/google/google.json"
                },
                {
                    content: {
                        quickStart: "./identity-provider-templates/templates/github/quick-start.tsx"
                    },
                    enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.github?.enabled ?? true,
                    id: "github-idp",
                    resource: "./identity-provider-templates/templates/github/github.json"
                },
                {
                    content: {
                        quickStart: "./identity-provider-templates/templates/facebook/quick-start.tsx"
                    },
                    enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.facebook?.enabled ?? true,
                    id: "facebook-idp",
                    resource: "./identity-provider-templates/templates/facebook/facebook.json"
                },
                {
                    content: {},
                    enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.
                        enterpriseOIDC?.enabled ?? true,
                    id: "enterprise-oidc-idp",
                    resource: "./identity-provider-templates/templates/oidc/oidc.json"
                },
                {
                    content: {},
                    enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.
                        enterpriseSAML?.enabled ?? true,
                    id: "enterprise-saml-idp",
                    resource: "./identity-provider-templates/templates/saml/saml.json"
                },
                {
                    content: {
                        quickStart: "./identity-provider-templates/templates/microsoft/quick-start.tsx"
                    },
                    enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.microsoft?.enabled ?? true,
                    id: "microsoft-idp",
                    resource: "./identity-provider-templates/templates/microsoft/microsoft.json"
                },
                {
                    content: {},
                    enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.linkedin?.enabled ?? true,
                    id: "linkedin-idp",
                    resource: "./identity-provider-templates/templates/linkedin/linkedin.json"
                },
                {
                    content: {
                        quickStart: "./identity-provider-templates/templates/apple/quick-start.tsx"
                    },
                    enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.apple?.enabled ?? true,
                    id: "apple-idp",
                    resource: "./identity-provider-templates/templates/apple/apple.json"
                },
                {
                    content: {
                        quickStart: "./identity-provider-templates/templates/hypr/quick-start.tsx"
                    },
                    enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.hypr?.enabled ?? true,
                    id: "hypr-idp",
                    resource: "./identity-provider-templates/templates/hypr/hypr.json"
                },
                {
                    content: {
                        quickStart: "./identity-provider-templates/templates/swe/quick-start.tsx",
                        wizardHelp: "./identity-provider-templates/templates/swe/create-wizard-help.tsx"
                    },
                    enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.swe?.enabled ?? true,
                    id: "swe-idp",
                    resource: "./identity-provider-templates/templates/swe/swe.json"
                },
                {
                    content: {},
                    enabled: window["AppUtils"].getConfig().ui.identityProviderTemplates?.
                        trustedTokenIssuer?.enabled ?? true,
                    id: "trusted-token-issuer",
                    resource: "./identity-provider-templates/templates/trusted-token-issuer/trusted-token-issuer.json"
                }
            ]
        }
    }
});
