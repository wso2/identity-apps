/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

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
    private constructor() {
    }

    // Type ID of the on-prem customer user store.
    public static readonly OUTBOUND_USER_STORE_TYPE_ID: string = "V1NPdXRib3VuZFVzZXJTdG9yZU1hbmFnZXI";
    public static readonly READONLY_LDAP_USER_STORE_TYPE_ID: string 
        = "VW5pcXVlSURSZWFkT25seUxEQVBVc2VyU3RvcmVNYW5hZ2Vy";

    public static readonly READONLY_AD_USER_STORE_TYPE_ID: string 
        = "VW5pcXVlSURBY3RpdmVEaXJlY3RvcnlVc2VyU3RvcmVNYW5hZ2Vy";
        
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
    public static readonly PROPERTY_NAME_CONNECTED_USERSTORE_TYPE: string = "ConnectedUserstoreType";
    public static readonly PROPERTY_NAME_READ_ONLY: string = "ReadOnly";

    /**
     * Set of keys used to enable/disable features.
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("USERSTORES_READ_WRITE_USERSTORES", "userStores.readWriteUserstores");

    public static getPaths(): Map<string, string> {
        return new Map<string, string>()
            .set("REMOTE_USER_STORE_CREATE", 
                `${ window["AppUtils"].getConfig().adminApp.basePath }/remote-user-store-create`);
    }

}

/**
 * Enum for remote user store types.
 *
 * @readonly
 */
export enum RemoteUserStoreTypes {
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
