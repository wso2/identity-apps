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

import { CommonRequestLoadersReducerStateInterface } from "../../models";
import { CommonRequestLoadersActionTypes, CommonRequestLoadersActions } from "../actions/types";

/**
 * Reducer to handle the state of common request loaders actions.
 *
 * @param {CommonRequestLoadersReducerStateInterface} initialState - Reducer initial state.
 * @return {CommonRequestLoadersReducerStateInterface} The new state.
 */
export const commonRequestLoadersReducer = (initialState: CommonRequestLoadersReducerStateInterface) => (
    state: CommonRequestLoadersReducerStateInterface = initialState,
    action: CommonRequestLoadersActions
): CommonRequestLoadersReducerStateInterface => {

    switch (action.type) {
        case CommonRequestLoadersActionTypes.SET_PROFILE_INFO_REQUEST_LOADING_STATUS:
            return {
                ...state,
                isProfileInfoRequestLoading: action.payload
            };
        case CommonRequestLoadersActionTypes.SET_PROFILE_SCHEMA_REQUEST_LOADING_STATUS:
            return {
                ...state,
                isProfileSchemaRequestLoading: action.payload
            };
        case CommonRequestLoadersActionTypes.SET_SIGN_OUT_REQUEST_LOADING_STATUS:
            return {
                ...state,
                isSignOutRequestLoading: action.payload
            };
        case CommonRequestLoadersActionTypes.SET_TOKEN_REQUEST_LOADING_STATUS:
            return {
                ...state,
                isTokenRequestLoading: action.payload
            };
        case CommonRequestLoadersActionTypes.SET_TOKEN_REVOKE_REQUEST_LOADING_STATUS:
            return {
                ...state,
                isTokenRevokeRequestLoading: action.payload
            };
        default:
            return state;
    }
};
