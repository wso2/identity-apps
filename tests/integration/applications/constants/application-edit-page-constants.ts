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

    // Sample PEM file path.
    public static readonly SAMPLE_VALID_PEM_FILE_PATH: string = "applications/sample-valid-cert.txt";
    public static readonly SAMPLE_INVALID_PEM_FILE_PATH: string = "applications/sample-invalid-cert.txt";

    // Page Layout.
    public static readonly PAGE_LAYOUT_HEADER_DATA_ATTR: string = "application-edit-page-layout-page-header";
    public static readonly PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR: string = "application-edit-page-layout-page-header-" +
        "title";
    public static readonly PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR: string = "application-edit-page-layout-page-" +
        "header-sub-title";
    public static readonly PAGE_LAYOUT_HEADER_BACK_BUTTON_DATA_ATTR: string = "application-edit-page-back-button";

    // Tabs
    public static readonly RESOURCE_TABS_DATA_ATTR: string = "application-edit-resource-tabs";
    public static readonly RESOURCE_TABS_MENU_DATA_ATTR: string = "div[class=\"ui pointing secondary menu\"";
    
    // Access Configuration
    public static readonly PROTOCOL_ACCORDION_DATA_ATTR: string = "application-edit-access-settings-protocol-accordion";
    public static readonly ADD_PROTOCOL_BUTTON_DATA_ATTR: string = "application-edit-access-settings-new-protocol-" +
        "button";
    public static readonly ADD_PROTOCOL_WIZARD_DATA_ATTR: string = "application-edit-access-settings-protocol-add-" +
        "wizard-modal";
    public static readonly ADD_PROTOCOL_WIZARD_CANCEL_BUTTON_DATA_ATTR: string = "application-edit-access-settings-" +
        "protocol-add-wizard-cancel-button";
    public static readonly OIDC_PROTOCOL_ACCORDION_ITEM_DATA_ATTR: string = "application-edit-access-settings-" +
        "protocol-accordion-oidc-title";
    public static readonly OIDC_PROTOCOL_ACCORDION_ITEM_CHEVRON_DATA_ATTR: string = "application-edit-access-" +
        "settings-protocol-accordion-oidc-title-chevron";
    
    //Attribute selection
    public static readonly ATTRIBUTE_SELECTION_LIST_DATA_ATTR: string = "application-edit-attribute-settings-" +
        "attribute-selection";
    public static readonly SUBJECT_ATTRIBUTE_DROPDOWN_DATA_ATTR: string = "application-edit-attribute-settings-" +
        "advanced-attribute-settings-form-subject-attribute-dropdown";
    public static readonly INCLUDE_USERSTORE_CHECKBOX_DATA_ATTR: string = "application-edit-attribute-settings-" +
        "advanced-attribute-settings-form-subject-iInclude-user-domain-checkbox";
    public static readonly INCLUDE_TENANT_DOMAIN_CHECKBOX_DATA_ATTR: string = "application-edit-attribute-settings-" +
        "advanced-attribute-settings-form-subject-include-tenant-domain-checkbox";
    public static readonly USED_MAPPED_LOCAL_SUBJECT_CHECKBOX_DATA_ATTR: string = "application-edit-attribute-" +
        "settings-advanced-attribute-settings-form-subject-use-mapped-local-subject-checkbox";
    public static readonly ROLE_ATTRIBUTE_DROPDOWN_DATA_ATTR: string = "application-edit-attribute-settings-" +
        "advanced-attribute-settings-form-role-attribute-dropdown";

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
    public static readonly APP_CERT_JWKS_URL_INPUT_DATA_ATTR: string = "application-edit-general-settings-form-jwks-" +
        "input";
    public static readonly APP_CERT_RADIO_GROUP_DATA_ATTR: string = "application-edit-general-settings-form-" +
        "certificate-type-radio-group";
    public static readonly GENERAL_SETTINGS_SUBMIT_BUTTON_DATA_ATTR: string = "application-edit-general-settings-" +
        "form-submit-button";
    public static readonly APP_PEM_CERT_INPUT_DATA_ATTR: string = "application-edit-general-settings-form-" +
        "certificate-textarea";
    public static readonly APP_PEM_CERT_PREVIEW_BUTTON_DATA_ATTR: string = "application-edit-general-settings-form-" +
        "certificate-info-button";
    public static readonly APP_PEM_CERT_PREVIEW_MODAL_DATA_ATTR: string = "application-edit-general-settings-form-" +
        "view-certificate-modal";
    public static readonly APP_PEM_CERT_PREVIEW_MODAL_DIMMER_DATA_ATTR: string = "div[class=\"ui page modals dimmer " +
    "transition visible active\"]";
    public static readonly DANGER_ZONE_DELETE_BUTTON_DATA_ATTR: string = "application-edit-general-settings-danger-" +
        "zone-delete-button";
    public static readonly APP_DELETE_ASSERTION_DATA_ATTR: string = "application-name-assertion";
    public static readonly APP_DELETE_ASSERTION_INPUT_DATA_ATTR: string = "application-edit-general-settings-" +
        "application-delete-confirmation-modal-assertion-input";
    public static readonly APP_DELETE_CONFIRM_BUTTON_DATA_ATTR: string = "application-edit-general-settings-" +
        "application-delete-confirmation-modal-confirm-button";
    public static readonly APP_DELETE_CONFIRM_MODAL_CLOSE_BUTTON_DATA_ATTR: string = "application-edit-general-" +
        "settings-application-delete-confirmation-modal-cancel-button";
}
