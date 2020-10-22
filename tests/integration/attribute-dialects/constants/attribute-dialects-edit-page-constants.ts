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
 * Class containing Attribute Dialects Edit Page constants.
 */
export class AttributeDialectsEditPageConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    // URL Matcher
    public static readonly PAGE_URL_MATCHER: string = "/edit-external-dialect";

    // Page Layout.
    public static readonly PAGE_LAYOUT_HEADER_DATA_ATTR: string = "external-dialect-edit-page-layout-page-header";
    public static readonly PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR: string = "external-dialect-edit-page-layout-page-" +
        "header-title";
    public static readonly PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR: string = "external-dialect-edit-page-layout-" +
        "page-header-sub-title";
    public static readonly PAGE_LAYOUT_HEADER_BACK_BUTTON_DATA_ATTR: string = "external-dialect-edit-page-back-button";
    public static readonly PAGE_LAYOUT_HEADER_IMAGE_WRAPPER_DATA_ATTR: string = "external-dialect-edit-page-layout-" +
        "page-header-image";

    // Danger Zone
    public static readonly DANGER_ZONE_DELETE_BUTTON_DATA_ATTR: string = "external-dialect-edit-dialect-delete-" +
        "danger-zone-delete-button";
    public static readonly ATTRIBUTE_DIALECT_DELETE_ASSERTION_DATA_ATTR: string = "external-dialect-uri-assertion";
    public static readonly ATTRIBUTE_DIALECT_DELETE_ASSERTION_INPUT_DATA_ATTR: string = "external-dialect-edit-" +
        "delete-confirmation-modal-assertion-input";
    public static readonly ATTRIBUTE_DIALECT_DELETE_CONFIRM_BUTTON_DATA_ATTR: string = "external-dialect-edit-" +
        "delete-confirmation-modal-confirm-button";
    public static readonly ATTRIBUTE_DIALECT_DELETE_MODAL_CLOSE_BUTTON_DATA_ATTR: string = "external-" +
        "dialect-edit-delete-confirmation-modal-cancel-button";
}
