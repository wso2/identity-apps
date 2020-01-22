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

import { AuthenticateSessionUtil, AuthenticateTokenKeys, AuthenticateUserKeys } from "@wso2is/authentication";
import { AuthReducerStateInterface } from "../../models";
import { AuthenticateActions, AuthenticateActionTypes } from "../actions/types";

/**
 * Initial authenticate state.
 */
const initialState: AuthReducerStateInterface = {
    displayName: "",
    emails: "",
    isAuthenticated: false,
    loginInit: false,
    logoutInit: false,
    username: ""
};

/**
 * Reducer to handle the state of authentication related actions.
 *
 * @param {AuthReducerStateInterface} state - Previous state.
 * @param {AuthenticateActions} action - Action type.
 * @returns The new state.
 */
export const authenticateReducer = (state: AuthReducerStateInterface = initialState, action: AuthenticateActions) => {

    switch (action.type) {
        case AuthenticateActionTypes.SET_SIGN_IN:
            if (AuthenticateSessionUtil.getSessionParameter(AuthenticateTokenKeys.ACCESS_TOKEN)) {
                return {
                    ...state,
                    displayName: AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.DISPLAY_NAME),
                    emails: AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.EMAIL),
                    isAuth: true,
                    loginInit: true,
                    logoutInit: false,
                    username: AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.USERNAME),
                };
            }
            break;
        case AuthenticateActionTypes.SET_SIGN_OUT:
            return {
                ...state,
                loginInit: false,
                logoutInit: true
            };
        case AuthenticateActionTypes.RESET_AUTHENTICATION:
            return {
                ...initialState
            };
        default:
            return state;
    }
};
