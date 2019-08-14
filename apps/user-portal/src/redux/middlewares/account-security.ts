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
import i18n from "../../helpers/i18n";
import {
    apiRequest,
    CHANGE_PASSWORD, CHANGE_PASSWORD_ERROR,
    CHANGE_PASSWORD_SUCCESS,
    onChangePasswordError,
    onChangePasswordSuccess,
    showChangePasswordFormNotification
} from "../actions";

/**
 * Middleware to intercept and handle account security related actions.
 */

const SCHEMAS = ["urn:ietf:params:scim:api:messages:2.0:PatchOp"];

/**
 * Intercepts and handles actions of type `CHANGE_PASSWORD`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleChangePassword = ({ dispatch }) => (next) => (action) => {
    if (action.type !== CHANGE_PASSWORD) {
        return next(action);
    }

    const { currentPassword, newPassword } = action.payload;
    const requestConfig = {
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
        method: "PATCH",
        onError: (error) => dispatch(onChangePasswordError(error)),
        onSuccess: (response) => dispatch(onChangePasswordSuccess(response)),
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
    if (action.type !== CHANGE_PASSWORD_SUCCESS) {
        return next(action);
    }

    const { response } = action.payload;

    if (response.status && response.status === 200) {
        const notification = {
            description: i18n.t(
                "views:changePassword.forms.passwordResetForm.validations.submitSuccess.description"
            ),
            message: i18n.t(
                "views:changePassword.forms.passwordResetForm.validations.submitSuccess.message"
            ),
            otherProps: {
                positive: true
            }
        };

        // Dispatch an action to show the notification.
        dispatch(showChangePasswordFormNotification(notification));
    }
};

/**
 * Intercepts and handles actions of type `CHANGE_PASSWORD_ERROR`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleOnChangePasswordError = ({ dispatch }) => (next) => (action) => {
    if (action.type !== CHANGE_PASSWORD_ERROR) {
        return next(action);
    }

    const { response } = action.payload;
    let notification = {};

    // Axios throws a generic `Network Error` for 401 status. As a temporary solution,
    // a check to see if a response is available has be used. TODO: Find a better solution.
    if (!response || response.status === 401) {
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
            }
        };
    } else if (response && response.data && response.data.detail) {

        notification = {
            description: i18n.t(
                "views:changePassword.forms.passwordResetForm.validations.submitError.description",
                {description: response.data.detail}
            ),
            message: i18n.t("views:changePassword.forms.passwordResetForm.validations.submitError.message"),
            otherProps: {
                negative: true
            }
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
            }
        };
    }

    // Dispatch an action to show the notification.
    dispatch(showChangePasswordFormNotification(notification));
};

export const accountSecurityMiddleware = [
    handleChangePassword,
    handleOnChangePasswordSuccess,
    handleOnChangePasswordError
];
