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
import { AxiosResponse } from "axios";
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
 * POST /profile-schema/`{scope}`
 *
 * Creates one or more new attributes under the given scope.
 * Works for both `traits` and `application_data` scopes.
 *
 * @param scope - The profile schema scope to create attributes under.
 * @param attributes - Array of attribute definitions to create.
 * @returns The created `ProfileSchemaAttribute` records.
 */
export const createSchemaAttributes = async (
    scope: ProfileSchemaScope,
    attributes: Array<Partial<ProfileSchemaAttribute>>
): Promise<ProfileSchemaAttribute[]> => {
    const requestConfig: RequestConfigInterface = {
        data: attributes,
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.POST,
        url: `${store.getState().config.endpoints.cdsProfileSchema}/${scope}`
    };

    const response: AxiosResponse<any> = await httpClient(requestConfig);

    return Array.isArray(response.data) ? (response.data as ProfileSchemaAttribute[]) : [];
};

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

    const response: AxiosResponse<any> = await httpClient(requestConfig);
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
 * PUT /profile-schema/`{scope}`/`{id}`
 * Replace the attribute with the given payload.
 */
export const updateSchemaAttributeById = async (
    scope: SchemaListingScope,
    id: string,
    payload: Partial<ProfileSchemaAttribute>
): Promise<void> => {
    const requestConfig: RequestConfigInterface = {
        data: payload,
        headers: { "Content-Type": "application/json" },
        method: HttpMethods.PUT,
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
