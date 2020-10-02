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
 * Class containing Email Template Types constants.
 */
export class EmailTemplateTypesListPageConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    // Table
    public static readonly TABLE_DATA_ATTR: string = "email-template-types-list";
    public static readonly TABLE_BODY_DATA_ATTR: string = "data-table-body";
    public static readonly TABLE_ROW_DATA_ATTR: string = "data-table-row";
    public static readonly TABLE_ROW_HEADING_DATA_ATTR: string = "email-template-types-list-item-heading";
    public static readonly TABLE_ROW_EDIT_BUTTON_DATA_ATTR: string = "email-template-types-list-item-edit-button";
    public static readonly TABLE_ROW_DELETE_BUTTON_DATA_ATTR: string = "email-template-types-list-item-delete-button";
    public static readonly TABLE_ROW_IMAGE_DATA_ATTR: string = "email-template-types-list-item-image";

    // Page Layout.
    public static readonly PAGE_LAYOUT_HEADER_DATA_ATTR: string = "email-template-types-page-layout-page-header";
    public static readonly PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR: string = "email-template-types-page-layout-page-" +
        "header-title";
    public static readonly PAGE_LAYOUT_HEADER_SUB_TITLE_DATA_ATTR: string = "email-template-types-page-layout-" +
        "page-header-sub-title";
    public static readonly PAGE_LAYOUT_HEADER_ACTION: string = "email-template-types-list-layout-add-button";

    // Wizard.
    public static readonly ADD_WIZARD_DATA_ATTR: string = "email-template-types-add-wizard";
    public static readonly CREATE_TEMPLATE_TYPE_BUTTON_DATA_ATTR: string = "email-template-types-add-wizard-create" +
        "-button";
    public static readonly TEMPLATE_TYPE_NAME_INPUT_DATA_ATTR: string = "email-template-types-add-wizard-form-type" +
        "-input";
}
