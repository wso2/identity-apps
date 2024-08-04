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
export class CommonAuthenticatorManagementConstants {
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
        ENTERPRISE: string;
        EXPERT_MODE: string;
        FACEBOOK: string;
        GITHUB: string;
        GOOGLE: string;
        HYPR: string;
        IPROOV: string;
        LINKEDIN: string;
        MICROSOFT: string;
        OIDC: string;
        ORGANIZATION_ENTERPRISE_IDP: string;
        SAML: string;
        SWE: string;
        TRUSTED_TOKEN_ISSUER: string;
    } = {
            APPLE: "apple-idp",
            ENTERPRISE: "enterprise-idp",
            EXPERT_MODE: "expert-mode-idp",
            FACEBOOK: "facebook-idp",
            GITHUB: "github-idp",
            GOOGLE: "google-idp",
            HYPR: "hypr-idp",
            IPROOV: "iproov-idp",
            LINKEDIN: "linkedin-idp",
            MICROSOFT: "microsoft-idp",
            OIDC: "enterprise-oidc-idp",
            ORGANIZATION_ENTERPRISE_IDP: "organization-enterprise-idp",
            SAML: "enterprise-saml-idp",
            SWE: "swe-idp",
            TRUSTED_TOKEN_ISSUER: "trusted-token-issuer"
        };
}
