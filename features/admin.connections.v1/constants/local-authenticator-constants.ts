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

/**
 * This class contains the constants for the Local Authenticators.
 */
export class LocalAuthenticatorConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    /**
     * Identifier for the local IDP.
     */
    public static readonly LOCAL_IDP_IDENTIFIER: string = "LOCAL";

    public static readonly BASIC_AUTHENTICATOR_ID: string = "QmFzaWNBdXRoZW50aWNhdG9y";
    public static readonly IDENTIFIER_FIRST_AUTHENTICATOR_ID: string = "SWRlbnRpZmllckV4ZWN1dG9y";
    public static readonly JWT_BASIC_AUTHENTICATOR_ID: string = "SldUQmFzaWNBdXRoZW50aWNhdG9y";
    public static readonly FIDO_AUTHENTICATOR_ID: string = "RklET0F1dGhlbnRpY2F0b3I";
    public static readonly SMS_OTP_AUTHENTICATOR_ID: string = "c21zLW90cC1hdXRoZW50aWNhdG9y";
    public static readonly TOTP_AUTHENTICATOR_ID: string = "dG90cA";
    public static readonly ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID: string = "U2Vzc2lvbkV4ZWN1dG9y";
    public static readonly X509_CERTIFICATE_AUTHENTICATOR_ID: string = "eDUwOUNlcnRpZmljYXRlQXV0aGVudGljYXRvcg";
    public static readonly OAUTH_BEARER_AUTHENTICATOR_ID: string = "T0F1dGhSZXF1ZXN0UGF0aEF1dGhlbnRpY2F0b3I";
    public static readonly EMAIL_OTP_AUTHENTICATOR_ID: string = "ZW1haWwtb3RwLWF1dGhlbnRpY2F0b3I";
    public static readonly LEGACY_EMAIL_OTP_AUTHENTICATOR_ID: string = "RW1haWxPVFA";
    public static readonly BACKUP_CODE_AUTHENTICATOR_ID: string = "YmFja3VwLWNvZGUtYXV0aGVudGljYXRvcg";
    public static readonly MAGIC_LINK_AUTHENTICATOR_ID: string = "TWFnaWNMaW5rQXV0aGVudGljYXRvcg";

    public static readonly OIDC_AUTHENTICATOR_ID: string = "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I";
    public static readonly SAML_AUTHENTICATOR_ID: string = "U0FNTFNTT0F1dGhlbnRpY2F0b3I";
    public static readonly PASSIVE_STS_AUTHENTICATOR_ID: string = "UGFzc2l2ZVNUU0F1dGhlbnRpY2F0b3I";
    public static readonly ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID: string = "T3JnYW5pemF0aW9uQXV0aGVudGljYXRvcg";
    public static readonly IPROOV_AUTHENTICATOR_ID: string = "SXByb292QXV0aGVudGljYXRvcg";

    public static readonly PASSIVE_STS_AUTHENTICATOR_NAME: string = "PassiveSTSAuthenticator";
    public static readonly SAML_AUTHENTICATOR_NAME: string = "SAMLSSOAuthenticator";
    public static readonly OIDC_AUTHENTICATOR_NAME: string = "OpenIDConnectAuthenticator";
    public static readonly LEGACY_EMAIL_OTP_AUTHENTICATOR_NAME: string = "EmailOTP";
    public static readonly SMS_OTP_AUTHENTICATOR_NAME: string = "SMSOTP";
    public static readonly ORGANIZATION_SSO_AUTHENTICATOR_NAME: string = "OrganizationAuthenticator";
    public static readonly ORGANIZATION_AUTHENTICATOR: string = "SSO";

    // Federated Authenticators
    public static readonly IPROOV_AUTHENTICATOR_NAME: string = "IproovAuthenticator";
}
