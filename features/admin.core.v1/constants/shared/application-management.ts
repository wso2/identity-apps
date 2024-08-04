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

/**
 * Class containing application management constants.
 */
export class ApplicationManagementConstants {

    public static readonly EMPTY_STRING: string = "";
    public static readonly LINE_BREAK: string = "\n";
    public static readonly MAXIMUM_NUMBER_OF_LIST_ITEMS_TO_SHOW_INSIDE_POPUP: number = 3;
    public static readonly AUTHENTICATORS_LOCAL_STORAGE_KEY: string = btoa("Authenticators");
    public static readonly EMPTY_JSON_ARRAY: string = "[]";

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    public static readonly DEFAULT_ADAPTIVE_AUTH_SCRIPT_HEADER: string = "var onLoginRequest = function(context) {";
    public static readonly DEFAULT_ADAPTIVE_AUTH_SCRIPT_FOOTER: string = "};";

    public static readonly DEFAULT_ADAPTIVE_AUTH_SCRIPT: string[] = [
        ApplicationManagementConstants.DEFAULT_ADAPTIVE_AUTH_SCRIPT_HEADER,
        ApplicationManagementConstants.DEFAULT_ADAPTIVE_AUTH_SCRIPT_FOOTER,
        ""
    ];

    /**
     * Set of keys used to enable/disable features.
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("APPLICATION_ADD", "application.add")
        .set("APPLICATION_EDIT", "application.edit")
        .set("APPLICATION_EDIT_GENERAL_SETTINGS", "application.edit.generalSettings")
        .set("APPLICATION_EDIT_ACCESS_CONFIG", "applications.edit.accessConfiguration")
        .set("APPLICATION_EDIT_ATTRIBUTE_MAPPING", "applications.edit.attributeMapping")
        .set("APPLICATION_EDIT_SIGN_ON_METHOD_CONFIG", "applications.edit.signOnMethodConfiguration")
        .set("APPLICATION_EDIT_PROVISIONING_SETTINGS", "applications.edit.provisioningSettings")
        .set("APPLICATION_EDIT_ADVANCED_SETTINGS", "applications.edit.advancedSettings")
        .set("APPLICATION_EDIT_INFO", "applications.edit.info");

    /**
     * Key for the URL search param for application state.
     */
    public static readonly APP_STATE_URL_SEARCH_PARAM_KEY: string = "state";

    /**
     * Value for sign on authentication param for application state.
     */
    public static readonly APP_STATE_STRONG_AUTH_PARAM_KEY: string = "isSignOn";

    /**
     * Key for the URL search param for application readonly state.
     */
    public static readonly APP_READ_ONLY_STATE_URL_SEARCH_PARAM_KEY: string = "readOnly";

    /**
     * Key for the URL search param for client secret hashing enabled flag.
     */
    public static readonly CLIENT_SECRET_HASH_ENABLED_URL_SEARCH_PARAM_KEY: string = "isClientSecretHashEnabled";

    /**
     * Value for the URL search param for application state.
     */
    public static readonly APP_STATE_URL_SEARCH_PARAM_VALUE: string = "new";

    /**
     * Value for sign on authentication param for application state.
     */
    public static readonly APP_STATE_STRONG_AUTH_PARAM_VALUE: string = "true";

    /**
     * Value for sign in method tab url.
     */
    public static readonly SIGN_IN_METHOD_TAB_URL_FRAG: string = "sign-in-method";

    /**
     * Default application template loading strategy.
     */
    // public static readonly DEFAULT_APP_TEMPLATE_LOADING_STRATEGY: ApplicationTemplateLoadingStrategies =
    //     ApplicationTemplateLoadingStrategies.LOCAL;

