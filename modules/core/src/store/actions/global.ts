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

import {
    AddAlertAction,
    CommonGlobalActionTypes,
    HideAJAXTopLoadingBarAction,
    InitializeAlertSystemAction,
    SetMobileSidePanelToggleVisibility,
    SetMobileSidePanelVisibility,
    SetSupportedI18nLanguagesActionInterface,
    ShowAJAXTopLoadingBarAction
} from "./types";

/**
 * Show AJAX top loading bar loader action.
 *
 * @returns AJAX Top Loading Bar showing action.
 */
export const showAJAXTopLoadingBar = (): ShowAJAXTopLoadingBarAction => ({
    type: CommonGlobalActionTypes.SHOW_AJAX_TOP_LOADING_BAR
});

/**
 * Hide AJAX top loading bar loader action.
 *
 * @returns AJAX Top Loading Bar hiding action.
 */
export const hideAJAXTopLoadingBar = (): HideAJAXTopLoadingBarAction => ({
    type: CommonGlobalActionTypes.HIDE_AJAX_TOP_LOADING_BAR
});

/**
 * Dispatches an action to initialize the alerting system.
 *
 * @param alertSystem - Alert system object.
 * @returns Alert system initialize action.
 */
export const initializeAlertSystem = <T = Record<string, unknown>>(alertSystem: T): InitializeAlertSystemAction<T> => ({
    payload: alertSystem,
    type: CommonGlobalActionTypes.INITIALIZE_ALERT_SYSTEM
});

/**
 * Dispatches an action to add a new alert.
 *
 * @param alert - Alert
 * @returns Add alert action.
 */
export const addAlert = <T = Record<string, unknown>>(alert: T): AddAlertAction<T> => ({
    payload: alert,
    type: CommonGlobalActionTypes.ADD_ALERT
});

/**
 * Redux action to set the supported i18n languages.
 *
 * @param languages - Supported i18n languages.
 * @returns Supported i18n language set action.
 */
export const setSupportedI18nLanguages = <T = Record<string, unknown>>(
    languages: T
): SetSupportedI18nLanguagesActionInterface<T> => ({
        payload: languages,
        type: CommonGlobalActionTypes.SET_SUPPORTED_I18N_LANGUAGES
    });

/**
 * Set mobile side panel visibility action.
 *
 * @param visibility - Visibility of the side panel.
 * @returns Mobile side panel showing action.
 */
export const setMobileSidePanelVisibility = (visibility: boolean): SetMobileSidePanelVisibility => ({
    payload: visibility,
    type: CommonGlobalActionTypes.SET_MOBILE_SIDE_PANEL_VISIBILITY
});

/**
 * Set mobile side panel toggle(hamburger) visibility action.
 *
 * @param visibility - Visibility of the side panel toggle.
 * @returns Mobile side panel toggle show/hide action.
 */
export const setMobileSidePanelToggleVisibility = (visibility: boolean): SetMobileSidePanelToggleVisibility => ({
    payload: visibility,
    type: CommonGlobalActionTypes.SET_MOBILE_SIDE_PANEL_TOGGLE_VISIBILITY
});
