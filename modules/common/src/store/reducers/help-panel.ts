/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { HelpPanelActionTypes, HelpPanelActions } from "../actions/types/help-panel";

/**
 * Help panel reducer state interface.
 */
export interface HelpPanelReducerStateInterface {
    activeTabIndex: number;
    docURL: string;
    docStructure: any;
    visibility: boolean;
}

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
