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

import { AuthenticateSessionUtil, AuthenticateUserKeys } from "@wso2is/authenticate";
import { ServiceResourcesEndpoint } from "../../configs";
import { i18n } from "../../helpers";
import { createEmptyNotification, HttpError, HttpRequestConfig, HttpResponse, Notification } from "../../models";
import { apiRequest, showChangePasswordFormNotification } from "../actions";
import { CHANGE_PASSWORD, CHANGE_PASSWORD_ERROR, CHANGE_PASSWORD_SUCCESS } from "../actions/types";

const SCHEMAS = ["urn:ietf:params:scim:api:messages:2.0:PatchOp"];

/**
 * Intercepts and handles actions of type `CHANGE_PASSWORD`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleChangePassword = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== CHANGE_PASSWORD) {
        return;
    }

    const { currentPassword, newPassword } = action.payload;
    const requestConfig: HttpRequestConfig = {
        auth: {
            password: currentPassword,
            username: AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.USERNAME)
        },
        data: {
            Operations: [
                {
                    op: "add",
                    value: {
                        password: newPassword
                    }
                }
            ],
            schemas: SCHEMAS
        },
        dispatcher: CHANGE_PASSWORD,
        headers: {
            "Content-Type": "application/json"
        },
        method: "patch",
        onError: CHANGE_PASSWORD_ERROR,
        onSuccess: CHANGE_PASSWORD_SUCCESS,
        url: ServiceResourcesEndpoint.me
    };

    // Dispatch an API request action.
    dispatch(apiRequest(requestConfig));
};

/**
 * Intercepts and handles actions of type `CHANGE_PASSWORD_SUCCESS`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleOnChangePasswordSuccess = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== CHANGE_PASSWORD_SUCCESS) {
        return;
    }

    const response: HttpResponse = action.payload;

    if (response.status && response.status === 200) {
        const notification: Notification = {
            description: i18n.t(
                "views:changePassword.forms.passwordResetForm.validations.submitSuccess.description"
            ),
            message: i18n.t(
                "views:changePassword.forms.passwordResetForm.validations.submitSuccess.message"
            ),
            otherProps: {
                positive: true
            },
            visible: true
        };

        // Dispatch an action to show the notification.
        dispatch(showChangePasswordFormNotification(notification));
    }
};

/**
 * Intercepts and handles actions of type `CHANGE_PASSWORD_ERROR`.
 *
 * @remarks
 * The API currently doesn't validate the current password of the user.
 * As a workaround change password API request is made with basic authorization.
 * If the current password is invalid, the server responds with a `401` status.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleOnChangePasswordError = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== CHANGE_PASSWORD_ERROR) {
        return;
    }

    const error: HttpError = action.payload;
    let notification: Notification = createEmptyNotification();

    // Invalid current password error is caught here.
    // Axios throws a generic `Network Error` for 401 status. As a temporary solution,
    // a check to see if a response is available has be used.
    if (!error || !error.response || error.response.status === 401) {
        notification = {
            description: i18n.t(
                "views:changePassword.forms.passwordResetForm.validations.invalidCurrentPassword." +
                "description"
            ),
            message: i18n.t(
                "views:changePassword.forms.passwordResetForm.validations.invalidCurrentPassword." +
                "message"
            ),
            otherProps: {
                negative: true
            },
            visible: true
        };
    } else if (error.response && error.response.data && error.response.data.detail) {
        notification = {
            description: i18n.t(
                "views:changePassword.forms.passwordResetForm.validations.submitError.description",
                { description: error.response.data.detail }
            ),
            message: i18n.t("views:changePassword.forms.passwordResetForm.validations.submitError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    } else {
        // Generic error message
        notification = {
            description: i18n.t(
                "views:changePassword.forms.passwordResetForm.validations.genericError.description"
            ),
            message: i18n.t("views:changePassword.forms.passwordResetForm.validations.genericError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    }

    // Dispatch an action to show the notification.
    dispatch(showChangePasswordFormNotification(notification));
};

export const changePasswordMiddleware = [
    handleChangePassword,
    handleOnChangePasswordSuccess,
    handleOnChangePasswordError
];
