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

import { AppState } from "@wso2is/admin.core.v1/store";
import { useGetOrganizationBreadCrumb } from "@wso2is/admin.organizations.v1/api";
import { BreadcrumbItem } from "@wso2is/admin.organizations.v1/models";
import { IdentityAppsApiException } from "@wso2is/core/exceptions";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { getAuthProtocolMetadata } from "../api/application";
import { AllowedIssuerInterface, OIDCMetadataInterface } from "../models/application-inbound";

/**
 * Return type for the `useAllowedIssuers` hook.
 */
export interface UseAllowedIssuersInterface {
    /**
     * Whether the allowed issuers are being loaded.
     */
    isLoadingTokenEndpoints: boolean;
    /**
     * Map of organization ID to organization name, built from breadcrumb data.
     */
    orgNameMap: Record<string, string>;
    /**
     * Currently selected token endpoint value.
     */
    selectedTokenEndpoint: string;
    /**
     * Setter for the selected token endpoint value.
     */
    setSelectedTokenEndpoint: (value: string) => void;
    /**
     * Deduplicated list of allowed token endpoint issuers.
     */
    tokenEndpoints: AllowedIssuerInterface[];
}

/**
 * Custom hook to fetch and manage allowed token endpoint issuers for sub-organization applications.
 *
 * Fetches the list of allowed issuers from OIDC metadata, optionally merges an existing
 * issuer (e.g., when editing an application), deduplicates the result, builds an
 * organization-name lookup map from the breadcrumb API, and sets the default selection.
 *
 * @param shouldFetch - Set to `true` only when the calling component is in a sub-organization context
 *                      and organization management is enabled. When `false` the hook is a no-op.
 * @param initialIssuer - The issuer already configured on the application (used in the edit form
 *                        so the current value is always present in the list and pre-selected).
 * @returns `UseAllowedIssuersInterface`
 */
const useAllowedIssuers = (
    shouldFetch: boolean,
    initialIssuer?: AllowedIssuerInterface
): UseAllowedIssuersInterface => {
    const { t } = useTranslation();
    const dispatch: Dispatch = useDispatch();

    const currentOrganizationId: string = useSelector(
        (state: AppState) => state.organization.organization.id
    );

    const [ selectedTokenEndpoint, setSelectedTokenEndpoint ] = useState<string>("");
    const [ tokenEndpoints, setTokenEndpoints ] = useState<AllowedIssuerInterface[]>([]);
    const [ isLoadingTokenEndpoints, setIsLoadingTokenEndpoints ] = useState<boolean>(false);
    const [ orgNameMap, setOrgNameMap ] = useState<Record<string, string>>({});

    /**
     * Tracks whether the initial default selection has already been applied.
     * Prevents the default from overriding a user's manual dropdown selection.
     */
    const hasSetInitialSelection: React.MutableRefObject<boolean> = useRef<boolean>(false);

    const { data: breadcrumbData } = useGetOrganizationBreadCrumb(shouldFetch);

    /**
     * Build a map of organizationId to organization name from the breadcrumb data.
     */
    useEffect(() => {
        if (!breadcrumbData || breadcrumbData.length === 0) {
            return;
        }

        const nameMap: Record<string, string> = {};

        breadcrumbData.forEach((item: BreadcrumbItem) => {
            nameMap[item.id] = item.name;
        });
        setOrgNameMap(nameMap);
    }, [ breadcrumbData ]);

    /**
     * Fetch allowed issuers from OIDC metadata, merge with the optional `initialIssuer`
     * (to ensure it always appears in the list), and deduplicate.
     *
     * When `initialIssuer` is provided the selection is set immediately to that value.
     * When it is absent the selection is set to a temporary first-entry fallback; the
     * tenant-aware effect below will replace it once breadcrumb data is also available.
     */
    useEffect(() => {
        if (!shouldFetch) {
            return;
        }

        setIsLoadingTokenEndpoints(true);

        getAuthProtocolMetadata<OIDCMetadataInterface>("oidc")
            .then((response: OIDCMetadataInterface) => {
                const metadataIssuers: AllowedIssuerInterface[] = response?.allowedIssuers ?? [];

                // Prepend the current application issuer so it always appears in the list
                // even if the metadata response no longer includes it.
                const candidates: AllowedIssuerInterface[] = [
                    ...(initialIssuer ? [ initialIssuer ] : []),
                    ...metadataIssuers
                ];

                // Deduplicate by endpoint value, preserving first-seen order.
                const seen: Set<string> = new Set();
                const merged: AllowedIssuerInterface[] = [];

                candidates.forEach((ep: AllowedIssuerInterface) => {
                    if (!seen.has(ep.value)) {
                        seen.add(ep.value);
                        merged.push(ep);
                    }
                });

                setTokenEndpoints(merged);

                if (initialIssuer) {
                    // Pre-select the issuer already configured on the application.
                    setSelectedTokenEndpoint(initialIssuer.value);
                    hasSetInitialSelection.current = true;
                } else {
                    // Temporary fallback; the org-aware effect below will replace this
                    // once currentOrganizationId is available.
                    setSelectedTokenEndpoint(merged[0]?.value ?? "");
                }
            })
            .catch((error: IdentityAppsApiException) => {
                dispatch(
                    addAlert({
                        description: error?.response?.data?.detail ||
                            t("applications:notifications.fetchOIDCIDPConfigs.genericError.description"),
                        level: AlertLevels.ERROR,
                        message: error?.message ||
                            t("applications:notifications.fetchOIDCIDPConfigs.genericError.message")
                    })
                );
            })
            .finally(() => {
                setIsLoadingTokenEndpoints(false);
            });
    }, [ shouldFetch ]);

    /**
     * Once `tokenEndpoints` and `currentOrganizationId` are available, replace the
     * temporary first-entry default with the first issuer that does NOT belong to
     * the current sub-organization.
     *
     * In a sub-org context the allowedIssuers list contains entries from ancestor
     * organizations (e.g. the tenant). Defaulting to the first issuer whose
     * `organizationId` differs from the current org effectively pre-selects the
     * parent/tenant issuer without depending on the breadcrumb ordering.
     *
     * Only runs once per mount (guarded by `hasSetInitialSelection`) and is skipped
     * entirely when `initialIssuer` is already set.
     */
    useEffect(() => {
        if (
            hasSetInitialSelection.current
            || initialIssuer
            || tokenEndpoints.length === 0
            || !currentOrganizationId
        ) {
            return;
        }

        // Default to the first issuer that belongs to a different (parent/tenant) organization.
        const parentIssuer: AllowedIssuerInterface | undefined = tokenEndpoints.find(
            (ep: AllowedIssuerInterface) => ep.organizationId !== currentOrganizationId
        );

        setSelectedTokenEndpoint(parentIssuer?.value ?? tokenEndpoints[0]?.value ?? "");
        hasSetInitialSelection.current = true;
    }, [ tokenEndpoints, currentOrganizationId ]);

    return {
        isLoadingTokenEndpoints,
        orgNameMap,
        selectedTokenEndpoint,
        setSelectedTokenEndpoint,
        tokenEndpoints
    };
};

export default useAllowedIssuers;
