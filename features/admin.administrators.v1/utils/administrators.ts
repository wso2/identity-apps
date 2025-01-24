/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
import {
    UserBasicInterface,
    UserRoleInterface
} from "@wso2is/admin.core.v1";
import { administratorConfig } from "@wso2is/admin.extensions.v1/configs/administrator";
import { SCIMConfigs } from "@wso2is/admin.extensions.v1/configs/scim";
import { UserAccountTypes } from "@wso2is/admin.users.v1/constants/user-management-constants";

/**
 * Checks whether administrator role is present in the user.
 * @param user - user to check if the user is an admin
 * @returns boolean - true if the user is an admin.
 */
export const isAdminUser = (user: UserBasicInterface): boolean => {
    if (!user?.roles) {
        return false;
    }

    return user.roles.some((role: UserRoleInterface) =>
        role.display === administratorConfig.adminRoleName
    );
};

/**
 * Checks whether the user is the owner of the tenant.
 * @param user - user to check if the user is the owner
 * @returns boolean - true if the user is the owner.
 */
export const isOwner = (user: UserBasicInterface):boolean =>
    user[ SCIMConfigs.scim.systemSchema ]?.userAccountType === UserAccountTypes.OWNER;

/**
 * Checks whether the user is a collaborator.
 * Collaborator users does not have a username with a domain separeated by a `/`.
 * primary/username is NOT a collaborator user.
 *
 * @param user - user to check if the user is a collaborator
 * @returns boolean - true if the user is a collaborator.
 */
export const isCollaboratorUser = (user: UserBasicInterface): boolean =>
    user?.userName?.split("/")?.length === 1;
