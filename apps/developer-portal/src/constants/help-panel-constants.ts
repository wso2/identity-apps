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
 * Class containing constants related to help panel.
 */
export class HelpPanelConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Base URL of the Github API.
     * @constant
     * @type {string}
     */
    public static readonly GITHUB_API_BASE_URL: string = "https://api.github.com";

    /**
     * Fetches the documentation from the specified branch
     * @constant
     * @type {string}
     */
    public static readonly PORTAL_DOCUMENTATION_BRANCH: string = "new_restructure";

    /**
     * Base path used by `markdown_include`plugin.
     * @constant
     * @type {string}
     */
    public static readonly PORTAL_DOCUMENTATION_CONTENT_BASE_PATH: string = "docs";

    /**
     * Documentation default locale.
     * @constant
     * @type {string}
     */
    public static readonly PORTAL_DOCUMENTATION_DEFAULT_LOCALE: string = "en";

    /**
     * Key for the `Edit Application` tag in the docs structure object.
     * @constant
     * @type {string}
     */
    public static readonly EDIT_APPLICATIONS_DOCS_KEY = "[\"Developer Portal\"].Applications[\"Edit Application\"]";

    /**
     * Key for the application samples tag in the docs structure object.
     * @constant
     * @type {string}
     */
    public static readonly APPLICATION_SAMPLES_DOCS_KEY = "Samples.Authentication";

    /**
     * Mapping for template and template DOC in the doc structure. i.e `<"TEMPLATE_NAME", "TAG_NAME_IN_DOC_STRUCTURE">`
     * @remarks
     * If the template name is changed, this map has to be changed.
     * @constant
     * @type {Map<string, string>}
     */
    public static readonly APPLICATION_TEMPLATE_DOC_MAPPING: Map<string, string> = new Map<string, string>()
            .set("SAML web application", "SAML Web Application")
            .set("OIDC web application", "OIDC Web Application")
            .set("Single page application", "Single Page Aplication")
            .set("Mobile application", "OIDC Mobile Application");

    /**
     * Github contents API endpoint.
     * @constant
     * @type {string}
     */
    public static readonly GITHUB_CONTENTS_API_ENDPOINT: string = `${
        HelpPanelConstants.GITHUB_API_BASE_URL }/repos/wso2/docs-is/contents/${
        HelpPanelConstants.PORTAL_DOCUMENTATION_DEFAULT_LOCALE }`;

    // API errors
    public static readonly PORTAL_DOCUMENTATION_STRUCTURE_FETCH_ERROR: string = "Failed to fetch the documentation " +
        "structure from Github API.";
    public static readonly PORTAL_DOCUMENTATION_RAW_CONTENT_FETCH_ERROR: string = "Failed to fetch the " +
        "documentation raw content from Github API.";
}
