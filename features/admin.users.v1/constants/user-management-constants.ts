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

// Keep statement as this to avoid cyclic dependency. Do not import from config index.
import { ServerConfigurationsConstants } from
    "@wso2is/admin.server-configurations.v1/constants/server-configurations-constants";
import { ProfileConstants } from "@wso2is/core/constants";

/**
 * Class containing app constants which can be used across several applications.
 */
export class UserManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Default role list item limit.
     * @typeParam DEFAULT_ROLE_LIST_ITEM_LIMIT - number
     * @defaultValue
     */
    public static readonly DEFAULT_ROLE_LIST_ITEM_LIMIT: number = 10;

    /**
     * Default email template type list item limit.
     * @typeParam DEFAULT_EMAIL_TEMPLATE_TYPE_ITEM_LIMIT - number
     * @defaultValue
     */
    public static readonly DEFAULT_EMAIL_TEMPLATE_TYPE_ITEM_LIMIT: number = 10;

    /**
     * Default user list attributes.
     * @typeParam DEFAULT_USER_LIST_ATTRIBUTES - string[]
     * @defaultValue
     */
    public static readonly DEFAULT_USER_LIST_ATTRIBUTES: string[] = [ "name", "emails", "userName", "profileUrl",
        "meta.lastModified" ];

    /**
     * Set of keys used to enable/disable features.
     * @typeParam FEATURE_DICTIONARY - `Map<string, string>`
     * @defaultValue
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("USER_CREATE", "users.create")
        .set("USER_UPDATE", "users.update")
        .set("USER_DELETE", "users.delete")
        .set("USER_READ", "users.read")
        .set("USER_GROUPS", "users.edit.groups")
        .set("USER_ROLES", "users.edit.roles")
        .set("USER_SHARED_PROFILES", "users.updateSharedProfiles");

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

    public static readonly WSO2_LOCAL_CLAIM_DIALECT: string = "http://wso2.org/claims";
    public static readonly SCIM2_USER_SCHEMA: string = "urn:ietf:params:scim:schemas:core:2.0:User";
    public static readonly BULK_REQUEST_SCHEMA: string = "urn:ietf:params:scim:api:messages:2.0:BulkRequest";

    // Schema related constants.
    public static readonly ENTERPRISESCHEMA: string = "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User";
    public static readonly SYSTEMSCHEMA: string = "urn:scim:wso2:schema";
    /**
     * @deprecated This variable is deprecated. Use `SCIM2_CUSTOM_SCHEMA` instead.
     */
    public static readonly CUSTOMSCHEMA: string = "urn:scim:wso2:schema";
    public static readonly SCIM2_CUSTOM_SCHEMA: string = "urn:scim:schemas:extension:custom:User";

    /**
     * Set of SCIM2 schema names.apps/myaccount/src/store/actions/authenticate.ts
     * @typeParam SCIM2_SCHEMA_DICTIONARY - `Map<string, string>`
     * @defaultValue
     */
    public static readonly SCIM2_SCHEMA_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("EMAILS", "emails")
        .set("USERNAME", "userName")
        .set("NAME", "name")
        .set("DISPLAY_NAME", "displayName")
        .set("ENTERPRISE_USER", "urn:ietf:params:scim:schemas:extension:enterprise:2.0:User")
        .set("LOCALE", "locale");

    /**
     * Set of SCIM2 enterprise attributes.
     * @typeParam SCIM2_ATTRIBUTES_DICTIONARY - `Map<string, string>`
     * @defaultValue
     */
    public static readonly SCIM2_ATTRIBUTES_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("ACCOUNT_LOCKED", "urn:scim:wso2:schema:accountLocked")
        .set("ACCOUNT_DISABLED", "urn:scim:wso2:schema:accountDisabled")
        .set("ONETIME_PASSWORD", "urn:scim:wso2:schema:oneTimePassword");

    public static readonly ROLES: string = "roles";
    public static readonly GROUPS: string = "groups";
    public static readonly MOBILE: string = "mobile";
    public static readonly SCIM_USER_PATH: string = "/Users";
    public static readonly SCIM_GROUP_PATH: string = "/Groups";
    public static readonly SCIM_V2_ROLE_PATH: string = "/v2/Roles";

    // Regular expression to validate having alphanumeric characters.
    public static readonly USERNAME_VALIDATION_REGEX: string = "^(?=.*[a-zA-Z])[a-zA-Z0-9]+$";
    // Regular expression to validate having alphanumeric with special characters.
    public static readonly USERNAME_VALIDATION_REGEX_WITH_SPECIAL_CHARS: string =
        "^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$&'+\\\\=^.{|}~-]+$";

    // Error message when API call returns a status code !== 200
    public static readonly INVALID_STATUS_CODE_ERROR: string = "Invalid Status Code. Expected Code 200.";
    // Error message text for resources not found.
    public static readonly RESOURCE_NOT_FOUND_ERROR_MESSAGE: string = "Resource not found.";

    // ID of the form used in the invite parent organization user component.
    public static readonly INVITE_PARENT_ORG_USER_FORM_ID: string = "invite-parent-org-user-form";
    public static readonly USERNAME_REGEX_ERROR_CODE: string = "31301";

    // Query param to exclude roles and groups from getUserList API call.
    public static readonly GROUPS_AND_ROLES_ATTRIBUTE: string = "groups,roles";

    // User creation limit reach error scimType.
    public static readonly ERROR_USER_LIMIT_REACHED: string = "userLimitReached";

    //Association type of invited admin users.
    public static readonly GUEST_ADMIN_ASSOCIATION_TYPE: string = "GUEST";

    public static readonly ERROR_COLLABORATOR_USER_LIMIT_REACHED: string = "ASG-UIM-10010";
    // Query param to exclude groups from getUserList API call.
    public static readonly GROUPS_ATTRIBUTE: string = "groups";

    public static readonly MANAGED_BY_PARENT_TEXT: string = "Parent Organization";

    public static readonly GLOBE: string = "globe";

    public static readonly USERNAME_JAVA_REGEX: string = "UsernameJavaRegEx";

    public static readonly MULTI_VALUED_ATTRIBUTES: string[] = [
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("EMAIL_ADDRESSES"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("MOBILE_NUMBERS"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_MOBILE_NUMBERS"),
        ProfileConstants.SCIM2_SCHEMA_DICTIONARY.get("VERIFIED_EMAIL_ADDRESSES")
    ];

    // Impersonation related constants.
    public static readonly ID_TOKEN: string = "id_token";
    public static readonly SUBJECT_TOKEN: string = "subject_token";
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

/**
 * Enum for user account types.
 *
 * @readonly
 */
export enum UserAccountTypesMain {
    INTERNAL = "internal",
    EXTERNAL = "external"
}

/**
 * @readonly
 * @typeParam string - Types of attributes that cannot be bulk imported.
 */
export enum BlockedBulkUserImportAttributes {
    PASSWORD = "password",
    ONETIME_PASSWORD = "oneTimePassword",
    X509CERTIFICATES = "x509Certificates",
    GTALK = "gtalk",
    SKYPE = "skype",
    ROLES = "roles"
}

/**
 * @readonly
 * @typeParam string - Types of attributes that should be handled manually.
 */
export enum SpecialMultiValuedComplexAttributes {
    Emails = "emails",
    PhoneNumbers = "phoneNumbers",
    Photos = "photos",
    Addresses = "addresses",
    Entitlements = "entitlements"
}

/**
 * @readonly
 * @typeParam string - Types of attributes that are required for bulk import.
 */
export enum RequiredBulkUserImportAttributes {
    USERNAME = "userName",
    EMAILADDRESS = "emailaddress"
}

/**
 * @readonly
 * @typeParam string - User add option types.
 */
export enum UserAddOptionTypes {
    BULK_IMPORT = "bulk-import",
    MANUAL_INPUT = "manual-input"
}

/**
 * @readonly
 * @typeParam string - Bulk user import status.
 */
export enum BulkUserImportStatus {
    FAILED = "FAILED",
    SUCCESS = "SUCCESS",
    ALL = "ALL"
}

/**
 * @readonly
 * @typeParam string - Bulk user import response operation type.
 */
export enum BulkImportResponseOperationTypes {
    USER_CREATION = "userCreation",
    ROLE_ASSIGNMENT = "roleAssignment",
}

/**
 * Enum for hidden field names.
 */
export enum HiddenFieldNames {
    USERSTORE = "userStore",
    USERNAME = "userName",
    FIRSTNAME = "firstName",
    LASTNAME = "lastName",
    PASSWORD = "password",
    EMAIL = "email"
}

/**
 * Enum for password option types.
 */
export enum PasswordOptionTypes {
    ASK_PASSWORD = "ask-password",
    CREATE_PASSWORD = "create-password"
}

/**
 * Enum for ask-password option types.
 */
export enum AskPasswordOptionTypes {
    EMAIL = "email",
    OFFLINE = "offline"
}

/**
 * Enum for wizard steps form types.
 * @readonly
 */
export enum WizardStepsFormTypes {
    USER_MODE = "UserMode",
    BASIC_DETAILS = "BasicDetails",
    INVITE_BASIC_DETAILS = "InviteBasicDetails",
    ROLE_LIST= "RoleList",
    GROUP_LIST= "GroupList",
    SUMMARY = "summary",
    USER_TYPE = "UserType",
    USER_SUMMARY = "UserSummary"
}

/**
 * Enum for invitation status types.
 *
 * @readonly
 */
export enum InvitationStatus {
    ACCEPTED = "Accepted",
    PENDING = "Pending",
    EXPIRED = "Expired"
}

/**
 * Enum for locale joining symbol.
 *
 * @readonly
 */
export enum LocaleJoiningSymbol {
    HYPHEN = "-",
    UNDERSCORE = "_"
}

/**
 * Enum for type of the user association.
 *
 * @readonly
 */
export enum UserSharedType {
    OWNER = "OWNER",
    INVITED = "INVITED",
    SHARED = "SHARED"
}

/**
 *  user account locked reason.
 *
 * @readonly
 */
export const ACCOUNT_LOCK_REASON_MAP: Record<string, string> = {
    ADMIN_INITIATED: "user:profile.accountLockReason.adminInitiated",
    DEFAULT: "user:profile.accountLockReason.default",
    MAX_ATTEMPTS_EXCEEDED: "user:profile.accountLockReason.maxAttemptsExceeded",
    PENDING_ADMIN_FORCED_USER_PASSWORD_RESET: "user:profile.accountLockReason.pendingAdminForcedUserPasswordReset",
    PENDING_ASK_PASSWORD: "user:profile.accountLockReason.pendingAskPassword",
    PENDING_EMAIL_VERIFICATION: "user:profile.accountLockReason.pendingEmailVerification",
    PENDING_SELF_REGISTRATION: "user:profile.accountLockReason.pendingSelfRegistration"
};

export const CONNECTOR_PROPERTY_TO_CONFIG_STATUS_MAP: Record<string, string> = {
    [ServerConfigurationsConstants.ACCOUNT_DISABLING_ENABLE]: "accountDisable",
    [ServerConfigurationsConstants.ACCOUNT_LOCK_ON_CREATION]: "accountLock",
    [ServerConfigurationsConstants.ENABLE_EMAIL_VERIFICATION]: "isEmailVerificationEnabled",
    [ServerConfigurationsConstants.ENABLE_MOBILE_VERIFICATION]: "isMobileVerificationEnabled",
    [ServerConfigurationsConstants.ENABLE_MOBILE_VERIFICATION_BY_PRIVILEGED_USER]:
        "isMobileVerificationByPrivilegeUserEnabled"
};

export const PASSWORD_RESET_PROPERTIES: string[] = [
    ServerConfigurationsConstants.RECOVERY_LINK_PASSWORD_RESET,
    ServerConfigurationsConstants.OTP_PASSWORD_RESET,
    ServerConfigurationsConstants.OFFLINE_PASSWORD_RESET
];
