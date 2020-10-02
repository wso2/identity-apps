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
 * Class containing Email Templates List Page constants.
 */
export class EmailTemplatesListPageConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    // Table
    public static readonly TABLE_DATA_ATTR: string = "email-templates-list";
    public static readonly TABLE_BODY_DATA_ATTR: string = "data-table-body";
    public static readonly TABLE_ROW_DATA_ATTR: string = "data-table-row";
    public static readonly TABLE_ROW_HEADING_DATA_ATTR: string = "email-templates-list-item-heading";
    public static readonly TABLE_ROW_VIEW_BUTTON_DATA_ATTR: string = "email-templates-list-item-view-button";
    public static readonly TABLE_ROW_EDIT_BUTTON_DATA_ATTR: string = "email-templates-list-item-edit-button";
    public static readonly TABLE_ROW_DELETE_BUTTON_DATA_ATTR: string = "email-templates-list-item-delete-button";
    public static readonly TABLE_ROW_IMAGE_DATA_ATTR: string = "email-templates-list-flag-image";
    public static readonly NEW_LIST_PLACEHOLDER: string = "email-templates-list-empty-placeholder";
    public static readonly NEW_LIST_PLACEHOLDER_ACTION_CONTAINER: string = "email-templates-list-empty-placeholder-" +
        "action-container";

    // Page Layout.
    public static readonly PAGE_LAYOUT_HEADER_DATA_ATTR: string = "email-templates-page-layout-page-header";
    public static readonly PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR: string = "email-templates-page-layout-page-header-" +
        "title";
    public static readonly PAGE_LAYOUT_HEADER_ACTION: string = "email-templates-list-layout-add-button";

    public static readonly TEMPLATE_VIEW_MODAL_DATA_ATTR: string = "email-templates-list-view-locale-template-modal";
    public static readonly TEMPLATE_VIEW_MODAL_CANCEL_BUTTON_DATA_ATTR: string = "email-templates-list-view-locale-" +
        "template-modal-cancel-button";
}
