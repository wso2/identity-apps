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
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { buildAuthSequence } from "./auth-sequence-builder";
import { CreatedApplicationResultInterface, OnboardingDataInterface } from "../models";
import { extractOrigins } from "../utils/url-utils";

/**
 * Default application name when user does not provide one.
 */
const DEFAULT_APPLICATION_NAME: string = "My Application";

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
    accessToken?: {
        applicationAccessTokenExpiryInSeconds?: number;
        type?: string;
        bindingType?: string;
        revokeTokensWhenIDPSessionTerminated?: boolean;
        validateTokenBinding?: boolean;
    };
    refreshToken?: {
        expiryInSeconds?: number;
        renewRefreshToken?: boolean;
    };
    [key: string]: unknown;
}

/**
 * Application payload for creation.
 */
interface ApplicationPayloadInterface {
    name: string;
    templateId?: string;
    description?: string;
    advancedConfigurations?: {
        discoverableByEndUsers?: boolean;
        skipLoginConsent?: boolean;
        skipLogoutConsent?: boolean;
        [key: string]: unknown;
    };
    associatedRoles?: {
        allowedAudience: string;
        roles: unknown[];
    };
    inboundProtocolConfiguration?: {
        oidc?: OIDCConfigInterface;
    };
    authenticationSequence?: ReturnType<typeof buildAuthSequence>;
    claimConfiguration?: {
        [key: string]: unknown;
    };
    imageUrl?: string;
    templateVersion?: string;
    [key: string]: unknown;
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
    [ApplicationTemplateIdTypes.MOBILE_APPLICATION]: MobileTemplate as ApplicationTemplateInterface,
    [ApplicationTemplateIdTypes.OIDC_WEB_APPLICATION]: OIDCWebAppTemplate as ApplicationTemplateInterface,
    [ApplicationTemplateIdTypes.SPA]: SPATemplate as ApplicationTemplateInterface
};

/**
 * Get template UUID from ApplicationManagementConstants based on template ID.
 *
 * @param templateId - Template identifier from ApplicationTemplateIdTypes enum
 * @returns UUID for the template
 */
const getTemplateUUID = (templateId: string): string | undefined => {
    switch (templateId) {
        case ApplicationTemplateIdTypes.OIDC_WEB_APPLICATION:
            return ApplicationManagementConstants.TEMPLATE_IDS.get("oidcWeb");
        case ApplicationTemplateIdTypes.SPA:
            return ApplicationManagementConstants.TEMPLATE_IDS.get("spa");
        default:
            return undefined;
    }
};

/**
 * MCP Client application grant types.
 */
const MCP_CLIENT_GRANT_TYPES: string[] = [
    ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
    ApplicationManagementConstants.REFRESH_TOKEN_GRANT,
    ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT
];

/**
 * M2M application grant types.
 */
const M2M_GRANT_TYPES: string[] = [
    ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT
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
    templateId: ApplicationTemplateIdTypes.MCP_CLIENT_APPLICATION
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
    templateId: ApplicationTemplateIdTypes.M2M_APPLICATION
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
    const resolvedTemplateId: string = templateId || ApplicationTemplateIdTypes.SPA;

    let payload: ApplicationPayloadInterface;

    if (resolvedTemplateId === ApplicationTemplateIdTypes.MCP_CLIENT_APPLICATION) {
        payload = buildMCPClientPayload(applicationName || DEFAULT_APPLICATION_NAME);
    } else if (resolvedTemplateId === ApplicationTemplateIdTypes.M2M_APPLICATION) {
        return buildM2MPayload(applicationName || DEFAULT_APPLICATION_NAME);
    } else if (apiTemplate?.payload) {
        payload = JSON.parse(JSON.stringify(apiTemplate.payload));
        payload.name = applicationName || DEFAULT_APPLICATION_NAME;

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
            TEMPLATE_REGISTRY[ApplicationTemplateIdTypes.SPA];

        if (!localTemplate?.application) {
            throw new Error(`Template data not found for: ${resolvedTemplateId}`);
        }

        payload = JSON.parse(JSON.stringify(localTemplate.application));
        payload.name = applicationName || DEFAULT_APPLICATION_NAME;
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
    try {
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
            name: data.applicationName || DEFAULT_APPLICATION_NAME
        };

        if (data.templateId === ApplicationTemplateIdTypes.M2M_APPLICATION
            || data.templateId === ApplicationTemplateIdTypes.MCP_CLIENT_APPLICATION) {
            result.clientSecret = response.data?.inboundProtocolConfiguration?.oidc?.clientSecret ||
                                  response.inboundProtocolConfiguration?.oidc?.clientSecret;
        }

        return result;
    } catch (error) {
        throw new IdentityAppsApiException(
            "Failed to create onboarding application",
            error,
            error?.response?.status,
            error?.request,
            error?.response,
            error?.config
        );
    }
};

/**
 * Check if the template requires redirect URLs.
 *
 * @param templateId - Template ID
 * @returns True if redirect URLs are required
 */
export const requiresRedirectUrls = (templateId?: string): boolean => {
    return templateId !== ApplicationTemplateIdTypes.M2M_APPLICATION;
};

/**
 * Check if the template supports sign-in options configuration.
 *
 * @param templateId - Template ID
 * @returns True if sign-in options are supported
 */
export const supportsSignInOptions = (templateId?: string): boolean => {
    return templateId !== ApplicationTemplateIdTypes.M2M_APPLICATION;
};
