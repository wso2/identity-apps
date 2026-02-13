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
import {
    ApplicationDataSchemaMapResponse,
    ProfileSchemaAttribute,
    ProfileSchemaFullResponse,
    ProfileSchemaScope,
    ProfileSchemaScopeResponse
} from "../models/profile-attributes";
import { SchemaListingScope } from "../models/profile-attribute-listing";
import { FilterAttributeOption } from "../components/advanced-search-with-multipe-filters";

/**
 * GET /profile-schema
 * Returns the complete schema (core + meta + identity + traits + application_data map)
 */
export const fetchFullProfileSchema = async (): Promise<ProfileSchemaFullResponse> => {
    const res = await axios.get("https://localhost:8900/t/carbob.super/profile-schema"
)
    ;
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

    const res = await axios.get("https://localhost:8900/t/carbon.super/cds/api/v1/profile-schema/"+scope, {
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
            (attrs ?? []).forEach((attr:ProfileSchemaAttribute) => {
                const original:string = attr.attribute_name ?? "";
                const field:any =
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

    return [];
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
            const fieldPath:string = parts.length > 2 ? parts.slice(2).join(".") : "";

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
        const displayName:string = stripLeadingScope(fullName, scope);

        return {
            key: fullName,
            label: displayName || fullName,
            scope,
            value: displayName || fullName
        };
    });
};
