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

import { IdentityAppsError } from "@wso2is/core/errors";

type MinMax = { min: number; max: number };

/**
 * Class containing connection management constants.
 */
export class ConnectionManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Internal domain name.
     *
     */
    public static readonly INTERNAL_DOMAIN: string  = "Internal/";

    /**
     * Local Server host.
     */
    public static readonly LOCAL_SERVER_URL: string = "localhost";

    public static readonly CANNOT_DELETE_IDP_DUE_TO_ASSOCIATIONS_ERROR_CODE: string = "IDP-65004";

    public static readonly PROVISIONING_CONNECTOR_DISPLAY_NAME: string = "displayName";
    public static readonly PROVISIONING_CONNECTOR_GOOGLE: string = "googleapps";

    public static readonly GOOGLE_OIDC_AUTHENTICATOR_ID: string = "R29vZ2xlT0lEQ0F1dGhlbnRpY2F0b3I";
    public static readonly FACEBOOK_AUTHENTICATOR_ID: string = "RmFjZWJvb2tBdXRoZW50aWNhdG9y";
    public static readonly TWITTER_AUTHENTICATOR_ID: string = "VHdpdHRlckF1dGhlbnRpY2F0b3I";
    public static readonly GITHUB_AUTHENTICATOR_ID: string = "R2l0aHViQXV0aGVudGljYXRvcg";
    public static readonly YAHOO_AUTHENTICATOR_ID: string = "WWFob29PQXV0aDJBdXRoZW50aWNhdG9y";
    public static readonly OFFICE_365_AUTHENTICATOR_ID: string = "T2ZmaWNlMzY1QXV0aGVudGljYXRvcg";
    public static readonly MS_LIVE_AUTHENTICATOR_ID: string = "TWljcm9zb2Z0V2luZG93c0xpdmVBdXRoZW50aWNhdG9y";
    public static readonly IWA_KERBEROS_AUTHENTICATOR_ID: string = "SVdBS2VyYmVyb3NBdXRoZW50aWNhdG9y";
    public static readonly MICROSOFT_AUTHENTICATOR_ID: string = "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I";
    public static readonly HYPR_AUTHENTICATOR_ID: string = "SFlQUkF1dGhlbnRpY2F0b3I";
    public static readonly SIWE_AUTHENTICATOR_ID: string = "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I";

    // Known Social/Enterprise authenticator names;
    public static readonly GOOGLE_OIDC_AUTHENTICATOR_NAME: string = "GoogleOIDCAuthenticator";
    public static readonly FACEBOOK_AUTHENTICATOR_NAME: string = "FacebookAuthenticator";
    public static readonly GITHUB_AUTHENTICATOR_NAME: string = "GithubAuthenticator";
    public static readonly YAHOO_AUTHENTICATOR_NAME: string = "YahooOAuth2Authenticator";
    public static readonly TWITTER_AUTHENTICATOR_NAME: string = "TwitterAuthenticator";
    public static readonly OFFICE_365_AUTHENTICATOR_NAME: string = "Office365Authenticator";
    public static readonly MS_LIVE_AUTHENTICATOR_NAME: string = "MicrosoftWindowsLiveAuthenticator";
    public static readonly IWA_KERBEROS_AUTHENTICATOR_NAME: string = "IWAKerberosAuthenticator";
    public static readonly APPLE_AUTHENTICATOR_NAME: string = "AppleOIDCAuthenticator";

    public static readonly ORGANIZATION_ENTERPRISE_AUTHENTICATOR_ID: string = "T3JnYW5pemF0aW9uQXV0aGVudGljYXRvcg";
    public static readonly OIDC_AUTHENTICATOR_ID: string = "T3BlbklEQ29ubmVjdEF1dGhlbnRpY2F0b3I";
    public static readonly SAML_AUTHENTICATOR_ID: string = "U0FNTFNTT0F1dGhlbnRpY2F0b3I";

    public static readonly IDP_NAME_LENGTH: MinMax = { max: 120, min: 3 };
    public static readonly JWKS_URL_LENGTH: MinMax = { max: 2048, min: 0 };
    public static readonly CLAIM_CONFIG_FIELD_MAX_LENGTH: number  = 100;
    public static readonly CLAIM_CONFIG_FIELD_MIN_LENGTH: number  = 1;
    public static readonly CLAIM_USERNAME: string  = "http://wso2.org/claims/username";
    public static readonly CLAIM_EMAIL: string  = "http://wso2.org/claims/emailaddress";
    public static readonly CLAIM_MOBILE: string  = "http://wso2.org/claims/mobile";
    public static readonly CLAIM_ROLES: string  = "http://wso2.org/claims/roles";
    public static readonly OIDC_ROLES_CLAIM: string  = "roles";
    public static readonly LOCAL_DIALECT_GROUP_CLAIM: string  = "http://wso2.org/claims/groups";
    public static readonly STANDARD_DIALECT_GROUP_CLAIM: string  = "groups";

    public static readonly IMPLICIT_ACCOUNT_LINKING_ATTRIBUTES: string[] = [
        ConnectionManagementConstants.CLAIM_USERNAME,
        ConnectionManagementConstants.CLAIM_EMAIL,
        ConnectionManagementConstants.CLAIM_MOBILE
    ];

    public static readonly CONNECTIONS_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while fetching identity providers.";

    public static readonly CONNECTIONS_FETCH_ERROR: string = "An error occurred while fetching " +
    "the identity providers.";

    public static readonly LOCAL_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching the local authenticator.";

    public static readonly LOCAL_AUTHENTICATOR_FETCH_ERROR: string = "An error occurred while fetching the " +
        "local authenticator.";

    public static readonly MULTI_FACTOR_AUTHENTICATOR_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching the multi-factor authenticator.";

    public static readonly MULTI_FACTOR_AUTHENTICATOR_UPDATE_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while updating the multi-factor authenticator.";

    public static readonly MULTI_FACTOR_AUTHENTICATOR_FETCH_ERROR: string = "An error occurred while fetching the " +
        "multi-factor authenticator.";

    public static readonly MULTI_FACTOR_AUTHENTICATOR_UPDATE_ERROR: string = "An error occurred while updating the " +
        "multi-factor authenticator.";

    public static readonly CONNECTION_JIT_PROVISIONING_UPDATE_ERROR: string = "An error occurred while" +
        " updating the JIT provisioning configurations of the identity provider.";

    public static readonly CONNECTION_CERTIFICATE_UPDATE_ERROR: string = "An error occurred while updating " +
        "the certificate of the identity provider.";

    public static readonly CONNECTION_CLAIMS_UPDATE_ERROR: string = "An error occurred while updating claims " +
        "configurations of the identity provider.";

    public static readonly CONNECTION_IMPLICIT_ASSOCIATION_UPDATE_ERROR: string = "An error occurred while " +
        "updating implicit association configurations of the identity provider.";

    /**
     * Identity provider create limit reached error.
    **/
    public static readonly ERROR_CREATE_LIMIT_REACHED: IdentityAppsError = new IdentityAppsError(
        "IDP-60035",
        "idp:notifications.apiLimitReachedError.error.description",
        "idp:notifications.apiLimitReachedError.error.message",
        "cec1f247-32fd-4624-9915-f469195a53ac"
    );

    public static readonly ORG_ENTERPRISE_CONNECTION_ID: string  = "organization-enterprise-idp";

    public static readonly SHOW_PREDEFINED_TEMPLATES_IN_EXPERT_MODE_SETUP: boolean = false;

    public static readonly GOOGLE_PRIVATE_KEY: string = "google_prov_private_key";
    public static readonly USER_ID_IN_CLAIMS: string = "IsUserIdInClaims";

    /**
     * Set of connection template group Ids.
     */
    public static readonly CONNECTION_TEMPLATE_GROUPS: {
        ENTERPRISE_PROTOCOLS: string;
    } = {
            ENTERPRISE_PROTOCOLS: "enterprise-protocols"
        };

    /**
     * Set of Connection setup guide links.
     */
    public static readonly DOC_LINK_DICTIONARY: Map<string, string> = new Map<string, string>([
        [ "apple-idp", "develop.connections.newConnection.apple.learnMore" ],
        [ "enterprise-protocols", "develop.connections.newConnection.learnMore" ],
        [ "facebook-idp", "develop.connections.newConnection.facebook.learnMore" ],
        [ "github-idp", "develop.connections.newConnection.github.learnMore" ],
        [ "google-idp", "develop.connections.newConnection.google.learnMore" ],
        [ "hypr-idp", "develop.connections.newConnection.hypr.learnMore" ],
        [ "microsoft-idp", "develop.connections.newConnection.microsoft.learnMore" ],
        [ "enterprise-oidc-idp", "develop.connections.newConnection.enterprise.oidcLearnMore.learnMore" ],
        [ "enterprise-saml-idp", "develop.connections.newConnection.enterprise.samlLearnMore.learnMore" ],
        [ "swe-idp", "develop.connections.newConnection.siwe.learnMore" ],
        [ "trusted-token-issuer", "develop.connections.newConnection.trustedTokenIssuer.learnMore" ]
    ]);
}

export class SIWEConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     */
    private constructor() { }

    /**
     * SIWE Scope mappings.
     */
    public static readonly SIWE_SCOPE_DICTIONARY: Record<string, string> = {
        OPENID: "openid",
        PROFILE: "profile"
    };
}
