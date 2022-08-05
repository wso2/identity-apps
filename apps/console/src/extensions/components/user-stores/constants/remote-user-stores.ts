/**
 * Copyright (c) 2022, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

/**
 * Class containing user store constants.
 */
export class RemoteUserStoreConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() {
    }

    // Type ID of the on-prem customer user store.
    public static readonly OUTBOUND_USER_STORE_TYPE_ID: string = "V1NPdXRib3VuZFVzZXJTdG9yZU1hbmFnZXI";
    public static readonly READONLY_LDAP_USER_STORE_TYPE_ID: string = "VW5pcXVlSURSZWFkT25seUxEQVBVc2VyU3RvcmVNYW5hZ2Vy";
    public static readonly READONLY_AD_USER_STORE_TYPE_ID: string = "VW5pcXVlSURBY3RpdmVEaXJlY3RvcnlVc2VyU3RvcmVNYW5hZ2Vy";
    public static readonly CUSTOMER_USERSTORE_ID: string = "Q1VTVE9NRVItREVGQVVMVA";

    public static getPaths(): Map<string, string> {
        return new Map<string, string>()
            .set("REMOTE_USER_STORE_CREATE", `${ window["AppUtils"].getConfig().adminApp.basePath }/remote-user-store-create`)
    }

}
