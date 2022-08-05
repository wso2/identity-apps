/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

export class TenantManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    public static readonly TENANT_URI_PLACEHOLDER: string = "myorg";

    /**
     * Form element constraints.
     */
    public static readonly FORM_FIELD_CONSTRAINTS: Record<string, any> = {
        TENANT_NAME_ALPHANUMERIC: new RegExp("^[a-z0-9]+$"),
        TENANT_NAME_FIRST_ALPHABET: new RegExp("^[a-z]"),
        TENANT_NAME_MAX_LENGTH: 30,
        TENANT_NAME_MIN_LENGTH: 4,
        TENANT_NAME_PATTERN: new RegExp("^[a-z][a-z0-9]{3,29}$")
    }
}
