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

import { ConsentInterface, ConsentReceiptInterface, ConsentState } from "../../models/consents";
import { NotificationActionPayload } from "../../models/notifications";

/**
 * Action type to handle the consented applications state i.e ACTIVE, REVOKED etc.
 *
 * @type {string}
 */
export const SET_CONSENTED_APPS_STATE = "SET_CONSENTED_APPS_STATE";

/**
 * Fetch consented applications action interface.
 */
export interface SetConsentedAppsStateAction {
    payload: ConsentState;
    type: typeof SET_CONSENTED_APPS_STATE;
}

/**
 * Action type to handle the fetch consented applications action.
 *
 * @type {string}
 */
export const FETCH_CONSENTED_APPS = "FETCH_CONSENTED_APPS";

/**
 * Fetch consented applications action interface.
 */
export interface FetchConsentedAppsAction {
    type: typeof FETCH_CONSENTED_APPS;
}

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
 * Action type to set the list of consented apps after the request succeeds.
 *
 * @type {string}
 */
export const UPDATE_CONSENTED_APPS = "UPDATE_CONSENTED_APPS";

/**
 * Set consented applications action interface.
 */
export interface UpdateConsentedAppsAction {
    payload: ConsentInterface[];
    type: typeof UPDATE_CONSENTED_APPS;
}

/**
 * Action type to set the currently editing consented application.
 *
 * @type {string}
 */
export const SET_EDITING_CONSENT = "SET_EDITING_CONSENT";

/**
 * Set editing consent action interface.
 */
export interface SetEditingConsentAction {
    payload: ConsentInterface;
    type: typeof SET_EDITING_CONSENT;
}

/**
 * Action type to set the selected consent receipt pulled from the API.
 *
 * @type {string}
 */
export const SET_CONSENT_RECEIPT = "SET_CONSENT_RECEIPT";

/**
 * Set consent receipt action interface.
 */
export interface SetConsentReceiptAction {
    payload: ConsentReceiptInterface;
    type: typeof SET_CONSENT_RECEIPT;
}

/**
 * Action type to handle the fetch consent receipt action.
 *
 * @type {string}
 */
export const FETCH_CONSENT_RECEIPT = "FETCH_CONSENT_RECEIPT";

/**
 * Fetch consent receipt action interface.
 */
export interface FetchConsentReceiptAction {
    payload: string;
    type: typeof FETCH_CONSENT_RECEIPT;
}

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
export interface RevokeConsentedAppAction {
    payload: string;
    type: typeof REVOKE_CONSENTED_APP;
}

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
export interface UpdateConsentedClaimsAction {
    payload: ConsentReceiptInterface;
    type: typeof UPDATE_CONSENTED_CLAIMS;
}

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
 * Action type to handle the consented claim toggles.
 *
 * @type {string}
 */
export const UPDATE_REVOKED_CLAIM_IDS = "UPDATE_REVOKED_CLAIM_IDS";

/**
 * Update revoked claim IDs action interface.
 */
export interface UpdateRevokedClaimIdsAction {
    payload: number[];
    type: typeof UPDATE_REVOKED_CLAIM_IDS;
}

/**
 * Action type to handle consent edit view visibility.
 *
 * @type {string}
 */
export const SHOW_CONSENT_EDIT_VIEW = "SHOW_CONSENT_EDIT_VIEW";

/**
 * Action type to handle consent edit view visibility.
 *
 * @type {string}
 */
export const HIDE_CONSENT_EDIT_VIEW = "HIDE_CONSENT_EDIT_VIEW";

/**
 * Generic interface to handle consent edit view visibility actions.
 */
export interface ToggleConsentEditViewAction {
    type: typeof SHOW_CONSENT_EDIT_VIEW | typeof HIDE_CONSENT_EDIT_VIEW;
}

/**
 * Action type to show the consent revoke confirmation modal.
 *
 * @type {string}
 */
export const SHOW_CONSENT_REVOKE_MODAL = "SHOW_CONSENT_REVOKE_MODAL";

/**
 * Action type to hide the consent revoke confirmation modal.
 *
 * @type {string}
 */
export const HIDE_CONSENT_REVOKE_MODAL = "HIDE_CONSENT_REVOKE_MODAL";

/**
 * Generic interface to handle consent edit view visibility actions.
 */
export interface ToggleConsentRevokeModalVisibilityAction {
    type: typeof SHOW_CONSENT_REVOKE_MODAL | typeof HIDE_CONSENT_REVOKE_MODAL;
}

/**
 * Action type to show a notification for the consent management component.
 *
 * @type {string}
 */
export const SHOW_CONSENT_MANAGEMENT_NOTIFICATION = "SHOW_CONSENT_MANAGEMENT_NOTIFICATION";

/**
 * Generic interface to handle consent management notification action.
 */
export interface ConsentManagementNotificationAction {
    payload: NotificationActionPayload;
    type: typeof SHOW_CONSENT_MANAGEMENT_NOTIFICATION | typeof HIDE_CONSENT_MANAGEMENT_NOTIFICATION;
}

/**
 * Action type to hide the notification for the consent management component.
 *
 * @type {string}
 */
export const HIDE_CONSENT_MANAGEMENT_NOTIFICATION = "HIDE_CONSENT_MANAGEMENT_NOTIFICATION";

/**
 * Action type to specify consent management actions.
 */
export type ConsentManagementActionTypes = FetchConsentedAppsAction | FetchConsentReceiptAction |
    RevokeConsentedAppAction | UpdateConsentedClaimsAction | ConsentManagementNotificationAction |
    UpdateConsentedAppsAction | SetConsentReceiptAction | ToggleConsentEditViewAction |
    ToggleConsentRevokeModalVisibilityAction | SetEditingConsentAction | UpdateRevokedClaimIdsAction |
    SetConsentedAppsStateAction;
