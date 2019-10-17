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

import { createEmptyNotification, Notification, UserSession, UserSessions } from "../../models";
import {
    FETCH_USER_SESSIONS,
    FetchUserSessionsAction,
    HIDE_REVOKE_ALL_USER_SESSIONS_MODAL,
    HIDE_REVOKE_USER_SESSION_MODAL,
    HIDE_USER_SESSIONS_NOTIFICATION,
    REVOKE_ALL_USER_SESSIONS,
    REVOKE_USER_SESSION,
    RevokeAllUserSessionsAction,
    RevokeUserSessionAction,
    SET_EDITING_USER_SESSION,
    SET_SESSIONS_LIST_ACTIVE_INDEXES,
    SetEditingUserSessionAction,
    SetSessionsListActiveIndexesAction,
    SHOW_REVOKE_ALL_USER_SESSIONS_MODAL,
    SHOW_REVOKE_USER_SESSION_MODAL,
    SHOW_USER_SESSIONS_NOTIFICATION,
    ToggleRevokeAllUserSessionsModalVisibilityAction,
    ToggleRevokeUserSessionModalVisibilityAction,
    UPDATE_USER_SESSIONS,
    UpdateUserSessionsAction,
    UserSessionsNotificationAction
} from "./types";

/**
 * Dispatches an action of type type `FETCH_USER_SESSIONS`.
 *
 * @return An action of type `FETCH_USER_SESSIONS`
 */
export const fetchUserSessions = (): FetchUserSessionsAction => ({
    type: FETCH_USER_SESSIONS
});

/**
 * Dispatches an action of type type `UPDATE_USER_SESSIONS`.
 *
 * @param {UserSessions} sessions - List of user sessions.
 * @return {UpdateUserSessionsAction} - Update user sessions action.
 */
export const updateUserSessions = (sessions: UserSessions): UpdateUserSessionsAction => ({
    payload: sessions,
    type: UPDATE_USER_SESSIONS
});

/**
 * Dispatches an action of type type `SET_EDITING_USER_SESSION`.
 *
 * @param {UserSession} session - Currently editing user session.
 * @returns {SetEditingUserSessionAction} - Set editing user session action.
 */
export const setEditingUserSession = (session: UserSession): SetEditingUserSessionAction => ({
    payload: session,
    type: SET_EDITING_USER_SESSION
});

/**
 * Dispatches an action of type type `REVOKE_ALL_USER_SESSIONS`.
 *
 * @return {RevokeAllUserSessionsAction} - Revoke all user sessions action.
 */
export const revokeAllUserSessions = (): RevokeAllUserSessionsAction => ({
    type: REVOKE_ALL_USER_SESSIONS
});

/**
 * Dispatches an action of type type `REVOKE_USER_SESSION`.
 *
 * @return {RevokeAllUserSessionsAction} - Revoke all user sessions action.
 */
export const revokeUserSession = (id: string): RevokeUserSessionAction => ({
    payload: id,
    type: REVOKE_USER_SESSION
});

/**
 * Dispatches an action of type type `SET_SESSIONS_LIST_ACTIVE_INDEXES`.
 *
 * @param {number[]} indexes - Active indexes array.
 * @return {SetSessionsListActiveIndexesAction} - Set session list active indexes action.
 */
export const setSessionsListActiveIndexes = (indexes: number[]): SetSessionsListActiveIndexesAction => ({
    payload: indexes,
    type: SET_SESSIONS_LIST_ACTIVE_INDEXES
});

/**
 * Dispatches an action of type `SHOW_USER_SESSIONS_NOTIFICATION` with the notification
 * details object as the payload.
 *
 * @param data - Notification object
 * @return An action of type `SHOW_USER_SESSIONS_NOTIFICATION`
 */
export const showUserSessionsNotification = (
    data: Notification
): UserSessionsNotificationAction => ({
    payload: data,
    type: SHOW_USER_SESSIONS_NOTIFICATION
});

/**
 * Dispatches an action of type `HIDE_USER_SESSIONS_NOTIFICATION`.
 *
 * @return An action of type `HIDE_USER_SESSIONS_NOTIFICATION`
 */
export const hideUserSessionsNotification = (
    data: Notification = createEmptyNotification()
): UserSessionsNotificationAction => ({
    payload: data,
    type: HIDE_USER_SESSIONS_NOTIFICATION
});

/**
 * Dispatches an action of type `SHOW_REVOKE_ALL_USER_SESSIONS_MODAL`.
 *
 * @returns {{type: string}} Returning action
 */
export const showRevokeAllUserSessionsModal = (): ToggleRevokeAllUserSessionsModalVisibilityAction => ({
    type: SHOW_REVOKE_ALL_USER_SESSIONS_MODAL
});

/**
 * Dispatches an action of type `HIDE_REVOKE_ALL_USER_SESSIONS_MODAL`.
 *
 * @return {{type: string}} Returning action
 */
export const hideRevokeAllUserSessionsModal = (): ToggleRevokeAllUserSessionsModalVisibilityAction => ({
    type: HIDE_REVOKE_ALL_USER_SESSIONS_MODAL
});

/**
 * Dispatches an action of type `SHOW_REVOKE_USER_SESSION_MODAL`.
 *
 * @returns {{type: string}} Returning action
 */
export const showRevokeUserSessionModal = (): ToggleRevokeUserSessionModalVisibilityAction => ({
    type: SHOW_REVOKE_USER_SESSION_MODAL
});

/**
 * Dispatches an action of type `HIDE_REVOKE_USER_SESSION_MODAL`.
 *
 * @return {{type: string}} Returning action
 */
export const hideRevokeUserSessionModal = (): ToggleRevokeUserSessionModalVisibilityAction => ({
    type: HIDE_REVOKE_USER_SESSION_MODAL
});
