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

import { BasicRoleInterface } from "../models/roles";

/**
 * Add a role to a role list unless a role with the same ID is already in it.
 *
 * @param roles - Role list.
 * @param role - Role to add.
 * @returns The role list including the given role.
 */
export const addRoleIfMissing = (
    roles: BasicRoleInterface[] | undefined,
    role: BasicRoleInterface | undefined
): BasicRoleInterface[] => {
    const currentRoles: BasicRoleInterface[] = roles ?? [];

    if (!role?.id || currentRoles.some((currentRole: BasicRoleInterface): boolean => currentRole.id === role.id)) {
        return currentRoles;
    }

    return [ ...currentRoles, role ];
};

/**
 * Add the listed roles that are not known yet, such as roles created by another admin or in another tab.
 *
 * An APPLICATION audience role is associated with its application when it is created, so a role list sent
 * in an application update must keep these roles, or the server deletes them. Known roles are not added, so
 * a role the user removed from the selection stays removed. The listing is only used to add roles, never to
 * drop them, so a partial listing cannot remove a valid role.
 *
 * @param roles - Role list to add to.
 * @param listedRoles - Roles from the listing.
 * @param knownRoleIds - IDs of the roles that are already accounted for.
 * @returns The role list including the listed roles that were not known.
 */
export const addNewlyListedRoles = (
    roles: BasicRoleInterface[] | undefined,
    listedRoles: BasicRoleInterface[],
    knownRoleIds: ReadonlySet<string>
): BasicRoleInterface[] => {
    return listedRoles
        .filter((role: BasicRoleInterface): boolean => !knownRoleIds.has(role.id))
        .reduce(
            (result: BasicRoleInterface[], role: BasicRoleInterface): BasicRoleInterface[] =>
                addRoleIfMissing(result, role),
            roles ?? []
        );
};
