/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { GovernanceConnectorInterface } from "./governance-connectors";

/**
 * Proptypes for the Ask Password Form props interface.
 */
export interface AskPasswordFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Connector's initial values.
     */
    initialValues: GovernanceConnectorInterface;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values: AskPasswordFormUpdatableConfigsInterface) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Whether the connector is enabled using the toggle button.
     */
    isConnectorEnabled?: boolean;
    /**
     * Specifies if the form is submitting
     */
    isSubmitting?: boolean;
}

/**
 * Proptypes for the Ask Password Form error messages.
 */
export interface AskPasswordFormErrorValidationsInterface {
    /**
     * Verification expiry time field.
     */
    expiryTime: string;
    /**
     * OTP code length field.
     */
    otpLength: string;
}

/**
 * Form initial values interface.
 */
export interface AskPasswordFormValuesInterface {
    /**
     * Whether to enable invite user to set password.
     */
    enableInviteUserToSetPassword: boolean;
    /**
     * Whether email verification is enabled.
     */
    enableEmailVerification: boolean;
    /**
     * Whether account lock on creation is enabled.
     */
    enableAccountLockOnCreation: boolean;
    /**
     * Whether account activation email is enabled.
     */
    enableAccountActivationEmail: boolean;
    /**
     * Verification expiry time.
     */
    expiryTime: string;
    /**
     * Whether email OTP is enabled.
     */
    enableEmailOtp: boolean;
    /**
     * Whether SMS OTP is enabled.
     */
    enableSmsOtp: boolean;
    /**
     * Whether to use upper case letters in OTP code.
     */
    otpUseUppercase: boolean;
    /**
     * Whether to use lower case letters in OTP code.
     */
    otpUseLowercase: boolean;
    /**
     * Whether to use numeric characters in OTP code.
     */
    otpUseNumeric: boolean;
    /**
     * The length of the OTP code.
     */
    otpLength: string;
}

/**
 * Ask Password form updatable configurations interface.
 */
export interface AskPasswordFormUpdatableConfigsInterface {
    /**
     * Whether email verification is enabled.
     */
    "EmailVerification.Enable": boolean;
    /**
     * Whether account lock on creation is enabled.
     */
    "EmailVerification.LockOnCreation": boolean;
    /**
     * Whether account activation email is enabled.
     */
    "EmailVerification.AskPassword.AccountActivation": boolean;
    /**
     * Email verification expiry time.
     */
    "EmailVerification.AskPassword.ExpiryTime": string;
    /**
     * Sms OTP expiry time.
     */
    // "EmailVerification.AskPassword.SMSOTP.ExpiryTime": string;
    /**
     * Whether email OTP is enabled.
     */
    "EmailVerification.AskPassword.EmailOTP": boolean;
    /**
     * Whether SMS OTP is enabled.
     */
    "EmailVerification.AskPassword.SMSOTP": boolean;
    /**
     * Whether to use upper case letters in OTP code.
     */
    "EmailVerification.OTP.UseUppercaseCharactersInOTP": boolean;
    /**
     * Whether to use lower case letters in OTP code.
     */
    "EmailVerification.OTP.UseLowercaseCharactersInOTP": boolean;
    /**
     * Whether to use numeric characters in OTP code.
     */
    "EmailVerification.OTP.UseNumbersInOTP": boolean;
    /**
     * The length of the SMS OTP code.
     */
    "EmailVerification.OTP.OTPLength": string;
}

export enum VerificationOption {
    EMAIL_OTP = "emailOTP",
    EMAIL_LINK = "emailLink",
    SMS_OTP = "smsOTP"
}
