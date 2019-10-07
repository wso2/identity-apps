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

import { createEmptyNotification, createEmptyUserSession } from "../../models";
import {
    API_REQUEST_END,
    API_REQUEST_START,
    ApiActionTypes,
    FETCH_USER_SESSIONS,
    HIDE_REVOKE_ALL_USER_SESSIONS_MODAL,
    HIDE_REVOKE_USER_SESSION_MODAL,
    HIDE_USER_SESSIONS_NOTIFICATION,
    REVOKE_ALL_USER_SESSIONS,
    REVOKE_USER_SESSION,
    SET_EDITING_USER_SESSION,
    SET_SESSIONS_LIST_ACTIVE_INDEXES,
    SHOW_REVOKE_ALL_USER_SESSIONS_MODAL,
    SHOW_REVOKE_USER_SESSION_MODAL,
    SHOW_USER_SESSIONS_NOTIFICATION,
    UPDATE_USER_SESSIONS,
    UserSessionsActionTypes
} from "../actions/types";

/**
 * Initial state.
 */
const initialState = {
    editingUserSession: createEmptyUserSession(),
    isFetchUserSessionsRequestLoading: false,
    isRevokeAllUserSessionsModalVisible: false,
    isRevokeAllUserSessionsRequestLoading: false,
    isRevokeUserSessionModalVisible: false,
    isRevokeUserSessionRequestLoading: false,
    isSecurityWarningVisible: true,
    sessionsListActiveIndexes: [],
    userSessions: {},
    userSessionsNotification: createEmptyNotification(),
};

/**
 * Reducer to handle the state of user sessions component.
 *
 * @param state - Previous state
 * @param action - Action type
 * @returns The new state
 */
export function userSessionsReducer(
    state = initialState, action: UserSessionsActionTypes | ApiActionTypes
) {
    switch (action.type) {
        case API_REQUEST_START:
            if (action.payload === FETCH_USER_SESSIONS) {
                return {
                    ...state,
                    isFetchUserSessionsRequestLoading: true
                };
            }
            if (action.payload === REVOKE_ALL_USER_SESSIONS) {
                return {
                    ...state,
                    isRevokeAllUserSessionsRequestLoading: true
                };
            }
            if (action.payload === REVOKE_USER_SESSION) {
                return {
                    ...state,
                    isRevokeUserSessionRequestLoading: true
                };
            }
            return state;
        case API_REQUEST_END:
            if (action.payload === FETCH_USER_SESSIONS) {
                return {
                    ...state,
                    isFetchUserSessionsRequestLoading: false
                };
            }
            if (action.payload === REVOKE_ALL_USER_SESSIONS) {
                return {
                    ...state,
                    isRevokeAllUserSessionsRequestLoading: false
                };
            }
            if (action.payload === REVOKE_USER_SESSION) {
                return {
                    ...state,
                    isRevokeUserSessionRequestLoading: false
                };
            }
            return state;
        case UPDATE_USER_SESSIONS:
            return {
                ...state,
                userSessions: action.payload
            };
        case SET_EDITING_USER_SESSION:
            return {
                ...state,
                editingUserSession: action.payload
            };
        case SET_SESSIONS_LIST_ACTIVE_INDEXES:
            return {
                ...state,
                sessionsListActiveIndexes: action.payload
            };
        case SHOW_REVOKE_ALL_USER_SESSIONS_MODAL:
            return {
                ...state,
                isRevokeAllUserSessionsModalVisible: true
            };
        case HIDE_REVOKE_ALL_USER_SESSIONS_MODAL:
            return {
                ...state,
                isRevokeAllUserSessionsModalVisible: false
            };
        case SHOW_REVOKE_USER_SESSION_MODAL:
            return {
                ...state,
                isRevokeUserSessionModalVisible: true
            };
        case HIDE_REVOKE_USER_SESSION_MODAL:
            return {
                ...state,
                isRevokeUserSessionModalVisible: false
            };
        case SHOW_USER_SESSIONS_NOTIFICATION:
            return {
                ...state,
                isSecurityWarningVisible: false,
                userSessionsNotification: action.payload
            };
        case HIDE_USER_SESSIONS_NOTIFICATION:
            return {
                ...state,
                isSecurityWarningVisible: true,
                userSessionsNotification: action.payload
            };
        default:
            return state;
    }
}
