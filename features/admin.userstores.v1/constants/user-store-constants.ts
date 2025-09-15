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

import { IdentityAppsError } from "@wso2is/core/errors";

/**
 * Class containing user store management constants.
 */
export class UserStoreManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * User store create limit reached error.
     */
    public static readonly ERROR_CREATE_LIMIT_REACHED: IdentityAppsError = new IdentityAppsError(
        "SUS-60011",
        "userstores:notifications.apiLimitReachedError.error.description",
        "userstores:notifications.apiLimitReachedError.error.message",
        "165d6b4b-d384-4335-9706-19ab034a5397"
    );

    /**
     * The error code that is returned when there is no item in the list.
     */
    public static readonly RESOURCE_NOT_FOUND_ERROR_MESSAGE: string = "Resource not found.";

    // Name of the readonly DEFAULT userstore property.
    public static readonly USER_STORE_PROPERTY_READ_ONLY: string = "ReadOnly";
    public static readonly USER_STORE_PROPERTY_DISABLED: string = "Disabled";
    public static readonly USER_STORE_PROPERTY_BULK_IMPORT_SUPPORTED: string = "BulkImportSupported";
    public static readonly USER_STORE_PROPERTY_IS_BULK_IMPORT_SUPPORTED: string = "IsBulkImportSupported";

    /**
     * Set of keys used to enable/disable features.
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("USER_STORE_REMOTE", "userStores.type.remote")
        .set("USER_STORE_PRIMARY", "PRIMARY");

    /**
     * Mutation wait time.
     */
    public static readonly USER_STORE_MUTATION_WAIT_TIME: number = 5000;
}

/**
 * The ID of the userstore type JDBC.
 *
 */
export const JDBC: string = "JDBC";
export const CONSUMER_USERSTORE_ID: string  = "REVGQVVMVA";
export const DEFAULT_USERSTORE_TYPE_IMAGE: string  = "default";
export const DEFAULT_DESCRIPTION_CUSTOM_USERSTORE: string  = "This is a custom userstore manager implementation";

interface UserStoreTypeDescriptionsInterface {
    ActiveDirectoryUserStoreManager: string;
    CarbonRemoteUserStoreManger: string;
    JDBCUserStoreManager: string;
    ReadOnlyLDAPUserStoreManager: string;
    ReadWriteLDAPUserStoreManager: string;
    UniqueIDActiveDirectoryUserStoreManager: string;
    UniqueIDJDBCUserStoreManager: string;
    UniqueIDReadOnlyLDAPUserStoreManager: string;
    UniqueIDReadWriteLDAPUserStoreManager: string;
}

export const USER_STORE_TYPE_DESCRIPTIONS: UserStoreTypeDescriptionsInterface = {
    ActiveDirectoryUserStoreManager: "Active Directory based userstore.",
    CarbonRemoteUserStoreManger: "Userstore on another Identity Server instance.",
    JDBCUserStoreManager: "Java Database Connectivity based userstore.",
    ReadOnlyLDAPUserStoreManager: "Lightweight Directory Access Protocol based userstore which is read only.",
    ReadWriteLDAPUserStoreManager:
        "Lightweight Directory Access Protocol based userstore " + "which can both be read and written to",
    UniqueIDActiveDirectoryUserStoreManager: "Active Directory based userstore.",
    UniqueIDJDBCUserStoreManager: "Java Database Connectivity based userstore.",
    UniqueIDReadOnlyLDAPUserStoreManager: "Lightweight Directory Access Protocol based userstore which is read only.",
    UniqueIDReadWriteLDAPUserStoreManager:
        "Lightweight Directory Access Protocol based userstore " + "which can both be read and written to"
};

interface UserStoreTypeDisplayNamesInterface {
    ActiveDirectoryUserStoreManager: string;
    CarbonRemoteUserStoreManger: string;
    JDBCUserStoreManager: string;
    ReadOnlyLDAPUserStoreManager: string;
    ReadWriteLDAPUserStoreManager: string;
    UniqueIDActiveDirectoryUserStoreManager: string;
    UniqueIDJDBCUserStoreManager: string;
    UniqueIDReadOnlyLDAPUserStoreManager: string;
    UniqueIDReadWriteLDAPUserStoreManager: string;
}

export const USERSTORE_TYPE_DISPLAY_NAMES: UserStoreTypeDisplayNamesInterface = {
    ActiveDirectoryUserStoreManager: "Active Directory",
    CarbonRemoteUserStoreManger: "Carbon Remote",
    JDBCUserStoreManager: "JDBC",
    ReadOnlyLDAPUserStoreManager: "Read Only LDAP",
    ReadWriteLDAPUserStoreManager: "Read Write LDAP",
    UniqueIDActiveDirectoryUserStoreManager: "Active Directory",
    UniqueIDJDBCUserStoreManager: "Database",
    UniqueIDReadOnlyLDAPUserStoreManager: "Read Only LDAP",
    UniqueIDReadWriteLDAPUserStoreManager: "Read Write LDAP"
};

