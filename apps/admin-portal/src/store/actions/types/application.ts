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
 * Enum for application action types.
 *
 * @readonly
 * @enum {string}
 */
import { AuthProtocolMetaListItemInterface, OIDCMetadataInterface } from "../../../models";

export enum ApplicationActionTypes {
    /**
     * Action type to set the list of available inbound authentication protocols.
     *
     * @type {string}
     */
    SET_AVAILABLE_INBOUND_AUTH_PROTOCOL_META = "SET_AVAILABLE_INBOUND_AUTH_PROTOCOL_META",
    /**
     * Action type to set metadata related to auth protocol.
     *
     * @type {string}
     */
    SET_AUTH_PROTOCOL_META = "SET_AUTH_PROTOCOL_META",
}

/**
 * Application base action interface.
 */
interface ApplicationBaseActionInterface {
    type: ApplicationActionTypes;
}

/**
 * Set the available inbound authentication protocols action interface.
 */
export interface SetAvailableInboundProtocolsMetaInterface extends ApplicationBaseActionInterface {
    payload: AuthProtocolMetaListItemInterface[];
    type: ApplicationActionTypes.SET_AVAILABLE_INBOUND_AUTH_PROTOCOL_META;
}

/**
 * Set the metadata related to the auth protocol action interface.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SetAuthProtocolMetaInterface extends ApplicationBaseActionInterface {
    payload: OIDCMetadataInterface | any;
    type: ApplicationActionTypes.SET_AUTH_PROTOCOL_META;
}

/**
 * Export action interfaces.
 */
export type ApplicationActions = SetAvailableInboundProtocolsMetaInterface
    | SetAuthProtocolMetaInterface;
