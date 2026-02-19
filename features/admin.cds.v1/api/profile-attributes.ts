/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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

import { AsgardeoSPAClient, HttpClientInstance } from "@asgardeo/auth-react";
import { RequestConfigInterface } from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";
import type { SchemaListingScope } from "../models/profile-attribute-listing";
import type {
    ApplicationDataSchemaMapResponse,
    ProfileSchemaAttribute,
    ProfileSchemaScope,
    ProfileSchemaScopeResponse
} from "../models/profile-attributes";

/**
 * Initialize an auth-aware Http client.
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * GET /profile-schema/`{scope}`
 *
 * If application_data comes as a map, this function flattens it and injects application_identifier.
 */
export const fetchProfileSchemaByScope = async (
    scope: ProfileSchemaScope,
    filter?: string
): Promise<ProfileSchemaScopeResponse> => {

    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        params: filter ? { filter } : undefined,
        url:  `${store.getState().config.endpoints.cdsProfileSchema}/${scope}`
    };

    const response: Awaited<ReturnType<typeof httpClient>> = await httpClient(requestConfig);
    const data: unknown = response.data;

    if (Array.isArray(data)) {
        return data as ProfileSchemaScopeResponse;
    }

    // Map shape: { "<appId>": [ {..}, ... ] }
    if (scope === "application_data" && data && typeof data === "object") {
        const map: ApplicationDataSchemaMapResponse = data as ApplicationDataSchemaMapResponse;
        const flattened: ProfileSchemaAttribute[] = [];

        Object.entries(map).forEach(([ appId, attrs ]: [string, ProfileSchemaAttribute[]]) => {
            (attrs ?? []).forEach((attr: ProfileSchemaAttribute) => {
                const original: string = attr.attribute_name ?? "";
                const field: string = original.startsWith("application_data" + ".")
                    ? original.replace("application_data.", "")
                    : original;

                flattened.push({
                    ...attr,
                    application_identifier: attr.application_identifier ?? appId,
                    attribute_name: `application_data.${appId}.${field}`
                });
            });
        });

        return flattened;
    }

    return [];
};

/**
 * PATCH /profile-schema/`{scope}`/`{id}`
 * Only send what changed.
 */
export const updateSchemaAttributeById = async (
    scope: SchemaListingScope,
    id: string,
    patch: Partial<ProfileSchemaAttribute>
): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        data: patch,
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.PATCH,
        url: `${store.getState().config.endpoints.cdsProfileSchema}/${scope}/${id}`
    };

    await httpClient(requestConfig);
};

/**
 * DELETE /profile-schema/`{scope}`/`{id}`
 */
export const deleteSchemaAttributeById = async (
    scope: SchemaListingScope,
    id: string
): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.cdsProfileSchema}/${scope}/${id}`
    };

    await httpClient(requestConfig);
};

/**
 * Search for sub-attributes of a complex attribute
 */
export const searchSubAttributes = async (
    scope: SchemaListingScope,
    attributeName: string
): Promise<ProfileSchemaAttribute[]> => {

    const SCOPE_TRAITS: string = "traits";
    const SCOPE_APPLICATION_DATA: string = "application_data";

    const scopePrefix: string =
        scope === SCOPE_TRAITS
            ? "traits."
            : scope === SCOPE_APPLICATION_DATA
                ? "application_data."
                : "";

    const baseAttrName: string = attributeName.startsWith(scopePrefix)
        ? attributeName.substring(scopePrefix.length)
        : attributeName;

    const searchPrefix: string = `${scopePrefix}${baseAttrName}.`;
    const filter: string = `attribute_name+co+${searchPrefix}`;

    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        params: { filter },
        url: `${store.getState().config.endpoints.cdsProfileSchema}/${scope}`
    };

    const response: Awaited<ReturnType<typeof httpClient>> = await httpClient(requestConfig);
    const data: any = response.data;

    return Array.isArray(data) ? (data as ProfileSchemaAttribute[]) : [];
};