    /**
     * Map to access the template ids.
     */
    public static readonly TEMPLATE_IDS: Map<string, any> = new Map<string, any>()
        .set("box", "h9c5e23e-fc78-484b-9bec-015d242361b8")
        .set("mobile", "mobile-application")
        .set("oidcWeb", "b9c5e11e-fc78-484b-9bec-015d247561b8")
        .set("samlWeb", "776a73da-fd8e-490b-84ff-93009f8ede85")
        .set("spa", "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7")
        .set("slack", "z345e11e-fc78-484b-9bec-015d2475u341r")
        .set("windowsDesktop", "df929521-6768-44f5-8586-624126ec3f8b")
        .set("workday", "r565e11e-fc78-484b-9bec-015d24753456")
        .set("zoom", "t565e11e-fc78-484b-9bec-015d2472008");

    /**
     * Mapping for template and template DOC in the doc structure. i.e `<"TEMPLATE_NAME", "TAG_NAME_IN_DOC_STRUCTURE">`
     */
    public static readonly APPLICATION_TEMPLATE_DOC_MAPPING: Map<string, string> = new Map<string, string>()
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("box"), "OIDC Web Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("mobile"), "Mobile Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("oidcWeb"), "OIDC Web Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("spa"), "Single Page Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("slack"), "OIDC Web Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("windowsDesktop"), "Windows Desktop Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("workday"), "OIDC Web Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("zoom"), "OIDC Web Application");

    /**
     * Template categories to be used to extract the filter types.
     */
    // public static readonly FILTERABLE_TEMPLATE_CATEGORIES: any[] = [
    //     ApplicationTemplateCategories.VENDOR
    // ];

    /**
     * Set of grant types to hide from the UI.
     */
    public static readonly HIDDEN_GRANT_TYPES: string[] = [ "account_switch" ];

    public static readonly AUTHORIZATION_CODE_GRANT: string = "authorization_code";
    public static readonly CLIENT_CREDENTIALS_GRANT: string = "client_credentials";
    public static readonly REFRESH_TOKEN_GRANT: string = "refresh_token";
    public static readonly ORGANIZATION_SWITCH_GRANT: string = "organization_switch";
    public static readonly IMPLICIT_GRANT: string = "implicit";
    public static readonly PASSWORD: string = "password";
    public static readonly SAML2_BEARER: string = "urn:ietf:params:oauth:grant-type:saml2-bearer";
    public static readonly JWT_BEARER: string = "urn:ietf:params:oauth:grant-type:jwt-bearer";
    public static readonly IWA_NTLM: string = "iwa:ntlm";
    public static readonly UMA_TICKET: string = "urn:ietf:params:oauth:grant-type:uma-ticket";
    public static readonly DEVICE_GRANT: string = "urn:ietf:params:oauth:grant-type:device_code";

    /**
     * Currently refresh grant type is recommended to use at least one of below.
     * We need to get information from backend rather than hard code.
     * This issue is tracked via https://github.com/wso2/product-is/issues/12397.
     */
    public static readonly IS_REFRESH_TOKEN_GRANT_TYPE_ALLOWED: string[] = [
        ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
        ApplicationManagementConstants.PASSWORD,
        ApplicationManagementConstants.SAML2_BEARER,
        ApplicationManagementConstants.IWA_NTLM,
        ApplicationManagementConstants.JWT_BEARER,
        ApplicationManagementConstants.UMA_TICKET
    ];

    /**
     * Set of grant types allowed for certain templates.
     */
    public static readonly TEMPLATE_WISE_ALLOWED_GRANT_TYPES: Record<string, string[]> = {
        [ "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7" ]: [
            ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
            ApplicationManagementConstants.REFRESH_TOKEN_GRANT,
            ApplicationManagementConstants.IMPLICIT_GRANT,
            ApplicationManagementConstants.ORGANIZATION_SWITCH_GRANT
        ],
        [ "b9c5e11e-fc78-484b-9bec-015d247561b8" ]: [
            ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
            ApplicationManagementConstants.IMPLICIT_GRANT,
            ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT,
            ApplicationManagementConstants.REFRESH_TOKEN_GRANT,
            ApplicationManagementConstants.ORGANIZATION_SWITCH_GRANT
        ],
        [ "custom-application" ]: [
            ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
            ApplicationManagementConstants.IMPLICIT_GRANT,
            ApplicationManagementConstants.PASSWORD,
            ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT,
            ApplicationManagementConstants.REFRESH_TOKEN_GRANT,
            ApplicationManagementConstants.ORGANIZATION_SWITCH_GRANT,
            ApplicationManagementConstants.DEVICE_GRANT
        ],
        [ "mobile-application" ]: [
            ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT,
            ApplicationManagementConstants.REFRESH_TOKEN_GRANT,
            ApplicationManagementConstants.IMPLICIT_GRANT,
            ApplicationManagementConstants.PASSWORD,
            ApplicationManagementConstants.DEVICE_GRANT,
            ApplicationManagementConstants.ORGANIZATION_SWITCH_GRANT
        ]
    };

