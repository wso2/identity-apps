/**
 * Copyright (c) 2022, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
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
export const SMS_OTP_RESOURCE_KEY: string = "channel.type";
export const SMS_OTP_RESOURCE_VALUE: string = "choreo";
