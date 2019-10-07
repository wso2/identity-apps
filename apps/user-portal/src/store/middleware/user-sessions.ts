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

import { AuthenticateSessionUtil } from "@wso2is/authenticate";
import { i18n, ServiceResourcesEndpoint } from "../../configs";
import { createEmptyNotification, HttpError, HttpRequestConfig, HttpResponse, Notification } from "../../models";
import { apiRequest, fetchUserSessions, showUserSessionsNotification, updateUserSessions } from "../actions";
import {
    FETCH_USER_SESSIONS,
    FETCH_USER_SESSIONS_ERROR,
    FETCH_USER_SESSIONS_SUCCESS,
    REVOKE_ALL_USER_SESSIONS,
    REVOKE_ALL_USER_SESSIONS_ERROR,
    REVOKE_ALL_USER_SESSIONS_SUCCESS,
    REVOKE_USER_SESSION, REVOKE_USER_SESSION_ERROR,
    REVOKE_USER_SESSION_SUCCESS
} from "../actions/types";

/**
 * Intercepts and handles actions of type `FETCH_USER_SESSIONS`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @param {any} getState - Current  redux store state.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleFetchUserSessions = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== FETCH_USER_SESSIONS) {
        return;
    }

    AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const requestConfig: HttpRequestConfig = {
                dispatcher: FETCH_USER_SESSIONS,
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${ token }`,
                },
                method: "GET",
                onError: FETCH_USER_SESSIONS_ERROR,
                onSuccess: FETCH_USER_SESSIONS_SUCCESS,
                url: ServiceResourcesEndpoint.sessions
            };

            // Dispatch an API request action.
            dispatch(apiRequest(requestConfig));
        })
        .catch((error) => {
            throw new Error(`Failed to retrieve the access token - ${error}`);
        });
};

/**
 * Intercepts and handles actions of type `FETCH_USER_SESSIONS_SUCCESS`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleFetchUserSessionsSuccess = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== FETCH_USER_SESSIONS_SUCCESS) {
        return;
    }

    const response: HttpResponse = action.payload;
    let notification: Notification = createEmptyNotification();

    if (response.status !== 200) {
        notification = {
            description: i18n.t(
                "views:userSessions.notifications.fetchSessions.genericError.description"
            ),
            message: i18n.t("views:userSessions.notifications.fetchSessions.genericError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
        // Dispatch an action to show the notification.
        dispatch(showUserSessionsNotification(notification));

        return;
    }

    // Update the user sessions list.
    dispatch(updateUserSessions(response.data));
};

/**
 * Intercepts and handles actions of type `FETCH_USER_SESSIONS_ERROR`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleFetchUserSessionsError = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== FETCH_USER_SESSIONS_ERROR) {
        return;
    }

    const error: HttpError = action.payload;
    let notification: Notification = createEmptyNotification();

    if (error.response && error.response.data && error.response.data.detail) {
        notification = {
            description: i18n.t(
                "views:userSessions.notifications.fetchSessions.error.description",
                { description: error.response.data.detail }
            ),
            message: i18n.t("views:userSessions.notifications.fetchSessions.error.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    } else {
        // Generic error message
        notification = {
            description: i18n.t(
                "views:userSessions.notifications.fetchSessions.genericError.description"
            ),
            message: i18n.t("views:userSessions.notifications.fetchSessions.genericError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    }

    // Dispatch an action to show the notification.
    dispatch(showUserSessionsNotification(notification));
};

/**
 * Intercepts and handles actions of type `REVOKE_ALL_USER_SESSIONS`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @param {any} getState - Current  redux store state.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleRevokeAllUserSessions = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== REVOKE_ALL_USER_SESSIONS) {
        return;
    }

    AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const requestConfig: HttpRequestConfig = {
                dispatcher: REVOKE_ALL_USER_SESSIONS,
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${ token }`,
                },
                method: "DELETE",
                onError: REVOKE_ALL_USER_SESSIONS_ERROR,
                onSuccess: REVOKE_ALL_USER_SESSIONS_SUCCESS,
                url: ServiceResourcesEndpoint.sessions
            };

            // Dispatch an API request action.
            dispatch(apiRequest(requestConfig));
        })
        .catch((error) => {
            throw new Error(`Failed to retrieve the access token - ${error}`);
        });
};

/**
 * Intercepts and handles actions of type `REVOKE_ALL_USER_SESSIONS_SUCCESS`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleRevokeAllUserSessionsSuccess = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== REVOKE_ALL_USER_SESSIONS_SUCCESS) {
        return;
    }

    const response: HttpResponse = action.payload;

    if (response.status && response.status === 204) {
        const notification: Notification = {
            description: i18n.t(
                "views:userSessions.notifications.revokeAllUserSessions.success.description"
            ),
            message: i18n.t(
                "views:userSessions.notifications.revokeAllUserSessions.success.message"
            ),
            otherProps: {
                positive: true
            },
            visible: true
        };

        // Dispatch actions to re-fetch the consented apps list and to show a notification.
        dispatch(fetchUserSessions());
        dispatch(showUserSessionsNotification(notification));
    }
};

/**
 * Intercepts and handles actions of type `REVOKE_ALL_USER_SESSIONS_ERROR`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleRevokeAllUserSessionsError = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== REVOKE_ALL_USER_SESSIONS_ERROR) {
        return;
    }

    const error: HttpError = action.payload;
    let notification: Notification = createEmptyNotification();

    if (error.response && error.response.data && error.response.data.detail) {
        notification = {
            description: i18n.t(
                "views:userSessions.notifications.revokeAllUserSessions.error.description",
                { description: error.response.data.detail }
            ),
            message: i18n.t("views:userSessions.notifications.revokeAllUserSessions.error.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    } else {
        // Generic error message
        notification = {
            description: i18n.t(
                "views:userSessions.notifications.revokeAllUserSessions.genericError.description"
            ),
            message: i18n.t("views:userSessions.notifications.revokeAllUserSessions.genericError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    }

    // Dispatch an action to show the notification.
    dispatch(showUserSessionsNotification(notification));
};

/**
 * Intercepts and handles actions of type `REVOKE_USER_SESSION`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @param {any} getState - Current  redux store state.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleRevokeUserSession = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== REVOKE_USER_SESSION) {
        return;
    }

    AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const requestConfig: HttpRequestConfig = {
                dispatcher: REVOKE_USER_SESSION,
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${ token }`,
                },
                method: "DELETE",
                onError: REVOKE_USER_SESSION_ERROR,
                onSuccess: REVOKE_USER_SESSION_SUCCESS,
                url: ServiceResourcesEndpoint.sessions + `/${ action.payload }`
            };

            // Dispatch an API request action.
            dispatch(apiRequest(requestConfig));
        })
        .catch((error) => {
            throw new Error(`Failed to retrieve the access token - ${error}`);
        });
};

/**
 * Intercepts and handles actions of type `REVOKE_USER_SESSION_SUCCESS`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleRevokeUserSessionSuccess = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== REVOKE_USER_SESSION_SUCCESS) {
        return;
    }

    const response: HttpResponse = action.payload;

    if (response.status && response.status === 204) {
        const notification: Notification = {
            description: i18n.t(
                "views:userSessions.notifications.revokeUserSession.success.description"
            ),
            message: i18n.t(
                "views:userSessions.notifications.revokeUserSession.success.message"
            ),
            otherProps: {
                positive: true
            },
            visible: true
        };

        // Dispatch actions to re-fetch the consented apps list and to show a notification.
        dispatch(fetchUserSessions());
        dispatch(showUserSessionsNotification(notification));
    }
};

/**
 * Intercepts and handles actions of type `REVOKE_USER_SESSION_ERROR`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleRevokeUserSessionError = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== REVOKE_USER_SESSION_ERROR) {
        return;
    }

    const error: HttpError = action.payload;
    let notification: Notification = createEmptyNotification();

    if (error.response && error.response.data && error.response.data.detail) {
        notification = {
            description: i18n.t(
                "views:userSessions.notifications.revokeUserSession.error.description",
                { description: error.response.data.detail }
            ),
            message: i18n.t("views:userSessions.notifications.revokeUserSession.error.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    } else {
        // Generic error message
        notification = {
            description: i18n.t(
                "views:userSessions.notifications.revokeUserSession.genericError.description"
            ),
            message: i18n.t("views:userSessions.notifications.revokeUserSession.genericError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    }

    // Dispatch an action to show the notification.
    dispatch(showUserSessionsNotification(notification));
};

export const userSessionsMiddleware = [
    handleFetchUserSessions,
    handleFetchUserSessionsSuccess,
    handleFetchUserSessionsError,
    handleRevokeAllUserSessions,
    handleRevokeAllUserSessionsSuccess,
    handleRevokeAllUserSessionsError,
    handleRevokeUserSession,
    handleRevokeUserSessionSuccess,
    handleRevokeUserSessionError
];