    /**
     * Holds metadata on how to arrange the values when rendering above
     * Usage: Map the index to key to rearrange the values.
     */
    public static readonly TEMPLATE_WISE_ALLOWED_GRANT_TYPE_ARRANGE_ORDER: { [ key: string ]: Map<string, number>; } = {
        [ "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7" ]: new Map<string, number>([
            [ ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT, 0 ],
            [ ApplicationManagementConstants.IMPLICIT_GRANT, 1 ],
            [ ApplicationManagementConstants.REFRESH_TOKEN_GRANT, 2 ]
        ]),
        [ "b9c5e11e-fc78-484b-9bec-015d247561b8" ]: new Map<string, number>([
            [ ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT, 0 ],
            [ ApplicationManagementConstants.IMPLICIT_GRANT, 3 ],
            [ ApplicationManagementConstants.PASSWORD, 4 ],
            [ ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT, 1 ],
            [ ApplicationManagementConstants.REFRESH_TOKEN_GRANT, 2 ]
        ]),
        [ "custom-application" ]: new Map<string, number>([
            [ ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT, 0 ],
            [ ApplicationManagementConstants.IMPLICIT_GRANT, 3 ],
            [ ApplicationManagementConstants.PASSWORD, 4 ],
            [ ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT, 1 ],
            [ ApplicationManagementConstants.REFRESH_TOKEN_GRANT, 2 ]
        ])
    };

    /**
     * Key for the SPA template.
     */
    public static readonly SPA: string = "Single Page Application";

    // API errors
    public static readonly AUTH_PROTOCOL_METADATA_INVALID_STATUS_CODE_ERROR: string = "Received an invalid status " +
        "code while retrieving the auth protocol metadata.";

    public static readonly AUTH_PROTOCOL_METADATA_FETCH_ERROR: string = "An error occurred while fetching the " +
        "metadata related to the required auth protocol.";

    public static readonly AUTH_PROTOCOL_CONFIG_UPDATE_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while updating the auth protocol config.";

    public static readonly AUTH_PROTOCOL_CONFIG_UPDATE_ERROR: string = "An error occurred while updating the auth" +
        "protocol config.";

    public static readonly ADAPTIVE_AUTH_TEMPLATES_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching adaptive authentication templates.";

    public static readonly ADAPTIVE_AUTH_TEMPLATES_FETCH_ERROR: string = "An error occurred while fetching the " +
        "required adaptive authentication template.";

    public static readonly APP_PROTOCOL_DELETE_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while deleting the protocol config.";

    public static readonly APP_PROTOCOL_DELETE_ERROR: string = "An error occurred while deleting the" +
        "protocol config.";

    public static readonly APPLICATION_TEMPLATE_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching application template.";

    public static readonly APPLICATION_TEMPLATE_FETCH_ERROR: string = "An error occurred while fetching the " +
        "required adaptive application template.";

    public static readonly APPLICATION_TEMPLATES_LIST_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while fetching application templates list.";

    public static readonly APPLICATION_TEMPLATES_LIST_FETCH_ERROR: string = "An error occurred while fetching the " +
        "required adaptive application templates list.";

    public static readonly OIDC_CONFIGURATIONS_STATUS_CODE_ERROR: string = "Received an invalid status " +
        "code while retrieving the OIDC configurations of the IDP.";

