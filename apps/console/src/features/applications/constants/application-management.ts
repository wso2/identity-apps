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
import { ApplicationTemplateCategories } from "../models";

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
     * Value for the URL search param for application state.
     * @constant
     * @type {string}
     */
    public static readonly APP_STATE_URL_SEARCH_PARAM_VALUE = "new";

    /**
     * Mapping for template and template DOC in the doc structure. i.e `<"TEMPLATE_NAME", "TAG_NAME_IN_DOC_STRUCTURE">`
     * @remarks
     * If the template name is changed, this map has to be changed.
     * @constant
     * @type {Map<string, string>}
     */
    public static readonly APPLICATION_TEMPLATE_DOC_MAPPING: Map<string, string> = new Map<string, string>()
        .set("Web Application", "Single Page Application")
        .set("Single Page Application", "Single Page Application")
        .set("Mobile Application", "OIDC Mobile Application")
        .set("Desktop Application", "Windows Desktop Application")
        .set("Slack", "OIDC Web Application")
        .set("Zoom", "OIDC Web Application")
        .set("Workday", "OIDC Web Application")
        .set("Box", "OIDC Web Application");

    /**
     * Set of internal application which are forbidden from deleting.
     * // TODO: Remove this once validating is available from the backend level.
     * @type {string[]}
     */
    public static readonly DELETING_FORBIDDEN_APPLICATIONS: string[] = [ "Console", "User Portal" ];

    /**
     * Template categories to be used to extract the filter types.
     * @type {ApplicationTemplateCategories[]}
     */
    public static readonly FILTERABLE_TEMPLATE_CATEGORIES: ApplicationTemplateCategories[] = [
        ApplicationTemplateCategories.VENDOR
    ];

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
