/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
    CommonProfileActionTypes,
    SetProfileInfoActionInterface,
    SetProfileLinkedAccountsActionInterface,
    SetProfileSchemasActionInterface,
    ToggleSCIMEnabledActionInterface
} from "./types";

/**
 * Redux action to set profile info.
 *
 * @param {T} info - Profile information.
 * @return {SetProfileInfoActionInterface<T>}
 */
export const setProfileInfo = <T = {}>(info: T): SetProfileInfoActionInterface<T> => ({
    payload: info,
    type: CommonProfileActionTypes.SET_PROFILE_INFO
});

/**
 * Redux action to set profile schemas.
 *
 * @param {T} schemas - Profile schemas.
 * @return {SetProfileSchemasActionInterface<T>}
 */
export const setSCIMSchemas = <T = {}>(schemas: T): SetProfileSchemasActionInterface<T> => ({
    payload: schemas,
    type: CommonProfileActionTypes.SET_PROFILE_SCHEMAS
});

/**
 * Redux action to set profile linked accounts.
 *
 * @param {T} accounts - Profile schemas.
 * @return {SetProfileSchemasActionInterface<T>}
 */
export const setProfileLinkedAccounts = <T = {}>(accounts: T): SetProfileLinkedAccountsActionInterface => ({
    payload: accounts,
    type: CommonProfileActionTypes.SET_PROFILE_LINKED_ACCOUNTS
});

/**
 * Redux action to toggle SCIM enabled.
 *
 * @param {boolean} isEnabled - Flag to determine if SCIM is enabled.
 * @return {ToggleSCIMEnabledActionInterface} An action of type `TOGGLE_SCIM_ENABLED`
 */
export const toggleSCIMEnabled = (isEnabled: boolean): ToggleSCIMEnabledActionInterface => ({
    payload: isEnabled,
    type: CommonProfileActionTypes.TOGGLE_SCIM_ENABLED
});
