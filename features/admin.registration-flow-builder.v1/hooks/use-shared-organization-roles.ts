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

import { useRequiredScopes } from "@wso2is/access-control";
import { getApplicationList } from "@wso2is/admin.applications.v1/api/application";
import {
    ApplicationListInterface, ApplicationListItemInterface
} from "@wso2is/admin.applications.v1/models/application";
import { ApplicationSharingPolicy, RoleSharingModes } from
    "@wso2is/admin.console-settings.v1/models/shared-access";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import { getSharedOrganizations } from "@wso2is/admin.organizations.v1/api/organization";
import { OrganizationListInterface } from "@wso2is/admin.organizations.v1/models";
import useGetRolesList from "@wso2is/admin.roles.v2/api/use-get-roles-list";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { RolesV2Interface, RolesV2ResponseInterface } from "@wso2is/admin.roles.v2/models/roles";
import { FeatureAccessConfigInterface } from "@wso2is/core/models";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useSWR, { SWRResponse } from "swr";

type SharedRoleInterface = OrganizationListInterface["sharingMode"]["roleSharing"]["roles"][number];

interface SharedApplicationInterface extends OrganizationListInterface {
    applicationId: string;
    audienceType: string;
}

interface SharedOrganizationRolesInterface {
    roles: RolesV2Interface[];
    sharedRoles: RolesV2Interface[];
    hasRoleReadPermission: boolean;
    isLoading: boolean;
    isLoaded: boolean;
    error: unknown;
}

/**
 * Retrieves parent roles shared with future organizations through existing application sharing settings.
 *
 * @param shouldFetch - Whether organization roles are needed.
 * @returns Parent roles, eligible shared roles and their loading status.
 */
