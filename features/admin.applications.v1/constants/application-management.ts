/**
 * Copyright (c) 2023-2025, WSO2 LLC. (https://www.wso2.com).
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

import {
    FederatedAuthenticatorConstants
} from "@wso2is/admin.connections.v1/constants/federated-authenticator-constants";
import { LocalAuthenticatorConstants } from "@wso2is/admin.connections.v1/constants/local-authenticator-constants";
import { SupportedAuthenticators } from "@wso2is/admin.identity-providers.v1/models";
import { IdentityAppsError } from "@wso2is/core/errors";
import { ApplicationTemplateCategories, ApplicationTemplateLoadingStrategies } from "../models/application";

/**
 * Class containing application management constants.
 */
export class ApplicationManagementConstants {

    public static readonly EMPTY_STRING: string = "";
    public static readonly LINE_BREAK: string = "\n";
    public static readonly MAXIMUM_NUMBER_OF_LIST_ITEMS_TO_SHOW_INSIDE_POPUP: number = 3;
    public static readonly AUTHENTICATORS_LOCAL_STORAGE_KEY: string = btoa("Authenticators");
    public static readonly EMPTY_JSON_ARRAY: string = "[]";

    public static readonly MY_ACCOUNT_APP_NAME: string = "My Account";
    public static readonly MY_ACCOUNT_CLIENT_ID: string = "MY_ACCOUNT";
    public static readonly CONSOLE_APP_NAME: string = "Console";
    public static readonly SYSTEM_APPS: string[] = [ this.CONSOLE_APP_NAME ];
    public static readonly DEFAULT_APPS: string[] = [ this.MY_ACCOUNT_APP_NAME ];

    /**
     * When a new Application version is released, this variable should to be updated.
     */
    public static readonly APP_VERSION_1: string = "v1.0.0";
    public static readonly APP_VERSION_2: string = "v2.0.0";
    public static readonly LATEST_VERSION: string = ApplicationManagementConstants.APP_VERSION_2;

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
        .set("APPLICATION_SHARED_ACCESS", "applications.edit.sharedAccess")
        .set("APPLICATION_EDIT_INFO", "applications.edit.info")
        .set("FAPI_APP_CREATION", "applications.create.fapi")
        .set("APPLICATION_NATIVE_AUTHENTICATION", "applications.native.authentication")
        .set("APPLICATION_MYACCOUNT_SAAS_SETTINGS", "applications.myaccount.saasMyaccountSettings")
        .set("APPLICATION_ADD_MANAGEMENT_APPLICATIONS", "applications.add.managementApplications")
        .set("APPLICATIONS_SETTINGS", "applications.settings")
        .set("TRUSTED_APPS", "applications.trustedApps")
        .set("APPLICATION_ACCESSTOKEN_ATTRIBUTES", "applications.accessTokenAttributes")
        .set("APPLICATION_OUTDATED_APP_BANNER", "applications.outdatedAppBanner");

    /**
     * Key for the URL search param for application state.
     */
    public static readonly APP_STATE_URL_SEARCH_PARAM_KEY: string = "state";

    /**
     * Value for sign on authentication param for application state.
     */
    public static readonly APP_STATE_STRONG_AUTH_PARAM_KEY: string = "isSignOn";

    /**
     * Value for protocol tab navigation.
     */
    public static readonly IS_PROTOCOL: string = "isProtocol";

    /**
     * Value for protocol tab navigation.
     */
    public static readonly IS_ROLES: string = "isRoles";

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
     * Role callback redirect type
     */
    public static readonly ROLE_CALLBACK_REDIRECT: string = "roles";

    /**
     * Default application template loading strategy.
     */
    public static readonly DEFAULT_APP_TEMPLATE_LOADING_STRATEGY: ApplicationTemplateLoadingStrategies =
        ApplicationTemplateLoadingStrategies.LOCAL;

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
    public static readonly FILTERABLE_TEMPLATE_CATEGORIES: ApplicationTemplateCategories[] = [
        ApplicationTemplateCategories.VENDOR
    ];

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
    public static readonly OAUTH2_TOKEN_EXCHANGE: string = "urn:ietf:params:oauth:grant-type:token-exchange";
    public static readonly TOKEN_TYPE_ACCESS_TOKEN: string = "urn:ietf:params:oauth:token-type:access_token";
    public static readonly TOKEN_TYPE_JWT_TOKEN: string = "urn:ietf:params:oauth:token-type:jwt";
    public static readonly TOKEN_TYPE_ID_TOKEN: string = "urn:ietf:params:oauth:token-type:id_token";
    public static readonly ACCOUNT_SWITCH_GRANT: string = "account_switch";
    public static readonly CODE_TOKEN: string = "code token";
    public static readonly CODE_IDTOKEN: string = "code id_token";
    public static readonly CODE_IDTOKEN_TOKEN: string = "code id_token token";
    public static readonly  HYBRID_FLOW_ENABLE_CONFIG:string = "enable-hybrid-flow";
    public static readonly HYBRID_FLOW_RESPONSE_TYPE: string = "hybridFlowResponseType";

