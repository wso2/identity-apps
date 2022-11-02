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

import { CommonGlobalReducerStateInterface } from "../../models";
import { CommonGlobalActionTypes, CommonGlobalActions } from "../actions/types";

/**
 * Reducer to handle the state of common global app actions.
 *
 * @param {CommonGlobalReducerStateInterface<T, S, U>} initialState - Reducer initial state.
 * @return {CommonGlobalReducerStateInterface<T, S, U>} The new state.
 */
export const commonGlobalReducer = <T, S, U>(initialState: CommonGlobalReducerStateInterface<T, S, U>) => (
    state: CommonGlobalReducerStateInterface<T, S, U> = initialState,
    action: CommonGlobalActions<T, S, U>
): CommonGlobalReducerStateInterface<T, S, U> => {

    switch (action.type) {
        case CommonGlobalActionTypes.SHOW_AJAX_TOP_LOADING_BAR:
            return {
                ...state,
                isAJAXTopLoaderVisible: true
            };
        case CommonGlobalActionTypes.HIDE_AJAX_TOP_LOADING_BAR:
            return {
                ...state,
                isAJAXTopLoaderVisible: false
            };
        case CommonGlobalActionTypes.INITIALIZE_ALERT_SYSTEM:
            return {
                ...state,
                alertSystem: action.payload
            };
        case CommonGlobalActionTypes.ADD_ALERT:
            return {
                ...state,
                alert: action.payload
            };
        case CommonGlobalActionTypes.SET_SUPPORTED_I18N_LANGUAGES:
            return {
                ...state,
                supportedI18nLanguages: action.payload
            };
        default:
            return state;
    }
};
