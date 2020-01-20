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

import { LinkedAccountInterface, ProfileSchemaInterface } from "../../../models";

/**
 * Enum for profile action types.
 *
 * @readonly
 * @enum {string}
 */
export enum ProfileActionTypes {
    /**
     * Action type to set the profile info.
     *
     * @type {string}
     */
    SET_PROFILE_INFO = "SET_PROFILE_INFO",
    /**
     * Action type to set the profile schem
     *
     * @type {string}
     */
    SET_PROFILE_SCHEMAS = "SET_PROFILE_SCHEMAS",
    /**
     * Action type to set the profile linked accounts.
     *
     * @type {string}
     */
    SET_PROFILE_LINKED_ACCOUNTS = "SET_PROFILE_LINKED_ACCOUNTS",
    /**
     * Action type to toggle if SCIM is enabled for a particular user store.
     *
     * @type {string}
     */
    TOGGLE_SCIM_ENABLED = "TOGGLE_SCIM_ENABLED"
}

/**
 * User profile base action interface.
 */
interface ProfileBaseActionInterface {
    type: ProfileActionTypes;
}

/**
 * Set profile info action interface.
 */
export interface SetProfileInfoActionInterface extends ProfileBaseActionInterface {
    payload: any;
    type: ProfileActionTypes.SET_PROFILE_INFO;
}

/**
 * Set profile schemas action interface.
 */
export interface SetProfileSchemasActionInterface extends ProfileBaseActionInterface {
    payload: ProfileSchemaInterface[];
    type: ProfileActionTypes.SET_PROFILE_SCHEMAS;
}

/**
 * Set profile linked accounts action interface.
 */
export interface SetProfileLinkedAccountsActionInterface extends ProfileBaseActionInterface {
    payload: LinkedAccountInterface[];
    type: ProfileActionTypes.SET_PROFILE_LINKED_ACCOUNTS;
}

/**
 * Action interface to handle if SCIM is enabled.
 */
export interface ToggleSCIMEnabledActionInterface extends ProfileBaseActionInterface {
    payload: boolean;
    type: ProfileActionTypes.TOGGLE_SCIM_ENABLED;
}

/**
 * Export action interfaces.
 */
export type ProfileActions = SetProfileInfoActionInterface
    | SetProfileSchemasActionInterface
    | SetProfileLinkedAccountsActionInterface
    | ToggleSCIMEnabledActionInterface;
