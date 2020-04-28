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

import { CommonConfigReducerStateInterface } from "../../models";
import { CommonConfigActionTypes, CommonConfigActions } from "../actions/types";

/**
 * Reducer to handle the state of common config actions.
 *
 * @param {CommonConfigReducerStateInterface<T, S, U, V, W>} initialState - Reducer initial state.
 *
 * @return {CommonConfigReducerStateInterface<T, S, U, V, W> The new state.
 */
export const commonConfigReducer = <T, S, U, V, W>(initialState: CommonConfigReducerStateInterface<T, S, U, V, W>) => (
    state: CommonConfigReducerStateInterface<T, S, U, V, W> = initialState,
    action: CommonConfigActions<T, S, U, V, W>
): CommonConfigReducerStateInterface<T, S, U, V, W> => {

    switch (action.type) {
        case CommonConfigActionTypes.SET_DEPLOYMENT_CONFIGS:
            return {
                ...state,
                deployment: action.payload
            };
        case CommonConfigActionTypes.SET_SERVICE_RESOURCE_ENDPOINTS:
            return {
                ...state,
                endpoints: action.payload
            };
        case CommonConfigActionTypes.SET_FEATURE_CONFIGS:
            return {
                ...state,
                features: action.payload
            };
        case CommonConfigActionTypes.SET_I18N_CONFIGS:
            return {
                ...state,
                i18n: action.payload
            };
        case CommonConfigActionTypes.SET_UI_CONFIGS:
            return {
                ...state,
                ui: action.payload
            };
        default:
            return state;
    }
};
