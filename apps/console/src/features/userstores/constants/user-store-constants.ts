/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the 'License'); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * The ID of the userstore type JDBC.
 *
 * @constant
 *
 * @type {string}
 */
export const JDBC = "JDBC";

export const USER_STORE_TYPE_DESCRIPTIONS = {
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

export const USERSTORE_TYPE_DISPLAY_NAMES = {
    ActiveDirectoryUserStoreManager: "Active Directory",
    CarbonRemoteUserStoreManger: "Carbon Remote",
    JDBCUserStoreManager: "JDBC",
    ReadOnlyLDAPUserStoreManager: "Read Only LDAP",
    ReadWriteLDAPUserStoreManager: "Read Write LDAP",
    UniqueIDActiveDirectoryUserStoreManager: "Active Directory",
    UniqueIDJDBCUserStoreManager: "JDBC",
    UniqueIDReadOnlyLDAPUserStoreManager: "Read Only LDAP",
    UniqueIDReadWriteLDAPUserStoreManager: "Read Write LDAP"
};

/**
 * User store type to image mapping.
 */
export const USERSTORE_TYPE_IMAGES = {
    ActiveDirectoryUserStoreManager: "ad",
    CarbonRemoteUserStoreManger: "default",
    JDBCUserStoreManager: "jdbc",
    ReadOnlyLDAPUserStoreManager: "ldap",
    ReadWriteLDAPUserStoreManager: "ldap",
    UniqueIDActiveDirectoryUserStoreManager: "ad",
    UniqueIDJDBCUserStoreManager: "jdbc",
    UniqueIDReadOnlyLDAPUserStoreManager: "ldap",
    UniqueIDReadWriteLDAPUserStoreManager: "ldap"
};

/**
 * Primary user store property values
 */
export const PRIMARY_USERSTORE_PROPERTY_VALUES = {
    PasswordJavaScriptRegEx: "^[\\S]{5,30}$",
    RolenameJavaScriptRegEx: "^[\\S]{3,30}$",
    UsernameJavaScriptRegEx: "^[\\S]{3,30}$"
};

/**
 * User store regEx properties
 */
export const USERSTORE_REGEX_PROPERTIES = {
    PasswordRegEx: "PasswordJavaScriptRegEx",
    RolenameRegEx: "RolenameJavaScriptRegEx",
    UsernameRegEx: "UsernameJavaScriptRegEx"
};

/**
 * Disabled property name.
 * @constant
 * @type {string}
 */
export const DISABLED = "Disabled";
