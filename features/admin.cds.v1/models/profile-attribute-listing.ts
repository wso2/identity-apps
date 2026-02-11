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
  core: {
    label: "Core",
    prefix: "",
    order: 0,
    supportsSubAttributes: false,
    readOnlyName: true,
    allowValueTypeEdit: false,
    allowMergeStrategyEdit: false,
    allowMutabilityEdit: false,
    allowMultiValuedEdit: false
  },
  identity_attributes: {
    label: "Identity Attributes",
    prefix: "identity_attributes.",
    order: 1,
    supportsSubAttributes: false,
    readOnlyName: true,
    allowValueTypeEdit: false,
    allowMergeStrategyEdit: false,
    allowMutabilityEdit: false,
    allowMultiValuedEdit: false
  },
  traits: {
    label: "Traits",
    prefix: "traits.",
    order: 2,
    supportsSubAttributes: true,
    readOnlyName: true,
    allowValueTypeEdit: true,
    allowMergeStrategyEdit: true,
    allowMutabilityEdit: true,
    allowMultiValuedEdit: true
  },
  application_data: {
    label: "Application Data",
    prefix: "application_data.",
    order: 3,
    supportsSubAttributes: true,
    readOnlyName: true,
    allowValueTypeEdit: true,
    allowMergeStrategyEdit: true,
    allowMutabilityEdit: true,
    allowMultiValuedEdit: true
  }
};

export const getScopeLabel = (scope: SchemaListingScope): string =>
  SCOPE_CONFIG[scope]?.label ?? scope;

export const getScopeOrder = (scope: SchemaListingScope): number =>
  SCOPE_CONFIG[scope]?.order ?? 999;

export const stripScopePrefix = (scope: SchemaListingScope, attributeName: string): string => {
  const prefix = SCOPE_CONFIG[scope]?.prefix ?? "";
  if (!attributeName) return "";
  return prefix && attributeName.startsWith(prefix) ? attributeName.slice(prefix.length) : attributeName;
};

export const getDisplayNameFromAttributeName = (scope: SchemaListingScope, attributeName: string): string => {
  const stripped = stripScopePrefix(scope, attributeName);
  return stripped.split(".").pop() || stripped;
};

export const toListingRow = (
  scope: SchemaListingScope,
  attr: { attribute_id?: string; attribute_name: string; application_identifier?: string; }
): ProfileSchemaListingRow => {

  const displayName = getDisplayNameFromAttributeName(scope, attr.attribute_name);

  return {
    id: `${scope}:${attr.attribute_id ?? attr.attribute_name}`,
    scope,
    attribute_id: attr.attribute_id,
    attribute_name: attr.attribute_name,
    display_name: displayName,
    chip_label: scope === "core" ? undefined : getScopeLabel(scope),

    // appId only comes via application_identifier
    belongs_to: scope === "application_data" ? (attr.application_identifier ?? "") : undefined,

    editable: scope !== "core",
    deletable: scope === "traits" || scope === "application_data"
  };
};
