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
    CommonConfigActionTypes,
    SetDeploymentConfigsActionInterface,
    SetFeatureConfigsActionInterface,
    SetI18nConfigsActionInterface,
    SetServiceResourceEndpointsActionInterface,
    SetUIConfigsActionInterface
} from "./types";

/**
 * Redux action to set the deployment configs.
 *
 * @param {T} configs - Deployment configs.
 *
 * @return {SetDeploymentConfigsActionInterface<T>} An action of type `SET_DEPLOYMENT_CONFIGS`
 */
export const setDeploymentConfigs = <T>(configs: T): SetDeploymentConfigsActionInterface<T> => ({
    payload: configs,
    type: CommonConfigActionTypes.SET_DEPLOYMENT_CONFIGS
});

/**
 * Redux action to set the service resource endpoints.
 *
 * @param {T} endpoints - Resource endpoints.
 *
 * @return {SetServiceResourceEndpointsActionInterface<T>} An action of type `SET_SERVICE_RESOURCE_ENDPOINTS`
 */
export const setServiceResourceEndpoints = <T>(endpoints: T): SetServiceResourceEndpointsActionInterface<T> => ({
    payload: endpoints,
    type: CommonConfigActionTypes.SET_SERVICE_RESOURCE_ENDPOINTS
});

/**
 * Redux action to set the app feature configs.
 *
 * @param {T} configs - Feature configs.
 *
 * @return {SetFeatureConfigsActionInterface<T>} An action of type `CommonConfigActionTypes.SET_FEATURE_CONFIGS`
 */
export const setFeatureConfigs = <T>(configs: T): SetFeatureConfigsActionInterface<T> => ({
    payload: configs,
    type: CommonConfigActionTypes.SET_FEATURE_CONFIGS
});

/**
 * Redux action to set the i18n configs.
 *
 * @param {T} configs - I18n configs.
 *
 * @return {SetI18nConfigsActionInterface<T>} An action of type `CommonConfigActionTypes.SET_I18N_CONFIGS`
 */
export const setI18nConfigs = <T>(configs: T): SetI18nConfigsActionInterface<T> => ({
    payload: configs,
    type: CommonConfigActionTypes.SET_I18N_CONFIGS
});

/**
 * Redux action to set the UI configs.
 *
 * @param {T} configs - UI configs.
 *
 * @return {SetUIConfigsActionInterface<T>} An action of type `CommonConfigActionTypes.SET_UI_CONFIGS`
 */
export const setUIConfigs = <T>(configs: T): SetUIConfigsActionInterface<T> => ({
    payload: configs,
    type: CommonConfigActionTypes.SET_UI_CONFIGS
});
