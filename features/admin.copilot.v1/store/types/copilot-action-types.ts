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

/**
 * Enum for copilot action types.
 */
export enum CopilotActionTypes {
    /**
     * Action type to set the copilot panel visibility.
     */
    SET_COPILOT_PANEL_VISIBILITY = "SET_COPILOT_PANEL_VISIBILITY",
    /**
     * Action type to toggle the copilot panel.
     */
    TOGGLE_COPILOT_PANEL = "TOGGLE_COPILOT_PANEL",
    /**
     * Action type to set copilot panel loading state.
     */
    SET_COPILOT_PANEL_LOADING = "SET_COPILOT_PANEL_LOADING",
    /**
     * Action type to add a message to copilot chat.
     */
    ADD_COPILOT_MESSAGE = "ADD_COPILOT_MESSAGE",
    /**
     * Action type to update a message in copilot chat.
     */
    UPDATE_COPILOT_MESSAGE = "UPDATE_COPILOT_MESSAGE",
    /**
     * Action type to clear copilot chat history.
     */
    CLEAR_COPILOT_CHAT = "CLEAR_COPILOT_CHAT",
    /**
     * Action type to set copilot panel content type.
     */
    SET_COPILOT_CONTENT_TYPE = "SET_COPILOT_CONTENT_TYPE",
    /**
     * Action type to set copilot chat history.
     */
    SET_COPILOT_CHAT_HISTORY = "SET_COPILOT_CHAT_HISTORY",
    /**
     * Action type to set copilot status message (agent step progress).
     */
    SET_COPILOT_STATUS_MESSAGE = "SET_COPILOT_STATUS_MESSAGE",
    /**
     * Action type to set history pagination metadata.
     */
    SET_COPILOT_HISTORY_PAGINATION = "SET_COPILOT_HISTORY_PAGINATION",
    /**
     * Action type to prepend older messages to the chat (load-earlier).
     */
    PREPEND_COPILOT_MESSAGES = "PREPEND_COPILOT_MESSAGES",
    /**
     * Action type to set the isLoadingMoreHistory flag independently of pagination metadata.
     */
    SET_IS_LOADING_MORE_HISTORY = "SET_IS_LOADING_MORE_HISTORY",
    /**
     * Action type to add or update an action card on a copilot message.
     */
    SET_COPILOT_MESSAGE_ACTION = "SET_COPILOT_MESSAGE_ACTION"
}

/**
 * State of a change the copilot proposed. EXPIRED and UNAVAILABLE are only set by the Console.
 */
export type CopilotActionStatus = "PENDING" | "EXECUTING" | "SUCCEEDED" | "FAILED" | "UNKNOWN" | "PARTIAL"
    | "CANCELLED" | "EXPIRED" | "UNAVAILABLE";

/**
 * One field of an action card. Rendered by `type`, never by `key`.
 */
export interface CopilotActionFieldInterface {
    key: string;
    label: string;
    type: "text" | "enum" | "url" | "url_list" | "text_list" | "boolean" | "reference" | "reference_list"
        | "secret" | string;
    value?: unknown;
    required?: boolean;
    editable?: boolean;
    options?: { value: string; label: string }[];
}

/**
 * A change the copilot proposed, shown as a card the user confirms or cancels.
 */
export interface CopilotActionInterface {
    id: string;
    action: string;
    title: string;
    summary: string;
    fields: CopilotActionFieldInterface[];
    /** ISO 8601 time after which the proposal can no longer be confirmed. */
    expires_at: string;
    status: CopilotActionStatus;
    /** "elevated": the user ticks that they reviewed the card before confirming. */
    risk?: string;
    /** Shown above the fields while the card is pending. */
    warnings?: string[];
    /** What a create action created (only when the server returned 201 with its id). */
    resource?: { type: string; id: string };
    /** Why the action wasn't executed. */
    error?: { code: string; message: string };
    /** Buttons are enabled once the turn that proposed it has finished. */
    ready?: boolean;
    /** A confirm or cancel request is in progress. */
    submitting?: boolean;
}

/**
 * Copilot message interface.
 */
export interface CopilotMessageInterface {
    id: string;
    content: string;
    sender: "user" | "copilot";
    timestamp: number;
    type?: "text" | "code" | "error" | "streaming";
    suggestions?: string[];
    /** True while the backend is generating suggestions — used to show skeleton placeholders. */
    suggestionsLoading?: boolean;
    /** Changes proposed in this message, shown as cards. */
    actions?: CopilotActionInterface[];
}

/**
 * Copilot content types.
 */
export enum CopilotContentType {
    CHAT = "chat",
    HELP = "help",
    DOCUMENTATION = "documentation"
}

