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

/**
 * Profile action types.
 */
import { LinkedAccountInterface, ProfileCompletion } from "../../../models";

export enum ProfileActionTypes {
    SET_PROFILE_COMPLETION = "SET_PROFILE_COMPLETION",
    SET_PROFILE_LINKED_ACCOUNTS = "SET_PROFILE_LINKED_ACCOUNTS",
    TOGGLE_SCIM_ENABLED = "TOGGLE_SCIM_ENABLED"
}

/**
 * Profile base action interface.
 */
interface ProfileBaseAction {
    type: ProfileActionTypes;
}

/**
 * Profile base action interface with payload with type any.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ProfileBaseActionWithCommonPayload extends ProfileBaseAction {
    payload: any;
    type: ProfileActionTypes;
}

/**
 * Set profile completion action interface.
 */
export interface SetProfileCompletionAction extends ProfileBaseAction {
    payload: ProfileCompletion;
    type: ProfileActionTypes.SET_PROFILE_COMPLETION;
}

/**
 * Set profile linked accounts action interface.
 */
export interface SetProfileLinkedAccountsAction extends ProfileBaseAction {
    payload: LinkedAccountInterface[];
    type: ProfileActionTypes.SET_PROFILE_LINKED_ACCOUNTS;
}

/**
 * Action interface to handle if SCIM is enabled.
 */
export interface ToggleSCIMEnabledAction extends ProfileBaseAction {
    payload: boolean;
    type: ProfileActionTypes.TOGGLE_SCIM_ENABLED;
}

/**
 * Export action interfaces.
 */
export type ProfileActions = SetProfileCompletionAction
    | SetProfileLinkedAccountsAction
    | ToggleSCIMEnabledAction;
