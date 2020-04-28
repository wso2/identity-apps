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

    public static readonly APPLICATION_TEMPLATE_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an invalid " +
        "status code while fetching application template.";
    public static readonly APPLICATION_TEMPLATE_FETCH_ERROR: string = "An error occurred while fetching the " +
        "required adaptive application template.";
    public static readonly APPLICATION_TEMPLATES_LIST_FETCH_INVALID_STATUS_CODE_ERROR: string = "Received an " +
        "invalid status code while fetching application templates list.";
    public static readonly APPLICATION_TEMPLATES_LIST_FETCH_ERROR: string = "An error occurred while fetching the " +
        "required adaptive application templates list.";

    /**
     * Splitter token to split the description to extract the template.
     * @constant
     * @type {string}
     * @default
     */
    public static readonly APPLICATION_DESCRIPTION_SPLITTER: string = ":::";
}
