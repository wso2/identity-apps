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
 * Class containing Email Templates Add Page constants.
 */
export class EmailTemplatesAddPageConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    // Page Layout.
    public static readonly PAGE_LAYOUT_HEADER_DATA_ATTR: string = "email-template-add-page-layout-page-header";
    public static readonly PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR: string = "email-template-add-page-layout-page-" +
        "header-title";
    
    // URL Matcher
    public static readonly PAGE_URL_MATCHER: string = "/add-template";

    // Form elements.
    public static readonly LOCALE_DROPDOWN_DATA_ATTR: string = "email-template-form-locale-select";
    public static readonly LOCALE_DROPDOWN_OPTIONS_CONTAINER_DATA_ATTR: string = "div[role=\"listbox\"]";
    public static readonly SUBJECT_INPUT_DATA_ATTR: string = "email-template-form-subject-input";
    public static readonly EMAIL_BODY_CODE_EDITOR_DATA_ATTR: string = "email-template-form-email-template-body-editor";
    public static readonly EMAIL_BODY_CODE_EDITOR_HTML_CODE_TAB_PANE_DATA_ATTR: string = "html-code-tab-pane";
    public static readonly EMAIL_BODY_CODE_EDITOR_PREVIEW_TAB_PANE_DATA_ATTR: string = "preview-tab-pane";
    public static readonly EMAIL_BODY_CODE_EDITOR_TABS_DATA_ATTR: string = "email-template-form-email-template-body-" +
        "editor-tabs";
    public static readonly EMAIL_BODY_CODE_EDITOR_TAB_MENU_DATA_ATTR: string = "div[class=\"ui pointing secondary " +
        "menu\"]";
    public static readonly EMAIL_BODY_CODE_EDITOR_TAB_MENU_ITEM_DATA_ATTR: string = ".item";
    public static readonly EMAIL_SIGNATURE_CODE_EDITOR_TABS_DATA_ATTR: string = "email-template-form-email-template-" +
        "footer-editor-tabs";
    public static readonly EMAIL_SIGNATURE_CODE_EDITOR_HTML_CODE_TAB_PANE_DATA_ATTR: string = "html-code-tab-pane";
    public static readonly EMAIL_SIGNATURE_CODE_EDITOR_PREVIEW_TAB_PANE_DATA_ATTR: string = "preview-tab-pane";
    public static readonly EMAIL_SIGNATURE_CODE_EDITOR_TAB_MENU_DATA_ATTR: string = "div[class=\"ui pointing " +
        "secondary menu\"]";
    public static readonly EMAIL_SIGNATURE_CODE_EDITOR_TAB_MENU_ITEM_DATA_ATTR: string = ".item";
    public static readonly EMAIL_SIGNATURE_CODE_EDITOR_DATA_ATTR: string = "email-template-form-email-template-" +
        "footer-editor";
    public static readonly FORM_SUBMIT_BUTTON: string = "email-template-form-submit-button";
    
    // Fixture file paths.
    public static readonly SAMPLE_EMAIL_BODY_FIXTURE_PATH: string = "email-templates/sample-email-body.html";
    public static readonly SAMPLE_EMAIL_SIGNATURE_FIXTURE_PATH: string = "email-templates/sample-email-signature.html";
}
