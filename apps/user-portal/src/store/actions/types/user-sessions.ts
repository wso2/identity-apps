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

import { Notification, UserSession, UserSessions } from "../../../models";

/**
 * Action type to handle user sessions fetching.
 *
 * @type {string}
 */
export const FETCH_USER_SESSIONS = "FETCH_USER_SESSIONS";

/**
 * Fetch sessions action interface.
 */
export interface FetchUserSessionsAction {
    type: typeof FETCH_USER_SESSIONS;
}

/**
 * Action type to handle fetch user session action's `onSuccess` callback.
 *
 * @type {string}
 */
export const FETCH_USER_SESSIONS_SUCCESS = "FETCH_USER_SESSIONS_SUCCESS";

/**
 * Action type to fetch user session action's `onError` callback.
 *
 * @type {string}
 */
export const FETCH_USER_SESSIONS_ERROR = "FETCH_USER_SESSIONS_ERROR";

/**
 * Action type to update the list of user sessions after the request succeeds.
 *
 * @type {string}
 */
export const UPDATE_USER_SESSIONS = "UPDATE_USER_SESSIONS";

/**
 * Update user sessions action interface.
 */
export interface UpdateUserSessionsAction {
    payload: UserSessions;
    type: typeof UPDATE_USER_SESSIONS;
}

/**
 * Action type to set the currently editing user session.
 *
 * @type {string}
 */
export const SET_EDITING_USER_SESSION = "SET_EDITING_USER_SESSION";

/**
 * Set editing user session action interface.
 */
export interface SetEditingUserSessionAction {
    payload: UserSession;
    type: typeof SET_EDITING_USER_SESSION;
}

/**
 * Action type to revoke all the user sessions.
 *
 * @type {string}
 */
export const REVOKE_ALL_USER_SESSIONS = "REVOKE_ALL_USER_SESSIONS";

/**
 * Revoke all user sessions action interface.
 */
export interface RevokeAllUserSessionsAction {
    type: typeof REVOKE_ALL_USER_SESSIONS;
}

/**
 * Action type to handle revoke all user sessions action's `onSuccess` callback.
 *
 * @type {string}
 */
export const REVOKE_ALL_USER_SESSIONS_SUCCESS = "REVOKE_ALL_USER_SESSIONS_SUCCESS";

/**
 * Action type to handle revoke all user sessions action's `onError` callback.
 *
 * @type {string}
 */
export const REVOKE_ALL_USER_SESSIONS_ERROR = "REVOKE_ALL_USER_SESSIONS_ERROR";

/**
 * Action type to revoke an user sessions.
 *
 * @type {string}
 */
export const REVOKE_USER_SESSION = "REVOKE_USER_SESSION";

/**
 * Revoke an user sessions action interface.
 */
export interface RevokeUserSessionAction {
    payload: string;
    type: typeof REVOKE_USER_SESSION;
}

/**
 * Action type to handle revoke an user sessions action's `onSuccess` callback.
 *
 * @type {string}
 */
export const REVOKE_USER_SESSION_SUCCESS = "REVOKE_USER_SESSION_SUCCESS";

/**
 * Action type to handle revoke an user sessions action's `onError` callback.
 *
 * @type {string}
 */
export const REVOKE_USER_SESSION_ERROR = "REVOKE_USER_SESSION_ERROR";

/**
 * Action type to set the active indexes of the sessions list.
 *
 * @type {string}
 */
export const SET_SESSIONS_LIST_ACTIVE_INDEXES = "SET_SESSIONS_LIST_ACTIVE_INDEXES";

/**
 * Set sessions list active indexes action interface.
 */
export interface SetSessionsListActiveIndexesAction {
    payload: number[];
    type: typeof SET_SESSIONS_LIST_ACTIVE_INDEXES;
}

/**
 * Action type to show the session revoke confirmation modal when revoking all the sessions.
 *
 * @type {string}
 */
export const SHOW_REVOKE_ALL_USER_SESSIONS_MODAL = "SHOW_REVOKE_ALL_USER_SESSIONS_MODAL";

/**
 * Action type to hide the session revoke confirmation modal when revoking all the sessions.
 *
 * @type {string}
 */
export const HIDE_REVOKE_ALL_USER_SESSIONS_MODAL = "HIDE_REVOKE_ALL_USER_SESSIONS_MODAL";

/**
 * Generic interface to handle all sessions revoke modal visibility actions.
 */
export interface ToggleRevokeAllUserSessionsModalVisibilityAction {
    type: typeof SHOW_REVOKE_ALL_USER_SESSIONS_MODAL | typeof HIDE_REVOKE_ALL_USER_SESSIONS_MODAL;
}

/**
 * Action type to show the session revoke confirmation modal when revoking a single sessions.
 *
 * @type {string}
 */
export const SHOW_REVOKE_USER_SESSION_MODAL = "SHOW_REVOKE_USER_SESSION_MODAL";

/**
 * Action type to hide the session revoke confirmation modal when revoking a single sessions.
 *
 * @type {string}
 */
export const HIDE_REVOKE_USER_SESSION_MODAL = "HIDE_REVOKE_USER_SESSION_MODAL";

/**
 * Generic interface to handle a single sessions revoke modal visibility actions.
 */
export interface ToggleRevokeUserSessionModalVisibilityAction {
    type: typeof SHOW_REVOKE_USER_SESSION_MODAL | typeof HIDE_REVOKE_USER_SESSION_MODAL;
}

/**
 * Action type to show a notification for the user sessions component.
 *
 * @type {string}
 */
export const SHOW_USER_SESSIONS_NOTIFICATION = "SHOW_USER_SESSIONS_NOTIFICATION";

/**
 * Action type to hide the notification for the user sessions component.
 *
 * @type {string}
 */
export const HIDE_USER_SESSIONS_NOTIFICATION = "HIDE_USER_SESSIONS_NOTIFICATION";

/**
 * Generic interface to handle user sessions notification action.
 */
export interface UserSessionsNotificationAction {
    payload: Notification;
    type: typeof SHOW_USER_SESSIONS_NOTIFICATION | typeof HIDE_USER_SESSIONS_NOTIFICATION;
}

/**
 * Action type to specify user sessions actions.
 */
export type UserSessionsActionTypes = FetchUserSessionsAction | UpdateUserSessionsAction |
    UserSessionsNotificationAction | SetSessionsListActiveIndexesAction | RevokeAllUserSessionsAction |
    RevokeUserSessionAction | ToggleRevokeAllUserSessionsModalVisibilityAction |
    ToggleRevokeUserSessionModalVisibilityAction | SetEditingUserSessionAction;