const useSharedOrganizationRoles = (shouldFetch: boolean = true): SharedOrganizationRolesInterface => {
    const rolesFeatureConfig: FeatureAccessConfigInterface = useSelector((state: AppState) =>
        state.config?.ui?.features?.userRolesV3?.enabled
            ? state.config.ui.features.userRolesV3
            : state.config?.ui?.features?.userRoles);
    const applicationsEndpoint: string = useSelector((state: AppState) => state.config.endpoints.applications);
    const hasRoleReadPermission: boolean = useRequiredScopes(rolesFeatureConfig?.scopes?.read);
    const [ startIndex, setStartIndex ] = useState<number>(1);
    const [ roles, setRoles ] = useState<RolesV2Interface[]>([]);
    const { data, error, isLoading } = useGetRolesList<RolesV2ResponseInterface>(
        UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT,
        startIndex,
        undefined,
        "users,groups,permissions",
        shouldFetch && hasRoleReadPermission
    );

    useEffect((): void => {
        if (!data?.Resources) {
            return;
        }

        setRoles((previousRoles: RolesV2Interface[]): RolesV2Interface[] => {
            const rolesById: Map<string, RolesV2Interface> = new Map(
                previousRoles.map((role: RolesV2Interface) => [ role.id, role ])
            );

            data.Resources.forEach((role: RolesV2Interface): void => {
                rolesById.set(role.id, role);
            });

            return [ ...rolesById.values() ];
        });

        const nextIndex: number = (data.startIndex ?? 1) + data.Resources.length;

        if (data.Resources.length > 0 && nextIndex <= data.totalResults) {
            setStartIndex(nextIndex);
        }
    }, [ data ]);

    const rolesLoaded: boolean = !!data && !isLoading && !error && roles.length >= data.totalResults;
    const hasOrganizationRoles: boolean = roles.some((role: RolesV2Interface): boolean =>
        role.audience?.type?.toUpperCase() === RoleAudienceTypes.ORGANIZATION);
    const applicationIds: string[] = useMemo((): string[] => [ ...new Set(roles
        .filter((role: RolesV2Interface): boolean =>
            role.audience?.type?.toUpperCase() === RoleAudienceTypes.APPLICATION)
        .map((role: RolesV2Interface): string => role.audience.value).filter(Boolean)) ].sort(), [ roles ]);
    const { data: sharing, error: sharingError, isLoading: sharingLoading }:
        SWRResponse<SharedApplicationInterface[], Error> =
        useSWR<SharedApplicationInterface[], Error>(
            shouldFetch && hasRoleReadPermission && rolesLoaded
                ? [ "organization-role-sharing", applicationsEndpoint, hasOrganizationRoles, ...applicationIds ] : null,
            async (): Promise<SharedApplicationInterface[]> => {
                const applicationAudiences: Map<string, string> = new Map(applicationIds.map(
                    (applicationId: string): [string, string] => [ applicationId, RoleAudienceTypes.APPLICATION ]));

                // Organization-role associations are resolved at runtime, not stored on each role.
                if (hasOrganizationRoles) {
                    let offset: number = 0;
                    let totalResults: number = 0;

                    do {
                        const page: ApplicationListInterface = await getApplicationList(
                            UIConstants.DEFAULT_RESOURCE_LIST_ITEM_LIMIT, offset, undefined, false,
                            "associatedRoles.allowedAudience"
                        );
                        const applications: ApplicationListItemInterface[] = page.applications ?? [];

                        if (applications.length === 0) {
                            break;
                        }
                        applications.forEach((application: ApplicationListItemInterface): void => {
                            if (application.associatedRoles?.allowedAudience?.toUpperCase()
                                === RoleAudienceTypes.ORGANIZATION) {
                                applicationAudiences.set(application.id, RoleAudienceTypes.ORGANIZATION);
                            }
                        });
                        offset += applications.length;
                        totalResults = page.totalResults ?? 0;
                    } while (offset < totalResults);
                }

                return Promise.all([ ...applicationAudiences ].map(
                    async ([ applicationId, audienceType ]: [string, string]): Promise<SharedApplicationInterface> => {
                        const response: { data: OrganizationListInterface } = await getSharedOrganizations(
                            undefined, applicationId,
                            { attributes: "sharingMode", excludedAttributes: "roles", limit: 1, recursive: false }
                        );

                        return { ...response.data, applicationId, audienceType };
                    }
                ));
            },
            { shouldRetryOnError: false }
        );
    const sharedRoles: RolesV2Interface[] = useMemo((): RolesV2Interface[] => roles.filter(
        (role: RolesV2Interface): boolean => !!sharing?.some((application: SharedApplicationInterface): boolean => {
            const sharingMode: OrganizationListInterface["sharingMode"] = application.sharingMode;
            const isAssociated: boolean = role.audience?.type?.toUpperCase() === RoleAudienceTypes.APPLICATION
                ? role.audience.value === application.applicationId &&
                    application.audienceType === RoleAudienceTypes.APPLICATION
                : role.audience?.type?.toUpperCase() === RoleAudienceTypes.ORGANIZATION &&
                    application.audienceType === RoleAudienceTypes.ORGANIZATION;

            if (!isAssociated || sharingMode?.policy !== ApplicationSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS) {
                return false;
            }

            return sharingMode.roleSharing?.mode === RoleSharingModes.ALL ||
                (sharingMode.roleSharing?.mode === RoleSharingModes.SELECTED &&
                    !!sharingMode.roleSharing.roles?.some((sharedRole: SharedRoleInterface): boolean =>
                        sharedRole.displayName === role.displayName &&
                        sharedRole.audience.type.toUpperCase() === role.audience.type.toUpperCase() &&
                        (!sharedRole.audience.display || sharedRole.audience.display === role.audience.display)));
        })
    ), [ roles, sharing ]);

    return {
        error: error || sharingError,
        hasRoleReadPermission,
        isLoaded: shouldFetch && hasRoleReadPermission && rolesLoaded && !!sharing && !sharingError,
        isLoading: !!isLoading || !!sharingLoading || (shouldFetch && hasRoleReadPermission && !error && !rolesLoaded),
        roles,
        sharedRoles
    };
};

export default useSharedOrganizationRoles;
