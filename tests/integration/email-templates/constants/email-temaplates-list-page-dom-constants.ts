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
 * Class containing Email Templates Listing Page DOM constants.
 */
export class EmailTemplatesListPageDomConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    public static readonly SIDE_PANEL_ITEM_DATA_ATTR: string = "side-panel-items-email-templates";
    public static readonly TABLE_DATA_ATTR: string = "email-template-types-list";
    public static readonly TABLE_ROW_DATA_ATTR: string = "data-table-row";
    public static readonly PAGE_LAYOUT_HEADER: string = "email-template-types-page-layout-page-header";
    public static readonly PAGE_LAYOUT_HEADER_TITLE: string = "email-template-types-page-layout-page-header-header";
    public static readonly PAGE_LAYOUT_HEADER_SUB_TITLE: string = "email-template-types-page-layout-page-header-" +
        "sub-header";
    public static readonly PAGE_LAYOUT_HEADER_ACTION: string = "email-template-types-list-layout-add-button";
}
