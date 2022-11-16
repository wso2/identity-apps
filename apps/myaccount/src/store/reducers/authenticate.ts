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

import { AuthStateInterface, createEmptyProfile } from "../../models";
import { authenticateActionTypes } from "../actions/types";

/**
 * Initial authenticate state.
 */
const authenticateInitialState: AuthStateInterface = {
    displayName: "",
    emails: "",
    initialized: false,
    isAuth: false,
    location: window["AppUtils"]?.getConfig()?.routes.home,
    loginInit: false,
    logoutInit: false,
    profileInfo: createEmptyProfile(),
    profileSchemas: [],
    scope: "",
    tenantDomain: "",
    username: ""
};

/**
 * Reducer to handle the state of authentication related actions.
 *
 * @param state - Previous state
 * @param action - Action type
 * @returns The new state
 */
const authenticateReducer = (state: AuthStateInterface = authenticateInitialState, action): AuthStateInterface => {
    switch (action.type) {
        case authenticateActionTypes.SET_SIGN_IN:
            if (action.payload) {
                return {
                    ...state,
                    displayName: action.payload.display_name,
                    emails: action.payload.email,
                    isAuth: true,
                    loginInit: true,
                    logoutInit: false,
                    scope: action.payload.scope,
                    tenantDomain: action.payload.tenantDomain,
                    username: action.payload.username
                };
            }
            break;
        case authenticateActionTypes.SET_SIGN_OUT:
            return {
                ...state,
                loginInit: false,
                logoutInit: true
            };
        case authenticateActionTypes.RESET_AUTHENTICATION:
            return {
                ...authenticateInitialState
            };
        case authenticateActionTypes.SET_PROFILE_INFO:
            return {
                ...state,
                profileInfo: action.payload
            };
        case authenticateActionTypes.SET_SCHEMAS:
            return {
                ...state,
                profileSchemas: action.payload
            };
        case authenticateActionTypes.SET_INITIALIZED:
            return {
                ...state,
                initialized: action.payload
            };
        default:
            return state;
    }
};

export {
    authenticateInitialState,
    authenticateReducer
};
