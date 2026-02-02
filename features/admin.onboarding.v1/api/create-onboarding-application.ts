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

import { createApplication } from "@wso2is/admin.applications.v1/api/application";
import M2MTemplate
    from "@wso2is/admin.extensions.v1/application-templates/templates/m2m-application/m2m-application.json";
import MobileTemplate
    from "@wso2is/admin.extensions.v1/application-templates/templates/mobile-application/mobile-application.json";
/* eslint-disable-next-line max-len */
import OIDCWebAppTemplate
    from "@wso2is/admin.extensions.v1/application-templates/templates/oidc-web-application/oidc-web-application.json";
/* eslint-disable-next-line max-len */
import SPATemplate
    from "@wso2is/admin.extensions.v1/application-templates/templates/single-page-application/single-page-application.json";
import { buildAuthSequence } from "./auth-sequence-builder";
import { CreatedApplicationResult, OnboardingData } from "../models";

/**
 * OIDC configuration for application creation.
 */
interface OIDCConfig {
    grantTypes: string[];
    callbackURLs?: string[];
    allowedOrigins?: string[];
    publicClient?: boolean;
    pkce?: {
        mandatory: boolean;
        supportPlainTransformAlgorithm: boolean;
    };
    accessToken?: any;
    refreshToken?: any;
    [key: string]: any;
}

/**
 * Application payload for creation.
 */
interface ApplicationPayload {
    name: string;
    templateId?: string;
    description?: string;
    advancedConfigurations?: any;
    inboundProtocolConfiguration?: {
        oidc?: OIDCConfig;
    };
    authenticationSequence?: ReturnType<typeof buildAuthSequence>;
    claimConfiguration?: any;
    [key: string]: any;
}

/**
 * Template structure from JSON files.
 */
interface ApplicationTemplate {
    id: string;
    templateId: string;
    name: string;
    application: ApplicationPayload;
}

/**
 * Template registry mapping template IDs to their base JSON templates.
 * Framework-specific templates (react-application, angular-application, nextjs-application)
 * use base templates but set their own templateId for proper Console metadata loading.
 */
const TEMPLATE_REGISTRY: Record<string, ApplicationTemplate> = {
    "angular-application": SPATemplate as ApplicationTemplate,
    "m2m-application": M2MTemplate as ApplicationTemplate,
    "mobile-application": MobileTemplate as ApplicationTemplate,
    "nextjs-application": OIDCWebAppTemplate as ApplicationTemplate,
    "oidc-web-application": OIDCWebAppTemplate as ApplicationTemplate,
    "react-application": SPATemplate as ApplicationTemplate,
    "single-page-application": SPATemplate as ApplicationTemplate
};

/**
 * Map framework to template ID.
 * Must match FRAMEWORK_OPTIONS in constants/templates.ts.
 * - React: "react-application" (framework-specific, uses SPA base)
 * - Angular: "angular-application" (framework-specific, uses SPA base)
 * - Next.js: "nextjs-application" (framework-specific, uses OIDC web base)
 * - Express: "oidc-web-application" (traditional web app)
 */
const FRAMEWORK_TO_TEMPLATE: Record<string, string> = {
    angular: "angular-application",
    express: "oidc-web-application",
    next: "nextjs-application",
    react: "react-application"
};

/**
 * MCP Client application grant types.
 * Based on applicationConfig.getAllowedGrantTypes() for mcp-client-application.
 */
const MCP_CLIENT_GRANT_TYPES: string[] = [
    "authorization_code",
    "refresh_token",
    "client_credentials"
];

/**
 * Build MCP client application payload dynamically.
 * MCP client has no JSON template - it's created with specific grant types.
 *
 * @param name - Application name
 * @returns Application payload for MCP client
 */
const buildMCPClientPayload = (name: string): ApplicationPayload => ({
    advancedConfigurations: {
        discoverableByEndUsers: false,
        skipLoginConsent: true,
        skipLogoutConsent: true
    },
    inboundProtocolConfiguration: {
        oidc: {
            grantTypes: MCP_CLIENT_GRANT_TYPES,
            publicClient: false
        }
    },
    name,
    templateId: "mcp-client-application"
});

/**
 * Extract origins from redirect URLs.
 *
 * @param urls - Array of redirect URLs
 * @returns Array of origin URLs
 */
const extractOrigins = (urls: string[]): string[] => {
    const origins: Set<string> = new Set();

    urls.forEach((url: string) => {
        try {
            const urlObj: URL = new URL(url);

            origins.add(urlObj.origin);
        } catch {
            // Invalid URL, skip
        }
    });

    return Array.from(origins);
};

