/**
 * Copyright (c) 2021-2023, WSO2 LLC. (https://www.wso2.com).
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
 * Class containing governance connector constants.
 */
export class GovernanceConnectorConstants {

    /**
     * Ask Password Form element constraints.
     */
    public static readonly ASK_PASSWORD_FORM_FIELD_CONSTRAINTS: {
        EXPIRY_TIME_MAX_LENGTH: number;
        EXPIRY_TIME_MAX_VALUE: number;
        EXPIRY_TIME_MIN_LENGTH: number;
        EXPIRY_TIME_MIN_VALUE: number;
    } = {
        EXPIRY_TIME_MAX_LENGTH: 5,
        EXPIRY_TIME_MAX_VALUE: 10080,
        EXPIRY_TIME_MIN_LENGTH: 1,
        EXPIRY_TIME_MIN_VALUE: -1
    };

    /**
     * Self Registration Form element constraints.
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
        EXPIRY_TIME_MIN_VALUE: 1
    };

    /**
     * Password Recovery Form element constraints.
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
        EXPIRY_TIME_MIN_VALUE: 1
    };

    /**
     * Login Attempt Security Form element constraints.
     */
    public static readonly LOGINS_ATTEMPT_SECURITY_FORM_FIELD_CONSTRAINTS: {
        ACCOUNT_LOCK_INCREMENT_FACTOR_MAX_LENGTH: number;
        ACCOUNT_LOCK_INCREMENT_FACTOR_MAX_VALUE: number;
        ACCOUNT_LOCK_INCREMENT_FACTOR_MIN_LENGTH: number;
        ACCOUNT_LOCK_INCREMENT_FACTOR_MIN_VALUE: number;
        ACCOUNT_LOCK_TIME_MAX_LENGTH: number;
        ACCOUNT_LOCK_TIME_MAX_VALUE: number;
        ACCOUNT_LOCK_TIME_MIN_LENGTH: number;
        ACCOUNT_LOCK_TIME_MIN_VALUE: number;
        FAILED_ATTEMPTS_MAX_LENGTH: number;
        FAILED_ATTEMPTS_MAX_VALUE: number;
        FAILED_ATTEMPTS_MIN_LENGTH: number;
        FAILED_ATTEMPTS_MIN_VALUE: number;
    } = {

        ACCOUNT_LOCK_INCREMENT_FACTOR_MAX_LENGTH: 2,
        ACCOUNT_LOCK_INCREMENT_FACTOR_MAX_VALUE: 10,
        ACCOUNT_LOCK_INCREMENT_FACTOR_MIN_LENGTH: 1,
        ACCOUNT_LOCK_INCREMENT_FACTOR_MIN_VALUE: 1,
        ACCOUNT_LOCK_TIME_MAX_LENGTH: 4,
        ACCOUNT_LOCK_TIME_MAX_VALUE: 1440,
        ACCOUNT_LOCK_TIME_MIN_LENGTH: 1,
        ACCOUNT_LOCK_TIME_MIN_VALUE: 1,
        FAILED_ATTEMPTS_MAX_LENGTH: 2,
        FAILED_ATTEMPTS_MAX_VALUE: 10,
        FAILED_ATTEMPTS_MIN_LENGTH: 1,
        FAILED_ATTEMPTS_MIN_VALUE: 1
    };

    /**
     * Password Expiry Form element constraints.
     */
    public static readonly PASSWORD_EXPIRY_FORM_FIELD_CONSTRAINTS: {
        EXPIRY_TIME_MAX_LENGTH: number;
        EXPIRY_TIME_MAX_VALUE: number;
        EXPIRY_TIME_MIN_LENGTH: number;
        EXPIRY_TIME_MIN_VALUE: number;
    } = {
        EXPIRY_TIME_MAX_LENGTH: 5,
        EXPIRY_TIME_MAX_VALUE: 10080,
        EXPIRY_TIME_MIN_LENGTH: 1,
        EXPIRY_TIME_MIN_VALUE: 1
    };

    /**
     * Analytics Form element constraints.
     */
    public static readonly ANALYTICS_FORM_FIELD_CONSTRAINTS: {
        TIMEOUT_MIN_LENGTH: number;
    } = {
        TIMEOUT_MIN_LENGTH: 0
    };
}
