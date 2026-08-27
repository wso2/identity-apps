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

import isEmpty from "lodash-es/isEmpty";
import { FederatedAuthenticatorConstants } from "../constants/federated-authenticator-constants";

/**
 * Reserved Microsoft tenant keywords accepted in addition to a Directory (tenant) ID or domain.
 */
const MICROSOFT_TENANT_KEYWORDS: string[] = [ "common", "organizations", "consumers" ];

/**
 * Matches a Microsoft Directory (tenant) ID in GUID format.
 */
const MICROSOFT_TENANT_GUID_REGEX: RegExp =
    /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

/**
 * Matches a tenant domain such as `contoso.onmicrosoft.com`.
 */
const MICROSOFT_TENANT_DOMAIN_REGEX: RegExp =
    /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

/**
 * Validates a Microsoft Directory (tenant) value. Whitespace and unrecognised values are rejected;
 * the reserved keywords (`common`, `organizations`, `consumers`), a GUID, or a domain are accepted.
 *
 * @param value - The user-entered tenant value.
 * @returns `true` when the value is a valid tenant segment.
 */
export const isMicrosoftTenantValid = (value: string): boolean => {
    if (isEmpty(value) || value.trim() !== value) {
        return false;
    }

    if (MICROSOFT_TENANT_KEYWORDS.includes(value.toLowerCase())) {
        return true;
    }

    return MICROSOFT_TENANT_GUID_REGEX.test(value) || MICROSOFT_TENANT_DOMAIN_REGEX.test(value);
};

/**
 * Reads the tenant segment from a Microsoft authorization/token endpoint URL.
 *
 * @param endpointUrl - An endpoint such as `https://login.microsoftonline.com/{tenant}/oauth2/...`.
 * @returns The tenant segment.
 */
export const extractMicrosoftTenant = (endpointUrl: string): string => {
    const match: RegExpMatchArray = endpointUrl?.match(/login\.microsoftonline\.com\/([^/?#]+)/);

    return match?.[1] ?? FederatedAuthenticatorConstants.MICROSOFT_DEFAULT_TENANT;
};

/**
 * Builds a Microsoft endpoint for the given tenant. The existing endpoint's tenant segment is
 * swapped (preserving the rest of the URL); the v2.0 template is used only when no endpoint is set.
 *
 * @param existingValue - The currently configured endpoint URL, if any.
 * @param fallbackTemplate - The `{tenant}` template to use when `existingValue` is empty.
 * @param tenant - The tenant segment to apply.
 * @returns The endpoint URL with the tenant applied.
 */
export const applyMicrosoftTenantToEndpoint = (
    existingValue: string,
    fallbackTemplate: string,
    tenant: string
): string => {
    if (isEmpty(existingValue)) {
        return fallbackTemplate.replace("{tenant}", tenant);
    }

    return existingValue.replace(
        FederatedAuthenticatorConstants.MICROSOFT_TENANT_SEGMENT_REGEX,
        `$1${ tenant }`
    );
};
