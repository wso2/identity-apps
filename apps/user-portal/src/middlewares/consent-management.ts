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
import {
    apiRequest,
    FETCH_CONSENT_RECEIPT,
    FETCH_CONSENT_RECEIPT_ERROR,
    FETCH_CONSENT_RECEIPT_SUCCESS,
    FETCH_CONSENTED_APPS,
    FETCH_CONSENTED_APPS_ERROR,
    FETCH_CONSENTED_APPS_SUCCESS,
    fetchConsentedApps,
    REVOKE_CONSENTED_APP,
    REVOKE_CONSENTED_APP_ERROR,
    REVOKE_CONSENTED_APP_SUCCESS,
    setConsentReceipt,
    showChangePasswordFormNotification,
    UPDATE_CONSENTED_CLAIMS,
    UPDATE_CONSENTED_CLAIMS_ERROR,
    UPDATE_CONSENTED_CLAIMS_SUCCESS,
    updateConsentedApps
} from "../actions";
import { ServiceResourcesEndpoint } from "../configs";
import i18n from "../helpers/i18n";
import { HttpError, HttpRequestConfig, HttpResponse } from "../models/api";
import { ConsentReceiptInterface, ConsentState, UpdateReceiptInterface } from "../models/consents";
import { createEmptyNotificationActionPayload, NotificationActionPayload } from "../models/notifications";

