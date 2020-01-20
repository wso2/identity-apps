
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

import { GlobalReducerStateInterface } from "../../models";
import { GlobalActions, GlobalActionTypes } from "../actions/types";

/**
 * Initial global state.
 */
const initialState: GlobalReducerStateInterface = {
    alert: null,
    alertSystem: null,
    isGlobalLoaderVisible: false
};

/**
 * Reducer to handle the state of global app actions.
 *
 * @param {GlobalReducerStateInterface} state - Previous state.
 * @param {GlobalActions} action - Action type.
 * @return The new state.
 */
export const globalReducer = (state: GlobalReducerStateInterface = initialState, action: GlobalActions) => {

    switch (action.type) {
        case GlobalActionTypes.SHOW_GLOBAL_LOADER:
            return {
                ...state,
                isGlobalLoaderVisible: true
            };
        case GlobalActionTypes.HIDE_GLOBAL_LOADER:
            return {
                ...state,
                isGlobalLoaderVisible: false
            };
        case GlobalActionTypes.INITIALIZE_ALERT_SYSTEM:
            return {
                ...state,
                alertSystem: action.payload,
            };
        case GlobalActionTypes.ADD_ALERT:
            return {
                ...state,
                alert: action.payload,
            };
        default:
            return state;
    }
};
