/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { DocumentationConstants } from "./documentation-constants";
import { ApplicationTemplateCategories, ApplicationTemplateLoadingStrategies } from "../models";

/**
 * Class containing application management constants.
 */
export class ApplicationManagementConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    public static readonly DEFAULT_ADAPTIVE_AUTH_SCRIPT: string[] = [
        "var onLoginRequest = function(context) {",
        "};",
        ""
    ];

    /**
     * Set of keys used to enable/disable features.
     * @constant
     * @type {Map<string, string>}
     * @default
     */
    public static readonly FEATURE_DICTIONARY: Map<string, string> = new Map<string, string>()
        .set("APPLICATION_ADD", "application.add")
        .set("APPLICATION_EDIT", "application.edit")
        .set("APPLICATION_EDIT_GENERAL_SETTINGS", "application.edit.generalSettings")
        .set("APPLICATION_EDIT_ACCESS_CONFIG", "applications.edit.accessConfiguration")
        .set("APPLICATION_EDIT_ATTRIBUTE_MAPPING", "applications.edit.attributeMapping")
        .set("APPLICATION_EDIT_SIGN_ON_METHOD_CONFIG", "applications.edit.signOnMethodConfiguration")
        .set("APPLICATION_EDIT_PROVISIONING_SETTINGS", "applications.edit.provisioningSettings")
        .set("APPLICATION_EDIT_ADVANCED_SETTINGS", "applications.edit.advancedSettings");

    /**
     * Key for the `Edit Application` tag in the docs structure object.
     * @constant
     * @type {string}
     */
    public static readonly EDIT_APPLICATIONS_DOCS_KEY = `${
        DocumentationConstants.PORTAL_DOCS_KEY }.Applications["Edit Application"]`;

    /**
     * Key for the application samples tag in the docs structure object.
     * @constant
     * @type {string}
     */
    public static readonly APPLICATION_SAMPLES_DOCS_KEY = "Quick Starts[\"Choose a Sample Type\"]";

    /**
     * Key for the application docs tag in the docs structure object.
     * @constant
     * @type {string}
     */
    public static readonly APPLICATION_DOCS_KEY = "[\"Developer Portal\"].Applications[\"Edit Application\"]";

    /**
     * Key for the overview tag in the docs structure object.
     * @constant
     * @type {string}
     */
    public static readonly APPLICATION_DOCS_OVERVIEW = "Overview";

    /**
     * Key for the URL search param for application state.
     * @constant
     * @type {string}
     */
    public static readonly APP_STATE_URL_SEARCH_PARAM_KEY = "state";

    /**
     * Key for the URL search param for application readonly state.
     * @constant
     * @type {string}
     */
    public static readonly APP_READ_ONLY_STATE_URL_SEARCH_PARAM_KEY = "readOnly";

    /**
     * Key for the URL search param for client secret hashing enabled flag.
     * @constant
     * @type {string}
     */
    public static readonly CLIENT_SECRET_HASH_ENABLED_URL_SEARCH_PARAM_KEY = "isClientSecretHashEnabled";

    /**
     * Value for the URL search param for application state.
     * @constant
     * @type {string}
     */
    public static readonly APP_STATE_URL_SEARCH_PARAM_VALUE = "new";

    /**
     * Default application template loading strategy.
     * @constant
     * @type {ApplicationTemplateLoadingStrategies}
     */
    public static readonly DEFAULT_APP_TEMPLATE_LOADING_STRATEGY: ApplicationTemplateLoadingStrategies =
        ApplicationTemplateLoadingStrategies.LOCAL;

    /**
     * Map to access the template ids.
     * @type {Map<string, any>}
     */
    public static readonly TEMPLATE_IDS: Map<string, any> = new Map<string, any>()
        .set("box", "h9c5e23e-fc78-484b-9bec-015d242361b8")
        .set("oidcMobile", "44a2d9d9-bc0c-4b54-85df-1cf08f4002ec")
        .set("oidcWeb", "b9c5e11e-fc78-484b-9bec-015d247561b8")
        .set("samlWeb", "776a73da-fd8e-490b-84ff-93009f8ede85")
        .set("spa", "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7")
        .set("slack", "z345e11e-fc78-484b-9bec-015d2475u341r")
        .set("windowsDesktop", "df929521-6768-44f5-8586-624126ec3f8b")
        .set("workday", "r565e11e-fc78-484b-9bec-015d24753456")
        .set("zoom", "t565e11e-fc78-484b-9bec-015d2472008");

    /**
     * Mapping for template and template DOC in the doc structure. i.e `<"TEMPLATE_NAME", "TAG_NAME_IN_DOC_STRUCTURE">`
     * @constant
     * @type {Map<string, string>}
     */
    public static readonly APPLICATION_TEMPLATE_DOC_MAPPING: Map<string, string> = new Map<string, string>()
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("box"), "OIDC Web Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("oidcMobile"), "OIDC Mobile Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("oidcWeb"), "OIDC Web Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("spa"), "Single Page Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("slack"), "OIDC Web Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("windowsDesktop"), "Windows Desktop Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("workday"), "OIDC Web Application")
        .set(ApplicationManagementConstants.TEMPLATE_IDS.get("zoom"), "OIDC Web Application");

    /**
     * Template categories to be used to extract the filter types.
     * @type {ApplicationTemplateCategories[]}
     */
    public static readonly FILTERABLE_TEMPLATE_CATEGORIES: ApplicationTemplateCategories[] = [
        ApplicationTemplateCategories.VENDOR
    ];

    /**
     * Set of grant types to hide from the UI.
     * @constant
     * @type {string[]}
     */
    public static readonly HIDDEN_GRANT_TYPES: string[] = [ "account_switch" ];

    /**
     * Key for the SPA template.
     * @constant
     * @type {string}
     */
    public static readonly SPA = "Single Page Application";

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
}
