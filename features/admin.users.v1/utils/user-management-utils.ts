/**
 * Copyright (c) 2020-2025, WSO2 LLC. (https://www.wso2.com).
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
import { OperationValueInterface, ScimOperationsInterface } from "@wso2is/admin.roles.v2/models/roles";
import { PRIMARY_USERSTORE } from "@wso2is/admin.userstores.v1/constants";
import {
    ValidationConfInterface,
    ValidationDataInterface,
    ValidationFormInterface,
    ValidationPropertyInterface
} from "@wso2is/admin.validation.v1/models";
import { ProfileConstants } from "@wso2is/core/constants";
import { getUserNameWithoutDomain } from "@wso2is/core/helpers";
import { ProfileInfoInterface, ProfileSchemaInterface, SharedProfileValueResolvingMethod } from "@wso2is/core/models";
import { ProfileUtils } from "@wso2is/core/utils";
import { DropdownChild } from "@wso2is/forms";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import cloneDeep from "lodash-es/cloneDeep";
import isEmpty from "lodash-es/isEmpty";
import {
    EMAIL_ADDRESSES_ATTRIBUTE,
    EMAIL_ATTRIBUTE,
    LocaleJoiningSymbol,
    MOBILE_ATTRIBUTE,
    MOBILE_NUMBERS_ATTRIBUTE,
    UserManagementConstants
} from "../constants/user-management-constants";
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

            // The global supportedByDefault value is a string. Hence, it needs to be converted to a boolean.
            const resolveSupportedByDefaultValue: boolean = schema?.supportedByDefault?.toLowerCase() === "true";

            // Currently BE check if global supported by default is enabled for these attributes to enable the feature.
            if (!resolveSupportedByDefaultValue) {
                return false;
            }

            const excludedUserStores: string[] =
                schema?.excludedUserStores?.split(",")?.map((store: string) => store?.trim().toUpperCase()) || [];

            return !excludedUserStores.includes(userStoreDomain);
        });

    return attributeCheck;
};

/**
 * Check if multiple emails and mobile numbers feature is enabled for a user store.
 *
 * @param profileSchema - User profile schema list.
 * @param userStoreDomain - User store domain to check.
 */
