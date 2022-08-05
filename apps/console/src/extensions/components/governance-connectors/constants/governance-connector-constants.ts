/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 Inc. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content."
 */

/**
 * Class containing governance connector constants.
 */
export class GovernanceConnectorConstants {

    /**
     * Self Registration Form element constraints.
     * @type {Record<string, string | number>}
     */
    public static readonly SELF_REGISTRATION_FORM_FIELD_CONSTRAINTS: {
        EXPIRY_TIME_MAX_LENGTH: number;
        EXPIRY_TIME_MAX_VALUE: number;
        EXPIRY_TIME_MIN_LENGTH: number;
        EXPIRY_TIME_MIN_VALUE: number;
    } = {

        EXPIRY_TIME_MAX_LENGTH: 5,
        EXPIRY_TIME_MAX_VALUE: 10080,
        EXPIRY_TIME_MIN_LENGTH: 1,
        EXPIRY_TIME_MIN_VALUE: 1,
    };

    /**
     * Password Recovery Form element constraints.
     * @type {Record<string, string | number>}
     */
    public static readonly PASSWORD_RECOVERY_FORM_FIELD_CONSTRAINTS: {
        EXPIRY_TIME_MAX_LENGTH: number;
        EXPIRY_TIME_MAX_VALUE: number;
        EXPIRY_TIME_MIN_LENGTH: number;
        EXPIRY_TIME_MIN_VALUE: number;
    } = {

        EXPIRY_TIME_MAX_LENGTH: 5,
        EXPIRY_TIME_MAX_VALUE: 10080,
        EXPIRY_TIME_MIN_LENGTH: 1,
        EXPIRY_TIME_MIN_VALUE: 1,
    };

    /**
     * Login Attempt Security Form element constraints.
     * @type {Record<string, string | number>}
     */
    public static readonly LOGINS_ATTEMPT_SECURITY_FORM_FIELD_CONSTRAINTS: {
        FAILED_ATTEMPTS_MAX_LENGTH: number;
        FAILED_ATTEMPTS_MAX_VALUE: number;
        FAILED_ATTEMPTS_MIN_LENGTH: number;
        FAILED_ATTEMPTS_MIN_VALUE: number;
        ACCOUNT_LOCK_TIME_MAX_LENGTH: number;
        ACCOUNT_LOCK_TIME_MAX_VALUE: number;
        ACCOUNT_LOCK_TIME_MIN_LENGTH: number;
        ACCOUNT_LOCK_TIME_MIN_VALUE: number;
        ACCOUNT_LOCK_INCREMENT_FACTOR_MAX_LENGTH: number;
        ACCOUNT_LOCK_INCREMENT_FACTOR_MAX_VALUE: number;
        ACCOUNT_LOCK_INCREMENT_FACTOR_MIN_LENGTH: number;
        ACCOUNT_LOCK_INCREMENT_FACTOR_MIN_VALUE: number;
    } = {

        FAILED_ATTEMPTS_MAX_LENGTH: 2,
        FAILED_ATTEMPTS_MAX_VALUE: 10,
        FAILED_ATTEMPTS_MIN_LENGTH: 1,
        FAILED_ATTEMPTS_MIN_VALUE: 1,
        ACCOUNT_LOCK_TIME_MAX_LENGTH: 4,
        ACCOUNT_LOCK_TIME_MAX_VALUE: 1440,
        ACCOUNT_LOCK_TIME_MIN_LENGTH: 1,
        ACCOUNT_LOCK_TIME_MIN_VALUE: 1,
        ACCOUNT_LOCK_INCREMENT_FACTOR_MAX_LENGTH: 2,
        ACCOUNT_LOCK_INCREMENT_FACTOR_MAX_VALUE: 10,
        ACCOUNT_LOCK_INCREMENT_FACTOR_MIN_LENGTH: 1,
        ACCOUNT_LOCK_INCREMENT_FACTOR_MIN_VALUE: 1,
    };
}
