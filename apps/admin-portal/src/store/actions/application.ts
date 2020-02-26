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
    AuthProtocolMetaListItemInterface, OIDCMetadataInterface, SupportedAuthProtocolMetaTypes
} from "../../models";
import {
    ApplicationActionTypes,
    SetAuthProtocolMetaInterface,
    SetAvailableInboundProtocolsMetaInterface
} from "./types";

/**
 * Redux action to set the list of available inbound authentication protocols.
 *
 * @param {AuthProtocolMetaListItemInterface} meta - Inbound auth protocol meta.
 * @return {SetAvailableInboundProtocolsMetaInterface} An action of type `SET_AVAILABLE_INBOUND_AUTH_PROTOCOL_META`
 */
export const setAvailableInboundAuthProtocolMeta = (
    meta: AuthProtocolMetaListItemInterface[]
): SetAvailableInboundProtocolsMetaInterface => ({
    payload: meta,
    type: ApplicationActionTypes.SET_AVAILABLE_INBOUND_AUTH_PROTOCOL_META
});

/**
 * Redux action to set the auth protocol metadata.
 *
 * @param {SupportedAuthProtocolMetaTypes} protocol - The relevant auth protocol.
 * @param {OIDCMetadataInterface | any} meta - Auth protocol metadata.
 * @return {SetAuthProtocolMetaInterface} An action of type `SET_AUTH_PROTOCOL_META`
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const setAuthProtocolMeta = (
    protocol: SupportedAuthProtocolMetaTypes, meta: OIDCMetadataInterface | any
): SetAuthProtocolMetaInterface => ({
    payload: {
        [ protocol ]: meta
    },
    type: ApplicationActionTypes.SET_AUTH_PROTOCOL_META
});
