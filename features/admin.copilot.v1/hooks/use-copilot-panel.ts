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

import { AppState } from "@wso2is/admin.core.v1/store";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";

type AppDispatch = ThunkDispatch<AppState, unknown, AnyAction>;
import {
    addCopilotMessage,
    clearCopilotChatWithApi,
    fetchCopilotHistory,
    loadMoreCopilotHistory,
    sendCopilotMessage,
    setCopilotContentType,
    setCopilotPanelLoading,
    setCopilotPanelVisibility,
    toggleCopilotPanel
} from "../store/actions/copilot";
import {
    CopilotContentType,
    CopilotMessage,
    CopilotPanelState
} from "../store/types/copilot-action-types";

/**
 * Interface for the copilot panel hook return value.
 */
export interface UseCopilotPanelInterface {
    /**
     * Whether the copilot panel is visible.
     */
    isVisible: boolean;
    /**
     * Whether the copilot panel is loading.
     */
    isLoading: boolean;
    /**
     * The chat messages.
     */
    messages: CopilotMessage[];
    /**
     * The current content type.
     */
    contentType: CopilotContentType;
    /**
     * Whether there are older history records available to load.
     */
    hasMoreHistory: boolean;
    /**
     * Whether a "load earlier" history request is in progress.
     */
    isLoadingMoreHistory: boolean;
    /**
     * Function to show the copilot panel.
     */
    showPanel: () => void;
    /**
     * Function to hide the copilot panel.
     */
    hidePanel: () => void;
    /**
     * Function to toggle the copilot panel.
     */
    togglePanel: () => void;
    /**
     * Function to send a message to the copilot.
     */
    sendMessage: (message: string) => void;
    /**
     * Function to add a message to the chat.
     */
    addMessage: (message: CopilotMessage) => void;
    /**
     * Function to clear the chat history.
     */
    clearChat: () => Promise<void>;
    /**
     * Function to set the content type.
     */
    setContentType: (contentType: CopilotContentType) => void;
    /**
     * Function to set the loading state.
     */
    setLoading: (isLoading: boolean) => void;
    /**
     * Function to load chat history.
     */
    loadHistory: () => void;
    /**
     * Function to load the next (older) page of history and prepend it.
     */
    loadMoreHistory: () => void;
    /**
     * The current status message (agent step progress), or null.
     */
    statusMessage: string | null;
}

/**
 * Hook to manage the copilot panel state and actions.
 * Authentication is handled automatically by AsgardeoSPAClient in the API layer.
 *
 * @returns The copilot panel state and actions.
 */
const useCopilotPanel = (): UseCopilotPanelInterface => {
    const dispatch: AppDispatch = useDispatch<AppDispatch>();
    const copilotState: CopilotPanelState = useSelector((state: AppState) => state.copilot);

    const showPanel: () => void = useCallback(() => {
        dispatch(setCopilotPanelVisibility(true));
    }, [ dispatch ]);

    const hidePanel: () => void = useCallback(() => {
        dispatch(setCopilotPanelVisibility(false));
    }, [ dispatch ]);

    const togglePanel: () => void = useCallback(() => {
        dispatch(toggleCopilotPanel());
    }, [ dispatch ]);

    /**
     * Send a message to the copilot.
     * Token handling is done automatically by AsgardeoSPAClient.
     */
    const sendMessage: (message: string) => void = useCallback((message: string) => {
        dispatch(sendCopilotMessage(message));
    }, [ dispatch ]);

    const addMessage: (message: CopilotMessage) => void = useCallback((message: CopilotMessage) => {
        dispatch(addCopilotMessage(message));
    }, [ dispatch ]);

    /**
     * Clear the chat history.
     * Token handling is done automatically by AsgardeoSPAClient.
     */
    const clearChat: () => Promise<void> = useCallback(async () => {
        await dispatch(clearCopilotChatWithApi());
    }, [ dispatch ]);

    const setContentType: (contentType: CopilotContentType) => void = useCallback((contentType: CopilotContentType) => {
        dispatch(setCopilotContentType(contentType));
    }, [ dispatch ]);

    const setLoading: (isLoading: boolean) => void = useCallback((isLoading: boolean) => {
        dispatch(setCopilotPanelLoading(isLoading));
    }, [ dispatch ]);

    const loadHistory: () => void = useCallback(() => {
        dispatch(fetchCopilotHistory());
    }, [ dispatch ]);

    const loadMoreHistory: () => void = useCallback(() => {
        dispatch(loadMoreCopilotHistory());
    }, [ dispatch ]);

    return {
        addMessage,
        clearChat,
        contentType: copilotState?.contentType || CopilotContentType.CHAT,
        hasMoreHistory: copilotState?.hasMoreHistory || false,
        hidePanel,
        isLoading: copilotState?.isLoading || false,
        isLoadingMoreHistory: copilotState?.isLoadingMoreHistory || false,
        isVisible: copilotState?.isVisible || false,
        loadHistory,
        loadMoreHistory,
        messages: copilotState?.messages || [],
        sendMessage,
        setContentType,
        setLoading,
        showPanel,
        statusMessage: copilotState?.statusMessage || null,
        togglePanel
    };
};

export default useCopilotPanel;
