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
 * Enum for authenticate action types.
 *
 * @readonly
 * @enum {string}
 */
export enum AuthenticateActionTypes {
    /**
     * Redux action type to handle the reset authentication requests.
     *
     * @type {string}
     */
    RESET_AUTHENTICATION = "RESET_AUTHENTICATION",
    /**
     * Redux action type to handle the sign in requests.
     *
     * @type {string}
     */
    SET_SIGN_IN = "SET_SIGN_IN",
    /**
     * Redux action type to handle the sign out requests.
     *
     * @type {string}
     */
    SET_SIGN_OUT = "SET_SIGN_OUT"
}

/**
 * Authenticate base action interface.
 */
interface AuthenticateBaseActionInterface {
    type: AuthenticateActionTypes;
}

/**
 * Set sign in action interface.
 */
export interface SetSignInActionInterface extends AuthenticateBaseActionInterface {
    type: AuthenticateActionTypes.SET_SIGN_IN;
}

/**
 * Set sign out action interface.
 */
export interface SetSignOutActionInterface extends AuthenticateBaseActionInterface {
    type: AuthenticateActionTypes.SET_SIGN_OUT;
}

/**
 * Reset authentication action interface.
 */
export interface ResetAuthenticationActionInterface extends AuthenticateBaseActionInterface {
    type: AuthenticateActionTypes.RESET_AUTHENTICATION;
}

/**
 * Export action interfaces.
 */
export type AuthenticateActions = ResetAuthenticationActionInterface
    | SetSignInActionInterface
    | SetSignOutActionInterface;
