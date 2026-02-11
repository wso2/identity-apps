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
import OIDCWebAppTemplate
    from "@wso2is/admin.extensions.v1/application-templates/templates/oidc-web-application/oidc-web-application.json";
/* eslint-disable-next-line max-len */
import SPATemplate from "@wso2is/admin.extensions.v1/application-templates/templates/single-page-application/single-page-application.json";
import { buildAuthSequence } from "./auth-sequence-builder";
import { CreatedApplicationResultInterface, OnboardingDataInterface } from "../models";
import { extractOrigins } from "../utils/url-utils";

/**
 * OIDC configuration for application creation.
 */
interface OIDCConfigInterface {
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
interface ApplicationPayloadInterface {
    name: string;
    templateId?: string;
    description?: string;
    advancedConfigurations?: any;
    associatedRoles?: {
        allowedAudience: string;
        roles: any[];
    };
    inboundProtocolConfiguration?: {
        oidc?: OIDCConfigInterface;
    };
    authenticationSequence?: ReturnType<typeof buildAuthSequence>;
    claimConfiguration?: any;
    [key: string]: any;
}

/**
 * Template structure from JSON files.
 */
interface ApplicationTemplateInterface {
    id: string;
    templateId: string;
    name: string;
    application: ApplicationPayloadInterface;
}

/**
 * Template registry mapping template IDs to their base JSON templates.
 * Framework-specific templates (react-application, angular-application, nextjs-application, expressjs-application)
 * use base templates but set their own templateId for proper Console metadata loading.
 */
const TEMPLATE_REGISTRY: Record<string, ApplicationTemplateInterface> = {
    "angular-application": SPATemplate as ApplicationTemplateInterface,
    "expressjs-application": OIDCWebAppTemplate as ApplicationTemplateInterface,
    "m2m-application": M2MTemplate as ApplicationTemplateInterface,
    "mobile-application": MobileTemplate as ApplicationTemplateInterface,
    "nextjs-application": OIDCWebAppTemplate as ApplicationTemplateInterface,
    "oidc-web-application": OIDCWebAppTemplate as ApplicationTemplateInterface,
    "react-application": SPATemplate as ApplicationTemplateInterface,
    "single-page-application": SPATemplate as ApplicationTemplateInterface
};

/**
 * Map framework to template ID.
 * Must match FRAMEWORK_OPTIONS in constants/templates.ts.
 */
const FRAMEWORK_TO_TEMPLATE: Record<string, string> = {
    angular: "angular-application",
    express: "expressjs-application",
    next: "nextjs-application",
    react: "react-application"
};

/**
 * Template UUID mapping for generic templates.
 * Only generic templates (not framework-specific) need UUID mapping.
 * Framework-specific templates like "react-application", "angular-application"
 * should use their string IDs directly.
 *
 * Reference: features/admin.core.v1/constants/shared/application-management.ts
 */
const TEMPLATE_UUID_MAP: Record<string, string> = {
    "oidc-web-application": "b9c5e11e-fc78-484b-9bec-015d247561b8",
    "single-page-application": "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7"
};

/**
 * MCP Client application grant types.
 */
const MCP_CLIENT_GRANT_TYPES: string[] = [
    "authorization_code",
    "refresh_token",
    "client_credentials"
];

/**
 * M2M application grant types.
 */
const M2M_GRANT_TYPES: string[] = [
    "client_credentials"
];

/**
 * Build MCP client application payload dynamically.
 *
 * @param name - Application name
 * @returns Application payload for MCP client
 */
const buildMCPClientPayload = (name: string): ApplicationPayloadInterface => ({
    advancedConfigurations: {
        discoverableByEndUsers: false,
        skipLoginConsent: true,
        skipLogoutConsent: true
    },
    inboundProtocolConfiguration: {
        oidc: {
            allowedOrigins: [],
            callbackURLs: [],
            grantTypes: MCP_CLIENT_GRANT_TYPES,
            publicClient: false
        }
    },
    name,
    templateId: "mcp-client-application"
});

/**
 * Build M2M application payload dynamically.
 * M2M template has "application": null, so it must be built dynamically.
 *
 * @param name - Application name
 * @returns Application payload for M2M
 */
const buildM2MPayload = (name: string): ApplicationPayloadInterface => ({
    associatedRoles: {
        allowedAudience: "APPLICATION",
        roles: []
    },
    inboundProtocolConfiguration: {
        oidc: {
            grantTypes: M2M_GRANT_TYPES,
            publicClient: false
        }
    },
    name,
    templateId: "m2m-application"
});

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
): { template: ApplicationTemplateInterface | null; resolvedTemplateId: string; isMCPClient: boolean } => {
    let resolvedTemplateId: string = templateId || "single-page-application";

    if (templateId === "mcp-client-application") {
        return { isMCPClient: true, resolvedTemplateId, template: null };
    }

    if (framework && FRAMEWORK_TO_TEMPLATE[framework]) {
        resolvedTemplateId = FRAMEWORK_TO_TEMPLATE[framework];
    }

    const template: ApplicationTemplateInterface = TEMPLATE_REGISTRY[resolvedTemplateId] ||
                                         TEMPLATE_REGISTRY["single-page-application"];

    return { isMCPClient: false, resolvedTemplateId, template };
};

