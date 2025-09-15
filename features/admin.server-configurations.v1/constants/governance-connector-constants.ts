/**
 * Copyright (c) 2021-2025, WSO2 LLC. (https://www.wso2.com).
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
export enum GovernanceConnectorFeatureDictionaryKeys {
    HIDE_INVITED_USER_REGISTRATION_TOGGLE = "hideInvitedUserRegistrationToggle"
}

/**
 * Class containing governance connector constants.
 */
export class GovernanceConnectorConstants {

    /**
     * Feature dictionary for governance connectors.
     * Key: Feature dictionary key.
     * Value: Corresponding config key in deployment config.
     */
    public static readonly featureDictionary: Record<string, string> = {
        [GovernanceConnectorFeatureDictionaryKeys.HIDE_INVITED_USER_REGISTRATION_TOGGLE]:
            "governanceConnectors.invitedUserRegistration.enableDisableControl"
    };

    /**
     * Ask Password Form element constraints.
     */
    public static readonly ASK_PASSWORD_FORM_FIELD_CONSTRAINTS: {
        EXPIRY_TIME_MAX_LENGTH: number;
        EXPIRY_TIME_MAX_VALUE: number;
        EXPIRY_TIME_MIN_LENGTH: number;
        EXPIRY_TIME_MIN_VALUE: number;
        OTP_CODE_LENGTH_MAX_LENGTH: number;
        OTP_CODE_LENGTH_MAX_VALUE: number;
        OTP_CODE_LENGTH_MIN_LENGTH: number;
        OTP_CODE_LENGTH_MIN_VALUE: number;
    } = {
            EXPIRY_TIME_MAX_LENGTH: 5,
            EXPIRY_TIME_MAX_VALUE: 10080,
            EXPIRY_TIME_MIN_LENGTH: 1,
            EXPIRY_TIME_MIN_VALUE: -1,
            OTP_CODE_LENGTH_MAX_LENGTH: 2,
            OTP_CODE_LENGTH_MAX_VALUE: 10,
            OTP_CODE_LENGTH_MIN_LENGTH: 1,
            OTP_CODE_LENGTH_MIN_VALUE: 4
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
        MAX_FAILED_ATTEMPT_COUNT_MIN_LENGTH: number;
        MAX_FAILED_ATTEMPT_COUNT_MAX_LENGTH: number;
        MAX_FAILED_ATTEMPT_COUNT_MIN_VALUE: number;
        MAX_FAILED_ATTEMPT_COUNT_MAX_VALUE: number;
        MAX_RESEND_COUNT_MIN_LENGTH: number;
        MAX_RESEND_COUNT_MAX_LENGTH: number;
        MAX_RESEND_COUNT_MIN_VALUE: number;
        MAX_RESEND_COUNT_MAX_VALUE: number;
        SMS_OTP_EXPIRY_TIME_MAX_LENGTH: number;
        SMS_OTP_EXPIRY_TIME_MAX_VALUE: number;
        SMS_OTP_CODE_LENGTH_MAX_LENGTH: number;
        SMS_OTP_CODE_LENGTH_MAX_VALUE: number;
        SMS_OTP_CODE_LENGTH_MIN_LENGTH: number;
        SMS_OTP_CODE_LENGTH_MIN_VALUE: number;
    } = {
            EXPIRY_TIME_MAX_LENGTH: 5,
            EXPIRY_TIME_MAX_VALUE: 10080,
            EXPIRY_TIME_MIN_LENGTH: 1,
            EXPIRY_TIME_MIN_VALUE: 1,
            MAX_FAILED_ATTEMPT_COUNT_MAX_LENGTH: 2,
            MAX_FAILED_ATTEMPT_COUNT_MAX_VALUE: 10,
            MAX_FAILED_ATTEMPT_COUNT_MIN_LENGTH: 1,
            MAX_FAILED_ATTEMPT_COUNT_MIN_VALUE: 1,
            MAX_RESEND_COUNT_MAX_LENGTH: 1,
            MAX_RESEND_COUNT_MAX_VALUE: 5,
            MAX_RESEND_COUNT_MIN_LENGTH: 1,
            MAX_RESEND_COUNT_MIN_VALUE: 1,
            SMS_OTP_CODE_LENGTH_MAX_LENGTH: 2,
            SMS_OTP_CODE_LENGTH_MAX_VALUE: 10,
            SMS_OTP_CODE_LENGTH_MIN_LENGTH: 1,
            SMS_OTP_CODE_LENGTH_MIN_VALUE: 4,
            SMS_OTP_EXPIRY_TIME_MAX_LENGTH: 4,
            SMS_OTP_EXPIRY_TIME_MAX_VALUE: 1440
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
        EXPIRY_RULES_MAX_COUNT: number;
        EXPIRY_RULE_MAX_VALUES_PER_RULE: number;
    } = {
            EXPIRY_RULES_MAX_COUNT: 10,
            EXPIRY_RULE_MAX_VALUES_PER_RULE: 5,
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

    public static readonly FORCED_PASSWORD_RESET_FORM_FIELD_CONSTRAINTS: {

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
}
