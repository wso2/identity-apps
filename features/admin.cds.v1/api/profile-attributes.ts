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

import axios from "axios";
import { CDM_BASE_URL } from "../models/constants";
import {
    ApplicationDataSchemaMapResponse,
    ProfileSchemaAttribute,
    ProfileSchemaFullResponse,
    ProfileSchemaScope,
    ProfileSchemaScopeResponse
} from "../models/profile-attributes";
import { SchemaListingScope } from "../models/profile-attribute-listing";
import { FilterAttributeOption } from "@wso2is/admin.core.v1/components/advanced-search-with-multipe-filters";

/**
 * GET /profile-schema
 * Returns the complete schema (core + meta + identity + traits + application_data map)
 */
export const fetchFullProfileSchema = async (): Promise<ProfileSchemaFullResponse> => {
    const res = await axios.get(`${CDM_BASE_URL}/profile-schema`);
    return res.data as ProfileSchemaFullResponse;
};

/**
 * GET /profile-schema/{scope}
 * Recommended backend response: ProfileSchemaAttribute[] for ALL scopes.
 *
 * If application_data comes as a map, this function flattens it and injects application_identifier.
 */
export const fetchProfileSchemaByScope = async (
    scope: ProfileSchemaScope,
    filter?: string
  ): Promise<ProfileSchemaScopeResponse> => {
  
    const res = await axios.get(`${CDM_BASE_URL}/profile-schema/${scope}`, {
      params: filter ? { filter } : undefined
    });
  
    const data = res.data;
  
    if (Array.isArray(data)) {
      return data as ProfileSchemaScopeResponse;
    }

    // If backend returns a map for application_data => flatten.
    // Shape: { "<appId>": [ {..}, ... ] }
    if (scope === "application_data" && data && typeof data === "object") {
        const map = data as ApplicationDataSchemaMapResponse;

        const flattened: ProfileSchemaAttribute[] = [];

        Object.entries(map).forEach(([ appId, attrs ]) => {
            (attrs ?? []).forEach((attr) => {
                const original = attr.attribute_name ?? "";
                const field =
                    original.startsWith("application_data.")
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

    // Unknown shape (fail-safe)
    return [];
};

/**
 * GET /profile-schema/{scope}/{id}
 */
export const fetchSchemaAttributeById = async (
    scope: SchemaListingScope,
    id: string
  ): Promise<ProfileSchemaAttribute> => {
    const res = await axios.get(`${CDM_BASE_URL}/profile-schema/${scope}/${id}`);
    return res.data as ProfileSchemaAttribute;
  };
  
  /**
   * PATCH /profile-schema/{scope}/{id}
   * Only send what changed.
   */
  export const patchSchemaAttributeById = async (
    scope: SchemaListingScope,
    id: string,
    patch: Partial<ProfileSchemaAttribute>
  ): Promise<void> => {
    await axios.patch(`${CDM_BASE_URL}/profile-schema/${scope}/${id}`, patch);
  };

/**
 * Helper for AdvancedSearch dropdown:
 * - label: last segment of attribute_name
 * - value: full attribute_name
 */
export const toAttributeDropdownOptions = (
    scope: string,
    attributes: ProfileSchemaAttribute[]
): FilterAttributeOption[] => {

    return (attributes ?? []).map((attr) => {
        const name = attr.attribute_name ?? "";

        if (scope === "application_data") {
            // expected name: application_data.<appId>.<field...>
            const parts = name.split(".");
            const appId = parts[1] ?? "";

            // field only (device_model OR nested.field)
            const field = parts.slice(2).join(".") || "";

            return {
                scope,
                applicationId: appId,
                label: field ? `${field} (app: ${appId})` : `(unknown field) (app: ${appId})`,
                value: field,                               // ✅ IMPORTANT: field only
                key: `${appId}:${field}`                    // ✅ stable key
            };
        }

        const label = name.includes(".") ? name.split(".").slice(-1)[0] : name;

        return {
            scope,
            label,
            value: name,                       
            key: name
        };
    });
};
