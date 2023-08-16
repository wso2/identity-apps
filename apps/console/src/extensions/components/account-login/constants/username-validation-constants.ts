/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Class containing username validation constants.
 */
export class UsernameValidationConstants {

    /**
     * Constants for username validation configurations.
     */
    public static readonly VALIDATION_CONFIGURATION_FIELD_CONSTRAINTS: {
        MIN_LENGTH: number,
        MIN_VALUE: number;
        USERNAME_MAX_LENGTH: number;
        USERNAME_MAX_VALUE: number;
        USERNAME_MIN_LENGTH: number;
        USERNAME_MIN_VALUE: number;
    } = {
        MIN_LENGTH: 1,
        MIN_VALUE: 0,
        USERNAME_MAX_LENGTH: 2,
        USERNAME_MAX_VALUE: 50,
        USERNAME_MIN_LENGTH: 1,
        USERNAME_MIN_VALUE: 3
    };

    /**
     * Constants for username validation default constants.
     */
     public static readonly VALIDATION_DEFAULT_CONSTANTS: {
        USERNAME_MAX: string;
        USERNAME_MIN: string;
    } = {
        USERNAME_MAX: "50",
        USERNAME_MIN: "3"
    };
}
