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

/**
 * Enum for identity provider action types.
 *
 * @readonly
 * @enum {string}
 */
import { FederatedAuthenticatorListItemInterface } from "../../../models";

export enum IdentityProviderActionTypes {
    /**
     * Action type to set the list of available authenticators.
     *
     * @type {string}
     */
    SET_AVAILABLE_AUTHENTICATOR_META = "SET_AVAILABLE_AUTHENTICATOR_META",
}

/**
 * Identity Provider base action interface.
 */
interface IdentityProviderBaseActionInterface {
    type: IdentityProviderActionTypes;
}

/**
 * Set the available authenticators action interface.
 */
export interface SetAvailableAuthenticatorsMetaInterface extends IdentityProviderBaseActionInterface {
    payload: FederatedAuthenticatorListItemInterface[];
    type: IdentityProviderActionTypes.SET_AVAILABLE_AUTHENTICATOR_META;
}

/**
 * Export action interfaces.
 */
export type IdentityProviderActions = SetAvailableAuthenticatorsMetaInterface;
