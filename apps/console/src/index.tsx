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

import "core-js/stable";
import "regenerator-runtime/runtime";
import { AuthParams, AuthProvider, SPAUtils } from "@asgardeo/auth-react";
import { AppConstants as CommonAppConstants } from "@wso2is/core/constants";
import { AuthenticateUtils as CommonAuthenticateUtils, ContextUtils, StringUtils } from "@wso2is/core/utils";
import axios from "axios";
import * as React from "react";
import { ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AuthenticateUtils } from "./features/authentication";
import { AppConstants, Config, PreLoader, store } from "./features/core";
import { ProtectedApp } from "./protected-app";
debugger
// Set the runtime config in the context.
ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());

if ((window.location.pathname !== AppConstants.getAppLoginPath())
    && (window.location.pathname !== AppConstants.getPaths().get("UNAUTHORIZED"))
    && (window.location.pathname !== AppConstants.getPaths().get("PAGE_NOT_FOUND")
    && (window.location.pathname !== AppConstants.getPaths().get("STORING_DATA_DISABLED")))) {
    CommonAuthenticateUtils.updateAuthenticationCallbackUrl(CommonAppConstants.CONSOLE_APP,
        window.location.pathname + window.location.hash);
}

const getAuthParams = (): Promise<AuthParams> => {
    if (!SPAUtils.hasAuthSearchParamsInURL() && process.env.NODE_ENV === "production") {

        const contextPath: string = window[ "AppUtils" ].getConfig().appBase
            ? `/${ StringUtils.removeSlashesFromPath(window[ "AppUtils" ].getConfig().appBase) }`
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

/**
 * Render root compoent with configs.
 *
 * @returns {ReactElement}
 */
const RootWithConfig = (): ReactElement => {

    const [ ready, setReady ] = React.useState(false);

    React.useEffect(() => {
        if (AuthenticateUtils.getInitializeConfig()?.baseUrl) {
            setReady(true);

            return;
        }

        setReady(false);
    }, [ AuthenticateUtils.getInitializeConfig()?.baseUrl ]);

    if (!ready) {
        return <PreLoader />;
    }

    return (
        <Provider store={ store }>
            <BrowserRouter>
                <AuthProvider
                    config={ AuthenticateUtils.getInitializeConfig() }
                    fallback={ <PreLoader /> }
                    getAuthParams={ getAuthParams }
                >
                    <ProtectedApp />
                </AuthProvider>
            </BrowserRouter>
        </Provider>
    );
};

ReactDOM.render(<RootWithConfig />, document.getElementById("root"));