/**
 * Intercepts and handles actions of type `CHANGE_PASSWORD`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @param {any} getState - Current  redux store state.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleFetchConsentedApps = ({ dispatch, getState }) => (next) => (action) => {
    next(action);

    if (action.type !== FETCH_CONSENTED_APPS) {
        return;
    }

    AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const state: ConsentState = getState().consentManagement.consentState;
            const requestConfig: HttpRequestConfig = {
                data: {
                    piiPrincipalId: AuthenticateSessionUtil.getSessionParameter(AuthenticateUserKeys.USERNAME),
                    state
                },
                dispatcher: FETCH_CONSENTED_APPS,
                headers: {
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": CLIENT_HOST,
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                method: "GET",
                onError: FETCH_CONSENTED_APPS_ERROR,
                onSuccess: FETCH_CONSENTED_APPS_SUCCESS,
                url: ServiceResourcesEndpoint.consents
            };

            // Dispatch an API request action.
            dispatch(apiRequest(requestConfig));
        })
        .catch((error) => {
            throw new Error(`Failed to retrieve the access token - ${error}`);
        });
};

/**
 * Intercepts and handles actions of type `FETCH_CONSENTED_APPS_SUCCESS`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleFetchConsentedAppsSuccess = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== FETCH_CONSENTED_APPS_SUCCESS) {
        return;
    }

    const response: HttpResponse = action.payload;

    if (response.status && response.status === 200) {
        // Dispatch an action to show the notification.
        dispatch(updateConsentedApps(response.data));
    }
};

/**
 * Intercepts and handles actions of type `FETCH_CONSENTED_APPS_ERROR`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleFetchConsentedAppsError = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== FETCH_CONSENTED_APPS_ERROR) {
        return;
    }

    const error: HttpError = action.payload;
    let notification: NotificationActionPayload = createEmptyNotificationActionPayload();

    if (error.response && error.response.data && error.response.data.detail) {
        notification = {
            description: i18n.t(
                "views:consentManagement.notifications.consentedAppsFetchError.description",
                { description: error.response.data.detail }
            ),
            message: i18n.t("views:consentManagement.notifications.consentedAppsFetchError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    } else {
        // Generic error message
        notification = {
            description: i18n.t(
                "views:consentManagement.notifications.consentedAppsFetchGenericError.description"
            ),
            message: i18n.t("views:consentManagement.notifications.consentedAppsFetchGenericError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    }

    // Dispatch an action to show the notification.
    dispatch(showChangePasswordFormNotification(notification));
};

/**
 * Intercepts and handles actions of type `FETCH_CONSENT_RECEIPT`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleFetchConsentReceipt = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== FETCH_CONSENT_RECEIPT) {
        return;
    }

    AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const id: string = action.payload;
            const requestConfig: HttpRequestConfig = {
                dispatcher: FETCH_CONSENT_RECEIPT,
                headers: {
                    "Accept": "application/json",
                    "Access-Control-Allow-Origin": CLIENT_HOST,
                    "Authorization": `Bearer ${ token }`,
                    "Content-Type": "application/json"
                },
                method: "get",
                onError: FETCH_CONSENT_RECEIPT_ERROR,
                onSuccess: FETCH_CONSENT_RECEIPT_SUCCESS,
                url: ServiceResourcesEndpoint.receipts + `/${ id }`
            };

            // Dispatch an API request action.
            dispatch(apiRequest(requestConfig));
        })
        .catch((error) => {
            throw new Error(`Failed to retrieve the access token - ${error}`);
        });
};

/**
 * Intercepts and handles actions of type `FETCH_CONSENT_RECEIPT_SUCCESS`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleFetchConsentReceiptSuccess = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== FETCH_CONSENT_RECEIPT_SUCCESS) {
        return;
    }

    const response: HttpResponse = action.payload;

    if (response.status && response.status === 200) {
        // Dispatch an action to show the notification.
        dispatch(setConsentReceipt(response.data));
    }
};

/**
 * Intercepts and handles actions of type `FETCH_CONSENT_RECEIPT_ERROR`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleFetchConsentReceiptError = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== FETCH_CONSENT_RECEIPT_ERROR) {
        return;
    }

    const error: HttpError = action.payload;
    let notification: NotificationActionPayload = createEmptyNotificationActionPayload();

    if (error.response && error.response.data && error.response.data.detail) {
        notification = {
            description: i18n.t(
                "views:consentManagement.notifications.consentReceiptFetchError.description",
                { description: error.response.data.detail }
            ),
            message: i18n.t("views:consentManagement.notifications.consentReceiptFetchError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    } else {
        // Generic error message
        notification = {
            description: i18n.t(
                "views:consentManagement.notifications.consentReceiptFetchGenericError.description"
            ),
            message: i18n.t("views:consentManagement.notifications.consentReceiptFetchGenericError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    }

    // Dispatch an action to show the notification.
    dispatch(showChangePasswordFormNotification(notification));
};

/**
 * Intercepts and handles actions of type `REVOKE_CONSENTED_APP`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleRevokeConsentedApp = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== REVOKE_CONSENTED_APP) {
        return;
    }

    AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const id: string = action.payload;
            const requestConfig: HttpRequestConfig = {
                dispatcher: REVOKE_CONSENTED_APP,
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${ token }`
                },
                method: "delete",
                onError: REVOKE_CONSENTED_APP_ERROR,
                onSuccess: REVOKE_CONSENTED_APP_SUCCESS,
                url: ServiceResourcesEndpoint.receipts + `/${ id }`
            };

            // Dispatch an API request action.
            dispatch(apiRequest(requestConfig));
        })
        .catch((error) => {
            throw new Error(`Failed to retrieve the access token - ${error}`);
        });
};

/**
 * Intercepts and handles actions of type `REVOKE_CONSENTED_APP_SUCCESS`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleRevokeConsentedAppSuccess = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== REVOKE_CONSENTED_APP_SUCCESS) {
        return;
    }

    const response: HttpResponse = action.payload;

    if (response.status && response.status === 200) {
        const notification: NotificationActionPayload = {
            description: i18n.t(
                "views:consentManagement.notifications.revokeConsentedAppSuccess.description"
            ),
            message: i18n.t(
                "views:consentManagement.notifications.revokeConsentedAppSuccess.message"
            ),
            otherProps: {
                positive: true
            },
            visible: true
        };

        // Dispatch actions to re-fetch the consented apps list and
        // to show a notification.
        dispatch(fetchConsentedApps());
        dispatch(showChangePasswordFormNotification(notification));
    }
};

/**
 * Intercepts and handles actions of type `REVOKE_CONSENTED_APP_ERROR`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleRevokeConsentedAppError = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== REVOKE_CONSENTED_APP_ERROR) {
        return;
    }

    const error: HttpError = action.payload;
    let notification: NotificationActionPayload = createEmptyNotificationActionPayload();

    if (error.response && error.response.data && error.response.data.detail) {
        notification = {
            description: i18n.t(
                "views:consentManagement.notifications.revokeConsentedAppError.description",
                { description: error.response.data.detail }
            ),
            message: i18n.t("views:consentManagement.notifications.revokeConsentedAppError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    } else {
        // Generic error message
        notification = {
            description: i18n.t(
                "views:consentManagement.notifications.revokeConsentedAppGenericError.description"
            ),
            message: i18n.t("views:consentManagement.notifications.revokeConsentedAppGenericError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    }

    // Dispatch an action to show the notification.
    dispatch(showChangePasswordFormNotification(notification));
};

/**
 * Intercepts and handles actions of type `UPDATE_CONSENTED_CLAIMS`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleUpdateConsentedClaims = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== UPDATE_CONSENTED_CLAIMS) {
        return;
    }

    AuthenticateSessionUtil.getAccessToken()
        .then((token) => {
            const receipt: ConsentReceiptInterface = action.payload;
            const body: UpdateReceiptInterface = {
                collectionMethod: "Web Form - User Portal",
                jurisdiction: receipt.jurisdiction,
                language: receipt.language,
                policyURL: receipt.policyUrl,
                services: receipt.services.map((service) => ({
                    purposes: service.purposes.map((purpose) => ({
                        consentType: purpose.consentType,
                        piiCategory: purpose.piiCategory.map((category) => ({
                            piiCategoryId: category.piiCategoryId,
                            validity: category.validity
                        })),
                        primaryPurpose: purpose.primaryPurpose,
                        purposeCategoryId: [1],
                        purposeId: purpose.purposeId,
                        termination: purpose.termination,
                        thirdPartyDisclosure: purpose.thirdPartyDisclosure,
                        thirdPartyName: purpose.thirdPartyName
                    })),
                    service: service.service,
                    serviceDescription: service.serviceDescription,
                    serviceDisplayName: service.serviceDisplayName,
                    tenantDomain: service.tenantDomain
                }))
            };

            const requestConfig: HttpRequestConfig = {
                data: body,
                dispatcher: UPDATE_CONSENTED_CLAIMS,
                headers: {
                    "Accept": "application/json",
                    "Authorization": `Bearer ${ token }`,
                    "Content-Type": "application/json"
                },
                method: "post",
                onError: UPDATE_CONSENTED_CLAIMS_ERROR,
                onSuccess: UPDATE_CONSENTED_CLAIMS_SUCCESS,
                url: ServiceResourcesEndpoint.consents
            };

            // Dispatch an API request action.
            dispatch(apiRequest(requestConfig));
        })
        .catch((error) => {
            throw new Error(`Failed to retrieve the access token - ${error}`);
        });
};

/**
 * Intercepts and handles actions of type `UPDATE_CONSENTED_CLAIMS_SUCCESS`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleUpdateConsentedClaimsSuccess = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== UPDATE_CONSENTED_CLAIMS_SUCCESS) {
        return;
    }

    const response: HttpResponse = action.payload;

    if (response.status && response.status === 200) {
        const notification: NotificationActionPayload = {
            description: i18n.t(
                "views:consentManagement.notifications.updateConsentedClaimsSuccess.description"
            ),
            message: i18n.t(
                "views:consentManagement.notifications.updateConsentedClaimsSuccess.message"
            ),
            otherProps: {
                positive: true
            },
            visible: true
        };

        // Dispatch actions to re-fetch the consented apps list and
        // to show a notification.
        dispatch(fetchConsentedApps());
        dispatch(showChangePasswordFormNotification(notification));
    }
};

/**
 * Intercepts and handles actions of type `UPDATE_CONSENTED_CLAIMS_ERROR`.
 *
 * @param {any} dispatch - `dispatch` function from redux.
 * @returns {(next) => (action) => any} Passes the action to the next middleware
 */
