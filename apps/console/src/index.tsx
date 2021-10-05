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

import { AuthParams, AuthProvider, SPAUtils } from "@asgardeo/auth-react";
import { setSupportedI18nLanguages } from "@wso2is/core/store";
import { ContextUtils, StringUtils } from "@wso2is/core/utils";
import {
    I18n,
    I18nInstanceInitException,
    I18nModuleConstants,
    LanguageChangeException,
    isLanguageSupported
} from "@wso2is/i18n";
import axios from "axios";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthenticateUtils } from "./features/authentication";
import { Config, PreLoader, store } from "./features/core";
import { ProtectedApp } from "./protected-app";
import "core-js/stable";
import "regenerator-runtime/runtime";

// Set the runtime config in the context.
ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());

// If `appBaseNameWithoutTenant` is "", avoids adding a forward slash.
const resolvedAppBaseNameWithoutTenant: string = StringUtils.removeSlashesFromPath(
    Config.getDeploymentConfig().appBaseNameWithoutTenant)
    ? `/${ StringUtils.removeSlashesFromPath(Config.getDeploymentConfig().appBaseNameWithoutTenant) }`
    : "";

const metaFileNames = I18nModuleConstants.META_FILENAME.split(".");
const metaFileName = `${ metaFileNames[ 0 ] }.${ process.env.metaHash }.${ metaFileNames[ 1 ] }`;

// Since the portals are not deployed per tenant, looking for static resources in tenant qualified URLs
// will fail. This constructs the path without the tenant, therefore it'll look for the file in
// `https://localhost:9443/<PORTAL>/resources/i18n/meta.json` rather than looking for the file in
// `https://localhost:9443/t/wso2.com/<PORTAL>/resources/i18n/meta.json`.
const metaPath = `${ resolvedAppBaseNameWithoutTenant }/
${ StringUtils.removeSlashesFromPath(Config.getI18nConfig().resourcePath) }/${ metaFileName }`;

// Fetch the meta file to get the supported languages and paths.
axios.get(metaPath)
    .then((response) => {
    // Set up the i18n module.
    I18n.init({
        ...Config.getI18nConfig(response?.data)?.initOptions,
        debug: window["AppUtils"].getConfig().debug
        },
        Config.getI18nConfig()?.overrideOptions,
        Config.getI18nConfig()?.langAutoDetectEnabled,
        Config.getI18nConfig()?.xhrBackendPluginEnabled)
        .then(() => {
                // Set the supported languages in redux store.
                store.dispatch(setSupportedI18nLanguages(response?.data));

                const isSupported = isLanguageSupported(I18n.instance.language, null, response?.data);

                if (!isSupported) {
                    I18n.instance.changeLanguage(I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE)
                        .catch((error) => {
                            throw new LanguageChangeException(I18nModuleConstants.DEFAULT_FALLBACK_LANGUAGE, error);
                        });
                }
            });
        })
        .catch((error) => {
            throw new I18nInstanceInitException(error);
        });

const getAuthParams = (): Promise<AuthParams> => {
    if (!SPAUtils.hasAuthSearchParamsInURL() && process.env.NODE_ENV === "production") {

        const contextPath: string = window[ "AppUtils" ].getConfig().appBase
            ? `/${ window[ "AppUtils" ].getConfig().appBase }`
            : "";

        return axios.get(contextPath + "/auth").then((response) => {
            return Promise.resolve({
                authorizationCode: response?.data?.authCode,
                sessionState: response?.data?.sessionState
            });
        });
    }

    return;
};

ReactDOM.render(
    (
        <Provider store={ store }>
            <BrowserRouter>
                <AuthProvider
                    config={ AuthenticateUtils.initializeConfig }
                    fallback={ <PreLoader /> }
                    getAuthParams={ getAuthParams }
                >
                    <ProtectedApp />
                </AuthProvider>
            </BrowserRouter>
        </Provider>
    ),
    document.getElementById("root")
);

// Accept HMR for updated modules
if (import.meta.webpackHot) {
    import.meta.webpackHot.accept();
}
