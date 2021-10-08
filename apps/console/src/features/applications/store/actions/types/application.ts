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
    ApplicationTemplateListItemInterface,
    AuthProtocolMetaListItemInterface, OIDCApplicationConfigurationInterface,
    OIDCMetadataInterface, SAMLApplicationConfigurationInterface
} from "../../../models";

/**
 * Enum for application action types.
 *
 * @readonly
 * @enum {string}
 */
export enum ApplicationActionTypes {
    /**
     * Action type to set the list of available inbound authentication protocols.
     *
     * @type {string}
     */
    SET_AVAILABLE_INBOUND_AUTH_PROTOCOL_META = "SET_AVAILABLE_INBOUND_AUTH_PROTOCOL_META",
    /**
     * Action type to set the list of available custom inbound authentication protocols.
     *
     * @type {string}
     */
    SET_AVAILABLE_CUSTOM_INBOUND_AUTH_PROTOCOL_META = "SET_AVAILABLE_CUSTOM_INBOUND_AUTH_PROTOCOL_META",
    /**
     * Action type to set  if available custom inbound authentication protocols set or not.
     *
     * @type {string}
     */
    CHECK_CUSTOM_INBOUND_AUTH_PROTOCOL_META = "CHECK_AVAILABLE_CUSTOM_INBOUND_AUTH_PROTOCOL_META",
    /**
     * Action type to set metadata related to auth protocol.
     *
     * @type {string}
     */
    SET_AUTH_PROTOCOL_META = "SET_AUTH_PROTOCOL_META",
    /**
     * Action type to set application templates.
     *
     * @type {string}
     */
    SET_APPLICATION_TEMPLATES = "SET_APPLICATION_TEMPLATES",
    /**
     * Action type to set grouped application templates.
     *
     * @type {string}
     */
    SET_GROUPED_APPLICATION_TEMPLATES = "SET_GROUPED_APPLICATION_TEMPLATES",
    /**
     * Action type to set oidc application configurations.
     *
     * @type {string}
     */
    SET_OIDC_APPLICATION_CONFIGURATIONS = "SET_OIDC_APPLICATION_CONFIGURATIONS",
    /**
     * Action type to set saml application configurations.
     *
     * @type {string}
     */
    SET_SAML_APPLICATION_CONFIGURATIONS = "SET_SAML_APPLICATION_CONFIGURATIONS"

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
 * Set the available custom inbound authentication protocols action interface.
 */
export interface SetAvailableCustomInboundProtocolsMetaInterface extends ApplicationBaseActionInterface {
    payload: AuthProtocolMetaListItemInterface[];
    type: ApplicationActionTypes.SET_AVAILABLE_CUSTOM_INBOUND_AUTH_PROTOCOL_META;
}

/**
 * Set the checked available custom inbound authentication protocols action interface.
 */
export interface CheckAvailableCustomInboundProtocolsMetaInterface extends ApplicationBaseActionInterface {
    payload: boolean;
    type: ApplicationActionTypes.CHECK_CUSTOM_INBOUND_AUTH_PROTOCOL_META;
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
 * Set application templates action interface.
 */
export interface SetApplicationTemplatesActionInterface extends ApplicationBaseActionInterface {
    payload: ApplicationTemplateListItemInterface[];
    type: ApplicationActionTypes.SET_APPLICATION_TEMPLATES | ApplicationActionTypes.SET_GROUPED_APPLICATION_TEMPLATES;
}

/**
 * Set oidc application configurations action interface.
 */
export interface SetOIDCApplicationConfigurationsActionInterface extends ApplicationBaseActionInterface {
    payload: OIDCApplicationConfigurationInterface;
    type: ApplicationActionTypes.SET_OIDC_APPLICATION_CONFIGURATIONS;
}

/**
 * Set saml application configurations action interface.
 */
export interface SetSAMLApplicationConfigurationsActionInterface extends ApplicationBaseActionInterface {
    payload: SAMLApplicationConfigurationInterface;
    type: ApplicationActionTypes.SET_SAML_APPLICATION_CONFIGURATIONS;
}

/**
 * Export action interfaces.
 */
export type ApplicationActions = CheckAvailableCustomInboundProtocolsMetaInterface
    | SetAvailableInboundProtocolsMetaInterface
    | SetAuthProtocolMetaInterface
    | SetApplicationTemplatesActionInterface
    | SetAvailableCustomInboundProtocolsMetaInterface
    | SetOIDCApplicationConfigurationsActionInterface
    | SetSAMLApplicationConfigurationsActionInterface;
