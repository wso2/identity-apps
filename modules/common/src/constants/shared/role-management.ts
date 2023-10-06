/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Class containing user role operation constants.
 */
export class RoleConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    // API errors
    public static readonly ROLES_FETCH_REQUEST_INVALID_RESPONSE_CODE_ERROR: string = "Received an invalid " +
        "status code while retrieving user roles.";
    public static readonly ROLES_FETCH_REQUEST_ERROR: string = "An error occurred while fetching the " +
        "user roles.";
}
