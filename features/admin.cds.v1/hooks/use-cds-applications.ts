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

import { getApplicationList } from "@wso2is/admin.applications.v1/api/application";
import {
    ApplicationListInterface,
    ApplicationListItemInterface
} from "@wso2is/admin.applications.v1/models/application";
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CDSApplicationIdentifierType } from "../models/config";
import { getCDSApplicationIdentifierType } from "../utils/application-identifier-utils";

/**
 * An application enriched with the identifier used when communicating with CDS APIs.
 */
export interface CDSApplicationInterface {
    /**
     * Identity Server application UUID.
     */
    id: string;
    /**
     * Application display name.
     */
    name: string;
    /**
     * Identifier submitted to CDS APIs. Resolved based on the configured
     * CDS application identifier type: the app UUID in `app_id` mode, or the
     * OAuth client ID (falling back to the SAML issuer) in `client_id` mode.
     */
    identifier: string;
}

interface UseCDSApplicationsReturn {
    /**
     * Applications with a resolvable CDS identifier.
     */
    applications: CDSApplicationInterface[];
    /**
     * Resolves a CDS application identifier (app UUID, client ID or issuer)
     * to the application display name. Falls back to the identifier itself
     * when the application cannot be resolved.
     */
    getApplicationDisplayName: (identifier: string) => string;
    isLoading: boolean;
}

/**
 * Number of applications fetched per page when resolving the full list.
 */
const APPLICATION_LIST_PAGE_SIZE: number = 100;

/**
 * Fetches all applications by paginating through the application list API
 * until `totalResults` is covered.
 *
 * @returns All applications with client ID and issuer attributes.
 */
const fetchAllApplications: () => Promise<ApplicationListItemInterface[]> =
    async (): Promise<ApplicationListItemInterface[]> => {
        const allApplications: ApplicationListItemInterface[] = [];
        let offset: number = 0;
        let totalResults: number = 0;

        do {
            const page: ApplicationListInterface = await getApplicationList(
                APPLICATION_LIST_PAGE_SIZE,
                offset,
                null,
                true,
                "clientId,issuer"
            );
            const pageApplications: ApplicationListItemInterface[] = page?.applications ?? [];

            if (pageApplications.length === 0) {
                break;
            }

            allApplications.push(...pageApplications);
            totalResults = page?.totalResults ?? 0;
            offset += pageApplications.length;
        } while (offset < totalResults);

        return allApplications;
    };

/**
 * Hook to fetch applications for CDS application data operations.
 *
 * Provides the config-aware identifier to submit to CDS APIs and a resolver
 * to always display application names in the UI regardless of the identifier
 * type stored in CDS.
 *
 * @param shouldFetch - Should fetch the application list.
 * @returns Applications, a display-name resolver and the loading state.
 */
export const useCDSApplications = (shouldFetch: boolean = true): UseCDSApplicationsReturn => {

    const identifierType: CDSApplicationIdentifierType = getCDSApplicationIdentifierType();

    const [ applicationList, setApplicationList ] = useState<ApplicationListItemInterface[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(shouldFetch);
    const hasFetchedRef: MutableRefObject<boolean> = useRef<boolean>(false);

    useEffect(() => {
        if (!shouldFetch || hasFetchedRef.current) {
            return;
        }

        hasFetchedRef.current = true;

        let isCancelled: boolean = false;

        setIsLoading(true);

        fetchAllApplications()
            .then((fetchedApplications: ApplicationListItemInterface[]): void => {
                if (!isCancelled) {
                    setApplicationList(fetchedApplications);
                }
            })
            // Fail silently - the UI falls back to displaying raw identifiers.
            // Clear the latch so a later shouldFetch change can retry the fetch.
            .catch((): void => {
                hasFetchedRef.current = false;
            })
            .finally((): void => {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            });

        return (): void => {
            isCancelled = true;
        };
    }, [ shouldFetch ]);

    const applications: CDSApplicationInterface[] = useMemo((): CDSApplicationInterface[] => {
        return applicationList
            .map((app: ApplicationListItemInterface): CDSApplicationInterface => ({
                id: app.id ?? "",
                identifier: identifierType === CDSApplicationIdentifierType.APP_ID
                    ? app.id ?? ""
                    : app.clientId || app.issuer || "",
                name: app.name
            }))
            .filter((app: CDSApplicationInterface): boolean => Boolean(app.identifier));
    }, [ applicationList, identifierType ]);

    // Index names by every known identifier so display resolution works for
    // both identifier modes and for data stored before a mode switch.
    const displayNamesByIdentifier: Map<string, string> = useMemo((): Map<string, string> => {
        const names: Map<string, string> = new Map<string, string>();

        applicationList.forEach((app: ApplicationListItemInterface): void => {
            if (app.id) names.set(app.id, app.name);
            if (app.clientId) names.set(app.clientId, app.name);
            if (app.issuer) names.set(app.issuer, app.name);
        });

        return names;
    }, [ applicationList ]);

    const getApplicationDisplayName: (identifier: string) => string = useCallback(
        (identifier: string): string =>
            displayNamesByIdentifier.get(identifier) ?? identifier,
        [ displayNamesByIdentifier ]
    );

    return {
        applications,
        getApplicationDisplayName,
        isLoading
    };
};
