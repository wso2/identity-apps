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

import { CommonProfileReducerStateInterface } from "../../models";
import { CommonProfileActionTypes, CommonProfileActions } from "../actions/types";

/**
 * Reducer to handle the state of profile related actions.
 *
 * @param {CommonProfileReducerStateInterface<T, S, U>} initialState - Reducer initial state.
 * @returns {CommonProfileReducerStateInterface<T, S, U>} The new state
 */
export const commonProfileReducer = <T, S, U>(initialState: CommonProfileReducerStateInterface<T, S, U>) => (
    state: CommonProfileReducerStateInterface<T, S, U> = initialState,
    action: CommonProfileActions<T, S, U>
): CommonProfileReducerStateInterface<T, S, U> => {

    switch (action.type) {
        case CommonProfileActionTypes.SET_PROFILE_INFO:
            return {
                ...state,
                profileInfo: action.payload
            };
        case CommonProfileActionTypes.SET_PROFILE_SCHEMAS:
            return {
                ...state,
                profileSchemas: action.payload
            };
        case CommonProfileActionTypes.SET_PROFILE_LINKED_ACCOUNTS:
            return {
                ...state,
                linkedAccounts: action.payload
            };
        case CommonProfileActionTypes.TOGGLE_SCIM_ENABLED:
            return {
                ...state,
                isSCIMEnabled: action.payload
            };
        default:
            return state;
    }
};