/**
 * Get template based on template ID and framework.
 * Uses the appropriate base template for each framework/type,
 * but sets the framework-specific templateId for proper metadata loading.
 *
 * @param templateId - Template ID from onboarding data
 * @param framework - Framework name
 * @returns Application template, resolved template ID, and whether it's MCP client
 */
const getTemplate = (
    templateId?: string,
    framework?: string
): { template: ApplicationTemplate | null; resolvedTemplateId: string; isMCPClient: boolean } => {
    let resolvedTemplateId: string = templateId || "single-page-application";

    // MCP client is handled separately (no base template)
    if (templateId === "mcp-client-application") {
        return { isMCPClient: true, resolvedTemplateId, template: null };
    }

    // For frameworks, use framework-specific template ID
    if (framework && FRAMEWORK_TO_TEMPLATE[framework]) {
        resolvedTemplateId = FRAMEWORK_TO_TEMPLATE[framework];
    }

    // Get the template from registry (registry already maps framework-specific IDs to base templates)
    const template: ApplicationTemplate = TEMPLATE_REGISTRY[resolvedTemplateId] ||
                                         TEMPLATE_REGISTRY["single-page-application"];

    return { isMCPClient: false, resolvedTemplateId, template };
};

/**
 * Build application payload from onboarding data using local template JSON.
 *
 * @param data - Onboarding data
 * @returns Application payload for API
 */
const buildApplicationPayload = (data: OnboardingData): ApplicationPayload => {
    const { applicationName, templateId, framework, redirectUrls, signInOptions } = data;

    const { template, resolvedTemplateId, isMCPClient } = getTemplate(templateId, framework);
    const isM2M: boolean = resolvedTemplateId === "m2m-application";

    // MCP client is built dynamically (no JSON template)
    if (isMCPClient) {
        return buildMCPClientPayload(applicationName || "My Application");
    }

    if (!template?.application) {
        throw new Error(`Template data not found for: ${templateId || framework}`);
    }

    // Deep clone to avoid mutations
    const payload: ApplicationPayload = JSON.parse(JSON.stringify(template.application));

    // Override with user-provided values
    payload.name = applicationName || "My Application";
    // Use framework-specific template ID (e.g., "react-application") for proper Console loading
    payload.templateId = resolvedTemplateId;

    // Update callback URLs and allowed origins if provided (not for M2M)
    if (!isM2M && redirectUrls && redirectUrls.length > 0 && payload.inboundProtocolConfiguration?.oidc) {
        payload.inboundProtocolConfiguration.oidc.callbackURLs = redirectUrls;
        payload.inboundProtocolConfiguration.oidc.allowedOrigins = extractOrigins(redirectUrls);
    }

    // Override authentication sequence if sign-in options are configured (not for M2M)
    if (!isM2M && signInOptions) {
        payload.authenticationSequence = buildAuthSequence(signInOptions);
    }

    return payload;
};

/**
 * Create an application from onboarding data.
 *
 * @param data - Onboarding data collected during the wizard
 * @returns Created application result
 */
export const createOnboardingApplication = async (
    data: OnboardingData
): Promise<CreatedApplicationResult> => {
    // Build payload using local template JSON
    const payload: ApplicationPayload = buildApplicationPayload(data);

    // Call the existing createApplication API
    const response: any = await createApplication(payload as any);

    // Extract relevant data from response
    const result: CreatedApplicationResult = {
        applicationId: response.data?.id || response.id,
        clientId: response.data?.inboundProtocols?.[0]?.self?.split("/").pop() ||
                  response.inboundProtocolConfiguration?.oidc?.clientId ||
                  "",
        name: data.applicationName || "My Application"
    };

    // For M2M and MCP client apps, include the client secret
    if (data.templateId === "m2m-application" || data.templateId === "mcp-client-application") {
        result.clientSecret = response.data?.inboundProtocolConfiguration?.oidc?.clientSecret ||
                              response.inboundProtocolConfiguration?.oidc?.clientSecret;
    }

    return result;
};

/**
 * Check if the template requires redirect URLs.
 * M2M and MCP client apps don't need redirect URLs.
 *
 * @param templateId - Template ID
 * @returns True if redirect URLs are required
 */
export const requiresRedirectUrls = (templateId?: string): boolean => {
    return templateId !== "m2m-application" && templateId !== "mcp-client-application";
};

/**
 * Check if the template supports sign-in options configuration.
 * M2M and MCP client apps don't need sign-in configuration.
 *
 * @param templateId - Template ID
 * @returns True if sign-in options are supported
 */
export const supportsSignInOptions = (templateId?: string): boolean => {
    return templateId !== "m2m-application" && templateId !== "mcp-client-application";
};
