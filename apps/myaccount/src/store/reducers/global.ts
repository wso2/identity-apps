
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

import { GlobalInterface } from "../../models";
import { GlobalActionTypes, GlobalActions } from "../actions/types";

/**
 * Initial state.
 */
const initialState: GlobalInterface = {
    activeForm: null,
    alert: null,
    alertSystem: null,
    isApplicationsPageVisible: undefined,
    isGlobalLoaderVisible: false,
    supportedI18nLanguages: null
};

/**
 * Reducer to handle the state of global app actions.
 *
 * @param state - Previous state
 * @param action - Action type
 * @returns The new state
 */
export const globalReducer = (state: GlobalInterface = initialState, action: GlobalActions): GlobalInterface => {
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
        case GlobalActionTypes.TOGGLE_APPLICATIONS_PAGE_VISIBILITY:
            return {
                ...state,
                isApplicationsPageVisible: action.payload
            };
        case GlobalActionTypes.INITIALIZE_ALERT_SYSTEM:
            return {
                ...state,
                alertSystem: action.payload
            };
        case GlobalActionTypes.ADD_ALERT:
            return {
                ...state,
                alert: action.payload
            };
        case GlobalActionTypes.SET_SUPPORTED_I18N_LANGUAGES:
            return {
                ...state,
                supportedI18nLanguages: action.payload
            };
        case GlobalActionTypes.SET_OPEN_ACTION:
            return {
                ...state,
                activeForm: action.payload
            };
        default:
            return state;
    }
};
