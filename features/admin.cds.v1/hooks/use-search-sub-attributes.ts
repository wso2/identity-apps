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

import useRequest, {
    RequestConfigInterface, RequestErrorInterface, RequestResultInterface
} from "@wso2is/admin.core.v1/hooks/use-request";
import { store } from "@wso2is/admin.core.v1/store";
import { HttpMethods } from "@wso2is/core/models";

import type { SchemaListingScope } from "../models/profile-attribute-listing";
import type { ProfileSchemaAttribute } from "../models/profile-attributes";

// Scope prefixes that require stripping before building the child filter.
// identity_attributes has no dotted prefix in the filter convention.
const SCOPE_PREFIXES: Partial<Record<SchemaListingScope, string>> = {
    application_data: "application_data.",
    traits: "traits."
};

/**
 * Hook: GET /profile-schema/{scope}?filter=attribute_name+co+{attributeName}.
 *
 * Fetches sub-attributes of a complex attribute by searching for all attribute
 * names that start with `{attributeName}.` within the given scope.
 *
 * The filter is appended directly to the URL string rather than passed via
 * `params`, preventing axios from percent-encoding the `+` separators that
 * the API expects as literal characters (not as %2B).
 *
 * @param scope         - The profile schema scope to query.
 * @param attributeName - The full attribute name whose children to fetch
 *                        (e.g. `traits.address` or `identity_attributes.address`).
 * @param shouldFetch   - Set to false to suspend the request. Defaults to true.
 * @returns SWR response with the matching child attribute list.
 */
export const useSearchSubAttributes = <Error = RequestErrorInterface>(
    scope: SchemaListingScope,
    attributeName: string,
    shouldFetch: boolean = true
): RequestResultInterface<ProfileSchemaAttribute[], Error> => {

    const scopePrefix: string = SCOPE_PREFIXES[scope] ?? "";
    const baseAttrName: string = attributeName.startsWith(scopePrefix)
        ? attributeName.slice(scopePrefix.length)
        : attributeName;

    // Trailing dot ensures only children match, never the parent or siblings.
    const searchPrefix: string = `${scopePrefix}${baseAttrName}.`;

    // Append filter directly to the URL so `+` is preserved as-is.
    // Using params: { filter } would cause axios to encode `+` → `%2B`,
    // which the API does not accept.
    const baseUrl: string = store.getState().config.endpoints.cdsProfileSchema;
    const url: string = `${baseUrl}/${scope}?filter=attribute_name+co+${searchPrefix}`;

    const requestConfig: RequestConfigInterface = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        method: HttpMethods.GET,
        url
    };

    const { data, error, isLoading, isValidating, mutate } = useRequest<
        ProfileSchemaAttribute[],
        Error
    >(
        shouldFetch && Boolean(attributeName) ? requestConfig : null,
        { shouldRetryOnError: false }
    );

    return {
        data: Array.isArray(data) ? data : [],
        error,
        isLoading,
        isValidating,
        mutate
    };
};