    public static readonly SAML_CONFIGURATIONS_STATUS_CODE_ERROR: string = "Received an invalid status " +
        "code while retrieving the SAML configurations of the IDP.";

    public static readonly APPLICATION_OIDC_CONFIGURATIONS_FETCH_ERROR: string = "An error occurred while fetching " +
        "the OIDC configurations of the IDP.";

    public static readonly APPLICATION_SAML_CONFIGURATIONS_FETCH_ERROR: string = "An error occurred while fetching " +
        "the SAML configurations of the IDP.";

    public static readonly REQUEST_PATH_AUTHENTICATORS_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while retrieving the request path authenticators.";

    public static readonly REQUEST_PATH_AUTHENTICATORS_FETCH_ERROR: string = "An error occurred while fetching the " +
        "request path authenticators.";

    public static readonly UNABLE_FETCH_APPLICATIONS: string = "An error occurred while fetching applications.";

    // public static readonly IDENTIFIER_FIRST_AUTHENTICATOR_ID: string =
    //     IdentityProviderManagementConstants.LOCAL_IDP_IDENTIFIER + "-" + "SWRlbnRpZmllckV4ZWN1dG9y";

    public static readonly MYACCOUNT_STATUS_UPDATE_ERROR: string = "An error occurred while updating " +
        "status of the My Account Portal.";

    public static readonly MYACCOUNT_STATUS_UPDATE_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while updating status of the My Account Portal.";

    public static readonly SECOND_FACTOR_AUTHENTICATORS_DROPPABLE_ID: string = "second-factor-authenticators";
    public static readonly EXTERNAL_AUTHENTICATORS_DROPPABLE_ID: string = "external-authenticators";
    public static readonly SOCIAL_LOGIN_HEADER: string = "Social Login";

    // Authenticators that are only handlers.
    // public static readonly HANDLER_AUTHENTICATORS: string[] = [
    //     ApplicationManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID
    // ];

    // First factor authenticators.
    // public static readonly FIRST_FACTOR_AUTHENTICATORS: string[] = [
    //     IdentityProviderManagementConstants.BASIC_AUTHENTICATOR,
    //     IdentityProviderManagementConstants.FIDO_AUTHENTICATOR
    // ];

    // Second factor authenticators.
    // public static readonly SECOND_FACTOR_AUTHENTICATORS: string[] = [
    //     IdentityProviderManagementConstants.TOTP_AUTHENTICATOR,
    //     IdentityProviderManagementConstants.TOTP_AUTHENTICATOR_ID,
    //     IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR,
    //     IdentityProviderManagementConstants.EMAIL_OTP_AUTHENTICATOR_ID,
    //     IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR,
    //     IdentityProviderManagementConstants.SMS_OTP_AUTHENTICATOR_ID
    // ];

    // Known social authenticators.
    // public static readonly SOCIAL_AUTHENTICATORS: string[] = [
    //     IdentityProviderManagementConstants.APPLE_AUTHENTICATOR_ID,
    //     IdentityProviderManagementConstants.APPLE_AUTHENTICATOR_NAME,
    //     IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_ID,
    //     IdentityProviderManagementConstants.GOOGLE_OIDC_AUTHENTICATOR_NAME,
    //     IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_ID,
    //     IdentityProviderManagementConstants.FACEBOOK_AUTHENTICATOR_NAME,
    //     IdentityProviderManagementConstants.MICROSOFT_AUTHENTICATOR_ID,
    //     IdentityProviderManagementConstants.MICROSOFT_AUTHENTICATOR_NAME,
    //     IdentityProviderManagementConstants.TWITTER_AUTHENTICATOR_ID,
    //     IdentityProviderManagementConstants.TWITTER_AUTHENTICATOR_NAME,
    //     IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_ID,
    //     IdentityProviderManagementConstants.GITHUB_AUTHENTICATOR_NAME
    // ];

