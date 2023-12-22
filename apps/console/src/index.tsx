/**
 * Copyright (c) 2020-2023, WSO2 LLC. (https://www.wso2.com).
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

import { AuthParams, AuthProvider, ResponseMode, SPAUtils } from "@asgardeo/auth-react";
import { ThemeProvider } from "@oxygen-ui/react/theme";
import { AppConfigProvider } from "@wso2is/common/src/providers/app-config-provider";
import { ContextUtils, StringUtils } from "@wso2is/core/utils";
import axios, { AxiosResponse } from "axios";
import * as React from "react";
import { ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { AsgardeoTheme } from "./branding/theme";
import { AuthenticateUtils } from "./features/authentication";
import { Config, PreLoader, store } from "./features/core";
import AppSettingsProvider from "./features/core/providers/app-settings-provider";
import OrganizationsProvider from "./features/organizations/providers/organizations-provider";
import { ProtectedApp } from "./protected-app";

// Set the runtime config in the context.
ContextUtils.setRuntimeConfig(Config.getDeploymentConfig());

const getAuthParams = (): Promise<AuthParams> => {
    if (!SPAUtils.hasAuthSearchParamsInURL()
        && Config.getDeploymentConfig()?.idpConfigs?.responseMode === ResponseMode.formPost) {

        const contextPath: string = window[ "AppUtils" ].getConfig().appBase
            ? `/${ StringUtils.removeSlashesFromPath(window[ "AppUtils" ].getConfig().appBase) }`
            : "";

        return axios.get(contextPath + "/auth").then((response: AxiosResponse ) => {
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
 * Render root component with configs.
 *
 * @returns Root element with configs.
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
        <AppSettingsProvider>
            <ThemeProvider theme={ AsgardeoTheme } defaultMode="light" modeStorageKey="console-oxygen-mode">
                <Provider store={ store }>
                    <BrowserRouter>
                        <AuthProvider
                            config={ AuthenticateUtils.getInitializeConfig() }
                            fallback={ <PreLoader /> }
                            getAuthParams={ getAuthParams }
                        >
                            <AppConfigProvider>
                                <OrganizationsProvider>
                                    <ProtectedApp />
                                </OrganizationsProvider>
                            </AppConfigProvider>
                        </AuthProvider>
                    </BrowserRouter>
                </Provider>
            </ThemeProvider>
        </AppSettingsProvider>
    );
};

const rootElement: HTMLElement = document.getElementById("root");

// Moved back to the legacy mode due to unpredictable state update issue.
// Tracked here: https://github.com/wso2/product-is/issues/14912
ReactDOM.render(<RootWithConfig />, rootElement);