/**
 * Build application payload from onboarding data using local template JSON.
 *
 * @param data - Onboarding data
 * @returns Application payload for API
 */
const buildApplicationPayload = (data: OnboardingDataInterface): ApplicationPayloadInterface => {
    const { applicationName, templateId, framework, redirectUrls, signInOptions } = data;

    const { template, resolvedTemplateId, isMCPClient } = getTemplate(templateId, framework);
    const isM2M: boolean = resolvedTemplateId === "m2m-application";

    let payload: ApplicationPayloadInterface;

    if (isMCPClient) {
        payload = buildMCPClientPayload(applicationName || "My Application");
    } else if (isM2M) {
        // M2M doesn't need redirect URLs or auth sequence, return early
        return buildM2MPayload(applicationName || "My Application");
    } else {
        if (!template?.application) {
            throw new Error(`Template data not found for: ${templateId || framework}`);
        }
        payload = JSON.parse(JSON.stringify(template.application));
        payload.name = applicationName || "My Application";
        // Use framework-specific string for framework templates, UUID for generic templates
        payload.templateId = TEMPLATE_UUID_MAP[resolvedTemplateId] || resolvedTemplateId;
    }

    if (redirectUrls && redirectUrls.length > 0 && payload.inboundProtocolConfiguration?.oidc) {
        payload.inboundProtocolConfiguration.oidc.callbackURLs = redirectUrls;
        payload.inboundProtocolConfiguration.oidc.allowedOrigins = extractOrigins(redirectUrls);
    }

    if (signInOptions) {
        payload.authenticationSequence = buildAuthSequence(signInOptions);
    }

    // Required by API
    if (!payload.associatedRoles) {
        payload.associatedRoles = {
            allowedAudience: "APPLICATION",
            roles: []
        };
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
    data: OnboardingDataInterface
): Promise<CreatedApplicationResultInterface> => {
    const payload: ApplicationPayloadInterface = buildApplicationPayload(data);
    const response: any = await createApplication(payload as any);

    // Application ID is in the Location header: /api/server/v1/applications/{uuid}
    const location: string = response.headers?.location || "";
    const applicationId: string = location.substring(location.lastIndexOf("/") + 1);

    const result: CreatedApplicationResultInterface = {
        applicationId,
        clientId: response.data?.inboundProtocolConfiguration?.oidc?.clientId ||
                  response.inboundProtocolConfiguration?.oidc?.clientId ||
                  "",
        name: data.applicationName || "My Application"
    };

    if (data.templateId === "m2m-application" || data.templateId === "mcp-client-application") {
        result.clientSecret = response.data?.inboundProtocolConfiguration?.oidc?.clientSecret ||
                              response.inboundProtocolConfiguration?.oidc?.clientSecret;
    }

    return result;
};

/**
 * Check if the template requires redirect URLs.
 *
 * @param templateId - Template ID
 * @returns True if redirect URLs are required
 */
export const requiresRedirectUrls = (templateId?: string): boolean => {
    return templateId !== "m2m-application";
};

/**
 * Check if the template supports sign-in options configuration.
 *
 * @param templateId - Template ID
 * @returns True if sign-in options are supported
 */
export const supportsSignInOptions = (templateId?: string): boolean => {
    return templateId !== "m2m-application";
};
