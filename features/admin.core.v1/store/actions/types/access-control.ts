/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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


/**
 * Enum for Access Constol action types
 *
 * @readonly
 * @enum {string}
 */
export enum AccessControlActionType {
    /**
     * Action type to set the visibility of the developer tab.
     *
     * @type {string}
     */
    SET_DEVELOPER_VISIBILITY = "SET_DEVELOPER_VISIBILITY",
    /**
     * Action type to set the visibility of the manage tab.
     *
     * @type {string}
     */
    SET_MANAGE_VISIBILITY = "SET_MANAGE_VISIBILITY",
}

/**
 * Access control base action interface.
 */
interface AccessControlBaseActionInterface {
    type: AccessControlActionType;
}

export interface SetDevelopVisibilityActionInterface extends AccessControlBaseActionInterface {
    payload: boolean;
    type: AccessControlActionType.SET_DEVELOPER_VISIBILITY;
}

export interface SetManageVisibilityActionInterface extends AccessControlBaseActionInterface {
    payload: boolean;
    type: AccessControlActionType.SET_MANAGE_VISIBILITY;
}

/**
 * Export action interfaces.
 */
export type AccessControlActions = SetDevelopVisibilityActionInterface
    | SetManageVisibilityActionInterface;
