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
 * Class containing documentation constants which can be used across several applications.
 */
export class DocumentationConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Documentation structure file name.
     * @constant
     * @type {string}
     */
    public static readonly STRUCTURE_FILE_NAME: string = "mkdocs.yml";

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
    public static readonly DEFAULT_BRANCH: string = "master";

    /**
     * Documentation repo owner.
     * @constant
     * @type {string}
     */
    public static readonly DEFAULT_REPO_OWNER: string = "wso2";

    /**
     * Documentation repo.
     * @constant
     * @type {string}
     */
    public static readonly DEFAULT_REPO: string = "docs-is";

    /**
     * Base path used by `markdown_include`plugin.
     * @constant
     * @type {string}
     */
    public static readonly DEFAULT_CONTENT_BASE_PATH: string = "docs";

    /**
     * Documentation default locale.
     * @constant
     * @type {string}
     */
    public static readonly DEFAULT_LOCALE: string = "en";

    /**
     * Github contents API endpoint.
     * @constant
     * @type {string}
     */
    public static readonly GITHUB_CONTENTS_API_ENDPOINT: string = `${
        DocumentationConstants.GITHUB_API_BASE_URL }/repos/${ DocumentationConstants.DEFAULT_REPO_OWNER }/${
        DocumentationConstants.DEFAULT_REPO }/contents`;

    /**
     * Default content base URL.
     * @constant
     * @type {string}
     */
    public static readonly DEFAULT_CONTENT_BASE_URL: string = `${
        DocumentationConstants.GITHUB_CONTENTS_API_ENDPOINT }/${ DocumentationConstants.DEFAULT_LOCALE }/${
        DocumentationConstants.DEFAULT_CONTENT_BASE_PATH }`;

    /**
     * Default structure file URL.
     * @constant
     * @type {string}
     */
    public static readonly DEFAULT_STRUCTURE_FILE_URL: string = `${
        DocumentationConstants.GITHUB_CONTENTS_API_ENDPOINT }/${ DocumentationConstants.DEFAULT_LOCALE }/${
        DocumentationConstants.STRUCTURE_FILE_NAME }`;

    /**
     * Default image prefix URL.
     * @constant
     * @type {string}
     */
    public static readonly DEFAULT_IMAGE_PREFIX_URL: string = `${
        DocumentationConstants.GITHUB_CONTENTS_API_ENDPOINT }/${ DocumentationConstants.DEFAULT_REPO_OWNER }/${
        DocumentationConstants.DEFAULT_REPO }/tree/${ DocumentationConstants.DEFAULT_BRANCH }/${
        DocumentationConstants.DEFAULT_LOCALE }/${ DocumentationConstants.DEFAULT_CONTENT_BASE_PATH }`;

    // API errors
    public static readonly STRUCTURE_FETCH_ERROR: string = "Failed to fetch the documentation " +
        "structure.";
    public static readonly RAW_CONTENT_FETCH_ERROR: string = "Failed to fetch the " +
        "documentation raw content.";
}
