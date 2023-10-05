/**  
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

/**
 * Class containing ui constants.
 */
export class UIConstants {

    /**
     * Private constructor to avoid object instantiation from outside the class.
     */
    /* eslint-disable @typescript-eslint/no-empty-function */
    private constructor() { }

    /**
     * Default header height to be used in state initializations.
     */
    public static readonly DEFAULT_HEADER_HEIGHT = 121;

    /**
     * Default footer height to be used in state initializations.
     */
    public static readonly DEFAULT_FOOTER_HEIGHT = 50;

    /**
     * Constant to handle dashboard layout's desktop content top spacing.
     */
    public static readonly DASHBOARD_LAYOUT_DESKTOP_CONTENT_TOP_SPACING: number = 0;

    /**
     * Interval to dismiss the alerts.
     */
    public static readonly ALERT_DISMISS_INTERVAL: number = 15;

    /**
     * AJAX top loading bar height.
     */
    public static readonly AJAX_TOP_LOADING_BAR_HEIGHT: number = 3;

    /**
     * Default list item size for resources such as applications, IdPs etc.
     */
    public static readonly DEFAULT_RESOURCE_LIST_ITEM_LIMIT: number = 10;

    /**
     * Default list item size for resources such as applications, IdPs etc.
     */
    public static readonly DEFAULT_RESOURCE_GRID_ITEM_LIMIT: number = 18;

    /**
     * Default overview statistics insights list item limit.
     */
    public static readonly DEFAULT_STATS_LIST_ITEM_LIMIT: number = 5;

    /**
     * Default theme of the portal.
     */
    public static readonly DEFAULT_THEME: string = "default";

    /**
     * Product Documentation URLs.
     */
    public static readonly IS_DOC_URLS: Map<string, string> = new Map<string, string>()
        .set("5.11.0", "https://is.docs.wso2.com/en/5.11.0/");

    /**
     * Additional top offset padding for page scrolling placement.
     * This will use along with the header height (appHeaderHeight + thisValues).
     */
    public static readonly PAGE_SCROLL_TOP_PADDING = 20;
}
