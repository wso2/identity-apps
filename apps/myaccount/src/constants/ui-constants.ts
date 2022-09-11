/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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

import { UIConstants as CommonUIConstants } from "@wso2is/core/constants";

/**
 * Class containing ui constants.
 */
export class UIConstants extends CommonUIConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() {
        super();
    }

    /**
     * The maximum recent application count.
     */
    public static readonly RECENT_APPLICATIONS_LIST_LIMIT: number = 3;

    /**
     * Add local linked account form identifier.
     */
     public static readonly ADD_LOCAL_LINKED_ACCOUNT_FORM_IDENTIFIER: string = "addLocalLinkedAccountForm";

     /**
     * Error Account status upper limit.
     */
    public static readonly ERROR_ACCOUNT_STATUS_UPPER_LIMIT = 40;

    /**
     * Warning Account status upper limit.
     */
    public static readonly WARNING_ACCOUNT_STATUS_UPPER_LIMIT = 70;

    /**
     * Default theme of the portal.
     */
    public static readonly DEFAULT_THEME: string = "default";

    /**
     * Default header height to be used in state initializations.
     */
    public static readonly DEFAULT_HEADER_HEIGHT: number = 59;

    /**
     * Default footer height to be used in state initializations.
     */
    public static readonly DEFAULT_FOOTER_HEIGHT: number = 60;

    /**
     * AJAX top loading bar height.
     */
    public static readonly AJAX_TOP_LOADING_BAR_HEIGHT: number = 3;

    /**
     * Interval to dismiss the alerts.
     */
    public static readonly ALERT_DISMISS_INTERVAL: number = 15;

    /**
     * Constant to handle dashboard layout's desktop content top spacing.
     */
    public static readonly DASHBOARD_LAYOUT_DESKTOP_CONTENT_TOP_SPACING: number = 0;
}
