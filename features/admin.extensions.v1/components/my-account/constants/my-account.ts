/**
 * Copyright (c) 2022-2024, WSO2 LLC. (https://www.wso2.com).
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

export class MyAccountManagementConstants {
    public static readonly MYACCOUNT_STATUS_UPDATE_ERROR: string = "An error occurred while updating " +
    "status of the My Account Portal.";

    public static readonly MYACCOUNT_STATUS_UPDATE_INVALID_STATUS_CODE_ERROR: string = "Received an " +
    "invalid status code while updating status of the My Account Portal.";
}

/**
 * Enum for my account attribute types.
 *
 * @readonly
 */
export enum MyAccountAttributeTypes {
    ENABLE = "enable",
    EMAIL_OTP_ENABLED = "email_otp_enabled",
    SMS_OTP_ENABLED = "sms_otp_enabled",
    TOTP_ENABLED = "totp_enabled",
    BACKUP_CODE_ENABLED = "backup_code_enabled",
}

export enum TotpConfigAttributeTypes {
    ENROLL_USER_IN_AUTHENTICATION_FLOW = "enrolUserInAuthenticationFlow"
}

export const CHANNEL_TYPE: string = "SMSPublisher";
export const VALID_SMS_OTP_PROVIDERS: string[] = [ "choreo", "Twilio", "Custom", "Vonage" ];
