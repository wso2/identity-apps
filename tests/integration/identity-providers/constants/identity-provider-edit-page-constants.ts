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
 * Class containing Identity Provider Edit Page constants.
 */
export class IdentityProviderEditPageConstants {

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
    public static readonly PAGE_LAYOUT_HEADER_DATA_ATTR: string = "idp-edit-page-page-layout-page-header";
    public static readonly PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR: string = "idp-edit-page-page-layout-page-header-title";
    public static readonly PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR: string = "idp-edit-page-page-layout-page-header-" +
        "sub-title";
    public static readonly PAGE_LAYOUT_HEADER_BACK_BUTTON_DATA_ATTR: string = "idp-edit-page-page-back-button";
    public static readonly PAGE_LAYOUT_HEADER_IMAGE_WRAPPER_DATA_ATTR: string = "idp-edit-page-page-layout-page-" +
        "header-image";

    // Tabs
    public static readonly RESOURCE_TABS_DATA_ATTR: string = "idp-edit-page-resource-tabs";
    public static readonly RESOURCE_TABS_MENU_DATA_ATTR: string = "div[class=\"ui pointing secondary menu\"";

    // General Settings Form
    public static readonly IDP_NAME_INPUT_DATA_ATTR: string = "idp-edit-page-general-settings-form-idp-name";
    public static readonly IDP_DESCRIPTION_INPUT_DATA_ATTR: string = "idp-edit-page-general-settings-form-idp-description";
    public static readonly IDP_IMAGE_INPUT_DATA_ATTR: string = "idp-edit-page-general-settings-form-idp-image";
    public static readonly GENERAL_SETTINGS_SUBMIT_BUTTON_DATA_ATTR: string = "idp-edit-page-general-settings-form-" +
        "update-button";
    // Certificates section
    public static readonly IDP_CERT_RADIO_GROUP_DATA_ATTR: string = "idp-edit-advance-settings-certificate-type-" +
        "radio-group";
    public static readonly IDP_CERT_JWKS_URL_INPUT_DATA_ATTR: string = "add-idp-jwks-endpoint-form-certificate-jwks";
    public static readonly IDP_CERT_UPDATE_BUTTON_DATA_ATTR: string = "add-idp-jwks-endpoint-form-save-button";
    // Danger Zone
    public static readonly DANGER_ZONE_DELETE_BUTTON_DATA_ATTR: string = "idp-edit-page-general-settings-" +
        "delete-idp-danger-zone-delete-button";
    public static readonly IDP_DELETE_ASSERTION_DATA_ATTR: string = "idp-name-assertion";
    public static readonly IDP_DELETE_ASSERTION_INPUT_DATA_ATTR: string = "idp-edit-page-general-settings-delete-idp" +
        "-confirmation-assertion-input";
    public static readonly IDP_DELETE_CONFIRM_BUTTON_DATA_ATTR: string = "idp-edit-page-general-settings-delete-" +
        "idp-confirmation-confirm-button";
    public static readonly IDP_DELETE_CONFIRM_MODAL_CLOSE_BUTTON_DATA_ATTR: string = "idp-edit-page-general-settings" +
        "-delete-idp-confirmation-cancel-button";

    //Attribute selection
    public static readonly CLAIM_ATTR_SELECT_WIZARD_DATA_ATTR: string = "idp-edit-page-attribute-settings-" +
        "claim-attribute-selection-wizard-modal-header";
    public static readonly CLAIM_ATTR_SELECT_WIZARD_UNSELECTED_LIST_DATA_ATTR: string = "idp-edit-page-" +
        "attribute-settings-claim-attribute-selection-wizard-modal-content-unselected-groups";
    public static readonly CLAIM_ATTR_SELECT_WIZARD_SELECTED_LIST_DATA_ATTR: string = "idp-edit-page-attribute-" +
        "settings-claim-attribute-selection-wizard-modal-content-selected-groups";
    public static readonly CLAIM_ATTR_SELECT_WIZARD_LIST_ADD_BUTTON_DATA_ATTR: string = "idp-edit-page-" +
        "attribute-settings-claim-attribute-selection-wizard-modal-content-unselected-groups-add-button";
    public static readonly CLAIM_ATTR_SELECT_WIZARD_LIST_REMOVE_BUTTON_DATA_ATTR: string = "idp-edit-page-" +
        "attribute-settings-claim-attribute-selection-wizard-modal-content-unselected-groups-remove-button";
    public static readonly CLAIM_ATTR_SELECT_WIZARD_LIST_SAVE_BUTTON_DATA_ATTR: string = "idp-edit-page-" +
        "attribute-settings-claim-attribute-selection-wizard-modal-save-button";
    public static readonly CLAIM_ATTR_SELECT_WIZARD_LIST_CANCEL_BUTTON_DATA_ATTR: string = "idp-edit-page-" +
        "attribute-settings-claim-attribute-selection-wizard-modal-cancel-button";

    public static readonly CLAIM_ATTR_SELECT_LIST_DATA_ATTR: string = "idp-edit-page-attribute-settings-claim-" +
        "attribute-selection";
    public static readonly CLAIM_ATTR_SELECT_LIST_EMPTY_PLACEHOLDER_DATA_ATTR: string = "idp-edit-page-" +
        "attribute-settings-claim-attribute-selection-empty-placeholder";
    public static readonly CLAIM_ATTR_SELECT_LIST_EMPTY_PLACEHOLDER_ACTION_DATA_ATTR: string = "idp-edit-page-" +
        "attribute-settings-claim-attribute-selection-empty-placeholder-action-container";
    public static readonly CLAIM_ATTR_SELECT_LIST_EDIT_BUTTON_DATA_ATTR: string = "idp-edit-page-" +
        "attribute-settings-claim-attribute-selection-edit-button";
    public static readonly SUBJECT_ATTRIBUTE_DROPDOWN_DATA_ATTR: string = "application-edit-attribute-settings-" +
        "advanced-attribute-settings-form-subject-attribute-dropdown";
}
