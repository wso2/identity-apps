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
  AccountSecurityActionTypes,
  API_REQUEST_END,
  API_REQUEST_START,
  ApiActionTypes,
  CHANGE_PASSWORD,
  HIDE_CHANGE_PASSWORD_FORM_NOTIFICATION,
  SHOW_CHANGE_PASSWORD_FORM_NOTIFICATION
} from "../actions";
import { createEmptyNotificationActionPayload } from "../models/notifications";

/**
 * Initial state.
 */
const initialState = {
  changePasswordFormNotification: createEmptyNotificationActionPayload(),
  isChangePasswordRequestLoading: false
};

/**
 * Reducer to handle the state of account security related components.
 *
 * @param state - Previous state
 * @param action - Action type
 * @returns The new state
 */
export function accountRecoveryReducer(
    state = initialState, action: AccountSecurityActionTypes | ApiActionTypes
) {
  switch (action.type) {
    case API_REQUEST_START:
      if (action.payload === CHANGE_PASSWORD) {
        return {
          ...state,
          isChangePasswordRequestLoading: true
        };
      }
      return state;
    case API_REQUEST_END:
      if (action.payload === CHANGE_PASSWORD) {
        return {
          ...state,
          isChangePasswordRequestLoading: false
        };
      }
      return state;
    case SHOW_CHANGE_PASSWORD_FORM_NOTIFICATION:
      return {
        ...state,
        changePasswordFormNotification: action.payload
      };
    case HIDE_CHANGE_PASSWORD_FORM_NOTIFICATION:
      return {
        ...state,
        changePasswordFormNotification: action.payload
      };
    default:
      return state;
  }
}
