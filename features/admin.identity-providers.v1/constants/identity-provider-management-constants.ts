/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

import { authenticatorConfig } from "@wso2is/admin.extensions.v1/configs/authenticator";

/**
 * Class containing identity provider management constants.
 * @deprecated Use the constants in the `@wso2is/admin.connections.v1` package.
 */
export class IdentityProviderManagementConstants {

    public static readonly SESSION_EXECUTOR_AUTHENTICATOR: string = "SessionExecutor";
    public static readonly TOTP_AUTHENTICATOR: string = "totp";
    public static readonly IPROOV_AUTHENTICATOR: string = "IproovAuthenticator";
    public static readonly EMAIL_OTP_AUTHENTICATOR: string = "email-otp-authenticator";
    public static readonly FIDO_AUTHENTICATOR: string = "FIDOAuthenticator";
    public static readonly BASIC_AUTHENTICATOR: string = "BasicAuthenticator";
    public static readonly IDENTIFIER_FIRST_AUTHENTICATOR: string = "IdentifierExecutor";
    public static readonly SMS_OTP_AUTHENTICATOR: string = authenticatorConfig?.overriddenAuthenticatorNames?.
        SMS_OTP_AUTHENTICATOR ?? "sms-otp";

    public static readonly BACKUP_CODE_AUTHENTICATOR: string = "backup-code-authenticator";
    public static readonly MAGIC_LINK_AUTHENTICATOR: string = "MagicLinkAuthenticator";

    // Known Local Authenticator IDS.
    public static readonly BASIC_AUTHENTICATOR_ID: string = "QmFzaWNBdXRoZW50aWNhdG9y";
    public static readonly IDENTIFIER_FIRST_AUTHENTICATOR_ID: string = "SWRlbnRpZmllckV4ZWN1dG9y";
    public static readonly JWT_BASIC_AUTHENTICATOR_ID: string = "SldUQmFzaWNBdXRoZW50aWNhdG9y";
    public static readonly FIDO_AUTHENTICATOR_ID: string = "RklET0F1dGhlbnRpY2F0b3I";
    public static readonly SMS_OTP_AUTHENTICATOR_ID: string = authenticatorConfig?.overriddenAuthenticatorIds?.
        SMS_OTP_AUTHENTICATOR_ID ?? "U01TT1RQ";

    public static readonly TOTP_AUTHENTICATOR_ID: string = "dG90cA";
    public static readonly ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID: string = "U2Vzc2lvbkV4ZWN1dG9y";
    public static readonly X509_CERTIFICATE_AUTHENTICATOR_ID: string = "eDUwOUNlcnRpZmljYXRlQXV0aGVudGljYXRvcg";
    public static readonly EMAIL_OTP_AUTHENTICATOR_ID: string = "ZW1haWwtb3RwLWF1dGhlbnRpY2F0b3I";
    public static readonly LEGACY_EMAIL_OTP_AUTHENTICATOR_ID: string = "RW1haWxPVFA";
    public static readonly BACKUP_CODE_AUTHENTICATOR_ID: string = "YmFja3VwLWNvZGUtYXV0aGVudGljYXRvcg";
    public static readonly MAGIC_LINK_AUTHENTICATOR_ID: string = "TWFnaWNMaW5rQXV0aGVudGljYXRvcg";

    // Known Social/Enterprise authenticator IDs.
    public static readonly MICROSOFT_AUTHENTICATOR_ID: string = "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I";
    public static readonly HYPR_AUTHENTICATOR_ID: string = "SFlQUkF1dGhlbnRpY2F0b3I";
    public static readonly IPROOV_AUTHENTICATOR_ID: string = "SXByb292QXV0aGVudGljYXRvcg";

    // Keys for the initial values of Email OTP Authenticator
    public static readonly AUTHENTICATOR_INIT_VALUES_EMAIL_OTP_EXPIRY_TIME_KEY: string = "EmailOTP_ExpiryTime";

    // Keys for the initial values of SMS OTP Authenticator
    public static readonly AUTHENTICATOR_INIT_VALUES_SMS_OTP_EXPIRY_TIME_KEY: string = "SmsOTP_ExpiryTime";
}
