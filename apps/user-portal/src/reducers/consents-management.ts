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

import {
    API_REQUEST_END,
    API_REQUEST_START,
    ApiActionTypes,
    ConsentsManagementActionTypes,
    FETCH_CONSENT_RECEIPT,
    FETCH_CONSENTED_APPS,
    HIDE_CONSENTS_EDIT_VIEW,
    HIDE_CONSENTS_MANAGEMENT_NOTIFICATION,
    HIDE_CONSENTS_REVOKE_MODAL,
    REVOKE_CONSENTED_APP,
    SET_CONSENT_RECEIPT,
    UPDATE_CONSENTED_APPS,
    SET_EDITING_CONSENT,
    SHOW_CONSENTS_EDIT_VIEW,
    SHOW_CONSENTS_MANAGEMENT_NOTIFICATION,
    SHOW_CONSENTS_REVOKE_MODAL,
    UPDATE_CONSENTED_CLAIMS,
    UPDATE_REVOKED_CLAIM_IDS,
    SET_CONSENTED_APPS_STATE
} from "../actions";
import { createEmptyNotificationActionPayload } from "../models/notifications";
import { ConsentState, createEmptyConsent, createEmptyConsentReceipt } from "../models/consents";

/**
 * Initial state.
 */
const initialState = {
    consentedApps: [],
    consentReceipt: createEmptyConsentReceipt(),
    consentState: ConsentState.ACTIVE,
    editingConsent: createEmptyConsent(),
    revokedClaimIds: [],
    isConsentEditViewVisible: false,
    isConsentRevokeModalVisible: false,
    consentsManagementNotification: createEmptyNotificationActionPayload(),
    isFetchConsentReceiptRequestLoading: false,
    isFetchConsentedAppsRequestLoading: false,
    isRevokeConsentedAppRequestLoading: false,
    isUpdateConsentedClaimsRequestLoading: false
};

/**
 * Reducer to handle the state of consents management related components.
 *
 * @param state - Previous state
 * @param action - Action type
 * @returns The new state
 */
export function consentsManagementReducer(
    state = initialState, action: ConsentsManagementActionTypes | ApiActionTypes
) {
    switch (action.type) {
        case API_REQUEST_START:
            if (action.payload === FETCH_CONSENTED_APPS) {
                return {
                    ...state,
                    isFetchConsentedAppsRequestLoading: true
                };
            } else if (action.payload === FETCH_CONSENT_RECEIPT) {
                return {
                    ...state,
                    isFetchConsentReceiptRequestLoading: true
                };
            } else if (action.payload === REVOKE_CONSENTED_APP) {
                return {
                    ...state,
                    isRevokeConsentedAppRequestLoading: true
                };
            } else if (action.payload === UPDATE_CONSENTED_CLAIMS) {
                return {
                    ...state,
                    isUpdateConsentedClaimsRequestLoading: true
                };
            }
            return state;
        case API_REQUEST_END:
            if (action.payload === FETCH_CONSENTED_APPS) {
                return {
                    ...state,
                    isFetchConsentedAppsRequestLoading: false
                };
            } else if (action.payload === FETCH_CONSENT_RECEIPT) {
                return {
                    ...state,
                    isFetchConsentReceiptRequestLoading: false
                };
            } else if (action.payload === REVOKE_CONSENTED_APP) {
                return {
                    ...state,
                    isRevokeConsentedAppRequestLoading: false
                };
            } else if (action.payload === UPDATE_CONSENTED_CLAIMS) {
                return {
                    ...state,
                    isUpdateConsentedClaimsRequestLoading: false
                };
            }
            return state;
        case SET_CONSENTED_APPS_STATE:
            return {
                ...state,
                consentState: action.payload
            };
        case UPDATE_CONSENTED_APPS:
            return {
                ...state,
                consentedApps: action.payload
            };
        case SET_EDITING_CONSENT:
            return {
                ...state,
                editingConsent: action.payload
            };
        case SET_CONSENT_RECEIPT:
            return {
                ...state,
                consentReceipt: action.payload
            };
        case UPDATE_REVOKED_CLAIM_IDS:
            return {
                ...state,
                revokedClaimIds: action.payload
            };
        case SHOW_CONSENTS_EDIT_VIEW:
            return {
                ...state,
                isConsentEditViewVisible: true
            };
        case HIDE_CONSENTS_EDIT_VIEW:
            return {
                ...state,
                isConsentEditViewVisible: false
            };
        case SHOW_CONSENTS_REVOKE_MODAL:
            return {
                ...state,
                isConsentRevokeModalVisible: true
            };
        case HIDE_CONSENTS_REVOKE_MODAL:
            return {
                ...state,
                isConsentRevokeModalVisible: false
            };
        case SHOW_CONSENTS_MANAGEMENT_NOTIFICATION:
            return {
                ...state,
                consentsManagementNotification: action.payload
            };
        case HIDE_CONSENTS_MANAGEMENT_NOTIFICATION:
            return {
                ...state,
                consentsManagementNotification: action.payload
            };
        default:
            return state;
    }
}
