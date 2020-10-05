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
 * Class containing Applications Templates Page constants.
 */
export class ApplicationTemplatesPageConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    // URL Matcher
    public static readonly PAGE_URL_MATCHER: string = "/applications/templates";

    // Page Layout.
    public static readonly PAGE_LAYOUT_HEADER_DATA_ATTR: string = "application-templates-page-layout-page-header";
    public static readonly PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR: string = "application-templates-page-layout-page-" +
        "header-title";
    public static readonly PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR: string = "application-templates-page-layout-page-" +
        "header-sub-title";
    public static readonly PAGE_LAYOUT_HEADER_BACK_BUTTON_DATA_ATTR: string = "application-templates-page-back-button";

    public static readonly SEARCH_INPUT_DATA_ATTR: string = "application-templates-search";
    public static readonly SORT_DROPDOWN_DATA_ATTR: string = "application-templates-sort";

    // Application template types.
    public static readonly QUICK_START_TEMPLATE_GRID: string = "application-templates-quick-start-template-grid";
    public static readonly VENDOR_TEMPLATE_GRID: string = "application-templates-custom-template-grid";

    public static readonly WEB_APP_TEMPLATE_CARD_DATA_ATTR: string = "web-application";
    public static readonly SPA_TEMPLATE_CARD_DATA_ATTR: string = "6a90e4b0-fbff-42d7-bfde-1efd98f07cd7";
    public static readonly DESKTOP_APP_TEMPLATE_CARD_DATA_ATTR: string = "desktop";
    public static readonly MOBILE_APP_TEMPLATE_CARD_DATA_ATTR: string = "mobile";

    public static readonly BOX_APP_TEMPLATE_CARD_DATA_ATTR: string = "h9c5e23e-fc78-484b-9bec-015d242361b8";
    public static readonly SLACK_APP_TEMPLATE_CARD_DATA_ATTR: string = "z345e11e-fc78-484b-9bec-015d2475u341r";
    public static readonly WORKDAY_APP_TEMPLATE_CARD_DATA_ATTR: string = "r565e11e-fc78-484b-9bec-015d24753456";
    public static readonly ZOOM_APP_TEMPLATE_CARD_DATA_ATTR: string = "t565e11e-fc78-484b-9bec-015d2472008";
    
    // Minimal Wizard
    public static readonly MINIMAL_CREATION_WIZARD_DATA_ATTR: string = "minimal-application-create-wizard-modal";
    public static readonly MINIMAL_CREATION_WIZARD_APP_NAME_INPUT_DATA_ATTR: string = "minimal-application-create-" +
        "wizard-application-name-input";
    public static readonly MINIMAL_CREATION_WIZARD_OIDC_CARD_DATA_ATTR: string = "minimal-application-create-wizard-" +
        "b9c5e11e-fc78-484b-9bec-015d247561b8-card";
    public static readonly MINIMAL_CREATION_WIZARD_SAML_CARD_DATA_ATTR: string = "minimal-application-create-wizard-" +
        "776a73da-fd8e-490b-84ff-93009f8ede85-card";
    public static readonly MINIMAL_CREATION_WIZARD_REDIRECT_URL_INPUT_DATA_ATTR: string = "minimal-application-" +
        "create-wizard-oauth-protocol-settings-form-callback-url-input";
    public static readonly MINIMAL_CREATION_WIZARD_REDIRECT_URL_ADD_BUTTON_DATA_ATTR: string = "minimal-application-" +
        "create-wizard-oauth-protocol-settings-form-callback-url-input-add-button";
    public static readonly MINIMAL_CREATION_WIZARD_SUBMIT_BUTTON_DATA_ATTR: string = "minimal-application-" +
        "create-wizard-next-button";
}
