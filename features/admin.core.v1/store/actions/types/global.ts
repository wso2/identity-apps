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

import { AppViewTypes } from "../../../models";

/**
 * Enum for Global action types.
 */
export enum GlobalActionTypes {
    /**
     * Action type to set the current active view.
     *
     * @type {string}
     */
    SET_ACTIVE_VIEW = "SET_ACTIVE_VIEW"
}

/**
 * Global base action interface.
 */
interface GlobalBaseAction {
    type: GlobalActionTypes;
}

/**
 * Set the active view for the Console content.
 * ex: DEVELOPER, ADMIN etc.
 */
export interface SetActiveViewAction extends GlobalBaseAction {
    payload: AppViewTypes;
    type: GlobalActionTypes.SET_ACTIVE_VIEW;
}

/**
 * Export action interfaces.
 */
export type GlobalActions = SetActiveViewAction;
