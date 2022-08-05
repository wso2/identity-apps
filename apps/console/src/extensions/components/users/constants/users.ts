/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
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
     * @hideconstructor
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

    // Error message text for resources not found.
    public static readonly RESOURCE_NOT_FOUND_ERROR_MESSAGE: string = "Resource not found.";

    // Query param to exclude roles and groups from getUserList API call.
    public static readonly GROUPS_AND_ROLES_ATTRIBUTE: string = "groups,roles";
    
    // Query param to exclude groups from getUserList API call.
    public static readonly GROUPS_ATTRIBUTE: string = "groups";

    // Error message when API call returns a status code !== 200
    public static readonly INVALID_STATUS_CODE_ERROR: string = "Invalid Status Code. Expected Code 200.";

    /**
     * Key for the URL search param for User create wizard trigger.
     * @constant
     * @type {string}
     */
    public static readonly USER_CREATE_WIZARD_TRIGGER_URL_SEARCH_PARAM_KEY = "open";

    /**
     * Get the consumer users paths as a map.
     *
     * @return {Map<string, string>}
     */
    public static getPaths(): Map<string, string> {

        return new Map<string, string>()
            .set("USERS_PATH", `${AppConstants.getAdminViewBasePath()}/users`)
            .set("USERS_EDIT_PATH", `${AppConstants.getAdminViewBasePath()}/:user-type/:id`)
            .set("CUSTOMER_USERS_PATH", `${AppConstants.getAdminViewBasePath()}/users`)
            .set("CUSTOMER_USER_EDIT_PATH", `${AppConstants.getAdminViewBasePath()}/users/:id`)
            .set("COLLABORATOR_USERS_PATH", `${AppConstants.getAdminViewBasePath()}/administrators`)
            .set("COLLABORATOR_USER_EDIT_PATH", `${AppConstants.getAdminViewBasePath()}/administrators/:id`);
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
}

/**
 * Enum for user account types.
 *
 * @readonly
 * @enum {string}
 */
export enum UserAccountTypes {
    OWNER = "Owner",
    ADMINISTRATOR = "Administrator",
    USER = "User",
    CUSTOMER = "Customer",
    COLLABORATOR = "Collaborator"
}

/**
 * Enum for admin account types.
 *
 * @readonly
 * @enum {string}
 */
export enum AdminAccountTypes {
    INTERNAL = "internal",
    EXTERNAL = "external"
}

/**
 * Name of the consumer userstore.
 * @constant
 * @type {string}
 */
export const CONSUMER_USERSTORE: string = "CUSTOMER-DEFAULT";

/**
 * Name of the primary userstore.
 * @constant
 * @type {string}
 */
export const PRIMARY_USERSTORE: string = "PRIMARY";

/**
 * Name of the advanced user management feature.
 * @constant
 * @type {string}
 */
export const ADVANCED_USER_MGT: string = "advancedUserManagement";
