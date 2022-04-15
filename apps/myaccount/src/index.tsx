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

import { AuthParams, AuthProvider, SPAUtils } from "@asgardeo/auth-react";
import { ContextUtils } from "@wso2is/core/utils";
import { ContentLoader } from "@wso2is/react-components";
import axios from "axios";
import * as React from "react";
// tslint:disable:no-submodule-imports
import "react-app-polyfill/ie11";
import "react-app-polyfill/ie9";
import "react-app-polyfill/stable";
// tslint:enable
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PreLoader } from "./components";
import { Config } from "./configs";
import { ProtectedApp } from "./protected-app";
import { store } from "./store";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { getAuthInitializeConfig } from "./utils";

// Set the runtime config in the context.
ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());

const getAuthParams = (): Promise<AuthParams> => {
    if (!SPAUtils.hasAuthSearchParamsInURL() && process.env.NODE_ENV === "production") {

        const contextPath: string = window[ "AppUtils" ].getConfig().appBase
            ? `/${ window[ "AppUtils" ].getConfig().appBase }`
            : "";

        return axios.get(contextPath + "/auth").then((response) => {
            return Promise.resolve({
                authorizationCode: response?.data?.authCode,
                sessionState: response?.data?.sessionState,
                state: response?.data?.state
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
                    config={ getAuthInitializeConfig() }
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
