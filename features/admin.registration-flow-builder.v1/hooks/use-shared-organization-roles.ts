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
import { ApplicationSharingPolicy, RoleSharingModes } from
    "@wso2is/admin.console-settings.v1/models/shared-access";
import { UIConstants } from "@wso2is/admin.core.v1/constants/ui-constants";
import { AppState } from "@wso2is/admin.core.v1/store";
import { getSharedOrganizations } from "@wso2is/admin.organizations.v1/api/organization";
import { OrganizationListInterface } from "@wso2is/admin.organizations.v1/models";
import useGetRolesList from "@wso2is/admin.roles.v2/api/use-get-roles-list";
import { RoleAudienceTypes } from "@wso2is/admin.roles.v2/constants/role-constants";
import { RolesV2Interface, RolesV2ResponseInterface } from "@wso2is/admin.roles.v2/models/roles";
import { FeatureAccessConfigInterface, RoleConnectedApplicationInterface, RolesInterface } from "@wso2is/core/models";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useSWR, { SWRResponse } from "swr";

type OrganizationRoleInterface = RolesV2Interface & Pick<RolesInterface, "associatedApplications">;
type SharedRoleInterface = OrganizationListInterface["sharingMode"]["roleSharing"]["roles"][number];

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
    const [ roles, setRoles ] = useState<OrganizationRoleInterface[]>([]);
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

        setRoles((previousRoles: OrganizationRoleInterface[]): OrganizationRoleInterface[] => {
            const rolesById: Map<string, OrganizationRoleInterface> = new Map(
                previousRoles.map((role: OrganizationRoleInterface) => [ role.id, role ])
            );

            data.Resources.forEach((role: OrganizationRoleInterface): void => {
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
    const applicationIds: string[] = useMemo((): string[] => [ ...new Set(roles.flatMap(
        (role: OrganizationRoleInterface): string[] =>
            (role.audience?.type?.toUpperCase() === RoleAudienceTypes.APPLICATION ? [ role.audience.value ] :
                (role.associatedApplications ?? []).map((app: RoleConnectedApplicationInterface): string => app.value))
                .filter(Boolean)
    )) ].sort(), [ roles ]);
    const { data: sharing, error: sharingError, isLoading: sharingLoading }:
        SWRResponse<OrganizationListInterface[], Error> =
        useSWR<OrganizationListInterface[], Error>(
            shouldFetch && hasRoleReadPermission && rolesLoaded
                ? [ "organization-role-sharing", applicationsEndpoint, ...applicationIds ] : null,
            (): Promise<OrganizationListInterface[]> => Promise.all(applicationIds.map(
                async (applicationId: string): Promise<OrganizationListInterface> => {
                    const response: { data: OrganizationListInterface } = await getSharedOrganizations(
                        undefined, applicationId,
                        { attributes: "sharingMode", excludedAttributes: "roles", limit: 1, recursive: false }
                    );

                    return response.data;
                }
            )),
            { shouldRetryOnError: false }
        );
    const sharedRoles: RolesV2Interface[] = useMemo((): RolesV2Interface[] => roles.filter(
        (role: OrganizationRoleInterface): boolean => applicationIds.some((applicationId: string, index: number) => {
            const sharingMode: OrganizationListInterface["sharingMode"] = sharing?.[index]?.sharingMode;
            const isAssociated: boolean = role.audience?.type?.toUpperCase() === RoleAudienceTypes.APPLICATION
                ? role.audience.value === applicationId
                : !!role.associatedApplications?.some((app: RoleConnectedApplicationInterface) =>
                    app.value === applicationId);

            if (!isAssociated || sharingMode?.policy !== ApplicationSharingPolicy.ALL_EXISTING_AND_FUTURE_ORGS) {
                return false;
            }

            return sharingMode.roleSharing?.mode === RoleSharingModes.ALL ||
                (sharingMode.roleSharing?.mode === RoleSharingModes.SELECTED &&
                    !!sharingMode.roleSharing.roles?.some((sharedRole: SharedRoleInterface): boolean =>
                        sharedRole.displayName === role.displayName &&
                        sharedRole.audience.type.toUpperCase() === role.audience.type.toUpperCase() &&
                        sharedRole.audience.display === role.audience.display));
        })
    ), [ roles, applicationIds, sharing ]);

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
