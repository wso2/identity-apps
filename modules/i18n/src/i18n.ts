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

import {
    I18nInstanceInitException,
    LanguageChangeException,
    UnsupportedI18nFrameworkException
} from "./exceptions";
import { generateI18nOptions, getSupportedLanguages } from "./helpers";
import i18next, { InitOptions, Module, i18n as i18nInterface } from "i18next";
import { I18nModuleConstants } from "./constants";
import LanguageDetector from "i18next-browser-languagedetector";
import XHR from "i18next-xhr-backend";
import { initReactI18next } from "react-i18next";

export enum SupportedI18nFrameworks {
    REACT = "react"
}

export class I18n {

    public static instance: i18nInterface = i18next;
    private static debug = false;

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    public static init(options?: InitOptions, override?: boolean, autoDetect?: boolean, useBackend?: boolean,
                       debug = false, framework: SupportedI18nFrameworks = SupportedI18nFrameworks.REACT,
                       plugins?: Module[]) {

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

        this.instance.init(generateI18nOptions(options, override, debug))
            .then((response) => {
                if (debug) {
                    // TODO: Implement a logger module and use here.
                    // eslint-disable-next-line no-console
                    console.log("i18n module initialized. - ", response);
                }
            })
            .catch((error) => {
                throw new I18nInstanceInitException(error);
            });

        // Check if the detected language is supported
        this.checkDetectedLanguage(this.instance.language);
    }

    private static checkDetectedLanguage(detectedLang: string) {

        let unSupportedLanguage = true;

        for (const lang of Object.keys(getSupportedLanguages())) {
            if (lang === detectedLang) {
                unSupportedLanguage = false;
                break;
            }
        }

        if (unSupportedLanguage) {
            this.instance.changeLanguage(I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE)
                .then(() => {
                    if (this.debug) {
                        // TODO: Implement a logger module and use here.
                        // eslint-disable-next-line no-console
                        console.log(`The detected language (${ detectedLang }) is not supported.
                        Falling back to default (${ I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE })`);
                    }
                })
                .catch((error) => {
                    throw new LanguageChangeException(detectedLang, error);
                });
        }
    }
}
