/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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
 * Enum for common global action types.
 */
export enum CommonGlobalActionTypes {
    /**
     * Action type to show the top AJAX loading bar.
     */
    SHOW_AJAX_TOP_LOADING_BAR = "SHOW_AJAX_TOP_LOADING_BAR",
    /**
     * Action type to hide the top AJAX loading bar.
     */
    HIDE_AJAX_TOP_LOADING_BAR = "HIDE_GLOBAL_LOADER",
    /**
     * Action type to initialize the alert system.
     */
    INITIALIZE_ALERT_SYSTEM = "INITIALIZE_ALERT_SYSTEM",
    /**
     * Action type to add an alert.
     */
    ADD_ALERT = "ADD_ALERT",
    /**
     * Action type to set the supported languages.
     */
    SET_SUPPORTED_I18N_LANGUAGES = "SET_SUPPORTED_I18N_LANGUAGES",
    /**
     * Action type to set the mobile side panel visibility.
     */
    SET_MOBILE_SIDE_PANEL_VISIBILITY = "SET_MOBILE_SIDE_PANEL_VISIBILITY",
    /**
     * Action type to set the mobile side panel toggle(hamburger) visibility.
     */
    SET_MOBILE_SIDE_PANEL_TOGGLE_VISIBILITY = "SET_MOBILE_SIDE_PANEL_TOGGLE_VISIBILITY"
}

/**
 * Common global base action interface.
 */
interface CommonGlobalBaseAction {
    type: CommonGlobalActionTypes;
}

/**
 * Show AJAX top loading bar action interface.
 */
export interface ShowAJAXTopLoadingBarAction extends CommonGlobalBaseAction {
    type: CommonGlobalActionTypes.SHOW_AJAX_TOP_LOADING_BAR;
}

/**
 * Hide AJAX top loading bar action interface.
 */
export interface HideAJAXTopLoadingBarAction extends CommonGlobalBaseAction {
    type: CommonGlobalActionTypes.HIDE_AJAX_TOP_LOADING_BAR;
}

/**
 * Alert system initialize action interface.
 */
export interface InitializeAlertSystemAction<S = Record<string, unknown>> extends CommonGlobalBaseAction {
    payload: S;
    type: CommonGlobalActionTypes.INITIALIZE_ALERT_SYSTEM;
}

/**
 * Add alert action interface.
 */
export interface AddAlertAction<T = Record<string, unknown>> extends CommonGlobalBaseAction {
    payload: T;
    type: CommonGlobalActionTypes.ADD_ALERT;
}

/**
 * Set supported i18n languages action interface.
 */
export interface SetSupportedI18nLanguagesActionInterface <U = Record<string, unknown>>extends CommonGlobalBaseAction {
    payload: U;
    type: CommonGlobalActionTypes.SET_SUPPORTED_I18N_LANGUAGES;
}

/**
 * Set mobile side panel visibility action interface.
 */
export interface SetMobileSidePanelVisibility extends CommonGlobalBaseAction {
    payload: boolean,
    type: CommonGlobalActionTypes.SET_MOBILE_SIDE_PANEL_VISIBILITY;
}

/**
 * Set mobile side panel toggle(hamburger) visibility action interface.
 */
export interface SetMobileSidePanelToggleVisibility extends CommonGlobalBaseAction {
    payload: boolean,
    type: CommonGlobalActionTypes.SET_MOBILE_SIDE_PANEL_TOGGLE_VISIBILITY;
}

/**
 * Export action interfaces.
 */
export type CommonGlobalActions<T, S, U> = ShowAJAXTopLoadingBarAction
    | HideAJAXTopLoadingBarAction
    | AddAlertAction<T>
    | InitializeAlertSystemAction<S>
    | SetSupportedI18nLanguagesActionInterface<U>
    | SetMobileSidePanelVisibility
    | SetMobileSidePanelToggleVisibility;
