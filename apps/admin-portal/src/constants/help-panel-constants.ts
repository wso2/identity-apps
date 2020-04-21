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
     * URL to get the document structure for Admin Portal. This URL will be used to fetch the
     * doc structure for the contents used in the help side panel.
     * @constant
     * @type {string}
     */
    public static readonly PORTAL_DOCUMENTATION_STRUCTURE_URL: string = "https://api.github.com/repos/wso2/docs-is/" +
        "contents/en/mkdocs.yml?ref=new_restructure";

    // API errors
    public static readonly PORTAL_DOCUMENTATION_STRUCTURE_FETCH_ERROR: string = "Failed to fetch the content from " +
        "Github API.";
}
