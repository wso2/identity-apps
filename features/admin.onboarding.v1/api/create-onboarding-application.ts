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

import {
    ApplicationTemplateInterface as APIApplicationTemplateInterface
} from "@wso2is/admin.application-templates.v1/models/templates";
import { createApplication } from "@wso2is/admin.applications.v1/api/application";
import {
    ApplicationManagementConstants
} from "@wso2is/admin.applications.v1/constants/application-management";
import { ApplicationTemplateIdTypes } from "@wso2is/admin.applications.v1/models/application";
import { AppConstants } from "@wso2is/admin.core.v1/constants/app-constants";
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
 * Local template registry for templates excluded from the extension API.
 */
const TEMPLATE_REGISTRY: Record<string, ApplicationTemplateInterface> = {
    "mobile-application": MobileTemplate as ApplicationTemplateInterface,
    "oidc-web-application": OIDCWebAppTemplate as ApplicationTemplateInterface,
    "single-page-application": SPATemplate as ApplicationTemplateInterface
};

/**
 * Get template UUID from ApplicationManagementConstants based on template ID.
 *
 * @param templateId - Template identifier (e.g., "oidc-web-application", "single-page-application")
 * @returns UUID for the template
 */
const getTemplateUUID = (templateId: string): string | undefined => {
    switch (templateId) {
        case "oidc-web-application":
            return ApplicationManagementConstants.TEMPLATE_IDS.get("oidcWeb");
        case "single-page-application":
            return ApplicationManagementConstants.TEMPLATE_IDS.get("spa");
        default:
            return undefined;
    }
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
 * Build application payload from onboarding data.
 *
 * @param data - Onboarding data
 * @param apiTemplate - API-fetched template for framework templates
 * @returns Application payload for API
 */
const buildApplicationPayload = (
    data: OnboardingDataInterface,
    apiTemplate?: APIApplicationTemplateInterface
): ApplicationPayloadInterface => {
    const { applicationName, templateId, redirectUrls, signInOptions } = data;
    const resolvedTemplateId: string = templateId || "single-page-application";

    let payload: ApplicationPayloadInterface;

    if (resolvedTemplateId === ApplicationTemplateIdTypes.MCP_CLIENT_APPLICATION) {
        payload = buildMCPClientPayload(applicationName || "My Application");
    } else if (resolvedTemplateId === ApplicationTemplateIdTypes.M2M_APPLICATION) {
        return buildM2MPayload(applicationName || "My Application");
    } else if (apiTemplate?.payload) {
        payload = JSON.parse(JSON.stringify(apiTemplate.payload));
        payload.name = applicationName || "My Application";

        if (!payload.templateId) {
            payload.templateId = resolvedTemplateId;
        }

        if (!payload.templateVersion && apiTemplate.version) {
            payload.templateVersion = apiTemplate.version;
        }

        if (payload.imageUrl && typeof payload.imageUrl === "string") {
            payload.imageUrl = payload.imageUrl
                .replace("${clientOrigin}", AppConstants.getClientOrigin())
                .replace("${appBaseNameWithoutTenant}", AppConstants.getAppBasename());
        }
    } else {
        const localTemplate: ApplicationTemplateInterface = TEMPLATE_REGISTRY[resolvedTemplateId] ||
            TEMPLATE_REGISTRY["single-page-application"];

        if (!localTemplate?.application) {
            throw new Error(`Template data not found for: ${resolvedTemplateId}`);
        }

        payload = JSON.parse(JSON.stringify(localTemplate.application));
        payload.name = applicationName || "My Application";
        payload.templateId = getTemplateUUID(resolvedTemplateId) || resolvedTemplateId;
    }

    if (redirectUrls && redirectUrls.length > 0 && payload.inboundProtocolConfiguration?.oidc) {
        payload.inboundProtocolConfiguration.oidc.callbackURLs = redirectUrls;

        // Mobile deep links (custom URI schemes) don't have HTTP origins,
        // so allowedOrigins should be empty for mobile apps.
        const isMobile: boolean = resolvedTemplateId === ApplicationTemplateIdTypes.MOBILE_APPLICATION;

        payload.inboundProtocolConfiguration.oidc.allowedOrigins = isMobile ? [] : extractOrigins(redirectUrls);
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
 * @param apiTemplate - API-fetched template for framework templates
 * @returns Created application result
 */
export const createOnboardingApplication = async (
    data: OnboardingDataInterface,
    apiTemplate?: APIApplicationTemplateInterface
): Promise<CreatedApplicationResultInterface> => {
    const payload: ApplicationPayloadInterface = buildApplicationPayload(data, apiTemplate);
    const response: any = await createApplication(payload as any);

    // Application ID is in the Location header: /api/server/v1/applications/{uuid}
    const location: string = response.headers?.location || "";
    const applicationId: string = location.substring(location.lastIndexOf("/") + 1);

    if (!applicationId || applicationId.trim() === "") {
        throw new Error(
            "Failed to extract application ID from server response. " +
            "The Location header may be missing or malformed."
        );
    }

    const result: CreatedApplicationResultInterface = {
        applicationId,
        clientId: response.data?.inboundProtocolConfiguration?.oidc?.clientId ||
                  response.inboundProtocolConfiguration?.oidc?.clientId ||
                  "",
        name: data.applicationName || "My Application"
    };

    if (data.templateId === ApplicationTemplateIdTypes.M2M_APPLICATION
        || data.templateId === ApplicationTemplateIdTypes.MCP_CLIENT_APPLICATION) {
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
