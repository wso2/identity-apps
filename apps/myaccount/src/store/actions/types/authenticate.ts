/**
 * Copyright (c) 2019-2023, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
 */
const SET_SIGN_IN: string = "SET_SIGN_IN";

/**
 * Action type to handle the sign out requests
 */
const SET_SIGN_OUT: string = "SET_SIGN_OUT";

/**
 * Action type to handle the reset authentication requests
 */
const RESET_AUTHENTICATION: string = "RESET_AUTHENTICATION";

/**
 * Action type to set the profile info
 */
const SET_PROFILE_INFO: string = "SET_PROFILE_INFO";

/**
 * Action type to set the schemas
 */
const SET_SCHEMAS: string = "SET_SCHEMAS";

/**
 * Action type to set the initialized flag.
 */
const SET_INITIALIZED: string = "SET_INITIALIZED";

/**
 * Action type to set whether the user has a local account or not.
 */
const SET_LOCAL_ACCOUNT_STATUS: string = "SET_LOCAL_ACCOUNT_STATUS";

/**
 * Export action types
 */
export const authenticateActionTypes: {
    RESET_AUTHENTICATION: string;
    SET_INITIALIZED: string;
    SET_PROFILE_INFO: string;
    SET_SCHEMAS: string;
    SET_SIGN_IN: string;
    SET_SIGN_OUT: string;
    SET_LOCAL_ACCOUNT_STATUS: string;
} = {
    RESET_AUTHENTICATION,
    SET_INITIALIZED,
    SET_LOCAL_ACCOUNT_STATUS,
    SET_PROFILE_INFO,
    SET_SCHEMAS,
    SET_SIGN_IN,
    SET_SIGN_OUT
};

/**
 * Api request end action interface.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthAction {
    payload?: any;
    type: string;
}
