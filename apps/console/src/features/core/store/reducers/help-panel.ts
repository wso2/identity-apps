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

import { HelpPanelReducerStateInterface } from "../../models";
import { HelpPanelActionTypes, HelpPanelActions } from "../actions/types";

/**
 * Help panel reducer initial state.
 */
const initialState: HelpPanelReducerStateInterface = {
    activeTabIndex: 0,
    docStructure: null,
    docURL: null,
    visibility: false
};

/**
 * Reducer to handle the state of help panel related actions.
 *
 * @param {HelpPanelReducerStateInterface} state - Previous state
 * @param {ApplicationActions} action - Action type.
 * @returns The new state
 */
export const helpPanelReducer = (state: HelpPanelReducerStateInterface = initialState,
    action: HelpPanelActions): HelpPanelReducerStateInterface => {

    switch (action.type) {
        case HelpPanelActionTypes.SET_HELP_PANEL_DOCS_CONTENT_URL:
            return {
                ...state,
                docURL: action.payload
            };
        case HelpPanelActionTypes.SET_HELP_PANEL_DOC_STRUCTURE:
            return {
                ...state,
                docStructure: action.payload
            };
        case HelpPanelActionTypes.TOGGLE_HELP_PANEL_VISIBILITY:
            return {
                ...state,
                visibility: action.payload
            };
        case HelpPanelActionTypes.SET_HELP_PANEL_ACTIVE_TAB_INDEX:
            return {
                ...state,
                activeTabIndex: action.payload
            };
        default:
            return state;
    }
};
