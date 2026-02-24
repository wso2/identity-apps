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

import { ProfileSchemaListingRow, SchemaListingScope, SCOPE_CONFIG } from "../models/profile-attribute-listing";
import type { FilterAttributeOption, ProfileSchemaAttribute, ProfileSchemaFullResponse } from "../models/profile-attributes";

/**
 * Returns the attribute name relative to its scope prefix.
 *
 * Examples:
 *   ("identity_attributes", "identity_attributes.address.street") → "address.street"
 *   ("traits",              "traits.nickname")                     → "nickname"
 *   ("application_data",   "application_data.app1.email")         → "app1.email"
 *
 * If the name does not start with the expected prefix it is returned as-is,
 * so the function is safe to call even on already-stripped names.
 */
const relativeName = (scope: string, attributeName: string): string => {
    if (!attributeName) return "";
    const prefix = `${scope}.`;
    return attributeName.startsWith(prefix) ? attributeName.slice(prefix.length) : attributeName;
};

// ---------------------------------------------------------------------------
// Row-id helper (unchanged)
// ---------------------------------------------------------------------------
const rowId = (scope: SchemaListingScope, attributeName: string, attributeId?: string): string =>
    attributeId ? `${scope}:${attributeId}` : `${scope}:${attributeName}`;

// ---------------------------------------------------------------------------
// Public utilities
// ---------------------------------------------------------------------------

/**
 * Transform schema attributes to dropdown options for AdvancedSearch component.
 */
export const toAttributeDropdownOptions = (
    scope: string,
    attributes: ProfileSchemaAttribute[]
): FilterAttributeOption[] => {

    return (attributes ?? []).map((attr: ProfileSchemaAttribute) => {
        const fullName: string = attr.attribute_name ?? "";

        if (scope === "application_data") {
            // Expected format: application_data.<appId>.<field...>
            // Strip the leading "application_data." prefix then split off the appId.
            const relative: string = relativeName(scope, fullName);
            const dotIndex: number = relative.indexOf(".");
            const appId: string = dotIndex > -1 ? relative.slice(0, dotIndex) : relative;
            const fieldPath: string = dotIndex > -1 ? relative.slice(dotIndex + 1) : "";

            return {
                applicationId: appId,
                key: `${appId}:${fieldPath}`,
                label: fieldPath || "(unknown field)",
                scope,
                value: fieldPath
            };
        }

        // identity_attributes / traits: preserve nested path, just strip the scope prefix.
        const displayName: string = relativeName(scope, fullName);

        return {
            key: fullName,
            label: displayName || fullName,
            scope,
            value: displayName || fullName
        };
    });
};

export const getPropertyScope = (propertyName: string): string => {
    if (propertyName?.startsWith("identity_attributes.")) return "Identity Attribute";
    if (propertyName?.startsWith("application_data.")) return "Application Data";
    if (propertyName?.startsWith("traits.")) return "Trait";

    return "Default";
};

export const getScopeLabel = (scope: SchemaListingScope): string =>
    SCOPE_CONFIG[scope]?.label ?? scope;

export const getScopeOrder = (scope: SchemaListingScope): number =>
    SCOPE_CONFIG[scope]?.order ?? 999;

export const stripScopePrefix = (scope: SchemaListingScope, attributeName: string): string => {
    const prefix: string = SCOPE_CONFIG[scope]?.prefix ?? "";

    if (!attributeName) return "";

    return prefix && attributeName.startsWith(prefix) ? attributeName.slice(prefix.length) : attributeName;
};

/**
 * Returns the display name for an attribute relative to its scope prefix.
 * Replaces the previous `lastSegment` behaviour so that nested attributes
 * like `address.street` are shown in full rather than just `street`.
 */
export const getDisplayNameFromAttributeName = (scope: SchemaListingScope, attributeName: string): string =>
    relativeName(scope, attributeName) || attributeName;

/**
 * Single-attribute convenience factory used by external callers.
 */
