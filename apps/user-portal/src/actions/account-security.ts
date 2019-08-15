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

import { NotificationActionPayload } from "../models/notifications";

/**
 * Action type to handle the password change.
 *
 * @type {string}
 */
export const CHANGE_PASSWORD = "CHANGE_PASSWORD";

/**
 * Change password action payload interface.
 */
interface ChangePasswordActionPayload {
    currentPassword: string;
    newPassword: string;
}

/**
 * Change password action interface.
 */
interface ChangePasswordAction {
    payload: ChangePasswordActionPayload;
    type: typeof CHANGE_PASSWORD;
}

/**
 * Dispatches an action of type type `CHANGE_PASSWORD` with the current password and
 * new password as the payload.
 *
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns An action of type `CHANGE_PASSWORD`
 */
export const changePassword = (currentPassword: string, newPassword: string): ChangePasswordAction => ({
    payload: { currentPassword, newPassword },
    type: CHANGE_PASSWORD
});

/**
 * Action type to handle password change `onSuccess` callback.
 *
 * @type {string}
 */
export const CHANGE_PASSWORD_SUCCESS = "CHANGE_PASSWORD_SUCCESS";

/**
 * Action type to handle password change `onError` callback.
 *
 * @type {string}
 */
export const CHANGE_PASSWORD_ERROR = "CHANGE_PASSWORD_ERROR";

/**
 * Action type to show a notification for the change password form.
 *
 * @type {string}
 */
export const SHOW_CHANGE_PASSWORD_FORM_NOTIFICATION = "SHOW_CHANGE_PASSWORD_FORM_NOTIFICATION";

/**
 * Change password form notification action interface.
 */
interface ShowChangePasswordFormNotificationAction {
    payload: NotificationActionPayload;
    type: typeof SHOW_CHANGE_PASSWORD_FORM_NOTIFICATION;
}

/**
 * Dispatches an action of type `SHOW_CHANGE_PASSWORD_FORM_NOTIFICATION` with the notification
 * details object as the payload.
 *
 * @param {NotificationActionPayload} data - Notification object
 * @returns An action of type `SHOW_CHANGE_PASSWORD_FORM_NOTIFICATION`
 */
export const showChangePasswordFormNotification = (
    data: NotificationActionPayload): ShowChangePasswordFormNotificationAction => ({
    payload: data,
    type: SHOW_CHANGE_PASSWORD_FORM_NOTIFICATION
});

/**
 * Action type to hide the notification for the change password form.
 *
 * @type {string}
 */
export const HIDE_CHANGE_PASSWORD_FORM_NOTIFICATION = "HIDE_CHANGE_PASSWORD_FORM_NOTIFICATION";

/**
 * Change password form notification action interface.
 */
interface HideChangePasswordFormNotificationAction {
    payload?: NotificationActionPayload;
    type: typeof HIDE_CHANGE_PASSWORD_FORM_NOTIFICATION;
}

/**
 * Dispatches an action of type `HIDE_CHANGE_PASSWORD_FORM_NOTIFICATION`.
 *
 * @returns An action of type `HIDE_CHANGE_PASSWORD_FORM_NOTIFICATION`
 */
export const hideChangePasswordFormNotification = (): HideChangePasswordFormNotificationAction => ({
    type: HIDE_CHANGE_PASSWORD_FORM_NOTIFICATION
});

/**
 * Action type to specify account security actions.
 */
export type AccountSecurityActionTypes = ChangePasswordAction | ShowChangePasswordFormNotificationAction |
    HideChangePasswordFormNotificationAction;
