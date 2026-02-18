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

export type ProfileSchemaGroupedScope =
    | "identity_attributes"
    | "traits"
    | "application_data";

export type ProfileSchemaFirstClassField =
    | "profile_id"
    | "user_id";

export type ProfileSchemaScope = ProfileSchemaGroupedScope | ProfileSchemaFirstClassField;

export type Mutability = "immutable" | "readOnly" | "readWrite" | "writeOnce";

export type ValueType =
    | "string"
    | "integer"
    | "decimal"
    | "boolean"
    | "date"
    | "date_time"
    | "epoch"
    | "complex";

export type MergeStrategy =
    | "overwrite"
    | "combine";

export interface ProfileSchemaSubAttributeRef {
    attribute_id: string;
    attribute_name: string;
}

export interface ProfileSchemaAttribute {
    attribute_id: string;
    attribute_name: string; // e.g. identity_attributes.username, traits.xyz, application_data.email
    value_type?: ValueType;
    merge_strategy?: MergeStrategy;
    mutability: Mutability;
    multi_valued: boolean;

    // application_data only (BE stores by app id map sometimes)
    application_identifier?: string;

    // complex types
    sub_attributes?: ProfileSchemaSubAttributeRef[];

    // Canonical values for attributes for options value type.
    canonical_values?: CanonicalValues[];
}

export interface ProfileSchemaCoreAttribute {
    mutability: Mutability;
    value_type: ValueType;
}

interface CanonicalValues {
  value: string;
  label: string;
}

export interface ProfileSchemaFullResponse {
    profile_id: ProfileSchemaCoreAttribute;
    user_id: ProfileSchemaCoreAttribute;

    meta: Record<string, ProfileSchemaCoreAttribute>;

    identity_attributes: ProfileSchemaAttribute[];
    traits: ProfileSchemaAttribute[];

    // keyed by application identifier
    application_data: Record<string, ProfileSchemaAttribute[]>;
}

export interface FilterAttributeOption {
    scope: string;
    label: string;
    value: string;
    key?: string;
    applicationId?: string;
}

export type ProfileSchemaScopeResponse = ProfileSchemaAttribute[];
export type ApplicationDataSchemaMapResponse = Record<string, ProfileSchemaAttribute[]>;
