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
 * Global action types.
 */
export enum GlobalActionTypes {
    SHOW_GLOBAL_LOADER =  "SHOW_GLOBAL_LOADER",
    HIDE_GLOBAL_LOADER = "HIDE_GLOBAL_LOADER"
}

/**
 * Global base action interface.
 */
interface GlobalBaseAction {
    type: GlobalActionTypes;
}

/**
 * Show global loader action interface.
 */
export interface ShowGlobalLoaderAction extends GlobalBaseAction {
    type: GlobalActionTypes.SHOW_GLOBAL_LOADER;
}

/**
 * Hide global loader action interface.
 */
export interface HideGlobalLoaderAction extends GlobalBaseAction {
    type: GlobalActionTypes.HIDE_GLOBAL_LOADER;
}

/**
 * Export action interfaces.
 */
export type GlobalActions = ShowGlobalLoaderAction | HideGlobalLoaderAction;
