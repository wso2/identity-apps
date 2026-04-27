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
import { getAssociatedTenants } from "@wso2is/admin.tenants.v1/api/tenants";
import { TenantInfo, TenantRequestResponse } from "@wso2is/admin.tenants.v1/models/tenant";
import { MultiValueAttributeInterface, ProfileInfoInterface } from "@wso2is/core/models";
import moesif from "moesif-browser-js";
import React, { FunctionComponent, PropsWithChildren, ReactElement, useCallback, useEffect, useMemo, useRef }
    from "react";
import { useSelector } from "react-redux";
import { getScimUserId } from "../api/get-scim-user-id";
import MoesifAnalyticsContext, { MoesifAnalyticsContextInterface } from "../context/moesif-analytics-context";

/**
 * Provider that initializes Moesif analytics SDK and exposes a `track()` function
 * to all child components via React context.
 *
 * - Initializes Moesif on mount if `moesifApplicationId` is configured in deployment config.
 * - User and company identification is deferred until the first `track()` call to avoid
 *   unnecessary API calls when no analytics events are fired in a session.
 */
const MoesifAnalyticsProvider: FunctionComponent<PropsWithChildren> = (
    props: PropsWithChildren
): ReactElement => {
    const { children } = props;

    const moesifApplicationId: string = useSelector((state: AppState) => {
        const extensions: Record<string, unknown> =
            (state?.config?.deployment?.extensions as Record<string, unknown>) ?? {};
        const analytics: Record<string, unknown> =
            (extensions?.analytics as Record<string, unknown>) ?? {};
        const moesifConfig: Record<string, unknown> =
            (analytics?.moesif as Record<string, unknown>) ?? {};

        return (moesifConfig?.applicationId as string) || "";
    });
    const tenantDomain: string = useSelector((state: AppState) =>
        state?.auth?.tenantDomain || ""
    );
    const profileInfo: ProfileInfoInterface = useSelector((state: AppState) =>
        state.profile.profileInfo
    );

    const isInitializedRef: React.MutableRefObject<boolean> = useRef<boolean>(false);
    const isIdentifiedRef: React.MutableRefObject<boolean> = useRef<boolean>(false);
    const isIdentifyingRef: React.MutableRefObject<boolean> = useRef<boolean>(false);

    // Initialize Moesif SDK on mount if application ID is configured.
    useEffect(() => {
        if (!moesifApplicationId) {
            return;
        }

        try {
            moesif.init({
                applicationId: moesifApplicationId,
                disableFetch: true
            });

            isInitializedRef.current = true;
        } catch (_error: unknown) {
            isInitializedRef.current = false;
        }
    }, []);

    /**
     * Resolves the primary email from the user's SCIM2 profile.
     */
    const resolveUserEmail: () => string = useCallback((): string => {
        if (!profileInfo?.emails?.length) {
            return "";
        }

        const emails: (string | (MultiValueAttributeInterface & { primary?: boolean }))[] =
            profileInfo.emails as (string | (MultiValueAttributeInterface & { primary?: boolean }))[];

        for (const email of emails) {
            if (typeof email === "object" && email?.primary && email?.value) {
                return email.value;
            }
        }

        for (const email of emails) {
            if (typeof email === "string" && email) {
                return email;
            }
        }

        for (const email of emails) {
            if (typeof email === "object" && email?.value) {
                return email.value;
            }
        }

        return "";
    }, [ profileInfo?.emails ]);

    /**
     * Lazily identifies the current user and company with Moesif.
     * Called on the first `track()` invocation to avoid API calls when no events are fired.
     */
    const identifyUserAndCompany: () => void = useCallback((): void => {
        if (isIdentifiedRef.current || isIdentifyingRef.current) {
            return;
        }

        isIdentifyingRef.current = true;

        const email: string = resolveUserEmail();

        getScimUserId()
            .then((scimUserId: string): void => {
                if (scimUserId) {
                    moesif.identifyUser(scimUserId, email ? { email } : undefined);
                }
            })
            .catch((): void => {
                // User ID fetch failed — analytics will work without User ID.
            });

        getAssociatedTenants(undefined, 15, 0)
            .then((response: TenantRequestResponse): void => {
                const currentTenant: TenantInfo | undefined = response?.associatedTenants?.find(
                    (tenant: TenantInfo) => tenant.domain === tenantDomain
                );

                if (currentTenant?.id) {
                    moesif.identifyCompany(currentTenant.id);
                }
            })
            .catch((): void => {
                // Tenant UUID fetch failed — analytics will work without Company ID.
            });

        isIdentifiedRef.current = true;
    }, [ tenantDomain, resolveUserEmail ]);

    /**
     * Fires a Moesif action event with optional metadata.
     * On the first call, lazily triggers user and company identification.
     */
    const track: (eventName: string, metadata?: Record<string, unknown>) => void = useCallback(
        (eventName: string, metadata?: Record<string, unknown>): void => {
            if (!isInitializedRef.current) {
                return;
            }

            if (!isIdentifiedRef.current) {
                identifyUserAndCompany();
            }

            try {
                moesif.track(eventName, metadata);
            } catch (_error: unknown) {
                // Analytics failures must never block application functionality.
            }
        },
        [ identifyUserAndCompany ]
    );

    const contextValue: MoesifAnalyticsContextInterface = useMemo(
        (): MoesifAnalyticsContextInterface => ({
            isEnabled: !!moesifApplicationId,
            track
        }),
        [ moesifApplicationId, track ]
    );

    return (
        <MoesifAnalyticsContext.Provider value={ contextValue }>
            { children }
        </MoesifAnalyticsContext.Provider>
    );
};

export default MoesifAnalyticsProvider;
