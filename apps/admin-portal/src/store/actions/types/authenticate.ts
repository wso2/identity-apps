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
 * Action type to handle the sign in requests
 *
 * @type {string}
 */
const SET_SIGN_IN = "SET_SIGN_IN";

/**
 * Action type to handle the sign out requests
 *
 * @type {string}
 */
const SET_SIGN_OUT = "SET_SIGN_OUT";

/**
 * Action type to handle the reset authentication requests
 *
 * @type {string}
 */
const RESET_AUTHENTICATION = "RESET_AUTHENTICATION";

/**
 * Action type to set the profile info
 *
 * @type {string}
 */
const SET_PROFILE_INFO = "SET_PROFILE_INFO";

/**
 * Action type to set the schemas
 * @type {string}
 */
const SET_SCHEMAS = "SET_SCHEMAS";

/**
 * Export action types
 *
 * @type {object}
 */
export const authenticateActionTypes = {
    RESET_AUTHENTICATION,
    SET_PROFILE_INFO,
    SET_SCHEMAS,
    SET_SIGN_IN,
    SET_SIGN_OUT
};
