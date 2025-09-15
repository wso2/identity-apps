/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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
 * Proptypes for the Password Recovery Form error messages.
 */
export interface PasswordRecoveryFormErrorValidationsInterface {
    /**
     * Recovery link expiry time field.
     */
    expiryTime: string;
    /**
     * Sms otp expiry time field
     */
    smsOtpExpiryTime: string;
    /**
     * SMS OTP code length field.
     */
    smsOtpLength: string;
    /**
     * max resend count field.
     */
    maxResendCount: string;
    /**
     * Max allowed failed attempts count field.
     */
    maxFailedAttemptCount: string;
}

/**
 * Form initial values interface.
 */
export interface PasswordRecoveryFormValuesInterface {
    /**
     * Recovery link expiry time.
     */
    expiryTime: string;
    /**
     * Notify user on successful password recovery.
     */
    notifySuccess: boolean;
    /**
     * Whether email link based recovery is enabled.
     */
    enableEmailLinkBasedRecovery: boolean;
    /**
     * Whether email OTP based recovery is enabled.
     */
    enableEmailOtpBasedRecovery: boolean;
    /**
     * Whether SMS based recovery is enabled.
     */
    enableSMSBasedRecovery: boolean;
    /**
     * SMS OTP expiry time.
     */
    smsOtpExpiryTime: string;
    /**
     * Whether to use upper case letters in SMS OTP code.
     */
    passwordRecoveryOtpUseUppercase: boolean;
    /**
     * Whether to use lower case letters in SMS OTP code.
     */
    passwordRecoveryOtpUseLowercase: boolean;
    /**
     * Whether to use numeric characters in SMS OTP code.
     */
    passwordRecoveryOtpUseNumeric: boolean;
    /**
     * The length of the SMS OTP code.
     */
    smsOtpLength: string;
    /**
     * The maximum amount of times recovery code/link is resent.
     */
    maxResendCount: string;
    /**
     * The maximum allowed failed attempts for a recovery flow.
     */
    maxFailedAttemptCount: string;
}

/**
 * Interface for Password Recovery Configuration Form props.
 */
export interface PasswordRecoveryConfigurationFormPropsInterface extends IdentifiableComponentInterface {
    /**
     * Connector's initial values.
     */
    initialValues: GovernanceConnectorInterface;
    /**
     * Callback for form submit.
     * @param values - Resolved Form Values.
     */
    onSubmit: (values) => void;
    /**
     * Is readonly.
     */
    readOnly?: boolean;
    /**
     * Whether the connector is enabled using the toggle button.
     */
    isConnectorEnabled?: boolean;
    /**
     * Specifies if the form is submitting.
     */
    isSubmitting?: boolean;
}

export interface PasswordRecoveryFormUpdatableConfigsInterface {
    /**
     * Expiry time for the recovery link.
     */
    "Recovery.ExpiryTime": number;
    /**
     * Enable email based recovery.
     */
    "Recovery.Notification.Password.emailLink.Enable": boolean;
    /**
     * Enable email OTP based recovery.
     */
    "Recovery.Notification.Password.OTP.SendOTPInEmail": boolean;
    /**
     * Expire time for the SMS OTP.
     */
    "Recovery.Notification.Password.ExpiryTime.smsOtp": number;
    /**
     * Maximum number of times before invalidating recovery flow.
     */
    "Recovery.Notification.Password.MaxFailedAttempts": number;
    /**
     * Maximum number of times the recovery code/link can be resent.
     */
    "Recovery.Notification.Password.MaxResendAttempts": number;
    /**
     * Enable SMS based recovery.
     */
    "Recovery.Notification.Password.smsOtp.Enable": boolean;
    /**
     * Use uppercase characters in the OTP.
     */
    "Recovery.Notification.Password.OTP.UseUppercaseCharactersInOTP": number;
    /**
     * Use lowercase characters in the OTP.
     */
    "Recovery.Notification.Password.OTP.UseLowercaseCharactersInOTP": number;
    /**
     * Use numbers in the OTP.
     */
    "Recovery.Notification.Password.OTP.UseNumbersInOTP": number;
    /**
     * Length of the OTP.
     */
    "Recovery.Notification.Password.OTP.OTPLength": number;
    /**
     * Notify user on successful password recovery.
     */
    "Recovery.NotifySuccess": boolean;
}

export enum EmailRecoveryOption {
    EMAIL_OTP = "emailOTP",
    EMAIL_LINK = "emailLink"
}
