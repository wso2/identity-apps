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

import { BasicRoleInterface, RolesV2Interface, RolesV2ResponseInterface } from "../models/roles";

/**
 * Collect every role from a paginated roles listing.
 *
 * Pages are requested until the reported `totalResults` is reached. If the server does not report a total,
 * a page shorter than the page size marks the end. Paging also stops when a page brings no new roles, so a
 * server that ignores `startIndex` cannot cause an endless loop.
 *
 * @param fetchPage - Fetches the page that starts at the given 1 based index with the given page size.
 * @param pageSize - Number of roles to request per page.
 * @returns A promise containing the roles from all the pages.
 */
export const fetchAllRolePages = async (
    fetchPage: (startIndex: number, count: number) => Promise<RolesV2ResponseInterface>,
    pageSize: number
): Promise<RolesV2Interface[]> => {
    const roles: RolesV2Interface[] = [];
    const roleIds: Set<string> = new Set<string>();
    let startIndex: number = 1;
    let hasMoreRoles: boolean = true;

    while (hasMoreRoles) {
        const response: RolesV2ResponseInterface = await fetchPage(startIndex, pageSize);
        const page: RolesV2Interface[] = response?.Resources ?? [];
        const totalResults: number | undefined = response?.totalResults;
        let addedRoleCount: number = 0;

        page.forEach((role: RolesV2Interface) => {
            if (role?.id && !roleIds.has(role.id)) {
                roleIds.add(role.id);
                roles.push(role);
                addedRoleCount++;
            }
        });

        startIndex += page.length;

        hasMoreRoles = addedRoleCount > 0 && (totalResults !== undefined
            ? roles.length < totalResults
            : page.length >= pageSize);
    }

    return roles;
};

/**
 * Add a role to the selected roles unless it is already selected.
 *
 * @param selectedRoles - Currently selected roles.
 * @param role - Role to add.
 * @returns The selected roles including the given role.
 */
export const addRoleToSelection = (
    selectedRoles: BasicRoleInterface[] | undefined,
    role: BasicRoleInterface | undefined
): BasicRoleInterface[] => {
    const currentRoles: BasicRoleInterface[] = selectedRoles ?? [];

    if (!role?.id || currentRoles.some((selectedRole: BasicRoleInterface) => selectedRole.id === role.id)) {
        return currentRoles;
    }

    return [ ...currentRoles, role ];
};

/**
 * Drop selected roles that no longer exist, for example roles deleted elsewhere after the page loaded.
 *
 * `existingRoles` must be the complete role list of the audience, otherwise valid roles are dropped.
 *
 * @param selectedRoles - Currently selected roles.
 * @param existingRoles - Complete list of roles that exist for the audience.
 * @returns The selected roles that still exist.
 */
export const removeDeletedRolesFromSelection = (
    selectedRoles: BasicRoleInterface[] | undefined,
    existingRoles: BasicRoleInterface[]
): BasicRoleInterface[] => {
    const existingRoleIds: Set<string> = new Set<string>(
        existingRoles.map((role: BasicRoleInterface) => role.id)
    );

    return (selectedRoles ?? []).filter((role: BasicRoleInterface) => existingRoleIds.has(role.id));
};
