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
 * Class containing ui constants.
 */
export class UIConstants {

    /**
     * Private constructor to avoid object instantiation from outside the class.
     *
     * @hideconstructor
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Default header height to be used in state initializations.
     * @constant
     * @type {number}
     */
    public static readonly DEFAULT_HEADER_HEIGHT = 59;

    /**
     * Default footer height to be used in state initializations.
     * @constant
     * @type {number}
     */
    public static readonly DEFAULT_FOOTER_HEIGHT = 60;

    /**
     * Constant to handle dashboard layout's desktop content top spacing.
     * @constant
     * @type {number}
     */
    public static readonly DASHBOARD_LAYOUT_DESKTOP_CONTENT_TOP_SPACING: number = 0;

    /**
     * Interval to dismiss the alerts.
     * @constant
     * @type {number}
     */
    public static readonly ALERT_DISMISS_INTERVAL: number = 5;

    /**
     * AJAX top loading bar height.
     * @constant
     * @type {number}
     */
    public static readonly AJAX_TOP_LOADING_BAR_HEIGHT: number = 3;

    /**
     * Default list item size for resources such as applications, IdPs etc.
     * @type {number}
     */
    public static readonly DEFAULT_RESOURCE_LIST_ITEM_LIMIT: number = 10;

    /**
     * Default overview statistics insights list item limit.
     * @type {number}
     */
    public static readonly DEFAULT_STATS_LIST_ITEM_LIMIT: number = 5;

    /**
     * Default theme of the portal.
     * @type {string}
     */
    public static readonly DEFAULT_THEME: string = "default";

    /**
     * Product Documentation URLs.
     * @type {Map<string, string>}
     */
    public static readonly IS_DOC_URLS: Map<string, string> = new Map<string, string>()
        .set("5.11.0", "https://is.docs.wso2.com/en/5.11.0/");

    /**
     * Additional top offset padding for page scrolling placement.
     * This will use along with the header height (appHeaderHeight + thisValues).
     * @constant
     * @type {number}
     */
    public static readonly PAGE_SCROLL_TOP_PADDING = 20;
}
