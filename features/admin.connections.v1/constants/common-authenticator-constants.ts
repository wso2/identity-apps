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
 * This class contains the constants for the Common for Authenticators.
 */
export class CommonAuthenticatorConstants {
    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    /**
     * Set of Connection template Ids.
     */
    public static readonly CONNECTION_TEMPLATE_IDS: {
        APPLE: string;
        CUSTOM_AUTHENTICATOR: string;
        ENTERPRISE: string;
        EXPERT_MODE: string;
        EXTERNAL_CUSTOM_AUTHENTICATOR: string;
        FACEBOOK: string;
        GITHUB: string;
        GOOGLE: string;
        HYPR: string;
        INTERNAL_CUSTOM_AUTHENTICATOR: string;
        IPROOV: string;
        LINKEDIN: string;
        MICROSOFT: string;
        OIDC: string;
        ORGANIZATION_ENTERPRISE_IDP: string;
        SAML: string;
        SWE: string;
        TRUSTED_TOKEN_ISSUER: string;
        TWO_FACTOR_CUSTOM_AUTHENTICATOR: string;
    } = {
            APPLE: "apple-idp",
            CUSTOM_AUTHENTICATOR: "custom-authenticator",
            ENTERPRISE: "enterprise-idp",
            EXPERT_MODE: "expert-mode-idp",
            EXTERNAL_CUSTOM_AUTHENTICATOR: "external-custom-authenticator",
            FACEBOOK: "facebook-idp",
            GITHUB: "github-idp",
            GOOGLE: "google-idp",
            HYPR: "hypr-idp",
            INTERNAL_CUSTOM_AUTHENTICATOR: "internal-user-custom-authenticator",
            IPROOV: "iproov-idp",
            LINKEDIN: "linkedin-idp",
            MICROSOFT: "microsoft-idp",
            OIDC: "enterprise-oidc-idp",
            ORGANIZATION_ENTERPRISE_IDP: "organization-enterprise-idp",
            SAML: "enterprise-saml-idp",
            SWE: "swe-idp",
            TRUSTED_TOKEN_ISSUER: "trusted-token-issuer",
            TWO_FACTOR_CUSTOM_AUTHENTICATOR: "two-factor-custom-authenticator"
        };

    /**
	 * UUID of the Multi-Factor Authenticators governance connector category.
	 */
    public static readonly MFA_CONNECTOR_CATEGORY_ID: string = "TXVsdGkgRmFjdG9yIEF1dGhlbnRpY2F0b3Jz";

    /**
     * ID of the deprecated SCIM1 provisioning connector.
     */
    public static readonly DEPRECATED_SCIM1_PROVISIONING_CONNECTOR_ID: string = "c2NpbQ";

    /**
     * Local Server host.
     */
    public static readonly LOCAL_SERVER_URL: string = "localhost";

    public static readonly ERROR_CODES: {
        CANNOT_DELETE_IDP_DUE_TO_ASSOCIATIONS_ERROR_CODE: string
    } = {
            CANNOT_DELETE_IDP_DUE_TO_ASSOCIATIONS_ERROR_CODE: "IDP-65004"
        };

    public static readonly PROVISIONING_CONNECTOR_DISPLAY_NAME_KEY: string = "displayName";
    public static readonly PROVISIONING_CONNECTOR_GOOGLE: string = "googleapps";

    public static readonly API_KEY_HEADER_REGEX: RegExp = /^[a-zA-Z0-9][a-zA-Z0-9-.]+$/;
    public static readonly IDENTIFIER_REGEX: RegExp = /^[a-zA-Z0-9_-]{3,}$/;
    public static readonly DISPLAY_NAME_REGEX: RegExp = /^.{3,}$/;

    public static readonly TEMPLATE_ID_FIELD: string = "templateId";
}