interface UserStoreTypeImagesInterface {
    ActiveDirectoryUserStoreManager: string;
    CarbonRemoteUserStoreManger: string;
    JDBCUserStoreManager: string;
    ReadOnlyLDAPUserStoreManager: string;
    ReadWriteLDAPUserStoreManager: string;
    UniqueIDActiveDirectoryUserStoreManager: string;
    UniqueIDJDBCUserStoreManager: string;
    UniqueIDReadOnlyLDAPUserStoreManager: string;
    UniqueIDReadWriteLDAPUserStoreManager: string;
}

/**
 * User store type to image mapping.
 */
export const USERSTORE_TYPE_IMAGES: UserStoreTypeImagesInterface = {
    ActiveDirectoryUserStoreManager: "ad",
    CarbonRemoteUserStoreManger: "default",
    JDBCUserStoreManager: "jdbc",
    ReadOnlyLDAPUserStoreManager: "ldapro",
    ReadWriteLDAPUserStoreManager: "ldap",
    UniqueIDActiveDirectoryUserStoreManager: "ad",
    UniqueIDJDBCUserStoreManager: "jdbc",
    UniqueIDReadOnlyLDAPUserStoreManager: "ldapro",
    UniqueIDReadWriteLDAPUserStoreManager: "ldap"
};

interface PrimaryUserStorePropertyValuesInterface {
    PasswordJavaScriptRegEx: string;
    RolenameJavaScriptRegEx: string;
    UsernameJavaScriptRegEx: string;
}

/**
 * Primary user store property values
 */
export const PRIMARY_USERSTORE_PROPERTY_VALUES: PrimaryUserStorePropertyValuesInterface = {
    PasswordJavaScriptRegEx: "^[\\S]{5,30}$",
    RolenameJavaScriptRegEx: "^[\\S]{3,30}$",
    UsernameJavaScriptRegEx: "^[\\S]{3,30}$"
};

interface UserStoreRegexPropertiesInterface {
    PasswordRegEx: string;
    RolenameRegEx: string;
    UsernameRegEx: string;
}

/**
 * User store regEx properties
 */
export const USERSTORE_REGEX_PROPERTIES: UserStoreRegexPropertiesInterface = {
    PasswordRegEx: "PasswordJavaScriptRegEx",
    RolenameRegEx: "RolenameJavaScriptRegEx",
    UsernameRegEx: "UsernameJavaScriptRegEx"
};

interface UserStoreValidationRegexPatternInterface {
    xssEscapeRegEx: string;
}

/**
 * User store validation regEx patterns
 */
export const USERSTORE_VALIDATION_REGEX_PATTERNS: UserStoreValidationRegexPatternInterface = {
    xssEscapeRegEx: "\\$\\{[^}]*\\}"
};

/**
 * Disabled property name.
 */
export const DISABLED: string = "Disabled";

/**
 * Name of the consumer userstore.
 */
export const CONSUMER_USERSTORE: string = "DEFAULT";

/**
 * Name of the primary userstore.
 */
export const PRIMARY_USERSTORE: string = "PRIMARY";

/**
 * Name of the agent userstore.
 */
export const AGENT_USERSTORE: string = "AGENT";

/**
 * ID of the agent userstore.
 */
export const AGENT_USERSTORE_ID: string = "QUdFTlQ";

/**
 * Character limit for userstore name.
 */
export const USERSTORE_NAME_CHARACTER_LIMIT: number = 50;

/**
 * Name of the remote userstore type.
 */
export const REMOTE_USERSTORE_TYPE_NAME: string = "WSOutboundUserStoreManager";

/**
 * Enum for user store types.
 *
 * @readonly
 */
export enum UserStoreTypes {
    DIRECT = "direct",
    REMOTE = "remote"
}

/**
 * Remote user store types.
 */
export const REMOTE_USER_STORE_TYPES: string[] = [
    "WSOutboundUserStoreManager", "AsgardeoBusinessUserStoreManager"
];

/**
 * Enum for user store manager types.
 */
export enum RemoteUserStoreManagerType {
    WSOutboundUserStoreManager = "WSOutboundUserStoreManager",
    RemoteUserStoreManager = "RemoteUserStoreManager",
    AsgardeoBusinessUserStoreManager = "AsgardeoBusinessUserStoreManager"
}

/**
 * On-prem read only user store types.
 */
export const ON_PREM_READ_ONLY_USER_STORE_TYPE_NAMES: string[] = [
    "UniqueIDReadOnlyLDAPUserStoreManager"
];

/**
 * Enum containing the icons a test connection button can have
 */
export enum TestButtonIcon {
    TESTING = "spinner",
    FAILED = "remove",
    SUCCESSFUL = "check",
    INITIAL = "bolt"
}

/**
 * Enum containing the colors the test button can have
 */
export enum TestButtonColor {
    TESTING,
    INITIAL,
    SUCCESSFUL,
    FAILED
}
