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
    createApplication,
    getApplicationList,
    updateAuthenticationSequence
} from "@wso2is/admin.applications.v1/api/application";
import TryItApplicationConstants from "@wso2is/admin.applications.v1/constants/try-it-constants";
import LoginApplicationTemplate from "@wso2is/admin.applications.v1/data/try-it-application.json";
import {
    ApplicationListInterface,
    ApplicationListItemInterface,
    MainApplicationInterface
} from "@wso2is/admin.applications.v1/models/application";
import getTryItClientId from "@wso2is/admin.applications.v1/utils/get-try-it-client-id";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AxiosResponse } from "axios";
import cloneDeep from "lodash-es/cloneDeep";
import { buildAuthSequence } from "./auth-sequence-builder";
import { CreatedApplicationResultInterface, OnboardingDataInterface } from "../models";

/**
 * Creates or reuses the Try It application for the Tour flow.
 *
 * If the Try It app already exists, updates its authentication sequence
 * with the user's configured sign-in options. If it doesn't exist,
 * creates it from the Try It template with the configured auth sequence.
 *
 * @param data - Onboarding data with sign-in options
 * @param tenantDomain - Current tenant domain
 * @param asgardeoTryItURL - Base URL of the Try It playground
 * @returns Created/existing application result with tryItUrl
 */
export const createTryItApplication = async (
    data: OnboardingDataInterface,
    tenantDomain: string,
    asgardeoTryItURL: string
): Promise<CreatedApplicationResultInterface> => {
    try {
        // Validate required parameters
        if (!tenantDomain || tenantDomain.trim() === "") {
            throw new Error("Tenant domain is required");
        }

        if (!asgardeoTryItURL || asgardeoTryItURL.trim() === "") {
            throw new Error("Try It URL is required");
        }

        const tryItClientId: string = getTryItClientId(tenantDomain);
        const tryItUrl: string = `${asgardeoTryItURL}?client_id=${tryItClientId}&org=${tenantDomain}`;

        // Check if the Try It app already exists
        const existingApps: ApplicationListInterface = await getApplicationList(
            null, null, `clientId eq ${tryItClientId}`
        );

        if (existingApps?.applications?.length > 0) {
            const existingApp: ApplicationListItemInterface = existingApps.applications[0];

            if (!existingApp?.id) {
                throw new Error("Existing Try It application has no ID");
            }

            // Update auth sequence on the existing app with user's sign-in options
            if (data.signInOptions) {
                try {
                    await updateAuthenticationSequence(existingApp.id, {
                        authenticationSequence: buildAuthSequence(data.signInOptions)
                    });
                } catch {
                    // Non-critical — the app still exists and can be previewed
                }
            }

            return {
                applicationId: existingApp.id,
                clientId: tryItClientId,
                name: existingApp.name || TryItApplicationConstants.DISPLAY_NAME,
                tryItUrl
            };
        }

        // Create a new Try It app from the template
        const appPayload: MainApplicationInterface = cloneDeep(
            LoginApplicationTemplate.application
        ) as unknown as MainApplicationInterface;

        appPayload.inboundProtocolConfiguration.oidc.clientId = tryItClientId;
        appPayload.inboundProtocolConfiguration.oidc.callbackURLs = [ asgardeoTryItURL ];
        appPayload.inboundProtocolConfiguration.oidc.allowedOrigins = [ asgardeoTryItURL ];
        appPayload.accessUrl = asgardeoTryItURL;

        // Apply user's configured sign-in options
        if (data.signInOptions) {
            (appPayload as any).authenticationSequence = buildAuthSequence(data.signInOptions);
        }

        const response: AxiosResponse = await createApplication(appPayload);

        const location: string = response.headers?.location || "";
        const applicationId: string = location.substring(location.lastIndexOf("/") + 1);

        if (!applicationId || applicationId.trim() === "") {
            throw new Error(
                "Failed to extract application ID from server response. " +
                "The Location header may be missing or malformed."
            );
        }

        return {
            applicationId,
            clientId: tryItClientId,
            name: TryItApplicationConstants.DISPLAY_NAME,
            tryItUrl
        };
    } catch (error) {
        throw new IdentityAppsApiException(
            "Failed to create Try It application",
            error,
            error?.response?.status,
            error?.request,
            error?.response,
            error?.config
        );
    }
};
