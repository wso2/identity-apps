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
    UninitializedI18nInstanceException,
    UnsupportedI18nFrameworkException
} from "./exceptions";
import { generateI18nOptions, getSupportedLanguages } from "./helpers";
import i18next, { InitOptions, Module, i18n as i18nInterface } from "i18next";
import { I18nModuleConstants } from "./constants";
import LanguageDetector from "i18next-browser-languagedetector";
import { SupportedLanguages } from "./models";
import { initReactI18next } from "react-i18next";

export enum SupportedI18nFrameworks {
    REACT = "react"
}

export class I18n {

    private static i18nInstance: i18nInterface = null;
    private static debug = false;

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    public static getInstance(): i18nInterface {

        if (!this.i18nInstance) {
            throw new UninitializedI18nInstanceException();
        }

        return this.i18nInstance;
    }

    public static init(options?: InitOptions, override?: boolean, plugins?: Module[], autoDetect?: boolean,
                       debug = false, framework: SupportedI18nFrameworks = SupportedI18nFrameworks.REACT) {

        this.i18nInstance = i18next;

        // If `autoDetect` flag is enabled, activate the language detector plugin.
        if (autoDetect) {
            this.i18nInstance.use(LanguageDetector);
        }

        // Activate the corresponding i18n framework.
        if (framework === SupportedI18nFrameworks.REACT) {
            this.i18nInstance.use(initReactI18next);
        } else {
            throw new UnsupportedI18nFrameworkException(framework);
        }

        this.i18nInstance.init(generateI18nOptions(options, override, debug))
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
        this.checkDetectedLanguage(this.i18nInstance.language);
    }

    public static getSupportedLanguages(): SupportedLanguages {
        return getSupportedLanguages();
    }

    public static checkDetectedLanguage(detectedLang: string) {

        let unSupportedLanguage = true;

        for (const lang of Object.keys(this.getSupportedLanguages())) {
            if (lang === detectedLang) {
                unSupportedLanguage = false;
                return;
            }
        }

        if (unSupportedLanguage) {
            this.i18nInstance.changeLanguage(I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE)
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
