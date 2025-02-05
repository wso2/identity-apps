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

import { UIConfigInterface } from "@wso2is/admin.core.v1/models/config";
import { UserRoleInterface } from "@wso2is/admin.core.v1/models/users";
import { store } from "@wso2is/admin.core.v1/store";
import { administratorConfig } from "@wso2is/admin.extensions.v1/configs/administrator";
import { PRIMARY_USERSTORE } from "@wso2is/admin.userstores.v1/constants";
import {
    ValidationConfInterface,
    ValidationDataInterface,
    ValidationFormInterface,
    ValidationPropertyInterface
} from "@wso2is/admin.validation.v1/models";
import { ProfileConstants } from "@wso2is/core/constants";
import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import { ProfileInfoInterface, ProfileSchemaInterface } from "@wso2is/core/models";
import isEmpty from "lodash-es/isEmpty";
import { UserManagementConstants } from "../constants/user-management-constants";
import { MultipleInviteMode, MultipleInvitesDisplayNames, UserBasicInterface } from "../models/user";

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

    /* Resolves username.
    *
    * @param user - User details.
    *
    * @returns Username for the user avatar.
    */
    public static resolveAvatarUsername(user: UserBasicInterface): string {
        const usernameUUID: string = getUserNameWithoutDomain(user?.userName);

        if (user?.name?.givenName){
            return user.name.givenName[0];
        } else if (user?.name?.familyName) {
            return user.name.familyName[0];
        } else if (user?.emails?.length > 0 && user?.emails[0]) {
            return user.emails[0][0];
        } else if (!UserManagementUtils.checkUUID(usernameUUID)){
            return usernameUUID[0];
        }

        return "";
    };

    /**
     * Checks whether the username is a UUID.
     *
     * @returns If the username is a UUID.
     */
    public static checkUUID(username : string): boolean {

        const regexExp: RegExp = new RegExp(
            /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi
        );

        return regexExp.test(username);
    };
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
     * Check if multiple emails and mobile numbers feature is enabled.
     */
export const isMultipleEmailsAndMobileNumbersEnabled = (
    profileInfo: Map<string, string>,
    profileSchema: ProfileSchemaInterface[]
): boolean => {
    const UIConfig: UIConfigInterface = store.getState().config?.ui;

    if (isEmpty(profileInfo) || isEmpty(profileSchema)) return;

    if (!UIConfig?.isMultipleEmailsAndMobileNumbersEnabled) {
        return false;
    }

    const multipleEmailsAndMobileFeatureRelatedAttributes: string[] = [
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_ADDRESSES"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_MOBILE_NUMBERS")
    ];

    const domainName: string[] = profileInfo?.get("userName")?.toString().split("/");
    const userStoreDomain: string = (domainName.length > 1
        ? domainName[0]
        : PRIMARY_USERSTORE)?.toUpperCase();

    // Check each required attribute exists and domain is not excluded in the excluded user store list.
    const attributeCheck: boolean = multipleEmailsAndMobileFeatureRelatedAttributes.every(
        (attribute: string) => {
            const schema: ProfileSchemaInterface = profileSchema?.find(
                (schema: ProfileSchemaInterface) => schema?.name === attribute);

            if (!schema) {
                return false;
            }

            const excludedUserStores: string[] =
                schema?.excludedUserStores?.split(",")?.map((store: string) => store?.trim().toUpperCase()) || [];

            return !excludedUserStores.includes(userStoreDomain);
        });

    return attributeCheck;
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

/**
 * Extracts sub-attributes (objects) from the profile details.
 *
 * @param user - The user object to extract sub-attributes from.
 * @param schemaKey - The attribute key to extract sub-attributes from.
 * @returns Array of sub-attributes (objects).
 */
export const extractSubAttributes = (user: ProfileInfoInterface, schemaKey: string): Record<string, string>[] => {
    return user && user[schemaKey]?.filter(
        (subAttribute: unknown) => typeof subAttribute === "object") || [];
};

/**
 * Process multi valued simple attribute patch operation value.
 *
 * @param attributeSchemaName - Attribute schema name.
 * @param primaryAttributeSchemaName - Primary schema attribute.
 * @param profileInfo - Profile information.
 * @param multiValuedAttributeInputValues - Multi valued attribute input values.
 * @returns Patch operation value.
 */
export const constructPatchOpValueForMultiValuedAttribute = (
    attributeSchemaName: string,
    primaryAttributeSchemaName: string,
    profileInfo: Map<string, string>,
    multiValuedAttributeInputValues: Record<string, string>
) => {
    const currentValues: string[] = profileInfo?.get(attributeSchemaName)?.split(",") || [];

    if (!isEmpty(multiValuedAttributeInputValues[attributeSchemaName])) {
        currentValues.push(multiValuedAttributeInputValues[attributeSchemaName]);
    }

    if (!isEmpty(primaryAttributeSchemaName)) {
        const existingPrimary: string = profileInfo?.get(primaryAttributeSchemaName);

        if (existingPrimary && !currentValues.includes(existingPrimary)) {
            currentValues.push(existingPrimary);
        }
    }

    return { [attributeSchemaName]: currentValues } ;
};
