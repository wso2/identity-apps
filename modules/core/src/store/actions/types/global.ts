/**
 * Copyright (c) 2019, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
 * Enum for global action types.
 *
 * @readonly
 * @enum {string}
 */
import { AlertInterface } from "../../../models";

export enum GlobalActionTypes {
    /**
     * Action type to show the global loader.
     *
     * @type {string}
     */
    SHOW_GLOBAL_LOADER = "SHOW_GLOBAL_LOADER",
    /**
     * Action type to hide the global loader.
     *
     * @type {string}
     */
    HIDE_GLOBAL_LOADER = "HIDE_GLOBAL_LOADER",
    /**
     * Action type to initialize the alert system.
     *
     * @type {string}
     */
    INITIALIZE_ALERT_SYSTEM = "INITIALIZE_ALERT_SYSTEM",
    /**
     * Action type to add an alert.
     *
     * @type {string}
     */
    ADD_ALERT = "ADD_ALERT"
}

/**
 * Global base action interface.
 */
interface GlobalBaseAction {
    type: GlobalActionTypes;
}

/**
 * Action interface to show global loader.
 */
export interface ShowGlobalLoaderAction extends GlobalBaseAction {
    type: GlobalActionTypes.SHOW_GLOBAL_LOADER;
}

/**
 * Action interface to hide global loader.
 */
export interface HideGlobalLoaderAction extends GlobalBaseAction {
    type: GlobalActionTypes.HIDE_GLOBAL_LOADER;
}

/**
 * Action interface to initialize alert system.
 */
export interface InitializeAlertSystemAction extends GlobalBaseAction {
    payload: any;
    type: GlobalActionTypes.INITIALIZE_ALERT_SYSTEM;
}

/**
 * Add alert action interface.
 */
export interface AddAlertAction extends GlobalBaseAction {
    payload: AlertInterface;
    type: GlobalActionTypes.ADD_ALERT;
}

/**
 * Export action interfaces.
 */
export type GlobalActions = ShowGlobalLoaderAction
    | HideGlobalLoaderAction
    | InitializeAlertSystemAction
    | AddAlertAction;
