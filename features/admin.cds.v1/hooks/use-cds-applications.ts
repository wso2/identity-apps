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
    AdvancedConfigurationsInterface,
    ApplicationListInterface,
    ApplicationListItemInterface,
    additionalSpProperty
} from "@wso2is/admin.applications.v1/models/application";
import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { CDSApplicationIdentifierType } from "../models/config";
import { getCDSApplicationIdentifierType } from "../utils/application-identifier-utils";

/**
 * An item of the application list with its advanced configurations, which the list returns when
 * the request asks for them. A shared app of a child organization has the main app properties there.
 */
type ApplicationListItem = ApplicationListItemInterface & {
    advancedConfigurations?: AdvancedConfigurationsInterface;
};

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
     * while the list loads or when the request fails, and to an "Unknown
     * application" label with the identifier when the list has no such app.
     */
    getApplicationDisplayName: (identifier: string) => string;
    /**
     * Organization management: true when the application list request fails.
     */
    isApplicationsRequestFailed: boolean;
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
const fetchAllApplications: () => Promise<ApplicationListItem[]> =
    async (): Promise<ApplicationListItem[]> => {
        const allApplications: ApplicationListItem[] = [];
        let offset: number = 0;
        let totalResults: number = 0;

        do {
            const page: ApplicationListInterface = await getApplicationList(
                APPLICATION_LIST_PAGE_SIZE,
                offset,
                null,
                true,
                "advancedConfigurations,clientId,issuer"
            );
            const pageApplications: ApplicationListItem[] = (page?.applications ?? []) as ApplicationListItem[];

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
 * Returns the identifier of the main app of a shared (fragment) app of a child organization. CDS keys
 * the application data of a shared app by the main app in every organization. IS adds the
 * main app ID (`mainApplicationId`) to each shared app.
 *
 * @param app - The application.
 * @param identifierType - The identifier type of the deployment.
 * @returns The identifier of the main app, or undefined for an app that is not shared.
 */
const mainApplicationIdentifierOf = (app: ApplicationListItem,
    identifierType: CDSApplicationIdentifierType): string | undefined => {
    if (!app?.advancedConfigurations?.fragment) {
        return undefined;
    }
    const name: string = identifierType === CDSApplicationIdentifierType.APP_ID
        ? "mainApplicationId"
        : "mainApplicationClientId";

    return app.advancedConfigurations.additionalSpProperties
        ?.find((property: additionalSpProperty) => property.name === name)?.value;
};

/**
 * Hook to fetch applications for CDS application data operations.
 *
 * Provides the config-aware identifier to submit to CDS APIs and a resolver
 * to always display application names in the UI regardless of the identifier
 * type stored in CDS.
 *
 * @param shouldFetch - Should fetch the application list.
 * @returns Applications, a display-name resolver, and the loading and error states.
 */
export const useCDSApplications = (shouldFetch: boolean = true): UseCDSApplicationsReturn => {

    const { t } = useTranslation();

    const identifierType: CDSApplicationIdentifierType = getCDSApplicationIdentifierType();

    const [ applicationList, setApplicationList ] = useState<ApplicationListItem[]>([]);
    const [ isLoading, setIsLoading ] = useState<boolean>(shouldFetch);
    const [ isApplicationsRequestFailed, setIsApplicationsRequestFailed ] = useState<boolean>(false);
    const [ isLoaded, setIsLoaded ] = useState<boolean>(false);
    const hasFetchedRef: MutableRefObject<boolean> = useRef<boolean>(false);

    useEffect(() => {
        if (!shouldFetch || hasFetchedRef.current) {
            return;
        }

        hasFetchedRef.current = true;

        let isCancelled: boolean = false;

        setIsLoading(true);
        setIsApplicationsRequestFailed(false);
        setIsLoaded(false);

        fetchAllApplications()
            .then((fetchedApplications: ApplicationListItem[]): void => {
                if (!isCancelled) {
                    setApplicationList(fetchedApplications);
                    setIsLoaded(true);
                }
            })
            // The UI falls back to displaying raw identifiers.
            // Clear the latch so a later shouldFetch change can retry the fetch.
            .catch((): void => {
                hasFetchedRef.current = false;
                if (!isCancelled) {
                    setIsApplicationsRequestFailed(true);
                }
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
        const identifierOf = (app: ApplicationListItem): string => {
            const mainIdentifier: string | undefined = mainApplicationIdentifierOf(app, identifierType);

            if (identifierType === CDSApplicationIdentifierType.APP_ID) {
                // Organization management: CDS rejects the ID of a shared app (400). A shared app without the main app
                // ID has no valid identifier, so it is left out.
                return (app.advancedConfigurations?.fragment ? mainIdentifier : app.id) ?? "";
            }

            return mainIdentifier ?? (app.clientId || app.issuer || "");
        };

        return applicationList
            .map((app: ApplicationListItem): CDSApplicationInterface => ({
                id: app.id ?? "",
                identifier: identifierOf(app),
                name: app.name
            }))
            .filter((app: CDSApplicationInterface): boolean => Boolean(app.identifier));
    }, [ applicationList, identifierType ]);

    // Index names by every known identifier so display resolution works for
    // both identifier modes and for data stored before a mode switch.
    const displayNamesByIdentifier: Map<string, string> = useMemo((): Map<string, string> => {
        const names: Map<string, string> = new Map<string, string>();

        applicationList.forEach((app: ApplicationListItem): void => {
            if (app.id) names.set(app.id, app.name);
            if (app.clientId) names.set(app.clientId, app.name);
            if (app.issuer) names.set(app.issuer, app.name);
            // A shared app of a child organization: the data is keyed by the main app.
            [ "mainApplicationId", "mainApplicationClientId" ].forEach((name: string) => {
                const value: string = app.advancedConfigurations?.additionalSpProperties
                    ?.find((property: additionalSpProperty) => property.name === name)?.value;

                if (app.advancedConfigurations?.fragment && value) names.set(value, app.name);
            });
        });

        return names;
    }, [ applicationList ]);

    const getApplicationDisplayName: (identifier: string) => string = useCallback(
        (identifier: string): string => {
            const name: string | undefined = displayNamesByIdentifier.get(identifier);

            if (name) return name;
            // Organization management: say so only when the list is loaded and has no app with the identifier.
            if (!isLoaded || !identifier) return identifier;

            return t("customerDataService:unknownApplication", { identifier });
        },
        [ displayNamesByIdentifier, isLoaded, t ]
    );

    return {
        applications,
        getApplicationDisplayName,
        isApplicationsRequestFailed,
        isLoading
    };
};
