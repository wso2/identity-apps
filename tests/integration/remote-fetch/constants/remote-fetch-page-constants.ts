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
 * Class file containing remote configuration constants.
 */
export class RemoteConfigurationPageConstants {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    public static readonly SAVE_CONFIG_DATA_ATTR: string = "remote-fetch-add-configuration";
    public static readonly CONFIG_FORM_DATA_ATTR: string = "remote-fetch-config-form";
    public static readonly REMOVE_CONFIG_DATA_ATTR: string = "remote-fetch-remove-configuration";
    public static readonly REMOVE_CONFIG_MODAL_DATA_ATTR: string = "remote-fetch-confirmation-modal";
    public static readonly REMOVE_CONFIG_MODAL_ASSERT_INPUT_DATA_ATTR: string = "remote-fetch-confirmation-modal-" 
        +"assertion-input";
    public static readonly REMOVE_CONFIG_MODAL_CONFIRM_DATA_ATTR: string = "remote-fetch-confirmation-modal-confirm-"
        +"button";

    // Form Elements
    public static readonly CONFIG_FORM_GIT_URL_DATA_ATTR: string = "remote-fetch-form-git-url";
    public static readonly CONFIG_FORM_GIT_BRANCH_DATA_ATTR: string = "remote-fetch-form-git-branch";
    public static readonly CONFIG_FORM_GIT_DIRECTORY_DATA_ATTR: string = "remote-fetch-form-git-directory";
    public static readonly CONFIG_FORM_GIT_POLLING_DATA_ATTR: string = "remote-fetch-form-connection-polling";
    public static readonly CONFIG_FORM_GIT_USERNAME_DATA_ATTR: string = "remote-fetch-form-git-username";
    public static readonly CONFIG_FORM_GIT_ACCESS_TOKEN_DATA_ATTR: string = "remote-fetch-form-git-accesstoken";
    public static readonly CONFIG_FORM_GIT_SAVE_CONFIG_DATA_ATTR: string = "remote-fetch-save-configuration";
    public static readonly CONFIG_FORM_GIT_STATUS_DATA_ATTR: string = "remote-fetch-config-state";

    // Remote fetch application status layout
    public static readonly REMOTE_FETCH_APPLICATION_STATUS: string = "remote-fetch-status";
    public static readonly REMOTE_FETCH_TRIGGER_CONFIG: string = "remote-fetch-trigger-config";
    public static readonly REMOTE_FETCH_TRIGGER_SUCCESS: string = "remote-fetch-success";
    public static readonly REMOTE_FETCH_TRIGGER_FAILED: string = "remote-fetch-failed";

    // Page Layout.
    public static readonly PAGE_LAYOUT_HEADER_DATA_ATTR: string = "remote-fetch-page-layout-page-header";
    public static readonly PAGE_LAYOUT_HEADER_TITLE_DATA_ATTR: string = "remote-fetch-page-layout-page-header-title";

}
