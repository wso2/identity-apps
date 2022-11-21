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

import { AlertInterface } from "@wso2is/core/models";
import { commonGlobalReducer } from "@wso2is/core/store";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import { System } from "react-notification-system";
import reduceReducers from "reduce-reducers";
import { Reducer } from "redux";
import { GlobalReducerStateInterface } from "../../models";
import { GlobalActionTypes, GlobalActions } from "../actions/types";

/**
 * Initial state for the common global reducer.
 */
const initialState: GlobalReducerStateInterface = {

    activeView: null,
    alert: null,
    alertSystem: null,
    isAJAXTopLoaderVisible: false,
    supportedI18nLanguages: null
};

/**
 * Reducer to handle the state of Global actions specific to Console.
 *
 * @param {AccessControlReducerStateInterface} state - Previous state
 * @param {AccessControlActionType} action - Action type.
 * @returns The new state
 */
const GlobalReducer = (state: GlobalReducerStateInterface = initialState,
    action: GlobalActions): GlobalReducerStateInterface => {

    switch (action.type) {
        case GlobalActionTypes.SET_ACTIVE_VIEW:
            return {
                ...state,
                activeView: action.payload
            };
        default:
            return state;
    }
};

export const globalReducer: Reducer<any> = reduceReducers(initialState,
    commonGlobalReducer<AlertInterface, System, SupportedLanguagesMeta>(initialState),
    GlobalReducer);
