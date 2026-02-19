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

export type SchemaListingScope =
  | "core"
  | "identity_attributes"
  | "traits"
  | "application_data";

export interface ProfileSchemaListingRow {
  id: string;
  scope: SchemaListingScope;

  attribute_id?: string;
  attribute_name: string;

  display_name: string;

  chip_label?: string;
  belongs_to?: string;

  editable: boolean;
  deletable: boolean;
}

/**
 * Backend returns:
 * - identity_attributes.<name>
 * - traits.<name>
 * - application_data.<name>   (no appId in name)
 */
export const SCOPE_CONFIG: Record<SchemaListingScope, {
  label: string;
  prefix: string;
  order: number;
  supportsSubAttributes: boolean;
  readOnlyName: boolean;
  allowValueTypeEdit: boolean;
  allowMergeStrategyEdit: boolean;
  allowMutabilityEdit: boolean;
  allowMultiValuedEdit: boolean;
}> = {
    application_data: {
        allowMergeStrategyEdit: true,
        allowMultiValuedEdit: true,
        allowMutabilityEdit: true,
        allowValueTypeEdit: true,
        label: "Application Data",
        order: 3,
        prefix: "application_data.",
        readOnlyName: true,
        supportsSubAttributes: true
    },
    core: {
        allowMergeStrategyEdit: false,
        allowMultiValuedEdit: false,
        allowMutabilityEdit: false,
        allowValueTypeEdit: false,
        label: "Core",
        order: 0,
        prefix: "",
        readOnlyName: true,
        supportsSubAttributes: false
    },
    identity_attributes: {
        allowMergeStrategyEdit: false,
        allowMultiValuedEdit: false,
        allowMutabilityEdit: false,
        allowValueTypeEdit: false,
        label: "Identity Attributes",
        order: 1,
        prefix: "identity_attributes.",
        readOnlyName: true,
        supportsSubAttributes: false
    },
    traits: {
        allowMergeStrategyEdit: true,
        allowMultiValuedEdit: true,
        allowMutabilityEdit: true,
        allowValueTypeEdit: true,
        label: "Traits",
        order: 2,
        prefix: "traits.",
        readOnlyName: true,
        supportsSubAttributes: true
    }
};

export const getScopeLabel = (scope: SchemaListingScope): string =>
    SCOPE_CONFIG[scope]?.label ?? scope;

export const getScopeOrder = (scope: SchemaListingScope): number =>
    SCOPE_CONFIG[scope]?.order ?? 999;

export const stripScopePrefix = (scope: SchemaListingScope, attributeName: string): string => {
    const prefix:string = SCOPE_CONFIG[scope]?.prefix ?? "";

    if (!attributeName) return "";

    return prefix && attributeName.startsWith(prefix) ? attributeName.slice(prefix.length) : attributeName;
};

export const getDisplayNameFromAttributeName = (scope: SchemaListingScope, attributeName: string): string => {
    const stripped:string = stripScopePrefix(scope, attributeName);

    return stripped.split(".").pop() || stripped;
};

export const toListingRow = (
    scope: SchemaListingScope,
    attr: { attribute_id?: string; attribute_name: string; application_identifier?: string; }
): ProfileSchemaListingRow => {

    const displayName:string = getDisplayNameFromAttributeName(scope, attr.attribute_name);

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
