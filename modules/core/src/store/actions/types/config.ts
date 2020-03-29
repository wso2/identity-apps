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
    SET_DEPLOYMENT_CONFIGS = "SET_DEPLOYMENT_CONFIGS"
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
 * Export action interfaces.
 */
export type CommonConfigActions<T> = SetDeploymentConfigsActionInterface<T>;
