/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import { UserBasicInterface, UserRoleInterface } from "@wso2is/admin.core.v1/models/users";
import { AppState } from "@wso2is/admin.core.v1/store";
import { updateRoleDetails, updateUsersForRole } from "@wso2is/admin.roles.v2/api/roles";
import { PatchRoleDataInterface } from "@wso2is/admin.roles.v2/models/roles";
import { PayloadInterface, PayloadRolesV3Interface } from "@wso2is/admin.users.v1/models/user";
import { FeatureAccessConfigInterface, RolesInterface } from "@wso2is/core/models";
import { AxiosError } from "axios";
import { useSelector } from "react-redux";

/**
 * Props interface of {@link useBulkAssignAdministratorRoles}
 */
export type UseBulkAssignAdministratorRolesInterface = {
    /**
     * Function to assign administrator roles to a user.
     * @param user - User to assign roles to.
     * @param roles - Roles to assign.
     * @param onAdministratorRoleAssignError - Error callback.
     * @param onAdministratorRoleAssignSuccess - Success callback.
     */
    assignAdministratorRoles: (
        user: UserBasicInterface,
        roles: RolesInterface[],
        onAdministratorRoleAssignError: (error: AxiosError) => void,
        onAdministratorRoleAssignSuccess: () => void
    ) => void;
    /**
     * Function to unassign administrator roles from a user.
     * @param user - User to unassign roles from.
     * @param onAdministratorRoleAssignError - Error callback.
     * @param onAdministratorRoleAssignSuccess - Success callback.
     */
    unassignAdministratorRoles: (
        user: UserBasicInterface,
        onAdministratorRoleAssignError: (error: AxiosError) => void,
        onAdministratorRoleAssignSuccess: () => void
    ) => void;
};

/**
 * Hook that handles bulk assigning administrator roles to a user.
 *
 * @param user - User to assign roles to.
 * @param roles - Roles to assign.
 * @param onAdministratorRoleAssignError - Error callback.
 * @param onAdministratorRoleAssignSuccess - Success callback.
 * @returns Bulk assign administrator roles hook.
 */
const useBulkAssignAdministratorRoles = (): UseBulkAssignAdministratorRolesInterface => {
    /**
     * Function to assign administrator roles to a user.
     *
     * @param user - User to assign roles to.
     * @param roles - Roles to assign.
     * @param onAdministratorRoleAssignError - Error callback.
     * @param onAdministratorRoleAssignSuccess - Success callback.
     */

    const roleAssignmentFeatureConfig: FeatureAccessConfigInterface = useSelector(
        (state: AppState) => state?.config?.ui?.features?.roleAssignments);
    const hasRoleV3UpdateScopes: boolean = useRequiredScopes(roleAssignmentFeatureConfig?.scopes?.update);

    const updateUserRoleAssignmentFunction: (
        roleId: string,
        data: PayloadInterface | PayloadRolesV3Interface | PatchRoleDataInterface
    ) => Promise<void> = hasRoleV3UpdateScopes ? updateUsersForRole : updateRoleDetails;

    const assignAdministratorRoles = async (
        user: UserBasicInterface,
        roles: RolesInterface[],
        onAdministratorRoleAssignError: (error: AxiosError) => void,
        onAdministratorRoleAssignSuccess: () => void
    ) => {
        const payload: PayloadRolesV3Interface | PayloadInterface = hasRoleV3UpdateScopes ? {
            Operations: [
                {
                    op: "add",
                    value: [
                        {
                            display: user.userName,
                            value: user.id
                        }
                    ]
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        } : {
            Operations: [
                {
                    op: "add",
                    value: {
                        users: [
                            {
                                display: user.userName,
                                value: user.id
                            }
                        ]
                    }
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        const roleIds: string[] = roles.map((role: RolesInterface) => role.id);

        const updateRolePromises: Promise<void>[] = roleIds.map((roleId: string) => {
            return updateUserRoleAssignmentFunction(roleId, payload);
        });

        try {
            // Wait for all role update promises to resolve or reject.
            await Promise.all(updateRolePromises);

            onAdministratorRoleAssignSuccess();
        } catch (error) {
            onAdministratorRoleAssignError(error);
        }
    };

    /**
     * Function to unassign administrator roles from a user.
     *
     * @param user - User to unassign roles from.
     * @param onAdministratorRoleAssignError - Error callback.
     * @param onAdministratorRoleAssignSuccess - Success callback.
     */
    const unassignAdministratorRoles = async (
        user: UserBasicInterface,
        onAdministratorRoleUnassignError: (error: AxiosError) => void,
        onAdministratorRoleUnassignSuccess: () => void
    ) => {
        const payload: PatchRoleDataInterface = hasRoleV3UpdateScopes ? {
            Operations: [
                {
                    op: "remove",
                    path: `value eq ${user.id}`,
                    value: {}
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        } : {
            Operations: [
                {
                    op: "remove",
                    path: `users[value eq ${user.id}]`,
                    value: {}
                }
            ],
            schemas: [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };

        const roleIds: string[] = user.roles.map((role: UserRoleInterface) => role.value);

        const updateRolePromises: Promise<void>[] = roleIds.map((roleId: string) => {
            return updateUserRoleAssignmentFunction(roleId, payload);
        });

        try {
            // Wait for all role update promises to resolve or reject.
            await Promise.all(updateRolePromises);

            onAdministratorRoleUnassignSuccess();
        } catch (error) {
            onAdministratorRoleUnassignError(error);
        }
    };

    return {
        assignAdministratorRoles,
        unassignAdministratorRoles
    };
};

export default useBulkAssignAdministratorRoles;
