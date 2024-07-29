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
    public static readonly SMS_OTP_AUTHENTICATOR_ID: string = authenticatorConfig?.overriddenAuthenticatorIds?.
        SMS_OTP_AUTHENTICATOR_ID ?? "U01TT1RQ";

    // Keys for the initial values of Email OTP Authenticator
    public static readonly AUTHENTICATOR_INIT_VALUES_EMAIL_OTP_EXPIRY_TIME_KEY: string = "EmailOTP_ExpiryTime";

    // Keys for the initial values of SMS OTP Authenticator
    public static readonly AUTHENTICATOR_INIT_VALUES_SMS_OTP_EXPIRY_TIME_KEY: string = "SmsOTP_ExpiryTime";
}
