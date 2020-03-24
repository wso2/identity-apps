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

import { ContextUtils, HttpUtils } from "@wso2is/core/utils";
import * as React from "react";
import * as ReactDOM from "react-dom";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app";
import { GlobalConfig } from "./configs";
import { onHttpRequestError, onHttpRequestFinish, onHttpRequestStart, onHttpRequestSuccess } from "./utils";
import {
    I18n,
    I18nInstanceInitException,
    I18nModuleConstants,
    isLanguageSupported,
    LanguageChangeException
} from "@wso2is/i18n";
import { store } from "./store";
import { setSupportedI18nLanguages } from "./store/actions";
import { StringUtils } from "@wso2is/core/utils";

// Set the runtime config in the context.
ContextUtils.setRuntimeConfig(GlobalConfig);

// Set up the Http client.
HttpUtils.setupHttpClient(true, onHttpRequestStart, onHttpRequestSuccess, onHttpRequestError, onHttpRequestFinish);

// Set up the i18n module.
I18n.init({
    ...GlobalConfig?.i18nModuleOptions?.initOptions,
    debug: GlobalConfig?.debug
    },
    GlobalConfig?.i18nModuleOptions?.overrideOptions,
    GlobalConfig?.i18nModuleOptions?.langAutoDetectEnabled,
    GlobalConfig?.i18nModuleOptions?.xhrBackendPluginEnabled)
    .then(() => {

        const metaPath = `/${ StringUtils.removeSlashesFromPath(GlobalConfig.appBaseName) }/${
            StringUtils.removeSlashesFromPath(GlobalConfig.i18nModuleOptions.resourcePath) }/meta.json`;

        // Fetch the meta file to get the supported languages.
        axios.get(metaPath)
            .then((response) => {
                // Set the supported languages in redux store.
                store.dispatch(setSupportedI18nLanguages(response?.data));

                const isSupported = isLanguageSupported(I18n.instance.language, null, response?.data);

                if (!isSupported) {
                    I18n.instance.changeLanguage(I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE)
                        .catch((error) => {
                            throw new LanguageChangeException(I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE, error)
                        })
                }
            })
    })
    .catch((error) => {
        throw new I18nInstanceInitException(error);
    });

ReactDOM.render(
    (
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    ),
    document.getElementById("root")
);

// Accept HMR for updated modules
if (module && module.hot) {
    module.hot.accept();
}
