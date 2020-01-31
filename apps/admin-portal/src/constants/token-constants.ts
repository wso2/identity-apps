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
 * The login scope.
 * @constant
 * @type {string}
 * @default
 */
export const LOGIN_SCOPE = "internal_login";

/**
 * The internal identity scopes.
 * @constant
 * @type {string}
 * @default
 */
export const INTERNAL_IDENTITY_MGT = {
    INTERNAL_IDENTITY_MGT_CREATE: "internal_identity_mgt_create",
    INTERNAL_IDENTITY_MGT_DELETE: "internal_identity_mgt_delete",
    INTERNAL_IDENTITY_MGT_UPDATE: "internal_identity_mgt_update",
    INTERNAL_IDENTITY_MGT_VIEW: "internal_identity_mgt_view"
};

/**
 * The user management scopes.
 * @constant
 * @type {string}
 * @default
 */
export const INTERNAL_USER_MGT = {
    INTERNAL_USER_MGT_CREATE: "internal_user_mgt_create",
    INTERNAL_USER_MGT_DELETE: "internal_user_mgt_delete",
    INTERNAL_USER_MGT_LIST: "internal_user_mgt_list",
    INTERNAL_USER_MGT_UPDATE: "internal_user_mgt_update",
    INTERNAL_USER_MGT_VIEW: "internal_user_mgt_view"
};

/**
 * Human task scope.
 * @constant
 * @type {string}
 * @default
 */
export const HUMAN_TASK_SCOPE = "internal_humantask_view";

/**
 *  Application management scope
 */
export const INTERNAL_APP_MGT = {
    INTERNAL_APP_MGT_CREATE: "internal_application_mgt_create",
    INTERNAL_APP_MGT_DELETE: "internal_application_mgt_delete",
    INTERNAL_APP_MGT_UPDATE: "internal_application_mgt_update",
    INTERNAL_APP_MGT_VIEW: "internal_application_mgt_view"
};
