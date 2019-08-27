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

import { createEmptyNotificationActionPayload, NotificationActionPayload } from "../models/notifications";
import {
    CHANGE_PASSWORD,
    ChangePasswordAction,
    ChangePasswordFormNotificationAction,
    HIDE_CHANGE_PASSWORD_FORM_NOTIFICATION,
    SHOW_CHANGE_PASSWORD_FORM_NOTIFICATION
} from "./types";

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
 * Dispatches an action of type `SHOW_CHANGE_PASSWORD_FORM_NOTIFICATION` with the notification
 * details object as the payload.
 *
 * @param {NotificationActionPayload} data - Notification object
 * @returns An action of type `SHOW_CHANGE_PASSWORD_FORM_NOTIFICATION`
 */
export const showChangePasswordFormNotification = (
    data: NotificationActionPayload
): ChangePasswordFormNotificationAction => ({
    payload: data,
    type: SHOW_CHANGE_PASSWORD_FORM_NOTIFICATION
});

/**
 * Dispatches an action of type `HIDE_CHANGE_PASSWORD_FORM_NOTIFICATION`.
 *
 * @returns An action of type `HIDE_CHANGE_PASSWORD_FORM_NOTIFICATION`
 */
export const hideChangePasswordFormNotification = (
    data: NotificationActionPayload = createEmptyNotificationActionPayload()
): ChangePasswordFormNotificationAction => ({
    payload: data,
    type: HIDE_CHANGE_PASSWORD_FORM_NOTIFICATION
});
