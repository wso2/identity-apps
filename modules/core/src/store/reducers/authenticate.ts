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

import { CommonAuthenticateActionTypes, CommonAuthenticateActions } from "../actions/types";

/**
 * Reducer to handle the state of common authentication related actions.
 *
 * @param {T} initialState - Reducer initial state.
 * @return {(state: T, action: CommonAuthenticateActions<S>) => T} The new state.
 */
export const commonAuthenticateReducer = <T, S>(
    initialState: T) => (
        state: T = { ...initialState },
        action: CommonAuthenticateActions<S>
): T => {

    switch (action.type) {
        case CommonAuthenticateActionTypes.SET_SIGN_IN:
            if (action.payload) {

                return {
                    ...state,
                    ...action.payload,
                    isAuthenticated: true,
                    loginInit: true,
                    logoutInit: false
                };
            }

            return {
                ...state
            };
        case CommonAuthenticateActionTypes.SET_SIGN_OUT:
            return {
                ...state,
                loginInit: false,
                logoutInit: true
            };
        case CommonAuthenticateActionTypes.SET_INITIALIZED:
            return {
                ...state,
                initialized: action.payload
            };
        case CommonAuthenticateActionTypes.RESET_AUTHENTICATION:
            return {
                ...initialState
            };
        case CommonAuthenticateActionTypes.SET_DEFAULT_TENANT:
            return {
                ...state,
                defaultTenant: action.payload
            };
        case CommonAuthenticateActionTypes.SET_TENANTS:
            return {
                ...state,
                tenants: action.payload
            };
        default:
            return state;
    }
};
