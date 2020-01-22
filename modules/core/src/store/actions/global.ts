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

import { AlertInterface } from "../../models";
import {
    AddAlertAction,
    GlobalActionTypes,
    HideGlobalLoaderAction,
    InitializeAlertSystemAction,
    ShowGlobalLoaderAction
} from "./types";

/**
 * Redux action to show global loader.
 *
 * @return {ShowGlobalLoaderAction} An action of type `SHOW_GLOBAL_LOADER`
 */
export const showGlobalLoader = (): ShowGlobalLoaderAction => ({
    type: GlobalActionTypes.SHOW_GLOBAL_LOADER
});

/**
 * Redux action to hide the global loader.
 *
 * @return {HideGlobalLoaderAction} An action of type `HIDE_GLOBAL_LOADER`
 */
export const hideGlobalLoader = (): HideGlobalLoaderAction => ({
    type: GlobalActionTypes.HIDE_GLOBAL_LOADER
});

/**
 * Redux action to initialize the alerting system.
 *
 * @param alertSystem - Alert system.
 * @return {InitializeAlertSystemAction} An action of type `INITIALIZE_ALERT_SYSTEM`
 */
export const initializeAlertSystem = (alertSystem: any): InitializeAlertSystemAction => ({
    payload: alertSystem,
    type: GlobalActionTypes.INITIALIZE_ALERT_SYSTEM
});

/**
 * Redux action to add a new alert.
 *
 * @param {AlertInterface} alert - Alert object.
 * @return {AddAlertAction} An action of type `ADD_ALERT`
 */
export const addAlert = (alert: AlertInterface): AddAlertAction => ({
    payload: alert,
    type: GlobalActionTypes.ADD_ALERT
});
