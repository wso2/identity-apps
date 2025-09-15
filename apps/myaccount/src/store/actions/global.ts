/**
 * Copyright (c) 2019, WSO2 LLC. (https://www.wso2.com).
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

import { SupportedLanguagesMeta } from "@wso2is/i18n";
import {
    AddAlertAction,
    GlobalActionTypes,
    HideGlobalLoaderAction,
    InitializeAlertSystemAction,
    SetOpenAction,
    SetSupportedI18nLanguagesActionInterface,
    SetSupportedLocaleExtensionsActionInterface,
    ShowGlobalLoaderAction,
    ToggleApplicationsPageVisibilityAction
} from "./types";
import { AlertInterface } from "../../models";

/**
 * Show global loader action.
 *
 * @returns An action of type `SHOW_GLOBAL_LOADER`
 */
export const showGlobalLoader = (): ShowGlobalLoaderAction => ({
    type: GlobalActionTypes.SHOW_GLOBAL_LOADER
});

/**
 * Hide global loader action.
 *
 * @returns An action of type `HIDE_GLOBAL_LOADER`
 */
export const hideGlobalLoader = (): HideGlobalLoaderAction => ({
    type: GlobalActionTypes.HIDE_GLOBAL_LOADER
});

/**
 * Applications page visibility toggle action
 *
 * @returns An action of type `TOGGLE_APPLICATIONS_PAGE_VISIBILITY`
 */
export const toggleApplicationsPageVisibility = (visibility: boolean): ToggleApplicationsPageVisibilityAction => ({
    payload: visibility,
    type: GlobalActionTypes.TOGGLE_APPLICATIONS_PAGE_VISIBILITY
});

/**
 * Dispatches an action to initialize the alerting system.
 * @param alertSystem - Alert system object.
 * @returns an action to initialize the alerting system.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const initializeAlertSystem = (alertSystem: any): InitializeAlertSystemAction => ({
    payload: alertSystem,
    type: GlobalActionTypes.INITIALIZE_ALERT_SYSTEM
});

/**
 * Dispatches an action to add a new alert.
 * @param alert - Alert
 * @returns an action to add a new alert.
 */
export const addAlert = (alert: AlertInterface): AddAlertAction => ({
    payload: alert,
    type: GlobalActionTypes.ADD_ALERT
});

/**
 * Redux action to set the supported i18n languages.
 *
 * @param languages - Supported i18n languages.
 * @returns an action of type `SET_SUPPORTED_I18N_LANGUAGES`
 */
export const setSupportedI18nLanguages = (
    languages: SupportedLanguagesMeta
): SetSupportedI18nLanguagesActionInterface => ({
    payload: languages,
    type: GlobalActionTypes.SET_SUPPORTED_I18N_LANGUAGES
});

/**
 * Redux action to set the supported locale extensions.
 *
 * @param locales - Supported locale extensions.
 * @returns an action of type `SET_SUPPORTED_LOCALE_EXTENSIONS`
 */
export const setSupportedLocaleExtensions = (
    locales: SupportedLanguagesMeta
): SetSupportedLocaleExtensionsActionInterface => ({
    payload: locales,
    type: GlobalActionTypes.SET_SUPPORTED_LOCALE_EXTENSIONS
});

/**
 * Redux action to set an action to open.
 *
 * @param action - The action to set to open.
 */
export const setActiveForm = (action: string): SetOpenAction => ({
    payload: action,
    type: GlobalActionTypes.SET_OPEN_ACTION
});
