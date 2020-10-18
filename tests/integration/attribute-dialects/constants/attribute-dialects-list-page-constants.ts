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
 * Class containing Attribute Dialects List Page constants.
 */
export class AttributeDialectsListPageConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    // URL Matcher
    public static readonly PAGE_URL_MATCHER: string = "/claim-dialects";

    public static readonly CLAIMS_PARENT_ITEM_DATA_ATTR: string = "side-panel-items-attribute-dialects";

    // Table
    public static readonly TABLE_DATA_ATTR: string = "attribute-dialects-list";
    public static readonly TABLE_BODY_DATA_ATTR: string = "data-table-body";
    public static readonly TABLE_ROW_DATA_ATTR: string = "data-table-row";
    public static readonly TABLE_ROW_SUB_HEADING_DATA_ATTR: string = "attribute-dialects-list-item-sub-heading";
    public static readonly TABLE_ROW_EDIT_BUTTON_DATA_ATTR: string = "attribute-dialects-list-item-edit-button";
    public static readonly TABLE_ROW_DELETE_BUTTON_DATA_ATTR: string = "attribute-dialects-list-item-delete-button";
    public static readonly TABLE_ROW_IMAGE_DATA_ATTR: string = "attribute-dialects-list-item-image";
    public static readonly NEW_LIST_PLACEHOLDER: string = "attribute-dialects-list-empty-placeholder";
    public static readonly NEW_LIST_PLACEHOLDER_ACTION_CONTAINER: string = "attribute-dialects-list-empty-placeholder-" +
        "action-container";

    // Page Layout.
    public static readonly PAGE_LAYOUT_HEADER_DATA_ATTR: string = "attribute-dialects-page-layout-page-header";
    public static readonly PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR: string = "attribute-dialects-page-layout-page-header-title";
    public static readonly PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR: string = "attribute-dialects-page-layout-page-header-" +
        "sub-title";
    public static readonly PAGE_LAYOUT_HEADER_ACTION: string = "attribute-dialects-list-layout-add-button";

    public static readonly LOCAL_DIALECT_CONTAINER_DATA_ATTR: string = "attribute-dialects-local-dialect-container";
    
    // Add dialect wizard
    public static readonly ADD_DIALECT_WIZARD_DATA_ATTR: string = "attribute-dialects-add-wizard";
    public static readonly ADD_DIALECT_WIZARD_CANCEL_BUTTON_DATA_ATTR: string = "attribute-dialects-add-wizard-" +
        "cancel-button";
    public static readonly ADD_DIALECT_WIZARD_NEXT_BUTTON_DATA_ATTR: string = "attribute-dialects-add-wizard-" +
        "next-button";
    public static readonly ADD_DIALECT_WIZARD_PREVIOUS_BUTTON_DATA_ATTR: string = "attribute-dialects-add-wizard-" +
        "previous-button";
    public static readonly ADD_DIALECT_WIZARD_FINISH_BUTTON_DATA_ATTR: string = "attribute-dialects-add-wizard-" +
        "finish-button";
}