export const isMultipleEmailsAndMobileNumbersEnabledForUserStore = (
    profileSchema: ProfileSchemaInterface[],
    userStoreDomain: string
): boolean => {

    const multipleEmailsAndMobileFeatureRelatedAttributes: string[] = [
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAILS"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_ADDRESSES"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_MOBILE_NUMBERS")
    ];

    // Check each required attribute exists and domain is not excluded in the excluded user store list.
    const attributeCheck: boolean = multipleEmailsAndMobileFeatureRelatedAttributes.every(
        (attribute: string) => {
            const schema: ProfileSchemaInterface = profileSchema?.find(
                (schema: ProfileSchemaInterface) => schema?.name === attribute);

            if (!schema) {
                return false;
            }

            // The global supportedByDefault value is a string. Hence, it needs to be converted to a boolean.
            const resolveSupportedByDefaultValue: boolean = schema?.supportedByDefault?.toLowerCase() === "true";

            // Currently BE check if global supported by default is enabled for these attributes to enable the feature.
            if (!resolveSupportedByDefaultValue) {
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
 * Determines whether the specified schema should be treated as read-only.
 *
 * @param schema - The profile schema object to evaluate.
 * @param isUserManagedByParentOrg - Indicates whether the user is managed by a parent organization.
 * @returns True if the schema is read-only; otherwise, false.
 */
export const isSchemaReadOnly = (
    schema: ProfileSchemaInterface,
    isUserManagedByParentOrg: boolean
): boolean => {
    const resolvedMutability: string = schema?.profiles?.console?.mutability ?? schema?.mutability;

    return resolvedMutability === ProfileConstants.READONLY_SCHEMA ||
        (isUserManagedByParentOrg &&
         schema.sharedProfileValueResolvingMethod === SharedProfileValueResolvingMethod.FROM_ORIGIN);
};

/**
 * Constructs the patch operation value for a multi-valued attribute.
 *
 * @param attributeSchemaName - The schema name of the attribute.
 * @param currentValues - The existing values for the attribute.
 * @param inputValue - Input values for the multi-valued attribute.
 * @returns An object representing the patch operation value.
 */
export const constructPatchOpValueForMultiValuedAttribute = (
    attributeSchemaName: string,
    currentValues: string[],
    inputValue: string
) => {
    if (isEmpty(currentValues)) {
        currentValues = [];
    }

    if (!isEmpty(inputValue) && !currentValues.includes(inputValue)) {
        currentValues.push(inputValue);
    }

    return { [attributeSchemaName]: currentValues };
};

/**
 * Constructs a SCIM patch operation to update a multi-valued verified attribute.
 *
 * @param params - An object containing the following properties:
 *   - `verifiedAttributeSchema`: The schema definition for the verified attribute.
 *   - `valueList`: An array of values from the multi-valued attribute.
 *   - `verifiedValueList`: An array of current verified values.
 *   - `primaryValue`: The primary value to potentially add to the verified list.
 * @returns A SCIM patch operation object with the updated verified attribute values.
 */
export const constructPatchOperationForMultiValuedVerifiedAttribute = ({
    verifiedAttributeSchema,
    valueList,
    verifiedValueList,
    primaryValue
}: {
        verifiedAttributeSchema: ProfileSchemaInterface,
        valueList: string[],
        verifiedValueList: string[],
        primaryValue: string,
    }): ScimOperationsInterface => {
    if (
        isEmpty(primaryValue) ||
        verifiedValueList.includes(primaryValue) ||
        !valueList?.includes(primaryValue) ||
        !verifiedAttributeSchema
    ) {
        return;
    }

    const modifiedVerifiedList: string[] = cloneDeep(verifiedValueList);

    modifiedVerifiedList.push(primaryValue);

    const opValue: OperationValueInterface = {
        [verifiedAttributeSchema.schemaId]: {
            [verifiedAttributeSchema.name]: modifiedVerifiedList
        }
    };

    return {
        op: "replace",
        value: opValue
    };
};

/**
 * Resolves the display order of the given schema.
 *
 * @param schema - SCIM profile schema.
 * @returns the display order of the schema.
 */
export const getDisplayOrder = (schema: ProfileSchemaInterface): number => {
    if (schema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("USERNAME")) return 0;
    if (schema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_ADDRESSES")
        && (!schema.displayOrder || schema.displayOrder == "0")) return 6;
    if (schema.name === ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS")
        && (!schema.displayOrder || schema.displayOrder == "0")) return 7;
    if (!schema.displayOrder || schema.displayOrder == "0") return Number.MAX_SAFE_INTEGER;

    return schema.displayOrder ? parseInt(schema.displayOrder, 10) : Number.MAX_SAFE_INTEGER;
};

/**
 * Resolves the attributes by which users can be searched.
 *
 * @param profileSchemas  - SCIM profile schemas.
 * @returns Header of the user list item.
 */
export const resolveUserSearchAttributes = (
    profileSchemas: ProfileSchemaInterface[]
): DropdownChild[] => {
    const sortedSchemas: ProfileSchemaInterface[] = ProfileUtils.flattenSchemas([ ...profileSchemas ])
        .filter((schema: ProfileSchemaInterface) => {
            // The global supportedByDefault value is a string. Hence, it needs to be converted to a boolean.
            let resolveSupportedByDefaultValue: boolean = schema?.supportedByDefault?.toLowerCase() === "true";

            if (schema?.profiles?.console?.supportedByDefault !== undefined) {
                resolveSupportedByDefaultValue = schema?.profiles?.console?.supportedByDefault;
            }

            // If the schema is not supported by default and the value is empty, the field should not be displayed.
            if (!resolveSupportedByDefaultValue) {
                return false;
            }

            return true;
        })
        .sort((a: ProfileSchemaInterface, b: ProfileSchemaInterface) => {
            return getDisplayOrder(a) - getDisplayOrder(b);
        });

    let searchAttributes:DropdownChild[] = [];

    if (sortedSchemas) {
        searchAttributes = sortedSchemas.map((schema: ProfileSchemaInterface, index: number) => {
            const extendedSchemaSupportedName:string = schema?.schemaId
                ? schema.schemaId + ":" + schema.name
                : schema.name;

            return {
                key: index,
                text: schema.displayName,
                value: extendedSchemaSupportedName
            };
        });
    }

    return searchAttributes;
};

/**
 * Generates a comma-separated string of non-empty attributes from the given iterator.
 *
 * @param attributeIterator - An iterator that provides string attributes.
 * @returns The comma-separated string of non-empty attribute values.
 */
export const generateAttributesString = (attributeIterator: IterableIterator<string>) =>
    Array.from(attributeIterator).filter((attr: string) => attr !== "").join(",");

/**
 * The profile schema is displayed only if the schema is BOTH supported by default and required
 *
 * @param schema - The profile schema to be validated.
 * @returns whether the field for the input schema should be displayed.
 */
export const isFieldDisplayableInUserCreationWizard = (
    schema: ProfileSchemaInterface,
    isDistinctAttributeProfilesDisabled: boolean
): boolean => {
    let resolvedRequiredValue: boolean = schema?.required;
    let resolveSupportedByDefaultValue: boolean = schema?.supportedByDefault?.toLowerCase() === "true";

    // If the distinct attribute profiles feature is enabled, check the profiles object for flag.
    if (!isDistinctAttributeProfilesDisabled) {
        if (schema?.profiles?.console?.supportedByDefault !== undefined) {
            resolveSupportedByDefaultValue = schema?.profiles?.console?.supportedByDefault;
        }

        if (schema?.profiles?.console?.required !== undefined) {
            resolvedRequiredValue = schema?.profiles?.console?.required;
        }
    }

    // The field should be displayed if both required and supported by default are true.
    return resolveSupportedByDefaultValue && resolvedRequiredValue;
};

/**
 * The function returns the normalized format of locale.
 *
 * @param locale - locale value.
 * @param localeJoiningSymbol - symbol used to join language and region parts of locale.
 * @param updateSupportedLanguage - If supported languages needs to be updated with the given localString or not.
 * @param supportedI18nLanguages - Supported languages.
 */
export const normalizeLocaleFormat = (
    locale: string,
    localeJoiningSymbol: LocaleJoiningSymbol,
    updateSupportedLanguage: boolean,
    supportedI18nLanguages: SupportedLanguagesMeta
): string => {
    if (!locale) {
        return locale;
    }

    const separatorIndex: number = locale.search(/[-_]/);

    let normalizedLocale: string = locale;

    if (separatorIndex !== -1) {
        const language: string = locale.substring(0, separatorIndex).toLowerCase();
        const region: string = locale.substring(separatorIndex + 1).toUpperCase();

        normalizedLocale = `${language}${localeJoiningSymbol}${region}`;
    }

    if (updateSupportedLanguage && !supportedI18nLanguages[normalizedLocale]) {
        supportedI18nLanguages[normalizedLocale] = {
            code: normalizedLocale,
            name: UserManagementConstants.GLOBE,
            namespaces: []
        };
    }

    return normalizedLocale;
};

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject { [key: string]: JsonValue; }
interface JsonArray extends Array<JsonValue> {}

const deepMerge = <T extends JsonValue>(target: T, source: T): T => {
    if (Array.isArray(target) && Array.isArray(source)) {
        return [ ...target, ...source ] as T;
    }

    if (
        typeof target === "object" &&
        typeof source === "object" &&
        target !== null &&
        source !== null &&
        !Array.isArray(target) &&
        !Array.isArray(source)
    ) {
        const merged: JsonObject = { ...target };

        for (const key in source) {
            if (key in merged) {
                merged[key] = deepMerge(merged[key], (source as JsonObject)[key]);
            } else {
                merged[key] = (source as JsonObject)[key];
            }
        }

        return merged as T;
    }

    // Fallback overwrite
    return source;
};

export const groupByTopLevelKey = <T extends Record<string, JsonValue>>(inputArray: T[]): T => {
    const grouped: Record<string, JsonValue> = {};

    for (const obj of inputArray) {
        for (const key in obj) {
            if (grouped[key] === undefined) {
                grouped[key] = obj[key];
            } else {
                grouped[key] = deepMerge(grouped[key], obj[key]);
            }
        }
    }

    return grouped as T;
};

/**
 * Flattens a nested object into a map with dot-separated keys.
 *
 * @param obj - The object to flatten.
 * @param prefix - The prefix for the keys (used for recursion).
 * @returns A map with dot-separated keys and their corresponding values.
 */
export const flattenValues = (obj: Record<string, any>, prefix: string = ""): Map<string, string> => {
    const map: Map<string, string> = new Map<string, string>();

    for (const key in obj) {
        if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

        const value: any = obj[key];
        const path: string = prefix ? `${prefix}.${key}` : key;

        if (typeof value === "object" && !isEmpty(value) && !Array.isArray(value)) {
            const subMap: Map<string, string> = flattenValues(value, path);

            subMap.forEach((v: string, k: string) => map.set(k, v));
        } else {
            map.set(path, value);
        }
    }

    return map;
};

/**
 * This function returns the verification pending attribute value for email and mobile attributes.
 * @param schemaName - Schema name.
 * @returns Verification pending attribute value.
 */
export const getVerificationPendingAttributeValue = (schemaName: string, user: ProfileInfoInterface): string | null => {
    if (schemaName === EMAIL_ATTRIBUTE || schemaName === EMAIL_ADDRESSES_ATTRIBUTE) {
        const pendingAttributes: Array<{value: string}> | undefined = user[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]
            ?.[ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PENDING_EMAILS")];

        return Array.isArray(pendingAttributes)
            && pendingAttributes.length > 0
            && pendingAttributes[0]?.value !== undefined
            ? pendingAttributes[0].value
            : null;
    } else if (schemaName === MOBILE_ATTRIBUTE || schemaName === MOBILE_NUMBERS_ATTRIBUTE) {
        const pendingMobileAttribute: string = ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("PENDING_MOBILE");

        return !isEmpty(user[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]?.[pendingMobileAttribute])
            ? user[ProfileConstants.SCIM2_SYSTEM_USER_SCHEMA]?.[pendingMobileAttribute]
            : null;
    }

    return null;
};
