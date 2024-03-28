/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
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

import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import { ProfileInfoInterface, ProfileSchemaInterface } from "@wso2is/core/models";
import { administratorConfig } from "../../../extensions/configs/administrator";
import { UserRoleInterface } from "../../admin-core-v1/models";
import { store } from "../../admin-core-v1/store";
import {
    ValidationConfInterface,
    ValidationDataInterface,
    ValidationFormInterface,
    ValidationPropertyInterface
} from "../../validation/models";
import { UserManagementConstants } from "../constants/user-management-constants";
import { MultipleInviteMode, MultipleInvitesDisplayNames, UserBasicInterface } from "../models";

/**
 * Utility class for user management operations.
 */
export class UserManagementUtils {
    /**
     * Check if a user is the authenticated user.
     *
     * @param authenticatedUser - Currently logged in user
     * @param user - User object.
     * @returns Whether the given user is the current user or not.
     */
    public static isAuthenticatedUser = (authenticatedUser: string, username: string): boolean => {
        let authenticatedUsername: string = authenticatedUser;

        if (authenticatedUsername.split("@").length > 2) {
            // If the username contains 2 @ symbols, it contains the tenant domain as well.
            authenticatedUsername = authenticatedUser.split("@").slice(0,2).join("@");
        }

        return getUserNameWithoutDomain(username) === authenticatedUsername;
    };

    /**
     * Checks whether administrator role is present in the user roles.
     */
    public static isAdminUser = (roles: UserRoleInterface[]): boolean => {
        return roles.some((role: UserRoleInterface) =>
            role.display === administratorConfig.adminRoleName
        );
    };

    /**
     * Resolves the display name of Multiple Users mode.
     *
     * @param mode - Config mode.
     * @returns Display name of Multiple Users mode.
     */
    public static resolveMultipleInvitesDisplayName(mode: MultipleInviteMode): string {
        return MultipleInvitesDisplayNames[mode];
    }

    /**
     * Resolves the sub header of the user list item.
     *
     * @param user - User object.
     * @returns Sub header of the user list item.
     */
    public static resolveUserListSubheaderName(user: ProfileInfoInterface): string {
        if (user?.name?.givenName && user?.name?.familyName) {
            return user.name.givenName + " " + (user.name.familyName ? user.name.familyName : "");
        }

        if (user?.name?.givenName) {
            return user.name.givenName;
        }

        if (user?.name?.familyName) {
            return user.name.familyName;
        }

        return null;
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

/**
 * Get the userbane validation configurations in the required format.
 *
 * @param configs - validation configurations for an organization.
 * @returns the userbane validation configuration.
 */
export const getUsernameConfiguration = (configs: ValidationDataInterface[]): ValidationFormInterface => {

    const usernameConf: ValidationDataInterface[] =
        configs?.filter((data: ValidationDataInterface) => data.field === "username");

    if (usernameConf === undefined || usernameConf.length < 1) {
        return;
    }
    const config: ValidationDataInterface = usernameConf[0];

    const rules: ValidationConfInterface[] = config?.rules;

    if (!rules || rules?.length < 1) {
        return;
    }

    return {
        enableValidator:
                (getValidationConfig(rules, "AlphanumericValidator", "enable.validator") === "true"
                || !(getValidationConfig(rules, "EmailFormatValidator", "enable.validator") === "true"))
                    ? "true"
                    : "false",
        field: "username",
        isAlphanumericOnly: getValidationConfig(rules, "AlphanumericValidator", "enable.special.characters") !== "true",
        maxLength:
            getValidationConfig(rules, "LengthValidator", "max.length")
                ? getValidationConfig(rules, "LengthValidator", "max.length")
                : null,
        minLength:
            getValidationConfig(rules, "LengthValidator", "min.length")
                ? getValidationConfig(rules, "LengthValidator", "min.length")
                : null,
        type: "rules"
    };
};

/**
 * Retrieve values of each validator.
 */
const getValidationConfig = (
    rules: ValidationConfInterface[],
    validatorName: string,
    attributeName: string
): string => {

    const config: ValidationConfInterface[] = rules?.filter((data: ValidationConfInterface) => {
        return data.validator === validatorName;
    });

    if (config?.length > 0) {
        let properties: ValidationPropertyInterface[] = config[0].properties;

        properties = properties.filter((data: ValidationPropertyInterface) => data.key === attributeName);
        if (properties.length > 0) {
            return properties[0].value;
        }
    }

    return null;
};
