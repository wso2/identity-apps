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
    ConsentManagementActionTypes,
    FETCH_CONSENT_RECEIPT,
    FETCH_CONSENTED_APPS,
    HIDE_CONSENT_EDIT_VIEW,
    HIDE_CONSENT_MANAGEMENT_NOTIFICATION,
    HIDE_CONSENT_REVOKE_MODAL,
    REVOKE_CONSENTED_APP,
    SET_CONSENT_RECEIPT,
    SET_CONSENTED_APPS_STATE,
    SET_EDITING_CONSENT,
    SHOW_CONSENT_EDIT_VIEW,
    SHOW_CONSENT_MANAGEMENT_NOTIFICATION,
    SHOW_CONSENT_REVOKE_MODAL,
    UPDATE_CONSENTED_APPS,
    UPDATE_CONSENTED_CLAIMS,
    UPDATE_REVOKED_CLAIM_IDS
} from "../actions";
import { ConsentState, createEmptyConsent, createEmptyConsentReceipt } from "../models/consent-management";
import { createEmptyNotificationActionPayload } from "../models/notifications";

/**
 * Initial state.
 */
const initialState = {
    consentManagementNotification: createEmptyNotificationActionPayload(),
    consentReceipt: createEmptyConsentReceipt(),
    consentState: ConsentState.ACTIVE,
    consentedApps: [],
    editingConsent: createEmptyConsent(),
    isConsentEditViewVisible: false,
    isConsentRevokeModalVisible: false,
    isFetchConsentReceiptRequestLoading: false,
    isFetchConsentedAppsRequestLoading: false,
    isRevokeConsentedAppRequestLoading: false,
    isUpdateConsentedClaimsRequestLoading: false,
    revokedClaimIds: []
};

/**
 * Reducer to handle the state of consent management related components.
 *
 * @param state - Previous state
 * @param action - Action type
 * @returns The new state
 */
export function consentManagementReducer(
    state = initialState, action: ConsentManagementActionTypes | ApiActionTypes
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
        case SHOW_CONSENT_EDIT_VIEW:
            return {
                ...state,
                isConsentEditViewVisible: true
            };
        case HIDE_CONSENT_EDIT_VIEW:
            return {
                ...state,
                isConsentEditViewVisible: false
            };
        case SHOW_CONSENT_REVOKE_MODAL:
            return {
                ...state,
                isConsentRevokeModalVisible: true
            };
        case HIDE_CONSENT_REVOKE_MODAL:
            return {
                ...state,
                isConsentRevokeModalVisible: false
            };
        case SHOW_CONSENT_MANAGEMENT_NOTIFICATION:
            return {
                ...state,
                consentManagementNotification: action.payload
            };
        case HIDE_CONSENT_MANAGEMENT_NOTIFICATION:
            return {
                ...state,
                consentManagementNotification: action.payload
            };
        default:
            return state;
    }
}
