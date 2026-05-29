/**
 * Copyright (c) 2026, WSO2 LLC. (https://www.wso2.com).
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
    CopilotMessageInterface,
    CopilotPanelStateInterface
} from "../types/copilot-action-types";

/**
 * Initial state for the copilot reducer.
 */
const initialState: CopilotPanelStateInterface = {
    contentType: CopilotContentType.CHAT,
    hasMoreHistory: false,
    historyOffset: 0,
    historyTotal: 0,
    isLoading: true,
    isLoadingMoreHistory: false,
    isVisible: false,
    messages: [],
    statusMessage: null
};

/**
 * Copilot reducer.
 *
 * @param state - Previous state of copilot.
 * @param action - Action type.
 * @returns The new state.
 */
export const copilotReducer: Reducer<CopilotPanelStateInterface> = (
    state: CopilotPanelStateInterface = initialState,
    action: CopilotActions
): CopilotPanelStateInterface => {
    switch (action.type) {
        case CopilotActionTypes.SET_COPILOT_PANEL_VISIBILITY:
            return {
                ...state,
                isVisible: action.payload
                // Note: Keep isLoading state when panel is hidden/shown
                // This ensures "thinking" indicator persists when panel is reopened
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
                messages: state.messages.map((message: CopilotMessageInterface) =>
                    message.id === action.payload.id
                        ? {
                            ...message,
                            content: typeof action.payload.content === "string"
                                ? message.content + action.payload.content
                                : message.content,
                            type: action.payload.type ?? message.type,
                            ...(action.payload.suggestions !== undefined && {
                                suggestions: action.payload.suggestions,
                                suggestionsLoading: false
                            }),
                            ...(action.payload.suggestionsLoading !== undefined &&
                                action.payload.suggestions === undefined && {
                                suggestionsLoading: action.payload.suggestionsLoading
                            })
                        }
                        : message
                )
            };
        case CopilotActionTypes.CLEAR_COPILOT_CHAT:
            return {
                ...state,
                hasMoreHistory: false,
                historyOffset: 0,
                historyTotal: 0,
                isLoading: false,
                isLoadingMoreHistory: false,
                messages: [],
                statusMessage: null
            };
        case CopilotActionTypes.SET_COPILOT_CONTENT_TYPE:
            return {
                ...state,
                contentType: action.payload
            };
        case CopilotActionTypes.SET_COPILOT_CHAT_HISTORY:
            return {
                ...state,
                messages: action.payload
            };
        case CopilotActionTypes.SET_COPILOT_STATUS_MESSAGE:
            return {
                ...state,
                statusMessage: action.payload
            };
        case CopilotActionTypes.SET_COPILOT_HISTORY_PAGINATION:
            return {
                ...state,
                hasMoreHistory: action.payload.hasMoreHistory,
                historyOffset: action.payload.nextOffset,
                historyTotal: action.payload.total,
                isLoadingMoreHistory: false
            };
        case CopilotActionTypes.PREPEND_COPILOT_MESSAGES:
            return {
                ...state,
                messages: [ ...action.payload, ...state.messages ]
            };
        case CopilotActionTypes.SET_IS_LOADING_MORE_HISTORY:
            return {
                ...state,
                isLoadingMoreHistory: action.payload
            };
        default:
            return state;
    }
};
