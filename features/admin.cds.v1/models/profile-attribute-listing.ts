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
    allowMergeStrategyEdit: boolean;
    allowMultiValuedEdit: boolean;
    allowMutabilityEdit: boolean;
    allowValueTypeEdit: boolean;
    backgroundColor?: string;
    chipColor?: string;
    label: string;
    order: number;
    prefix: string;
    readOnlyName: boolean;
    supportsSubAttributes: boolean;
}> = {
    application_data: {
        allowMergeStrategyEdit: true,
        allowMultiValuedEdit: true,
        allowMutabilityEdit: true,
        allowValueTypeEdit: true,
        backgroundColor: "#ede7f6",
        chipColor: "#5e35b1",
        label: "Application Data",
        order: 1,
        prefix: "application_data.",
        readOnlyName: true,
        supportsSubAttributes: true
    },
    core: {
        allowMergeStrategyEdit: false,
        allowMultiValuedEdit: false,
        allowMutabilityEdit: false,
        allowValueTypeEdit: false,
        label: "",
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
        backgroundColor: "#00796b",
        chipColor: "#00796b",
        label: "Identity Attributes",
        order: 3,
        prefix: "identity_attributes.",
        readOnlyName: true,
        supportsSubAttributes: false
    },
    traits: {
        allowMergeStrategyEdit: true,
        allowMultiValuedEdit: true,
        allowMutabilityEdit: true,
        allowValueTypeEdit: true,
        backgroundColor: "#dcf0fa",
        chipColor: "#0082c3",
        label: "Traits",
        order: 2,
        prefix: "traits.",
        readOnlyName: true,
        supportsSubAttributes: true
    }
};
