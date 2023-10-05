/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { AlertInterface } from "@wso2is/core/models";
import { commonGlobalReducer } from "@wso2is/core/store";
import { SupportedLanguagesMeta } from "@wso2is/i18n";
import { System } from "react-notification-system";
import reduceReducers from "reduce-reducers";
import { Reducer } from "redux";
import { GlobalReducerStateInterface } from "../../models/reducer-state";
import { GlobalActionTypes, GlobalActions } from "../actions/types/global";

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