/**
 * Copilot panel state interface.
 */
export interface CopilotPanelStateInterface {
    isVisible: boolean;
    isLoading: boolean;
    messages: CopilotMessageInterface[];
    contentType: CopilotContentType;
    statusMessage: string | null;
    /** Whether there are older history records available to load. */
    hasMoreHistory: boolean;
    /** Current reverse-offset used for the next "load earlier" request. */
    historyOffset: number;
    /** Total number of history records stored for the user. */
    historyTotal: number;
    /** Whether a "load earlier" request is in progress. */
    isLoadingMoreHistory: boolean;
}

/**
 * Set copilot panel visibility action interface.
 */
export interface SetCopilotPanelVisibilityActionInterface {
    payload: boolean;
    type: CopilotActionTypes.SET_COPILOT_PANEL_VISIBILITY;
}

/**
 * Toggle copilot panel action interface.
 */
export interface ToggleCopilotPanelActionInterface {
    type: CopilotActionTypes.TOGGLE_COPILOT_PANEL;
}

/**
 * Set copilot panel loading action interface.
 */
export interface SetCopilotPanelLoadingActionInterface {
    payload: boolean;
    type: CopilotActionTypes.SET_COPILOT_PANEL_LOADING;
}

/**
 * Add copilot message action interface.
 */
export interface AddCopilotMessageActionInterface {
    payload: CopilotMessageInterface;
    type: CopilotActionTypes.ADD_COPILOT_MESSAGE;
}

/**
 * Update copilot message action interface.
 */
export interface UpdateCopilotMessageActionInterface {
    payload: {
        id: string;
        content: string;
        type?: CopilotMessageInterface["type"];
        suggestions?: string[];
        suggestionsLoading?: boolean;
    };
    type: CopilotActionTypes.UPDATE_COPILOT_MESSAGE;
}

/**
 * Clear copilot chat action interface.
 */
export interface ClearCopilotChatActionInterface {
    type: CopilotActionTypes.CLEAR_COPILOT_CHAT;
}

/**
 * Set copilot content type action interface.
 */
export interface SetCopilotContentTypeActionInterface {
    payload: CopilotContentType;
    type: CopilotActionTypes.SET_COPILOT_CONTENT_TYPE;
}

/**
 * Set copilot chat history action interface.
 */
export interface SetCopilotChatHistoryActionInterface {
    payload: CopilotMessageInterface[];
    type: CopilotActionTypes.SET_COPILOT_CHAT_HISTORY;
}

/**
 * Set copilot status message action interface.
 */
export interface SetCopilotStatusMessageActionInterface {
    payload: string | null;
    type: CopilotActionTypes.SET_COPILOT_STATUS_MESSAGE;
}

/**
 * History pagination metadata payload.
 */
export interface HistoryPaginationPayloadInterface {
    hasMoreHistory: boolean;
    /** Next offset to use for loading earlier messages. */
    nextOffset: number;
    total: number;
}

/**
 * Set history pagination state action interface.
 */
export interface SetCopilotHistoryPaginationActionInterface {
    payload: HistoryPaginationPayloadInterface;
    type: CopilotActionTypes.SET_COPILOT_HISTORY_PAGINATION;
}

/**
 * Prepend older messages action interface (used when loading earlier history).
 */
export interface PrependCopilotMessagesActionInterface {
    payload: CopilotMessageInterface[];
    type: CopilotActionTypes.PREPEND_COPILOT_MESSAGES;
}

/**
 * Set isLoadingMoreHistory flag action interface.
 */
export interface SetIsLoadingMoreHistoryActionInterface {
    payload: boolean;
    type: CopilotActionTypes.SET_IS_LOADING_MORE_HISTORY;
}

/**
 * Add or update (by id) an action card on a message.
 */
export interface SetCopilotMessageActionActionInterface {
    payload: {
        messageId: string;
        action: Partial<CopilotActionInterface> & { id: string };
    };
    type: CopilotActionTypes.SET_COPILOT_MESSAGE_ACTION;
}

/**
 * Export action interfaces.
 */
export type CopilotActions = SetCopilotPanelVisibilityActionInterface
    | ToggleCopilotPanelActionInterface
    | SetCopilotPanelLoadingActionInterface
    | AddCopilotMessageActionInterface
    | UpdateCopilotMessageActionInterface
    | ClearCopilotChatActionInterface
    | SetCopilotContentTypeActionInterface
    | SetCopilotChatHistoryActionInterface
    | SetCopilotStatusMessageActionInterface
    | SetCopilotHistoryPaginationActionInterface
    | PrependCopilotMessagesActionInterface
    | SetIsLoadingMoreHistoryActionInterface
    | SetCopilotMessageActionActionInterface;
