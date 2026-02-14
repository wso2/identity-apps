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
import { AxiosError, AxiosResponse } from "axios";

import type { FilterAttributeOption } from "../components/advanced-search-with-multiple-filters";
import type { SchemaListingScope } from "../models/profile-attribute-listing";
import type {
    ApplicationDataSchemaMapResponse,
    ProfileSchemaAttribute,
    ProfileSchemaFullResponse,
    ProfileSchemaScope,
    ProfileSchemaScopeResponse
} from "../models/profile-attributes";

/**
 * Initialize an auth-aware Http client.
 */
const httpClient: HttpClientInstance =
    AsgardeoSPAClient.getInstance().httpRequest.bind(AsgardeoSPAClient.getInstance());

/**
 * GET /profile-schema
 * Returns the complete schema (core + meta + identity + traits + application_data map)
 */
export const fetchFullProfileSchema = (): Promise<ProfileSchemaFullResponse> => {
    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        url: store.getState().config.endpoints.cdsProfileSchema
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => Promise.resolve(response.data as ProfileSchemaFullResponse))
        .catch((error: AxiosError) => Promise.reject(error));
};

/**
 * GET /profile-schema/`{scope}`
 *
 * If application_data comes as a map, this function flattens it and injects application_identifier.
 */
export const fetchProfileSchemaByScope = (
    scope: ProfileSchemaScope,
    filter?: string
): Promise<ProfileSchemaScopeResponse> => {

    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        params: filter ? { filter } : undefined,
        url:  `${store.getState().config.endpoints.cdsProfileSchema}/${scope}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            const data: unknown = response.data;

            if (Array.isArray(data)) {
                return Promise.resolve(data as ProfileSchemaScopeResponse);
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

                return Promise.resolve(flattened);
            }

            return Promise.resolve([]);
        })
        .catch((error: AxiosError) => Promise.reject(error));
};

/**
 * GET /profile-schema/`{scope}`/`{id}`
 */
export const fetchSchemaAttributeById = (
    scope: SchemaListingScope,
    id: string
): Promise<ProfileSchemaAttribute> => {
    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.GET,
        url: `${store.getState().config.endpoints.cdsProfileSchema}/${scope}/${id}`
    };

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => Promise.resolve(response.data as ProfileSchemaAttribute))
        .catch((error: AxiosError) => Promise.reject(error));
};

/**
 * PATCH /profile-schema/`{scope}`/`{id}`
 * Only send what changed.
 */
export const updateSchemaAttributeById = (
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

    return httpClient(requestConfig)
        .then(() => Promise.resolve())
        .catch((error: AxiosError) => Promise.reject(error));
};

/**
 * DELETE /profile-schema/`{scope}`/`{id}`
 */
export const deleteSchemaAttributeById = (
    scope: SchemaListingScope,
    id: string
): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.DELETE,
        url: `${store.getState().config.endpoints.cdsProfileSchema}/${scope}/${id}`
    };

    return httpClient(requestConfig)
        .then(() => Promise.resolve())
        .catch((error: AxiosError) => Promise.reject(error));
};

/**
 * Search for sub-attributes of a complex attribute
 */
export const searchSubAttributes = (
    scope: SchemaListingScope,
    attributeName: string
): Promise<ProfileSchemaAttribute[]> => {

    const scopePrefix: string =
        scope === "traits"
            ? "traits."
            : scope === "application_data"
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

    return httpClient(requestConfig)
        .then((response: AxiosResponse) => {
            const data: any = response.data;

            return Promise.resolve(Array.isArray(data) ? (data as ProfileSchemaAttribute[]) : []);
        })
        .catch((error: AxiosError) => Promise.reject(error));
};

/**
 * Helper for AdvancedSearch dropdown:
 * - label: last segment of attribute_name
 * - value: full attribute_name without scope
 */
export const toAttributeDropdownOptions = (
    scope: string,
    attributes: ProfileSchemaAttribute[]
): FilterAttributeOption[] => {

    return (attributes ?? []).map((attr: ProfileSchemaAttribute) => {
        const fullName: string = attr.attribute_name ?? "";

        const stripLeadingScope = (name: string, s: string): string =>
            name.startsWith(`${s}.`) ? name.slice(s.length + 1) : name;

        if (scope === "application_data") {
            // expected: application_data.<appId>.<field...>  (field can be complex: a.b.c)
            const parts: string[] = fullName.split(".");
            const appId: string = parts.length > 1 ? parts[1] : "";

            // field path WITHOUT scope/appId
            const fieldPath: string = parts.length > 2 ? parts.slice(2).join(".") : "";

            return {
                applicationId: appId,
                key: `${appId}:${fieldPath}`,
                label: fieldPath || "(unknown field)",
                scope,
                value: fieldPath
            };
        }

        // For identity_attributes / traits:
        // keep nested/complex attributes, only remove the leading scope prefix.
        const displayName: string = stripLeadingScope(fullName, scope);

        return {
            key: fullName,
            label: displayName || fullName,
            scope,
            value: displayName || fullName
        };
    });
};
