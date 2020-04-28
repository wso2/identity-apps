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
 * Enum for common config action types.
 *
 * @readonly
 * @enum {string}
 */
export enum CommonConfigActionTypes {
    /**
     * Action type to set the deployment configs.
     *
     * @type {string}
     */
    SET_DEPLOYMENT_CONFIGS = "SET_DEPLOYMENT_CONFIGS",
    /**
     * Action type to set the feature configs for an application.
     *
     * @type {string}
     */
    SET_FEATURE_CONFIGS = "SET_FEATURE_CONFIGS",
    /**
     * Action type to set the i18n related configs.
     *
     * @type {string}
     */
    SET_I18N_CONFIGS = "SET_I18N_CONFIGS",
    /**
     * Action type to set the service resource endpoints.
     *
     * @type {string}
     */
    SET_SERVICE_RESOURCE_ENDPOINTS = "SET_SERVICE_RESOURCE_ENDPOINTS",
    /**
     * Action type to set the UI related configs.
     *
     * @type {string}
     */
    SET_UI_CONFIGS = "SET_UI_CONFIGS",
}

/**
 * Common config base action interface.
 */
export interface CommonConfigBaseActionInterface {
    type: CommonConfigActionTypes;
}

/**
 * Action interface to set the deployment configs.
 */
export interface SetDeploymentConfigsActionInterface<T = {}> extends CommonConfigBaseActionInterface {
    payload: T;
    type: CommonConfigActionTypes.SET_DEPLOYMENT_CONFIGS;
}

/**
 * Action interface to set the service resource endpoints.
 */
export interface SetServiceResourceEndpointsActionInterface<S = {}> extends CommonConfigBaseActionInterface {
    payload: S;
    type: CommonConfigActionTypes.SET_SERVICE_RESOURCE_ENDPOINTS;
}

/**
 * Action interface to set the app features config.
 */
export interface SetFeatureConfigsActionInterface<U = {}> extends CommonConfigBaseActionInterface {
    payload: U;
    type: CommonConfigActionTypes.SET_FEATURE_CONFIGS;
}

/**
 * Action interface to set the i18n configs.
 */
export interface SetI18nConfigsActionInterface<V = {}> extends CommonConfigBaseActionInterface {
    payload: V;
    type: CommonConfigActionTypes.SET_I18N_CONFIGS;
}

/**
 * Action interface to set the UI configs.
 */
export interface SetUIConfigsActionInterface<W = {}> extends CommonConfigBaseActionInterface {
    payload: W;
    type: CommonConfigActionTypes.SET_UI_CONFIGS;
}

/**
 * Export action interfaces.
 */
export type CommonConfigActions<T, S, U, V, W> = SetDeploymentConfigsActionInterface<T>
    | SetServiceResourceEndpointsActionInterface<S>
    | SetFeatureConfigsActionInterface<U>
    | SetI18nConfigsActionInterface<V>
    | SetUIConfigsActionInterface<W>;
