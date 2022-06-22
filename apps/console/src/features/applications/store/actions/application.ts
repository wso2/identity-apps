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
    ApplicationActionTypes,
    CheckAvailableCustomInboundProtocolsMetaInterface,
    SetApplicationTemplatesActionInterface,
    SetAuthProtocolMetaInterface,
    SetAvailableCustomInboundProtocolsMetaInterface,
    SetAvailableInboundProtocolsMetaInterface,
    SetOIDCApplicationConfigurationsActionInterface,
    SetSAMLApplicationConfigurationsActionInterface
} from "./types";
import {
    ApplicationTemplateListItemInterface,
    AuthProtocolMetaListItemInterface,
    OIDCApplicationConfigurationInterface,
    OIDCMetadataInterface,
    SAMLApplicationConfigurationInterface,
    SupportedAuthProtocolMetaTypes
} from "../../models";

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
 * Redux action to set the list of available custom inbound authentication protocols.
 *
 * @param {AuthProtocolMetaListItemInterface} meta - Inbound auth protocol meta.
 *
 * @return {SetAvailableCustomInboundProtocolsMetaInterface}
 * An action of type `SET_AVAILABLE_CUSTOM_INBOUND_AUTH_PROTOCOL_META`
 */
export const setAvailableCustomInboundAuthProtocolMeta = (
    meta: AuthProtocolMetaListItemInterface[]
): SetAvailableCustomInboundProtocolsMetaInterface => ({
    payload: meta,
    type: ApplicationActionTypes.SET_AVAILABLE_CUSTOM_INBOUND_AUTH_PROTOCOL_META
});

export const checkAvailableCustomInboundAuthProtocolMeta = (
    meta: boolean
): CheckAvailableCustomInboundProtocolsMetaInterface => ({
    payload: meta,
    type: ApplicationActionTypes.CHECK_CUSTOM_INBOUND_AUTH_PROTOCOL_META
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

/**
 * Redux action to set the application templates.
 *
 * @param {ApplicationTemplateListItemInterface[]} templates - Application templates list.
 * @param {boolean} isGrouped - Are the templates grouped.
 * @return {SetApplicationTemplatesActionInterface}
 */
export const setApplicationTemplates = (
    templates: ApplicationTemplateListItemInterface[],
    isGrouped?: boolean
): SetApplicationTemplatesActionInterface => ({
    payload: templates,
    type: isGrouped
        ? ApplicationActionTypes.SET_GROUPED_APPLICATION_TEMPLATES
        : ApplicationActionTypes.SET_APPLICATION_TEMPLATES
});

/**
 * Redux action to set the oidc application configurations.
 *
 *
 * @return {OIDCApplicationConfigurationInterface} An action of type
 * `ApplicationActionTypes.SET_OIDC_APPLICATION_CONFIGURATIONS`
 *
 * @param oidcConfigurations
 */
export const setOIDCApplicationConfigs = (
    oidcConfigurations: OIDCApplicationConfigurationInterface
): SetOIDCApplicationConfigurationsActionInterface => ({
    payload: oidcConfigurations,
    type: ApplicationActionTypes.SET_OIDC_APPLICATION_CONFIGURATIONS
});

/**
 * Redux action to set the oidc application configurations.
 *
 *
 * @return {SAMLApplicationConfigurationInterface} An action of type
 * `ApplicationActionTypes.SET_SAML_APPLICATION_CONFIGURATIONS`
 *
 * @param samlConfigurations
 */
export const setSAMLApplicationConfigs = (
    samlConfigurations: SAMLApplicationConfigurationInterface
): SetSAMLApplicationConfigurationsActionInterface => ({
    payload: samlConfigurations,
    type: ApplicationActionTypes.SET_SAML_APPLICATION_CONFIGURATIONS
});
