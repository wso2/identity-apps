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
 *
 */

/**
 * Class containing Applications Edit Page constants.
 */
export class ApplicationEditPageConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    // URL Matcher
    public static readonly PAGE_URL_MATCHER: string = "?state=new";

    // Page Layout.
    public static readonly PAGE_LAYOUT_HEADER_DATA_ATTR: string = "application-edit-page-layout-page-header";
    public static readonly PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR: string = "application-edit-page-layout-page-header-" +
        "title";
    public static readonly PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR: string = "application-edit-page-layout-page-" +
        "header-sub-title";
    public static readonly PAGE_LAYOUT_HEADER_BACK_BUTTON_DATA_ATTR: string = "application-edit-page-back-button";

    // General Settings Form
    public static readonly APP_NAME_INPUT_DATA_ATTR: string = "application-edit-general-settings-" +
        "form-application-name-input";
    public static readonly APP_DESCRIPTION_INPUT_DATA_ATTR: string = "application-edit-general-settings-form-" +
        "application-description-textarea";
    public static readonly APP_IMAGE_INPUT_DATA_ATTR: string = "application-edit-general-settings-form-" +
        "application-image-url-input";
    public static readonly APP_DISCOVERABLE_CHECKBOX_DATA_ATTR: string = "application-edit-general-settings-form-" +
        "application-discoverable-checkbox";
    public static readonly APP_ACCESS_URL_INPUT_DATA_ATTR: string = "application-edit-general-settings-form-" +
        "application-access-url-input";
    public static readonly GENERAL_SETTINGS_SUBMIT_BUTTON_DATA_ATTR: string = "application-edit-general-settings-" +
        "form-submit-button";
}
