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

import { UnsupportedI18nFrameworkException } from "./exceptions";
import { generateI18nOptions } from "./helpers";
import i18next, { InitOptions, Module, TFunction, i18n as i18nInterface } from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";

export enum SupportedI18nFrameworks {
    REACT = "react"
}

export class I18n {

    public static instance: i18nInterface = i18next;
    private static defaultFramework = SupportedI18nFrameworks.REACT;
    private static debug = false;

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Initializes the i18next instance.
     *
     * @param {i18next.InitOptions} options - Passed in init options.
     * @param {boolean} override - Should the passed in options replace the default.
     * @param {boolean} autoDetect - If autodetect plugin should be used or not.
     * @param {boolean} useBackend - If XHR back end plugin should be used or not.
     * @param {boolean} debug - If debug is enabled.
     * @param {SupportedI18nFrameworks} framework - The framework to use.
     * @param {i18next.Module[]} plugins - Other plugins to use.
     * @return {Promise<i18next.TFunction>} Init promise.
     */
    public static init(options?: InitOptions, override?: boolean, autoDetect?: boolean, useBackend?: boolean,
                       debug = this.debug, framework: SupportedI18nFrameworks = this.defaultFramework,
                       plugins?: Module[]): Promise<TFunction> {

        // If `autoDetect` flag is enabled, activate the language detector plugin.
        if (autoDetect) {
            this.instance.use(LanguageDetector);
        }

        // If `useBackend` flag is enabled, activate the XHR backend plugin.
        if (useBackend) {
            this.instance.use(XHR);
        }

        // Activate the corresponding i18n framework.
        if (framework === SupportedI18nFrameworks.REACT) {
            this.instance.use(initReactI18next);
        } else {
            throw new UnsupportedI18nFrameworkException(framework);
        }

        return this.instance.init(generateI18nOptions(options, override, debug))
    }
}
