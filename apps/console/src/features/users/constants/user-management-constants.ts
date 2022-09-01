/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com) All Rights Reserved.
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

// Keep statement as this to avoid cyclic dependency. Do not import from config index.
import { SCIMConfigs } from "../../../extensions/configs/scim";

/**
 * Class containing app constants which can be used across several applications.
 */
export class UserManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Default role list item limit.
     * @constant
     * @type {number}
     * @default
     */
    public static readonly DEFAULT_ROLE_LIST_ITEM_LIMIT = 10;

    /**
     * Default email template type list item limit.
     * @constant
     * @type {number}
     * @default
     */
    public static readonly DEFAULT_EMAIL_TEMPLATE_TYPE_ITEM_LIMIT = 10;

    /**
     * Default user list attributes.
     * @constant
     * @type {string[]}
     * @default
     */
    public static readonly DEFAULT_USER_LIST_ATTRIBUTES = [ "name", "emails", "userName", "profileUrl",
        "meta.lastModified" ];

    /**
     * Set of keys used to enable/disable features.
     * @constant
     * @type {Map<string, string>}
     * @default
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("USER_CREATE", "users.create")
        .set("USER_UPDATE", "users.update")
        .set("USER_DELETE", "users.delete")
        .set("USER_READ", "users.read");

    // API errors
    public static readonly USER_INFO_UPDATE_ERROR: string = "Could not update the user information.";
    public static readonly GET_USER_SESSIONS_REQUEST_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while retrieving the user sessions.";

    public static readonly GET_USER_SESSIONS_REQUEST_ERROR: string = "Could not retrieve the user sessions " +
        "due to some error.";

    public static readonly TERMINATE_USER_SESSION_REQUEST_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while terminating the user sessions.";

    public static readonly TERMINATE_USER_SESSION_REQUEST_ERROR: string = "Could not terminate the user session " +
        "due to some error.";

    public static readonly TERMINATE_ALL_USER_SESSIONS_REQUEST_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while terminating all the user sessions.";
        
    public static readonly TERMINATE_ALL_USER_SESSIONS_ERROR: string = "Could not terminate all the user sessions " +
        "due to some error.";

    /**
     * Set of SCIM2 schema names.apps/myaccount/src/store/actions/authenticate.ts
     * @constant
     * @type {Map<string, string>}
     * @default
     */
    public static readonly SCIM2_SCHEMA_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("EMAILS", "emails")
        .set("USERNAME", "userName")
        .set("NAME", "name");

    /**
     * Set of SCIM2 enterprise attributes.
     *
     * @constant
     * @type {Map<string, string>}
     * @default
     */
    public static readonly SCIM2_ATTRIBUTES_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("ACCOUNT_LOCKED", SCIMConfigs.scimEnterpriseUserClaimUri.accountLocked)
        .set("ACCOUNT_DISABLED", SCIMConfigs.scimEnterpriseUserClaimUri.accountDisabled)
        .set("ONETIME_PASSWORD", SCIMConfigs.scimEnterpriseUserClaimUri.oneTimePassword);
}

/**
 * @readonly
 * @typeParam string - types of the admin accounts.
 */
export enum AdminAccountTypes {
    INTERNAL = "internal",
    EXTERNAL = "external"
}

/**
 * @readonly
 * @typeParam string - types of the user accounts.
 */
export enum UserAccountTypes {
    OWNER = "Owner",
    ADMINISTRATOR = "Administrator",
    USER = "User",
    CUSTOMER = "Customer",
    COLLABORATOR = "Collaborator"
}