export const toListingRow = (
    scope: SchemaListingScope,
    attr: { attribute_id?: string; attribute_name: string; application_identifier?: string; }
): ProfileSchemaListingRow => {

    const displayName: string = getDisplayNameFromAttributeName(scope, attr.attribute_name);

    return {
        attribute_id: attr.attribute_id,
        attribute_name: attr.attribute_name,
        belongs_to: scope === "application_data" ? (attr.application_identifier ?? "") : undefined,
        chip_label: scope === "core" ? undefined : getScopeLabel(scope),
        deletable: scope === "traits" || scope === "application_data",
        display_name: displayName,
        editable: scope !== "core",
        id: `${scope}:${attr.attribute_id ?? attr.attribute_name}`,
        scope
    };
};

/**
 * Transforms a full schema response into a flat list of listing rows.
 *
 * display_name is now the attribute name relative to its scope prefix, so
 * nested attributes like `identity_attributes.address.street` are shown as
 * `address.street` rather than just `street`.
 */
export const toProfileSchemaListingRows = (schema: ProfileSchemaFullResponse): ProfileSchemaListingRow[] => {
    const rows: ProfileSchemaListingRow[] = [];

    // ── core ─────────────────────────────────────────────────────────────────
    // No chip, no belongs_to, no delete, no edit.
    rows.push({
        id: rowId("core", "profile_id"),
        scope: "core",
        attribute_name: "profile_id",
        display_name: "profile_id",
        editable: false,
        deletable: false
    });

    rows.push({
        id: rowId("core", "user_id"),
        scope: "core",
        attribute_name: "user_id",
        display_name: "user_id",
        editable: false,
        deletable: false
    });

    // ── identity_attributes ──────────────────────────────────────────────────
    // Chip shown, deletion not allowed.
    (schema.identity_attributes ?? []).forEach((a: ProfileSchemaAttribute) => {
        rows.push({
            id: rowId("identity_attributes", a.attribute_name, a.attribute_id),
            scope: "identity_attributes",
            attribute_id: a.attribute_id,
            attribute_name: a.attribute_name,
            display_name: relativeName("identity_attributes", a.attribute_name),
            chip_label: getScopeLabel("identity_attributes"),
            editable: true,
            deletable: false
        });
    });

    // ── traits ───────────────────────────────────────────────────────────────
    // Chip shown, deletion allowed.
    (schema.traits ?? []).forEach((a: ProfileSchemaAttribute) => {
        const name: string = a.attribute_name ?? "";
        rows.push({
            id: rowId("traits", name, a.attribute_id),
            scope: "traits",
            attribute_id: a.attribute_id,
            attribute_name: name,
            display_name: relativeName("traits", name),
            chip_label: getScopeLabel("traits"),
            editable: true,
            deletable: true
        });
    });

    // ── application_data ─────────────────────────────────────────────────────
    // Chip + belongs_to appId shown, deletion allowed.
    // display_name strips "application_data.<appId>." so only the field path
    // (e.g. "profile.email") is shown; belongs_to carries the appId separately.
    const appData = schema.application_data ?? {};
    Object.entries(appData).forEach(([ appId, attrs ]) => {
        (attrs ?? []).forEach((a: ProfileSchemaAttribute) => {
            const fullName: string = a.attribute_name ?? "";
            // relativeName strips "application_data." → "<appId>.<field...>"
            // We then strip the appId segment to get just the field path.
            const withoutScope: string = relativeName("application_data", fullName);
            const appPrefix: string = `${appId}.`;
            const fieldPath: string = withoutScope.startsWith(appPrefix)
                ? withoutScope.slice(appPrefix.length)
                : withoutScope;

            rows.push({
                id: rowId("application_data", fullName, a.attribute_id),
                scope: "application_data",
                attribute_id: a.attribute_id,
                attribute_name: fullName,
                display_name: fieldPath || fullName,
                chip_label: getScopeLabel("application_data"),
                belongs_to: appId,
                editable: true,
                deletable: true
            });
        });
    });

    return rows;
};