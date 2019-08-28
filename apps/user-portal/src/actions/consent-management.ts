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

import { ConsentInterface, ConsentReceiptInterface, ConsentState } from "../models/consents";
import { createEmptyNotificationActionPayload, NotificationActionPayload } from "../models/notifications";
import {
    ConsentManagementNotificationAction,
    FETCH_CONSENT_RECEIPT,
    FETCH_CONSENTED_APPS,
    FetchConsentedAppsAction,
    FetchConsentReceiptAction,
    HIDE_CONSENT_EDIT_VIEW,
    HIDE_CONSENT_MANAGEMENT_NOTIFICATION,
    HIDE_CONSENT_REVOKE_MODAL,
    REVOKE_CONSENTED_APP,
    RevokeConsentedAppAction,
    SET_CONSENT_RECEIPT,
    SET_CONSENTED_APPS_STATE,
    SET_EDITING_CONSENT,
    SetConsentedAppsStateAction,
    SetConsentReceiptAction,
    SetEditingConsentAction,
    SHOW_CONSENT_EDIT_VIEW,
    SHOW_CONSENT_MANAGEMENT_NOTIFICATION,
    SHOW_CONSENT_REVOKE_MODAL,
    ToggleConsentEditViewAction,
    ToggleConsentRevokeModalVisibilityAction,
    UPDATE_CONSENTED_APPS,
    UPDATE_CONSENTED_CLAIMS,
    UPDATE_REVOKED_CLAIM_IDS,
    UpdateConsentedAppsAction,
    UpdateConsentedClaimsAction,
    UpdateRevokedClaimIdsAction
} from "./types";

/**
 * Dispatches an action of type type `SET_CONSENTED_APPS_STATE`.
 *
 * @param {ConsentState} state - consent state ex: ACTIVE, REVOKED
 * @returns An action of type `FETCH_CONSENTED_APPS`
 */
export const setConsentedAppsState = (state: ConsentState): SetConsentedAppsStateAction => ({
    payload: state,
    type: SET_CONSENTED_APPS_STATE
});

/**
 * Dispatches an action of type type `FETCH_CONSENTED_APPS`.
 *
 * @returns An action of type `FETCH_CONSENTED_APPS`
 */
export const fetchConsentedApps = (): FetchConsentedAppsAction => ({
    type: FETCH_CONSENTED_APPS
});

/**
 * Dispatches an action of type type `UPDATE_CONSENTED_APPS`.
 *
 * @param {ConsentInterface[]} consentsList - List of consented applications.
 * @return {UpdateConsentedAppsAction} - Set consented apps action.
 */
export const updateConsentedApps = (consentsList: ConsentInterface[]): UpdateConsentedAppsAction => ({
    payload: consentsList,
    type: UPDATE_CONSENTED_APPS
});

/**
 * Dispatches an action of type type `SET_EDITING_CONSENT`.
 *
 * @param {ConsentInterface} consent - Currently editing consented application.
 * @returns {SetEditingConsentAction}
 */
export const setEditingConsent = (consent: ConsentInterface): SetEditingConsentAction => ({
    payload: consent,
    type: SET_EDITING_CONSENT
});

/**
 * Dispatches an action of type type `SET_CONSENT_RECEIPT`.
 *
 * @param {ConsentReceiptInterface} receipt - The consent receipt object.
 * @return {UpdateConsentedAppsAction} - Set consent receipt action.
 */
export const setConsentReceipt = (receipt: ConsentReceiptInterface): SetConsentReceiptAction => ({
    payload: receipt,
    type: SET_CONSENT_RECEIPT
});

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
 * Dispatches an action of type `UPDATE_CONSENTED_CLAIMS`.
 *
 * @param {ConsentReceiptInterface} receipt - Receipt object
 * @returns An action of type `UPDATE_CONSENTED_CLAIMS`
 */
export const updateConsentedClaim = (receipt: ConsentReceiptInterface): UpdateConsentedClaimsAction => ({
    payload: receipt,
    type: UPDATE_CONSENTED_CLAIMS
});

/**
 * Dispatches an action of type `UPDATE_REVOKED_CLAIM_IDS`.
 *
 * @param {ConsentReceiptInterface} claimIds - List of all the revoked claim ids
 * @returns {UpdateRevokedClaimIdsAction}
 */
export const updateRevokedClaimIds = (claimIds: number[]): UpdateRevokedClaimIdsAction => ({
    payload: claimIds,
    type: UPDATE_REVOKED_CLAIM_IDS
});

/**
 * Dispatches an action of type `SHOW_CONSENT_EDIT_VIEW`.
 *
 * @returns {{type: string}} Returning action
 */
export const showConsentEditView = (): ToggleConsentEditViewAction => ({
    type: SHOW_CONSENT_EDIT_VIEW
});

/**
 * Dispatches an action of type `HIDE_CONSENT_EDIT_VIEW`.
 *
 * @return {{type: string}} Returning action
 */
export const hideConsentEditView = (): ToggleConsentEditViewAction => ({
    type: HIDE_CONSENT_EDIT_VIEW
});

/**
 * Dispatches an action of type `SHOW_CONSENT_REVOKE_MODAL`.
 *
 * @returns {{type: string}} Returning action
 */
export const showConsentRevokeModal = (): ToggleConsentRevokeModalVisibilityAction => ({
    type: SHOW_CONSENT_REVOKE_MODAL
});

/**
 * Dispatches an action of type `HIDE_CONSENT_EDIT_VIEW`.
 *
 * @return {{type: string}} Returning action
 */
export const hideConsentRevokeModal = (): ToggleConsentRevokeModalVisibilityAction => ({
    type: HIDE_CONSENT_REVOKE_MODAL
});

/**
 * Dispatches an action of type `SHOW_CONSENT_MANAGEMENT_NOTIFICATION` with the notification
 * details object as the payload.
 *
 * @param data - Notification object
 * @returns An action of type `SHOW_CONSENT_MANAGEMENT_NOTIFICATION`
 */
export const showConsentManagementNotification = (
    data: NotificationActionPayload
): ConsentManagementNotificationAction => ({
    payload: data,
    type: SHOW_CONSENT_MANAGEMENT_NOTIFICATION
});

/**
 * Dispatches an action of type `HIDE_CONSENT_MANAGEMENT_NOTIFICATION`.
 *
 * @returns An action of type `HIDE_CONSENT_MANAGEMENT_NOTIFICATION`
 */
export const hideConsentManagementNotification = (
    data: NotificationActionPayload = createEmptyNotificationActionPayload()
): ConsentManagementNotificationAction => ({
    payload: data,
    type: HIDE_CONSENT_MANAGEMENT_NOTIFICATION
});
