/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com).
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
    SetSupportedI18nLanguagesActionInterface,
    SetSupportedLocaleExtensionsActionInterface,
    ShowAJAXTopLoadingBarAction
} from "./types";

/**
 * Show AJAX top loading bar loader action.
 *
 * @returns Redux action of type `SHOW_AJAX_TOP_LOADING_BAR`.
 */
export const showAJAXTopLoadingBar = (): ShowAJAXTopLoadingBarAction => ({
    type: CommonGlobalActionTypes.SHOW_AJAX_TOP_LOADING_BAR
});

/**
 * Hide AJAX top loading bar loader action.
 *
 * @returns Redux action of type `HIDE_AJAX_TOP_LOADING_BAR`.
 */
export const hideAJAXTopLoadingBar = (): HideAJAXTopLoadingBarAction => ({
    type: CommonGlobalActionTypes.HIDE_AJAX_TOP_LOADING_BAR
});

/**
 * Dispatches an action to initialize the alerting system.
 *
 * @param alertSystem - Alert system object.
 * @returns Redux action of type `INITIALIZE_ALERT_SYSTEM`.
 */
export const initializeAlertSystem = <T = any>(
    alertSystem: T
): InitializeAlertSystemAction<T> => ({
        payload: alertSystem,
        type: CommonGlobalActionTypes.INITIALIZE_ALERT_SYSTEM
    });

/**
 * Dispatches an action to add a new alert.
 *
 * @param alert - Alert
 * @returns Redux action of type `ADD_ALERT`.
 */
export const addAlert = <T = Record<string, unknown>>(
    alert: T
): AddAlertAction<T> => ({
        payload: alert,
        type: CommonGlobalActionTypes.ADD_ALERT
    });

/**
 * Redux action to set the supported i18n languages.
 *
 * @param languages - Supported i18n languages.
 * @returns Redux action of type `SET_SUPPORTED_I18N_LANGUAGES`.
 */
export const setSupportedI18nLanguages = <T = Record<string, unknown>>(
    languages: T
): SetSupportedI18nLanguagesActionInterface<T> => ({
        payload: languages,
        type: CommonGlobalActionTypes.SET_SUPPORTED_I18N_LANGUAGES
    });

/**
 * Redux action to set the supported locale extensions.
 *
 * @param locales - Supported locale extensions.
 * @returns an action of type `SET_SUPPORTED_LOCALE_EXTENSIONS`
 */
export const setSupportedLocaleExtensions = <T = Record<string, unknown>>(
    languages: T
): SetSupportedLocaleExtensionsActionInterface<T> => ({
        payload: languages,
        type: CommonGlobalActionTypes.SET_SUPPORTED_LOCALE_EXTENSIONS
    });
