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

import { AxiosError } from "axios";
import { useMemo } from "react";
import useSWR, { SWRConfiguration, SWRResponse } from "swr";

import {
    fetchFullProfileSchema,
    fetchProfileSchemaByScope,
    fetchSchemaAttributeById,
    searchSubAttributes
} from "../api/profile-attributes";
import type { SchemaListingScope } from "../models/profile-attribute-listing";
import type {
    FilterAttributeOption,
    ProfileSchemaAttribute,
    ProfileSchemaFullResponse,
    ProfileSchemaScope,
    ProfileSchemaScopeResponse
} from "../models/profile-attributes";
import { toAttributeDropdownOptions } from "../utils/profile-attribute-utils";

/**
 * SWR Hook: GET /profile-schema
 *
 * @param config - SWR configuration options
 * @returns SWR response with full profile schema
 */
export const useFullProfileSchema = (
    config?: SWRConfiguration<ProfileSchemaFullResponse, AxiosError>
): SWRResponse<ProfileSchemaFullResponse, AxiosError> => {
    const key: string = "profile-schema-full";

    return useSWR<ProfileSchemaFullResponse, AxiosError>(
        key,
        () => fetchFullProfileSchema(),
        config
    );
};

/**
 * SWR Hook: GET /profile-schema/`{scope}`
 *
 * @param scope - Schema scope (identity_attributes, traits, application_data)
 * @param filter - Optional filter string
 * @param config - SWR configuration options
 * @returns SWR response with schema attributes for the scope
 */
export const useProfileSchemaByScope = (
    scope: ProfileSchemaScope | null,
    filter?: string,
    config?: SWRConfiguration<ProfileSchemaScopeResponse, AxiosError>
): SWRResponse<ProfileSchemaScopeResponse, AxiosError> => {
    const key: ["profile-schema-scope", ProfileSchemaScope, string | undefined] | null =
        scope ? [ "profile-schema-scope", scope, filter ] : null;

    return useSWR<ProfileSchemaScopeResponse, AxiosError>(
        key,
        scope ? () => fetchProfileSchemaByScope(scope, filter) : null,
        config
    );
};

/**
 * SWR Hook: GET /profile-schema/`{scope}`/`{id}`
 *
 * @param scope - Schema scope
 * @param id - Attribute ID, or null to disable fetching
 * @param config - SWR configuration options
 * @returns SWR response with schema attribute details
 */
export const useSchemaAttributeById = (
    scope: SchemaListingScope | null,
    id: string | null,
    config?: SWRConfiguration<ProfileSchemaAttribute, AxiosError>
): SWRResponse<ProfileSchemaAttribute, AxiosError> => {
    const key: ["profile-schema-attribute", SchemaListingScope, string] | null =
        scope && id ? [ "profile-schema-attribute", scope, id ] : null;

    return useSWR<ProfileSchemaAttribute, AxiosError>(
        key,
        scope && id ? () => fetchSchemaAttributeById(scope, id) : null,
        config
    );
};

/**
 * SWR Hook: Search sub-attributes
 *
 * @param scope - Schema scope
 * @param attributeName - Parent attribute name, or null to disable fetching
 * @param config - SWR configuration options
 * @returns SWR response with sub-attributes
 */
export const useSubAttributes = (
    scope: SchemaListingScope | null,
    attributeName: string | null,
    config?: SWRConfiguration<ProfileSchemaAttribute[], AxiosError>
): SWRResponse<ProfileSchemaAttribute[], AxiosError> => {
    const key: ["profile-schema-sub-attributes", SchemaListingScope, string] | null =
        scope && attributeName ? [ "profile-schema-sub-attributes", scope, attributeName ] : null;

    return useSWR<ProfileSchemaAttribute[], AxiosError>(
        key,
        scope && attributeName ? () => searchSubAttributes(scope, attributeName) : null,
        config
    );
};

/**
 * Combined Hook: Fetch schema by scope AND transform to dropdown options
 *
 * This is useful for search components that need both fetching + transformation
 *
 * @param scope - Schema scope
 * @param filter - Optional filter string
 * @param config - SWR configuration options
 * @returns SWR response with transformed dropdown options
 */
export const useProfileSchemaDropdownOptions = (
    scope: ProfileSchemaScope | null,
    filter?: string,
    config?: SWRConfiguration<ProfileSchemaScopeResponse, AxiosError>
): SWRResponse<ProfileSchemaScopeResponse, AxiosError> & {
    dropdownOptions: FilterAttributeOption[]
} => {
    const swrResponse: SWRResponse<ProfileSchemaScopeResponse, AxiosError> =
        useProfileSchemaByScope(scope, filter, config);

    const dropdownOptions: FilterAttributeOption[] = useMemo(() => {
        if (!swrResponse.data || !scope) return [];

        return toAttributeDropdownOptions(scope, swrResponse.data);
    }, [ swrResponse.data, scope ]);

    return {
        ...swrResponse,
        dropdownOptions
    };
};
