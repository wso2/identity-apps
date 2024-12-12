/**
 * Copyright (c) 2020-2024, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
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
} from "./types/application";
import {
    ApplicationTemplateListItemInterface,
    OIDCApplicationConfigurationInterface,
    SAMLApplicationConfigurationInterface
} from "../../models/application";
import {
    AuthProtocolMetaListItemInterface,
    OIDCMetadataInterface,
    SupportedAuthProtocolMetaTypes
} from "../../models/application-inbound";

/**
 * Redux action to set the list of available inbound authentication protocols.
 *
 * @param meta - Inbound auth protocol meta.
 * @returns An action of type `SET_AVAILABLE_INBOUND_AUTH_PROTOCOL_META`
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
 * @param meta - Inbound auth protocol meta.
 *
 * @returns
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
 * @param protocol - The relevant auth protocol.
 * @param meta - Auth protocol metadata.
 * @returns An action of type `SET_AUTH_PROTOCOL_META`
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
 * @param templates - Application templates list.
 * @param isGrouped - Are the templates grouped.
 * @returns the Redux action payload to set the application templates
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
 * @returns An action of type
 * `ApplicationActionTypes.SET_OIDC_APPLICATION_CONFIGURATIONS`
 *
 * @param oidcConfigurations - OIDC configurations
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
 * @returns An action of type
 * `ApplicationActionTypes.SET_SAML_APPLICATION_CONFIGURATIONS`
 *
 * @param samlConfigurations - SAML configurations
 */
export const setSAMLApplicationConfigs = (
    samlConfigurations: SAMLApplicationConfigurationInterface
): SetSAMLApplicationConfigurationsActionInterface => ({
    payload: samlConfigurations,
    type: ApplicationActionTypes.SET_SAML_APPLICATION_CONFIGURATIONS
});
