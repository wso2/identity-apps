/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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

import { Reducer } from "redux";
import {
    CopilotActionTypes,
    CopilotActions,
    CopilotContentType,
    CopilotMessage,
    CopilotPanelState
} from "../types/copilot-action-types";

/**
 * Initial state for the copilot reducer.
 */
const initialState: CopilotPanelState = {
    contentType: CopilotContentType.CHAT,
    isLoading: false,
    isVisible: false,
    messages: []
};

/**
 * Copilot reducer.
 *
 * @param state - Previous state of copilot.
 * @param action - Action type.
 * @returns The new state.
 */
export const copilotReducer: Reducer<CopilotPanelState> = (
    state: CopilotPanelState = initialState,
    action: CopilotActions
): CopilotPanelState => {
    switch (action.type) {
        case CopilotActionTypes.SET_COPILOT_PANEL_VISIBILITY:
            return {
                ...state,
                isVisible: action.payload
            };
        case CopilotActionTypes.TOGGLE_COPILOT_PANEL:
            return {
                ...state,
                isVisible: !state.isVisible
            };
        case CopilotActionTypes.SET_COPILOT_PANEL_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
        case CopilotActionTypes.ADD_COPILOT_MESSAGE:
            return {
                ...state,
                messages: [ ...state.messages, action.payload ]
            };
        case CopilotActionTypes.UPDATE_COPILOT_MESSAGE:
            return {
                ...state,
                messages: state.messages.map((message: CopilotMessage) =>
                    message.id === action.payload.id
                        ? { ...message, content: action.payload.content }
                        : message
                )
            };
        case CopilotActionTypes.CLEAR_COPILOT_CHAT:
            return {
                ...state,
                messages: []
            };
        case CopilotActionTypes.SET_COPILOT_CONTENT_TYPE:
            return {
                ...state,
                contentType: action.payload
            };
        default:
            return state;
    }
};
