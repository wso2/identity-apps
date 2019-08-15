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

import { ConsentReceiptInterface, ConsentState } from "../models/consents";
import { createEmptyNotificationActionPayload, NotificationActionPayload } from "../models/notifications";

/**
 * Action type to handle the fetch consented applications action.
 *
 * @type {string}
 */
export const FETCH_CONSENTED_APPS = "FETCH_CONSENTED_APPS";

/**
 * Fetch consented applications action interface.
 */
interface FetchConsentedAppsAction {
    payload: ConsentState;
    type: typeof FETCH_CONSENTED_APPS;
}

/**
 * Dispatches an action of type type `FETCH_CONSENTED_APPS`.
 *
 * @param {ConsentState} state - consent state ex: ACTIVE, REVOKED
 * @returns An action of type `FETCH_CONSENTED_APPS`
 */
export const fetchConsentedApps = (state: ConsentState): FetchConsentedAppsAction => ({
    payload: state,
    type: FETCH_CONSENTED_APPS
});

/**
 * Action type to handle fetch consented apps `onSuccess` callback.
 *
 * @type {string}
 */
export const FETCH_CONSENTED_APPS_SUCCESS = "FETCH_CONSENTED_APPS_SUCCESS";

/**
 * Action type to fetch consented apps `onError` callback.
 *
 * @type {string}
 */
export const FETCH_CONSENTED_APPS_ERROR = "FETCH_CONSENTED_APPS_ERROR";

/**
 * Action type to handle the fetch consent receipt action.
 *
 * @type {string}
 */
export const FETCH_CONSENT_RECEIPT = "FETCH_CONSENT_RECEIPT";

/**
 * Fetch consent receipt action interface.
 */
interface FetchConsentReceiptAction {
    payload: string;
    type: typeof FETCH_CONSENT_RECEIPT;
}

/**
 * Dispatches an action of type `FETCH_CONSENT_RECEIPT`.
 *
 * @param {string} id - Receipt ID
 * @returns An action of type `FETCH_CONSENT_RECEIPT`
 */
export const fetchConsentReceipt = (id: string): FetchConsentReceiptAction => ({
    payload: id,
    type: FETCH_CONSENT_RECEIPT
});

/**
 * Action type to handle fetch consent receipt `onSuccess` callback.
 *
 * @type {string}
 */
export const FETCH_CONSENT_RECEIPT_SUCCESS = "FETCH_CONSENT_RECEIPT_SUCCESS";

/**
 * Action type to fetch consent receipt `onError` callback.
 *
 * @type {string}
 */
export const FETCH_CONSENT_RECEIPT_ERROR = "FETCH_CONSENT_RECEIPT_ERROR";

/**
 * Action type to handle the consented app revoke action.
 *
 * @type {string}
 */
export const REVOKE_CONSENTED_APP = "REVOKE_CONSENTED_APP";

/**
 * Revoke consented app action interface.
 */
interface RevokeConsentedAppAction {
    payload: string;
    type: typeof REVOKE_CONSENTED_APP;
}

/**
 * Dispatches an action of type `REVOKE_CONSENTED_APP`.
 *
 * @param {string} id - Receipt ID
 * @returns An action of type `REVOKE_CONSENTED_APP`
 */
export const revokeConsentedApp = (id: string): RevokeConsentedAppAction => ({
    payload: id,
    type: REVOKE_CONSENTED_APP
});

/**
 * Action type to handle consented app revoke `onSuccess` callback.
 *
 * @type {string}
 */
export const REVOKE_CONSENTED_APP_SUCCESS = "REVOKE_CONSENTED_APP_SUCCESS";

/**
 * Action type to handle consented app revoke `onError` callback.
 *
 * @type {string}
 */
export const REVOKE_CONSENTED_APP_ERROR = "REVOKE_CONSENTED_APP_ERROR";

/**
 * Action type to handle the consent claims update action.
 *
 * @type {string}
 */
export const UPDATE_CONSENTED_CLAIMS = "UPDATE_CONSENTED_CLAIMS";

/**
 * Update consented claims action interface.
 */
interface UpdateConsentedClaimsAction {
    payload: ConsentReceiptInterface;
    type: typeof UPDATE_CONSENTED_CLAIMS;
}

/**
 * Dispatches an action of type `UPDATE_CONSENTED_CLAIMS`.
 *
 * @param {ConsentReceiptInterface} receipt - Receipt object
 * @returns An action of type `UPDATE_CONSENTED_CLAIMS`
 */
export const updateConsentedClaims = (receipt: ConsentReceiptInterface): UpdateConsentedClaimsAction => ({
    payload: receipt,
    type: UPDATE_CONSENTED_CLAIMS
});

/**
 * Action type to handle consent claims update action's `onSuccess` callback.
 *
 * @type {string}
 */
export const UPDATE_CONSENTED_CLAIMS_SUCCESS = "UPDATE_CONSENTED_CLAIMS_SUCCESS";

/**
 * Action type to handle consent claims update action's `onError` callback.
 *
 * @type {string}
 */
export const UPDATE_CONSENTED_CLAIMS_ERROR = "UPDATE_CONSENTED_CLAIMS_ERROR";

/**
 * Action type to show a notification for the consents management component.
 *
 * @type {string}
 */
export const SHOW_CONSENTS_MANAGEMENT_NOTIFICATION = "SHOW_CONSENTS_MANAGEMENT_NOTIFICATION";

/**
 * Generic interface to handle consent management notification action.
 */
interface ConsentsManagementNotificationAction {
    payload: NotificationActionPayload;
    type: typeof SHOW_CONSENTS_MANAGEMENT_NOTIFICATION | typeof HIDE_CONSENTS_MANAGEMENT_NOTIFICATION;
}

/**
 * Dispatches an action of type `SHOW_CONSENTS_MANAGEMENT_NOTIFICATION` with the notification
 * details object as the payload.
 *
 * @param data - Notification object
 * @returns An action of type `SHOW_CONSENTS_MANAGEMENT_NOTIFICATION`
 */
export const showConsentsManagementNotification = (
    data: NotificationActionPayload
): ConsentsManagementNotificationAction => ({
    payload: data,
    type: SHOW_CONSENTS_MANAGEMENT_NOTIFICATION
});

/**
 * Action type to hide the notification for the consents management component.
 *
 * @type {string}
 */
export const HIDE_CONSENTS_MANAGEMENT_NOTIFICATION = "HIDE_CONSENTS_MANAGEMENT_NOTIFICATION";

/**
 * Dispatches an action of type `HIDE_CONSENTS_MANAGEMENT_NOTIFICATION`.
 *
 * @returns An action of type `HIDE_CONSENTS_MANAGEMENT_NOTIFICATION`
 */
export const hideConsentsManagementNotification = (
    data: NotificationActionPayload = createEmptyNotificationActionPayload()
) => ({
    payload: data,
    type: HIDE_CONSENTS_MANAGEMENT_NOTIFICATION
});

/**
 * Action type to specify consents management actions.
 */
export type ConsentsManagementActionTypes = FetchConsentedAppsAction | FetchConsentReceiptAction |
    RevokeConsentedAppAction | UpdateConsentedClaimsAction | ConsentsManagementNotificationAction;
