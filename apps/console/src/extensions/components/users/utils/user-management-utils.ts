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

import { ProfileSchemaInterface } from "@wso2is/core/models";
import { store } from "../../../../features/core";
import {
    UserManagementConstants
} from "../../../../features/users/constants/user-management-constants";
import { UserBasicInterface } from "../../../../features/users/models";
import { UserManagementUtils as UserManagementUtilsExt } from "../../../../features/users/utils";

/**
 * Utility class for user management operations.
 */
export class UserManagementUtils extends UserManagementUtilsExt {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
        super();
    }

    /**
     * Resolves the sub header of the user list item.
     *
     * @param user - User object.
     * @returns Sub header of the user list item.
     */
    public static resolveUserListSubheader(user: UserBasicInterface): string {
        if (UserManagementUtils.isDisplayNameEnabled(store.getState()
            .profile.profileSchemas, user.displayName)) {
            return user.displayName;
        }

        if (user?.name?.givenName && user?.name?.familyName) {
            return user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "");
        }

        if (user?.name?.givenName) {
            return user.name.givenName;
        }

        if (user?.name?.familyName) {
            return user.name.familyName;
        }
    }

    /**
     * Resolves the header of the user list item.
     *
     * @param user - User object.
     * @returns Header of the user list item.
     */
    public static resolveUserListHeader(user: UserBasicInterface): string {
        if (UserManagementUtils.isDisplayNameEnabled(store.getState()
            .profile.profileSchemas, user.displayName)) {
            return user.displayName;
        } else {
            if (user.name && user.name.givenName) {
                return user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "");
            } else {
                return UserManagementUtils.resolveUserListSubheader(user);
            }
        }
    }

    /**
    * Checks if the display name attribute is enabled or not
    *
    * @returns boolean
    * @param profileSchema - The schema
    * @param displayName - displayName
    */
    public static isDisplayNameEnabled(profileSchema: ProfileSchemaInterface[], displayName?: string): boolean {
        if (!displayName) {
            return false;
        }

        return profileSchema
            .some((schemaItem: ProfileSchemaInterface) =>
                schemaItem.name === UserManagementConstants.SCIM2_SCHEMA_DICTIONARY.get("DISPLAY_NAME"));
    }
}
