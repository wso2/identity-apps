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

import { AuthenticateSessionUtil, AuthenticateUserKeys } from "@wso2is/authentication";
import { i18n, ServiceResourcesEndpoint } from "../../configs";
import {
    ConsentReceiptInterface,
    ConsentState,
    createEmptyNotification,
    HttpError,
    HttpRequestConfig,
    HttpResponse,
    Notification,
    UpdateReceiptInterface
} from "../../models";
import {
    apiRequest,
    fetchConsentedApps,
    setConsentReceipt,
    showConsentManagementNotification,
    updateConsentedApps
} from "../actions";
import {
    FETCH_CONSENT_RECEIPT,
    FETCH_CONSENT_RECEIPT_ERROR,
    FETCH_CONSENT_RECEIPT_SUCCESS,
    FETCH_CONSENTED_APPS,
    FETCH_CONSENTED_APPS_ERROR,
    FETCH_CONSENTED_APPS_SUCCESS,
    REVOKE_CONSENTED_APP,
    REVOKE_CONSENTED_APP_ERROR,
    REVOKE_CONSENTED_APP_SUCCESS,
    UPDATE_CONSENTED_CLAIMS,
    UPDATE_CONSENTED_CLAIMS_ERROR,
    UPDATE_CONSENTED_CLAIMS_SUCCESS,
} from "../actions/types";

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
    let notification: Notification = createEmptyNotification();

    if (error.response && error.response.data && error.response.data.detail) {
        notification = {
            description: i18n.t(
                "views:components.consentManagement.notifications.consentedAppsFetch.error.description",
                { description: error.response.data.detail }
            ),
            message: i18n.t("views:components.consentManagement.notifications.consentedAppsFetch.error.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    } else {
        // Generic error message
        notification = {
            description: i18n.t(
                "views:components.consentManagement.notifications.consentedAppsFetch.genericError.description"
            ),
            message: i18n.t("views:components.consentManagement.notifications.consentedAppsFetch.genericError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    }

    // Dispatch an action to show the notification.
    dispatch(showConsentManagementNotification(notification));
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
                method: "GET",
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
    let notification: Notification = createEmptyNotification();

    if (error.response && error.response.data && error.response.data.detail) {
        notification = {
            description: i18n.t(
                "views:components.consentManagement.notifications.consentReceiptFetch.error.description",
                { description: error.response.data.detail }
            ),
            message: i18n.t("views:components.consentManagement.notifications.consentReceiptFetch.error.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    } else {
        // Generic error message
        notification = {
            description: i18n.t(
                "views:components.consentManagement.notifications.consentReceiptFetch.genericError.description"
            ),
            message: i18n.t(
                "views:components.consentManagement.notifications.consentReceiptFetch.genericError.message"
            ),
            otherProps: {
                negative: true
            },
            visible: true
        };
    }

    // Dispatch an action to show the notification.
    dispatch(showConsentManagementNotification(notification));
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
                method: "DELETE",
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
        const notification: Notification = {
            description: i18n.t(
                "views:components.consentManagement.notifications.revokeConsentedApp.success.description"
            ),
            message: i18n.t(
                "views:components.consentManagement.notifications.revokeConsentedApp.success.message"
            ),
            otherProps: {
                positive: true
            },
            visible: true
        };

        // Dispatch actions to re-fetch the consented apps list and
        // to show a notification.
        dispatch(fetchConsentedApps());
        dispatch(showConsentManagementNotification(notification));
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
    let notification: Notification = createEmptyNotification();

    if (error.response && error.response.data && error.response.data.detail) {
        notification = {
            description: i18n.t(
                "views:components.consentManagement.notifications.revokeConsentedApp.error.description",
                { description: error.response.data.detail }
            ),
            message: i18n.t("views:components.consentManagement.notifications.revokeConsentedApp.error.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    } else {
        // Generic error message
        notification = {
            description: i18n.t(
                "views:components.consentManagement.notifications.revokeConsentedApp.genericError.description"
            ),
            message: i18n.t("views:components.consentManagement.notifications.revokeConsentedApp.genericError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    }

    // Dispatch an action to show the notification.
    dispatch(showConsentManagementNotification(notification));
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
                method: "POST",
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
        const notification: Notification = {
            description: i18n.t(
                "views:components.consentManagement.notifications.updateConsentedClaims.success.description"
            ),
            message: i18n.t(
                "views:components.consentManagement.notifications.updateConsentedClaims.success.message"
            ),
            otherProps: {
                positive: true
            },
            visible: true
        };

        // Dispatch actions to re-fetch the consented apps list and
        // to show a notification.
        dispatch(fetchConsentedApps());
        dispatch(showConsentManagementNotification(notification));
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
    let notification: Notification = createEmptyNotification();

    if (error.response && error.response.data && error.response.data.detail) {
        notification = {
            description: i18n.t(
                "views:components.consentManagement.notifications.updateConsentedClaims.error.description",
                { description: error.response.data.detail }
            ),
            message: i18n.t("views:components.consentManagement.notifications.updateConsentedClaims.error.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    } else {
        // Generic error message
        notification = {
            description: i18n.t(
                "views:components.consentManagement.notifications.updateConsentedClaims.genericError.description"
            ),
            message: i18n.t("views:components.consentManagement.notifications.updateConsentedClaims." +
                "genericError.message"),
            otherProps: {
                negative: true
            },
            visible: true
        };
    }

    // Dispatch an action to show the notification.
    dispatch(showConsentManagementNotification(notification));
};

export default [
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