    // Authenticators that can handle TOTP.
    // public static readonly TOTP_HANDLERS: string[] = [
    //     ...ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
    //     ...ApplicationManagementConstants.SOCIAL_AUTHENTICATORS,
    //     IdentityProviderManagementConstants.MAGIC_LINK_AUTHENTICATOR
    // ];

    // Authenticators that can handle Email OTP.
    // public static readonly EMAIL_OTP_HANDLERS: string[] = [
    //     ...ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
    //     ...ApplicationManagementConstants.SOCIAL_AUTHENTICATORS
    // ];

    // Enterprise EIDP Authenticators
    // public static readonly EIDP_AUTHENTICATORS: SupportedAuthenticators[] = [
    //     SupportedAuthenticators.OIDC,
    //     SupportedAuthenticators.SAML
    // ];

    /**
     * PEM certificate field default placeholder.
     */
    public static readonly PEM_CERTIFICATE_PLACEHOLDER: string = "-----BEGIN CERTIFICATE-----\n" +
        "MIIFaDCCBFCgAwIBAgISESHkvZFwK9Qz0KsXD3x8p44aMA0GCSqGSIb3DQEBCwUA\n" +
        "...\n" +
        "lffygD5IymCSuuDim4qB/9bh7oi37heJ4ObpBIzroPUOthbG4gv/5blW3Dc=\n" +
        "-----END CERTIFICATE-----";

    /**
     * Form element constraints.
     */
    public static readonly FORM_FIELD_CONSTRAINTS: {
        APP_DESCRIPTION_PATTERN: RegExp;
        APP_NAME_MAX_LENGTH: number;
        APP_NAME_PATTERN: RegExp;
    } = {
        APP_DESCRIPTION_PATTERN: new RegExp("^[a-zA-Z0-9.+=!$#()@&%*~_-]+(?: [a-zA-Z0-9.+=!$#()@&%*~_-]+)*$", "gm"),
        APP_NAME_MAX_LENGTH: 50,
        APP_NAME_PATTERN: new RegExp("^[a-zA-Z0-9._-]+(?: [a-zA-Z0-9._-]+)*$")
    };

    public static readonly CONDITIONAL_AUTH_TOUR_STATUS_STORAGE_KEY: string = "isConditionalAuthTourViewed";

    public static readonly CUSTOM_APPLICATION_OIDC: string = "custom-application-oidc";

    public static readonly CUSTOM_APPLICATION_SAML: string = "custom-application-saml";

    public static readonly CUSTOM_APPLICATION_PASSIVE_STS: string = "custom-application-passive-sts";

    public static readonly CUSTOM_APPLICATION: string = "custom-application";

    public static readonly MOBILE: string = "mobile-application";

    public static readonly CUSTOM_APPLICATION_PROTOCOL_ORDER: Map<string, number> =
        new Map<string, number>([
            [ "oidc", 0 ],
            [ "saml", 1 ],
            [ "passive-sts", 2 ]
        ]);

    /**
     * Application create limit reached error.
     */
    public static readonly ERROR_CREATE_LIMIT_REACHED: IdentityAppsError = new IdentityAppsError(
        "APP-60503",
        "console:develop.features.applications.notifications.apiLimitReachedError.error.description",
        "console:develop.features.applications.notifications.apiLimitReachedError.error.message",
        "cdaefcee-ecdb-47af-8538-174ec13292db"
    );

    /**
     * Error code for application already exists.
     */
    public static readonly ERROR_CODE_APPLICATION_ALREADY_EXISTS: string = "OAUTH-60008";
    /**
     * Error code for Issuer already exists.
     */
    public static readonly ERROR_CODE_ISSUER_EXISTS: string = "SAML-60002";
    /**
     * Error code for invalid metadata URL.
     */
    public static readonly ERROR_CODE_INVALID_METADATA_URL: string = "SAML-60003";

    /**
     * Application state param to be sent in the routing.
     */
    public static readonly APPLICATION_STATE: string = "application";
}

export enum ShareWithOrgStatus {
    TRUE,
    FALSE,
    UNDEFINED
}