    /**
     * List of available grant types.
     */
    public static readonly AVAILABLE_GRANT_TYPES: string[] = [
        this.AUTHORIZATION_CODE_GRANT,
        this.CLIENT_CREDENTIALS_GRANT,
        this.REFRESH_TOKEN_GRANT,
        this.ORGANIZATION_SWITCH_GRANT,
        this.IMPLICIT_GRANT,
        this.PASSWORD,
        this.SAML2_BEARER,
        this.JWT_BEARER,
        this.IWA_NTLM,
        this.DEVICE_GRANT,
        this.OAUTH2_TOKEN_EXCHANGE,
        this.ACCOUNT_SWITCH_GRANT
    ];

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
     * Holds metadata on how to arrange the values when rendering above
     * Usage: Map the index to key to rearrange the values.
     */
    public static readonly TEMPLATE_WISE_ALLOWED_GRANT_TYPE_ARRANGE_ORDER: { [ key: string ]: Map<string, number>; } = {
        // single page application template
        [ "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7" ]: new Map<string, number>([
            [ ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT, 0 ],
            [ ApplicationManagementConstants.IMPLICIT_GRANT, 1 ],
            [ ApplicationManagementConstants.REFRESH_TOKEN_GRANT, 2 ]
        ]),
        // OIDC web application template
        [ "b9c5e11e-fc78-484b-9bec-015d247561b8" ]: new Map<string, number>([
            [ ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT, 0 ],
            [ ApplicationManagementConstants.IMPLICIT_GRANT, 3 ],
            [ ApplicationManagementConstants.PASSWORD, 4 ],
            [ ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT, 1 ],
            [ ApplicationManagementConstants.REFRESH_TOKEN_GRANT, 2 ],
            [ ApplicationManagementConstants.OAUTH2_TOKEN_EXCHANGE, 5 ]
        ]),
        [ "custom-application" ]: new Map<string, number>([
            [ ApplicationManagementConstants.AUTHORIZATION_CODE_GRANT, 0 ],
            [ ApplicationManagementConstants.IMPLICIT_GRANT, 3 ],
            [ ApplicationManagementConstants.PASSWORD, 4 ],
            [ ApplicationManagementConstants.CLIENT_CREDENTIALS_GRANT, 1 ],
            [ ApplicationManagementConstants.REFRESH_TOKEN_GRANT, 2 ],
            [ ApplicationManagementConstants.OAUTH2_TOKEN_EXCHANGE, 5 ]
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

    public static readonly IDENTIFIER_FIRST_AUTHENTICATOR_ID: string =
        LocalAuthenticatorConstants.LOCAL_IDP_IDENTIFIER + "-" + "SWRlbnRpZmllckV4ZWN1dG9y";

    public static readonly MYACCOUNT_STATUS_UPDATE_ERROR: string = "An error occurred while updating " +
        "status of the My Account Portal.";

    public static readonly MYACCOUNT_STATUS_UPDATE_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while updating status of the My Account Portal.";

    public static readonly APPLICATION_STATUS_UPDATE_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while updating the status of the application. ";

    public static readonly APPLICATION_STATUS_UPDATE_ERROR: string = "Error occurred while updating the " +
        "status of the application. ";

    public static readonly SECOND_FACTOR_AUTHENTICATORS_DROPPABLE_ID: string = "second-factor-authenticators";
    public static readonly EXTERNAL_AUTHENTICATORS_DROPPABLE_ID: string = "external-authenticators";
    public static readonly SOCIAL_LOGIN_HEADER: string = "Social Login";

    // Authenticators that are only handlers.
    public static readonly HANDLER_AUTHENTICATORS: string[] = [
        ApplicationManagementConstants.IDENTIFIER_FIRST_AUTHENTICATOR_ID,
        LocalAuthenticatorConstants.AUTHENTICATOR_IDS.ACTIVE_SESSION_LIMIT_HANDLER_AUTHENTICATOR_ID
    ];

    // First factor authenticators.
    public static readonly FIRST_FACTOR_AUTHENTICATORS: string[] = [
        LocalAuthenticatorConstants.AUTHENTICATOR_NAMES.BASIC_AUTHENTICATOR_NAME,
        LocalAuthenticatorConstants.AUTHENTICATOR_NAMES.FIDO_AUTHENTICATOR_NAME,
        LocalAuthenticatorConstants.AUTHENTICATOR_NAMES.EMAIL_OTP_AUTHENTICATOR_NAME,
        LocalAuthenticatorConstants.AUTHENTICATOR_IDS.EMAIL_OTP_AUTHENTICATOR_ID,
        LocalAuthenticatorConstants.AUTHENTICATOR_NAMES.IDENTIFIER_FIRST_AUTHENTICATOR_NAME,
        LocalAuthenticatorConstants.AUTHENTICATOR_NAMES.SMS_OTP_AUTHENTICATOR_NAME,
        LocalAuthenticatorConstants.AUTHENTICATOR_IDS.SMS_OTP_AUTHENTICATOR_ID
    ];

    // Second factor authenticators.
    public static readonly SECOND_FACTOR_AUTHENTICATORS: string[] = [
        LocalAuthenticatorConstants.AUTHENTICATOR_NAMES.TOTP_AUTHENTICATOR_NAME,
        LocalAuthenticatorConstants.AUTHENTICATOR_IDS.TOTP_AUTHENTICATOR_ID,
        FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.IPROOV_AUTHENTICATOR_NAME,
        FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.IPROOV_AUTHENTICATOR_ID,
        FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.DUO_AUTHENTICATOR_NAME,
        FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.DUO_AUTHENTICATOR_ID,
        FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.PASSWORD_RESET_ENFORCER_AUTHENTICATOR_NAME,
        FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.PASSWORD_RESET_ENFORCER_AUTHENTICATOR_ID
    ];

    // Known social authenticators.
    public static readonly SOCIAL_AUTHENTICATORS: string[] = [
        FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.APPLE_AUTHENTICATOR_ID,
        FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.APPLE_AUTHENTICATOR_NAME,
        FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.GOOGLE_OIDC_AUTHENTICATOR_ID,
        FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.GOOGLE_OIDC_AUTHENTICATOR_NAME,
        FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.FACEBOOK_AUTHENTICATOR_ID,
        FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.FACEBOOK_AUTHENTICATOR_NAME,
        FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.MICROSOFT_AUTHENTICATOR_ID,
        FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.MICROSOFT_AUTHENTICATOR_NAME,
        FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.TWITTER_AUTHENTICATOR_ID,
        FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.TWITTER_AUTHENTICATOR_NAME,
        FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.GITHUB_AUTHENTICATOR_ID,
        FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.GITHUB_AUTHENTICATOR_NAME
    ];

    // Authenticators that can handle TOTP.
    public static readonly TOTP_HANDLERS: string[] = [
        ...ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
        ...ApplicationManagementConstants.SOCIAL_AUTHENTICATORS,
        LocalAuthenticatorConstants.AUTHENTICATOR_NAMES.MAGIC_LINK_AUTHENTICATOR_NAME,
        FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.OIDC_AUTHENTICATOR_ID,
        FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.OIDC_AUTHENTICATOR_NAME,
        FederatedAuthenticatorConstants.AUTHENTICATOR_IDS.SAML_AUTHENTICATOR_ID,
        FederatedAuthenticatorConstants.AUTHENTICATOR_NAMES.SAML_AUTHENTICATOR_NAME
    ];

    // Authenticators that can handle Email OTP.
    public static readonly EMAIL_OTP_HANDLERS: string[] = [
        ...ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS,
        ...ApplicationManagementConstants.SOCIAL_AUTHENTICATORS
    ];

    // Authenticators that can handle SMS OTP.
    public static readonly SMS_OTP_HANDLERS: string[] = [
        ...ApplicationManagementConstants.FIRST_FACTOR_AUTHENTICATORS
    ];

    // Enterprise EIDP Authenticators
    public static readonly EIDP_AUTHENTICATORS: SupportedAuthenticators[] = [
        SupportedAuthenticators.OIDC,
        SupportedAuthenticators.SAML
    ];

    // Authenticators that can handle Active Sessions Limit.
    public static readonly ACTIVE_SESSIONS_LIMIT_HANDLERS: string[] = [
        LocalAuthenticatorConstants.AUTHENTICATOR_NAMES.BASIC_AUTHENTICATOR_NAME,
        LocalAuthenticatorConstants.AUTHENTICATOR_NAMES.FIDO_AUTHENTICATOR_NAME,
        LocalAuthenticatorConstants.AUTHENTICATOR_NAMES.EMAIL_OTP_AUTHENTICATOR_NAME,
        LocalAuthenticatorConstants.AUTHENTICATOR_IDS.EMAIL_OTP_AUTHENTICATOR_ID
    ];

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
        ACCESS_URL_ALLOWED_PLACEHOLDERS: string[],
        ACCESS_URL_MAX_LENGTH: number,
        ACCESS_URL_MIN_LENGTH: number,
        APP_DESCRIPTION_PATTERN: RegExp,
        APP_NAME_MAX_LENGTH: number,
        APP_NAME_PATTERN: RegExp
    } = {
            ACCESS_URL_ALLOWED_PLACEHOLDERS: [
                "\\${UserTenantHint}",
                "\\${organizationIdHint}"
            ],
            ACCESS_URL_MAX_LENGTH: 1024,
            ACCESS_URL_MIN_LENGTH: 3,
            APP_DESCRIPTION_PATTERN: new RegExp("^[a-zA-Z0-9.+=!$#()@&%*~_-]+(?: [a-zA-Z0-9.+=!$#()@&%*~_-]+)*$", "gm"),
            APP_NAME_MAX_LENGTH: 50,
            APP_NAME_PATTERN: new RegExp("^[a-zA-Z0-9._-]+(?: [a-zA-Z0-9._-]+)*$")
        };

    public static readonly CONDITIONAL_AUTH_TOUR_STATUS_STORAGE_KEY: string = "isConditionalAuthTourViewed";

    public static readonly CONDITIONAL_AUTH_EDITOR_THEME_STORAGE_KEY: string = "conditionalAuthEditorTheme";

    public static readonly CUSTOM_APPLICATION_OIDC: string = "custom-application-oidc";

    public static readonly CUSTOM_APPLICATION_SAML: string = "custom-application-saml";

    public static readonly CUSTOM_APPLICATION_PASSIVE_STS: string = "custom-application-passive-sts";

    public static readonly TRADITIONAL_WEB_APPLICATION_OIDC: string = "b9c5e11e-fc78-484b-9bec-015d247561b8";

    public static readonly TRADITIONAL_WEB_APPLICATION_SAML: string = "776a73da-fd8e-490b-84ff-93009f8ede85";

    public static readonly CUSTOM_APPLICATION: string = "custom-application";

    public static readonly MOBILE: string = "mobile-application";

    public static readonly SPA_APP_TEMPLATE_ID: string = "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7";

    public static readonly M2M_APP_TEMPLATE_ID: string = "m2m-application";

    public static readonly CHOREO_APP_TEMPLATE_ID: string = "choreo-apim-application-oidc";

    public static readonly IS_CHOREO_APP_SP_PROPERTY: string = "isChoreoApp";

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
        "applications:notifications.apiLimitReachedError.error.description",
        "applications:notifications.apiLimitReachedError.error.message",
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

    /**
     * Sign in step of the try it application.
     */
    public static readonly TRY_IT_SIGNIN_TAB: number = 2;

    /**
     * Sign in step of other applications.
     */
    public static readonly APPLICATION_SIGNIN_TAB: number = 3;

    /**
     * Login Flow tab index of My Account application in root organization view.
     */
    public static readonly MY_ACCOUNT_LOGIN_FLOW_TAB: number = 2;

    /**
     * Login Flow tab index of My Account application in organization view.
     */
    public static readonly SUB_ORG_MY_ACCOUNT_LOGIN_FLOW_TAB: number = 0;

    /**
     * Default attribute name format for SAML attribute statement.
     */
    public static readonly DEFAULT_NAME_ATTRIBUTE_FORMAT: string = "urn:oasis:names:tc:SAML:2.0:attrname-format:basic";

    /**
     * Supported name formats for SAML attribute statement.
     */
    public static readonly SUPPORT_NAME_FORMATS: string[] = [
        ApplicationManagementConstants.DEFAULT_NAME_ATTRIBUTE_FORMAT,
        "urn:oasis:names:tc:SAML:2.0:attrname-format:uri"
    ];
}

export enum ShareWithOrgStatus {
    TRUE,
    FALSE,
    UNDEFINED
}
