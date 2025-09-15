/**
 * Copyright (c) 2022-2025, WSO2 LLC. (https://www.wso2.com).
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

/**
 * Keys used in feature dictionary.
 */
export enum UserStoresFeatureDictionaryKeys {
    ReadWriteUserStores = "USERSTORES_READ_WRITE_USERSTORES",
    OptimizedUserStore = "OPTIMIZED_USERSTORE",
    ClassicUserStoreReadGroups = "CLASSIC_USERSTORE_READ_GROUPS",
    OptimizedUserStoreReadGroups = "OPTIMIZED_USERSTORE_READ_GROUPS"
}

/**
 * Class containing user store constants.
 */
export class RemoteUserStoreConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {}

    // Type ID of the on-prem customer user store.
    public static readonly OUTBOUND_USER_STORE_TYPE_ID: string = "V1NPdXRib3VuZFVzZXJTdG9yZU1hbmFnZXI";
    public static readonly READONLY_LDAP_USER_STORE_TYPE_ID: string =
        "VW5pcXVlSURSZWFkT25seUxEQVBVc2VyU3RvcmVNYW5hZ2Vy";

    public static readonly READONLY_AD_USER_STORE_TYPE_ID: string =
        "VW5pcXVlSURBY3RpdmVEaXJlY3RvcnlVc2VyU3RvcmVNYW5hZ2Vy";

    public static readonly CUSTOMER_USERSTORE_ID: string = "REVGQVVMVA";

    // Already existing user store names
    public static readonly PRIMARY_USER_STORE_NAME: string = "PRIMARY";
    public static readonly FEDERATION_USER_STORE_NAME: string = "FEDERATION";
    public static readonly DEFAULT_USER_STORE_NAME: string = "DEFAULT";

    // Reserved user store names
    public static readonly INTERNAL_USER_STORE_NAME: string = "INTERNAL";
    public static readonly APPLICATION_USER_STORE_NAME: string = "APPLICATION";

    // Attribute value to sort the attributes in edit attributes
    public static readonly DISPLAY_NAME_VALUE: string = "displayName";

    // Userstore propery names
    public static readonly PROPERTY_NAME_CONNECTED_USER_STORE_TYPE: string = "ConnectedUserstoreType";
    public static readonly PROPERTY_NAME_READ_ONLY: string = "ReadOnly";
    public static readonly PROPERTY_NAME_DISABLED: string = "Disabled";
    public static readonly PROPERTY_NAME_READ_GROUPS: string = "ReadGroups";
    public static readonly PROPERTY_NAME_USERID: string = "UserIDAttribute";
    public static readonly PROPERTY_NAME_USERNAME: string = "UserNameAttribute";
    public static readonly PROPERTY_NAME_GROUPID: string = "GroupIdAttribute";
    public static readonly PROPERTY_NAME_GROUPNAME: string = "GroupNameAttribute";

    /**
     * Set of keys used to enable/disable sub-features.
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>([
        [ UserStoresFeatureDictionaryKeys.ReadWriteUserStores, "userStores.readWriteUserstores" ],
        [ UserStoresFeatureDictionaryKeys.OptimizedUserStore, "userStores.optimizedUserstore" ],
        [ UserStoresFeatureDictionaryKeys.ClassicUserStoreReadGroups, "userStores.classicUserstore.readGroups" ],
        [ UserStoresFeatureDictionaryKeys.OptimizedUserStoreReadGroups, "userStores.optimizedUserstore.readGroups" ]
    ]);

    public static getPaths(): Map<string, string> {
        return new Map<string, string>().set(
            "REMOTE_USER_STORE_CREATE",
            `${window["AppUtils"].getConfig().adminApp.basePath}/remote-user-store-create`
        );
    }
}

/**
 * Enum for remote user store types.
 *
 * @readonly
 */
export enum ConnectedUserStoreTypes {
    ActiveDirectory = "AD",
    LDAP = "LDAP"
}

/**
 * Enum for remote user store access types.
 *
 * @readonly
 */
export enum RemoteUserStoreAccessTypes {
    ReadOnly = "true",
    ReadWrite = "false"
}

interface UserStoreValidationRegexPatternInterface {
    EscapeRegEx: string;
}

/**
 * User store validation regEx patterns
 */
export const USERSTORE_VALIDATION_REGEX_PATTERNS: UserStoreValidationRegexPatternInterface = {
    EscapeRegEx: "\\$\\{[^}]*\\}"
};

/**
 * Enum for remote user store API exception codes.
 */
export enum RemoteUserStoreAPIExceptionCodes {
    TokenLimitExceeded = "UMG-60011"
}
