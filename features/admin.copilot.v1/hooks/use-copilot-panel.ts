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

import { useAuthContext } from "@asgardeo/auth-react";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import {
    addCopilotMessage,
    clearCopilotChatWithApi,
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
    clearChat: () => void;
    /**
     * Function to set the content type.
     */
    setContentType: (contentType: CopilotContentType) => void;
    /**
     * Function to set the loading state.
     */
    setLoading: (isLoading: boolean) => void;
}

/**
 * Hook to manage the copilot panel state and actions.
 *
 * @returns The copilot panel state and actions.
 */
const useCopilotPanel = (): UseCopilotPanelInterface => {
    const dispatch: Dispatch = useDispatch();
    const { getAccessToken } = useAuthContext();

    // Use a generic selector that works with any app state structure
    const copilotState: CopilotPanelState = useSelector((state: any) => state.copilot);

    const showPanel: () => void = useCallback(() => {
        dispatch(setCopilotPanelVisibility(true));
    }, [ dispatch ]);

    const hidePanel: () => void = useCallback(() => {
        dispatch(setCopilotPanelVisibility(false));
    }, [ dispatch ]);

    const togglePanel: () => void = useCallback(() => {
        dispatch(toggleCopilotPanel());
    }, [ dispatch ]);

    const sendMessage: (message: string) => Promise<void> = useCallback(async (message: string) => {
        try {
            // TODO: get access token from the context
            const accessToken: string = await getAccessToken();

            dispatch(sendCopilotMessage(message, accessToken) as any);
        } catch (error) {
            dispatch(sendCopilotMessage(message) as any);
        }
    }, [ dispatch, getAccessToken ]);

    const addMessage: (message: CopilotMessage) => void = useCallback((message: CopilotMessage) => {
        dispatch(addCopilotMessage(message));
    }, [ dispatch ]);

    const clearChat: () => Promise<void> = useCallback(async () => {
        try {
            // TODO: get access token from the context
            const accessToken: string = await getAccessToken();

            dispatch(clearCopilotChatWithApi(accessToken) as any);
        } catch (error) {
            dispatch(clearCopilotChatWithApi() as any);
        }
    }, [ dispatch, getAccessToken ]);

    const setContentType: (contentType: CopilotContentType) => void = useCallback((contentType: CopilotContentType) => {
        dispatch(setCopilotContentType(contentType));
    }, [ dispatch ]);

    const setLoading: (isLoading: boolean) => void = useCallback((isLoading: boolean) => {
        dispatch(setCopilotPanelLoading(isLoading));
    }, [ dispatch ]);

    return {
        addMessage,
        clearChat,
        contentType: copilotState?.contentType || CopilotContentType.CHAT,
        hidePanel,
        isLoading: copilotState?.isLoading || false,
        isVisible: copilotState?.isVisible || false,
        messages: copilotState?.messages || [],
        sendMessage,
        setContentType,
        setLoading,
        showPanel,
        togglePanel
    };
};

export default useCopilotPanel;
