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

import type { FilterAttributeOption } from "../components/advanced-search-with-multiple-filters";
import type { ProfileSchemaAttribute } from "../models/profile-attributes";

/**
 * Transform schema attributes to dropdown options for AdvancedSearch component
 *
 * @param scope - The schema scope (identity_attributes, traits, application_data)
 * @param attributes - Array of profile schema attributes
 * @returns Array of dropdown options with label, value, key, and scope
 *
 * @example
 * const options = toAttributeDropdownOptions("identity_attributes", attributes);
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
            // Expected format: application_data.<appId>.<field...>
            const parts: string[] = fullName.split(".");
            const appId: string = parts.length > 1 ? parts[1] : "";
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
        // Keep nested/complex attributes, only remove the leading scope prefix
        const displayName: string = stripLeadingScope(fullName, scope);

        return {
            key: fullName,
            label: displayName || fullName,
            scope,
            value: displayName || fullName
        };
    });
};