const handleUpdateConsentedClaimsError = ({ dispatch }) => (next) => (action) => {
    next(action);

    if (action.type !== UPDATE_CONSENTED_CLAIMS_ERROR) {
        return;
    }

    const error: HttpError = action.payload;
    let notification: NotificationActionPayload = createEmptyNotificationActionPayload();

    if (error.response && error.response.data && error.response.data.detail) {
        notification = {
            description: i18n.t(
                "views:consentManagement.notifications.updateConsentedClaimsError.description",
                { description: error.response.data.detail }
            ),
            message: i18n.t("views:consentManagement.notifications.updateConsentedClaimsError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    } else {
        // Generic error message
        notification = {
            description: i18n.t(
                "views:consentManagement.notifications.updateConsentedClaimsGenericError.description"
            ),
            message: i18n.t("views:consentManagement.notifications.updateConsentedClaimsGenericError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    }

    // Dispatch an action to show the notification.
    dispatch(showChangePasswordFormNotification(notification));
};

export const consentManagementMiddleware = [
    handleFetchConsentedApps,
    handleFetchConsentedAppsSuccess,
    handleFetchConsentedAppsError,
    handleFetchConsentReceipt,
    handleFetchConsentReceiptSuccess,
    handleFetchConsentReceiptError,
    handleRevokeConsentedApp,
    handleRevokeConsentedAppError,
    handleRevokeConsentedAppSuccess,
    handleUpdateConsentedClaims,
    handleUpdateConsentedClaimsError,
    handleUpdateConsentedClaimsSuccess
];
