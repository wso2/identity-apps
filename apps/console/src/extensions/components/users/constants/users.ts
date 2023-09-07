/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AppConstants } from "../../../../features/core";

/**
 * Class containing users constants.
 */
export class UsersConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    // Name of the Asgardeo userstore.
    public static readonly ASGARDEO_USERSTORE: string = "ASGARDEO_USER";

    // User creation limit reach error scimType.
    public static readonly ERROR_USER_LIMIT_REACHED: string = "userLimitReached";

    // Collaborator user limit reach error.
    public static readonly ERROR_COLLABORATOR_USER_LIMIT_REACHED: string = "ASG-UIM-10010";

    // Name of the readonly userstore type.
    public static readonly READONLY_USERSTORE_TYPE_NAME: string = "WSOutboundUserStoreManager";

    // Name of the readonly DEFAULT userstore type.
    public static readonly DEFAULT_USERSTORE_TYPE_NAME: string = "AsgardeoBusinessUserStoreManager";

    // Name of the readonly DEFAULT userstore property.
    public static readonly USER_STORE_PROPERTY_READ_ONLY: string = "ReadOnly";

    // Error message text for resources not found.
    public static readonly RESOURCE_NOT_FOUND_ERROR_MESSAGE: string = "Resource not found.";

    // Query param to exclude roles and groups from getUserList API call.
    public static readonly GROUPS_AND_ROLES_ATTRIBUTE: string = "groups,roles";
    
    // Query param to exclude groups from getUserList API call.
    public static readonly GROUPS_ATTRIBUTE: string = "groups";

    // Error message when API call returns a status code !== 200
    public static readonly INVALID_STATUS_CODE_ERROR: string = "Invalid Status Code. Expected Code 200.";

    // Key for the URL search param for User create wizard trigger.
    public static readonly USER_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY: string = "open";

    // Regular expression to validate having alphanumeric characters.
    public static readonly USERNAME_VALIDATION_REGEX: string = "^(?=.*[a-zA-Z])[a-zA-Z0-9]+$";

    /**
     * Get the consumer users paths as a map.
     *
     * @returns Map of users paths
     */
    public static getPaths(): Map<string, string> {

        return new Map<string, string>()
            .set("USERS_PATH", `${AppConstants.getAdminViewBasePath()}/users`)
            .set("USERS_EDIT_PATH", `${AppConstants.getAdminViewBasePath()}/:user-type/:id`)
            .set("CUSTOMER_USERS_PATH", `${AppConstants.getAdminViewBasePath()}/users`)
            .set("CUSTOMER_USER_EDIT_PATH", `${AppConstants.getAdminViewBasePath()}/users/:id`)
            .set("COLLABORATOR_USERS_PATH", `${AppConstants.getAdminViewBasePath()}/administrators`)
            .set("COLLABORATOR_USER_EDIT_PATH", `${AppConstants.getAdminViewBasePath()}/administrators/:id`)
            .set("COLLABORATOR_SETTINGS_EDIT_PATH",
                `${AppConstants.getAdminViewBasePath()}/administrator-settings-edit`
            );
    }

    /**
     * Consumer user store property values
     */
    public static readonly PASSWORD_JS_REGEX: string = "^[\\S]{5,30}$";
    public static readonly ROLENAME_JS_REGEX: string =  "^[\\S]{3,30}$";
    public static readonly USERNAME_JS_REGEX: string =  "^[\\S]{3,30}$";

    /**
     * User local storage property values
     */
    public static readonly ALL_USER_DESCRIPTION_SHOWN_STATUS_KEY: string = "isAllUserDescriptionShown";
    public static readonly CONSUMER_DESCRIPTION_SHOWN_STATUS_KEY: string = "isConsumerDescriptionShown";
    public static readonly QUEST_DESCRIPTION_SHOWN_STATUS_KEY: string = "isGuestDescriptionShown";

    /**
     * Form element constraints.
     */
    public static readonly FORM_FIELD_CONSTRAINTS: Record<string, any> = {
        PASSWORD_LOWER_CASE: /[a-z]/g,
        PASSWORD_MIN_LENGTH: 8,
        PASSWORD_NUMERIC: /[0-9]/g,
        PASSWORD_UPPER_CASE: /[A-Z]/g
    }
}

/**
 * Enum for user account types.
 *
 * @readonly
 */
export enum UserAccountTypes {
    OWNER = "Owner",
    ADMINISTRATOR = "Administrator",
    ADMIN = "admin",
    USER = "User",
    CUSTOMER = "Customer",
    COLLABORATOR = "Collaborator"
}

/**
 * Enum for admin account types.
 *
 * @readonly
 */
export enum AdminAccountTypes {
    INTERNAL = "internal",
    EXTERNAL = "external"
}

/**
 * Username of the admin user.
 */
export const ADMIN_USER_NAME: string = "admin";

/**
 * Name of the consumer userstore.
 */
export const CONSUMER_USERSTORE: string = "DEFAULT";

/**
 * Name of the primary userstore.
 */
export const PRIMARY_USERSTORE: string = "PRIMARY";

/**
 * Name of the advanced user management feature.
 */
export const ADVANCED_USER_MGT: string = "advancedUserManagement";

/**
 * Association type of invited admin users.
 */
export const GUEST_ADMIN_ASSOCIATION_TYPE: string = "GUEST";
